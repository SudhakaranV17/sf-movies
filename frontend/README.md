# 🎬 SF Movies - Frontend

A single page application that shows where movies have been filmed in San Francisco. Users can explore filming locations on an interactive map, search for movies with autocomplete, and save their favorite locations after logging in.

---

## 🚀 Live Demo

> Coming soon after deployment on Render

---

## ✨ Features

- 🗺️ Interactive map showing SF movie filming locations
- 🔍 Autocomplete search to filter movies
- 🔐 User authentication (Login / Register)
- ❤️ Save and manage favorite filming locations
- 📍 Click markers to view movie details

---

## 🛠️ Tech Stack

| Category         | Technology                   |
| ---------------- | ---------------------------- |
| Framework        | React 19 + TypeScript        |
| Build Tool       | Vite                         |
| Styling          | Tailwind CSS                 |
| Routing          | TanStack Router (File Based) |
| Data Fetching    | TanStack Query               |
| State Management | Zustand                      |
| Map              | Leaflet + React Leaflet      |
| HTTP Client      | Axios                        |
| Validation       | Zod                          |
| Icons            | PrimeIcons                   |
| Error Handling   | React Error Boundary         |

---

## 📁 Folder Structure

```
src/
├── assets/                   → Static assets
├── config/                   → Environment variables and constants
├── layouts/                  → Base layout with header
├── modules/                  → Feature based modules
│   ├── auth/                 → Login, Register
│   │   ├── components/       → LoginForm, RegisterForm
│   │   ├── helpers/          → Zod schemas
│   │   ├── hooks/            → TanStack Query hooks
│   │   ├── service/          → Axios API calls
│   │   └── types/            → TypeScript types
│   ├── movies/               → Map, Search, Markers
│   │   ├── components/       → MapView, SearchBar, MovieMarker, MoviePopup
│   │   ├── helpers/          → Map utility helpers
│   │   ├── hooks/            → TanStack Query hooks
│   │   ├── service/          → Axios API calls
│   │   └── types/            → TypeScript types
│   └── favorites/            → Save and manage favorites
│       ├── components/       → FavoritesList, FavoriteButton
│       ├── hooks/            → TanStack Query hooks
│       ├── service/          → Axios API calls
│       └── types/            → TypeScript types
├── pages/                    → Page components (render modules)
├── routes/                   → TanStack Router file based routes
│   ├── _protected/           → Auth required routes
│   └── _session/             → Login/Register routes
└── shared/                   → App wide reusable code
    ├── components/           → ErrorBoundary, PageNotFound
    ├── providers/            → TanStack Query provider
    ├── service/              → Axios instance with JWT interceptor
    ├── store/                → Zustand auth store
    └── utils/                → Map utilities
```

---

## ⚙️ Prerequisites

- Node.js >= 18.x
- npm >= 9.x or pnpm >= 8.x

---

## 🔧 Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/SudhakaranV17/sf-movies.git
cd sf-movies/frontend
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Configure environment variables

Create a `.env` file in the `frontend/` folder:

```env
VITE_BASE_URL=http://localhost:8000
```

### 4. Run the development server

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 📜 Available Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |

---

## 🔐 Environment Variables

| Variable        | Description          | Default                 |
| --------------- | -------------------- | ----------------------- |
| `VITE_BASE_URL` | Backend API base URL | `http://localhost:8000` |

---

## 🗺️ Route Structure

```
/                        → Redirects based on auth status
/_session/login          → Login page
/_session/register       → Register page
/_protected/             → Home map page (auth required)
/_protected/favorites    → Favorites page (auth required)
```

---

## 🔗 Backend Repository

> Link will be added after backend setup

---

## 👨‍💻 Developer

|              |                                                                           |
| ------------ | ------------------------------------------------------------------------- |
| **Name**     | Sudhakaran V                                                              |
| **Email**    | [sudhakaranv17@gmail.com](mailto:sudhakaranv17@gmail.com)                 |
| **GitHub**   | [github.com/SudhakaranV17](https://github.com/SudhakaranV17)              |
| **LinkedIn** | [linkedin.com/in/sudhakar-v17](https://www.linkedin.com/in/sudhakar-v17/) |
