"""
funding_rag_engine.py
Enhanced RAG Engine optimized for startup funding queries
Provides accurate, funding-specific responses
"""

from rag.rag_engine import RAGEngine
from vector_store.retriever import Retriever
import re
from typing import Dict, List

class FundingRAGEngine(RAGEngine):
    def __init__(self):
        super().__init__()
        self.funding_keywords = [
            'funding', 'grant', 'loan', 'scheme', 'eligibility', 'application',
            'amount', 'criteria', 'process', 'startup', 'entrepreneur'
        ]
    
    def enhance_funding_query(self, query: str) -> str:
        """Enhance query to be more funding-specific"""
        
        # Add funding context if not present
        funding_terms = ['funding', 'grant', 'loan', 'scheme', 'money', 'financial']
        has_funding_term = any(term in query.lower() for term in funding_terms)
        
        if not has_funding_term:
            query = f"startup funding {query}"
        
        # Add specific context for better retrieval
        enhanced_query = f"{query} eligibility criteria application process amount"
        
        return enhanced_query
    
    def ask_funding_question(self, question: str, debug: bool = False) -> Dict:
        """Ask funding-specific question with enhanced processing"""
        
        # Enhance the query for better retrieval
        enhanced_question = self.enhance_funding_query(question)
        
        if debug:
            print(f"Original: {question}")
            print(f"Enhanced: {enhanced_question}")
        
        # Get standard RAG response
        result = self.ask(enhanced_question, debug=debug)
        
        # Post-process for funding-specific information
        if result['status'] == 'success':
            result = self._enhance_funding_response(result, question)
        
        return result
    
    def _enhance_funding_response(self, result: Dict, original_question: str) -> Dict:
        """Enhance response with funding-specific information"""
        
        answer = result['answer']
        
        # Extract funding amounts from answer
        amounts = re.findall(r'₹\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|crore|thousand)?', answer)
        
        # Extract eligibility mentions
        eligibility_sentences = []
        sentences = answer.split('.')
        for sentence in sentences:
            if any(word in sentence.lower() for word in ['eligible', 'criteria', 'requirement']):
                eligibility_sentences.append(sentence.strip())
        
        # Extract application process mentions
        application_sentences = []
        for sentence in sentences:
            if any(word in sentence.lower() for word in ['apply', 'application', 'process', 'submit']):
                application_sentences.append(sentence.strip())
        
        # Add structured funding information to result
        result['funding_details'] = {
            'amounts_mentioned': [f"{amt[0]} {amt[1]}".strip() for amt in amounts],
            'eligibility_info': eligibility_sentences[:3],
            'application_info': application_sentences[:3]
        }
        
        # Enhance answer with structured information
        if result['funding_details']['amounts_mentioned']:
            result['answer'] += f"\n\n💰 Funding Amounts: {', '.join(result['funding_details']['amounts_mentioned'])}"
        
        if result['funding_details']['eligibility_info']:
            result['answer'] += f"\n\n✅ Eligibility: {'. '.join(result['funding_details']['eligibility_info'])}"
        
        if result['funding_details']['application_info']:
            result['answer'] += f"\n\n📝 Application: {'. '.join(result['funding_details']['application_info'])}"
        
        return result

def create_funding_assistant():
    """Create a funding-focused RAG assistant"""
    try:
        engine = FundingRAGEngine()
        
        print("🏦 Funding Assistant Ready!")
        print("Ask me about startup funding, schemes, eligibility, and applications.")
        print("Type 'exit' to quit.\n")
        
        while True:
            question = input("💰 Funding Question: ").strip()
            
            if question.lower() in ['exit', 'quit', 'q']:
                print("👋 Goodbye!")
                break
            
            if not question:
                continue
            
            try:
                result = engine.ask_funding_question(question, debug=False)
                
                print("\n" + "="*60)
                print("📋 FUNDING INFORMATION")
                print("="*60)
                print(result["answer"])
                
                if result.get("funding_details"):
                    details = result["funding_details"]
                    if details["amounts_mentioned"]:
                        print(f"\n💰 Amounts: {', '.join(details['amounts_mentioned'])}")
                    if details["eligibility_info"]:
                        print(f"\n✅ Eligibility: {len(details['eligibility_info'])} criteria found")
                    if details["application_info"]:
                        print(f"\n📝 Application: {len(details['application_info'])} process steps found")
                
                print("="*60)
                
                if result.get("references"):
                    print(f"\n📚 Sources: {len(result['references'])} documents")
                
                print(f"\nStatus: {result.get('status', 'unknown')}\n")
                
            except Exception as e:
                print(f"\n❌ Error: {e}\n")
    
    except Exception as e:
        print(f"❌ Failed to initialize funding assistant: {e}")

if __name__ == "__main__":
    create_funding_assistant()