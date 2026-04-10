from fastapi import FastAPI
from database import connect_db
app = FastAPI(
    title="SF Movies API",
    description="API for SF Movies application",
    version="1.0.0"
)

@app.on_event("startup")
async def startup():
    await connect_db()

@app.get("/")
def health_check():
    return {
        "status": "running",
        "message": "SF Movies API is up!"
    }