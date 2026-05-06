import requests
import json
import time

# Test configuration
BASE_URL = "http://localhost:8000"

def test_api():
    print("🧪 Testing Nivesh.ai Backend API...")
    
    # Test 1: Health check
    print("\n1. Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Health check failed: {e}")
        return
    
    # Test 2: Root endpoint
    print("\n2. Testing root endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/")
        print(f"   Status: {response.status_code}")
        print(f"   Message: {response.json()['message']}")
    except Exception as e:
        print(f"   ❌ Root endpoint failed: {e}")
        return
    
    # Test 3: Save founder profile
    print("\n3. Testing save founder profile...")
    profile_data = {
        "startup_stage": "mvp",
        "sector": "fintech",
        "location": "bangalore",
        "funding_goal": "50 lakhs",
        "preferred_language": "english"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/founder/profile", json=profile_data)
        print(f"   Status: {response.status_code}")
        print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Save profile failed: {e}")
        return
    
    # Test 4: Get founder profile
    print("\n4. Testing get founder profile...")
    try:
        response = requests.get(f"{BASE_URL}/founder/profile")
        print(f"   Status: {response.status_code}")
        print(f"   Profile: {response.json()['profile']}")
    except Exception as e:
        print(f"   ❌ Get profile failed: {e}")
        return
    
    # Test 5: Get funding advice (without Gemini API key)
    print("\n5. Testing funding advice endpoint...")
    question_data = {
        "question": "Should I raise seed funding now or wait for more traction?"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/funding/advice", json=question_data)
        print(f"   Status: {response.status_code}")
        if response.status_code == 200:
            advice = response.json()
            print(f"   Readiness Score: {advice['readiness_score']}")
            print(f"   Recommended Path: {advice['recommended_path']}")
            print(f"   Language: {advice['language']}")
            print(f"   Checklist Items: {len(advice['checklist'])}")
        else:
            print(f"   Response: {response.json()}")
    except Exception as e:
        print(f"   ❌ Funding advice failed: {e}")
    
    print("\n✅ API testing completed!")

if __name__ == "__main__":
    print("Make sure the server is running with: uvicorn app.main:app --reload")
    print("Waiting 3 seconds before testing...")
    time.sleep(3)
    test_api()