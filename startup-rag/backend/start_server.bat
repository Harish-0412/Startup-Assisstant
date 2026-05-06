@echo off
echo Starting Nivesh.ai Backend Server...
echo.
echo Make sure you have set GEMINI_API_KEY in .env file
echo.
cd /d "%~dp0"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000