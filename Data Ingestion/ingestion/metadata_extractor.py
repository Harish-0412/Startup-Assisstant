"""
metadata.py
Metadata passport creator 🪪
✔ File identity
✔ Language
✔ Doc type tagging
✔ Time stamping
"""

import os
from datetime import datetime
from typing import Dict, Optional


def generate_metadata(
    file_path: str,
    language: str = "unknown",
    doc_type: str = "policy",
    source: str = "unknown",
    extra: Optional[dict] = None,
) -> Dict:
    meta = {
        "file_name": os.path.basename(file_path),
        "file_path": file_path,
        "language": language,
        "document_type": doc_type,
        "source": source,
        "ingested_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }

    if extra:
        meta.update(extra)

    return meta


if __name__ == "__main__":
    m = generate_metadata("StartupPolicy.pdf", "en", "policy", "GovSite")
    print(m)
