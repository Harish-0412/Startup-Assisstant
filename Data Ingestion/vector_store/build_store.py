"""
build_store.py
Creates Vector Database from chunk JSON files
"""

import os
import sys
import json

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from vector_store.embedder import EmbeddingEngine
from vector_store.store import VectorStore

CHUNK_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "chunks")


def build_vector_database():
    embedder = EmbeddingEngine()
    store = VectorStore()

    files = [f for f in os.listdir(CHUNK_DIR) if f.endswith(".json")]

    if not files:
        print("No chunk files found in data/chunks/")
        print("First run: python app.py to generate chunks")
        return

    total_chunks_indexed = 0

    for file in files:
        path = os.path.join(CHUNK_DIR, file)

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

        metadata = data["metadata"]
        chunks = data["chunks"]

        print(f"\nIndexing File: {file}")
        print(f"Total Chunks: {len(chunks)}")

        ids = []
        texts = []
        embeddings = []
        metadatas = []

        valid_chunk_count = 0
        for index, chunk in enumerate(chunks):
            # Skip empty chunks
            if not chunk or not chunk.strip():
                continue
                
            emb = embedder.get_embedding(chunk)
            
            # Skip if embedding is empty
            if emb.size == 0:
                continue

            ids.append(f"{file}_{index}")
            texts.append(chunk)
            embeddings.append(emb.tolist())

            metadatas.append(
                {
                    "source_file": file,
                    "language": metadata.get("language", "unknown"),
                    "document_type": metadata.get("document_type", "unknown"),
                }
            )
            valid_chunk_count += 1

        if ids:  # Only add if there are valid chunks
            store.add_documents_batch(ids, texts, embeddings, metadatas)

        total_chunks_indexed += valid_chunk_count

    print("\nVector DB Build Completed")
    print(f"Total Chunks Indexed: {total_chunks_indexed}")
    print(f"Total Records in DB: {store.count()}")


if __name__ == "__main__":
    print("Building Startup Funding Vector Database")
    build_vector_database()
