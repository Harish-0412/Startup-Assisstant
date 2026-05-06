import requests
import json
import time

# Wait for server to be ready
time.sleep(2)

print("\n" + "="*60)
print("BACKEND API TESTING")
print("="*60)

base_url = "http://localhost:8000"

# Test 1: Health Check
print("\n1. Health Check...")
try:
    r = requests.get(f"{base_url}/health", timeout=5)
    print(f"   Status: {r.status_code}")
    print(f"   Response: {r.json()}")
except Exception as e:
    print(f"   ERROR: {e}")
    exit(1)

# Test 2: Root endpoint
print("\n2. Root Endpoint...")
try:
    r = requests.get(f"{base_url}/", timeout=5)
    data = r.json()
    print(f"   Status: {r.status_code}")
    print(f"   Gemini Configured: {data.get('gemini_configured')}")
except Exception as e:
    print(f"   ERROR: {e}")
    exit(1)

# Test 3: AI Test Endpoint
print("\n3. AI Test...")
try:
    payload = {"prompt": "Say hello and generate a random number"}
    r = requests.post(f"{base_url}/ai/test", json=payload, timeout=10)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"   Success: {data['success']}")
        print(f"   Model: {data['model']}")
        print(f"   Response: {data['generated_text'][:60]}...")
    else:
        print(f"   ERROR: {r.text}")
except Exception as e:
    print(f"   ERROR: {e}")

# Test 4: Save Profile
print("\n4. Save Founder Profile...")
try:
    profile = {
        "startup_stage": "mvp",
        "sector": "fintech",
        "location": "bangalore",
        "funding_goal": "seed",
        "preferred_language": "english"
    }
    r = requests.post(f"{base_url}/founder/profile", json=profile, timeout=5)
    print(f"   Status: {r.status_code}")
    print(f"   Message: {r.json().get('message')}")
except Exception as e:
    print(f"   ERROR: {e}")

# Test 5: Get Funding Advice
print("\n5. Get Funding Advice...")
try:
    question = {"question": "What documents do I need?"}
    r = requests.post(f"{base_url}/funding/advice", json=question, timeout=15)
    print(f"   Status: {r.status_code}")
    if r.status_code == 200:
        data = r.json()
        print(f"   Readiness Score: {data['readiness_score']}")
        print(f"   Path: {data['recommended_path']}")
    else:
        print(f"   ERROR: {r.text}")
except Exception as e:
    print(f"   ERROR: {e}")

print("\n" + "="*60)
print("BACKEND TESTING COMPLETE")
print("="*60 + "\n")
