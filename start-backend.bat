@echo off
cd /d "C:\SideQuest\ai-verse\ai-verse\startup-rag\backend"
start "Backend Server" cmd /k "python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
echo Backend server starting at http://localhost:8000
timeout /t 3 /nobreak >nul