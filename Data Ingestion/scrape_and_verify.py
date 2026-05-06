"""
scrape_and_verify.py
Scrape a Wikipedia page → chunk → embed → store in ChromaDB → verify RAG retrieval
Usage: python scrape_and_verify.py
"""

import os
import sys
import json
import hashlib
import re
import requests
import numpy as np
from datetime import datetime
from bs4 import BeautifulSoup

# ── paths ──────────────────────────────────────────────────────────────────────
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
CHUNK_DIR  = os.path.join(BASE_DIR, "data", "chunks")
WEB_DIR    = os.path.join(BASE_DIR, "data", "web")
VECTOR_DIR = os.path.join(BASE_DIR, "data", "vector_db")

for d in (CHUNK_DIR, WEB_DIR, VECTOR_DIR):
    os.makedirs(d, exist_ok=True)

TARGET_URL = "https://en.wikipedia.org/wiki/Intuit_Mint"

# ── 1. SCRAPE ──────────────────────────────────────────────────────────────────
def scrape_wikipedia(url: str) -> dict:
    print(f"\n[1/4] Scraping: {url}")
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0.0.0 Safari/537.36"
        ),
        "Accept-Language": "en-US,en;q=0.9",
    }
    resp = requests.get(url, headers=headers, timeout=20)
    resp.raise_for_status()

    soup = BeautifulSoup(resp.content, "html.parser")

    # Wikipedia-specific: grab the article body
    content_div = soup.find("div", {"id": "mw-content-text"})
    if not content_div:
        content_div = soup.find("body")

    # Remove nav boxes, infoboxes, references, edit links
    for tag in content_div.find_all(
        ["table", "sup", "span", "div"],
        class_=re.compile(r"(navbox|infobox|reflist|mw-editsection|toc|hatnote)", re.I),
    ):
        tag.decompose()
    for tag in content_div.find_all(["script", "style", "nav", "footer"]):
        tag.decompose()

    # Extract section headings + paragraphs to preserve structure
    parts = []
    for elem in content_div.find_all(["h1", "h2", "h3", "h4", "p", "li", "dt", "dd"]):
        text = elem.get_text(" ", strip=True)
        if text:
            parts.append(text)

    full_text = "\n".join(parts)
    full_text = re.sub(r"\[[\d\w]+\]", "", full_text)   # remove citation markers [1]
    full_text = re.sub(r"\s{2,}", " ", full_text)
    full_text = full_text.strip()

    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else "Intuit Mint"

    word_count = len(full_text.split())
    print(f"    OK Scraped '{title}' - {word_count} words")
    return {"url": url, "title": title, "content": full_text, "word_count": word_count}


# ── 2. CHUNK ───────────────────────────────────────────────────────────────────
def chunk_text(text: str, chunk_size: int = 500, overlap: int = 80) -> list:
    words = text.split()
    if len(words) <= chunk_size:
        return [text]
    chunks, start = [], 0
    while start < len(words):
        chunk = " ".join(words[start : start + chunk_size])
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks


# ── 3. EMBED ───────────────────────────────────────────────────────────────────
def embed(text: str, dim: int = 384) -> list:
    """Lightweight hash-based embedding (matches existing embedder.py)."""
    words = text.lower().split()
    vec = np.zeros(dim)
    for i, word in enumerate(words[:50]):
        vec[hash(word) % dim] += 1.0 / (i + 1)
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec /= norm
    return vec.tolist()


# ── 4. STORE IN CHROMADB ───────────────────────────────────────────────────────
def store_in_chromadb(chunks: list, url: str, title: str, url_hash: str):
    print(f"\n[3/4] Storing {len(chunks)} chunks in ChromaDB...")
    import chromadb

    client = chromadb.PersistentClient(path=VECTOR_DIR)
    collection = client.get_or_create_collection(
        name="startup_funding_knowledge",
        metadata={"hnsw:space": "cosine"},
    )

    ids, texts, embeddings, metadatas = [], [], [], []
    for i, chunk in enumerate(chunks):
        if not chunk.strip():
            continue
        chunk_id = f"{url_hash}_wiki_{i}"
        # upsert: delete old if exists to avoid duplicate-id errors
        try:
            collection.delete(ids=[chunk_id])
        except Exception:
            pass
        ids.append(chunk_id)
        texts.append(chunk)
        embeddings.append(embed(chunk))
        metadatas.append({
            "source_file": url,
            "title": title,
            "language": "en",
            "document_type": "web_content",
            "url_hash": url_hash,
            "ingested_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        })

    collection.add(ids=ids, documents=texts, embeddings=embeddings, metadatas=metadatas)
    total = collection.count()
    print(f"    OK Stored {len(ids)} chunks | Total records in DB: {total}")
    return collection, total


# ── 5. VERIFY RAG RETRIEVAL ────────────────────────────────────────────────────
def verify_retrieval(collection, url_hash: str):
    print("\n[4/4] Verifying RAG retrieval...")

    test_queries = [
        "What is Intuit Mint?",
        "When was Mint founded?",
        "What features does Mint offer?",
        "Why did Mint shut down?",
        "Mint acquisition by Intuit",
    ]

    all_passed = True
    for query in test_queries:
        q_emb = embed(query)
        results = collection.query(
            query_embeddings=[q_emb],
            n_results=3,
            where={"url_hash": url_hash},
        )
        docs = results["documents"][0]
        if docs and any(len(d) > 50 for d in docs):
            snippet = docs[0][:120].replace("\n", " ")
            print(f"    OK '{query}'\n      -> {snippet}...")
        else:
            print(f"    FAIL '{query}' -- no relevant results found")
            all_passed = False

    return all_passed


# ── MAIN ───────────────────────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  Wikipedia Scrape -> ChromaDB -> RAG Verification")
    print("=" * 60)

    # 1. Scrape
    data = scrape_wikipedia(TARGET_URL)

    # Save raw web text
    url_hash = hashlib.md5(TARGET_URL.encode()).hexdigest()[:8]
    web_file = os.path.join(WEB_DIR, f"{url_hash}_Intuit_Mint_web.txt")
    with open(web_file, "w", encoding="utf-8") as f:
        f.write(data["content"])
    print(f"    OK Raw text saved -> {web_file}")

    # 2. Chunk
    print(f"\n[2/4] Chunking text...")
    chunks = chunk_text(data["content"])
    print(f"    OK {len(chunks)} chunks created")

    # Save chunks JSON (so build_store.py can also pick them up)
    chunk_file = os.path.join(CHUNK_DIR, f"{url_hash}_Intuit_Mint_web_chunks.json")
    with open(chunk_file, "w", encoding="utf-8") as f:
        json.dump({
            "url": TARGET_URL,
            "title": data["title"],
            "chunk_count": len(chunks),
            "metadata": {
                "file_name": f"{url_hash}_Intuit_Mint_web.txt",
                "file_path": TARGET_URL,
                "language": "en",
                "document_type": "web_content",
                "source": "wikipedia",
                "ingested_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            },
            "chunks": chunks,
        }, f, ensure_ascii=False, indent=2)
    print(f"    OK Chunks saved -> {chunk_file}")

    # 3 & 4. Store + Verify
    collection, total_records = store_in_chromadb(chunks, TARGET_URL, data["title"], url_hash)
    passed = verify_retrieval(collection, url_hash)

    # Summary
    print("\n" + "=" * 60)
    print("  SUMMARY")
    print("=" * 60)
    print(f"  URL        : {TARGET_URL}")
    print(f"  Words      : {data['word_count']}")
    print(f"  Chunks     : {len(chunks)}")
    print(f"  DB records : {total_records}")
    print(f"  RAG check  : {'PASSED' if passed else 'SOME QUERIES FAILED'}")
    print("=" * 60)

    if passed:
        print("\nSUCCESS: Wikipedia page scraped, stored, and retrievable via RAG.")
    else:
        print("\nWARNING: Some retrieval queries returned no results.")
        print("Check that chromadb is installed and the DB path is correct.")


if __name__ == "__main__":
    main()
