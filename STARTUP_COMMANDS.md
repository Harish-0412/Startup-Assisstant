# 🚀 NIVESH.AI - STARTUP COMMANDS

## Quick Start (Run these in separate terminals)

### Terminal 1: Backend
```powershell
cd c:\ai-verse\startup-rag\backend
py -3.10 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 2: Frontend
```powershell
cd c:\ai-verse
npm run dev:client
```

---

## Access Your Application

- **Frontend:** http://localhost:5001
- **Backend:** http://localhost:8000
- **Health Check:** http://localhost:8000/health
- **API Docs:** http://localhost:8000/docs

---

## One-Command Startup (Recommended)

Run this in PowerShell to start both servers in separate windows:

```powershell
.\START.ps1
```

This will:
1. Start Backend in a new window (Python 3.10, Port 8000)
2. Start Frontend in a new window (React + Vite, Port 5001)
3. Show you the access URLs

---

## Troubleshooting

### Backend won't start
- Verify Python 3.10 is installed: `py -3.10 --version`
- Install dependencies: `cd startup-rag/backend; py -3.10 -m pip install -r requirements.txt`
- Check API key in `.env` file

### Frontend won't start
- Install dependencies: `npm install`
- Clear cache: `npm run clean` (if available)

### Port already in use
- Backend: Change port with `--port 8001`
- Frontend: Vite will auto-switch to 5002 if 5001 is busy

---

## Stop Servers

Press `Ctrl+C` in each terminal window to stop the servers.

---

## Production Deployment

See [FINAL_DEPLOYMENT_READINESS.md](FINAL_DEPLOYMENT_READINESS.md) for deployment instructions.
