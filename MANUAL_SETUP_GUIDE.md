# 🚀 AI-Verse Manual Setup Guide

## ⚡ Quick Start (5 Minutes)

### Step 1: Open Terminal/Command Prompt
```bash
cd C:\SideQuest\ai-verse\ai-verse
```

### Step 2: Run Manual Setup
```bash
# Windows
manual-start.bat

# Or manually:
npm install
npm run dev
```

### Step 3: Access Application
- **Main App**: http://localhost:5000
- **RAG System**: http://localhost:5000/rag
- **Dashboard**: http://localhost:5000/dashboard

---

## 🔧 Manual Setup (If Automated Fails)

### Prerequisites Check
```bash
# Check Node.js (should be 18+)
node --version

# Check npm
npm --version

# Check Python (should be 3.8+)
python --version
```

### Step-by-Step Manual Setup

#### 1. Install Dependencies
```bash
cd C:\SideQuest\ai-verse\ai-verse
npm install
```

#### 2. Create Required Directories
```bash
mkdir "ai-verse\Data Ingestion\data\raw"
mkdir "ai-verse\Data Ingestion\data\processed"
mkdir "ai-verse\Data Ingestion\data\chunks"
mkdir "ai-verse\Data Ingestion\data\vector_db"
mkdir "uploads"
```

#### 3. Create Environment File
Create `ai-verse\Data Ingestion\.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

#### 4. Fix Package.json (If Needed)
If you get NODE_ENV errors, edit `package.json`:
```json
{
  "scripts": {
    "dev": "tsx server/index.ts",
    "dev:client": "vite dev --port 5000"
  }
}
```

#### 5. Start Development Server
```bash
npm run dev
```

---

## 🐛 Common Errors & Fixes

### Error: "NODE_ENV is not recognized"
**Fix**: Update package.json scripts:
```json
"dev": "tsx server/index.ts"
```

### Error: "Port 5000 in use"
**Fix**: Kill process or use different port:
```bash
# Kill process using port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F

# Or change port in server/index.ts
const port = parseInt(process.env.PORT || "5001", 10);
```

### Error: "Cannot find module"
**Fix**: Reinstall dependencies:
```bash
rm -rf node_modules
npm install
```

### Error: "Python modules not found"
**Fix**: Install Python dependencies:
```bash
cd "ai-verse\Data Ingestion"
pip install -r requirements.txt
```

---

## 🎯 Features Overview

### 1. **RAG System** (`/rag`)
- **Document Upload**: PDF processing and website scraping
- **Vector Database**: Semantic search through documents
- **AI Chat**: Ask questions about uploaded content
- **Current Data**: 2024-2025 market insights

### 2. **Dashboard** (`/dashboard`)
- **Funding Timeline**: Realistic 8-12 month timelines
- **Investor Matching**: Current active VCs and angels
- **Market Insights**: Sector-specific data
- **Action Plans**: Personalized 7-day tasks

### 3. **Enhanced Features**
- **Real Investors**: Sequoia, Accel, Matrix, Blume, etc.
- **Current Market Data**: $11.3B funding, 108 unicorns
- **Sector Analysis**: FinTech, SaaS, HealthTech, Consumer
- **Interactive Elements**: Clickable cards, tabs, buttons

---

## 🎨 Making Features More Interactive

### Current Interactive Elements:
1. **Tabbed Interface**: Overview, Chat, Upload, Insights
2. **Clickable Cards**: Investor profiles, sector data
3. **Interactive Chat**: Real-time AI responses
4. **Progress Tracking**: Visual progress bars
5. **Action Items**: Checkable task lists

### Enhanced Clickability:
- **Hover Effects**: Cards lift and highlight on hover
- **Click Feedback**: Visual feedback on button clicks
- **Smooth Transitions**: Animated state changes
- **Interactive Stats**: Clickable market data
- **Expandable Sections**: Collapsible content areas

---

## 📊 Current Market Data (2024-2025)

### Ecosystem Stats
- **Total Funding**: $11.3B (down from $25B peak)
- **New Unicorns**: 8 (vs 44 in 2021)
- **Average Timeline**: 8-12 months
- **Success Rate**: 15-25%

### Top Sectors
1. **FinTech**: $31B market, $2.8B funding
2. **SaaS**: $13.2B market, $1.9B funding
3. **Consumer**: $45B market, $3.2B funding
4. **HealthTech**: $9.8B market, $1.2B funding

### Active Investors
- **Sequoia Capital India**: ₹5-50 Cr tickets
- **Accel Partners**: ₹10-100 Cr tickets
- **Matrix Partners**: ₹5-75 Cr tickets
- **Blume Ventures**: ₹2-25 Cr tickets

---

## 🚀 Next Steps After Setup

### 1. Configure GROQ API
- Get API key from: https://console.groq.com/keys
- Add to `.env` file in Data Ingestion folder

### 2. Test RAG Features
- Upload a sample PDF document
- Try website scraping with a startup URL
- Build vector database
- Ask questions about uploaded content

### 3. Explore Dashboard
- Complete onboarding flow
- Check funding readiness score
- Review investor matches
- Follow 7-day action plan

### 4. Use Market Insights
- Explore sector-specific data
- Check current funding trends
- Review investor portfolios
- Analyze competition landscape

---

## 📞 Support & Troubleshooting

### If Server Won't Start:
1. Check if port 5000 is free
2. Verify Node.js and npm versions
3. Clear npm cache: `npm cache clean --force`
4. Reinstall dependencies: `rm -rf node_modules && npm install`

### If RAG Features Don't Work:
1. Ensure Python is installed
2. Install Python dependencies in Data Ingestion folder
3. Set GROQ_API_KEY in environment file
4. Check if directories were created properly

### If UI Looks Broken:
1. Hard refresh browser (Ctrl+F5)
2. Clear browser cache
3. Check browser console for errors
4. Ensure all CSS files are loading

---

**🎉 Your AI-Verse system should now be running with all enhanced features!**

Visit http://localhost:5000/rag to start using the RAG intelligence system.