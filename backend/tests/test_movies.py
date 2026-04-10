from httpx import AsyncClient
from tests.conftest import TestSessionLocal
from models import Movie


# ─── Seed a movie into test DB ────────────────────────────────────────────────

async def seed_movie():
    async with TestSessionLocal() as db:
        movie = Movie(
            title="Milk",
            release_year=2008,
            locations="City Hall",
            director="Gus Van Sant",
            actor_1="Sean Penn",
            latitude=37.7793,
            longitude=-122.4193,
        )
        db.add(movie)
        await db.commit()


async def test_get_all_movies(client: AsyncClient):
    await seed_movie()
    response = await client.get("/movies")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0


async def test_search_by_title(client: AsyncClient):
    await seed_movie()
    response = await client.get("/movies/search?q=Milk")
    assert response.status_code == 200
    results = response.json()
    assert any(m["title"] == "Milk" for m in results)


async def test_search_by_director(client: AsyncClient):
    await seed_movie()
    response = await client.get("/movies/search?q=Gus Van Sant")
    assert response.status_code == 200
    results = response.json()
    assert any(m["director"] == "Gus Van Sant" for m in results)


async def test_search_by_year(client: AsyncClient):
    await seed_movie()
    response = await client.get("/movies/search?q=2008")
    assert response.status_code == 200
    results = response.json()
    assert any(m["release_year"] == 2008 for m in results)


async def test_search_empty_query(client: AsyncClient):
    response = await client.get("/movies/search?q=")
    assert response.status_code == 422
