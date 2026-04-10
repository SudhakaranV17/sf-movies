from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload # early loading because in async we can't use lazy loading
from fastapi import HTTPException, status

from models import Favorite, Movie
from logger import get_logger

logger = get_logger(__name__)


# ─── Add Favorite ─────────────────────────────────────────────────────────────
async def add_favorite(user_id: int, movie_id: int, db: AsyncSession) -> Favorite:
    movie = await db.get(Movie, movie_id)
    if not movie:
        logger.warning(f"Add favorite failed - movie not found: movie_id={movie_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Movie not found")

    result = await db.execute(
        select(Favorite).where(Favorite.user_id == user_id, Favorite.movie_id == movie_id)
    )
    existing = result.scalar_one_or_none()
    if existing:
        logger.warning(f"Add favorite failed - already exists: user_id={user_id}, movie_id={movie_id}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Movie already in favorites")

    favorite = Favorite(user_id=user_id, movie_id=movie_id)
    db.add(favorite)
    await db.commit()
    await db.refresh(favorite)

    result = await db.execute(
        select(Favorite).where(Favorite.id == favorite.id).options(selectinload(Favorite.movie))
    )
    favorite = result.scalar_one()
    logger.info(f"Favorite added: user_id={user_id}, movie_id={movie_id}")
    return favorite


# ─── Remove Favorite ──────────────────────────────────────────────────────────
async def remove_favorite(user_id: int, movie_id: int, db: AsyncSession) -> None:
    result = await db.execute(
        select(Favorite).where(Favorite.user_id == user_id, Favorite.movie_id == movie_id)
    )
    favorite = result.scalar_one_or_none()
    if not favorite:
        logger.warning(f"Remove favorite failed - not found: user_id={user_id}, movie_id={movie_id}")
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Favorite not found")

    await db.delete(favorite)
    await db.commit()
    logger.info(f"Favorite removed: user_id={user_id}, movie_id={movie_id}")


# ─── Get User Favorites ───────────────────────────────────────────────────────
async def get_user_favorites(user_id: int, db: AsyncSession) -> list[Favorite]:
    result = await db.execute(
        select(Favorite)
        .where(Favorite.user_id == user_id)
        .options(selectinload(Favorite.movie))
    )
    favorites = result.scalars().all()
    logger.info(f"Fetched {len(favorites)} favorites for user_id={user_id}")
    return favorites
