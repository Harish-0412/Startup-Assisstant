"""
simple_web_processor.py
Simplified web processing focused on reliability and getting results
"""

from typing import Dict, List
from ingestion.cleaner import normalize_text
from ingestion.chunker import hybrid_chunker
from ingestion.metadata_extractor import generate_metadata
from ingestion.simple_web_scraper import SimpleWebScraper
import hashlib

def process_simple_web_content(url: str, content_data: Dict) -> Dict:
    """Process web content with simplified, reliable approach"""
    
    if content_data['status'] != 'success':
        raise Exception(f"Scraping failed: {content_data.get('error')}")
    
    raw_text = content_data['content']
    
    # Clean text
    cleaned = normalize_text(raw_text, mode="basic")
    clean_text = cleaned["clean_text"]
    language = cleaned["language"]
    
    # Create chunks
    chunks = hybrid_chunker(clean_text, chunk_size=700)
    
    # Generate URL hash for ID
    url_hash = hashlib.md5(url.encode()).hexdigest()[:8]
    
    # Create metadata
    metadata = generate_metadata(
        file_path=url,
        language=language,
        doc_type="web_content",
        source="simple_web_scraper",
        extra={
            "title": content_data.get('title', ''),
            "word_count": content_data.get('word_count', 0),
            "url_hash": url_hash,
            "scraped_at": content_data.get('scraped_at', '')
        }
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

def process_reliable_websites() -> List[Dict]:
    """Process a curated list of reliable startup funding websites"""
    
    # Reliable URLs that are likely to work
    reliable_urls = [
        "https://www.startupindia.gov.in/",
        "https://yourstory.com/",
        "https://inc42.com/",
        "https://www.livemint.com/companies/start-ups",
        "https://economictimes.indiatimes.com/small-biz/startups",
        "https://msme.gov.in/",
        "https://www.sidbi.in/"
    ]
    
    print(f"Processing {len(reliable_urls)} reliable websites...")
    
    # Scrape websites
    scraper = SimpleWebScraper()
    scraped_data = scraper.scrape_multiple(reliable_urls)
    
    # Process successful scrapes
    processed_results = []
    successful_scrapes = [data for data in scraped_data if data['status'] == 'success']
    
    print(f"\nProcessing {len(successful_scrapes)} successful scrapes...")
    
    for data in successful_scrapes:
        try:
            result = process_simple_web_content(data['url'], data)
            processed_results.append(result)
            print(f"Processed: {result['title'][:50]}... ({len(result['chunks'])} chunks)")
        except Exception as e:
            print(f"Processing failed for {data['url']}: {e}")
    
    return processed_results

if __name__ == "__main__":
    results = process_reliable_websites()
    print(f"\nFinal Results: {len(results)} websites processed successfully")