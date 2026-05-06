@echo off
echo ========================================
echo AI-VERSE MANUAL STARTUP GUIDE
echo ========================================
echo.

echo Step 1: Install Dependencies
echo ========================================
npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo Step 2: Create Required Directories
echo ========================================
mkdir "ai-verse\Data Ingestion\data\raw" 2>nul
mkdir "ai-verse\Data Ingestion\data\processed" 2>nul
mkdir "ai-verse\Data Ingestion\data\chunks" 2>nul
mkdir "ai-verse\Data Ingestion\data\vector_db" 2>nul
mkdir "uploads" 2>nul
echo Directories created successfully

echo.
echo Step 3: Create Environment File
echo ========================================
if not exist "ai-verse\Data Ingestion\.env" (
    echo # RAG Configuration > "ai-verse\Data Ingestion\.env"
    echo GROQ_API_KEY=your_groq_api_key_here >> "ai-verse\Data Ingestion\.env"
    echo Environment file created
) else (
    echo Environment file already exists
)

echo.
echo Step 4: Start Development Server
echo ========================================
echo Starting server on http://localhost:5000
echo.
npm run dev

pause