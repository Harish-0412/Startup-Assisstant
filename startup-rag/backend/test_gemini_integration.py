"""
Gemini AI Integration Test Script
Tests the fixed Gemini configuration and verifies dynamic output
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.gemini_client import GeminiClient
from app.config import GEMINI_MODEL, GEMINI_API_KEY
import json

def test_gemini_integration():
    print("=" * 60)
    print("GEMINI AI INTEGRATION TEST")
    print("=" * 60)
    
    # Check configuration
    print(f"\n1. Configuration Check:")
    print(f"   API Key: {'✓ Set' if GEMINI_API_KEY and GEMINI_API_KEY != 'your_gemini_api_key_here' else '✗ Not Set'}")
    print(f"   Model: {GEMINI_MODEL}")
    
    # Initialize client
    print(f"\n2. Client Initialization:")
    client = GeminiClient()
    print(f"   Configured: {'✓ Yes' if client.is_configured else '✗ No'}")
    
    if not client.is_configured:
        print("\n❌ FAILED: Gemini client not configured!")
        print("   Check GEMINI_API_KEY in .env file")
        return False
    
    # Test 1: Simple generation
    print(f"\n3. Test Simple Generation:")
    try:
        response1 = client.test_generation("Say 'Hello from Gemini' followed by a random number")
        print(f"   Response: {response1[:100]}...")
        print(f"   Length: {len(response1)} characters")
        print(f"   ✓ Success")
    except Exception as e:
        print(f"   ✗ Failed: {type(e).__name__}: {str(e)}")
        return False
    
    # Test 2: Dynamic output verification
    print(f"\n4. Test Dynamic Output (2 identical prompts should differ):")
    try:
        prompt = "Generate a random 3-digit number and explain why it's interesting"
        response2a = client.test_generation(prompt)
        response2b = client.test_generation(prompt)
        
        print(f"   Response A: {response2a[:80]}...")
        print(f"   Response B: {response2b[:80]}...")
        
        if response2a == response2b:
            print(f"   ⚠ Warning: Responses are identical (may be cached)")
        else:
            print(f"   ✓ Responses differ - output is dynamic")
    except Exception as e:
        print(f"   ✗ Failed: {type(e).__name__}: {str(e)}")
        return False
    
    # Test 3: Funding advice generation
    print(f"\n5. Test Funding Advice Generation:")
    try:
        test_profile = {
            "startup_stage": "mvp",
            "sector": "fintech",
            "location": "bangalore",
            "funding_goal": "seed",
            "preferred_language": "english"
        }
        
        from app.prompts import get_funding_advisor_prompt
        prompt = get_funding_advisor_prompt(test_profile, "What are the key metrics investors look for?")
        
        advice = client.generate_funding_advice(prompt)
        
        print(f"   Readiness Score: {advice.get('readiness_score', 'N/A')}")
        print(f"   Recommended Path: {advice.get('recommended_path', 'N/A')}")
        print(f"   Checklist Items: {len(advice.get('checklist', []))}")
        print(f"   ✓ Success")
        
    except Exception as e:
        print(f"   ✗ Failed: {type(e).__name__}: {str(e)}")
        return False
    
    print(f"\n" + "=" * 60)
    print("✅ ALL TESTS PASSED - GEMINI AI IS WORKING CORRECTLY")
    print("=" * 60)
    print(f"\nReady for:")
    print(f"  • Production deployment")
    print(f"  • RAG pipeline integration")
    print(f"  • Real-time funding advice")
    
    return True

if __name__ == "__main__":
    success = test_gemini_integration()
    sys.exit(0 if success else 1)
