# 🎬 SF Movies

A full stack web application that shows where movies have been filmed in San Francisco. Users can explore filming locations on an interactive map, search for movies, and save their favorite locations.

## 🚀 Live Demo

> Coming soon after deployment on Render

---

## ✨ Features

- 🗺️ Interactive map with SF movie filming locations
- 🔍 Autocomplete search to filter movies
- 🔐 User authentication (Login / Register)
- ❤️ Save and manage favorite filming locations
- 📍 Click markers to view movie details
- 📝 Auto-generated Swagger API docs

---

## 🏗️ Project Structure

```
sf-movies/
├── frontend/          → React + TypeScript + Vite
└── backend/           → Python + FastAPI + PostgreSQL
```

---

## 🛠️ Tech Stack

### Frontend

| Category      | Technology              |
| ------------- | ----------------------- |
| Framework     | React 18 + TypeScript   |
| Build Tool    | Vite                    |
| Styling       | Tailwind CSS            |
| Routing       | TanStack Router         |
| Data Fetching | TanStack Query          |
| State         | Zustand                 |
| Map           | Leaflet + React Leaflet |
| HTTP Client   | Axios                   |

### Backend

| Category   | Technology |
| ---------- | ---------- |
| Framework  | FastAPI    |
| Database   | PostgreSQL |
| ORM        | SQLAlchemy |
| Auth       | JWT        |
| Migrations | Alembic    |
| Testing    | Pytest     |

---

## 🔧 Quick Start

### Prerequisites

- Node.js >= 18.x
- Python >= 3.11
- PostgreSQL >= 15

### 1. Clone the repository

```bash
git clone https://github.com/SudhakaranV17/sf-movies.git
cd sf-movies
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate       # Windows
pip install -r requirements.txt
```

Create `.env` in `backend/`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/sfmovies
SECRET_KEY=your_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATASF_API_URL=https://data.sfgov.org/resource/yitu-d5am.json
```

```bash
alembic upgrade head
uvicorn main:app --reload
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` in `frontend/`:

```env
VITE_BASE_URL=http://localhost:8000
```

```bash
npm run dev
```

---

## 🌐 Running URLs

| Service      | URL                          |
| ------------ | ---------------------------- |
| Frontend     | `http://localhost:5173`      |
| Backend API  | `http://localhost:8000`      |
| Swagger Docs | `http://localhost:8000/docs` |

---

## 📂 Detailed Documentation

|                    |                                            |
| ------------------ | ------------------------------------------ |
| 📘 Frontend README | [frontend/README.md](./frontend/README.md) |
| 📗 Backend README  | [backend/README.md](./backend/README.md)   |

---

## 🔗 Data Source

Movie filming locations data from **DataSF**:

- [SF Film Locations Dataset](https://data.sfgov.org/Culture-and-Recreation/Film-Locations-in-San-Francisco/yitu-d5am/about_data)

---

## 👨‍💻 Developer

|              |                                                                           |
| ------------ | ------------------------------------------------------------------------- |
| **Name**     | Sudhakaran V                                                              |
| **Email**    | [sudhakaranv17@gmail.com](mailto:sudhakaranv17@gmail.com)                 |
| **GitHub**   | [github.com/SudhakaranV17](https://github.com/SudhakaranV17)              |
| **LinkedIn** | [linkedin.com/in/sudhakar-v17](https://www.linkedin.com/in/sudhakar-v17/) |
