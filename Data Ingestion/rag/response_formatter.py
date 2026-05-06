"""
response_formatter.py
Elegant Finishing Layer for RAG Answers

Responsibilities:
✔ Beautify responses
✔ Structure information clearly
✔ Handle multilingual output
✔ Present references gracefully
✔ Add optional summary
✔ Add confidence hints
"""

import textwrap


class ResponseFormatter:

    def __init__(self):
        print("🎨 Response Formatter Ready")

    def format_references(self, references):
        if not references:
            return "No explicit references available."

        ref_text = ""
        for i, ref in enumerate(references, start=1):
            ref_text += f"""
[{i}]
 Source File     : {ref.get('source_file', 'unknown')}
 Language        : {ref.get('language', 'unknown')}
 Document Type   : {ref.get('document_type', 'unknown')}
"""

        return ref_text

    def add_summary(self, answer_text):
        # Light auto-summary attempt using simple heuristic
        if len(answer_text) < 250:
            return "Not enough content for summary."

        first_lines = answer_text.split("\n")[:3]
        return " ".join(first_lines)

    def format_final_response(
        self, answer, references=None, status="success", language="en"
    ):
        pretty_answer = textwrap.dedent(answer).strip()

        response = f"""
================= ✅ FINAL ANSWER =================

{pretty_answer}

---------------------------------------------------
📚 REFERENCES
{self.format_references(references)}

---------------------------------------------------
System Status : {status.upper()}
Language      : {language}

===================================================
"""

        return response


# ---------------------------------
# Manual Run Test
# ---------------------------------
if __name__ == "__main__":
    formatter = ResponseFormatter()

    answer = "Tamil Nadu provides startup incubation, funding assistance and policy support..."
    refs = [
        {
            "source_file": "TamilNaduPolicy.pdf",
            "language": "en",
            "document_type": "policy",
        }
    ]

    print(formatter.format_final_response(answer, refs))
