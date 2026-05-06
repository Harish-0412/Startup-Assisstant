import google.generativeai as genai
import json
import logging
from app.config import GEMINI_API_KEY, GEMINI_MODEL

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiClient:
    def __init__(self):
        self.api_key = GEMINI_API_KEY
        self.model = None
        self.is_configured = False
        
        if self.api_key and self.api_key != "your_gemini_api_key_here":
            try:
                genai.configure(api_key=GEMINI_API_KEY)
                self.model = genai.GenerativeModel(GEMINI_MODEL)
                self.is_configured = True
                logger.info(f"Gemini client initialized with model: {GEMINI_MODEL}")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {str(e)}")
                self.model = None
        else:
            logger.warning("Gemini API key not configured. Using demo mode.")
    
    def generate_funding_advice(self, prompt: str) -> dict:
        """Generate funding advice using Gemini AI"""
        if not self.is_configured:
            logger.error("❌ Gemini not configured - CANNOT generate advice")
            raise ValueError("Gemini AI is not configured. Set GEMINI_API_KEY environment variable.")
            
        try:
            logger.info("🤖 Calling Gemini API...")
            response = self.model.generate_content(prompt)
            
            # Extract JSON from response
            response_text = response.text.strip()
            logger.info(f"✅ Gemini responded with {len(response_text)} chars")
            logger.debug(f"Raw response preview: {response_text[:200]}...")
            
            # Find JSON in response (handle markdown code blocks)
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                json_text = response_text[json_start:json_end].strip()
            elif "{" in response_text and "}" in response_text:
                json_start = response_text.find("{")
                json_end = response_text.rfind("}") + 1
                json_text = response_text[json_start:json_end]
            else:
                logger.error("❌ No JSON found in Gemini response")
                json_text = response_text
            
            parsed_response = json.loads(json_text)
            logger.info("✅ Successfully parsed JSON response")
            return parsed_response
            
        except json.JSONDecodeError as e:
            logger.error(f"❌ Failed to parse Gemini JSON response: {str(e)}")
            logger.error(f"Response text: {response_text[:500]}")
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
        except Exception as e:
            logger.error(f"❌ Gemini API error: {type(e).__name__}: {str(e)}")
            raise ValueError(f"AI generation failed: {type(e).__name__}: {str(e)}")
    
    def test_generation(self, prompt: str) -> str:
        """Simple test method for LLM verification"""
        if not self.is_configured:
            raise ValueError("Gemini API not configured. Check GEMINI_API_KEY environment variable.")
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            logger.error(f"Test generation failed: {type(e).__name__}: {str(e)}")
            raise

gemini_client = GeminiClient()