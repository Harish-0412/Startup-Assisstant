"""
advanced_web_enhancer.py
Advanced Web Content Enhancement for Knowledge Base
Includes content validation, quality scoring, and intelligent filtering
"""

import re
from typing import Dict, List, Tuple
from urllib.parse import urlparse
import hashlib

class WebContentEnhancer:
    def __init__(self):
        self.startup_keywords = [
            'startup', 'funding', 'investment', 'venture capital', 'seed funding',
            'angel investor', 'incubator', 'accelerator', 'entrepreneur', 'business plan',
            'pitch deck', 'valuation', 'equity', 'revenue model', 'market research',
            'government scheme', 'grant', 'loan', 'subsidy', 'policy', 'eligibility'
        ]
        
        self.quality_indicators = [
            'eligibility', 'criteria', 'application', 'process', 'requirements',
            'amount', 'funding', 'scheme', 'program', 'benefits', 'guidelines'
        ]
    
    def calculate_relevance_score(self, content: str, title: str = "") -> float:
        """Calculate relevance score for startup funding content"""
        text = (content + " " + title).lower()
        
        # Count startup-related keywords
        keyword_matches = sum(1 for keyword in self.startup_keywords if keyword in text)
        keyword_score = min(keyword_matches / len(self.startup_keywords), 1.0)
        
        # Count quality indicators
        quality_matches = sum(1 for indicator in self.quality_indicators if indicator in text)
        quality_score = min(quality_matches / len(self.quality_indicators), 1.0)
        
        # Length score (prefer substantial content)
        word_count = len(text.split())
        length_score = min(word_count / 1000, 1.0) if word_count > 100 else 0.1
        
        # Combined score
        relevance_score = (keyword_score * 0.4 + quality_score * 0.4 + length_score * 0.2)
        
        return round(relevance_score, 3)
    
    def extract_key_information(self, content: str) -> Dict:
        """Extract structured information from web content"""
        
        # Extract funding amounts
        amount_patterns = [
            r'₹\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|crore|thousand)?',
            r'(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|crore|thousand)?\s*rupees?',
            r'\$\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(million|billion|thousand)?'
        ]
        
        amounts = []
        for pattern in amount_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            amounts.extend(matches)
        
        # Extract eligibility criteria
        eligibility_patterns = [
            r'eligibility[:\s]*([^.!?]*[.!?])',
            r'criteria[:\s]*([^.!?]*[.!?])',
            r'requirements[:\s]*([^.!?]*[.!?])'
        ]
        
        eligibility = []
        for pattern in eligibility_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            eligibility.extend([match.strip() for match in matches])
        
        # Extract application processes
        process_patterns = [
            r'application[:\s]*([^.!?]*[.!?])',
            r'apply[:\s]*([^.!?]*[.!?])',
            r'process[:\s]*([^.!?]*[.!?])'
        ]
        
        processes = []
        for pattern in process_patterns:
            matches = re.findall(pattern, content, re.IGNORECASE)
            processes.extend([match.strip() for match in matches])
        
        return {
            'funding_amounts': amounts[:5],  # Top 5 amounts
            'eligibility_criteria': eligibility[:3],  # Top 3 criteria
            'application_processes': processes[:3]  # Top 3 processes
        }
    
    def enhance_content(self, web_result: Dict) -> Dict:
        """Enhance web content with quality scoring and structured data"""
        
        if web_result['status'] != 'success':
            return web_result
        
        content = web_result['content']
        title = web_result.get('title', '')
        
        # Calculate relevance score
        relevance_score = self.calculate_relevance_score(content, title)
        
        # Extract structured information
        structured_info = self.extract_key_information(content)
        
        # Add enhancements to the result
        web_result['relevance_score'] = relevance_score
        web_result['structured_info'] = structured_info
        web_result['is_high_quality'] = relevance_score >= 0.3
        
        # Add content summary
        sentences = content.split('.')[:5]  # First 5 sentences
        web_result['summary'] = '. '.join(sentences).strip() + '.'
        
        return web_result
    
    def filter_high_quality_content(self, web_results: List[Dict], min_score: float = 0.2) -> List[Dict]:
        """Filter and return only high-quality, relevant content"""
        
        enhanced_results = [self.enhance_content(result) for result in web_results]
        
        # Filter by relevance score
        high_quality = [
            result for result in enhanced_results 
            if result.get('relevance_score', 0) >= min_score and result['status'] == 'success'
        ]
        
        # Sort by relevance score (highest first)
        high_quality.sort(key=lambda x: x.get('relevance_score', 0), reverse=True)
        
        return high_quality

def enhance_startup_websites() -> List[Dict]:
    """Enhanced startup website processing with quality filtering"""
    
    from ingestion.web_scraper import scrape_startup_websites
    
    # Scrape websites
    raw_results = scrape_startup_websites()
    
    # Enhance and filter
    enhancer = WebContentEnhancer()
    enhanced_results = enhancer.filter_high_quality_content(raw_results)
    
    print(f"\n📊 Content Quality Report:")
    print(f"Total scraped: {len(raw_results)}")
    print(f"High quality: {len(enhanced_results)}")
    
    for result in enhanced_results:
        print(f"✓ {result['title'][:50]}... (Score: {result['relevance_score']})")
    
    return enhanced_results

if __name__ == "__main__":
    # Test enhancement
    results = enhance_startup_websites()
    
    for result in results[:2]:  # Show top 2 results
        print(f"\nTitle: {result['title']}")
        print(f"Relevance Score: {result['relevance_score']}")
        print(f"Summary: {result['summary'][:200]}...")
        print(f"Structured Info: {result['structured_info']}")