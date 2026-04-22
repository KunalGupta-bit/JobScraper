import asyncio
import random
from typing import List, Dict
from playwright.async_api import async_playwright
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BaseScraper:
    def __init__(self):
        self.jobs: List[Dict] = []
        self.user_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0'
        ]

    async def fetch_page(self, url: str) -> str:
        """Fetch page content using Playwright."""
        html_content = ""
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context(
                user_agent=random.choice(self.user_agents),
                viewport={'width': 1920, 'height': 1080}
            )
            page = await context.new_page()
            try:
                # Adding random delay
                await asyncio.sleep(random.uniform(2, 5))
                logger.info(f"Navigating to {url}")
                await page.goto(url, wait_until="domcontentloaded", timeout=60000)
                html_content = await page.content()
            except Exception as e:
                logger.error(f"Error fetching {url}: {e}")
            finally:
                await browser.close()
        return html_content

    async def scrape(self) -> List[Dict]:
        """To be implemented by child classes."""
        raise NotImplementedError
