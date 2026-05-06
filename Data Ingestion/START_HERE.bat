@echo off
echo ========================================
echo STARTUP FUNDING RAG SYSTEM - AUTO RUN
echo ========================================
echo This will automatically:
echo 1. Process PDFs
echo 2. Build vector database  
echo 3. Answer sample questions
echo 4. Start interactive mode
echo ========================================
echo.

set GROQ_API_KEY=your_groq_api_key_here
python app_clean.py

echo.
echo ========================================
echo SUCCESS! Your RAG system is ready!
echo ========================================
echo The PDF has been processed and indexed.
echo You can now ask questions about startup funding.
echo.
echo To use interactive mode, run: python app.py
echo ========================================
pause