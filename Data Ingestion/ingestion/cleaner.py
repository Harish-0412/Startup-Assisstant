"""
cleaner.py
Text purification chamber ✨
✔ Remove noise
✔ Normalize spacing
✔ Handle Indic + English text
✔ Optional aggressive cleaning mode
"""

import re
from langdetect import detect


def detect_language(text: str) -> str:
    """Detect language of text snippet"""
    try:
        return detect(text)
    except:
        return "unknown"


def basic_clean(text: str) -> str:
    """Light cleaning without losing content"""
    if not text:
        return ""

    text = text.replace("\r", " ")
    text = text.replace("\n", " ")
    text = text.replace("\t", " ")

    # Remove multiple spaces
    text = re.sub(r"\s+", " ", text)

    # Remove weird characters but keep Indian scripts
    text = re.sub(r"[•■◆�]", " ", text)

    return text.strip()


def aggressive_clean(text: str) -> str:
    """
    Heavy cleaning mode
    Use for extremely bad PDFs
    """

    text = basic_clean(text)

    # Remove page numbers like "Page 3 of 50"
    text = re.sub(r"Page\s*\d+\s*(of)?\s*\d*", " ", text, flags=re.IGNORECASE)

    # Remove stray numbering
    text = re.sub(r"\b\d{1,3}\b", " ", text)

    # Remove repeated punctuation
    text = re.sub(r"[.,;:]{2,}", ".", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


def normalize_text(text: str, mode: str = "basic") -> dict:
    """
    mode = "basic" or "aggressive"
    Returns:
    {
      "clean_text": "...",
      "language": "en"
    }
    """

    if mode == "aggressive":
        cleaned = aggressive_clean(text)
    else:
        cleaned = basic_clean(text)

    lang = detect_language(cleaned[:1000])

    return {"clean_text": cleaned, "language": lang}


if __name__ == "__main__":
    sample = """
    Government of Tamil Nadu
    STARTUP POLICY 2024

    Page 1 of 120
    This document supports AI, FinTech, Agriculture Startups...
    """

    result = normalize_text(sample, mode="basic")

    print("LANG:", result["language"])
    print("CLEANED:\n", result["clean_text"])
