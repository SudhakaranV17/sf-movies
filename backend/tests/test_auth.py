from httpx import AsyncClient


async def test_register_success(client: AsyncClient):
    response = await client.post("/auth/register", json={
        "email": "newuser@gmail.com",
        "password": "password123"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@gmail.com"
    assert "id" in data
    assert "password" not in data


async def test_register_duplicate_email(client: AsyncClient):
    await client.post("/auth/register", json={
        "email": "duplicate@gmail.com",
        "password": "password123"
    })
    response = await client.post("/auth/register", json={
        "email": "duplicate@gmail.com",
        "password": "password123"
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


async def test_login_success(client: AsyncClient):
    await client.post("/auth/register", json={
        "email": "loginuser@gmail.com",
        "password": "password123"
    })
    response = await client.post("/auth/login", data={
        "username": "loginuser@gmail.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


async def test_login_wrong_password(client: AsyncClient):
    await client.post("/auth/register", json={
        "email": "wrongpass@gmail.com",
        "password": "correctpass"
    })
    response = await client.post("/auth/login", data={
        "username": "wrongpass@gmail.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"
