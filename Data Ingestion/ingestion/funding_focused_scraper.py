"""
funding_focused_scraper.py
Specialized web scraper for startup funding information
Targets specific funding schemes, eligibility, and application processes
"""

import requests
from bs4 import BeautifulSoup
import re
from typing import Dict, List
from datetime import datetime

class FundingFocusedScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        # Funding-specific keywords for content filtering
        self.funding_keywords = [
            'startup funding', 'seed funding', 'venture capital', 'angel investment',
            'government scheme', 'grant', 'loan', 'subsidy', 'financial assistance',
            'eligibility criteria', 'application process', 'funding amount',
            'startup policy', 'entrepreneur support', 'business loan'
        ]
    
    def extract_funding_content(self, url: str) -> Dict:
        """Extract funding-specific content from URL"""
        try:
            response = self.session.get(url, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove unwanted elements
            for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
                element.decompose()
            
            title = soup.find('title')
            title = title.get_text().strip() if title else 'No Title'
            
            # Extract funding-relevant sections
            funding_sections = self._extract_funding_sections(soup)
            
            if not funding_sections:
                return {
                    'url': url,
                    'status': 'failed',
                    'error': 'No funding-relevant content found',
                    'scraped_at': datetime.now().isoformat()
                }
            
            # Combine funding sections
            content = ' '.join(funding_sections)
            content = re.sub(r'\s+', ' ', content).strip()
            
            # Extract structured funding information
            funding_info = self._extract_funding_details(content)
            
            return {
                'url': url,
                'title': title,
                'content': content,
                'funding_info': funding_info,
                'word_count': len(content.split()),
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
    
    def _extract_funding_sections(self, soup) -> List[str]:
        """Extract sections containing funding information"""
        funding_sections = []
        
        # Look for funding-related headings and their content
        for keyword in ['funding', 'scheme', 'grant', 'loan', 'eligibility', 'application']:
            # Find headings containing funding keywords
            headings = soup.find_all(['h1', 'h2', 'h3', 'h4'], 
                                   string=re.compile(keyword, re.IGNORECASE))
            
            for heading in headings:
                # Get content after the heading
                section_content = []
                current = heading.next_sibling
                
                while current and current.name not in ['h1', 'h2', 'h3', 'h4']:
                    if hasattr(current, 'get_text'):
                        text = current.get_text(strip=True)
                        if text and len(text) > 20:  # Only substantial content
                            section_content.append(text)
                    current = current.next_sibling
                
                if section_content:
                    funding_sections.extend(section_content)
        
        # If no specific sections found, look for paragraphs with funding keywords
        if not funding_sections:
            paragraphs = soup.find_all('p')
            for p in paragraphs:
                text = p.get_text(strip=True)
                if any(keyword.lower() in text.lower() for keyword in self.funding_keywords):
                    if len(text) > 50:  # Substantial content only
                        funding_sections.append(text)
        
        return funding_sections[:10]  # Limit to top 10 relevant sections
    
    def _extract_funding_details(self, content: str) -> Dict:
        """Extract specific funding details from content"""
        
        # Extract funding amounts
        amount_patterns = [
            r'₹\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|crore|thousand)?',
            r'(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|crore|thousand)?\s*rupees?',
            r'\$\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(million|billion|thousand)?'
        ]
        
        amounts = []
        for pattern in amount_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            amounts.extend([f"{match[0]} {match[1]}".strip() for match in matches])
        
        # Extract eligibility criteria
        eligibility_patterns = [
            r'eligibility[:\s]*([^.!?]*[.!?])',
            r'criteria[:\s]*([^.!?]*[.!?])',
            r'requirements[:\s]*([^.!?]*[.!?])',
            r'eligible[:\s]*([^.!?]*[.!?])'
        ]
        
        eligibility = []
        for pattern in eligibility_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            eligibility.extend([match.strip() for match in matches])
        
        # Extract application information
        application_patterns = [
            r'application[:\s]*([^.!?]*[.!?])',
            r'apply[:\s]*([^.!?]*[.!?])',
            r'process[:\s]*([^.!?]*[.!?])',
            r'how to apply[:\s]*([^.!?]*[.!?])'
        ]
        
        applications = []
        for pattern in application_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            applications.extend([match.strip() for match in matches])
        
        return {
            'funding_amounts': amounts[:5],
            'eligibility_criteria': eligibility[:3],
            'application_processes': applications[:3]
        }

def scrape_funding_websites() -> List[Dict]:
    """Scrape funding-focused websites"""
    
    funding_urls = [
        "https://www.startupindia.gov.in/",
        "https://msme.gov.in/",
        "https://www.sidbi.in/",
        "https://yourstory.com/",
        "https://inc42.com/"
    ]
    
    scraper = FundingFocusedScraper()
    results = []
    
    for url in funding_urls:
        print(f"Scraping funding info from: {url}")
        result = scraper.extract_funding_content(url)
        results.append(result)
        
        if result['status'] == 'success':
            print(f"Success: {result['word_count']} words, {len(result['funding_info']['funding_amounts'])} amounts found")
        else:
            print(f"Failed: {result['error']}")
    
    return results

if __name__ == "__main__":
    results = scrape_funding_websites()
    successful = [r for r in results if r['status'] == 'success']
    print(f"\nResults: {len(successful)}/{len(results)} successful funding extractions")