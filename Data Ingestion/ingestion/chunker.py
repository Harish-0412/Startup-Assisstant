"""
chunker.py
RAG friendly chunk engine
✔ Token safe chunking
✔ Overlap context preservation
✔ Page + paragraph aware
"""

import re
from typing import List


def split_into_paragraphs(text: str) -> List[str]:
    """Split on paragraph blocks"""
    paragraphs = re.split(r"\n\s*\n|\.{2,}", text)
    paragraphs = [p.strip() for p in paragraphs if p.strip()]
    return paragraphs


def chunk_text(text: str, chunk_size: int = 700, overlap: int = 100) -> List[str]:
    """
    Word based chunking with overlap
    Ideal for RAG systems
    """

    words = text.split()
    if len(words) <= chunk_size:
        return [text]

    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap

    return chunks


def hybrid_chunker(text: str, chunk_size: int = 700, overlap: int = 80) -> List[str]:
    """
    Best approach:
    1️⃣ Split into paragraphs
    2️⃣ Merge smaller ones
    3️⃣ Apply word overlap strategy
    """

    paragraphs = split_into_paragraphs(text)

    merged = []
    current = ""

    for p in paragraphs:
        if len(current.split()) + len(p.split()) <= chunk_size:
            current += " " + p
        else:
            merged.append(current.strip())
            current = p

    if current:
        merged.append(current.strip())

    final_chunks = []
    for block in merged:
        final_chunks.extend(chunk_text(block, chunk_size, overlap))

    return final_chunks


if __name__ == "__main__":
    sample = """
    This is a test policy document snippet.
    It talks about funding schemes, investors, and startup eligibility...
    """

    c = hybrid_chunker(sample)
    print("Chunks:", len(c))
    print(c)
