import os
import sys
from pathlib import Path

def create_directories():
    print("Creating directories...")
    
    base_path = Path("ai-verse/Data Ingestion")
    directories = [
        "data/raw",
        "data/processed", 
        "data/chunks",
        "data/vector_db",
        "data/web"
    ]
    
    for dir_path in directories:
        full_path = base_path / dir_path
        full_path.mkdir(parents=True, exist_ok=True)
        print(f"  Created: {full_path}")
    
    uploads_dir = Path("uploads")
    uploads_dir.mkdir(exist_ok=True)
    print(f"  Created: {uploads_dir}")
    
    return True

def setup_environment():
    print("Setting up environment...")
    
    env_file = Path("ai-verse/Data Ingestion/.env")
    
    if not env_file.exists():
        with open(env_file, 'w') as f:
            f.write("# RAG Configuration\n")
            f.write("GROQ_API_KEY=your_groq_api_key_here\n")
        print(f"Created .env file")
    
    print("\nIMPORTANT: Set your GROQ_API_KEY in the .env file:")
    print(f"   Edit: {env_file.absolute()}")
    print("   Get your API key from: https://console.groq.com/keys")
    
    return True

def main():
    print("RAG Integration Setup")
    print("=" * 50)
    
    create_directories()
    setup_environment()
    
    print("\nSetup Complete!")
    print("Next steps:")
    print("1. Set your GROQ_API_KEY in ai-verse/Data Ingestion/.env")
    print("2. Run: npm run dev")
    print("3. Visit: http://localhost:5000/rag")

if __name__ == "__main__":
    main()