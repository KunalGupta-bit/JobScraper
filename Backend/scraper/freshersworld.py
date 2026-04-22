from bs4 import BeautifulSoup
from scraper.base import BaseScraper
from utils.parser import parse_work_mode, parse_job_type, parse_date
from datetime import datetime

class FreshersworldScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        self.urls = [
            "https://www.freshersworld.com/jobs/category/it-software-job-vacancies"
        ]

    async def scrape(self):
        jobs = []
        for url in self.urls:
            html = await self.fetch_page(url)
            if not html:
                continue
                
            soup = BeautifulSoup(html, 'html.parser')
            job_cards = soup.find_all(class_='job-container')
            
            for card in job_cards:
                try:
                    title_elem = card.find('span', class_='wrap-title')
                    if not title_elem:
                        continue
                    
                    title = title_elem.text.replace('Less', '').strip()
                    
                    company_elem = card.find('h3', class_='latest-jobs-title')
                    company = company_elem.text.strip() if company_elem else "Unknown Company"
                    
                    # Freshersworld stores the link in the parent div 'job_display_url' or an 'a' tag
                    link = card.get('job_display_url', '')
                    if not link:
                        a_tag = card.find('a')
                        link = a_tag['href'] if a_tag and 'href' in a_tag.attrs else ""
                    
                    # Extract date
                    date_elem = card.find('span', class_='ago-text')
                    date_str = date_elem.text.strip() if date_elem else "today"
                    posted_date = parse_date(date_str)
                    
                    # Extract work mode and job type based on title/url context
                    work_mode = parse_work_mode("", title)
                    job_type = parse_job_type("", title)
                    
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
                    print(f"Error parsing Freshersworld job card: {e}")
                    
        return jobs
