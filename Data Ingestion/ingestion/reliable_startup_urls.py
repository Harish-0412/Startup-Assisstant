"""
reliable_startup_urls.py
Curated list of reliable, working startup funding URLs
Tested and verified for accessibility and content quality
"""

# High-reliability government and official sources
RELIABLE_GOVERNMENT_URLS = [
    "https://www.startupindia.gov.in/",
    "https://msme.gov.in/",
    "https://www.sidbi.in/",
    "https://www.investindia.gov.in/",
]

# High-quality news and educational sources
RELIABLE_NEWS_URLS = [
    "https://yourstory.com/",
    "https://inc42.com/",
    "https://www.livemint.com/companies/start-ups",
    "https://economictimes.indiatimes.com/small-biz/startups",
    "https://www.business-standard.com/topic/startup-funding",
]

# International reliable sources
RELIABLE_INTERNATIONAL_URLS = [
    "https://www.sba.gov/",
    "https://techcrunch.com/category/startups/",
    "https://www.crunchbase.com/",
]

# Comprehensive reliable URL list
ALL_RELIABLE_URLS = (
    RELIABLE_GOVERNMENT_URLS + 
    RELIABLE_NEWS_URLS + 
    RELIABLE_INTERNATIONAL_URLS
)

def get_reliable_urls(category='all'):
    """Get reliable URLs by category"""
    if category == 'government':
        return RELIABLE_GOVERNMENT_URLS
    elif category == 'news':
        return RELIABLE_NEWS_URLS
    elif category == 'international':
        return RELIABLE_INTERNATIONAL_URLS
    else:
        return ALL_RELIABLE_URLS

if __name__ == "__main__":
    print("Reliable Startup URLs:")
    for i, url in enumerate(ALL_RELIABLE_URLS, 1):
        print(f"{i}. {url}")