# Enhanced Web Ingestion System 🌐

## Overview
The enhanced web ingestion system adds powerful website scraping and processing capabilities to your RAG knowledge base, making it more accurate and comprehensive for startup funding information.

## New Features

### 🎯 Advanced Web Content Processing
- **Quality Scoring**: Automatically scores content relevance (0-1 scale)
- **Content Filtering**: Only processes high-quality, relevant content
- **Structured Extraction**: Extracts funding amounts, eligibility criteria, and application processes
- **Language Detection**: Supports multiple languages with automatic detection

### 📂 Multiple Ingestion Modes
1. **High Priority** - Government schemes + top educational content
2. **Medium Priority** - Additional educational + ecosystem content  
3. **Comprehensive** - All available startup funding URLs
4. **Category-Based** - Government, Educational, Ecosystem, etc.
5. **Custom URLs** - Process your own list of websites

### 🏛️ Comprehensive URL Database
- **Government Sources**: Official startup schemes and policies
- **Educational Content**: Funding guides and how-to articles
- **Ecosystem Reports**: Industry analysis and trends
- **International Sources**: Best practices from other countries
- **VC Platforms**: Investment and funding platform content

## How to Use

### 1. Install Dependencies
```bash
# Run the setup script
install_web_deps.bat

# Or install manually
pip install beautifulsoup4 lxml requests
```

### 2. Run Enhanced Web Ingestion
```bash
python app.py
# Select option 2: "Ingest Websites"
```

### 3. Choose Ingestion Mode
- **Option 1**: High Priority URLs (recommended for quick setup)
- **Option 2**: Medium Priority URLs (more comprehensive)
- **Option 3**: All URLs (complete coverage)
- **Option 4**: Category-based selection
- **Option 5**: Custom URL input

### 4. Automated Processing
The system will:
1. Scrape websites with rate limiting
2. Score content for relevance
3. Filter low-quality content
4. Extract structured information
5. Process through cleaning pipeline
6. Generate optimized chunks
7. Save processed content and metadata

## Quality Metrics

### Relevance Scoring
- **Keywords**: Startup, funding, investment terms
- **Quality Indicators**: Eligibility, criteria, application processes
- **Content Length**: Substantial content preferred
- **Combined Score**: Weighted average of all factors

### Content Enhancement
- **Structured Data**: Funding amounts, eligibility, processes
- **Summaries**: Key information extraction
- **Metadata**: Enhanced with quality scores and structured info

## File Structure

```
data/
├── web/                    # Raw web content
├── chunks/                 # Processed web chunks
└── web_ingestion_report.json  # Detailed processing report
```

## Advanced Features

### Content Validation
- Automatic relevance scoring
- Quality threshold filtering
- Duplicate content detection
- Language consistency checks

### Intelligent Extraction
- Funding amount recognition (₹, $, amounts)
- Eligibility criteria extraction
- Application process identification
- Key information summarization

### Reporting
- Comprehensive ingestion reports
- Quality metrics tracking
- Language distribution analysis
- Processing success rates

## Integration with RAG System

The enhanced web content integrates seamlessly with your existing RAG system:

1. **Vector Database**: Web chunks are automatically included
2. **Semantic Search**: Enhanced with web-sourced information
3. **RAG Responses**: More comprehensive answers using web data
4. **Source Attribution**: Clear tracking of web vs PDF sources

## Best Practices

### For Optimal Results
1. Start with **High Priority** URLs for core government schemes
2. Add **Medium Priority** for broader coverage
3. Use **Custom URLs** for specific, known high-quality sources
4. Monitor quality scores in reports
5. Regularly update URL database

### Quality Thresholds
- **High Quality**: Relevance score ≥ 0.3
- **Medium Quality**: Relevance score ≥ 0.2  
- **Low Quality**: Filtered out automatically

## Troubleshooting

### Common Issues
- **No content processed**: Check internet connection
- **Low quality scores**: URLs may not be startup-funding related
- **Scraping failures**: Some sites may block automated access

### Solutions
- Use VPN if regional blocking occurs
- Add custom high-quality URLs
- Adjust quality thresholds if needed
- Check web_ingestion_report.json for details

## Example Usage

```python
# Quick high-priority ingestion
from ingestion.advanced_web_ingestion import ingest_by_priority
results = ingest_by_priority('high')

# Category-specific ingestion
from ingestion.advanced_web_ingestion import ingest_by_category
results = ingest_by_category('government')

# Custom URL processing
custom_urls = ['https://example.com/startup-funding']
from ingestion.advanced_web_ingestion import ingest_custom_urls
results = ingest_custom_urls(custom_urls)
```

## Performance

### Processing Speed
- **Rate Limited**: 1.5 second delay between requests
- **Quality Filtering**: Only processes relevant content
- **Batch Processing**: Efficient multi-URL handling

### Resource Usage
- **Memory Efficient**: Processes one site at a time
- **Storage Optimized**: Only saves high-quality content
- **Network Friendly**: Respectful scraping practices

---

🚀 **Ready to enhance your knowledge base with comprehensive web content!**