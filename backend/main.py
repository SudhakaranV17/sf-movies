from fastapi import FastAPI

app = FastAPI(
    title="SF Movies API",
    description="API for SF Movies application",
    version="1.0.0"
)


@app.get("/")
def health_check():
    return {
        "status": "running",
        "message": "SF Movies API is up!"
    }