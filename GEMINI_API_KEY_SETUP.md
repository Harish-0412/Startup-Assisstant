# 🔑 GEMINI API KEY SETUP GUIDE

## ⚠️ CRITICAL: System Requires API Key to Function

Without `GEMINI_API_KEY`, the system will return **HTTP 503** errors and **cannot generate AI responses**.

---

## 📋 Quick Setup (Windows PowerShell)

### Option 1: Environment Variable (Current Session)
```powershell
cd "c:\ai-verse\startup-rag\backend"
$env:GEMINI_API_KEY="your_actual_api_key_here"
py -3.13 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Option 2: .env File (Persistent)
```powershell
cd "c:\ai-verse\startup-rag\backend"

# Create .env file
@"
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-2.5-flash
"@ | Out-File -FilePath .env -Encoding UTF8

# Start backend (will auto-load .env)
py -3.13 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 🔗 Get Your API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Paste into `.env` file or environment variable

**Example Key Format:**
```
AIzaSyB-xxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ✅ Verification Steps

### 1. Check Health Endpoint
```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:8000/health" -UseBasicParsing | Select-Object -ExpandProperty Content
```

**Expected Output (if API key is set):**
```json
{
  "status": "healthy",
  "service": "Nivesh.ai Backend",
  "gemini_ai": "configured"  ← Should say "configured"
}
```

**If you see `"gemini_ai": "not_configured"`, the API key is NOT loaded.**

---

### 2. Test AI Generation
```powershell
$headers = @{"Content-Type"="application/json"}
$body = '{"prompt":"Say hello in 5 words"}'

Invoke-RestMethod -Uri "http://127.0.0.1:8000/ai/test" -Method POST -Headers $headers -Body $body | ConvertTo-Json
```

**Expected Output:**
```json
{
  "success": true,
  "generated_text": "Hello! How are you doing?",  ← Dynamic response
  "model": "gemini-2.5-flash",
  "is_dynamic": true,
  "message": "AI is working correctly with dynamic output"
}
```

---

### 3. Test Full Pipeline
```powershell
# Save profile
$body1 = '{"startup_stage":"mvp","sector":"fintech","location":"Bangalore","funding_goal":"seed","preferred_language":"english"}'
Invoke-RestMethod -Uri "http://127.0.0.1:8000/founder/profile" -Method POST -Headers $headers -Body $body1

# Get advice (should work with API key)
$body2 = '{"question":"What funding should I raise now?"}'
Invoke-RestMethod -Uri "http://127.0.0.1:8000/funding/advice" -Method POST -Headers $headers -Body $body2 | ConvertTo-Json -Depth 10
```

**Expected Output:**
```json
{
  "readiness_score": 78,  ← Dynamic score
  "recommended_path": "Seed Funding",
  "explanation": "Based on your MVP stage...",  ← AI-generated explanation
  "checklist": [
    "..." ← 5 specific steps
  ],
  "language": "english"
}
```

---

## 🐛 Troubleshooting

### Error: "AI service not configured"
**Cause:** API key not loaded  
**Fix:**
1. Check `.env` file exists: `Test-Path .env`
2. Check key is set: `$env:GEMINI_API_KEY` (should not be empty)
3. Restart backend after creating `.env`

### Error: "Invalid API key"
**Cause:** Wrong or expired API key  
**Fix:**
1. Generate new key from Google AI Studio
2. Update `.env` file
3. Restart backend

### Error: "Quota exceeded"
**Cause:** API usage limit reached  
**Fix:**
1. Check quota at: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
2. Wait for reset or upgrade plan

---

## 📁 File Locations

- **Backend .env:** `c:\ai-verse\startup-rag\backend\.env`
- **.env.example:** `c:\ai-verse\startup-rag\backend\.env.example`
- **Config file:** `c:\ai-verse\startup-rag\backend\app\config.py`

---

## 🔒 Security Reminders

✅ **NEVER** commit `.env` to git  
✅ **NEVER** hardcode API keys in source  
✅ Use `.env.example` as template only  
✅ Rotate keys if accidentally exposed  
✅ Set `.env` permissions (read-only)

---

## 🚀 Production Deployment

### Render
Set environment variable in dashboard:
```
Key: GEMINI_API_KEY
Value: your_actual_api_key_here
```

### Vercel (Frontend)
```
Key: VITE_API_URL
Value: https://your-backend.onrender.com
```

---

**Need Help?** See `CRITICAL_AUDIT_REPORT.md` for detailed system documentation.
