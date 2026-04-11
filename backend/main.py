from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time

from database import connect_db, AsyncSessionLocal
from routers import auth, movies, favorites
from services.movie_service import sync_movies
from logger import get_logger
from dotenv import load_dotenv
import os
load_dotenv()
logger = get_logger(__name__)

app = FastAPI(
    title="SF Movies API",
    description="API for SF Movies application",
    version="1.0.0"
)

# ─── Middleware: Request Logger ───────────────────────────────────────────────
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.2f}ms"
    )
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("ALLOWED_HOST_URL")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(favorites.router)


@app.on_event("startup")
async def startup():
    logger.info("Starting up SF Movies API...")
    await connect_db()
    logger.info("Database connected.")
    
    async with AsyncSessionLocal() as db:
        logger.info("Starting movie synchronization...")
        await sync_movies(db)
        logger.info("Movie synchronization complete.")


@app.get("/health-check")
def health_check():
    return {
        "status": "running",
        "message": "SF Movies API is up!"
    }
