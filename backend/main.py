from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_db, AsyncSessionLocal
from routers import auth, movies, favorites
from services.movie_service import sync_movies

app = FastAPI(
    title="SF Movies API",
    description="API for SF Movies application",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(favorites.router)


@app.on_event("startup")
async def startup():
    await connect_db()
    async with AsyncSessionLocal() as db:
        await sync_movies(db)


@app.get("/health-check")
def health_check():
    return {
        "status": "running",
        "message": "SF Movies API is up!"
    }
