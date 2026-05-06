#!/usr/bin/env python3
"""
Quick API test to verify Gemini AI is working
Run after backend restart
"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("\n" + "=" * 50)
print("GEMINI AI - QUICK API TEST")
print("=" * 50)

# Test 1: Health Check
print("\n1. Health Check...")
try:
    response = requests.get(f"{BASE_URL}/health")
    data = response.json()
    print(f"   Status: {data['status']}")
    print(f"   Gemini AI: {data['gemini_ai']}")
    
    if data['gemini_ai'] != 'configured':
        print("\n❌ Gemini not configured!")
        exit(1)
except Exception as e:
    print(f"   ❌ Error: {e}")
    exit(1)

# Test 2: AI Generation
print("\n2. AI Generation Test...")
try:
    payload = {
        "prompt": "Say 'Hello from Nivesh.ai' and generate a random 3-digit number"
    }
    response = requests.post(
        f"{BASE_URL}/ai/test",
        json=payload,
        headers={"Content-Type": "application/json"}
    )
    
    if response.status_code == 200:
        data = response.json()
        print(f"   Success: {data['success']}")
        print(f"   Model: {data['model']}")
        print(f"   Dynamic: {data['is_dynamic']}")
        print(f"   Generated: {data['generated_text'][:80]}...")
        
        if data['success'] and data['is_dynamic']:
            print("\n✅ GEMINI AI IS WORKING!")
        else:
            print("\n⚠ AI working but not dynamic")
    else:
        print(f"   ❌ HTTP {response.status_code}: {response.text}")
        exit(1)
        
except Exception as e:
    print(f"   ❌ Error: {e}")
    print("\n❌ Backend may need restart")
    exit(1)

print("\n" + "=" * 50 + "\n")
