# 🚀 How to Run AI-Verse Project

## Quick Start Guide

### Prerequisites
- ✅ **Node.js** v18+ (installed: v24.12.0)
- ✅ **Python** 3.10+ (installed: v3.13.9)
- ✅ **npm** (installed: v11.6.2)
- ✅ All dependencies installed

---

## Method 1: One-Command Startup (Recommended)

### Windows PowerShell:
```powershell
cd C:\SideQuest\ai-verse\ai-verse
npm run dev:full
```

This will:
1. Start Backend server in a new window (Port 8000)
2. Start Frontend server in current window (Port 5000)
3. Show you access URLs

### Alternative - Use Batch File:
```powershell
cd C:\SideQuest\ai-verse\ai-verse
.\start-backend.bat
npm run dev:client
```

---

## Method 2: Manual Startup (Two Terminals)

### Terminal 1: Backend Server
```powershell
cd C:\SideQuest\ai-verse\ai-verse\startup-rag\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2: Frontend Server
```powershell
cd C:\SideQuest\ai-verse\ai-verse
npm run dev:client
```

---

## Method 3: Using npm Scripts

### Start Both Servers:
```powershell
cd C:\SideQuest\ai-verse\ai-verse

# Terminal 1: Backend

python -m uvicorn app.main:app --reload --port 8000
cd startup-rag\backend
# Terminal 2: Frontend  
npm run dev:client
```

---

## Access Your Application

Once both servers are running:

- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

---

## Verify Installation

### Check Backend:
```powershell
# Test health endpoint
Invoke-WebRequest -Uri "http://localhost:8000/health" -UseBasicParsing
```

Expected response:
```json
{
  "status": "healthy",
  "service": "Nivesh.ai Backend",
  "gemini_ai": "configured"
}
```

### Check Frontend:
Open http://localhost:5000 in your browser. You should see the Nivesh.ai homepage.

---

## Troubleshooting

### Backend Not Starting?
1. Check if port 8000 is available:
   ```powershell
   netstat -ano | findstr :8000
   ```
2. Verify Python dependencies:
   ```powershell
   cd startup-rag\backend
   python -m pip list | Select-String "fastapi|uvicorn"
   ```
3. Check for GEMINI_API_KEY (optional but recommended):
   ```powershell
   # Create .env file in startup-rag/backend/
   # Add: GEMINI_API_KEY=your_key_here
   ```

### Frontend Not Starting?
1. Check if port 5000 is available:
   ```powershell
   netstat -ano | findstr :5000
   ```
2. Verify Node.js dependencies:
   ```powershell
   cd C:\SideQuest\ai-verse\ai-verse
   npm list --depth=0
   ```
3. Clear cache and reinstall:
   ```powershell
   rm -r node_modules
   npm install
   ```

### Port Already in Use?
- Backend: Change port with `--port 8001`
- Frontend: Vite will auto-switch to next available port (5001, 5002, etc.)

---

## Development Workflow

### Making Changes:
- **Backend**: Changes auto-reload with `--reload` flag
- **Frontend**: Vite HMR (Hot Module Replacement) updates automatically

### Stopping Servers:
- Press `Ctrl+C` in each terminal window

---

## Project Structure

```
ai-verse/
├── client/              # React Frontend
│   └── src/
│       ├── pages/       # Dashboard, Home, Onboarding
│       ├── components/  # UI Components
│       └── lib/         # API & Utilities
│
├── startup-rag/        # Python Backend
│   └── backend/
│       └── app/        # FastAPI Application
│
└── server/             # Express Server (optional)
```

---

## Environment Variables

### Backend (.env in startup-rag/backend/):
```env
GEMINI_API_KEY=your_gemini_api_key_here
ALLOWED_ORIGINS=http://localhost:5000,http://localhost:5173
```

### Frontend (.env in root):
```env
VITE_API_URL=http://localhost:8000
```

---

## Next Steps

1. ✅ Start both servers
2. ✅ Open http://localhost:5000
3. ✅ Complete onboarding to create your founder profile
4. ✅ Ask funding questions in the dashboard
5. ✅ Get AI-powered funding advice!

---

## Support

- Check `README.md` for detailed documentation
- Review `STARTUP_COMMANDS.md` for quick reference
- See `FINAL_DEPLOYMENT_READINESS.md` for production setup

---

**Happy Coding! 🚀**

