# SF Movies — Backend

FastAPI REST API for the SF Movies application. Syncs movie filming location data from the DataSF open dataset into PostgreSQL and exposes endpoints for movies, authentication, and favorites.

---

## Features

- Async FastAPI with full Swagger/ReDoc auto-documentation
- On-startup sync of SF filming locations from the DataSF API
- Full-text movie search (title, location, director, actors)
- Decade-based year filtering and multiple sort options
- JWT authentication (register, login) with bcrypt password hashing
- Protected favorites endpoints (add, remove, list)
- Async SQLAlchemy 2 + asyncpg for non-blocking DB access
- Alembic for schema migrations
- Request logging middleware with response time tracking
- Pytest test suite covering auth, movies, and favorites

---

## Tech Stack

| Category    | Technology              | Version |
| ----------- | ----------------------- | ------- |
| Framework   | FastAPI                 | 0.135   |
| Server      | Uvicorn                 | 0.44    |
| Database    | PostgreSQL              | 15+     |
| ORM         | SQLAlchemy (async)      | 2.0     |
| DB Driver   | asyncpg                 | 0.31    |
| Migrations  | Alembic                 | 1.18    |
| Auth        | python-jose (JWT)       | 3.5     |
| Passwords   | Passlib + bcrypt        | 1.7 / 5 |
| HTTP Client | HTTPX (async)           | 0.28    |
| Validation  | Pydantic v2             | 2.12    |
| Testing     | Pytest + pytest-asyncio | 9.0     |
| Env         | python-dotenv           | 1.2     |

---

## Folder Structure

```
backend/
├── main.py                     → FastAPI app entry: CORS, middleware, routers, startup sync
├── database.py                 → SQLAlchemy async engine, session factory, Base, get_db dependency
├── logger.py                   → Structured logger factory
├── requirements.txt
├── alembic.ini                 → Alembic configuration
│
├── alembic/
│   ├── env.py                  → Alembic migration environment
│   └── versions/
│       └── caf5b3dcdefb_*.py   → Initial migration: users, movies, favorites tables
│
├── models/                     → SQLAlchemy ORM models (table definitions)
│   ├── __init__.py
│   ├── user.py                 → User table (id, email unique, password, → favorites)
│   ├── movie.py                → Movie table (full DataSF fields + lat/lng)
│   └── favorite.py             → Favorite table (user_id FK, movie_id FK)
│
├── schemas/                    → Pydantic request/response models
│   ├── __init__.py
│   ├── user_schema.py          → UserCreate, UserResponse, LoginRequest, AuthResponse
│   ├── movie_schema.py         → MovieResponse
│   └── favorite_schema.py      → FavoriteCreate, FavoriteResponse
│
├── routers/                    → Thin route handlers — delegate all logic to services
│   ├── __init__.py
│   ├── auth.py                 → POST /auth/register, POST /auth/login, get_current_user dep
│   ├── movies.py               → GET /movies, GET /movies/search
│   └── favorites.py            → GET/POST/DELETE /favorites (JWT protected)
│
├── services/                   → Business logic layer
│   ├── __init__.py
│   ├── auth_service.py         → hash_password, verify_password, create_access_token,
│   │                              decode_access_token, register_user, login_user
│   ├── movie_service.py        → fetch_all_movies_from_api (HTTPX), sync_movies,
│   │                              get_all_movies, search_movies (year filter, sort, pagination)
│   └── favorite_service.py     → add_favorite, remove_favorite, get_user_favorites
│
└── tests/
    ├── __init__.py
    ├── conftest.py             → Pytest fixtures (test DB, test client, auth tokens)
    ├── test_auth.py            → Register and login endpoint tests
    ├── test_movies.py          → Movies list and search endpoint tests
    └── test_favorites.py       → Add, remove, list favorites tests
```

---

## Database Schema

```
┌──────────────────────────────────────┐
│ users                                │
├──────────────────────────────────────┤
│ id         INTEGER   PK AUTO         │
│ email      VARCHAR   UNIQUE NOT NULL │
│ password   VARCHAR   NOT NULL        │
└───────────────────┬──────────────────┘
                    │ 1
                    │
                    │ *
┌───────────────────▼──────────────────┐
│ favorites                            │
├──────────────────────────────────────┤
│ id         INTEGER   PK AUTO         │
│ user_id    INTEGER   FK → users.id   │
│ movie_id   INTEGER   FK → movies.id  │
└───────────────────┬──────────────────┘
                    │ *
                    │
                    │ 1
┌───────────────────▼──────────────────┐
│ movies                               │
├──────────────────────────────────────┤
│ id                   INTEGER   PK    │
│ title                VARCHAR         │
│ release_year         INTEGER         │
│ locations            VARCHAR(500)    │
│ fun_facts            VARCHAR(1000)   │
│ production_company   VARCHAR         │
│ distributor          VARCHAR         │
│ director             VARCHAR         │
│ writer               VARCHAR         │
│ actor_1              VARCHAR         │
│ actor_2              VARCHAR         │
│ actor_3              VARCHAR         │
│ latitude             FLOAT           │
│ longitude            FLOAT           │
│ analysis_neighborhood VARCHAR        │
│ supervisor_district  VARCHAR         │
└──────────────────────────────────────┘
```

---

## API Endpoints

Base URL: `http://localhost:8080`

### Authentication

| Method | Endpoint         | Auth | Request Body          | Response                             |
| ------ | ---------------- | ---- | --------------------- | ------------------------------------ |
| POST   | `/auth/register` | No   | `{ email, password }` | `{ access_token, token_type, user }` |
| POST   | `/auth/login`    | No   | `{ email, password }` | `{ access_token, token_type, user }` |

### Movies

| Method | Endpoint         | Auth | Query Params        | Response          |
| ------ | ---------------- | ---- | ------------------- | ----------------- |
| GET    | `/movies`        | No   | `year`, `sort`      | `MovieResponse[]` |
| GET    | `/movies/search` | No   | `q`, `year`, `sort` | `MovieResponse[]` |

**Query param values:**

- `year`: `1980s` `1990s` `2000s` `2010s` `2020s` `older`
- `sort`: `title_asc` `title_desc` `year_asc` `year_desc`
- `q`: free-text string searched across title, locations, director, actors

### Favorites (requires `Authorization: Bearer <token>`)

| Method | Endpoint                | Request Body   | Response             |
| ------ | ----------------------- | -------------- | -------------------- |
| GET    | `/favorites`            | —              | `FavoriteResponse[]` |
| POST   | `/favorites`            | `{ movie_id }` | `FavoriteResponse`   |
| DELETE | `/favorites/{movie_id}` | —              | `204 No Content`     |

### Health

| Method | Endpoint        | Response                                    |
| ------ | --------------- | ------------------------------------------- |
| GET    | `/health-check` | `{ "status": "running", "message": "..." }` |

---

## Application Startup Sequence

1. `connect_db()` — establishes the SQLAlchemy async engine and verifies DB connectivity
2. `sync_movies(db)` — fetches all records from the DataSF API (`DATASF_API_URL`) via HTTPX, upserts them into the `movies` table
3. FastAPI begins serving requests

This means the movies table is always up-to-date with the latest DataSF data on each deployment or restart.

---

## Authentication Flow

```
Client                          Server
  │                               │
  ├── POST /auth/register ──────► │  hash_password (bcrypt)
  │   { email, password }         │  INSERT into users
  │ ◄── { access_token, user } ── │  create_access_token (JWT, 30 min)
  │                               │
  ├── POST /auth/login ─────────► │  verify_password (bcrypt)
  │   { email, password }         │  create_access_token
  │ ◄── { access_token, user } ── │
  │                               │
  ├── GET /favorites ───────────► │  OAuth2PasswordBearer extracts token
  │   Authorization: Bearer <tok> │  decode_access_token → user_id
  │ ◄── [ FavoriteResponse ] ──── │  query favorites WHERE user_id = ?
```

---

## Prerequisites

- Python >= 3.11
- PostgreSQL >= 15
- pip >= 23.x

---

## Setup & Installation

### 1. Create virtual environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Create PostgreSQL database

```sql
CREATE DATABASE sf_movies;
```

### 4. Configure environment

Create `backend/.env`:

```env
DATABASE_URL=your_database_url_here
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATASF_API_URL=https://data.sfgov.org/resource/yitu-d5am.json
```

### 5. Run migrations

```bash
alembic upgrade head
```

### 6. Start the server

```bash
uvicorn main:app --reload --port 8080
```

API runs at `http://localhost:8080`

---

## API Documentation

| URL                           | Description |
| ----------------------------- | ----------- |
| `http://localhost:8080/docs`  | Swagger UI  |
| `http://localhost:8080/redoc` | ReDoc UI    |

---

## Environment Variables

| Variable                      | Description                        |
| ----------------------------- | ---------------------------------- |
| `DATABASE_URL`                | Async PostgreSQL connection string |
| `ALLOWED_HOST_URL`            | Cross origin allowed host url      |
| `SECRET_KEY`                  | Secret for JWT signing             |
| `ALGORITHM`                   | JWT algorithm (default: `HS256`)   |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token TTL in minutes (default: 30) |
| `DATASF_API_URL`              | DataSF film locations API endpoint |

---

## Running Tests

```bash
pytest tests/ -v
```

Test files:

| File                      | Coverage                                         |
| ------------------------- | ------------------------------------------------ |
| `tests/test_auth.py`      | Register, login, duplicate user, bad credentials |
| `tests/test_movies.py`    | List movies, search, year filter, sort           |
| `tests/test_favorites.py` | Add, remove, list favorites; auth enforcement    |

---

## Developer

|              |                                                                           |
| ------------ | ------------------------------------------------------------------------- |
| **Name**     | Sudhakaran V                                                              |
| **Email**    | [sudhakaranv17@gmail.com](mailto:sudhakaranv17@gmail.com)                 |
| **GitHub**   | [github.com/SudhakaranV17](https://github.com/SudhakaranV17)              |
| **LinkedIn** | [linkedin.com/in/sudhakar-v17](https://www.linkedin.com/in/sudhakar-v17/) |
