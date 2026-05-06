# 🚀 How to Run AI-Verse RAG System

## Quick Start (Recommended)

### Option 1: PowerShell Script
```powershell
cd C:\SideQuest\ai-verse\ai-verse
.\START.ps1
```

### Option 2: Python Run Script
```bash
cd C:\SideQuest\ai-verse\ai-verse
python run-rag.py
```

### Option 3: Manual Setup
```bash
# 1. Setup RAG
python setup-rag.py

# 2. Install dependencies
npm install

# 3. Start server
npm run dev
```

## 🔧 Prerequisites

- **Python 3.8+** (for RAG engine)
- **Node.js 18+** (for web interface)
- **GROQ API Key** (for LLM responses)

## 📋 Step-by-Step Setup

### 1. Get GROQ API Key
1. Visit: https://console.groq.com/keys
2. Create account and generate API key
3. Copy the key (starts with `gsk_...`)

### 2. Configure Environment
Create/edit `ai-verse/Data Ingestion/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Run the System
```powershell
# Windows PowerShell
.\START.ps1

# Or manually
npm run dev
```

## 🌐 Access Points

Once running, visit:

- **🏠 Main App**: http://localhost:5000
- **🤖 RAG Assistant**: http://localhost:5000/rag
- **📊 Dashboard**: http://localhost:5000/dashboard
- **🚀 Onboarding**: http://localhost:5000/onboarding

## 📚 RAG Features

### 1. Document Ingestion
- **PDF Upload**: Drag & drop PDF files
- **Website Scraping**: Enter URLs to scrape content
- **Processing**: Automatic text extraction and chunking

### 2. Vector Database
- **Build Database**: Process all documents into searchable vectors
- **Semantic Search**: Find relevant content using AI

### 3. RAG Chat
- **General RAG**: Ask questions about any documents
- **Funding Assistant**: Specialized startup funding queries
- **Chat History**: Persistent conversation sessions

### 4. Search & Discovery
- **Document Search**: Find specific content
- **Source References**: See which documents provided answers
- **Multi-language**: Support for multiple languages

## 🎯 Usage Workflow

1. **Upload Documents** → Go to `/rag` → Data Ingestion tab
2. **Build Vector DB** → Click "Build Vector Database"
3. **Start Chatting** → RAG Chat tab → Ask questions
4. **Search Content** → Document Search tab → Find specific info

## 🔍 Enhanced Onboarding Features

The new onboarding includes:

### Personal Information
- Founder name and company details
- Location and language preferences

### Business Details
- Team size (Solo, 2-3, 4-10, 10+)
- Monthly revenue ranges
- Business stage and sector

### Funding Goals
- Target funding type (Grant, Angel, VC)
- Specific funding amount
- Timeline and requirements

### Challenges & Use Cases
- Common startup challenges selection
- Specific use case description
- Personalized AI recommendations

### Document Upload
- Business plans, pitch decks
- Financial projections
- Legal documents

## 🛠️ Troubleshooting

### Common Issues

1. **Port 5000 in use**
   ```bash
   # Kill process using port 5000
   netstat -ano | findstr :5000
   taskkill /PID <process_id> /F
   ```

2. **Python modules not found**
   ```bash
   cd "ai-verse/Data Ingestion"
   pip install -r requirements.txt
   ```

3. **GROQ API errors**
   - Check API key in `.env` file
   - Verify key is valid at console.groq.com
   - Check internet connection

4. **Vector database issues**
   - Delete `ai-verse/Data Ingestion/data/vector_db/`
   - Re-upload documents
   - Rebuild vector database

### Debug Mode
Enable detailed logging:
```python
# In RAG engine
result = engine.ask(question, debug=True)
```

## 📁 Project Structure

```
ai-verse/
├── client/src/
│   ├── components/features/
│   │   ├── RAGChat.tsx           # Chat interface
│   │   └── DocumentIngestion.tsx # Upload UI
│   └── pages/
│       ├── RAGPage.tsx           # Main RAG page
│       └── Onboarding.tsx        # Enhanced onboarding
├── server/
│   ├── rag-service.ts            # Python bridge
│   └── routes.ts                 # API endpoints
├── ai-verse/Data Ingestion/      # RAG engine
└── setup-rag.py                 # Setup script
```

## 🚀 Additional Features

### Smart Recommendations
- Personalized funding suggestions based on profile
- Industry-specific advice and resources
- Investor matching based on sector and stage

### Advanced Analytics
- Document processing statistics
- Chat interaction insights
- Funding readiness scoring

### Multi-language Support
- Hindi, Tamil, Telugu interfaces
- Localized funding information
- Regional investor databases

## 🔄 Development

### Making Changes
- **Frontend**: Hot reload with Vite
- **Backend**: Auto-restart with nodemon
- **RAG Engine**: Modify Python files directly

### Adding Features
1. Update database schema in `shared/schema.ts`
2. Add API routes in `server/routes.ts`
3. Create React components in `client/src/components/`
4. Extend RAG functionality in Python modules

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review console logs for errors
3. Verify all prerequisites are installed
4. Check API key configuration

---

**🎉 Your AI-Verse RAG System is ready!**

Start by visiting http://localhost:5000/rag to upload documents and begin chatting with your AI assistant.