@echo off
REM Run backend tests while server is running
echo Testing Backend APIs...
timeout /t 3 /nobreak >nul
"C:\Program Files\Python313\python.exe" test_backend_simple.py
pause
