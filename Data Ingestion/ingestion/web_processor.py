"""
web_processor.py
Web Content Processing Pipeline
Processes scraped web content similar to PDF processing
"""

from typing import Dict, List
from ingestion.cleaner import normalize_text
from ingestion.chunker import hybrid_chunker
from ingestion.metadata_extractor import generate_metadata
from ingestion.web_scraper import WebScraper
from ingestion.advanced_web_enhancer import WebContentEnhancer
from ingestion.simple_web_processor import process_reliable_websites
from ingestion.reliable_startup_urls import get_reliable_urls
import hashlib
import os

def process_web_content(url: str, content_data: Dict, chunk_size: int = 700) -> Dict:
    """
    Process web content through the same pipeline as PDFs
    """
    
    if content_data['status'] != 'success':
        raise Exception(f"Failed to scrape {url}: {content_data.get('error')}")
    
    raw_text = content_data['content']
    
    # Clean the text
    cleaned = normalize_text(raw_text, mode="basic")
    language = cleaned["language"]
    clean_text = cleaned["clean_text"]
    
    # Chunk the content
    chunks: List[str] = hybrid_chunker(clean_text, chunk_size=chunk_size)
    
    # Generate URL-based ID
    url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
    
    # Generate metadata with safe extra handling
    extra_data = {
        "title": content_data.get('title', ''),
        "description": content_data.get('description', ''),
        "keywords": content_data.get('keywords', ''),
        "word_count": content_data.get('word_count', 0),
        "scraped_at": content_data.get('scraped_at', ''),
        "url_hash": url_hash
    }
    
    metadata = generate_metadata(
        file_path=url,
        language=language,
        doc_type="web_content",
        source="web_scraper",
        extra=extra_data
    )
    
    return {
        "chunks": chunks,
        "metadata": metadata,
        "language": language,
        "raw_text": raw_text,
        "url": url,
        "title": content_data.get('title', ''),
        "url_hash": url_hash
    }

def process_multiple_websites(urls: List[str]) -> List[Dict]:
    """Process multiple websites through the enhanced pipeline"""
    
    scraper = WebScraper(delay=1.5)
    scraped_data = scraper.scrape_multiple(urls)
    
    # Enhance content quality
    enhancer = WebContentEnhancer()
    enhanced_data = enhancer.filter_high_quality_content(scraped_data, min_score=0.15)
    
    processed_results = []
    
    print(f"\n📊 Processing {len(enhanced_data)} high-quality websites...")
    
    for data in enhanced_data:
        try:
            result = process_web_content(data['url'], data)
            
            # Add enhancement metadata safely
            if 'extra' not in result['metadata']:
                result['metadata']['extra'] = {}
            
            result['metadata']['extra']['relevance_score'] = data.get('relevance_score', 0)
            result['metadata']['extra']['structured_info'] = data.get('structured_info', {})
            result['metadata']['extra']['summary'] = data.get('summary', '')
            
            processed_results.append(result)
            print(f"✓ Processed: {result['title']} (Score: {data.get('relevance_score', 0)}, {len(result['chunks'])} chunks)")
            
        except Exception as e:
            print(f"✗ Processing failed for {data['url']}: {e}")
    
    return processed_results

# Use reliable URLs as primary source
STARTUP_FUNDING_URLS = get_reliable_urls('government') + get_reliable_urls('news')[:3]

def process_websites(urls: List[str] = None) -> List[Dict]:
    """Process websites with reliable, simple approach"""
    if urls is None:
        # Use the reliable processor for default case
        return process_reliable_websites()
    else:
        # Use the enhanced processor for custom URLs
        return process_multiple_websites(urls)

if __name__ == "__main__":
    # Test processing
    results = process_multiple_websites(STARTUP_FUNDING_URLS[:2])  # Test with first 2 URLs
    
    for result in results:
        print(f"\nProcessed: {result['title']}")
        print(f"Language: {result['language']}")
        print(f"Chunks: {len(result['chunks'])}")
        print(f"Sample chunk: {result['chunks'][0][:200]}...")