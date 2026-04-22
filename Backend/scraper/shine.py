from bs4 import BeautifulSoup
from scraper.base import BaseScraper
from utils.parser import parse_work_mode, parse_job_type, parse_date
from datetime import datetime

class ShineScraper(BaseScraper):
    def __init__(self):
        super().__init__()
        self.urls = [
            "https://www.shine.com/job-search/fresher-jobs"
        ]

    async def scrape(self):
        jobs = []
        for url in self.urls:
            html = await self.fetch_page(url)
            if not html:
                continue
                
            soup = BeautifulSoup(html, 'html.parser')
            # Extract divs containing jobCard in their class
            job_cards = [d for d in soup.find_all('div') if d.get('class') and any('jobCardNova_bigCard' in c for c in d.get('class'))]
            
            for card in job_cards:
                try:
                    title_elem = card.find('h3')
                    title = title_elem.text.strip() if title_elem else "Unknown Title"
                    
                    company_elem = card.find('span', class_=lambda c: c and 'TitleName' in c)
                    company = company_elem.text.strip() if company_elem else "Unknown Company"
                    
                    link_elem = title_elem.find('a') if title_elem else None
                    link = link_elem['href'] if link_elem and 'href' in link_elem.attrs else ""
                    if link and not link.startswith('http'):
                        link = "https://www.shine.com" + link
                    elif not link:
                        meta_link = card.find('meta', itemprop='url')
                        if meta_link:
                            link = meta_link.get('content', '')
                    
                    # Extract date
                    date_elem = card.find('span', class_=lambda c: c and 'postedData' in c)
                    date_str = date_elem.text.replace('posted', '').strip() if date_elem else "today"
                    posted_date = parse_date(date_str)
                    
                    # Extract work mode and job type based on title/url context
                    work_mode = parse_work_mode("", title)
                    job_type = parse_job_type("", title)
                    
                    # Description/Responsibilities
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
                    print(f"Error parsing Shine job card: {e}")
                    
        return jobs
