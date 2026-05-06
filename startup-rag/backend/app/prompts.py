# Minimal fallback knowledge base - RAG provides primary knowledge
INDIAN_FUNDING_KNOWLEDGE = """
INDIAN STARTUP FUNDING STAGES:

1. PRE-SEED (₹5L - ₹50L):
- Friends & Family, Angel Networks
- Requirements: Basic MVP, team formation
- Timeline: 3-6 months development

2. SEED (₹50L - ₹5Cr):
- Angel investors, Micro VCs
- Requirements: Product-market fit signals, early revenue
- Key metrics: User growth, retention

3. SERIES A (₹5Cr - ₹25Cr):
- Tier-1 VCs (Sequoia, Accel, Matrix)
- Requirements: Proven business model, scalable revenue
- Key metrics: ARR ₹2Cr+, strong unit economics

4. GOVERNMENT GRANTS:
- SIDBI, MSME schemes, State government funds
- Sector-specific: DeepTech (₹50L), Social Impact (₹25L)

INDIAN ECOSYSTEM SPECIFICS:
- Regulatory compliance (FEMA, RBI guidelines)
- Local market understanding crucial
- Tier-2/3 city advantages for certain sectors
- GST registration mandatory for Series A+
"""

def get_funding_advisor_prompt(profile_data: dict, question: str, rag_context: str = "") -> str:
    """
    Generate prompt for Gemini with RAG context integration
    
    Args:
        profile_data: Founder profile information
        question: User's funding question
        rag_context: Retrieved context from RAG (if available)
    """
    
    # Use RAG context if available, otherwise fallback
    knowledge_section = f"""
RETRIEVED KNOWLEDGE FROM DOCUMENTS:
{rag_context}

FALLBACK KNOWLEDGE (use only if above is insufficient):
{INDIAN_FUNDING_KNOWLEDGE}
""" if rag_context else f"""
KNOWLEDGE BASE:
{INDIAN_FUNDING_KNOWLEDGE}

Note: Operating in limited mode. For better answers, ensure document knowledge base is loaded.
"""
    
    return f"""
You are an expert Indian startup funding advisor. Use the knowledge base and founder context to provide specific, actionable advice.

{knowledge_section}

FOUNDER CONTEXT:
- Stage: {profile_data.get('startup_stage', 'Not specified')}
- Sector: {profile_data.get('sector', 'Not specified')}
- Location: {profile_data.get('location', 'Not specified')}
- Funding Goal: {profile_data.get('funding_goal', 'Not specified')}
- Language: {profile_data.get('preferred_language', 'english')}

QUESTION: {question}

INSTRUCTIONS:
1. Provide a Funding Readiness Score (0-100) based on stage and context
2. Recommend specific funding path (Pre-seed/Seed/Series A/Grants)
3. Give explanation in {profile_data.get('preferred_language', 'english')} language
4. Create 5 specific, actionable steps
5. Focus on Indian ecosystem specifics
6. Be decisive, not generic

RESPONSE FORMAT (JSON):
{{
    "readiness_score": <number 0-100>,
    "recommended_path": "<specific funding type>",
    "explanation": "<detailed explanation in requested language>",
    "checklist": ["step1", "step2", "step3", "step4", "step5"],
    "language": "{profile_data.get('preferred_language', 'english')}"
}}
"""