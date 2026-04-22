from bs4 import BeautifulSoup
from scraper.base import BaseScraper
from utils.parser import parse_work_mode, parse_job_type, parse_date
from datetime import datetime

class SimplyHiredScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        self.urls = [
            "https://www.simplyhired.co.in/search?q=fresher",
            "https://www.simplyhired.co.in/search?q=internship"
        ]

    async def scrape(self):
        jobs = []
        for url in self.urls:
            html = await self.fetch_page(url)
            if not html:
                continue
                
            soup = BeautifulSoup(html, 'html.parser')
            job_cards = soup.find_all('div', attrs={'data-testid': 'searchSerpJob'})
            if not job_cards:
                 job_cards = soup.find_all('li', class_='css-0')
            
            for card in job_cards:
                try:
                    title_elem = card.find('h2', attrs={'data-testid': 'searchSerpJobTitle'})
                    if not title_elem:
                        title_elem = card.find('h2')
                        
                    title_a = title_elem.find('a') if title_elem else None
                    title = title_a.text.strip() if title_a else (title_elem.text.strip() if title_elem else "Unknown Title")
                    
                    # Company is usually in a span or text block nearby, we'll search for typical company test ID or fallback
                    company_elem = card.find(attrs={'data-testid': 'companyName'})
                    company = company_elem.text.strip() if company_elem else "Unknown Company"
                    
                    link = title_a['href'] if title_a and 'href' in title_a.attrs else ""
                    if link and not link.startswith('http'):
                        link = "https://www.simplyhired.co.in" + link
                    
                    # Extract date
                    date_elem = card.find(attrs={'data-testid': 'searchSerpJobDateStamp'})
                    date_str = date_elem.text.strip() if date_elem else "today"
                    posted_date = parse_date(date_str)
                    
                    # Extract work mode and job type based on title/url context
                    work_mode = parse_work_mode("", title)
                    job_type = parse_job_type("", title)
                    if "internship" in url:
                        job_type = "Internship"
                    
                    # Description
                    snippet = card.find(attrs={'data-testid': 'searchSerpJobSnippet'})
                    description = snippet.text.strip() if snippet else f"Opportunity at {company} as {title}. Apply at {link}."
                    
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
                    print(f"Error parsing SimplyHired job card: {e}")
                    
        return jobs
