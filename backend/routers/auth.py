from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db
from schemas import UserCreate, LoginRequest, AuthResponse
from services.auth_service import register_user, login_user, decode_access_token
from models import User
from sqlalchemy import select
from logger import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ─── Dependency: get current logged-in user ───────────────────────────────────
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    try:
        user_id = decode_access_token(token)
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            logger.warning(f"Auth failed - user not found for ID: {user_id}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except Exception as e:
        logger.error(f"Auth dependency error: {str(e)}")
        raise


# ─── Register ─────────────────────────────────────────────────────────────────
@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    logger.info(f"POST /auth/register - email: {data.email}")
    return await register_user(data, db)


# ─── Login ────────────────────────────────────────────────────────────────────
@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    logger.info(f"POST /auth/login - email: {data.email}")
    token = await login_user(data.email, data.password, db)
    
    # Get user info for response
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()
    
    return {
        "user": user,
        "access_token": token,
        "token_type": "bearer"
    }
