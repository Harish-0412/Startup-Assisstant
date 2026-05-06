@echo off
echo ========================================
echo RAG Integration Setup for Windows
echo ========================================
echo.

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found! Please install Python 3.8+ first.
    pause
    exit /b 1
)

echo.
echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)

echo.
echo Running Python setup script...
python setup-rag.py
if %errorlevel% neq 0 (
    echo ERROR: Setup script failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo IMPORTANT: Don't forget to:
echo 1. Set your GROQ_API_KEY in ai-verse/Data Ingestion/.env
echo 2. Get your API key from: https://console.groq.com/keys
echo.
echo To start the application:
echo   npm run dev
echo.
echo Then visit: http://localhost:5000/rag
echo.
pause