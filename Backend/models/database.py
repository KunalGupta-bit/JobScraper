from sqlalchemy import create_engine, Column, Integer, String, DateTime, Text, UniqueConstraint
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./jobs.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class JobModel(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    link = Column(String)
    job_type = Column(String) # Internship, Full-time
    work_mode = Column(String) # Remote, Hybrid, Onsite
    description = Column(Text)
    responsibilities = Column(Text, nullable=True)
    posted_date = Column(DateTime)
    scraped_at = Column(DateTime, default=datetime.utcnow)

    # Prevent duplicates based on title and company
    __table_args__ = (
        UniqueConstraint('title', 'company', name='_title_company_uc'),
    )

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
Base.metadata.create_all(bind=engine)
