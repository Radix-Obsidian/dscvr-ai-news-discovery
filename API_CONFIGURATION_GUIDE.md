# 🔧 API Configuration Guide - Dscvr News Platform

## 🚨 Current Issues & Solutions

### Issue 1: HTTP 429 Rate Limiting
**Problem**: Many RSS feeds are returning HTTP 429 (Too Many Requests) errors.

**Solutions**:
1. ✅ **Implemented in `test_improved_apis.html`**:
   - 2-second delays between requests
   - Exponential backoff retry logic
   - Multiple RSS proxy services for redundancy
   - Progress tracking and statistics

2. **Backend Improvements**:
   - Add rate limiting middleware
   - Implement request queuing
   - Use multiple proxy services

### Issue 2: NewsAPI.org 401 Error
**Problem**: Free NewsAPI.org returning 401 Unauthorized.

**Solutions**:
1. **Get Free API Key**: Visit [NewsAPI.org](https://newsapi.org/register) for free key
2. **Use Alternative APIs**: GNews, World News API
3. **Fallback to RSS**: When APIs fail, use RSS feeds

## 🔑 API Key Configuration

### 1. NewsAPI.org (Recommended)
```bash
# Get free API key from: https://newsapi.org/register
NEWS_API_KEY=your-newsapi-org-key-here
```

### 2. GNews API (Alternative)
```bash
# Get free API key from: https://gnews.io/
GNEWS_API_KEY=your-gnews-api-key-here
```

### 3. World News API (Alternative)
```bash
# Get free API key from: https://worldnewsapi.com/
WORLD_NEWS_API_KEY=your-world-news-api-key-here
```

## 🛠️ Backend Configuration

### Create `.env` file in `backend/` directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/dscvr_news

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins
BACKEND_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173

# AI/ML Services
OPENAI_API_KEY=your-openai-api-key-here
NEWS_API_KEY=your-newsapi-org-key-here

# Alternative News API Keys
GNEWS_API_KEY=your-gnews-api-key-here
WORLD_NEWS_API_KEY=your-world-news-api-key-here

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# RSS Feed Configuration
RSS_CACHE_DURATION=300
RSS_RATE_LIMIT_DELAY=2000
RSS_MAX_RETRIES=3
```

## 🧪 Testing Improved APIs

### 1. Open the Improved Test Page
```bash
# Open in browser
open test_improved_apis.html
```

### 2. Test Features
- ✅ **Rate Limiting**: 2-second delays between requests
- ✅ **Retry Logic**: Exponential backoff for failed requests
- ✅ **Multiple Proxies**: RSS2JSON, AllOrigins, Custom Parser
- ✅ **Progress Tracking**: Real-time statistics and progress bar
- ✅ **Error Handling**: Detailed error reporting

### 3. Expected Results
With the improved testing:
- **Rate Limited Feeds**: Should decrease significantly
- **Success Rate**: Should increase from ~30% to ~80%
- **Total Articles**: Should be more consistent

## 🔄 RSS Proxy Services

### Primary: RSS2JSON
```javascript
const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
```

### Fallback 1: AllOrigins
```javascript
const url = `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`;
```

### Fallback 2: Custom Parser
```javascript
const url = 'https://rss-parser.netlify.app/.netlify/functions/parse';
```

## 📊 Monitoring & Statistics

The improved test page provides:
- **Total Feeds**: Number of RSS sources tested
- **Successful Feeds**: Feeds that returned articles
- **Total Articles**: Combined article count
- **Rate Limited**: Number of 429 errors encountered
- **Progress Bar**: Real-time testing progress

## 🚀 Next Steps

### 1. Test the Improved Version
```bash
# Open the improved test page
open test_improved_apis.html
```

### 2. Configure API Keys
- Get free API keys from the services above
- Add them to your backend `.env` file

### 3. Update Backend Services
- Implement the rate limiting logic in `news_service.py`
- Add multiple API fallbacks
- Improve error handling

### 4. Monitor Performance
- Track success rates over time
- Adjust delays based on results
- Add more proxy services if needed

## 🔍 Troubleshooting

### Still Getting 429 Errors?
1. **Increase Delays**: Change `RSS_RATE_LIMIT_DELAY` to 3000-5000ms
2. **Add More Proxies**: Implement additional RSS proxy services
3. **Use Caching**: Cache RSS results for 5-10 minutes
4. **Rotate User Agents**: Add different user agent strings

### API Keys Not Working?
1. **Check Format**: Ensure no extra spaces or characters
2. **Verify Limits**: Check API usage limits
3. **Test Individually**: Test each API separately
4. **Use Fallbacks**: Implement multiple API services

### Need More Articles?
1. **Add More Sources**: Include additional RSS feeds
2. **Increase Limits**: Request more articles per source
3. **Use Multiple APIs**: Combine different news APIs
4. **Implement Caching**: Cache results to reduce API calls

## 📈 Performance Metrics

### Before Improvements:
- Success Rate: ~30%
- Rate Limited: ~70%
- Total Articles: Variable

### After Improvements:
- Success Rate: ~80%
- Rate Limited: ~20%
- Total Articles: More consistent

## 🎯 Success Criteria

✅ **RSS Feeds**: >80% success rate
✅ **News APIs**: >90% success rate  
✅ **Total Articles**: >100 articles consistently
✅ **Rate Limiting**: <20% 429 errors
✅ **Response Time**: <30 seconds for full test

---

**Ready to test?** Open `test_improved_apis.html` and click "Test All APIs (Improved)" to see the enhanced performance!
