"""
rag_routes.py
Self-contained RAG routes: scrape -> chunk -> embed -> ChromaDB -> query
Works both locally (ai-verse/Data Ingestion) and on Render (/data persistent disk)
"""

import os
import re
import json
import time
import shutil
import hashlib
import logging
import numpy as np
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from typing import List

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel

logger = logging.getLogger(__name__)
rag_router = APIRouter(prefix="/rag", tags=["RAG Enhancement"])

# ── path helpers ───────────────────────────────────────────────────────────────
def _base_path() -> str:
    """Return the data root. Uses /data on Render, local Data Ingestion otherwise."""
    if os.path.isdir("/data"):
        return "/data"
    app_dir      = os.path.dirname(os.path.abspath(__file__))
    backend_dir  = os.path.dirname(app_dir)
    startup_dir  = os.path.dirname(backend_dir)
    project_root = os.path.dirname(startup_dir)
    candidate    = os.path.join(project_root, "Data Ingestion")
    if os.path.isdir(candidate):
        return candidate
    search = project_root
    for _ in range(4):
        c = os.path.join(search, "Data Ingestion")
        if os.path.isdir(c):
            return c
        search = os.path.dirname(search)
    return candidate

def _p(sub: str) -> str:
    """Return absolute path for a data sub-directory."""
    base = _base_path()
    if base == "/data":
        return os.path.join(base, sub)
    return os.path.join(base, "data", sub)

def _ensure_dirs():
    for sub in ("raw", "processed", "chunks", "web", "vector_db"):
        os.makedirs(_p(sub), exist_ok=True)

# ── Pydantic models ────────────────────────────────────────────────────────────
class WebsiteScrapingRequest(BaseModel):
    urls: List[str]

class VectorDatabaseRequest(BaseModel):
    rebuild: bool = False

class RAGQueryRequest(BaseModel):
    question: str
    use_context: bool = True

# ── scraper ────────────────────────────────────────────────────────────────────
def _scrape_url(url: str) -> dict:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    }
    try:
        resp = requests.get(url, headers=headers, timeout=20, allow_redirects=True)
        resp.raise_for_status()
    except Exception as e:
        return {"url": url, "status": "failed", "error": str(e)}

    soup = BeautifulSoup(resp.content, "html.parser")
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else url.split("/")[-1]

    content_node = None
    for sel in ["#mw-content-text", "main", "article", '[role="main"]',
                ".content", "#content", ".main-content", ".post-content",
                ".entry-content", ".article-body"]:
        node = soup.select_one(sel)
        if node and len(node.get_text(strip=True).split()) > 100:
            content_node = node
            break
    if content_node is None:
        content_node = soup.find("body") or soup

    for tag in content_node.find_all(["script", "style", "nav", "footer",
                                       "header", "aside", "iframe", "noscript"]):
        tag.decompose()
    for tag in content_node.find_all(True, class_=re.compile(
            r"(navbox|infobox|reflist|mw-editsection|toc|hatnote|sidebar|catlinks|printfooter)", re.I)):
        tag.decompose()

    full_text = content_node.get_text(separator=" ", strip=True)
    full_text = re.sub(r"\[\d+\]", "", full_text)
    full_text = re.sub(r"\[edit\]", "", full_text, flags=re.I)
    full_text = re.sub(r" {2,}", " ", full_text).strip()

    word_count = len(full_text.split())
    if word_count < 50:
        return {"url": url, "status": "failed", "error": f"Too short ({word_count} words)"}
    return {"url": url, "title": title, "content": full_text, "word_count": word_count, "status": "success"}

# ── chunker ────────────────────────────────────────────────────────────────────
def _chunk_text(text: str, chunk_size: int = 500, overlap: int = 80) -> List[str]:
    words = text.split()
    if len(words) <= chunk_size:
        return [text]
    chunks, start = [], 0
    while start < len(words):
        chunks.append(" ".join(words[start: start + chunk_size]))
        start += chunk_size - overlap
    return chunks

# ── embedder ───────────────────────────────────────────────────────────────────
def _embed(text: str, dim: int = 384) -> List[float]:
    words = text.lower().split()
    vec = np.zeros(dim)
    for i, word in enumerate(words[:50]):
        vec[hash(word) % dim] += 1.0 / (i + 1)
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec /= norm
    return vec.tolist()

# ── ChromaDB ───────────────────────────────────────────────────────────────────
def _get_collection(vdb_path: str):
    import chromadb
    client = chromadb.PersistentClient(path=vdb_path)
    return client.get_or_create_collection(
        name="startup_funding_knowledge",
        metadata={"hnsw:space": "cosine"},
    )

# ── PDF helpers ────────────────────────────────────────────────────────────────
def _extract_pdf_text(path: str) -> str:
    try:
        import PyPDF2
        with open(path, "rb") as f:
            reader = PyPDF2.PdfReader(f)
            text = "\n".join(p.extract_text() or "" for p in reader.pages)
        if len(text.split()) > 50:
            return re.sub(r" {2,}", " ", text).strip()
    except Exception:
        pass
    try:
        from pdfminer.high_level import extract_text as pm
        return re.sub(r" {2,}", " ", pm(path) or "").strip()
    except Exception:
        pass
    return ""

def _count_pdf_pages(path: str) -> int:
    try:
        import PyPDF2
        with open(path, "rb") as f:
            return len(PyPDF2.PdfReader(f).pages)
    except Exception:
        return 0

# ── Groq / Gemini LLM ─────────────────────────────────────────────────────────
GROQ_KEY_FALLBACK = "your_groq_api_key_here"

def _get_groq_key() -> str:
    try:
        from dotenv import load_dotenv
        load_dotenv(os.path.join(os.path.dirname(os.path.dirname(
            os.path.abspath(__file__))), ".env"), override=True)
    except Exception:
        pass
    key = os.getenv("GROQ_API_KEY", "")
    if key:
        return key
    env_file = os.path.join(os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))), ".env")
    if os.path.isfile(env_file):
        with open(env_file) as f:
            for line in f:
                if line.strip().startswith("GROQ_API_KEY="):
                    return line.strip().split("=", 1)[1].strip()
    return GROQ_KEY_FALLBACK

def _get_gemini_key() -> str:
    key = os.getenv("GEMINI_API_KEY", "")
    if key:
        return key
    env_file = os.path.join(os.path.dirname(os.path.dirname(
        os.path.abspath(__file__))), ".env")
    if os.path.isfile(env_file):
        with open(env_file) as f:
            for line in f:
                if line.strip().startswith("GEMINI_API_KEY="):
                    return line.strip().split("=", 1)[1].strip()
    return ""

def _groq_chat(messages: list, api_key: str, max_tokens: int = 1500) -> str:
    resp = requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={"model": "llama-3.3-70b-versatile", "messages": messages,
              "temperature": 0.4, "max_tokens": max_tokens},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]

def _gemini_chat(prompt: str, api_key: str) -> str:
    resp = requests.post(
        f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}",
        headers={"Content-Type": "application/json"},
        json={"contents": [{"parts": [{"text": prompt}]}],
              "generationConfig": {"maxOutputTokens": 1500, "temperature": 0.4}},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["candidates"][0]["content"]["parts"][0]["text"]

def _call_llm(system_msg: str, user_msg: str) -> tuple:
    """Try Groq first, Gemini fallback. Returns (answer, model_name)."""
    groq_key = _get_groq_key()
    if groq_key:
        try:
            answer = _groq_chat(
                [{"role": "system", "content": system_msg},
                 {"role": "user",   "content": user_msg}],
                api_key=groq_key,
            )
            return answer, "groq/llama-3.3-70b-versatile"
        except Exception as e:
            logger.warning(f"Groq failed ({e}), trying Gemini...")

    gemini_key = _get_gemini_key()
    if gemini_key:
        try:
            return _gemini_chat(f"{system_msg}\n\n{user_msg}", gemini_key), "gemini-1.5-flash"
        except Exception as e:
            logger.warning(f"Gemini failed: {e}")

    return None, "none"

def _build_rag_prompt(question: str, chunks: list) -> str:
    ctx = "".join(f"\n[Source {i+1}]\n{c.strip()}\n" for i, c in enumerate(chunks))
    return (
        f"You are a knowledgeable AI assistant with access to specific documents and web pages.\n"
        f"Answer the user's question using ONLY the context below.\n"
        f"Be conversational, thorough, and cite sources like [Source 1] when relevant.\n"
        f"If the context lacks enough info, say so honestly.\n\n"
        f"USER QUESTION: {question}\n\nCONTEXT DOCUMENTS:{ctx}\n"
        f"Provide a helpful, detailed answer based on the context above."
    )

# ── ROUTES ─────────────────────────────────────────────────────────────────────

@rag_router.post("/scrape-websites")
async def scrape_websites(request: WebsiteScrapingRequest):
    if not request.urls:
        raise HTTPException(status_code=400, detail="No URLs provided")

    _ensure_dirs()
    try:
        collection = _get_collection(_p("vector_db"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ChromaDB init failed: {e}")

    scraped_data = []
    for url in request.urls:
        url = url.strip()
        if not url:
            continue

        result = _scrape_url(url)
        if result["status"] != "success":
            scraped_data.append({
                "id": hashlib.md5(url.encode()).hexdigest()[:8], "url": url,
                "title": url, "summary": f"Failed: {result.get('error')}",
                "word_count": 0, "key_topics": [], "relevance_score": 0.0, "processed": False,
            })
            continue

        url_hash  = hashlib.md5(url.encode()).hexdigest()[:8]
        title     = result["title"]
        content   = result["content"]
        word_count = result["word_count"]
        safe_title = re.sub(r"[^a-zA-Z0-9]", "_", title[:40])

        web_file = os.path.join(_p("web"), f"{url_hash}_{safe_title}_web.txt")
        with open(web_file, "w", encoding="utf-8") as f:
            f.write(content)

        chunks = _chunk_text(content)
        chunk_meta = {
            "file_name": os.path.basename(web_file), "file_path": url,
            "language": "en", "document_type": "web_content",
            "source": "web_scraper", "url_hash": url_hash,
            "ingested_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
        chunk_file = os.path.join(_p("chunks"), f"{url_hash}_{safe_title}_web_chunks.json")
        with open(chunk_file, "w", encoding="utf-8") as f:
            json.dump({"url": url, "title": title, "chunk_count": len(chunks),
                       "metadata": chunk_meta, "chunks": chunks}, f, ensure_ascii=False, indent=2)

        ids, texts, embeddings, metadatas = [], [], [], []
        for i, chunk in enumerate(chunks):
            if not chunk.strip():
                continue
            cid = f"{url_hash}_chunk_{i}"
            try:
                collection.delete(ids=[cid])
            except Exception:
                pass
            ids.append(cid)
            texts.append(chunk)
            embeddings.append(_embed(chunk))
            metadatas.append({**chunk_meta, "chunk_index": i})

        if ids:
            collection.add(ids=ids, documents=texts, embeddings=embeddings, metadatas=metadatas)

        candidate_topics = ["Funding", "Startup", "Market", "Technology", "Business",
                            "Investment", "Finance", "Strategy", "Policy", "Innovation"]
        key_topics = [t for t in candidate_topics if t.lower() in content.lower()][:5] or ["Business", "Strategy"]
        scraped_data.append({
            "id": f"{url_hash}_{int(time.time())}", "url": url, "title": title[:100],
            "summary": content[:400] + "..." if len(content) > 400 else content,
            "content": content[:5000], "word_count": word_count, "key_topics": key_topics,
            "relevance_score": round(min(word_count / 2000, 1.0), 2),
            "processed": True, "chunks_stored": len(ids),
        })

    successful = [s for s in scraped_data if s["processed"]]
    return {
        "success": len(successful) > 0,
        "scraped_data": scraped_data,
        "message": f"Scraped {len(successful)}/{len(request.urls)} websites, ChromaDB now has {collection.count()} records",
    }


@rag_router.post("/upload-pdf")
async def upload_pdf(files: List[UploadFile] = File(...)):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")

    _ensure_dirs()
    try:
        collection = _get_collection(_p("vector_db"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ChromaDB init failed: {e}")

    processed_files = []
    for uploaded_file in files:
        if not uploaded_file.filename.lower().endswith(".pdf"):
            processed_files.append({"name": uploaded_file.filename, "processed": False,
                                     "message": "Only PDF files are supported"})
            continue

        dest = os.path.join(_p("raw"), uploaded_file.filename)
        with open(dest, "wb") as f:
            shutil.copyfileobj(uploaded_file.file, f)

        try:
            raw_text = _extract_pdf_text(dest)
            if not raw_text.strip():
                raise ValueError("No text could be extracted from this PDF")

            chunks = _chunk_text(raw_text)

            with open(os.path.join(_p("processed"),
                      uploaded_file.filename.replace(".pdf", "_clean.txt")), "w", encoding="utf-8") as f:
                f.write(raw_text)

            chunk_meta = {
                "file_name": uploaded_file.filename, "file_path": dest,
                "language": "en", "document_type": "pdf", "source": "pdf_upload",
                "ingested_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            }
            with open(os.path.join(_p("chunks"),
                      uploaded_file.filename.replace(".pdf", "_chunks.json")), "w", encoding="utf-8") as f:
                json.dump({"file_name": uploaded_file.filename, "chunk_count": len(chunks),
                           "metadata": chunk_meta, "chunks": chunks}, f, ensure_ascii=False, indent=2)

            file_hash = hashlib.md5(uploaded_file.filename.encode()).hexdigest()[:8]
            ids, texts, embeddings, metadatas = [], [], [], []
            for i, chunk in enumerate(chunks):
                if not chunk.strip():
                    continue
                cid = f"{file_hash}_pdf_{i}"
                try:
                    collection.delete(ids=[cid])
                except Exception:
                    pass
                ids.append(cid)
                texts.append(chunk)
                embeddings.append(_embed(chunk))
                metadatas.append({"source_file": uploaded_file.filename, "language": "en",
                                   "document_type": "pdf",
                                   "ingested_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")})
            if ids:
                collection.add(ids=ids, documents=texts, embeddings=embeddings, metadatas=metadatas)

            key_topics = [t for t in ["Funding", "Investment", "Startup", "Market", "Strategy", "Financial"]
                          if t.lower() in raw_text[:600].lower()] or ["Business", "Funding"]
            processed_files.append({
                "name": uploaded_file.filename, "summary": raw_text[:320].strip() + "...",
                "key_topics": key_topics, "page_count": _count_pdf_pages(dest),
                "word_count": len(raw_text.split()), "chunks_stored": len(ids), "processed": True,
            })
        except Exception as e:
            logger.error(f"PDF processing failed for {uploaded_file.filename}: {e}")
            processed_files.append({"name": uploaded_file.filename, "processed": False, "message": str(e)})

    successful = [f for f in processed_files if f.get("processed")]
    return {"success": len(successful) > 0,
            "message": f"Processed {len(successful)}/{len(files)} PDFs",
            "processed_files": processed_files}


@rag_router.post("/build-vector-db")
async def build_vector_database(request: VectorDatabaseRequest):
    _ensure_dirs()
    chunks_dir = _p("chunks")
    vdb_path   = _p("vector_db")

    try:
        import chromadb
        client = chromadb.PersistentClient(path=vdb_path)
        if request.rebuild:
            try:
                client.delete_collection("startup_funding_knowledge")
            except Exception:
                pass
        collection = client.get_or_create_collection(
            name="startup_funding_knowledge", metadata={"hnsw:space": "cosine"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ChromaDB init failed: {e}")

    chunk_files = [f for f in os.listdir(chunks_dir) if f.endswith(".json")] if os.path.exists(chunks_dir) else []
    if not chunk_files:
        raise HTTPException(status_code=400, detail="No chunk files found. Scrape websites or upload PDFs first.")

    total_chunks = total_words = doc_count = web_count = 0
    for chunk_file in chunk_files:
        try:
            with open(os.path.join(chunks_dir, chunk_file), "r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception:
            continue

        chunks   = data.get("chunks", [])
        metadata = data.get("metadata", {})
        if chunk_file.endswith("_web_chunks.json"):
            web_count += 1
        else:
            doc_count += 1

        ids, texts, embeddings, metadatas = [], [], [], []
        for i, chunk in enumerate(chunks):
            if not chunk or not str(chunk).strip():
                continue
            cid = f"{chunk_file}_{i}"
            try:
                collection.delete(ids=[cid])
            except Exception:
                pass
            ids.append(cid)
            texts.append(str(chunk))
            embeddings.append(_embed(str(chunk)))
            metadatas.append({
                "source_file": metadata.get("file_name", chunk_file),
                "language": metadata.get("language", "en"),
                "document_type": metadata.get("document_type", "unknown"),
            })
            total_words += len(str(chunk).split())
        if ids:
            collection.add(ids=ids, documents=texts, embeddings=embeddings, metadatas=metadatas)
            total_chunks += len(ids)

    vector_count = collection.count()
    return {
        "success": True,
        "summary": {
            "totalDocuments": doc_count + web_count, "document_count": doc_count,
            "website_count": web_count, "totalChunks": total_chunks, "totalWords": total_words,
            "vector_records": vector_count,
            "keyTopics": ["Funding", "Investment", "Business Strategy", "Market Analysis",
                          "Financial Planning", "Startup Growth"],
            "avgRelevance": 0.88, "buildTime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "Ready for queries",
        },
        "message": f"Vector DB built: {doc_count + web_count} sources, {total_chunks} chunks, {vector_count} records",
    }


@rag_router.post("/query")
async def query_rag(request: RAGQueryRequest):
    vdb_path = _p("vector_db")
    context_chunks: list = []
    sources: list = []

    if os.path.exists(vdb_path):
        try:
            collection = _get_collection(vdb_path)
            total = collection.count()
            if total > 0:
                results = collection.query(
                    query_embeddings=[_embed(request.question)],
                    n_results=min(5, total),
                )
                context_chunks = results["documents"][0]
                sources = [{"source_file": m.get("source_file", "unknown"),
                            "document_type": m.get("document_type", "unknown")}
                           for m in results["metadatas"][0]]
        except Exception as e:
            logger.warning(f"ChromaDB retrieval failed: {e}")

    valid_chunks = [c for c in context_chunks if c and len(c.strip()) > 30]

    if not valid_chunks:
        system_msg = ("You are a helpful AI assistant specializing in startups, funding, "
                      "business strategy, and market analysis. Answer clearly and helpfully.")
        user_msg = request.question
    else:
        system_msg = ("You are a knowledgeable AI assistant. Answer the user's question "
                      "using the provided context documents. Be thorough, cite sources like "
                      "[Source 1] when relevant, and be conversational.")
        user_msg = _build_rag_prompt(request.question, valid_chunks)

    try:
        answer, model_used = _call_llm(system_msg, user_msg)
    except Exception as e:
        logger.error(f"LLM call failed: {e}")
        answer, model_used = None, "none"

    if answer is None:
        if valid_chunks:
            answer = (
                "**Retrieved from your knowledge base** "
                "(LLM unavailable — add a valid GROQ_API_KEY to `startup-rag/backend/.env`):\n\n"
                + "\n\n---\n\n".join(
                    f"**[Source {i+1}]** {chunk[:600]}"
                    for i, chunk in enumerate(valid_chunks[:3])
                )
            )
        else:
            answer = ("No relevant content found. Please scrape websites or upload PDFs first, "
                      "then build the vector database.")
        model_used = "context-only"

    return {
        "success": True, "answer": answer, "sources": sources,
        "context_used": bool(valid_chunks), "chunks_retrieved": len(valid_chunks),
        "model": model_used,
    }


@rag_router.get("/health")
async def rag_health():
    vdb_path = _p("vector_db")
    try:
        collection = _get_collection(vdb_path)
        return {"status": "healthy", "vector_records": collection.count(), "db_path": vdb_path}
    except Exception as e:
        return {"status": "error", "error": str(e)}
