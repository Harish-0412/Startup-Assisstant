"""
web_scraper.py
Advanced Web Content Extractor for Knowledge Base Enhancement
Supports multiple content types and intelligent extraction
"""

import requests
from bs4 import BeautifulSoup
import time
import re
from urllib.parse import urljoin, urlparse
from typing import Dict, List, Optional
import json
from datetime import datetime

class WebScraper:
    def __init__(self, delay: float = 1.0):
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def extract_content(self, url: str) -> Dict:
        """Extract clean content from a single URL with robust error handling"""
        try:
            # Add headers to avoid blocking
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
            }
            
            response = self.session.get(url, timeout=15, headers=headers, allow_redirects=True)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe', 'noscript']):
                element.decompose()
            
            # Extract title
            title = soup.find('title')
            title = title.get_text().strip() if title else urlparse(url).netloc
            
            # Try multiple content selectors
            content_selectors = [
                'main', 'article', '.content', '#content', '.main-content',
                '.post-content', '.entry-content', '.article-body', '.page-content',
                '[role="main"]', '.container', '.wrapper'
            ]
            
            main_content = None
            for selector in content_selectors:
                main_content = soup.select_one(selector)
                if main_content and len(main_content.get_text(strip=True)) > 100:
                    break
            
            if not main_content:
                main_content = soup.find('body')
            
            # Extract text with better formatting
            if main_content:
                # Remove remaining unwanted elements
                for element in main_content(['script', 'style', 'nav', 'footer', 'header', 'aside']):
                    element.decompose()
                
                text = main_content.get_text(separator=' ', strip=True)
            else:
                text = soup.get_text(separator=' ', strip=True)
            
            # Clean text more thoroughly
            text = re.sub(r'\s+', ' ', text)
            text = re.sub(r'\n+', '\n', text)
            text = text.strip()
            
            # Skip if content is too short
            if len(text.split()) < 50:
                return {
                    'url': url,
                    'error': 'Content too short (less than 50 words)',
                    'status': 'failed',
                    'scraped_at': datetime.now().isoformat()
                }
            
            # Extract metadata
            meta_description = soup.find('meta', attrs={'name': 'description'})
            description = meta_description.get('content', '') if meta_description else ''
            
            meta_keywords = soup.find('meta', attrs={'name': 'keywords'})
            keywords = meta_keywords.get('content', '') if meta_keywords else ''
            
            return {
                'url': url,
                'title': title,
                'content': text,
                'description': description,
                'keywords': keywords,
                'word_count': len(text.split()),
                'scraped_at': datetime.now().isoformat(),
                'status': 'success'
            }
            
        except requests.exceptions.RequestException as e:
            return {
                'url': url,
                'error': f'Request failed: {str(e)}',
                'status': 'failed',
                'scraped_at': datetime.now().isoformat()
            }
        except Exception as e:
            return {
                'url': url,
                'error': f'Processing failed: {str(e)}',
                'status': 'failed',
                'scraped_at': datetime.now().isoformat()
            }
    
    def scrape_multiple(self, urls: List[str]) -> List[Dict]:
        """Scrape multiple URLs with rate limiting"""
        results = []
        
        for i, url in enumerate(urls):
            print(f"Scraping {i+1}/{len(urls)}: {url}")
            
            result = self.extract_content(url)
            results.append(result)
            
            if result['status'] == 'success':
                print(f"✓ Success: {result['word_count']} words extracted")
            else:
                print(f"✗ Failed: {result.get('error', 'Unknown error')}")
            
            # Rate limiting
            if i < len(urls) - 1:
                time.sleep(self.delay)
        
        return results

def scrape_startup_websites() -> List[Dict]:
    """Scrape relevant startup funding websites"""
    
    startup_urls = [
        # Government funding sites
        "https://www.startupindia.gov.in/content/sih/en/government-schemes.html",
        "https://www.investindia.gov.in/startup-india",
        
        # Funding information sites
        "https://yourstory.com/2023/07/startup-funding-schemes-government-india",
        "https://inc42.com/resources/startup-funding-guide/",
        
        # Startup ecosystem sites
        "https://nasscom.in/knowledge-center/publications/startup-ecosystem",
        "https://www.entrepreneur.com/en-in/starting-a-business/funding",
    ]
    
    scraper = WebScraper(delay=2.0)  # 2 second delay between requests
    return scraper.scrape_multiple(startup_urls)

if __name__ == "__main__":
    # Test scraping
    results = scrape_startup_websites()
    
    for result in results:
        if result['status'] == 'success':
            print(f"\nTitle: {result['title']}")
            print(f"Words: {result['word_count']}")
            print(f"Content preview: {result['content'][:200]}...")
        else:
            print(f"\nFailed to scrape: {result['url']}")
            print(f"Error: {result.get('error')}")