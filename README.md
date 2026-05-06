# 🚀 Startup Assistant

> An enterprise-grade, AI-powered platform delivering intelligent funding advisory and advanced document intelligence (RAG) tailored for the modern startup ecosystem.

![Startup Assistant Banner](https://img.shields.io/badge/Status-Production%20Ready-success) ![License](https://img.shields.io/badge/License-MIT-blue) ![React](https://img.shields.io/badge/React-18-blue) ![FastAPI](https://img.shields.io/badge/FastAPI-Modern-green) ![Gemini](https://img.shields.io/badge/Google-Gemini%201.5-orange)

## 📖 Overview

**Startup Assistant** is a comprehensive, multi-modal application designed to bridge the gap between startup founders and funding success. By combining a rich, interactive web interface with powerful backend AI systems, it acts as a virtual co-founder. 

The platform leverages **Retrieval-Augmented Generation (RAG)**, large language models (Google Gemini), and a specialized document ingestion pipeline to offer highly contextual, data-driven advice on funding, pitch readiness, and market positioning. 

## ✨ Key Features & Industry Capabilities

### 1. 🧠 AI-Powered Funding Intelligence
- **Virtual Funding Co-Founder:** Leverages Google Gemini 1.5 Pro to provide tailored, context-aware funding advice.
- **Dynamic Readiness Scoring:** Calculates a deterministic 0-100 funding readiness score based on a multifaceted evaluation of the founder's profile, sector, stage, and goals.
- **Actionable Execution Checklists:** Generates phased, 5-step strategic roadmaps customized for the startup's specific funding journey.
- **Multilingual Support:** Localized intelligence focusing on the Indian startup ecosystem, capable of delivering insights in multiple preferred regional languages.

### 2. 📚 Advanced Document Intelligence System (RAG)
- **Automated Ingestion Pipeline:** Robust processing of unstructured data (PDFs, text) with built-in cleaning, chunking, and metadata extraction.
- **Vector Search Engine:** Integrated ChromaDB vector database for blazing-fast semantic search across vast corpuses of startup literature and documentation.
- **OCR Integration:** Capable of extracting actionable text from image-based PDFs and scanned documents.
- **Context-Aware Q&A:** Allows founders to seamlessly query ingested documents (e.g., term sheets, compliance laws, market research) and receive synthesized, referenced answers.

### 3. 📊 User Activity & Engagement Tracking
- **"My Activity" Dashboard:** A personalized hub tracking user interactions, saved profiles, and historical AI conversations.
- **Real-Time Animated Trends:** Dynamic "Mostly Viewed" and "Trending" sections displaying market insights using Framer Motion animations.
- **Interactive UI/UX Elements:** Micro-animations (heart/thumbs-up effects) and auditory feedback (sound effects on likes/comments) to significantly boost user retention and engagement.

### 4. 🏗️ Enterprise Web Architecture
- **Performant Frontend:** React 18 built with Vite, featuring Shadcn/ui and Radix UI primitives for a highly accessible, responsive design.
- **Asynchronous State Management:** TanStack React Query for efficient data fetching, caching, and synchronization.
- **Microservice-Oriented Backend:** Express.js (TypeScript) handles core application logic and session management, while a dedicated Python/FastAPI service handles heavy ML/RAG workloads.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui, Framer Motion, React Query |
| **Main Backend** | Node.js, Express.js, TypeScript, PostgreSQL (Drizzle ORM), express-session |
| **AI/ML Service** | Python 3.10+, FastAPI, Google Gemini API, GROQ API |
| **Data & Search** | ChromaDB (Vector Store), pg (PostgreSQL driver) |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend & AI Service) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Python** (v3.10 recommended for RAG compatibility)
- **PostgreSQL** (Local or cloud-hosted)
- **API Keys:** Google Gemini API Key (Required), GROQ API Key (Optional for specific data ingestion routes)

### 1. Clone & Core Setup

```bash
git clone https://github.com/Harish-0412/Startup-Assisstant.git
cd Startup-Assisstant

# Install Node dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env to include your DATABASE_URL and SESSION_SECRET

# Push Database Schema
npm run db:push
```

### 2. AI / RAG Backend Setup

```bash
cd startup-rag/backend

# Install Python dependencies
py -3.10 -m pip install -r requirements.txt
py -3.10 -m pip install sentence-transformers==2.2.2 "numpy<2.0" chromadb langdetect python-multipart

# Setup environment variables
# Create .env file and add: GEMINI_API_KEY=your_api_key_here
```

### 3. Running the Application

To run the full stack locally across separate terminals:

**Terminal 1 (Main Web Server & Client):**
```bash
npm run dev
```

**Terminal 2 (AI/RAG FastAPI Service):**
```bash
cd startup-rag/backend
py -3.10 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- **Frontend App:** `http://localhost:5000`
- **AI Backend API:** `http://localhost:8000`

---

## 📁 System Architecture

```text
Startup-Assisstant/
├── client/                 # React frontend (Vite, Tailwind, Shadcn)
├── server/                 # Express.js core API (TypeScript, Drizzle)
├── startup-rag/            # Python AI microservice (FastAPI, Gemini)
│   └── backend/            # RAG implementation and LLM prompt engineering
├── Data Ingestion/         # Python scripts for PDF processing & ChromaDB population
└── shared/                 # Zod schemas shared between client and Node backend
```

## 🔐 Security & Compliance
- **Authentication:** Secure session management using `connect-pg-simple`.
- **Validation:** Strict runtime type checking and request validation utilizing Zod.
- **Environment:** Secrets managed securely via `.env` patterns, never committed to source.

## 🤝 Contributing
We welcome contributions from the community! Please follow the standard fork-and-pull request workflow. Ensure all tests pass and your code conforms to the existing style guidelines.

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built to empower the next generation of founders.*
