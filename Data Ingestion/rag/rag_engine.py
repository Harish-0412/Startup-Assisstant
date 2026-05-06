"""
rag_engine.py
🔥 Heart of the RAG System 🔥

Responsibilities:
✔ Accept user question
✔ Detect language
✔ Retrieve relevant chunks
✔ Build safe prompt
✔ Call LLaMA via Groq
✔ Provide accurate grounded answer
✔ Prevent hallucinations
✔ Provide references
✔ Multilingual output
"""

from vector_store.retriever import Retriever
from rag.llm_client import LLMClient
from rag.prompt_template import build_prompt

from langdetect import detect


class RAGEngine:
    def __init__(self):
        print("\nInitializing RAG Engine...")
        self.retriever = Retriever()
        self.llm = LLMClient()
        print("RAG Engine Ready")

    # ------------------------------------
    # Language Detector
    # ------------------------------------
    def detect_language(self, text):
        try:
            lang = detect(text)
            return lang
        except Exception:
            return "en"

    # ------------------------------------
    # Pick Best Context Chunks
    # ------------------------------------
    def prepare_context(self, docs):
        cleaned = []
        seen = set()

        for d in docs:
            if not d or len(d.strip()) < 20:
                continue

            text = d.strip()

            if text in seen:
                continue

            seen.add(text)
            cleaned.append(text)

        return cleaned[:5]  # limit to avoid token overflow

    # ------------------------------------
    # Confidence Check
    # ------------------------------------
    def is_confident(self, docs):
        if not docs:
            return False
        
        # weak retrieval protection
        large_chunks = [d for d in docs if len(d) > 100]
        return len(large_chunks) >= 1


    # ------------------------------------
    # MAIN FUNCTION
    # ------------------------------------
    def ask(self, query, top_k=5, debug=False):
        print("\nProcessing your question...")

        # 1️⃣ Detect Query Language
        language = self.detect_language(query)

        if debug:
            print(f"Detected Language: {language}")

        # 2️⃣ Retrieve Relevant Knowledge
        try:
            docs, metas = self.retriever.search(query, top_k=top_k)
        except Exception as e:
            if debug:
                print(f"Retrieval error: {e}")
            return {
                "answer": "I encountered an issue while searching my knowledge base. Please make sure the vector database has been built (run option 2 from the main menu first).",
                "language": language,
                "references": [],
                "status": "retrieval_error"
            }

        if debug:
            print("\nRetrieved Docs:")
            for d in docs:
                print("\n--------------------")
                print(d[:300])

        # 3️⃣ Check if we have any results
        if not docs or len(docs) == 0:
            return {
                "answer": "I'm sorry, but I couldn't find any relevant information in my knowledge base to answer your question. This could mean:\n\n1. The question might be outside the scope of startup funding information I have access to\n2. The knowledge base might need to be updated with more documents\n\nCould you try rephrasing your question, or ask something specifically about startup funding policies, schemes, or programs?",
                "language": language,
                "references": [],
                "status": "no_results"
            }

        # 4️⃣ Prepare Clean Context
        context = self.prepare_context(docs)

        # 5️⃣ Build RAG Prompt
        prompt = build_prompt(query, context, language)

        messages = [
            {"role": "system", "content": "You are a friendly, knowledgeable Startup Funding Intelligence Assistant. You help people understand funding policies, schemes, and startup opportunities in a clear, conversational way. Always be honest about what you know and don't know. Answer naturally, like you're having a helpful conversation. If asked about topics outside startup funding, politely redirect to your expertise area."},
            {"role": "user", "content": prompt}
        ]

        # 6️⃣ Call LLaMA via Groq
        try:
            answer = self.llm.generate(messages)
            
            # Basic validation - if answer seems like an error message, handle it
            if not answer or len(answer.strip()) < 10:
                answer = "I'm sorry, but I couldn't generate a proper response. Please try rephrasing your question or try again later."
                status = "generation_error"
            else:
                status = "success"
        except Exception as e:
            if debug:
                print(f"LLM generation error: {e}")
            answer = "I encountered an issue while generating a response. Please check your GROQ_API_KEY environment variable and internet connection, then try again."
            status = "generation_error"

        # 7️⃣ Extract References
        references = []
        for m in metas[:len(context)]:  # Match references to actual context used
            references.append({
                "source_file": m.get("source_file", "unknown"),
                "language": m.get("language", "unknown"),
                "document_type": m.get("document_type", "unknown")
            })

        return {
            "answer": answer,
            "language": language,
            "references": references,
            "status": status
        }



# --------------------------------------
# Manual Test (You can run this directly)
# --------------------------------------
if __name__ == "__main__":
    engine = RAGEngine()

    user_query = input("\n💬 Ask your startup funding question: ")

    result = engine.ask(user_query, debug=True)

    print("\n================ RAG ANSWER ================")
    print(result["answer"])

    print("\n📌 References Used:")
    for ref in result["references"]:
        print(ref)

    print("\nStatus:", result["status"])
