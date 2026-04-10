import httpx
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from dotenv import load_dotenv
import os

from models import Movie
from logger import get_logger

load_dotenv()

logger = get_logger(__name__)

DATASF_API_URL = os.getenv("DATASF_API_URL")
BATCH_SIZE = 1000


# ─── Fetch from DataSF API (paginated) ────────────────────────────────────────
async def fetch_all_movies_from_api() -> list[dict]:
    all_records = []
    offset = 0

    try:
        async with httpx.AsyncClient() as client:
            while True:
                url = f"{DATASF_API_URL}?$limit={BATCH_SIZE}&$offset={offset}"
                logger.info(f"Fetching movies from API: offset={offset}")

                response = await client.get(url, timeout=30.0)
                response.raise_for_status()

                batch = response.json()
                if not batch:
                    break

                all_records.extend(batch)
                logger.info(f"Fetched {len(batch)} records (total so far: {len(all_records)})")

                if len(batch) < BATCH_SIZE:
                    break

                offset += BATCH_SIZE
    except httpx.HTTPError as e:
        logger.error(f"HTTP error occurred while fetching movies from DataSF: {str(e)}")
        raise
    except Exception as e:
        logger.error(f"Unexpected error while fetching movies from DataSF: {str(e)}")
        raise

    logger.info(f"Total records successfully fetched from API: {len(all_records)}")
    return all_records


# ─── Sync movies into DB ───────────────────────────────────────────────────────
async def sync_movies(db: AsyncSession) -> int:
    logger.info("Checking movie synchronization status...")
    try:
        count_result = await db.execute(select(func.count()).select_from(Movie))
        existing_count = count_result.scalar()

        if existing_count > 0:
            logger.info(f"Movies already synced ({existing_count} records), skipping synchronization.")
            return existing_count

        logger.info("Starting initial movie synchronization from DataSF...")
        records = await fetch_all_movies_from_api()

        movies = [
            Movie(
                title=record.get("title"),
                release_year=int(record["release_year"]) if record.get("release_year") else None,
                locations=record.get("locations"),
                fun_facts=record.get("fun_facts"),
                production_company=record.get("production_company"),
                distributor=record.get("distributor"),
                director=record.get("director"),
                writer=record.get("writer"),
                actor_1=record.get("actor_1"),
                actor_2=record.get("actor_2"),
                actor_3=record.get("actor_3"),
                latitude=float(record["latitude"]) if record.get("latitude") else None,
                longitude=float(record["longitude"]) if record.get("longitude") else None,
                analysis_neighborhood=record.get("analysis_neighborhood"),
                supervisor_district=record.get("supervisor_district"),
            )
            for record in records
        ]

        db.add_all(movies)
        await db.commit()
        logger.info(f"Successfully synced {len(movies)} movies into Database.")
        return len(movies)
    except Exception as e:
        logger.error(f"Critical error during movie synchronization: {str(e)}")
        await db.rollback()
        raise


# ─── Get all movies ───────────────────────────────────────────────────────────
async def get_all_movies(
    db: AsyncSession, 
    year: str | None = None, 
    sort: str | None = None
) -> list[Movie]:
    logger.info(f"Fetching movies from database (year={year}, sort={sort})")
    try:
        stmt = select(Movie)
        
        # Apply year filter
        if year:
            if year == "older":
                stmt = stmt.where(Movie.release_year <= 1979)
            elif year.endswith("s"):
                start_year = int(year[:4])
                stmt = stmt.where(Movie.release_year >= start_year, Movie.release_year < start_year + 10)
        
        # Apply sorting
        if sort == "title_asc":
            stmt = stmt.order_by(Movie.title.asc())
        elif sort == "title_desc":
            stmt = stmt.order_by(Movie.title.desc())
        elif sort == "year_asc":
            stmt = stmt.order_by(Movie.release_year.asc())
        elif sort == "year_desc":
            stmt = stmt.order_by(Movie.release_year.desc())

        result = await db.execute(stmt)
        movies = result.scalars().all()
        logger.info(f"Successfully fetched {len(movies)} movies.")
        return movies
    except Exception as e:
        logger.error(f"Error fetching movies from database: {str(e)}")
        raise


# ─── Search movies ────────────────────────────────────────────────────────────
async def search_movies(
    query: str, 
    db: AsyncSession,
    year: str | None = None,
    sort: str | None = None
) -> list[Movie]:
    logger.info(f"Searching movies with query: '{query}' (year={year}, sort={sort})")
    try:
        filters = [
            Movie.title.ilike(f"%{query}%"),
            Movie.locations.ilike(f"%{query}%"),
            Movie.director.ilike(f"%{query}%"),
            Movie.actor_1.ilike(f"%{query}%"),
            Movie.actor_2.ilike(f"%{query}%"),
            Movie.actor_3.ilike(f"%{query}%"),
        ]

        if query.isdigit():
            filters.append(Movie.release_year == int(query))

        stmt = select(Movie).where(or_(*filters))

        # Apply year filter
        if year:
            if year == "older":
                stmt = stmt.where(Movie.release_year <= 1979)
            elif year.endswith("s"):
                start_year = int(year[:4])
                stmt = stmt.where(Movie.release_year >= start_year, Movie.release_year < start_year + 10)

        # Apply sorting
        if sort == "title_asc":
            stmt = stmt.order_by(Movie.title.asc())
        elif sort == "title_desc":
            stmt = stmt.order_by(Movie.title.desc())
        elif sort == "year_asc":
            stmt = stmt.order_by(Movie.release_year.asc())
        elif sort == "year_desc":
            stmt = stmt.order_by(Movie.release_year.desc())

        result = await db.execute(stmt)
        movies = result.scalars().all()
        logger.info(f"Search for '{query}' returned {len(movies)} results.")
        return movies
    except Exception as e:
        logger.error(f"Error searching movies with query '{query}': {str(e)}")
        raise
