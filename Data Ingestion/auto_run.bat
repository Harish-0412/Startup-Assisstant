@echo off
echo ========================================
echo Automated RAG System Runner
echo ========================================
echo This will automatically:
echo 1. Process PDFs
echo 2. Build vector database  
echo 3. Answer sample questions
echo ========================================
echo.

set GROQ_API_KEY=your_groq_api_key_here
python auto_run.py

echo.
echo ========================================
echo Auto-run complete! 
echo Run 'python app.py' for interactive mode
echo ========================================
pause