from bs4 import BeautifulSoup
from scraper.base import BaseScraper
from utils.parser import parse_work_mode, parse_job_type, parse_date
from datetime import datetime

class InternshalaScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        # Searching for internships in software development for freshers
        self.urls = [
            "https://internshala.com/internships/software-development-internship/",
            "https://internshala.com/jobs/fresher-jobs/"
        ]

    async def scrape(self):
        jobs = []
        for url in self.urls:
            html = await self.fetch_page(url)
            if not html:
                continue
                
            soup = BeautifulSoup(html, 'html.parser')
            job_cards = soup.find_all('div', class_='individual_internship')
            
            for card in job_cards:
                try:
                    title_elem = card.find('a', class_='job-title-href')
                    title = title_elem.text.strip() if title_elem else "Unknown Title"
                    
                    company_elem = card.find('p', class_='company-name')
                    company = company_elem.text.strip() if company_elem else "Unknown Company"
                    
                    link = "https://internshala.com" + title_elem['href'] if title_elem and 'href' in title_elem.attrs else ""
                    if not link:
                        link = "https://internshala.com" + card.get('data-href', '')
                    
                    # Extract date
                    date_elem = card.select_one('.color-labels span')
                    date_str = date_elem.text.strip() if date_elem else "today"
                    posted_date = parse_date(date_str)
                    
                    # Extract work mode and job type based on title/url context
                    work_mode = parse_work_mode("", title)
                    location_elem = card.find('div', class_='locations')
                    if location_elem and ("work from home" in location_elem.text.lower() or "remote" in location_elem.text.lower()):
                        work_mode = "Remote"
                    elif not location_elem:
                        pass # keep what parse_work_mode returned
                        
                    job_type = "Internship" if "internship" in url else "Full-time"
                    job_type = parse_job_type("", title) if job_type == "Full-time" else job_type

                    # Description/Responsibilities
                    desc_elem = card.select_one('.about_job .text')
                    if desc_elem:
                        description = desc_elem.text.strip()
                    else:
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
                    print(f"Error parsing job card: {e}")
                    
        return jobs
