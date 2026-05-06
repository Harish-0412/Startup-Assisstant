@echo off
echo ========================================
echo Startup Funding Intelligence Setup
echo ========================================

echo.
echo 1. Installing Python dependencies...
pip install -r requirements.txt

echo.
echo 2. Setting GROQ_API_KEY environment variable...
set GROQ_API_KEY=your_groq_api_key_here

echo.
echo 3. Testing API key setup...
python -c "import os; print('API Key configured!' if os.getenv('GROQ_API_KEY') else 'API Key not found')"

echo.
echo 4. Testing LLM client...
python -c "from rag.llm_client import LLMClient; client = LLMClient(); print('LLM Client working!')"

echo.
echo 5. Testing embedder...
python -c "from vector_store.embedder import EmbeddingEngine; engine = EmbeddingEngine(); print('Embedder working!')"

echo.
echo ========================================
echo Setup Complete! You can now run:
echo   run_with_api_key.bat
echo   or
echo   python app.py
echo ========================================
pause