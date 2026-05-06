"""
auto_run.py
Fully automated RAG system runner
Processes PDFs, builds vector DB, and answers questions automatically
"""

import os
import time
from app import ingest_pdfs, ingest_websites, build_vector_database
from rag.rag_engine import RAGEngine

def auto_setup_and_run():
    print("Starting Automated RAG System...")
    
    # Set API key
    os.environ["GROQ_API_KEY"] = os.getenv("GROQ_API_KEY", "your_groq_api_key_here")
    
    # Step 1: Ingest PDFs
    print("\n" + "="*50)
    print("STEP 1: Ingesting PDFs...")
    print("="*50)
    ingest_pdfs()
    
    # Step 2: Ingest Websites
    print("\n" + "="*50)
    print("STEP 2: Ingesting Websites...")
    print("="*50)
    ingest_websites()
    
    # Step 3: Build Vector Database
    print("\n" + "="*50)
    print("STEP 3: Building Vector Database...")
    print("="*50)
    build_vector_database()
    
    # Step 5: Initialize RAG Engine
    print("\n" + "="*50)
    print("STEP 5: Initializing Enhanced Funding Assistant...")
    print("="*50)
    from funding_rag_engine import FundingRAGEngine
    engine = FundingRAGEngine()
    
    # Step 5: Auto-answer sample questions
    print("\n" + "="*50)
    print("STEP 5: Auto-answering questions...")
    print("="*50)
    
    sample_questions = [
        "What startup funding schemes are available?",
        "What are the eligibility criteria for government funding?",
        "How much funding can startups get?",
        "What is the application process for startup schemes?",
        "Which government departments provide startup funding?"
    ]
    
    for i, question in enumerate(sample_questions, 1):
        print(f"\n{'='*60}")
        print(f"FUNDING QUESTION {i}: {question}")
        print('='*60)
        
        result = engine.ask_funding_question(question, debug=False)
        print(result["answer"])
        
        if result.get("funding_details"):
            details = result["funding_details"]
            if details["amounts_mentioned"]:
                print(f"\nAmounts: {', '.join(details['amounts_mentioned'])}")
        
        if result.get("references"):
            print(f"\nSources: {len(result['references'])} documents")
        
        print(f"Status: {result.get('status', 'unknown')}")
        time.sleep(1)
    
    print("\n" + "="*50)
    print("AUTO-RUN COMPLETE!")
    print("="*50)
    print("You can now run 'python app.py' for interactive mode")

if __name__ == "__main__":
    auto_setup_and_run()