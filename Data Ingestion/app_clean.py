"""
app_clean.py
Master Control Center for Startup Funding Intelligence System
Unicode-free version for Windows compatibility
"""

import os
import json

from ingestion.pipeline import process_pdf
from vector_store.build_store import build_vector_database
from vector_store.retriever import Retriever
from rag.rag_engine import RAGEngine

RAW_DIR = "data/raw"
PROCESSED_DIR = "data/processed"
CHUNK_DIR = "data/chunks"

def ensure_dirs():
    os.makedirs(RAW_DIR, exist_ok=True)
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    os.makedirs(CHUNK_DIR, exist_ok=True)

def save_processed(filename, text):
    path = os.path.join(PROCESSED_DIR, filename.replace(".pdf", "_clean.txt"))
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print(f"Saved Clean Text -> {path}")

def save_chunks(filename, chunks, metadata):
    path = os.path.join(CHUNK_DIR, filename.replace(".pdf", "_chunks.json"))
    result = {
        "file_name": filename,
        "chunk_count": len(chunks),
        "metadata": metadata,
        "chunks": chunks,
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"Saved Chunks -> {path}")

def ingest_pdfs():
    ensure_dirs()
    files = [f for f in os.listdir(RAW_DIR) if f.lower().endswith(".pdf")]
    
    if not files:
        print("\nNo PDF files found in data/raw/")
        print("Please add PDFs inside data/raw/ and try again.")
        return
    
    for file in files:
        print("\n======================================")
        print(f"Processing: {file}")
        print("======================================")
        
        path = os.path.join(RAW_DIR, file)
        result = process_pdf(path)
        
        save_processed(file, result["raw_text"])
        save_chunks(file, result["chunks"], result["metadata"])
        
        print("\nCompleted")
        print(f"Language : {result['language']}")
        print(f"Pages    : {result['page_count']}")
        print(f"Chunks   : {len(result['chunks'])}")

def auto_setup_and_run():
    print("Starting Automated RAG System...")
    
    # Set API key
    os.environ["GROQ_API_KEY"] = "your_groq_api_key_here"
    
    # Step 1: Ingest PDFs
    print("\n" + "="*50)
    print("STEP 1: Ingesting PDFs...")
    print("="*50)
    ingest_pdfs()
    
    # Step 2: Build Vector Database
    print("\n" + "="*50)
    print("STEP 2: Building Vector Database...")
    print("="*50)
    build_vector_database()
    
    # Step 3: Initialize RAG Engine
    print("\n" + "="*50)
    print("STEP 3: Initializing RAG Engine...")
    print("="*50)
    engine = RAGEngine()
    
    # Step 4: Auto-answer sample questions
    print("\n" + "="*50)
    print("STEP 4: Auto-answering questions...")
    print("="*50)
    
    sample_questions = [
        "What is this PDF about?",
        "What are the main startup funding schemes mentioned?",
        "What are the eligibility criteria for funding?",
        "What is the maximum funding amount available?",
        "How can startups apply for funding?"
    ]
    
    for i, question in enumerate(sample_questions, 1):
        print(f"\n{'='*60}")
        print(f"QUESTION {i}: {question}")
        print('='*60)
        
        result = engine.ask(question, debug=False)
        print(result["answer"])
        
        if result.get("references"):
            print(f"\nSources: {len(result['references'])} documents")
        
        print(f"Status: {result.get('status', 'unknown')}")
    
    print("\n" + "="*50)
    print("AUTO-RUN COMPLETE!")
    print("="*50)
    print("You can now run 'python app.py' for interactive mode")

if __name__ == "__main__":
    auto_setup_and_run()