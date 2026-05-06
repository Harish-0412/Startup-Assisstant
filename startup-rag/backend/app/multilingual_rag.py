from fastapi import HTTPException
from pydantic import BaseModel
from typing import Optional
from langdetect import detect

class ChatRequest(BaseModel):
    message: str
    language: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    detected_language: str

# Language mapping for responses
LANGUAGE_CODES = {
    'en': 'English',
    'hi': 'Hindi', 
    'ta': 'Tamil',
    'te': 'Telugu',
    'bn': 'Bengali',
    'mr': 'Marathi',
    'gu': 'Gujarati',
    'pa': 'Punjabi',
    'ur': 'Urdu',
    'kn': 'Kannada',
    'ml': 'Malayalam'
}

def detect_language(text: str) -> str:
    """Detect language of input text"""
    try:
        detected = detect(text)
        return LANGUAGE_CODES.get(detected, 'English')
    except:
        return 'English'

def get_multilingual_rag_response(message: str, language: str) -> str:
    """Get RAG response in specified language"""
    # Add language instruction to the prompt
    language_prompt = f"Please respond in {language}. {message}"
    
    # This integrates with your existing RAG system
    # The RAG system should be modified to include language context
    response = f"[Response in {language}] This is a sample response to: {message}"
    
    return response

async def chat_multilingual(request: ChatRequest):
    try:
        # Detect language if not provided
        if not request.language:
            detected_lang = detect_language(request.message)
        else:
            detected_lang = request.language
        
        # Get RAG response in detected/specified language
        response = get_multilingual_rag_response(request.message, detected_lang)
        
        return ChatResponse(
            response=response,
            detected_language=detected_lang
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))