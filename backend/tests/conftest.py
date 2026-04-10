import pytest
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

from main import app
from database import Base, get_db

# ─── In-memory SQLite for tests ───────────────────────────────────────────────
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(bind=test_engine, class_=AsyncSession, expire_on_commit=False)


# ─── Override DB dependency ───────────────────────────────────────────────────
async def override_get_db():
    async with TestSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db


# ─── Create tables before tests, drop after ───────────────────────────────────
@pytest.fixture(scope="session", autouse=True)
async def setup_db():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


# ─── HTTP client fixture ───────────────────────────────────────────────────────
@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


# ─── Registered user + token fixture ─────────────────────────────────────────
@pytest.fixture
async def auth_token(client: AsyncClient) -> str:
    await client.post("/auth/register", json={
        "email": "test@gmail.com",
        "password": "test1234"
    })
    response = await client.post("/auth/login", data={
        "username": "test@gmail.com",
        "password": "test1234"
    })
    return response.json()["access_token"]


@pytest.fixture
def auth_headers(auth_token: str) -> dict:
    return {"Authorization": f"Bearer {auth_token}"}
