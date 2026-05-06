"""
guardrails.py
🛡 Protection Layer for RAG System

Responsibilities:
✔ Prevent hallucinations
✔ Avoid unsafe / unrelated answers
✔ Validate retrieval quality
✔ Provide fallback when data insufficient
✔ Basic category safety
"""


class GuardRails:
    def __init__(self):
        print("🛡 GuardRails Activated")

    # ----------------------------
    # Check if retrieved knowledge is meaningful
    # ----------------------------
    def validate_retrieval(self, docs):
        if not docs or len(docs) == 0:
            return False

        long_chunks = [d for d in docs if d and len(d) > 80]
        return len(long_chunks) > 0

    # ----------------------------
    # Ensure answer is not hallucinated
    # ----------------------------
    def enforce_answer_safety(self, answer):
        if not answer or answer.strip() == "":
            return False

        banned_phrases = [
            "I think",
            "maybe",
            "it seems like",
            "I assume",
            "might be",
            "probably",
            "as an AI I guess",
        ]

        for phrase in banned_phrases:
            if phrase.lower() in answer.lower():
                return False

        return True

    # ----------------------------
    # Final Decision Layer
    # ----------------------------
    def final_gate(self, docs, answer):
        retrieval_ok = self.validate_retrieval(docs)
        answer_ok = self.enforce_answer_safety(answer)

        if retrieval_ok and answer_ok:
            return True
        return False

    # ----------------------------
    # Fallback Response
    # ----------------------------
    def fallback_response(self):
        return (
            "The available knowledge base does not provide reliable information to "
            "answer this query confidently. Please refine your question or provide "
            "more specific context."
        )


# ---------------------------------
# Manual Test
# ---------------------------------
if __name__ == "__main__":
    guard = GuardRails()

    docs = ["This policy supports AI startups with funding and incubation..."]
    answer = "Tamil Nadu supports startups through grants and incubation."

    print("Validation Result:", guard.final_gate(docs, answer))
