# SF Movies — Frontend

React + TypeScript SPA that displays where movies were filmed in San Francisco. Powered by TanStack Router and TanStack Query, with an interactive Leaflet map and Zustand for local state.

---

## Features

- Interactive Leaflet map (CartoDB dark tiles) with all SF filming location markers
- Paginated sidebar list — 50 movies per page, synchronized with the map
- Full-text search (title, location, director, actors) via URL search params
- Filter by release decade (1980s–2020s) and sort by title/year
- Smooth map fly-to animation when a movie is selected
- Movie detail panel with full cast, crew, production info, and fun facts
- Deep-link sharing — copies a `?movieId=` URL to clipboard
- JWT-based authentication (Register / Login / Logout)
- Favorites management — add/remove movies, dedicated favorites page
- Mobile-responsive layout (collapsible sidebar, bottom drawer for details)

---

## Tech Stack

| Category         | Technology                   | Version |
| ---------------- | ---------------------------- | ------- |
| Framework        | React + TypeScript           | 19 / 6  |
| Build Tool       | Vite                         | 8       |
| Routing          | TanStack Router (file-based) | 1.168   |
| Data Fetching    | TanStack Query (React Query) | 5.97    |
| State Management | Zustand (with persist)       | 5.0     |
| Styling          | Tailwind CSS                 | 4.2     |
| UI Components    | PrimeReact + PrimeIcons      | 10.9    |
| Map              | Leaflet + React Leaflet      | 1.9 / 5 |
| HTTP Client      | Axios                        | 1.15    |
| Validation       | Zod                          | 4.3     |
| Forms            | React Hook Form + resolvers  | 7.72    |
| Notifications    | react-hot-toast              | 2.6     |
| Error Handling   | react-error-boundary         | 6.1     |

---

## Folder Structure

```
frontend/
├── public/
├── src/
│   ├── main.tsx                      → App entry: React root + QueryProvider + RouterProvider
│   ├── App.tsx                       → TanStack Router setup with auth context
│   ├── index.css                     → Global styles + Tailwind directives
│   │
│   ├── config/
│   │   ├── constants.ts              → API endpoint paths and React Query cache keys
│   │   └── env.config.ts             → VITE_BASE_URL environment variable
│   │
│   ├── routes/                       → TanStack Router file-based route tree
│   │   ├── __root.tsx                → Root layout, injects auth context into router
│   │   ├── index.tsx                 → "/" → redirects to /dashboard
│   │   ├── dashboard.tsx             → "/dashboard" (public) — MoviesPage in BaseLayout
│   │   ├── not-found.tsx             → Catch-all 404 route
│   │   ├── _session.tsx              → Layout guard: redirects authenticated users away
│   │   ├── _session/
│   │   │   ├── login.tsx             → "/login"
│   │   │   └── register.tsx          → "/register"
│   │   ├── _protected.tsx            → Layout guard: redirects unauthenticated users to /login
│   │   └── _protected/
│   │       └── favorites.tsx         → "/favorites" (auth required) — FavoritesPage in BaseLayout
│   │
│   ├── layouts/
│   │   └── baseLayout/
│   │       ├── index.tsx             → Shell: Header + collapsible Sidebar + <Outlet />
│   │       ├── Header.tsx            → Logo, nav links, Login/Logout button
│   │       └── Sidebar.tsx           → Search input, year filter, sort selector, MoviesSidebarList
│   │
│   ├── pages/
│   │   ├── movies/
│   │   │   └── index.page.tsx        → Split view: MapView (left) + MovieDetailPanel (right)
│   │   ├── favorites/
│   │   │   └── index.page.tsx        → Favorites list page
│   │   └── not-found.page.tsx        → 404 page component
│   │
│   ├── modules/                      → Feature-sliced modules (components / hooks / service / store / types)
│   │   │
│   │   ├── auth/
│   │   │   ├── index.tsx             → Auth page with tab toggle (Login ↔ Register)
│   │   │   ├── components/
│   │   │   │   ├── AuthHeroPanel.tsx → Left branding panel on auth page
│   │   │   │   ├── AuthTabToggle.tsx → Login / Register tab switcher
│   │   │   │   ├── LoginForm.tsx     → Email + password form with Zod validation
│   │   │   │   └── RegisterForm.tsx  → Registration form with Zod validation
│   │   │   ├── hooks/
│   │   │   │   └── auth.hook.ts      → useLogin, useRegister (wrap mutations, redirect on success)
│   │   │   ├── service/
│   │   │   │   └── auth.service.ts   → useLoginMutation, useRegisterMutation (TanStack Query)
│   │   │   └── types/
│   │   │       ├── auth.type.ts      → LoginCredentials, RegisterCredentials, AuthResponse
│   │   │       └── auth.schema.ts    → Zod schemas: LoginSchema, RegisterSchema, AuthResponseSchema
│   │   │
│   │   ├── movies/
│   │   │   ├── index.tsx             → Movies module root
│   │   │   ├── components/
│   │   │   │   ├── MapView.tsx           → Leaflet map, FlyToController, ViewportController
│   │   │   │   ├── MovieMarker.tsx       → Individual map marker with click handler
│   │   │   │   ├── MoviePopup.tsx        → Leaflet popup shown on marker click
│   │   │   │   ├── MovieDetailPanel.tsx  → Right sidebar: full details, favorite button, share link
│   │   │   │   ├── MovieDetailDrawer.tsx → Mobile bottom drawer variant of detail panel
│   │   │   │   └── MoviesSidebarList.tsx → Paginated list in left sidebar
│   │   │   ├── hooks/
│   │   │   │   └── movies.hook.ts    → useMovies (combines useMoviesQuery + store actions)
│   │   │   ├── service/
│   │   │   │   └── movies.service.ts → useMoviesQuery (TanStack Query, staleTime: Infinity)
│   │   │   ├── store/
│   │   │   │   └── movies.store.ts   → Zustand: movies[], selectedMovie, search, year, sort,
│   │   │   │                              page, mapCenter, mapZoom, isFiltering
│   │   │   └── types/
│   │   │       └── movies.type.ts    → Movie, MovieSearchParams, MovieSortOption, MovieSearchSchema
│   │   │
│   │   └── favorites/
│   │       ├── index.tsx             → Favorites module root
│   │       ├── components/
│   │       │   └── FavoritesSidebarList.tsx → List of favorited movies
│   │       ├── hooks/
│   │       │   └── favorites.hook.ts → useFavorites (query + add/remove mutations)
│   │       ├── service/
│   │       │   └── favorites.service.ts → useFavoritesQuery, useAddFavorite, useRemoveFavorite
│   │       ├── store/
│   │       │   └── favorites.store.ts → Zustand: favorites[], setFavorites
│   │       └── types/
│   │           └── favorites.type.ts  → Favorite, FavoriteSchema
│   │
│   └── shared/                       → App-wide reusable code
│       ├── service/
│       │   └── apiClient.ts          → Axios instance; interceptor attaches Bearer token + Zod validation
│       ├── store/
│       │   └── useAuthStore.ts       → Zustand (persist): user, token, isAuthenticated, setAuth, logout
│       ├── providers/
│       │   └── QueryProvider.tsx     → TanStack QueryClientProvider wrapper
│       └── lib/
│           └── hook-form/            → Typed useForm wrapper around React Hook Form
│
├── .env                              → VITE_BASE_URL
├── vite.config.ts                    → Vite + proxy config
├── tailwind.config (inline vite)
├── tsconfig.json
└── package.json
```

---

## Route Structure

| Route                   | Access        | Component           | Description                                    |
| ----------------------- | ------------- | ------------------- | ---------------------------------------------- |
| `/`                     | Public        | Redirect            | Always redirects to `/dashboard`               |
| `/dashboard`            | Public        | MoviesPage          | Map + sidebar + filters. Auth not required     |
| `/login`                | Guest only    | Auth (Login tab)    | Redirects to `/dashboard` if already logged in |
| `/register`             | Guest only    | Auth (Register tab) | Redirects to `/dashboard` if already logged in |
| `/_protected/favorites` | Auth required | FavoritesPage       | Redirects to `/login` if not authenticated     |
| `*`                     | Public        | NotFoundPage        | 404 catch-all                                  |

---

## State Management

| Store               | Library           | Persisted          | Contents                                                        |
| ------------------- | ----------------- | ------------------ | --------------------------------------------------------------- |
| `useAuthStore`      | Zustand + persist | Yes (localStorage) | user, token, isAuthenticated, setAuth, logout                   |
| `useMoviesStore`    | Zustand           | No                 | movies[], selectedMovie, search, year, sort, page, map viewport |
| `useFavoritesStore` | Zustand           | No                 | favorites[]                                                     |

---

## Data Fetching

All server state is managed by **TanStack Query**. URL search params (via TanStack Router) serve as the single source of truth for filter/search state and are used as React Query cache keys — changing params triggers a new fetch automatically.

| Hook                  | Cache Key                        | Behaviour                                      |
| --------------------- | -------------------------------- | ---------------------------------------------- |
| `useMoviesQuery`      | `['movies', { q, year, sort }]`  | `staleTime: Infinity`, refetch on param change |
| `useFavoritesQuery`   | `['favorites']`                  | Enabled only when authenticated                |
| `useAddFavorite`      | mutation → invalidates favorites | Optimistic-style invalidation on settle        |
| `useRemoveFavorite`   | mutation → invalidates favorites | Same                                           |
| `useLoginMutation`    | mutation                         | Calls `setAuth`, redirects to dashboard        |
| `useRegisterMutation` | mutation                         | Calls `setAuth`, redirects to dashboard        |

---

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x or pnpm >= 8.x

---

## Setup & Installation

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment

Create `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:8080
```

### 3. Start development server

```bash
npm run dev
```

App runs at `http://localhost:3002`.

The Vite dev server proxies all `/api/*` requests to the backend, rewriting the `/api` prefix away — so `axios.get('/api/movies')` becomes `GET http://localhost:8080/movies`.

---

## Available Scripts

| Script            | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start Vite dev server (port 3002)             |
| `npm run build`   | TypeScript check + production build → `dist/` |
| `npm run preview` | Serve the production build locally            |
| `npm run lint`    | Run ESLint                                    |

---

## Environment Variables

| Variable        | Description          | Default                 |
| --------------- | -------------------- | ----------------------- |
| `VITE_BASE_URL` | Backend API base URL | `http://localhost:8080` |

---

## Path Aliases

| Alias      | Resolves to    |
| ---------- | -------------- |
| `@/`       | `src/`         |
| `@assets`  | `src/assets/`  |
| `@shared`  | `src/shared/`  |
| `@modules` | `src/modules/` |

---

## Developer

|              |                                                                           |
| ------------ | ------------------------------------------------------------------------- |
| **Name**     | Sudhakaran V                                                              |
| **Email**    | [sudhakaranv17@gmail.com](mailto:sudhakaranv17@gmail.com)                 |
| **GitHub**   | [github.com/SudhakaranV17](https://github.com/SudhakaranV17)              |
| **LinkedIn** | [linkedin.com/in/sudhakar-v17](https://www.linkedin.com/in/sudhakar-v17/) |
