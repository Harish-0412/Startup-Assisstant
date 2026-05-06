# Start backend development server with proper configuration
Write-Host "Starting Nivesh.ai Backend..." -ForegroundColor Green

# Navigate to backend directory
Set-Location $PSScriptRoot

# Set Python path
$env:PYTHONPATH = $PSScriptRoot

# Start uvicorn with Python 3.10 for RAG compatibility
py -3.10 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
