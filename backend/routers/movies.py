from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas import MovieResponse
from services.movie_service import get_all_movies, search_movies

router = APIRouter(prefix="/movies", tags=["Movies"])


# ─── Get all movies ───────────────────────────────────────────────────────────
@router.get("", response_model=list[MovieResponse])
async def list_movies(
    year: str | None = Query(None),
    sort: str | None = Query(None),
    db: AsyncSession = Depends(get_db)
):
    return await get_all_movies(db, year, sort)


# ─── Search movies ────────────────────────────────────────────────────────────
@router.get("/search", response_model=list[MovieResponse])
async def search(
    q: str = Query(..., min_length=1),
    year: str | None = Query(None),
    sort: str | None = Query(None),
    db: AsyncSession = Depends(get_db)
):
    return await search_movies(q, db, year, sort)
