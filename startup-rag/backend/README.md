# Nivesh.ai Backend

AI Funding Co-Founder for Indian Startups - A GenAI hackathon project that helps founders make informed funding decisions.

## Features

- 🚀 **Founder Profile Management**: Save startup context (stage, sector, location, funding goals)
- 🤖 **AI Funding Advisor**: Get personalized funding advice using Google Gemini
- 📊 **Funding Readiness Score**: 0-100 score based on startup context
- 🎯 **Actionable Checklist**: 5-step actionable recommendations
- 🌐 **Multi-language Support**: Advice in preferred Indian languages
- 🇮🇳 **India-focused**: Tailored for Indian startup ecosystem

## Tech Stack

- **Backend**: FastAPI (Python)
- **LLM**: Google Gemini 1.5 Pro
- **Validation**: Pydantic
- **Environment**: python-dotenv

## Quick Start

### 1. Installation

```bash
# Clone and navigate to backend
cd startup-rag/backend

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Setup

```bash
# Edit .env file and add your Gemini API key
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Get Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy and paste in .env file

### 3. Run the Server

```bash
# From backend directory
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: `http://localhost:8000`

## API Endpoints

### 1. Save Founder Profile
```bash
POST /founder/profile
```

**Request Body:**
```json
{
  "startup_stage": "mvp",
  "sector": "fintech",
  "location": "bangalore",
  "funding_goal": "50 lakhs",
  "preferred_language": "english"
}
```

### 2. Get Funding Advice
```bash
POST /funding/advice
```

**Request Body:**
```json
{
  "question": "Should I raise seed funding now or wait for more traction?"
}
```

**Response:**
```json
{
  "readiness_score": 75,
  "recommended_path": "Seed Funding",
  "explanation": "Based on your MVP stage and fintech sector...",
  "checklist": [
    "Complete regulatory compliance check",
    "Prepare 18-month financial projections",
    "Build investor pitch deck",
    "Identify 10 target seed investors",
    "Demonstrate user traction metrics"
  ],
  "language": "english"
}
```

### 3. Other Endpoints
- `GET /` - API information
- `GET /health` - Health check
- `GET /founder/profile` - Get saved profile

## Testing the API

### Using curl:

```bash
# 1. Save profile
curl -X POST "http://localhost:8000/founder/profile" \
  -H "Content-Type: application/json" \
  -d '{
    "startup_stage": "mvp",
    "sector": "edtech", 
    "location": "mumbai",
    "funding_goal": "1 crore",
    "preferred_language": "hindi"
  }'

# 2. Get funding advice
curl -X POST "http://localhost:8000/funding/advice" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What funding options are best for my edtech startup?"
  }'
```

### Using Python requests:

```python
import requests

# Save profile
profile_data = {
    "startup_stage": "early_traction",
    "sector": "healthtech",
    "location": "delhi", 
    "funding_goal": "2 crores",
    "preferred_language": "english"
}

response = requests.post("http://localhost:8000/founder/profile", json=profile_data)
print(response.json())

# Get advice
question_data = {
    "question": "Should I apply for government grants or go for angel funding?"
}

response = requests.post("http://localhost:8000/funding/advice", json=question_data)
print(response.json())
```

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI app setup
│   ├── config.py        # Environment configuration  
│   ├── models.py        # Pydantic models
│   ├── prompts.py       # Prompt templates & knowledge base
│   ├── gemini_client.py # Gemini LLM integration
│   └── routes.py        # API endpoints
├── .env                 # Environment variables
├── requirements.txt     # Dependencies
└── README.md           # This file
```

## Knowledge Base

Currently uses hardcoded Indian startup funding knowledge including:
- Funding stages (Pre-seed, Seed, Series A)
- Typical funding amounts in INR
- Indian investor landscape
- Regulatory requirements
- Government grant schemes

**Note**: PDF-based RAG will be added later for dynamic knowledge updates.

## Supported Languages

- English
- Hindi  
- Tamil
- Telugu
- Bengali
- Marathi
- Gujarati

## Troubleshooting

### Common Issues:

1. **Gemini API Error**: Ensure valid API key in .env file
2. **Import Errors**: Run `pip install -r requirements.txt`
3. **Port Conflicts**: Change port with `--port 8001`

### Debug Mode:
```bash
uvicorn app.main:app --reload --log-level debug
```

## Next Steps (Post-Hackathon)

- [ ] Add PDF upload and RAG integration
- [ ] Implement user authentication
- [ ] Add database persistence
- [ ] Create investor matching algorithm
- [ ] Add real-time funding data integration

## License

MIT License - Built for GenAI Hackathon