"""
startup_urls_database.py
Comprehensive Database of Startup Funding URLs
Categorized by type and relevance for better knowledge base coverage
"""

# Government Schemes and Official Sources
GOVERNMENT_URLS = [
    "https://www.startupindia.gov.in/content/sih/en/government-schemes.html",
    "https://www.startupindia.gov.in/content/sih/en/home-page.html",
    "https://www.startupindia.gov.in/content/sih/en/funding.html",
    "https://msme.gov.in/",
    "https://www.sidbi.in/",
]

# Funding Guides and Educational Content
EDUCATIONAL_URLS = [
    "https://yourstory.com/startup-funding",
    "https://inc42.com/buzz/startup-funding/",
    "https://www.livemint.com/companies/start-ups",
    "https://economictimes.indiatimes.com/small-biz/startups",
    "https://www.business-standard.com/topic/startup-funding",
]

# Ecosystem and Industry Reports
ECOSYSTEM_URLS = [
    "https://nasscom.in/knowledge-center",
    "https://www.investindia.gov.in/",
    "https://bain.com/insights/",
]

# International Best Practices (for comparison)
INTERNATIONAL_URLS = [
    "https://www.sba.gov/funding-programs",
    "https://www.gov.uk/business-finance-support",
]

# Venture Capital and Investment Platforms
VC_URLS = [
    "https://angel.co/",
    "https://www.crunchbase.com/",
]

# All URLs combined with priorities
ALL_STARTUP_URLS = {
    'high_priority': GOVERNMENT_URLS + EDUCATIONAL_URLS[:3],
    'medium_priority': EDUCATIONAL_URLS[3:] + ECOSYSTEM_URLS,
    'low_priority': INTERNATIONAL_URLS + VC_URLS
}

# Flattened list for easy access
COMPREHENSIVE_STARTUP_URLS = (
    ALL_STARTUP_URLS['high_priority'] + 
    ALL_STARTUP_URLS['medium_priority'] + 
    ALL_STARTUP_URLS['low_priority']
)

def get_priority_urls(priority_level: str = 'high') -> list:
    """Get URLs based on priority level"""
    if priority_level == 'all':
        return COMPREHENSIVE_STARTUP_URLS
    return ALL_STARTUP_URLS.get(f'{priority_level}_priority', [])

def get_categorized_urls() -> dict:
    """Get URLs organized by category"""
    return {
        'government': GOVERNMENT_URLS,
        'educational': EDUCATIONAL_URLS,
        'ecosystem': ECOSYSTEM_URLS,
        'international': INTERNATIONAL_URLS,
        'vc_platforms': VC_URLS
    }

if __name__ == "__main__":
    print("Startup Funding URLs Database")
    print("=" * 40)
    
    categories = get_categorized_urls()
    for category, urls in categories.items():
        print(f"\n{category.upper()} ({len(urls)} URLs):")
        for i, url in enumerate(urls, 1):
            print(f"  {i}. {url}")
    
    print(f"\nTotal URLs: {len(COMPREHENSIVE_STARTUP_URLS)}")
    print(f"High Priority: {len(ALL_STARTUP_URLS['high_priority'])}")
    print(f"Medium Priority: {len(ALL_STARTUP_URLS['medium_priority'])}")
    print(f"Low Priority: {len(ALL_STARTUP_URLS['low_priority'])}")