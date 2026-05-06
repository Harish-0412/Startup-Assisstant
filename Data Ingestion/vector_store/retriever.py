"""
retriever.py
Semantic Search Retrieval Engine
"""

import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from vector_store.embedder import EmbeddingEngine
from vector_store.store import VectorStore


class Retriever:
    def __init__(self):
        print("Initializing Retriever...")
        self.embedder = EmbeddingEngine()
        self.store = VectorStore()
        print("Retriever Ready")

    def search(self, query: str, top_k: int = 5, filter_by=None):
        print("\nSearching Knowledge Base...")
        query_emb = self.embedder.get_embedding(query)

        results = self.store.query(
            query_embedding=query_emb.tolist(), top_k=top_k, filter_metadata=filter_by
        )

        docs = results["documents"][0]
        metas = results["metadatas"][0]

        return docs, metas


if __name__ == "__main__":
    retriever = Retriever()

    query = input("\nAsk something about startup funding: ")

    docs, metas = retriever.search(query, top_k=3)

    for i, (doc, meta) in enumerate(zip(docs, metas)):
        print("\n----------------------------------------")
        print(f"Result #{i+1}")
        print(doc[:500])
        print("\nSource:", meta)
