# RAG Intelligence System Integration

This document describes the complete integration of your RAG (Retrieval-Augmented Generation) model into the ai-verse project.

## 🚀 Features Integrated

### ✅ Data Ingestion
- **PDF Processing**: Upload and process PDF documents with OCR support
- **Website Scraping**: Scrape and process website content
- **Multi-language Support**: Automatic language detection and processing
- **Chunking & Metadata**: Intelligent text chunking with metadata extraction

### ✅ Vectorization
- **Semantic Embeddings**: Convert text chunks to vector embeddings
- **Vector Database**: ChromaDB integration for efficient similarity search
- **Batch Processing**: Process multiple documents efficiently

### ✅ RAG Chat Interface
- **General RAG**: Ask questions about any processed documents
- **Funding Assistant**: Specialized assistant for startup funding queries
- **Chat Sessions**: Persistent chat history with session management
- **Real-time Responses**: Fast responses powered by Groq LLM

### ✅ Search & Discovery
- **Semantic Search**: Find relevant document chunks
- **Source References**: Track which documents provided information
- **Multi-modal Results**: Support for PDF and web content

## 🏗️ Architecture

```
Frontend (React/TypeScript)
├── RAG Chat Interface
├── Document Ingestion UI
└── Search Interface

Backend (Express.js/Node.js)
├── API Routes (/api/*)
├── RAG Service (Python Bridge)
└── Database (PostgreSQL)

Python RAG Engine
├── Data Ingestion Pipeline
├── Vector Store (ChromaDB)
├── LLM Client (Groq)
└── RAG Engine
```

## 📁 File Structure

```
ai-verse/
├── client/src/
│   ├── components/features/
│   │   ├── RAGChat.tsx          # Chat interface
│   │   └── DocumentIngestion.tsx # Upload/scrape UI
│   └── pages/
│       └── RAGPage.tsx          # Main RAG page
├── server/
│   ├── rag-service.ts           # Python bridge service
│   └── routes.ts                # API endpoints
├── shared/
│   └── schema.ts                # Database schema
├── ai-verse/Data Ingestion/     # Your existing RAG model
│   ├── rag/                     # RAG engine
│   ├── ingestion/               # Data processing
│   ├── vector_store/            # Vector database
│   └── app.py                   # Original RAG app
└── setup-rag.py                # Setup script
```

## 🛠️ Setup Instructions

### 1. Run Setup Script
```bash
cd ai-verse
python setup-rag.py
```

### 2. Configure Environment
Edit `ai-verse/Data Ingestion/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from: https://console.groq.com/keys

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access RAG Interface
Visit: http://localhost:5000/rag

## 📊 Database Schema

The integration adds these tables:

- **documents**: Store uploaded PDFs and scraped websites
- **chat_sessions**: Manage chat conversations
- **chat_messages**: Store individual messages
- **ingestion_logs**: Track processing operations

## 🔌 API Endpoints

### Chat
- `POST /api/chat/ask` - Ask RAG questions
- `GET /api/chat/sessions` - Get chat sessions
- `GET /api/chat/sessions/:id/messages` - Get messages

### Documents
- `POST /api/documents/upload-pdf` - Upload PDF
- `POST /api/documents/ingest-website` - Scrape website
- `GET /api/documents` - List documents

### Vector Database
- `POST /api/vector-db/build` - Build vector database
- `POST /api/search` - Search documents

## 🎯 Usage Guide

### 1. Data Ingestion
1. Go to RAG page → Data Ingestion tab
2. Upload PDFs or enter website URLs
3. Wait for processing to complete
4. Build vector database

### 2. Chat with RAG
1. Go to RAG page → RAG Chat tab
2. Choose chat type (General or Funding)
3. Ask questions about your documents
4. View sources and references

### 3. Search Documents
1. Go to RAG page → Document Search tab
2. Enter search queries
3. Browse semantic search results

## 🔧 Configuration

### Python Dependencies
Your existing `requirements.txt` includes:
- chromadb
- langdetect
- requests
- numpy
- PyPDF2
- pytesseract
- Pillow
- pdf2image
- beautifulsoup4
- lxml

### Node.js Dependencies Added
- multer (file uploads)
- @types/multer
- react-dropzone

## 🚨 Troubleshooting

### Common Issues

1. **Python Import Errors**
   ```bash
   cd "ai-verse/Data Ingestion"
   pip install -r requirements.txt
   ```

2. **GROQ API Key Missing**
   - Set `GROQ_API_KEY` in `.env` file
   - Get key from https://console.groq.com/keys

3. **Vector Database Not Built**
   - Upload documents first
   - Click "Build Vector DB" button
   - Wait for completion

4. **File Upload Issues**
   - Check file size (50MB limit)
   - Ensure PDF format
   - Check server logs

### Debug Mode
Enable debug mode in RAG engine:
```python
result = engine.ask(question, debug=True)
```

## 🔄 Integration Points

### Frontend → Backend
- React components call Express.js API routes
- File uploads handled by multer middleware
- Real-time status updates via API polling

### Backend → Python
- Node.js spawns Python processes
- JSON communication between processes
- Error handling and timeout management

### Python → Vector DB
- ChromaDB for vector storage
- Automatic embedding generation
- Similarity search with metadata

## 🎨 Customization

### Adding New Document Types
1. Update file filter in `DocumentIngestion.tsx`
2. Add processing logic in Python pipeline
3. Update API routes for new types

### Custom Prompts
Modify prompts in:
- `ai-verse/Data Ingestion/rag/prompt_template.py`
- `ai-verse/Data Ingestion/funding_rag_engine.py`

### UI Themes
Customize appearance in:
- `client/src/components/features/RAGChat.tsx`
- `client/src/components/features/DocumentIngestion.tsx`

## 📈 Performance Tips

1. **Batch Processing**: Upload multiple documents before building vector DB
2. **Chunking Strategy**: Adjust chunk size in ingestion pipeline
3. **Vector Search**: Tune top_k parameter for search results
4. **Caching**: Implement Redis for frequent queries

## 🔐 Security Considerations

1. **File Validation**: Only allow trusted file types
2. **API Rate Limiting**: Implement rate limits for API calls
3. **Input Sanitization**: Validate all user inputs
4. **Environment Variables**: Keep API keys secure

## 📚 Next Steps

1. **Authentication**: Add user authentication system
2. **File Management**: Implement file deletion and updates
3. **Advanced Search**: Add filters and faceted search
4. **Analytics**: Track usage and performance metrics
5. **Deployment**: Configure for production environment

## 🤝 Support

For issues or questions:
1. Check troubleshooting section above
2. Review Python RAG model documentation
3. Check API endpoint responses
4. Enable debug mode for detailed logs

---

**Your RAG model is now fully integrated! 🎉**

Visit `/rag` to start using your intelligent document assistant.