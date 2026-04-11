# SF Movies

A full-stack web application that lets users explore where movies were filmed in San Francisco. Browse an interactive map of filming locations, search and filter movies, and save personal favorites — all backed by live data from the DataSF open dataset.

---

## Live Demo

 [sf-movies-beta.vercel.app](https://sf-movies-beta.vercel.app/dashboard)

---

## Features

- Interactive Leaflet map with all SF filming locations as markers
- Full-text search across title, location, director, and actors
- Filter by release decade and sort by title or year
- Paginated sidebar list with smooth map fly-to on selection
- Movie detail panel with production info, cast, and fun facts
- Shareable deep-link for any selected movie
- User authentication (Register / Login / Logout)
- Authenticated users can add and remove favorite films
- Dedicated favorites page listing saved films
- Auto-generated Swagger API documentation

---

## Project Structure

```
sf-movies/
├── frontend/          → React 19 + TypeScript + Vite (port 3002)
├── backend/           → Python + FastAPI + PostgreSQL (port 8080)
└── README.md
```

---

## Tech Stack

### Frontend

| Category         | Technology                      |
| ---------------- | ------------------------------- |
| Framework        | React 19 + TypeScript           |
| Build Tool       | Vite 8                          |
| Routing          | TanStack Router (file-based)    |
| Data Fetching    | TanStack Query (React Query v5) |
| State Management | Zustand 5 (with persist)        |
| Styling          | Tailwind CSS 4                  |
| UI Components    | PrimeReact                      |
| Map              | Leaflet + React Leaflet         |
| HTTP Client      | Axios                           |
| Validation       | Zod                             |
| Forms            | React Hook Form                 |

### Backend

| Category    | Technology              |
| ----------- | ----------------------- |
| Framework   | FastAPI                 |
| Server      | Uvicorn                 |
| Database    | PostgreSQL              |
| ORM         | SQLAlchemy 2 (async)    |
| DB Driver   | asyncpg                 |
| Migrations  | Alembic                 |
| Auth        | JWT (python-jose)       |
| Passwords   | Passlib + bcrypt        |
| HTTP Client | HTTPX (async)           |
| Validation  | Pydantic v2             |
| Testing     | Pytest + pytest-asyncio |

---

## Architecture Overview

```
Browser
  │
  ├── TanStack Router   (client-side routing, URL search params as filter state)
  ├── TanStack Query    (data fetching, caching, mutations)
  ├── Zustand Store     (movies list, selected movie, map center/zoom, auth, favorites)
  └── Axios + Interceptor (attaches JWT Bearer token to every request)
          │
          │  /api/* (Vite proxy rewrites → backend root)
          ▼
     FastAPI (port 8080)
          ├── CORS Middleware
          ├── Request Logger Middleware
          ├── /auth/register  /auth/login
          ├── /movies         /movies/search
          ├── /favorites (JWT protected)
          └── Startup: syncs DataSF API → PostgreSQL
                │
                ▼
          PostgreSQL
          (users, movies, favorites)
```

---

## Data Flow

| Step | What happens                                                                          |
| ---- | ------------------------------------------------------------------------------------- |
| 1    | App starts; Zustand reads persisted auth token from localStorage                      |
| 2    | `/` redirects to `/dashboard` (public)                                                |
| 3    | `BaseLayout` renders: Header + collapsible Sidebar + main content                     |
| 4    | `useMoviesQuery` fetches movies based on URL search params (q, year, sort, page)      |
| 5    | Movies stored in Zustand; Leaflet map renders markers                                 |
| 6    | User clicks a movie → `setSelectedMovie` → map flies to coordinates                   |
| 7    | `MovieDetailPanel` shows full production details                                      |
| 8    | Authenticated users can toggle favorites (optimistic UI via React Query mutation)     |
| 9    | Favorites route (`/_protected/favorites`) requires auth; redirects to `/login` if not |

---

## Quick Start

### Prerequisites

- Node.js >= 18.x
- Python >= 3.11
- PostgreSQL >= 15

### 1. Clone

```bash
git clone https://github.com/SudhakaranV17/sf-movies.git
cd sf-movies
```

### 2. Backend setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=your_database_url_here
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATASF_API_URL=https://data.sfgov.org/resource/yitu-d5am.json
```

```bash
alembic upgrade head
uvicorn main:app --reload --port 8080
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:8080
```

```bash
npm run dev
```

---

## Running URLs

| Service      | URL                                  |
| ------------ | ------------------------------------ |
| Frontend     | `http://localhost:3002`              |
| Backend API  | `http://localhost:8080`              |
| Swagger UI   | `http://localhost:8080/docs`         |
| ReDoc        | `http://localhost:8080/redoc`        |
| Health Check | `http://localhost:8080/health-check` |

---

## API Endpoints (Summary)

| Method | Endpoint                | Auth | Description                   |
| ------ | ----------------------- | ---- | ----------------------------- |
| POST   | `/auth/register`        | No   | Register new user             |
| POST   | `/auth/login`           | No   | Login, returns JWT            |
| GET    | `/movies`               | No   | List movies (year, sort)      |
| GET    | `/movies/search`        | No   | Search movies (q, year, sort) |
| GET    | `/favorites`            | Yes  | Get user's favorites          |
| POST   | `/favorites`            | Yes  | Add a favorite                |
| DELETE | `/favorites/{movie_id}` | Yes  | Remove a favorite             |
| GET    | `/health-check`         | No   | API health status             |

---

## Detailed Documentation

| Service  | README                                     |
| -------- | ------------------------------------------ |
| Frontend | [frontend/README.md](./frontend/README.md) |
| Backend  | [backend/README.md](./backend/README.md)   |

---

## Data Source

Movie filming location data sourced from **DataSF** (City & County of San Francisco open data):

- [SF Film Locations Dataset](https://data.sfgov.org/Culture-and-Recreation/Film-Locations-in-San-Francisco/yitu-d5am/about_data)

The backend syncs this dataset into PostgreSQL on every startup.

---

## Developer

|              |                                                                           |
| ------------ | ------------------------------------------------------------------------- |
| **Name**     | Sudhakaran V                                                              |
| **Email**    | [sudhakaranv17@gmail.com](mailto:sudhakaranv17@gmail.com)                 |
| **GitHub**   | [github.com/SudhakaranV17](https://github.com/SudhakaranV17)              |
| **LinkedIn** | [linkedin.com/in/sudhakar-v17](https://www.linkedin.com/in/sudhakar-v17/) |
