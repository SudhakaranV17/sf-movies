from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
import bcrypt
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from dotenv import load_dotenv
import os

from models import User
from schemas import UserCreate
from logger import get_logger

load_dotenv()

logger = get_logger(__name__)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

# ─── Password ─────────────────────────────────────────────────────────────────

async def hash_password(password: str) -> str:
    try:
        return await asyncio.to_thread(
            lambda: bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=10)).decode()
        )
    except Exception as e:
        logger.error(f"Error hashing password: {str(e)}")
        raise


async def verify_password(plain: str, hashed: str) -> bool:
    try:
        return await asyncio.to_thread(
            lambda: bcrypt.checkpw(plain.encode(), hashed.encode())
        )
    except Exception as e:
        logger.error(f"Error verifying password: {str(e)}")
        return False


# ─── JWT ──────────────────────────────────────────────────────────────────────

def create_access_token(user_id: int) -> str:
    try:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {"sub": str(user_id), "exp": expire}
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    except Exception as e:
        logger.error(f"Error creating access token: {str(e)}")
        raise


def decode_access_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            logger.warning("JWT decode failed - 'sub' claim missing")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return int(user_id)
    except JWTError as e:
        logger.warning(f"JWT decode failed - {str(e)}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    except Exception as e:
        logger.error(f"Unexpected error decoding token: {str(e)}")
        raise


# ─── Register ─────────────────────────────────────────────────────────────────

async def register_user(data: UserCreate, db: AsyncSession):
    logger.info(f"Attempting to register new user: {data.email}")
    
    try:
        result = await db.execute(select(User).where(User.email == data.email))
        existing = result.scalar_one_or_none()
        if existing:
            logger.warning(f"Registration failed - Email already exists: {data.email}")
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        user = User(email=data.email, password=await hash_password(data.password))
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        # Create token for instant login
        token = create_access_token(user.id)
        
        logger.info(f"User registered successfully: {user.email} (ID: {user.id})")
        
        return {
            "user": user,
            "access_token": token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during user registration: {str(e)}")
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Registration failed")


# ─── Login ────────────────────────────────────────────────────────────────────

async def login_user(email: str, password: str, db: AsyncSession) -> str:
    logger.info(f"Login attempt for user: {email}")
    try:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if not user or not await verify_password(password, user.password):
            logger.warning(f"Login failed - invalid credentials for: {email}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        logger.info(f"User logged in successfully: {user.email}")
        return create_access_token(user.id)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during login: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Login process failed")
