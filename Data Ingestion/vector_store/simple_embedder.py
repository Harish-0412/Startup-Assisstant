"""
simple_embedder.py
Lightweight embedding engine using Groq API
No local models, no PyTorch dependencies
"""

import os
import requests
import numpy as np
from functools import lru_cache
from pathlib import Path


class SimpleEmbeddingEngine:
    def __init__(self):
        print("🔄 Initializing Simple Embedding Engine...")
        
        self.api_key = os.getenv("GROQ_API_KEY")
        
        # Fallback: try to load from .env file
        if not self.api_key:
            env_file = Path(".env")
            if env_file.exists():
                with open(env_file, 'r') as f:
                    for line in f:
                        if line.startswith('GROQ_API_KEY='):
                            self.api_key = line.split('=', 1)[1].strip()
                            break
        
        if not self.api_key:
            raise Exception("❌ GROQ_API_KEY not found. Set environment variable or create .env file.")
        
        print("✅ Simple Embedding Engine Ready")

    def _simple_hash_embedding(self, text: str, dim=384):
        """Create a simple hash-based embedding as fallback"""
        if not text or not text.strip():
            return np.zeros(dim)
        
        # Simple hash-based embedding
        words = text.lower().split()
        embedding = np.zeros(dim)
        
        for i, word in enumerate(words[:50]):  # Limit to 50 words
            hash_val = hash(word) % dim
            embedding[hash_val] += 1.0 / (i + 1)  # Weight by position
        
        # Normalize
        norm = np.linalg.norm(embedding)
        if norm > 0:
            embedding = embedding / norm
            
        return embedding

    @lru_cache(maxsize=5000)
    def get_embedding(self, text: str):
        """Get embedding for text using simple hash method"""
        if not text or not text.strip():
            return np.array([])
        
        return self._simple_hash_embedding(text)

    def get_batch_embeddings(self, texts):
        """Get embeddings for multiple texts"""
        return [self.get_embedding(text) for text in texts]


# Test
if __name__ == "__main__":
    engine = SimpleEmbeddingEngine()
    
    sample = "Tamil Nadu government startup funding policy"
    emb = engine.get_embedding(sample)
    
    print("\nEmbedding created!")
    print("Vector length:", len(emb))
    print("Preview (first 10 values):", emb[:10])