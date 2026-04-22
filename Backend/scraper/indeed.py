from bs4 import BeautifulSoup
from scraper.base import BaseScraper
from utils.parser import parse_work_mode, parse_job_type, parse_date
from datetime import datetime
import urllib.parse

class IndeedScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        self.urls = [
            "https://in.indeed.com/jobs?q=fresher",
            "https://in.indeed.com/jobs?q=internship"
        ]

    async def scrape(self):
        jobs = []
        for url in self.urls:
            html = await self.fetch_page(url)
            if not html:
                continue
                
            soup = BeautifulSoup(html, 'html.parser')
            job_cards = soup.find_all(class_=lambda x: x and 'job_seen_beacon' in x)
            
            for card in job_cards:
                try:
                    title_elem = card.find('h2', class_=lambda x: x and 'jobTitle' in x)
                    title_span = title_elem.find('span') if title_elem else None
                    title = title_span.text.strip() if title_span else (title_elem.text.strip() if title_elem else "Unknown Title")
                    
                    title_a = title_elem.find('a') if title_elem else None
                    link = title_a['href'] if title_a and 'href' in title_a.attrs else ""
                    if link and not link.startswith('http'):
                        link = "https://in.indeed.com" + link
                        
                    # Find Company
                    company_elem = card.find(attrs={'data-testid': 'company-name'})
                    if not company_elem:
                        company_elem = card.find(class_=lambda x: x and 'companyName' in x)
                    company = company_elem.text.strip() if company_elem else "Unknown Company"
                    
                    # Find Date
                    date_elem = card.find(class_=lambda x: x and 'date' in x)
                    date_str = date_elem.text.replace('Posted', '').replace('EmployerActive', '').strip() if date_elem else "today"
                    posted_date = parse_date(date_str)
                    
                    # Work mode and type
                    work_mode = parse_work_mode("", title)
                    job_type = parse_job_type("", title)
                    if "internship" in url:
                        job_type = "Internship"
                        
                    description = f"Opportunity at {company} as {title}. Apply at {link}."
                    
                    job = {
                        "title": title,
                        "company": company,
                        "link": link,
                        "job_type": job_type,
                        "work_mode": work_mode,
                        "description": description,
                        "responsibilities": "",
                        "posted_date": posted_date,
                        "scraped_at": datetime.utcnow()
                    }
                    jobs.append(job)
                except Exception as e:
                    print(f"Error parsing Indeed job card: {e}")
                    
        return jobs
