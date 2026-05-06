"""
pdf_loader.py
Enterprise-grade PDF ingestion engine with:
✔ PyPDF text extraction
✔ Smart OCR fallback using PyMuPDF + Tesseract
✔ Page-wise & Full text output
✔ Clean error handling & logging
✔ Scanned PDF detection
"""

import os
import io
import logging
from typing import Dict, List, Optional
from pypdf import PdfReader

import fitz  # PyMuPDF
import pytesseract
from PIL import Image


# OPTIONAL: Enable this ONLY if you installed Tesseract in Windows
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


# -----------------------------------------
# Logging Setup
# -----------------------------------------
logging.basicConfig(
    level=logging.INFO, format="[PDF_LOADER] %(levelname)s - %(message)s"
)


# -----------------------------------------
# Utility
# -----------------------------------------
def is_scanned_pdf(pdf_path: str) -> bool:
    """Detect whether PDF is scanned (image-based)"""
    # A PDF is considered scanned if it has no selectable text
    # or if the text content is very sparse.
    try:
        reader = PdfReader(pdf_path)
        for page in reader.pages:
            if page.extract_text().strip():
                return False # Found selectable text, so not scanned
    except:
        return True
    return True


# -----------------------------------------
# PyPDF Extraction
# -----------------------------------------
def extract_text_pypdf(pdf_path: str) -> List[str]:
    pages_text = []

    try:
        reader = PdfReader(pdf_path) # Use pypdf directly

        for page in reader.pages:
            text = page.extract_text()
            text = text.strip() if text else ""
            pages_text.append(text)

        logging.info("PyPDF extraction completed successfully")
        return pages_text

    except Exception as e:
        logging.error(f"PyPDF extraction failed for {pdf_path}: {e}")
        return []


# -----------------------------------------
# OCR Extraction
# -----------------------------------------
def extract_text_ocr(pdf_path: str, language: str = "eng") -> List[str]:
    pages_text = []

    try:
        doc = fitz.open(pdf_path)

        for page in doc:
            pix = page.get_pixmap(dpi=300)
            img = Image.open(io.BytesIO(pix.tobytes()))
            text = pytesseract.image_to_string(img, lang=language)
            pages_text.append(text.strip())

        logging.info("OCR extraction completed successfully")
        return pages_text # Return the list of text pages

    except Exception as e:
        logging.error(f"OCR extraction failed: {e}")
        return []


# -----------------------------------------
# PUBLIC MAIN FUNCTION
# -----------------------------------------
def load_pdf(
    pdf_path: str, enable_ocr: bool = True, default_ocr_lang: str = "eng"
) -> Dict:
    """
    Master PDF loader
    Returns:
    {
      'file_name': str,
      'pages': [ "text per page"... ],
      'full_text': "entire doc",
      'used_ocr': bool
    }
    """

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    logging.info(f"Loading PDF: {pdf_path}")

    # 1️⃣ Try PyPDF First
    text_pages = extract_text_pypdf(pdf_path) # Call the function
    joined = " ".join(text_pages).strip()

    if joined and len(joined) > 50:
        logging.info("Successfully extracted using PyPDF")
        return {
            "file_name": os.path.basename(pdf_path),
            "pages": text_pages,
            "full_text": joined,
            "used_ocr": False,
        }

    logging.warning("PyPDF extraction weak or empty")
    
    # 2️⃣ Check if OCR needed
    if enable_ocr:
        if is_scanned_pdf(pdf_path):
            logging.info("PDF appears scanned. Using OCR...")
        else:
            logging.info("Falling back to OCR because useful text missing from PyPDF extraction.")

        text_pages = extract_text_ocr(pdf_path, default_ocr_lang)
        joined = " ".join(text_pages).strip()

        if joined and len(joined) > 50:
            return {
                "file_name": os.path.basename(pdf_path),
                "pages": text_pages,
                "full_text": joined,
                "used_ocr": True,
            }

    logging.error(f"PDF Extraction Failed Completely for {pdf_path}")
    return {
        "file_name": os.path.basename(pdf_path),
        "pages": [],
        "full_text": "",
        "used_ocr": enable_ocr,
    }


# -----------------------------------------
# Manual Test
# -----------------------------------------
if __name__ == "__main__":
    path = "sample.pdf"  # change this
    result = load_pdf(path)

    print("FILE:", result["file_name"])
    print("USED OCR:", result["used_ocr"])
    print("PAGES EXTRACTED:", len(result["pages"]))
    print("TEXT SAMPLE:", result["full_text"][:500])
