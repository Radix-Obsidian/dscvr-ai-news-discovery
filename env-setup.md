# 🔧 Environment Setup with API Key

## ✅ API Key Configured

Your NewsAPI.org API key has been received: `c293342f2e5244c8b5a713c43c105ee0`

## 📝 Create Your .env File

Create a `.env` file in your project root directory with the following content:

```env
# Dscvr AI News Discovery Platform - Environment Configuration

# =============================================================================
# NEWS API CONFIGURATION
# =============================================================================
VITE_NEWS_API_KEY=c293342f2e5244c8b5a713c43c105ee0
NEWS_API_URL=https://newsapi.org/v2/everything
NEWS_CACHE_DURATION=300
NEWS_UPDATE_INTERVAL=600

# =============================================================================
# DATABASE CONFIGURATION
# =============================================================================
DATABASE_URL=sqlite:///backend/database/dscvr_ai.db
DATABASE_ECHO=false

# =============================================================================
# OLLAMA AI MODELS CONFIGURATION
# =============================================================================
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=gpt-oss:20b
OLLAMA_TIMEOUT=300
OLLAMA_MAX_TOKENS=128000

# Available Ollama Models (comma-separated)
OLLAMA_AVAILABLE_MODELS=gpt-oss:20b,gpt-oss:120b,deepseek-r1:8b

# Model-specific configurations
OLLAMA_GPT_OSS_20B_CONFIG={"reasoning_effort": "medium", "tools_enabled": true, "temperature": 0.7}
OLLAMA_GPT_OSS_120B_CONFIG={"reasoning_effort": "high", "tools_enabled": true, "temperature": 0.7}
OLLAMA_DEEPSEEK_R1_8B_CONFIG={"reasoning_enabled": true, "tools_enabled": true, "temperature": 0.7}

# =============================================================================
# AI FEATURES CONFIGURATION
# =============================================================================
AI_DEEP_DIVE_ENABLED=true
AI_PERSONALIZATION_ENABLED=true
AI_CURATOR_SYSTEM_ENABLED=true
AI_VIDEO_RECOMMENDATIONS_ENABLED=true

# AI Content Generation Settings
AI_MAX_CONTENT_LENGTH=5000
AI_CONTENT_CACHE_DURATION=3600
AI_SENTIMENT_ANALYSIS_ENABLED=true
AI_TREND_ANALYSIS_ENABLED=true

# =============================================================================
# RSS FEED CONFIGURATION
# =============================================================================
RSS_CACHE_DURATION=900
RSS_MAX_FEEDS=40
RSS_UPDATE_INTERVAL=300

# RSS Proxy Services
RSS_PROXY_URL=https://api.rss2json.com/v1/api.json
RSS_FALLBACK_PROXY=https://api.allorigins.win/get

# =============================================================================
# WEATHER API CONFIGURATION
# =============================================================================
WEATHER_API_URL=https://api.open-meteo.com/v1/forecast
WEATHER_CACHE_DURATION=900
WEATHER_UPDATE_INTERVAL=900

# Default location (Atlanta, GA)
DEFAULT_LATITUDE=33.7490
DEFAULT_LONGITUDE=-84.3880
DEFAULT_CITY=Atlanta, GA

# =============================================================================
# STOCK API CONFIGURATION
# =============================================================================
ALPHA_VANTAGE_API_KEY=6GAE8P9QW3X1X43R
ALPHA_VANTAGE_BASE_URL=https://www.alphavantage.co/query
STOCK_CACHE_DURATION=60
STOCK_UPDATE_INTERVAL=30

# Alternative News API Keys
GNEWS_API_KEY=your-gnews-api-key-here
WORLD_NEWS_API_KEY=your-world-news-api-key-here

# =============================================================================
# SERVER CONFIGURATION
# =============================================================================
HOST=0.0.0.0
PORT=8000
DEBUG=true
ENVIRONMENT=development

# CORS Settings
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
CORS_ALLOW_CREDENTIALS=true

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================
SECRET_KEY=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24
PASSWORD_MIN_LENGTH=8

# =============================================================================
# LOGGING CONFIGURATION
# =============================================================================
LOG_LEVEL=INFO
LOG_FILE=logs/dscvr.log
LOG_MAX_SIZE=10MB
LOG_BACKUP_COUNT=5

# =============================================================================
# CACHE CONFIGURATION
# =============================================================================
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
CACHE_MAX_SIZE=1000

# =============================================================================
# FEATURE FLAGS
# =============================================================================
ENABLE_AI_CHAT=true
ENABLE_READING_PROGRESS=true
ENABLE_USER_ANALYTICS=true
ENABLE_CONTENT_RECOMMENDATIONS=true
ENABLE_TRENDING_TOPICS=true

# =============================================================================
# PERFORMANCE CONFIGURATION
# =============================================================================
MAX_CONCURRENT_REQUESTS=10
REQUEST_TIMEOUT=30
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600

# =============================================================================
# DEVELOPMENT SETTINGS
# =============================================================================
# Set to false in production
ENABLE_DEBUG_ENDPOINTS=true
ENABLE_MOCK_DATA=true
ENABLE_TEST_MODE=false
```

## 🚀 Quick Setup Commands

### For macOS/Linux:
```bash
# Create .env file
cp env.example .env

# Edit the .env file and add your API key
echo "VITE_NEWS_API_KEY=c293342f2e5244c8b5a713c43c105ee0" >> .env
```

### For Windows:
```cmd
# Create .env file
copy env.example .env

# Edit the .env file manually and add:
# VITE_NEWS_API_KEY=c293342f2e5244c8b5a713c43c105ee0
```

## 🔄 Restart Your Application

After creating the `.env` file, restart your development server:

```bash
# Stop your current server (Ctrl+C)
# Then restart:
npm run dev
# or
yarn dev
```

## ✅ Verification

Once you've set up the `.env` file and restarted your application:

1. **Open your browser console** - You should see:
   ```
   ✅ NewsAPI.org API key found. Fetching real news...
   ```

2. **Test the API** - Open `test_api_fixes.html` in your browser to verify everything is working

3. **Check for errors** - The 401 Unauthorized errors should be gone

## 🎯 Expected Results

- ✅ **NewsAPI.org 401 errors**: Fixed
- ✅ **Real news articles**: Now loading from NewsAPI.org
- ✅ **RSS rate limiting**: Improved with sequential processing
- ✅ **Fallback mechanisms**: Working for failed requests

## 🔍 Troubleshooting

If you still see errors:

1. **Verify .env file location**: Must be in the project root (same level as `package.json`)
2. **Check API key**: Ensure it's exactly `c293342f2e5244c8b5a713c43c105ee0`
3. **Restart server**: Environment variables only load on startup
4. **Check console**: Look for the success message about API key found

## 📞 Support

If you continue to have issues:
- Check that the `.env` file is not in `.gitignore`
- Verify the API key is valid at [NewsAPI.org](https://newsapi.org/account)
- Ensure you've restarted the development server
