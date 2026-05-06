# 🚀 DEPLOYMENT CHECKLIST

## ✅ RENDER BACKEND DEPLOYMENT

### Step 1: Prepare Repository
- [ ] Ensure all changes are pushed to GitHub
- [ ] Verify `.env` is in `.gitignore` (API key should NOT be in git)
- [ ] Confirm `startup-rag/backend/.python-version` contains `python-3.10.0`

### Step 2: Create Render Service
- [ ] Go to https://dashboard.render.com
- [ ] Click **"New +"** → **"Web Service"**
- [ ] Connect your GitHub account (if not connected)
- [ ] Select repository: **akhil151/ai-verse**
- [ ] Click **"Connect"**

### Step 3: Configure Service
- [ ] **Name:** `nivesh-ai-backend` (or your choice)
- [ ] **Region:** Choose closest to your users (e.g., Oregon, Singapore)
- [ ] **Branch:** `main`
- [ ] **Root Directory:** `startup-rag/backend`
- [ ] **Environment:** `Python 3`
- [ ] **Python Version:** `3.10.11`

### Step 4: Build Settings
- [ ] **Build Command:**
  ```bash
  pip install -r requirements.txt
  ```
  
- [ ] **Start Command:**
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

### Step 5: Environment Variables
- [ ] Click **"Advanced"** → **"Add Environment Variable"**
- [ ] Add:
  - **Key:** `GEMINI_API_KEY`
  - **Value:** `AIzaSyC86vhEqah1CjcpIE-9y4NZneQrCbFAuSE`
  
- [ ] Add:
  - **Key:** `ALLOWED_ORIGINS`
  - **Value:** `*` (update with Vercel URL after frontend deploy)

- [ ] Add:
  - **Key:** `PYTHON_VERSION`
  - **Value:** `3.10.11`

### Step 6: Deploy
- [ ] Click **"Create Web Service"**
- [ ] Wait for deployment (5-10 minutes first time)
- [ ] Check logs for any errors
- [ ] Copy your backend URL: `https://your-app.onrender.com`

### Step 7: Verify Backend
- [ ] Test health endpoint: `https://your-app.onrender.com/health`
- [ ] Should return: `{"status":"healthy","service":"Nivesh.ai Backend","gemini_ai":"configured"}`
- [ ] Test API docs: `https://your-app.onrender.com/docs`

---

## ✅ VERCEL FRONTEND DEPLOYMENT

### Step 1: Prepare for Vercel
- [ ] Ensure all frontend changes are pushed to GitHub
- [ ] Have your Render backend URL ready

### Step 2: Deploy to Vercel
- [ ] Go to https://vercel.com/dashboard
- [ ] Click **"Add New..."** → **"Project"**
- [ ] Import repository: **akhil151/ai-verse**
- [ ] Click **"Import"**

### Step 3: Configure Project
- [ ] **Framework Preset:** Vite
- [ ] **Root Directory:** `client` (click "Edit" to change)
- [ ] **Build Command:** `npm run build`
- [ ] **Output Directory:** `dist`

### Step 4: Environment Variables
- [ ] Click **"Environment Variables"**
- [ ] Add:
  - **Key:** `VITE_API_URL`
  - **Value:** `https://your-backend.onrender.com` (your Render URL)

### Step 5: Deploy
- [ ] Click **"Deploy"**
- [ ] Wait for deployment (2-3 minutes)
- [ ] Copy your frontend URL: `https://your-app.vercel.app`

### Step 6: Update Render CORS
- [ ] Go back to Render dashboard
- [ ] Open your backend service
- [ ] Update `ALLOWED_ORIGINS` environment variable:
  - **Value:** `https://your-app.vercel.app`
- [ ] Render will auto-redeploy with new settings

### Step 7: Final Verification
- [ ] Open your Vercel URL: `https://your-app.vercel.app`
- [ ] Test the application end-to-end
- [ ] Try asking a funding question
- [ ] Verify Gemini AI responses are working

---

## 🎯 POST-DEPLOYMENT

### Verify Everything Works
- [ ] Frontend loads correctly
- [ ] Backend health check passes
- [ ] API calls from frontend to backend work
- [ ] Gemini AI generates real responses
- [ ] No CORS errors in browser console

### Optional: Set Up Custom Domains
- [ ] Add custom domain in Vercel (if you have one)
- [ ] Add custom domain in Render (if you have one)
- [ ] Update `ALLOWED_ORIGINS` with custom domains

### Monitor & Maintain
- [ ] Check Render logs regularly
- [ ] Monitor Gemini API usage
- [ ] Set up error tracking (optional)
- [ ] Enable auto-deploy on push (enabled by default)

---

## 🚨 TROUBLESHOOTING

### Backend Issues
- **Build fails:** Check Python version is 3.10.11
- **API key error:** Verify `GEMINI_API_KEY` is set correctly
- **Port error:** Ensure start command uses `$PORT`

### Frontend Issues
- **Build fails:** Check Node version (18+)
- **API errors:** Verify `VITE_API_URL` matches your Render backend
- **CORS errors:** Update `ALLOWED_ORIGINS` in Render

### Performance Issues
- **Slow cold starts:** Normal for free tier (upgrade to paid plan)
- **Timeouts:** Check Gemini API rate limits

---

## 📊 DEPLOYMENT STATUS

**Backend (Render):**
- [ ] Deployed
- [ ] Health check passing
- [ ] API docs accessible
- URL: ___________________________

**Frontend (Vercel):**
- [ ] Deployed
- [ ] Application loading
- [ ] API calls working
- URL: ___________________________

---

## ✅ DEPLOYMENT COMPLETE!

Once all checkboxes are ticked, your Nivesh.ai is **LIVE**! 🎉

**Share your app:** `https://your-app.vercel.app`
