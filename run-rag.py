#!/usr/bin/env python3
"""
Quick Run Script for AI-Verse RAG System
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def run_setup():
    """Run the setup if needed"""
    print("🔧 Running setup...")
    try:
        subprocess.run([sys.executable, "setup-rag.py"], check=True)
        print("✅ Setup completed")
    except subprocess.CalledProcessError:
        print("⚠️ Setup had issues, continuing anyway...")

def start_server():
    """Start the development server"""
    print("🚀 Starting AI-Verse RAG System...")
    
    # Check if we're in the right directory
    if not Path("package.json").exists():
        print("❌ package.json not found. Please run from the ai-verse directory.")
        return False
    
    # Install dependencies if needed
    if not Path("node_modules").exists():
        print("📦 Installing dependencies...")
        subprocess.run(["npm", "install"], check=True)
    
    # Start the development server
    print("🌐 Starting development server on http://localhost:5000")
    print("📱 RAG Assistant available at http://localhost:5000/rag")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        subprocess.run(["npm", "run", "dev"], check=True)
    except KeyboardInterrupt:
        print("\n👋 Server stopped")
    except subprocess.CalledProcessError as e:
        print(f"❌ Server failed to start: {e}")
        return False
    
    return True

def main():
    print("=" * 60)
    print("🤖 AI-VERSE RAG INTELLIGENCE SYSTEM")
    print("=" * 60)
    
    # Run setup first
    run_setup()
    
    # Start server
    start_server()

if __name__ == "__main__":
    main()