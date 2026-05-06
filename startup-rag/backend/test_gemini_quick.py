import os
import google.generativeai as genai

# Load API key
api_key = "AIzaSyDIinfJEfeZpkGTDAQ8CVrPn-nQ7qhlup0"
print(f"Testing API key: {api_key[:20]}...")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash-exp")
    
    print("\nSending test prompt to Gemini...")
    response = model.generate_content("Say 'Hello from Gemini!' in exactly 3 words.")
    
    print(f"\n✅ SUCCESS! Gemini responded:")
    print(f"{response.text}")
    print("\n✅ API Key is valid and working!")
    
except Exception as e:
    print(f"\n❌ ERROR: {type(e).__name__}: {str(e)}")
    import traceback
    traceback.print_exc()
