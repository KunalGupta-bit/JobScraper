from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    company: str
    link: str
    job_type: str
    work_mode: str
    description: str
    responsibilities: Optional[str] = None
    posted_date: datetime

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    scraped_at: datetime

    class Config:
        from_attributes = True
