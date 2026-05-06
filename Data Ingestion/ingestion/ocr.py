"""
ocr.py
Robust OCR engine for scanned PDFs
✔ Page-wise OCR
✔ High DPI rendering
✔ Multilingual support
✔ Clean logging
"""

import io
import os
import logging
from typing import List, Dict

import fitz  # PyMuPDF
import pytesseract
from PIL import Image


# If on Windows & custom install path, uncomment and edit below:
# pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


logging.basicConfig(level=logging.INFO, format="[OCR] %(levelname)s - %(message)s")


def supported_language_info():
    """Returns list of installed OCR languages"""
    try:
        langs = pytesseract.get_languages(config="")
        return langs
    except Exception as e:
        logging.error(f"Failed to list OCR languages: {e}")
        return []


def ocr_pdf(pdf_path: str, language: str = "eng", dpi: int = 300) -> Dict:
    """
    Perform OCR on scanned PDF
    Returns:
    {
       'file_name': str,
       'pages': [ "text", "text"...],
       'full_text': "...",
       'language_used': str
    }
    """

    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    logging.info(f"OCR Started: {pdf_path}")
    logging.info(f"OCR Language: {language}")

    pages_text: List[str] = []

    try:
        doc = fitz.open(pdf_path)

        for i, page in enumerate(doc):
            logging.info(f"OCR processing page: {i + 1}/{doc.page_count}")

            pix = page.get_pixmap(dpi=dpi)
            img = Image.open(io.BytesIO(pix.tobytes()))

            text = pytesseract.image_to_string(img, lang=language)
            text = text.strip() if text else ""

            pages_text.append(text)

        joined_text = " ".join(pages_text).strip()

        logging.info("OCR completed successfully")

        return {
            "file_name": os.path.basename(pdf_path),
            "pages": pages_text,
            "full_text": joined_text,
            "language_used": language,
        }

    except Exception as e:
        logging.error(f"OCR failed: {e}")

        return {
            "file_name": os.path.basename(pdf_path),
            "pages": [],
            "full_text": "",
            "language_used": language,
        }


if __name__ == "__main__":
    test_pdf = "sample_scanned.pdf"  # change
    result = ocr_pdf(test_pdf, language="eng")

    print("FILE:", result["file_name"])
    print("LANG:", result["language_used"])
    print("PAGES:", len(result["pages"]))
    print("SAMPLE:", result["full_text"][:400])
