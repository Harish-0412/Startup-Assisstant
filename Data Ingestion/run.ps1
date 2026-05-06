# PowerShell startup script for Startup Funding Intelligence System
# This script sets the GROQ_API_KEY and runs the application

$env:GROQ_API_KEY = "your_groq_api_key_here"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Startup Funding Intelligence System" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

python app.py


