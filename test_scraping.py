#!/usr/bin/env python
import requests
import json

url = 'http://localhost:8000/rag/scrape-websites'
data = {'urls': ['https://en.wikipedia.org/wiki/Intuit_Mint']}

try:
    print("🔍 Testing website scraping with Intuit Mint Wikipedia URL...")
    response = requests.post(url, json=data, timeout=30)
    result = response.json()
    
    print('\n✅ Scraping Response:')
    print(f"Success: {result.get('success')}")
    print(f"Message: {result.get('message')}")
    
    if result.get('success'):
        scraped_data = result.get('scraped_data', [])
        print(f"\n📊 Scraped {len(scraped_data)} website(s):")
        
        for site in scraped_data:
            print(f"\n{'='*60}")
            print(f"Title: {site.get('title')}")
            print(f"URL: {site.get('url')}")
            print(f"Word Count: {site.get('word_count')}")
            print(f"Key Topics: {site.get('key_topics')}")
            print(f"Relevance Score: {site.get('relevance_score')}")
            print(f"Processed: {site.get('processed')}")
            print(f"Summary: {site.get('summary', '')[:200]}...")
    else:
        print(f"Error: {result.get('detail', 'Unknown error')}")
        
except Exception as e:
    print(f'❌ Error: {str(e)}')
    import traceback
    traceback.print_exc()
