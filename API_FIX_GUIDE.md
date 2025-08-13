# 🔧 API Error Fix Guide

## 🚨 Current Issues

Your news discovery platform is experiencing several API errors:

1. **NewsAPI.org 401 Unauthorized** - Missing API key
2. **RSS2JSON 429 Too Many Requests** - Rate limiting
3. **RSS2JSON 422 Unprocessable Content** - Invalid RSS feeds

## ✅ Solutions Implemented

### 1. NewsAPI.org Fix
- ✅ Added API key support with environment variable
- ✅ Implemented fallback to mock data when API key is missing
- ✅ Better error handling and logging

### 2. RSS Rate Limiting Fix
- ✅ Implemented sequential processing with delays (1-2 seconds between requests)
- ✅ Added fallback RSS parsing using AllOrigins API
- ✅ Basic XML parsing as final fallback
- ✅ Reduced concurrent requests to prevent 429 errors

### 3. RSS Feed Validation
- ✅ Removed broken/invalid RSS feeds
- ✅ Kept only reliable, working RSS sources
- ✅ Added error handling for 422 responses

## 🛠️ Setup Instructions

### Step 1: Create Environment File

Create a `.env` file in your project root with the following content:

```env
# News API Configuration
VITE_NEWS_API_KEY=your-newsapi-org-key-here

# Other configurations...
DATABASE_URL=postgresql://username:password@localhost:5432/dscvr_news
SECRET_KEY=your-super-secret-key-change-this-in-production
```

### Step 2: Get NewsAPI.org API Key

1. Go to [https://newsapi.org/register](https://newsapi.org/register)
2. Sign up for a free account
3. Copy your API key
4. Replace `your-newsapi-org-key-here` in your `.env` file

### Step 3: Restart Your Application

```bash
# Stop your current development server
# Then restart it to load the new environment variables
npm run dev
# or
yarn dev
```

## 📊 Expected Results

After implementing these fixes:

- **NewsAPI.org**: Should work with valid API key, fallback to mock data without key
- **RSS Feeds**: Reduced 429 errors, better success rate
- **Overall**: More reliable news fetching with graceful fallbacks

## 🔍 Monitoring

Check your browser console for these improved messages:

```
✅ NewsAPI.org API key found. Fetching real news...
⚠️ NewsAPI.org API key not found. Using fallback data.
⚠️ Rate limited for RSS feed TechCrunch, trying fallback...
✅ Successfully fetched 5 articles from TechCrunch
```

## 🚀 Alternative News APIs

If NewsAPI.org doesn't work for you, consider these alternatives:

### GNews API
```env
GNEWS_API_KEY=your-gnews-api-key-here
```

### World News API
```env
WORLD_NEWS_API_KEY=your-world-news-api-key-here
```

## 📝 RSS Feed Sources

The updated RSS feed list includes only reliable sources:

- TechCrunch
- The Verge
- Wired
- MIT Technology Review
- Ars Technica
- Engadget
- Gizmodo
- ZDNet
- ExtremeTech
- TechSpot

## 🔧 Technical Details

### Rate Limiting Implementation
- Sequential processing instead of parallel
- 1-2 second delays between requests
- Exponential backoff for retries

### Fallback Chain
1. RSS2JSON API (primary)
2. AllOrigins API (fallback)
3. Basic XML parsing (final fallback)
4. Mock data (if all else fails)

### Error Handling
- Graceful degradation
- Detailed logging
- User-friendly fallbacks

## 🎯 Next Steps

1. **Get your NewsAPI.org API key**
2. **Create the `.env` file**
3. **Restart your application**
4. **Test the news fetching**
5. **Monitor console for improvements**

## 📞 Support

If you continue to experience issues:

1. Check that your `.env` file is in the project root
2. Verify your API key is correct
3. Ensure you've restarted the development server
4. Check the browser console for detailed error messages

## 🔄 Updates Made

### Files Modified:
- `src/services/newsService.ts` - Added API key support and rate limiting
- `src/services/curatedNewsService.ts` - Improved RSS handling
- `API_FIX_GUIDE.md` - This guide

### Key Changes:
- Environment variable support for API keys
- Sequential RSS processing with delays
- Multiple fallback mechanisms
- Better error handling and logging
- Reduced RSS feed list to reliable sources
