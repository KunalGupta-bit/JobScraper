import sys
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import jobs
from models import database

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())

# Create tables
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title="Job Scraper API",
    description="API for scraping and managing fresher/internship jobs",
    version="1.0.0"
)

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Job Scraper API. Go to /docs for Swagger UI."}
