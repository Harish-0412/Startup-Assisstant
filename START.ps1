# ========================================
# START AI-VERSE - COMPLETE RAG SYSTEM
# ========================================

Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Cyan
Write-Host "  AI-VERSE - RAG INTELLIGENCE SYSTEM" -ForegroundColor Green
Write-Host "  Starting Backend, Frontend & RAG..." -ForegroundColor Yellow
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
Write-Host "[0/3] Checking Prerequisites..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Python not found!" -ForegroundColor Red
    Write-Host "   Please install Python 3.8+ first." -ForegroundColor Red
    exit 1
}

try {
    $nodeVersion = node --version 2>&1
    Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Setup RAG if needed
if (!(Test-Path "ai-verse\Data Ingestion\data")) {
    Write-Host "   Setting up RAG directories..." -ForegroundColor Yellow
    python setup-rag.py
}

# Start Backend in new window
Write-Host ""
Write-Host "[1/3] Starting Express Backend (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
Write-Host '========================================' -ForegroundColor Green
Write-Host '  AI-VERSE EXPRESS BACKEND' -ForegroundColor Green
Write-Host '  Port: 5000 (with RAG API)' -ForegroundColor Yellow
Write-Host '  Framework: Express.js + TypeScript' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Green
Write-Host ''
Set-Location 'C:\SideQuest\ai-verse\ai-verse'
npm run dev
"@

Write-Host "   Express Backend starting..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Start Python RAG Service (optional standalone)
Write-Host ""
Write-Host "[2/3] Python RAG Service (Integrated via Express)..." -ForegroundColor Cyan
Write-Host "   RAG Engine: Integrated with Express backend" -ForegroundColor Green
Write-Host "   Vector DB: ChromaDB" -ForegroundColor Green
Write-Host "   LLM: Groq API" -ForegroundColor Green

# Check if GROQ_API_KEY is set
$envFile = "ai-verse\Data Ingestion\.env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    if ($envContent -match "GROQ_API_KEY=.*[a-zA-Z0-9]") {
        Write-Host "   GROQ API Key: Configured ✓" -ForegroundColor Green
    } else {
        Write-Host "   WARNING: GROQ_API_KEY not set in $envFile" -ForegroundColor Yellow
        Write-Host "   RAG chat will not work without API key" -ForegroundColor Yellow
    }
} else {
    Write-Host "   WARNING: .env file not found" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# Summary
Write-Host ""
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Green
Write-Host "  AI-VERSE SYSTEM STARTED!" -ForegroundColor Green
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Green
Write-Host ""
Write-Host "  🌐 Main App:     " -ForegroundColor White -NoNewline; Write-Host "http://localhost:5000" -ForegroundColor Cyan
Write-Host "  🤖 RAG Assistant:" -ForegroundColor White -NoNewline; Write-Host "http://localhost:5000/rag" -ForegroundColor Cyan
Write-Host "  📊 Dashboard:    " -ForegroundColor White -NoNewline; Write-Host "http://localhost:5000/dashboard" -ForegroundColor Cyan
Write-Host "  🚀 Onboarding:   " -ForegroundColor White -NoNewline; Write-Host "http://localhost:5000/onboarding" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📁 Upload PDFs and scrape websites at /rag" -ForegroundColor Gray
Write-Host "  💬 Chat with your documents using RAG" -ForegroundColor Gray
Write-Host "  🔍 Search through your knowledge base" -ForegroundColor Gray
Write-Host ""
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Green
Write-Host ""

# Keep this window open
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
