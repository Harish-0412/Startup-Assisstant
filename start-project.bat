@echo off
echo Starting AI-Verse Project...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd startup-rag\backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo Waiting for backend to start...
timeout /t 3 /nobreak >nul

echo Starting Frontend Client...
start "Frontend Client" cmd /k "npm run dev:client"

echo.
echo Both servers are starting...
echo Frontend: http://localhost:5000
echo Backend API: http://localhost:8000
echo.
pause