# 🎬 SF Movies - Backend

REST API backend for the SF Movies application built with FastAPI and PostgreSQL.

---

## 🚀 Live Demo

> Coming soon after deployment on Render

---

## ✨ Features

- 🔐 User authentication with JWT tokens
- 🎬 Fetch and cache SF movie filming locations from DataSF
- 🔍 Search and filter movies
- ❤️ Save and manage favorite filming locations
- 📝 Auto-generated Swagger API docs
- 🛡️ Password hashing with bcrypt
- 🗄️ Database migrations with Alembic

---

## 🛠️ Tech Stack

| Category     | Technology        |
| ------------ | ----------------- |
| Framework    | FastAPI           |
| Server       | Uvicorn           |
| Database     | PostgreSQL        |
| ORM          | SQLAlchemy        |
| DB Connector | AsyncPG           |
| Migrations   | Alembic           |
| Auth         | JWT (python-jose) |
| Password     | Passlib + Bcrypt  |
| HTTP Client  | HTTPX             |
| Validation   | Pydantic          |
| Testing      | Pytest            |

---

## 📁 Folder Structure

```
backend/
├── main.py                    → App entry point, middleware, routers
├── database.py                → PostgreSQL connection setup
├── .env                       → Secret keys, DB URL
├── requirements.txt           → All packages
├── alembic.ini                → Alembic config (auto generated)
│
├── alembic/                   → DB migrations folder
│   └── versions/              → Each migration file stored here
│
├── routers/                   → API endpoints (routes only, no logic)
│   ├── auth.py                → /register, /login, /logout
│   ├── movies.py              → /movies, /movies/search
│   └── favorites.py           → /favorites GET, POST, DELETE
│
├── services/                  → Business logic
│   ├── auth_service.py        → Password hash, token create
│   ├── movie_service.py       → DataSF API fetch, filter logic
│   └── favorite_service.py    → Add, remove, get favorites
│
├── models/                    → Database table structure (SQLAlchemy)
│   ├── user.py                → Users table
│   ├── movie.py               → Movies table
│   └── favorite.py            → Favorites table
│
├── schemas/                   → Request & Response structure (Pydantic)
│   ├── user_schema.py         → Login, Register request/response
│   ├── movie_schema.py        → Movie response structure
│   └── favorite_schema.py     → Favorite request/response
│
└── tests/                     → Unit tests
    ├── test_auth.py
    ├── test_movies.py
    └── test_favorites.py
```

---

## ⚙️ Prerequisites

- Python >= 3.11
- PostgreSQL >= 15
- pip >= 23.x

---

## 🔧 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/SudhakaranV17/sf-movies.git
cd sf-movies/backend
```

### 2. Create virtual environment

```bash
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create PostgreSQL database

```sql
CREATE DATABASE sfmovies;
```

### 5. Configure environment variables

Create a `.env` file in the `backend/` folder:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/sfmovies
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATASF_API_URL=https://data.sfgov.org/resource/yitu-d5am.json
```

### 6. Run database migrations

```bash
alembic upgrade head
```

### 7. Start the server

```bash
uvicorn main:app --reload
```

API runs at `http://localhost:8000`

---

## 📜 API Documentation

Once the server is running, visit:

| URL                           | Description |
| ----------------------------- | ----------- |
| `http://localhost:8000/docs`  | Swagger UI  |
| `http://localhost:8000/redoc` | ReDoc UI    |

---

## 🔗 API Endpoints

### Auth

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |
| POST   | `/api/auth/logout`   | Logout user       |

### Movies

| Method | Endpoint                | Description    |
| ------ | ----------------------- | -------------- |
| GET    | `/api/movies`           | Get all movies |
| GET    | `/api/movies/search?q=` | Search movies  |

### Favorites

| Method | Endpoint              | Description           |
| ------ | --------------------- | --------------------- |
| GET    | `/api/favorites`      | Get user favorites    |
| POST   | `/api/favorites`      | Add to favorites      |
| DELETE | `/api/favorites/{id}` | Remove from favorites |

---

## 🔐 Environment Variables

| Variable                      | Description               |
| ----------------------------- | ------------------------- |
| `DATABASE_URL`                | PostgreSQL connection URL |
| `SECRET_KEY`                  | JWT secret key            |
| `ALGORITHM`                   | JWT algorithm (HS256)     |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry time         |
| `DATASF_API_URL`              | DataSF movies dataset URL |

---

## 🗄️ Database Schema

```
users
├── id (PK)
├── email (unique)
├── password (hashed)
└── created_at

movies
├── id (PK)
├── title
├── location
├── lat
├── lng
├── year
└── actor

favorites
├── id (PK)
├── user_id (FK → users)
├── movie_id (FK → movies)
└── created_at
```

---

## 🧪 Running Tests

```bash
pytest tests/
```

---

## 👨‍💻 Developer

|              |                                                                           |
| ------------ | ------------------------------------------------------------------------- |
| **Name**     | Sudhakaran V                                                              |
| **Email**    | [sudhakaranv17@gmail.com](mailto:sudhakaranv17@gmail.com)                 |
| **GitHub**   | [github.com/SudhakaranV17](https://github.com/SudhakaranV17)              |
| **LinkedIn** | [linkedin.com/in/sudhakar-v17](https://www.linkedin.com/in/sudhakar-v17/) |
