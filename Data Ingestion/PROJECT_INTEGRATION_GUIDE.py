"""
PROJECT INTEGRATION GUIDE
How to add the Enhanced Funding RAG System to your project
"""

# STEP 1: Copy Required Files
# Copy these files to your project:

REQUIRED_FILES = [
    "funding_rag_engine.py",           # Enhanced RAG engine
    "ingestion/funding_focused_scraper.py",  # Funding-specific scraper
    "ingestion/simple_web_scraper.py",       # Reliable web scraper
    "ingestion/simple_web_processor.py",     # Simple web processor
    "ingestion/reliable_startup_urls.py",    # Curated URL database
]

# STEP 2: Install Dependencies
DEPENDENCIES = [
    "beautifulsoup4",
    "lxml", 
    "requests",
    "chromadb",
    "langdetect"
]

# STEP 3: Simple Integration Example

class MyProjectWithFunding:
    def __init__(self):
        from funding_rag_engine import FundingRAGEngine
        self.funding_engine = FundingRAGEngine()
    
    def ask_funding_question(self, question: str):
        """Ask funding-related questions"""
        try:
            result = self.funding_engine.ask_funding_question(question)
            
            return {
                'answer': result['answer'],
                'funding_amounts': result.get('funding_details', {}).get('amounts_mentioned', []),
                'eligibility': result.get('funding_details', {}).get('eligibility_info', []),
                'application': result.get('funding_details', {}).get('application_info', []),
                'sources': len(result.get('references', []))
            }
        except Exception as e:
            return {'error': str(e)}
    
    def ingest_funding_websites(self):
        """Add web content to knowledge base"""
        from ingestion.simple_web_processor import process_reliable_websites
        
        try:
            results = process_reliable_websites()
            return f"Successfully processed {len(results)} websites"
        except Exception as e:
            return f"Error: {e}"

# STEP 4: Usage Examples

def example_usage():
    # Initialize the system
    my_app = MyProjectWithFunding()
    
    # Ingest web content (run once)
    print("Ingesting funding websites...")
    result = my_app.ingest_funding_websites()
    print(result)
    
    # Ask funding questions
    questions = [
        "What government funding schemes are available for startups?",
        "What are the eligibility criteria for startup funding?",
        "How much funding can I get for my startup?"
    ]
    
    for question in questions:
        print(f"\nQ: {question}")
        answer = my_app.ask_funding_question(question)
        
        if 'error' in answer:
            print(f"Error: {answer['error']}")
        else:
            print(f"A: {answer['answer']}")
            if answer['funding_amounts']:
                print(f"Amounts: {', '.join(answer['funding_amounts'])}")

# STEP 5: API Integration Example

def create_funding_api():
    """Example Flask API integration"""
    
    from flask import Flask, request, jsonify
    
    app = Flask(__name__)
    funding_system = MyProjectWithFunding()
    
    @app.route('/ask-funding', methods=['POST'])
    def ask_funding():
        data = request.get_json()
        question = data.get('question', '')
        
        if not question:
            return jsonify({'error': 'No question provided'}), 400
        
        result = funding_system.ask_funding_question(question)
        return jsonify(result)
    
    @app.route('/ingest-websites', methods=['POST'])
    def ingest_websites():
        result = funding_system.ingest_funding_websites()
        return jsonify({'message': result})
    
    return app

# STEP 6: Configuration

CONFIG = {
    'GROQ_API_KEY': 'your-groq-api-key-here',  # Required for LLM
    'CHUNK_SIZE': 700,                          # Text chunk size
    'TOP_K_RESULTS': 5,                        # Number of search results
    'MIN_CONTENT_LENGTH': 50,                  # Minimum words for content
}

if __name__ == "__main__":
    print("Enhanced Funding RAG System - Integration Guide")
    print("=" * 50)
    
    print("\n1. Copy required files to your project")
    for file in REQUIRED_FILES:
        print(f"   - {file}")
    
    print("\n2. Install dependencies:")
    for dep in DEPENDENCIES:
        print(f"   pip install {dep}")
    
    print("\n3. Set environment variable:")
    print("   set GROQ_API_KEY=your-key-here")
    
    print("\n4. Run example:")
    print("   python integration_guide.py")
    
    # Run example if executed directly
    example_usage()