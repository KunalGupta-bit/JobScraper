import csv
from io import StringIO
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func

from models import database, schemas

from scraper.internshala import InternshalaScraper
from scraper.shine import ShineScraper
from scraper.simplyhired import SimplyHiredScraper
from scraper.indeed import IndeedScraper
from scraper.freshersworld import FreshersworldScraper
from utils.filters import process_and_filter_jobs

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

import asyncio

async def run_scraper_task():
    """Background task to run scrapers, process data, and save to DB."""
    errors = []
    try:
        # Run all scrapers concurrently
        internshala = InternshalaScraper()
        shine = ShineScraper()
        simplyhired = SimplyHiredScraper()
        indeed = IndeedScraper()
        freshersworld = FreshersworldScraper()
        
        results = await asyncio.gather(
            internshala.scrape(),
            shine.scrape(),
            simplyhired.scrape(),
            indeed.scrape(),
            freshersworld.scrape(),
            return_exceptions=True
        )
        
        raw_jobs = []
        for res in results:
            if isinstance(res, Exception):
                errors.append(str(res))
                print(f"A scraper failed with error: {str(res)}")
            elif isinstance(res, list):
                raw_jobs.extend(res)
        
        # Process and filter jobs (Pandas)
        filtered_jobs = process_and_filter_jobs(raw_jobs)
        
        db = database.SessionLocal()
        inserted_count = 0
        try:
            for job_data in filtered_jobs:
                existing = db.query(database.JobModel).filter(
                    database.JobModel.title == job_data['title'],
                    database.JobModel.company == job_data['company']
                ).first()
                if not existing:
                    new_job = database.JobModel(**job_data)
                    db.add(new_job)
                    inserted_count += 1
            db.commit()
        except Exception as e:
            errors.append(f"DB Error: {str(e)}")
            print(f"Error saving jobs: {e}")
            db.rollback()
        finally:
            db.close()
            
        return {"inserted": inserted_count, "total_raw": len(raw_jobs), "errors": errors}
    except Exception as e:
        errors.append(str(e))
        print(f"Scraper task failed: {e}")
        return {"error": str(e), "errors": errors}

def sync_scrape_runner():
    import sys
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    return asyncio.run(run_scraper_task())

@router.post("/scrape")
async def trigger_scrape():
    loop = asyncio.get_running_loop()
    res = await loop.run_in_executor(None, sync_scrape_runner)
    return {"message": "Scraping completed.", "details": res}

@router.get("/jobs", response_model=List[schemas.Job])
def get_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = db.query(database.JobModel).order_by(database.JobModel.posted_date.desc()).offset(skip).limit(limit).all()
    return jobs

@router.get("/jobs/filter", response_model=List[schemas.Job])
def filter_jobs(
    job_type: Optional[str] = None,
    work_mode: Optional[str] = None,
    keyword: Optional[str] = None,
    company: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(database.JobModel)
    
    if job_type:
        query = query.filter(database.JobModel.job_type.ilike(f"%{job_type}%"))
    if work_mode:
        query = query.filter(database.JobModel.work_mode.ilike(f"%{work_mode}%"))
    if company:
        query = query.filter(database.JobModel.company.ilike(f"%{company}%"))
    if keyword:
        query = query.filter(
            (database.JobModel.title.ilike(f"%{keyword}%")) | 
            (database.JobModel.description.ilike(f"%{keyword}%"))
        )
        
    return query.order_by(database.JobModel.posted_date.desc()).all()

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    total_jobs = db.query(database.JobModel).count()
    internships_count = db.query(database.JobModel).filter(database.JobModel.job_type.ilike("%internship%")).count()
    remote_jobs_count = db.query(database.JobModel).filter(database.JobModel.work_mode.ilike("%remote%")).count()
    
    return {
        "total_jobs": total_jobs,
        "internships_count": internships_count,
        "remote_jobs_count": remote_jobs_count
    }

@router.get("/export")
def export_jobs(db: Session = Depends(get_db)):
    jobs = db.query(database.JobModel).all()
    
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(['ID', 'Title', 'Company', 'Link', 'Job Type', 'Work Mode', 'Description', 'Posted Date'])
    
    for job in jobs:
        writer.writerow([
            job.id, job.title, job.company, job.link, 
            job.job_type, job.work_mode, job.description, 
            job.posted_date.strftime("%Y-%m-%d") if job.posted_date else ""
        ])
        
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=jobs_export.csv"}
    )
