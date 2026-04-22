import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict

def process_and_filter_jobs(raw_jobs: List[Dict]) -> List[Dict]:
    """
    Cleans, structures, filters, and removes duplicates from scraped jobs using Pandas.
    Requires: Only fresher/internships, posted within last 7 days.
    """
    if not raw_jobs:
        return []

    df = pd.DataFrame(raw_jobs)

    # 1. Deduplicate by Job Title + Company Name
    # Normalize title and company for deduplication
    df['dup_title'] = df['title'].str.lower().str.strip()
    df['dup_company'] = df['company'].str.lower().str.strip()
    df.drop_duplicates(subset=['dup_title', 'dup_company'], keep='first', inplace=True)
    df.drop(columns=['dup_title', 'dup_company'], inplace=True)

    # 2. Filter by Date (Last 7 days)
    now = datetime.utcnow()
    seven_days_ago = now - timedelta(days=7)
    df['posted_date'] = pd.to_datetime(df['posted_date'], errors='coerce')
    df = df[df['posted_date'] >= seven_days_ago]

    # 3. Filter by Job Type (Only Internship / Fresher)
    # We assume 'job_type' is already parsed as 'Internship' or 'Full-time'
    # Since we want Fresher / Entry-level roles or Internships, we can keep everything here if we assume 
    # the scraper is only searching for those keywords on the platform.
    # But just to be strict:
    def is_fresher_or_intern(row):
        title = str(row.get('title', '')).lower()
        desc = str(row.get('description', '')).lower()
        job_type = str(row.get('job_type', '')).lower()
        
        if "intern" in job_type or "intern" in title or "intern" in desc:
            return True
        if "fresher" in title or "fresher" in desc or "entry" in title or "entry" in desc or "junior" in title:
            return True
        return False
        
    mask = df.apply(is_fresher_or_intern, axis=1)
    df = df[mask]

    # Handle NaNs and convert back to dicts
    df = df.fillna('')
    return df.to_dict('records')
