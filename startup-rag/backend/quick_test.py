import requests
import json

print("🧪 Testing Nivesh.ai API...")

# Test 1: Health Check
print("\n1. Health Check:")
response = requests.get("http://localhost:8000/health")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Test 2: Save Profile
print("\n2. Save Founder Profile:")
profile = {
    "startup_stage": "mvp",
    "sector": "fintech",
    "location": "bangalore", 
    "funding_goal": "50 lakhs",
    "preferred_language": "english"
}
response = requests.post("http://localhost:8000/founder/profile", json=profile)
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}")

# Test 3: Get Funding Advice
print("\n3. Get Funding Advice:")
question = {"question": "Should I raise seed funding now?"}
response = requests.post("http://localhost:8000/funding/advice", json=question)
print(f"Status: {response.status_code}")
if response.status_code == 200:
    advice = response.json()
    print(f"Readiness Score: {advice['readiness_score']}")
    print(f"Recommended Path: {advice['recommended_path']}")
    print(f"Checklist: {advice['checklist'][:2]}...")  # First 2 items
else:
    print(f"Error: {response.json()}")

print("\n✅ Testing complete!")