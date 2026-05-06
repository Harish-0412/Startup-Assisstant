# ========================================
# START AI-VERSE - COMPLETE SYSTEM
# ========================================

Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Cyan
Write-Host "  AI-VERSE - RAG INTELLIGENCE SYSTEM" -ForegroundColor Green
Write-Host "  Starting Backend, Frontend & RAG Integration..." -ForegroundColor Yellow
Write-Host "=" -ForegroundColor Cyan -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Cyan
Write-Host ""

# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check Prerequisites
Write-Host "[0/3] Checking Prerequisites..." -ForegroundColor Cyan
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   ✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ ERROR: Python not found!" -ForegroundColor Red
    exit 1
}

try {
    $nodeVersion = node --version 2>&1
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ ERROR: Node.js not found!" -ForegroundColor Red
    exit 1
}

# Check Data Ingestion folder
Write-Host ""
Write-Host "[0.5/3] Checking RAG Integration..." -ForegroundColor Cyan
$dataIngestionPath = "C:\SideQuest\ai-verse\ai-verse\Data Ingestion"
if (Test-Path $dataIngestionPath) {
    Write-Host "   ✅ Data Ingestion folder found" -ForegroundColor Green
    if (Test-Path "$dataIngestionPath\vector_store") {
        Write-Host "   ✅ Vector Store module found" -ForegroundColor Green
    }
    if (Test-Path "$dataIngestionPath\data\vector_db") {
        Write-Host "   ✅ Vector Database found" -ForegroundColor Green
    }
} else {
    Write-Host "   ⚠️  Data Ingestion folder not found (RAG will use fallback)" -ForegroundColor Yellow
}

# Start Backend in new window
Write-Host ""
Write-Host "[1/3] Starting Python FastAPI Backend (Port 8000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
Write-Host '========================================' -ForegroundColor Green
Write-Host '  AI-VERSE BACKEND SERVER' -ForegroundColor Green
Write-Host '  Port: 8000' -ForegroundColor Yellow
Write-Host '  Framework: FastAPI + Python' -ForegroundColor Yellow
Write-Host '  RAG: Integrated' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Green
Write-Host ''
`$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-Location 'C:\SideQuest\ai-verse\ai-verse\startup-rag\backend'
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
"@

Write-Host "   Backend starting in new window..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Start Frontend in new window
Write-Host ""
Write-Host "[2/3] Starting React Frontend (Port 5000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
Write-Host '========================================' -ForegroundColor Blue
Write-Host '  AI-VERSE FRONTEND' -ForegroundColor Blue
Write-Host '  Port: 5000' -ForegroundColor Yellow
Write-Host '  Framework: React 19 + Vite 7' -ForegroundColor Yellow
Write-Host '========================================' -ForegroundColor Blue
Write-Host ''
`$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
Set-Location 'C:\SideQuest\ai-verse\ai-verse'
npm run dev:client
"@

Write-Host "   Frontend starting in new window..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Verify servers
Write-Host ""
Write-Host "[3/3] Verifying Servers..." -ForegroundColor Cyan
Start-Sleep -Seconds 3

$backendOk = $false
$frontendOk = $false

try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 3 -UseBasicParsing
    $backendOk = $true
    Write-Host "   ✅ Backend: RUNNING" -ForegroundColor Green
} catch {
    Write-Host "   ⏳ Backend: Still starting..." -ForegroundColor Yellow
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -TimeoutSec 3 -UseBasicParsing
    $frontendOk = $true
    Write-Host "   ✅ Frontend: RUNNING" -ForegroundColor Green
} catch {
    Write-Host "   ⏳ Frontend: Still starting..." -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Green
Write-Host "  AI-VERSE SYSTEM STARTED!" -ForegroundColor Green
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Green
Write-Host ""
Write-Host "  🌐 Frontend:     " -ForegroundColor White -NoNewline; Write-Host "http://localhost:5000" -ForegroundColor Cyan
Write-Host "  🔧 Backend API:  " -ForegroundColor White -NoNewline; Write-Host "http://localhost:8000" -ForegroundColor Cyan
Write-Host "  📚 API Docs:     " -ForegroundColor White -NoNewline; Write-Host "http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  ❤️  Health Check: " -ForegroundColor White -NoNewline; Write-Host "http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "  🎯 Features Available:" -ForegroundColor Yellow
Write-Host "     • AI Funding Advisor (Gemini AI)" -ForegroundColor White
Write-Host "     • RAG Document Intelligence (Data Ingestion)" -ForegroundColor White
Write-Host "     • Investor Matching" -ForegroundColor White
Write-Host "     • Funding Timeline Calculator" -ForegroundColor White
Write-Host "     • Market Insights Dashboard" -ForegroundColor White
Write-Host "     • Precise Readiness Score" -ForegroundColor White
Write-Host ""
Write-Host "  📝 Next Steps:" -ForegroundColor Yellow
Write-Host "     1. Open http://localhost:5000 in your browser" -ForegroundColor White
Write-Host "     2. Complete onboarding to create your profile" -ForegroundColor White
Write-Host "     3. Ask funding questions in the dashboard" -ForegroundColor White
Write-Host "     4. Explore investor matches, timeline, and market insights" -ForegroundColor White
Write-Host ""
Write-Host "=" -ForegroundColor Green -NoNewline; Write-Host "".PadRight(60, "=") -ForegroundColor Green
Write-Host ""
Write-Host "  Check the new windows for server logs." -ForegroundColor Gray
Write-Host "  Press Ctrl+C in each window to stop servers." -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")





