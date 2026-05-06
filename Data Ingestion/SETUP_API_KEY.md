# How to Set GROQ_API_KEY on Windows

## Quick Setup (PowerShell - Current Session Only)

Run this command in PowerShell before running the program:

```powershell
$env:GROQ_API_KEY="your_groq_api_key_here"
```

Then run your program:
```powershell
python app.py
```

## Permanent Setup (PowerShell)

### For Current User (Recommended)

1. Open PowerShell
2. Run this command:
```powershell
[System.Environment]::SetEnvironmentVariable('GROQ_API_KEY', 'your_groq_api_key_here', 'User')
```

3. Close and reopen PowerShell
4. Verify:
```powershell
echo $env:GROQ_API_KEY
```

### For System-Wide (All Users - Requires Admin)

1. Open PowerShell as Administrator
2. Run:
```powershell
[System.Environment]::SetEnvironmentVariable('GROQ_API_KEY', 'your_groq_api_key_here', 'Machine')
```

## Alternative: Using Windows GUI

1. Press `Win + X` and select "System"
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "User variables", click "New"
5. Variable name: `GROQ_API_KEY`
6. Variable value: `your_groq_api_key_here`
7. Click OK on all dialogs
8. Restart your terminal/PowerShell

## Verify Setup

Test if the key is set correctly:
```powershell
python -c "import os; print('✅ API Key is set!' if os.getenv('GROQ_API_KEY') else '❌ API Key not found')"
```

## Important Notes

- **Never commit your API key to git** - it's sensitive information
- The API key is already in `.gitignore` to prevent accidental commits
- If you share your code, remove the API key from any documentation
- If your key is compromised, regenerate it from the Groq dashboard


