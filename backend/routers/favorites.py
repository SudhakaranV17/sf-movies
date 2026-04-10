from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas import FavoriteCreate, FavoriteResponse
from services.favorite_service import add_favorite, remove_favorite, get_user_favorites
from routers.auth import get_current_user
from models import User

router = APIRouter(prefix="/favorites", tags=["Favorites"])


# ─── Get user favorites ───────────────────────────────────────────────────────
@router.get("", response_model=list[FavoriteResponse])
async def list_favorites(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await get_user_favorites(current_user.id, db)


# ─── Add favorite ─────────────────────────────────────────────────────────────
@router.post("", response_model=FavoriteResponse, status_code=status.HTTP_201_CREATED)
async def create_favorite(
    data: FavoriteCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await add_favorite(current_user.id, data.movie_id, db)


# ─── Remove favorite ──────────────────────────────────────────────────────────
@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_favorite(
    movie_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await remove_favorite(current_user.id, movie_id, db)
