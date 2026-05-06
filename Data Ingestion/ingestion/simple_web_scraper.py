"""
simple_web_scraper.py
Simple, robust web scraper focused on reliability over complexity
"""

import requests
from bs4 import BeautifulSoup
import time
from datetime import datetime
from typing import Dict, List

class SimpleWebScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_url(self, url: str) -> Dict:
        """Simple, reliable URL scraping"""
        try:
            print(f"Scraping: {url}")
            response = self.session.get(url, timeout=10)
            
            if response.status_code != 200:
                return {
                    'url': url,
                    'status': 'failed',
                    'error': f'HTTP {response.status_code}',
                    'scraped_at': datetime.now().isoformat()
                }
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Get title
            title_tag = soup.find('title')
            title = title_tag.get_text().strip() if title_tag else 'No Title'
            
            # Remove unwanted elements
            for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
                tag.decompose()
            
            # Get main text content
            text = soup.get_text(separator=' ', strip=True)
            
            # Basic cleaning
            text = ' '.join(text.split())  # Remove extra whitespace
            
            word_count = len(text.split())
            
            if word_count < 50:
                return {
                    'url': url,
                    'status': 'failed',
                    'error': f'Content too short ({word_count} words)',
                    'scraped_at': datetime.now().isoformat()
                }
            
            return {
                'url': url,
                'title': title,
                'content': text,
                'word_count': word_count,
                'status': 'success',
                'scraped_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                'url': url,
                'status': 'failed',
                'error': str(e),
                'scraped_at': datetime.now().isoformat()
            }
    
    def scrape_multiple(self, urls: List[str]) -> List[Dict]:
        """Scrape multiple URLs with basic rate limiting"""
        results = []
        
        for i, url in enumerate(urls):
            print(f"Processing {i+1}/{len(urls)}: {url}")
            result = self.scrape_url(url)
            results.append(result)
            
            if result['status'] == 'success':
                print(f"Success: {result['word_count']} words")
            else:
                print(f"Failed: {result['error']}")
            
            # Rate limiting
            if i < len(urls) - 1:
                time.sleep(2)
        
        return results

def quick_scrape_test():
    """Quick test of reliable URLs"""
    test_urls = [
        "https://www.startupindia.gov.in/",
        "https://yourstory.com/",
        "https://inc42.com/"
    ]
    
    scraper = SimpleWebScraper()
    results = scraper.scrape_multiple(test_urls)
    
    successful = [r for r in results if r['status'] == 'success']
    print(f"\nResults: {len(successful)}/{len(results)} successful")
    
    return results

if __name__ == "__main__":
    quick_scrape_test()