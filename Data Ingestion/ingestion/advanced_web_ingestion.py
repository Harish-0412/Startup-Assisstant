"""
advanced_web_ingestion.py
Advanced Web Ingestion Interface
Provides multiple ingestion modes for comprehensive knowledge base enhancement
"""

from ingestion.web_processor import process_multiple_websites
from ingestion.startup_urls_database import get_priority_urls, get_categorized_urls, COMPREHENSIVE_STARTUP_URLS
from ingestion.reliable_startup_urls import get_reliable_urls
from ingestion.advanced_web_enhancer import WebContentEnhancer
import json
import os

def ingest_by_priority(priority_level='high'):
    """Ingest websites by priority level using reliable URLs"""
    from ingestion.simple_web_processor import process_reliable_websites
    
    print(f"🎯 Ingesting {priority_level} priority websites (reliable sources)")
    return process_reliable_websites()

def ingest_by_category(category='government'):
    """Ingest websites by category"""
    categories = get_categorized_urls()
    urls = categories.get(category, [])
    print(f"📂 Ingesting {category} websites ({len(urls)} URLs)")
    return process_multiple_websites(urls)

def ingest_comprehensive():
    """Ingest all available startup funding websites"""
    print(f"🌐 Comprehensive ingestion ({len(COMPREHENSIVE_STARTUP_URLS)} URLs)")
    return process_multiple_websites(COMPREHENSIVE_STARTUP_URLS)

def ingest_custom_urls(urls_list):
    """Ingest custom list of URLs"""
    print(f"🔧 Custom URL ingestion ({len(urls_list)} URLs)")
    return process_multiple_websites(urls_list)

def interactive_web_ingestion():
    """Interactive web ingestion with user choices"""
    print("\n🚀 Advanced Web Ingestion System")
    print("=" * 50)
    print("1️⃣ High Priority URLs (Government + Top Educational)")
    print("2️⃣ Medium Priority URLs (Additional Educational + Ecosystem)")
    print("3️⃣ All URLs (Comprehensive Coverage)")
    print("4️⃣ By Category (Government, Educational, etc.)")
    print("5️⃣ Custom URLs")
    print("6️⃣ Back to Main Menu")
    
    choice = input("\n👉 Select ingestion mode: ").strip()
    
    if choice == "1":
        return ingest_by_priority('high')
    elif choice == "2":
        return ingest_by_priority('medium')
    elif choice == "3":
        return ingest_comprehensive()
    elif choice == "4":
        return category_selection()
    elif choice == "5":
        return custom_url_input()
    else:
        return None

def category_selection():
    """Category-based ingestion selection"""
    categories = get_categorized_urls()
    
    print("\n📂 Available Categories:")
    for i, category in enumerate(categories.keys(), 1):
        print(f"{i}️⃣ {category.title()} ({len(categories[category])} URLs)")
    
    try:
        choice = int(input("\n👉 Select category: ")) - 1
        category_name = list(categories.keys())[choice]
        return ingest_by_category(category_name)
    except (ValueError, IndexError):
        print("❌ Invalid selection")
        return None

def custom_url_input():
    """Custom URL input for ingestion"""
    print("\n🔧 Custom URL Ingestion")
    print("Enter URLs one per line (empty line to finish):")
    
    urls = []
    while True:
        url = input("URL: ").strip()
        if not url:
            break
        if url.startswith('http'):
            urls.append(url)
        else:
            print("⚠️ Please enter valid URLs starting with http/https")
    
    if urls:
        return ingest_custom_urls(urls)
    else:
        print("❌ No valid URLs provided")
        return None

def save_web_ingestion_report(results, report_path="data/web_ingestion_report.json"):
    """Save detailed ingestion report"""
    os.makedirs(os.path.dirname(report_path), exist_ok=True)
    
    report = {
        "total_processed": len(results),
        "successful_ingestions": len([r for r in results if r.get('chunks')]),
        "total_chunks": sum(len(r.get('chunks', [])) for r in results),
        "languages_detected": list(set(r.get('language', 'unknown') for r in results)),
        "websites": []
    }
    
    for result in results:
        website_info = {
            "title": result.get('title', 'Unknown'),
            "url": result.get('url', ''),
            "language": result.get('language', 'unknown'),
            "chunks_count": len(result.get('chunks', [])),
            "relevance_score": result.get('metadata', {}).get('extra', {}).get('relevance_score', 0),
            "word_count": result.get('metadata', {}).get('extra', {}).get('word_count', 0)
        }
        report["websites"].append(website_info)
    
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"📊 Ingestion report saved: {report_path}")
    return report

if __name__ == "__main__":
    # Test interactive ingestion
    results = interactive_web_ingestion()
    
    if results:
        report = save_web_ingestion_report(results)
        print(f"\n✅ Ingestion Complete!")
        print(f"Processed: {report['total_processed']} websites")
        print(f"Total chunks: {report['total_chunks']}")
        print(f"Languages: {', '.join(report['languages_detected'])}")
    else:
        print("\n❌ No ingestion performed")