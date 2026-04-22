import re
from datetime import datetime, timedelta

def parse_work_mode(description: str, title: str = "") -> str:
    """Detect work mode from description or title."""
    text = (description + " " + title).lower()
    if "remote" in text or "work from home" in text:
        return "Remote"
    elif "hybrid" in text:
        return "Hybrid"
    else:
        return "Onsite"

def parse_job_type(description: str, title: str = "") -> str:
    """Detect job type from title or description."""
    text = (description + " " + title).lower()
    if "intern" in text:
        return "Internship"
    else:
        return "Full-time"

def parse_date(date_str: str) -> datetime:
    """Convert text like '2 days ago', 'Posted today' into actual datetime."""
    date_str = date_str.lower().strip()
    now = datetime.utcnow()
    
    if "today" in date_str or "just now" in date_str or "hours ago" in date_str or "hour ago" in date_str or "minutes ago" in date_str:
        return now
    elif "yesterday" in date_str:
        return now - timedelta(days=1)
    
    # Extract number for days/weeks
    match = re.search(r'(\d+)\s+(day|week|month)s?\s+ago', date_str)
    if match:
        val = int(match.group(1))
        unit = match.group(2)
        if unit == "day":
            return now - timedelta(days=val)
        elif unit == "week":
            return now - timedelta(weeks=val)
        elif unit == "month":
            return now - timedelta(days=val * 30)
            
    # Fallback, return now if unparseable, or could raise exception
    return now
