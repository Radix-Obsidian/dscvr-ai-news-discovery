# 🔧 Environment Variables Setup Guide
## Complete Manual for Production-Ready MVP

This guide will fix all environment variable issues preventing your MVP from running properly.

## 🚨 Critical Issues Found

1. **Missing Backend API Endpoints** - Frontend expects 15+ endpoints that don't exist
2. **Inconsistent Database URLs** - Different configs point to different DB files
3. **Missing VITE_API_URL** - Frontend can't connect to backend
4. **Demo API Keys** - Using placeholder keys that don't work in production
5. **Security Issues** - Hardcoded secrets and exposed keys

---

## 📋 Step-by-Step Fix Instructions

### **STEP 1: Fix Root .env File**

Replace your root `.env` file with these corrected values:

```bash
# =============================================================================
# CRITICAL FRONTEND VARIABLES (MISSING!)
# =============================================================================
VITE_API_URL=http://localhost:8000
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama2

# =============================================================================
# DATABASE CONFIGURATION (STANDARDIZED)
# =============================================================================
DATABASE_URL=postgresql://username:password@localhost:5432/dscvr_news
DATABASE_ECHO=false

# =============================================================================
# SECURITY CONFIGURATION (UPDATED)
# =============================================================================
SECRET_KEY=dscvr-ai-super-secret-key-$(openssl rand -base64 32)
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# =============================================================================
# API KEYS (REPLACE WITH REAL KEYS)
# =============================================================================
# Get real key from: https://newsapi.org/
NEWS_API_KEY=REPLACE_WITH_REAL_NEWSAPI_KEY
VITE_NEWS_API_KEY=REPLACE_WITH_REAL_NEWSAPI_KEY

# Get real key from: https://www.alphavantage.co/
ALPHA_VANTAGE_API_KEY=REPLACE_WITH_REAL_ALPHAVANTAGE_KEY

# Optional: Get from https://openai.com/
OPENAI_API_KEY=

# =============================================================================
# OLLAMA CONFIGURATION (SYNCHRONIZED)
# =============================================================================
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_HOST=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama2
OLLAMA_MODEL=llama2
OLLAMA_TIMEOUT=300

# =============================================================================
# SERVER CONFIGURATION
# =============================================================================
HOST=0.0.0.0
PORT=8000
DEBUG=true
ENVIRONMENT=development

# =============================================================================
# CORS SETTINGS (MATCH FRONTEND)
# =============================================================================
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000","http://localhost:5173","http://127.0.0.1:5173"]
CORS_ALLOW_CREDENTIALS=true

# =============================================================================
# CACHE CONFIGURATION
# =============================================================================
CACHE_TTL=3600
RSS_CACHE_DURATION=900
NEWS_CACHE_DURATION=300

# =============================================================================
# FEATURE FLAGS
# =============================================================================
ENABLE_AI_CHAT=true
ENABLE_READING_PROGRESS=true
ENABLE_MOCK_DATA=false
```

### **STEP 2: Update Backend .env File**

Replace `backend/.env` with:

```bash
# Database Configuration (SYNCHRONIZED)
DATABASE_URL=postgresql://username:password@localhost:5432/dscvr_news

# Application Configuration
SECRET_KEY=dscvr-ai-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# CORS Configuration (MATCH ROOT CONFIG)
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000","http://localhost:5173","http://127.0.0.1:5173"]

# API Keys (MATCH ROOT CONFIG)
NEWS_API_KEY=REPLACE_WITH_REAL_NEWSAPI_KEY
OPENAI_API_KEY=

# Ollama Configuration (SYNCHRONIZED)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2

# Cache configuration
CACHE_TTL=3600
```

### **STEP 3: Create Missing Environment Files**

Create `frontend/.env.local`:

```bash
VITE_API_URL=http://localhost:8000
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama2
VITE_NEWS_API_KEY=REPLACE_WITH_REAL_NEWSAPI_KEY
```

---

## 🔑 Get Real API Keys

### **NewsAPI.org (CRITICAL - Required for news data)**

1. Go to [https://newsapi.org/](https://newsapi.org/)
2. Click "Get API Key"
3. Sign up for free account
4. Copy your API key
5. Replace `REPLACE_WITH_REAL_NEWSAPI_KEY` in both .env files

**Current demo key `c293342f2e5244c8b5a713c43c105ee0` is rate-limited and may not work.**

### **Alpha Vantage (For stock data)**

1. Go to [https://www.alphavantage.co/](https://www.alphavantage.co/)
2. Click "Get Free API Key"
3. Sign up for free account
4. Replace `REPLACE_WITH_REAL_ALPHAVANTAGE_KEY`

### **OpenAI (Optional - for enhanced AI features)**

1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Create account and add billing
3. Generate API key
4. Add to `OPENAI_API_KEY`

---

## 🛠️ Fix Database Configuration

### **STEP 4: Standardize Database Location**

```bash
# From project root:
cd backend

# Set up PostgreSQL database connection
export DATABASE_URL="postgresql://username:password@localhost:5432/dscvr_news"
```

### **STEP 5: Verify Database Setup**

```bash
cd backend
export DATABASE_URL="postgresql://username:password@localhost:5432/dscvr_news"
python -c "from app.core.database import engine; engine.connect(); print('✅ Database connection successful!')"
```

---

## 🚀 Critical Backend Fixes Needed

### **STEP 6: Missing API Endpoints**

Your frontend expects these endpoints that **DON'T EXIST** in the backend:

**Missing Article Endpoints:**
- `GET /api/v1/articles` - List articles
- `GET /api/v1/articles/{id}` - Get specific article  
- `GET /api/v1/articles/recommended` - Get recommendations
- `POST /api/v1/articles` - Create article
- `PUT /api/v1/articles/{id}` - Update article
- `DELETE /api/v1/articles/{id}` - Delete article

**Missing News Endpoints:**
- `POST /api/v1/news/fetch` - Fetch news
- `GET /api/v1/news/categories` - Get categories
- `GET /api/v1/news/trending` - Get trending
- `POST /api/v1/news/{articleId}/read` - Mark as read

**Current backend only has:** `/auth`, `/users`, `/rss`, and `/ai` endpoints.

### **STEP 7: Add Missing Backend Endpoints**

You need to create these files:

1. `backend/app/api/v1/endpoints/articles.py`
2. `backend/app/api/v1/endpoints/news.py`
3. Update `backend/app/api/v1/api.py` to include these routes

---

## 🔒 Security Fixes

### **STEP 8: Generate Secure Secret Key**

```bash
# Generate secure secret key
python -c "import secrets; print('SECRET_KEY=' + secrets.token_urlsafe(50))"

# Update both .env files with the generated key
```

### **STEP 9: Remove Hardcoded Secrets**

1. Replace all `your-super-secret-key-change-this-in-production` instances
2. Remove hardcoded API keys from documentation
3. Use environment variables for all secrets

---

## ✅ Verification Checklist

After completing all steps:

### **Frontend Connection Test:**
```bash
# Start backend
cd backend
uvicorn main:app --reload --port 8000

# In another terminal, test frontend connection
curl http://localhost:8000/api/v1/users/me
```

### **Environment Variables Test:**
```bash
# Check if all variables are loaded
cd backend
python -c "
import os
from app.core.config import settings
print('DATABASE_URL:', settings.DATABASE_URL)
print('NEWS_API_KEY:', settings.NEWS_API_KEY[:10] + '...' if settings.NEWS_API_KEY else 'MISSING')
print('SECRET_KEY:', settings.SECRET_KEY[:10] + '...' if settings.SECRET_KEY else 'MISSING')
print('OLLAMA_HOST:', settings.OLLAMA_HOST)
"
```

### **Database Test:**
```bash
cd backend
export DATABASE_URL="postgresql://username:password@localhost:5432/dscvr_news"
python -c "
from app.core.database import SessionLocal
from app.models.article import Article
from app.models.rss_feed import RSSFeed
db = SessionLocal()
print(f'✅ Articles: {db.query(Article).count()}')
print(f'✅ RSS Feeds: {db.query(RSSFeed).count()}')
db.close()
"
```

---

## 🎯 Priority Order

**IMMEDIATE (Blocks MVP):**
1. ✅ Add `VITE_API_URL=http://localhost:8000` to root .env
2. ✅ Standardize `DATABASE_URL` across all configs  
3. ✅ Get real NewsAPI.org API key
4. ⚠️ Create missing backend endpoints (articles, news)

**HIGH PRIORITY:**
5. ✅ Generate secure SECRET_KEY
6. ✅ Fix CORS configuration
7. ✅ Synchronize Ollama settings

**MEDIUM PRIORITY:**
8. Get Alpha Vantage API key
9. Add OpenAI API key (optional)
10. Set up Redis cache (optional)

---

## 🆘 Quick MVP Fix

**Minimum changes to get MVP running:**

1. **Add to root .env:**
   ```bash
   VITE_API_URL=http://localhost:8000
   ```

2. **Get NewsAPI key and update both .env files**

3. **Fix database path in backend/.env:**
   ```bash
   DATABASE_URL=postgresql://username:password@localhost:5432/dscvr_news
   ```

4. **Create missing backend article endpoints** (critical!)

Without these fixes, your frontend will fail to connect to the backend and display no data.