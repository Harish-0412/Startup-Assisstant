# Quick Test Script for Gemini AI Integration
# Run this after backend restart to verify AI is working

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "GEMINI AI - QUICK TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:8000"

# Test 1: Health Check
Write-Host "1. Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Write-Host "   Status: $($health.status)" -ForegroundColor Green
    Write-Host "   Gemini AI: $($health.gemini_ai)" -ForegroundColor Green
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
    exit 1
}

# Test 2: AI Test Endpoint
Write-Host "`n2. AI Generation Test..." -ForegroundColor Yellow
$testPrompt = @{
    prompt = "Say 'Hello from Nivesh.ai' and generate a random 3-digit number"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/ai/test" -Method Post -Body $testPrompt -ContentType "application/json"
    
    Write-Host "   Success: $($response.success)" -ForegroundColor Green
    Write-Host "   Model: $($response.model)" -ForegroundColor Green
    Write-Host "   Dynamic: $($response.is_dynamic)" -ForegroundColor Green
    Write-Host "   Generated: $($response.generated_text.Substring(0, [Math]::Min(80, $response.generated_text.Length)))..." -ForegroundColor Cyan
    
    if ($response.success -and $response.is_dynamic) {
        Write-Host "`n✅ GEMINI AI IS WORKING!" -ForegroundColor Green
    }
} catch {
    Write-Host "   Error: $_" -ForegroundColor Red
    Write-Host "`n❌ AI Test Failed - Backend may need restart" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================`n" -ForegroundColor Cyan
