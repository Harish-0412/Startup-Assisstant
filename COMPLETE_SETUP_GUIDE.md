# 🚀 AI-Verse Complete Setup & Run Guide

## ✅ **STEP-BY-STEP MANUAL SETUP**

### **Step 1: Prerequisites Check**
```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Check Python version (should be 3.8+)
python --version
```

### **Step 2: Navigate to Project Directory**
```bash
cd C:\SideQuest\ai-verse\ai-verse
```

### **Step 3: Install Dependencies**
```bash
# Install Node.js dependencies
npm install

# If you get errors, try:
npm cache clean --force
npm install
```

### **Step 4: Create Required Directories**
```bash
# Create RAG directories
mkdir "ai-verse\Data Ingestion\data\raw"
mkdir "ai-verse\Data Ingestion\data\processed"
mkdir "ai-verse\Data Ingestion\data\chunks"
mkdir "ai-verse\Data Ingestion\data\vector_db"
mkdir "uploads"
```

### **Step 5: Setup Environment File**
Create `ai-verse\Data Ingestion\.env` with:
```env
GROQ_API_KEY=your_groq_api_key_here
```
Get your API key from: https://console.groq.com/keys

### **Step 6: Start the Application**
```bash
npm run dev
```

### **Step 7: Access the Application**
- **Main App**: http://localhost:5000
- **RAG System**: http://localhost:5000/rag
- **Local Investors**: http://localhost:5000/local-investors
- **Funding Policies**: http://localhost:5000/funding-policies
- **Dashboard**: http://localhost:5000/dashboard

---

## 🎯 **NEW FEATURES ADDED**

### **1. Fixed Overview Alignment**
- ✅ Responsive grid layout (3 columns on desktop, 1 on mobile)
- ✅ Proper spacing and visual hierarchy
- ✅ Interactive cards with hover effects
- ✅ Clickable navigation to dedicated pages

### **2. Local Investors Database** (`/local-investors`)
- ✅ **State-wise Investor Data**: Karnataka, Maharashtra, Delhi, Tamil Nadu, Telangana
- ✅ **City-wise Filtering**: Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Pune
- ✅ **Real Investor Information**:
  - Sequoia Capital India (Bangalore) - ₹5-50 Cr
  - Accel Partners (Bangalore) - ₹10-100 Cr
  - Lightspeed VP (Mumbai) - ₹20-150 Cr
  - Matrix Partners (Delhi) - ₹5-75 Cr
- ✅ **Contact Details**: Email, phone, website, address
- ✅ **Portfolio Information**: Recent investments, AUM, founding year
- ✅ **Angel Investors**: Kunal Shah, Binny Bansal, Anupam Mittal
- ✅ **Search & Filter**: By name, sector, location
- ✅ **Interactive Cards**: Hover effects, clickable contact buttons

### **3. Funding Policies & Government Schemes** (`/funding-policies`)
- ✅ **Central Government Schemes**:
  - Startup India Seed Fund Scheme (₹20L - ₹5Cr)
  - Pradhan Mantri Mudra Yojana (₹10L)
  - CGTMSE (₹10L - ₹5Cr)
- ✅ **State Government Schemes**:
  - Karnataka Startup Policy 2022-2027
  - Maharashtra Innovation Society
- ✅ **Sector-Specific Schemes**:
  - Technology Development Fund
  - RKVY for AgriTech
- ✅ **Tax Benefits**:
  - Section 80-IAC (100% tax exemption)
  - Angel Tax exemption
  - Capital gains exemption
- ✅ **Detailed Information**:
  - Eligibility criteria
  - Application process
  - Timeline and contact details
  - Benefits and funding amounts

### **4. Enhanced Interactive Features**
- ✅ **Clickable Navigation**: Cards navigate to dedicated pages
- ✅ **Responsive Design**: Works on all screen sizes
- ✅ **Hover Effects**: Visual feedback on interactions
- ✅ **Search Functionality**: Find investors and schemes quickly
- ✅ **Filter Options**: By location, sector, funding amount
- ✅ **Contact Integration**: Direct email and website links

---

## 📊 **CURRENT DATA (2024-2025)**

### **Active Investors by Location**
- **Bangalore**: 4 major VCs (Sequoia, Accel, Blume, 3one4)
- **Mumbai**: 3 major VCs (Lightspeed, Kalaari, Elevation)
- **Delhi**: 2 major VCs (Matrix, Chiratae)
- **Pune**: 1 major VC (Nexus)
- **Chennai**: 1 growth capital (Fundamentum)
- **Hyderabad**: 1 incubator (T-Hub)

### **Government Schemes Coverage**
- **Central Schemes**: 3 major schemes
- **State Schemes**: 2 states covered (Karnataka, Maharashtra)
- **Sector Schemes**: Technology, Agriculture
- **Tax Benefits**: 3 major exemptions

### **Market Statistics**
- **Total Funding**: $11.3B (2024)
- **Active VCs**: 25+ firms
- **Government Allocation**: ₹50K Cr
- **Tax Exemption**: Up to 100%

---

## 🔧 **TROUBLESHOOTING**

### **If Server Won't Start**
1. Check port 5000 availability:
   ```bash
   netstat -ano | findstr :5000
   ```
2. Kill any process using port 5000:
   ```bash
   taskkill /PID <process_id> /F
   ```
3. Try different port in `server/index.ts`:
   ```typescript
   const port = parseInt(process.env.PORT || "5001", 10);
   ```

### **If Dependencies Fail**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete node_modules and reinstall:
   ```bash
   rmdir /s node_modules
   npm install
   ```

### **If Pages Don't Load**
1. Check browser console for errors
2. Ensure all routes are added in App.tsx
3. Verify component imports are correct

### **If RAG Features Don't Work**
1. Set GROQ_API_KEY in environment file
2. Create required directories
3. Check Python dependencies in Data Ingestion folder

---

## 🎨 **VISUAL IMPROVEMENTS**

### **Alignment Fixes**
- ✅ Proper responsive grid (lg:col-span-2, lg:col-span-1)
- ✅ Consistent spacing and padding
- ✅ Visual hierarchy with proper typography
- ✅ Color-coded sections for better organization

### **Interactive Elements**
- ✅ Hover effects on all cards
- ✅ Smooth transitions and animations
- ✅ Click feedback with scale transforms
- ✅ Loading states and progress indicators

### **Navigation**
- ✅ Breadcrumb navigation
- ✅ Back buttons on dedicated pages
- ✅ Clear call-to-action buttons
- ✅ Consistent routing structure

---

## 🚀 **NEXT STEPS**

### **After Setup**
1. **Configure GROQ API**: Set your API key for RAG features
2. **Explore Local Investors**: Find investors in your city/state
3. **Check Funding Policies**: Review applicable government schemes
4. **Upload Documents**: Test RAG functionality with your files
5. **Complete Onboarding**: Get personalized recommendations

### **Advanced Features**
1. **Market Analysis Page**: Detailed sector insights
2. **Action Plans Page**: Personalized roadmaps
3. **Document Analysis**: Enhanced RAG capabilities
4. **Investor Matching**: AI-powered recommendations

---

**🎉 Your AI-Verse system is now ready with enhanced features and proper alignment!**

Visit http://localhost:5000/rag to start exploring the new dedicated pages and improved functionality.