"""
store.py
Persistent Vector Database using ChromaDB

Features:
✔ Persistent DB storage
✔ Cosine similarity search
✔ Add / Update documents
✔ Delete documents
✔ Metadata filtering
✔ Health check
✔ Safe indexing
"""

import chromadb
from typing import List, Dict

CHROMA_DB_PATH = "data/vector_db"


class VectorStore:
    def __init__(self, collection_name="startup_funding_knowledge"):
        print("Initializing Persistent Vector Database...")

        self.client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},  # ensures similarity accuracy
        )

        print("Vector DB Ready & Persistent")
        print(f"Collection: {collection_name}")

    # -----------------------------------------
    # Health Check
    # -----------------------------------------
    def health(self):
        try:
            self.collection.count()
            return True
        except:
            return False

    # -----------------------------------------
    # Add Document
    # -----------------------------------------
    def add_document(
        self, chunk_id: str, text: str, embedding: List[float], metadata: Dict
    ):
        if not text or not embedding:
            print("Skipping invalid entry")
            return

        self.collection.add(
            ids=[chunk_id],
            documents=[text],
            embeddings=[embedding],
            metadatas=[metadata],
        )

    # -----------------------------------------
    # Batch Insertion
    # -----------------------------------------
    def add_documents_batch(self, ids, texts, embeddings, metadatas):
        self.collection.add(
            ids=ids, documents=texts, embeddings=embeddings, metadatas=metadatas
        )

    # -----------------------------------------
    # UPSERT (Update if Exists)
    # -----------------------------------------
    def upsert_document(self, chunk_id, text, embedding, metadata):
        try:
            self.collection.update(
                ids=[chunk_id],
                documents=[text],
                embeddings=[embedding],
                metadatas=[metadata],
            )
        except:
            self.add_document(chunk_id, text, embedding, metadata)

    # -----------------------------------------
    # DELETE
    # -----------------------------------------
    def delete_document(self, chunk_id):
        self.collection.delete(ids=[chunk_id])

    # -----------------------------------------
    # Query with metadata filtering
    # -----------------------------------------
    def query(self, query_embedding, top_k=5, filter_metadata=None):
        # ChromaDB doesn't accept empty dict for where parameter
        query_params = {
            "query_embeddings": [query_embedding],
            "n_results": top_k,
        }
        
        # Only add where clause if filter_metadata is provided and not empty
        if filter_metadata:
            query_params["where"] = filter_metadata
        
        results = self.collection.query(**query_params)
        return results

    # -----------------------------------------
    # Count Docs
    # -----------------------------------------
    def count(self):
        return self.collection.count()

    # -----------------------------------------
    # List Collections
    # -----------------------------------------
    def list_collections(self):
        return self.client.list_collections()


# -----------------------------------------
# Manual Test
# -----------------------------------------
if __name__ == "__main__":
    store = VectorStore()

    print("\nHealth:", "OK" if store.health() else "FAILED")
    print("Total Records:", store.count())
    print("Available Collections:", store.list_collections())
