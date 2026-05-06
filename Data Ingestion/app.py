"""
app.py
Master Control Center for Startup Funding Intelligence System

Controls:
1️⃣ Ingest PDFs
2️⃣ Build Vector DB
3️⃣ Semantic Search
4️⃣ Full RAG Answer Mode
"""

import os
import json

# ----------------------------
# IMPORT PIPELINE MODULES
# ----------------------------
from ingestion.pipeline import process_pdf, process_websites
from ingestion.web_processor import STARTUP_FUNDING_URLS
from ingestion.advanced_web_ingestion import interactive_web_ingestion, save_web_ingestion_report

# ----------------------------
# VECTOR DB
# ----------------------------
from vector_store.build_store import build_vector_database
from vector_store.retriever import Retriever

# ----------------------------
# RAG ENGINE
# ----------------------------
from rag.rag_engine import RAGEngine


# ----------------------------
# PATHS
# ----------------------------
RAW_DIR = "data/raw"
PROCESSED_DIR = "data/processed"
CHUNK_DIR = "data/chunks"
WEB_DIR = "data/web"


# ----------------------------
# UTILITY
# ----------------------------
def ensure_dirs():
    os.makedirs(RAW_DIR, exist_ok=True)
    os.makedirs(PROCESSED_DIR, exist_ok=True)
    os.makedirs(CHUNK_DIR, exist_ok=True)
    os.makedirs(WEB_DIR, exist_ok=True)


# ----------------------------
# SAVE HELPERS
# ----------------------------
def save_processed(filename, text):
    path = os.path.join(PROCESSED_DIR, filename.replace(".pdf", "_clean.txt"))
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)

    print(f"✔ Saved Clean Text → {path}")


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

    print(f"✔ Saved Chunks → {path}")


def save_web_content(url_hash, title, content):
    """Save web content to processed directory"""
    filename = f"{url_hash}_{title[:50].replace(' ', '_')}_web.txt"
    path = os.path.join(WEB_DIR, filename)
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"✔ Saved Web Content → {path}")


def save_web_chunks(url_hash, title, chunks, metadata):
    """Save web chunks to chunks directory"""
    filename = f"{url_hash}_{title[:50].replace(' ', '_')}_web_chunks.json"
    path = os.path.join(CHUNK_DIR, filename)
    
    result = {
        "url": metadata.get('source_file', ''),
        "title": title,
        "chunk_count": len(chunks),
        "metadata": metadata,
        "chunks": chunks,
    }
    
    with open(path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f"✔ Saved Web Chunks → {path}")


# ----------------------------
# INGEST PDFs
# ----------------------------
def ingest_pdfs():
    ensure_dirs()

    files = [f for f in os.listdir(RAW_DIR) if f.lower().endswith(".pdf")]

    if not files:
        print("\n\u26a0 No PDF files found in data/raw/")
        print("\ud83d\udc49 Please add PDFs inside data/raw/ and try again.")
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


# ----------------------------
# INGEST WEBSITES
# ----------------------------
def ingest_websites(custom_urls=None):
    """Enhanced website ingestion with multiple options"""
    ensure_dirs()
    
    if custom_urls:
        # Use provided URLs
        urls = custom_urls
        print(f"\n======================================")
        print(f"Processing {len(urls)} custom websites...")
        print("======================================")
        results = process_websites(urls)
    else:
        # Use interactive advanced ingestion
        print("\n🌐 Starting Advanced Web Ingestion...")
        results = interactive_web_ingestion()
    
    if not results:
        print("\n⚠️ No websites were successfully processed.")
        return
    
    # Process and save results
    for result in results:
        print("\n" + "-"*50)
        print(f"Processing: {result['title']}")
        print("-"*50)
        
        # Save web content
        save_web_content(result['url_hash'], result['title'], result['raw_text'])
        
        # Save chunks
        save_web_chunks(result['url_hash'], result['title'], result['chunks'], result['metadata'])
        
        print(f"Language : {result['language']}")
        print(f"Chunks   : {len(result['chunks'])}")
        
        # Safely get word count from metadata
        word_count = result.get('metadata', {}).get('extra', {}).get('word_count', 'N/A')
        print(f"Words    : {word_count}")
        
        # Show relevance score if available
        relevance = result.get('metadata', {}).get('extra', {}).get('relevance_score')
        if relevance:
            print(f"Quality  : {relevance} (relevance score)")
    
    # Generate and save report
    report = save_web_ingestion_report(results)
    
    print("\n✅ Enhanced web ingestion completed!")
    print(f"📊 Summary: {report['total_processed']} websites, {report['total_chunks']} chunks")
    print(f"🌍 Languages: {', '.join(report['languages_detected'])}")


# ----------------------------
# SEARCH MODE
# ----------------------------
def interactive_search():
    try:
        retriever = Retriever()
        
        print("\n" + "="*50)
        print("🔍 Semantic Search Mode")
        print("="*50)
        print("Type 'exit' to return to main menu\n")
        
        while True:
            query = input("💬 Ask something about startup funding: ").strip()

            if query.lower() in ['exit', 'quit', 'q']:
                print("\n👋 Returning to main menu...\n")
                break

            if not query:
                continue

            try:
                docs, metas = retriever.search(query, top_k=3)

                if not docs:
                    print("\n❌ No results found. Try a different question or check if vector database is built.\n")
                    continue

                print("\n" + "-"*50)
                print(f"📚 Found {len(docs)} result(s):\n")
                
                for i, (doc, meta) in enumerate(zip(docs, metas), 1):
                    print(f"Result #{i}")
                    print("-" * 50)
                    print(doc[:600])
                    if len(doc) > 600:
                        print("...")
                    print(f"\nSource: {meta.get('source_file', 'unknown')}")
                    print(f"Language: {meta.get('language', 'unknown')}")
                    print(f"Type: {meta.get('document_type', 'unknown')}\n")
                    
            except Exception as e:
                print(f"\n❌ Error searching: {e}")
                print("Please try again or type 'exit' to return.\n")
    
    except Exception as e:
        print(f"\n❌ Error initializing retriever: {e}")
        print("Make sure you have built the vector database first (option 2)\n")


# ----------------------------
# RAG MODE
# ----------------------------
def rag_chat_mode():
    try:
        engine = RAGEngine()

        print("\n" + "="*50)
        print("🤖 RAG Startup Funding Assistant")
        print("="*50)
        print("Ask me anything about startup funding!")
        print("Type 'exit' or 'quit' to return to main menu.\n")

        while True:
            query = input("💬 Your Question: ").strip()

            if query.lower() in ['exit', 'quit', 'q']:
                print("\n👋 Returning to main menu...\n")
                break

            if not query:
                continue

            try:
                result = engine.ask(query, debug=False)

                print("\n" + "="*60)
                print("📝 ANSWER")
                print("="*60)
                print(result["answer"])
                print("="*60)

                if result.get("references"):
                    print("\n📚 Sources Used:")
                    for i, ref in enumerate(result["references"], 1):
                        print(f"  {i}. {ref.get('source_file', 'unknown')} ({ref.get('language', 'unknown')})")

                print(f"\nStatus: {result.get('status', 'unknown')}\n")

            except Exception as e:
                print(f"\n❌ Error processing question: {e}")
                print("Please try again or type 'exit' to return.\n")

    except Exception as e:
        print(f"\n❌ Error initializing RAG engine: {e}")
        print("Make sure:")
        print("  1. Vector database is built (option 2)")
        print("  2. GROQ_API_KEY environment variable is set")
        print("  3. You have internet connection\n")


# ----------------------------
# FUNDING-FOCUSED ASSISTANT
# ----------------------------
def funding_assistant_mode():
    """Enhanced funding-focused RAG assistant"""
    try:
        from funding_rag_engine import FundingRAGEngine
        engine = FundingRAGEngine()

        print("\n" + "="*50)
        print("🏦 Enhanced Funding Assistant")
        print("="*50)
        print("Specialized for startup funding queries!")
        print("Ask about schemes, eligibility, amounts, applications.")
        print("Type 'exit' or 'quit' to return to main menu.\n")

        while True:
            query = input("💰 Funding Question: ").strip()

            if query.lower() in ['exit', 'quit', 'q']:
                print("\n👋 Returning to main menu...\n")
                break

            if not query:
                continue

            try:
                result = engine.ask_funding_question(query, debug=False)

                print("\n" + "="*60)
                print("📋 FUNDING INFORMATION")
                print("="*60)
                print(result["answer"])
                print("="*60)

                if result.get("funding_details"):
                    details = result["funding_details"]
                    if details["amounts_mentioned"]:
                        print(f"\n💰 Amounts: {', '.join(details['amounts_mentioned'])}")
                    if details["eligibility_info"]:
                        print(f"\n✅ Eligibility: {len(details['eligibility_info'])} criteria found")
                    if details["application_info"]:
                        print(f"\n📏 Application: {len(details['application_info'])} process steps found")

                if result.get("references"):
                    print("\n📚 Sources Used:")
                    for i, ref in enumerate(result["references"], 1):
                        print(f"  {i}. {ref.get('source_file', 'unknown')} ({ref.get('language', 'unknown')})")

                print(f"\nStatus: {result.get('status', 'unknown')}\n")

            except Exception as e:
                print(f"\n❌ Error processing question: {e}")
                print("Please try again or type 'exit' to return.\n")

    except Exception as e:
        print(f"\n❌ Error initializing funding assistant: {e}")
        print("Make sure:")
        print("  1. Vector database is built (option 3)")
        print("  2. GROQ_API_KEY environment variable is set")
        print("  3. You have internet connection\n")


# ----------------------------
# PITCH DECK ANALYZER
# ----------------------------
def pitch_deck_mode():
    """Pitch deck analysis and funding recommendations"""
    try:
        from pitch_funding_rag import PitchFundingRAG
        analyzer = PitchFundingRAG()

        print("\n" + "="*50)
        print("🎯 Pitch Deck Analyzer & Funding Recommender")
        print("="*50)
        print("Upload your pitch deck PDF for comprehensive analysis")
        print("Get scoring, recommendations, and funding suggestions")
        print("Type 'back' to return to main menu.\n")

        while True:
            pdf_path = input("📄 Enter pitch deck PDF path: ").strip()

            if pdf_path.lower() in ['back', 'exit', 'quit']:
                print("\n👋 Returning to main menu...\n")
                break

            if not pdf_path:
                continue

            if not os.path.exists(pdf_path):
                print("❌ File not found. Please enter a valid PDF path.\n")
                continue

            try:
                print("\n🔍 Analyzing pitch deck...")
                result = analyzer.analyze_and_recommend(pdf_path)

                if result['success']:
                    pitch = result['pitch_analysis']
                    
                    print("\n" + "="*60)
                    print("📊 PITCH DECK ANALYSIS RESULTS")
                    print("="*60)
                    
                    print(f"🏆 SCORE: {pitch['score']}/100 ({pitch['grade']})")
                    print(f"📋 SECTIONS: {pitch['sections_found']}/{pitch['total_sections']} complete")
                    print(f"📄 PAGES: {pitch['details']['pages']} | WORDS: {pitch['details']['words']}")
                    
                    print(f"\n💰 RECOMMENDED FUNDING TYPES:")
                    for funding_type in result['recommended_funding_types']:
                        print(f"  • {funding_type}")
                    
                    print(f"\n🎯 FOCUS AREAS:")
                    for area in result['focus_areas']:
                        print(f"  • {area.title()}")
                    
                    print(f"\n📝 TOP RECOMMENDATIONS:")
                    for i, rec in enumerate(pitch['recommendations'][:5], 1):
                        print(f"  {i}. {rec}")
                    
                    print(f"\n🚀 NEXT STEPS:")
                    for step in result['next_steps'][:5]:
                        print(f"  {step}")
                    
                    print(f"\n💬 PREPARATION ADVICE:")
                    print(f"  {result['preparation_advice']}")
                    
                    print("\n" + "="*60)
                    
                else:
                    print(f"\n❌ Analysis failed: {result['error']}")

            except Exception as e:
                print(f"\n❌ Error analyzing pitch deck: {e}")
                print("Please check the file path and try again.\n")

    except Exception as e:
        print(f"\n❌ Error initializing pitch deck analyzer: {e}")
        print("Make sure all required files are present.\n")


# ----------------------------
# PITCH DECK GENERATOR
# ----------------------------
def pitch_generator_mode():
    """Generate perfect pitch decks from user responses"""
    try:
        print("\n" + "="*50)
        print("🎯 Perfect Pitch Deck Generator")
        print("="*50)
        print("Answer questions to generate a 100% score pitch deck")
        print("Creates both text and PDF versions")
        print("Type 'back' to return to main menu.\n")
        
        choice = input("Ready to start? (y/n): ").strip().lower()
        
        if choice in ['n', 'no', 'back']:
            print("\n👋 Returning to main menu...\n")
            return
        
        try:
            from pdf_pitch_generator import create_complete_pitch_system
            result = create_complete_pitch_system()
            
            if result['success']:
                print(f"\n🎉 SUCCESS! Generated perfect pitch deck for {result['company_name']}")
                print(f"🏆 Score: {result['score']}/100 ({result['grade']})")
                print(f"📋 Sections: {result['sections']}/9 complete")
                
                if result.get('pdf_file'):
                    print(f"📄 Files created:")
                    print(f"  • Text: {result['text_file']}")
                    print(f"  • PDF: {result['pdf_file']}")
                else:
                    print(f"📄 Text file created: {result['text_file']}")
                    print("⚠️ PDF generation requires: pip install reportlab")
            
        except ImportError:
            print("⚠️ PDF generation not available. Using text-only mode...")
            from pitch_deck_generator import create_perfect_pitch_deck
            result = create_perfect_pitch_deck()
            
            if result['success']:
                print(f"\n🎉 SUCCESS! Generated pitch deck for {result['company_name']}")
                print(f"🏆 Score: {result['score']}/100 ({result['grade']})")
                print(f"📄 File: {result['filepath']}")
        
        except Exception as e:
            print(f"\n❌ Error generating pitch deck: {e}")
            print("Please try again or check your inputs.\n")
    
    except Exception as e:
        print(f"\n❌ Error initializing pitch generator: {e}")
        print("Make sure all required files are present.\n")


# ----------------------------
# MAIN MENU
# ----------------------------
if __name__ == "__main__":
    print("\nStartup Funding Intelligence System")
    print("======================================")
    print("1. Ingest PDFs (Extract + Clean + Chunk)")
    print("2. Ingest Websites (Scrape + Process + Chunk)")
    print("3. Build Vector Database")
    print("4. Semantic Search (Retriever Only)")
    print("5. Ask RAG Assistant (LLM + Retrieval)")
    print("6. Funding-Focused Assistant (Enhanced)")
    print("7. Pitch Deck Analyzer & Funding Recommender")
    print("8. Generate Perfect Pitch Deck (100% Score)")
    print("9. Exit")
    print("======================================")

    while True:
        choice = input("\nEnter your choice: ")

        if choice == "1":
            ingest_pdfs()

        elif choice == "2":
            ingest_websites()

        elif choice == "3":
            build_vector_database()

        elif choice == "4":
            interactive_search()

        elif choice == "5":
            rag_chat_mode()
        
        elif choice == "6":
            funding_assistant_mode()
        
        elif choice == "7":
            pitch_deck_mode()
        
        elif choice == "8":
            pitch_generator_mode()

        else:
            print("\nExiting System. See you later!")
            break
