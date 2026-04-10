from httpx import AsyncClient
from tests.conftest import TestSessionLocal
from models import Movie


# ─── Seed a movie into test DB ────────────────────────────────────────────────

async def seed_movie() -> int:
    async with TestSessionLocal() as db:
        movie = Movie(
            title="The Rock",
            release_year=1996,
            locations="Alcatraz Island",
            director="Michael Bay",
            actor_1="Nicolas Cage",
            latitude=37.8270,
            longitude=-122.4230,
        )
        db.add(movie)
        await db.commit()
        await db.refresh(movie)
        return movie.id


async def test_get_favorites_unauthorized(client: AsyncClient):
    response = await client.get("/favorites")
    assert response.status_code == 401


async def test_add_favorite(client: AsyncClient, auth_headers: dict):
    movie_id = await seed_movie()
    response = await client.post("/favorites", json={"movie_id": movie_id}, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["movie_id"] == movie_id
    assert data["movie"]["title"] == "The Rock"


async def test_add_favorite_duplicate(client: AsyncClient, auth_headers: dict):
    movie_id = await seed_movie()
    await client.post("/favorites", json={"movie_id": movie_id}, headers=auth_headers)
    response = await client.post("/favorites", json={"movie_id": movie_id}, headers=auth_headers)
    assert response.status_code == 400
    assert response.json()["detail"] == "Movie already in favorites"


async def test_get_favorites(client: AsyncClient, auth_headers: dict):
    movie_id = await seed_movie()
    await client.post("/favorites", json={"movie_id": movie_id}, headers=auth_headers)
    response = await client.get("/favorites", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0


async def test_remove_favorite(client: AsyncClient, auth_headers: dict):
    movie_id = await seed_movie()
    await client.post("/favorites", json={"movie_id": movie_id}, headers=auth_headers)
    response = await client.delete(f"/favorites/{movie_id}", headers=auth_headers)
    assert response.status_code == 204


async def test_remove_favorite_not_found(client: AsyncClient, auth_headers: dict):
    response = await client.delete("/favorites/99999", headers=auth_headers)
    assert response.status_code == 404
