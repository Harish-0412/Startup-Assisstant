"""
pipeline.py
Ultimate Ingestion Orchestrator ⚡
Brings together:
✔ pdf_loader
✔ web_processor
✔ cleaner
✔ chunker
✔ metadata
"""

from typing import Dict, List
import os

from ingestion.pdf_loader import load_pdf
from ingestion.web_processor import process_multiple_websites, STARTUP_FUNDING_URLS
from ingestion.cleaner import normalize_text
from ingestion.chunker import hybrid_chunker
from ingestion.metadata_extractor import generate_metadata


def process_pdf(
    path: str, aggressive_clean: bool = False, chunk_size: int = 700
) -> Dict:
    """
    Main processing pipeline
    Returns:
    {
       chunks: [...]
       metadata: {...}
       page_count:
       language:
       raw_text:
    }
    """

    # Load PDF / OCR automatically
    pdf = load_pdf(path)

    raw_text = pdf["full_text"]

    # Clean
    mode = "aggressive" if aggressive_clean else "basic"
    cleaned = normalize_text(raw_text, mode=mode)

    language = cleaned["language"]
    clean_text = cleaned["clean_text"]

    # Chunk
    chunks: List[str] = hybrid_chunker(clean_text, chunk_size=chunk_size)

    # Metadata
    metadata = generate_metadata(
        file_path=path,
        language=language,
        doc_type="startup_policy",
        source="ingestion_pipeline",
        extra={"pages": len(pdf["pages"]), "used_ocr": pdf["used_ocr"]},
    )

    return {
        "chunks": chunks,
        "metadata": metadata,
        "page_count": len(pdf["pages"]),
        "language": language,
        "raw_text": raw_text,
    }


def process_websites(urls: List[str] = None) -> List[Dict]:
    """
    Process websites through the ingestion pipeline
    Returns list of processed website data
    """
    if urls is None:
        urls = STARTUP_FUNDING_URLS
    
    print(f"Processing {len(urls)} websites...")
    return process_multiple_websites(urls)


if __name__ == "__main__":
    # Test PDF processing
    path = "StartupPolicy.pdf"  # change to your file
    if os.path.exists(path):
        result = process_pdf(path)
        print("PDF PROCESSING:")
        print("LANG:", result["language"])
        print("PAGES:", result["page_count"])
        print("CHUNKS:", len(result["chunks"]))
        print("META:", result["metadata"])
        print("SAMPLE:", result["chunks"][0][:500])
    
    # Test web processing
    print("\nWEB PROCESSING:")
    web_results = process_websites(STARTUP_FUNDING_URLS[:2])  # Test first 2 URLs
    for result in web_results:
        print(f"Title: {result['title']}")
        print(f"Chunks: {len(result['chunks'])}")
        print(f"Language: {result['language']}")
 