#!/usr/bin/env python3
"""Quick RAG test"""
import sys
sys.path.insert(0, "c:\\ai-verse\\Data Ingestion")

from app.rag_integration import rag_retriever

print(f"\n✅ RAG Available: {rag_retriever.is_available}")

# Trigger lazy init
docs, metas = rag_retriever.retrieve_context('funding options for startups', 2)

print(f"✅ Retrieved {len(docs)} documents")
if docs:
    print(f"📄 First doc preview: {docs[0][:150]}...")
else:
    print("⚠️ No documents retrieved")
