# Real Datasets Guide for Dscvr AI News Discovery Platform

This guide provides comprehensive recommendations for real datasets to replace sample/mock data in your news discovery platform.

## 🎯 **Dataset Categories**

### 1. **Live News APIs** (Recommended for Real-time Data)

#### **NewsAPI.org**
- **URL**: https://newsapi.org/
- **Content**: 80,000+ news sources, real-time articles
- **Categories**: Technology, Business, Science, Health, Sports, Politics
- **Format**: JSON API
- **Cost**: Free tier (1,000 requests/day), Paid plans available
- **Perfect for**: Your `Article` model with real-time content
- **Setup**: Add `NEWS_API_KEY` to your environment variables

#### **GNews API**
- **URL**: https://gnews.io/
- **Content**: Global news from 7,500+ sources
- **Categories**: Technology, Business, Science, Health, Sports
- **Format**: JSON API
- **Cost**: Free tier (100 requests/day), Paid plans available
- **Perfect for**: International news coverage

#### **The Guardian API**
- **URL**: https://open-platform.theguardian.com/
- **Content**: High-quality journalism from The Guardian
- **Categories**: Technology, Science, Business, Politics
- **Format**: JSON API
- **Cost**: Free (with attribution)
- **Perfect for**: Premium content with detailed articles

### 2. **RSS Feed Collections** (Recommended for Structured Data)

#### **Real RSS Feeds for Technology**
```json
[
  {
    "name": "TechCrunch",
    "url": "https://techcrunch.com/feed/",
    "category": "Technology",
    "website_url": "https://techcrunch.com"
  },
  {
    "name": "BBC Technology",
    "url": "https://feeds.bbci.co.uk/news/technology/rss.xml",
    "category": "Technology",
    "website_url": "https://www.bbc.com/news/technology"
  },
  {
    "name": "Reuters Technology",
    "url": "https://feeds.reuters.com/reuters/technologyNews",
    "category": "Technology",
    "website_url": "https://www.reuters.com/technology"
  },
  {
    "name": "MIT Technology Review",
    "url": "https://www.technologyreview.com/feed/",
    "category": "Technology",
    "website_url": "https://www.technologyreview.com"
  },
  {
    "name": "Wired",
    "url": "https://www.wired.com/feed/rss",
    "category": "Technology",
    "website_url": "https://www.wired.com"
  },
  {
    "name": "The Verge",
    "url": "https://www.theverge.com/rss/index.xml",
    "category": "Technology",
    "website_url": "https://www.theverge.com"
  },
  {
    "name": "Ars Technica",
    "url": "https://feeds.arstechnica.com/arstechnica/index",
    "category": "Technology",
    "website_url": "https://arstechnica.com"
  }
]
```

#### **Science RSS Feeds**
```json
[
  {
    "name": "Scientific American",
    "url": "https://rss.sciam.com/ScientificAmerican-Global",
    "category": "Science",
    "website_url": "https://www.scientificamerican.com"
  },
  {
    "name": "Nature",
    "url": "https://www.nature.com/nature.rss",
    "category": "Science",
    "website_url": "https://www.nature.com"
  },
  {
    "name": "Science Magazine",
    "url": "https://www.science.org/rss/news_current.xml",
    "category": "Science",
    "website_url": "https://www.science.org"
  },
  {
    "name": "New Scientist",
    "url": "https://www.newscientist.com/feed/",
    "category": "Science",
    "website_url": "https://www.newscientist.com"
  }
]
```

#### **Business RSS Feeds**
```json
[
  {
    "name": "Reuters Business",
    "url": "https://feeds.reuters.com/reuters/businessNews",
    "category": "Business",
    "website_url": "https://www.reuters.com/business"
  },
  {
    "name": "Bloomberg",
    "url": "https://feeds.bloomberg.com/markets/news.rss",
    "category": "Business",
    "website_url": "https://www.bloomberg.com"
  },
  {
    "name": "Financial Times",
    "url": "https://www.ft.com/rss/home",
    "category": "Business",
    "website_url": "https://www.ft.com"
  }
]
```

### 3. **Kaggle Datasets** (Recommended for Historical Data)

#### **News Articles Datasets**
- **BBC News Dataset**: 2,225 articles from 2004-2005
  - **URL**: https://www.kaggle.com/datasets/parisrohanraj/news-category-dataset
  - **Format**: CSV with categories, titles, descriptions
  - **Perfect for**: Training your AI models

- **Reuters News Dataset**: 11,228 articles with 46 categories
  - **URL**: https://www.kaggle.com/datasets/parisrohanraj/news-category-dataset
  - **Format**: CSV with detailed categorization
  - **Perfect for**: Category classification training

- **News Category Dataset**: 200k+ news headlines from HuffPost
  - **URL**: https://www.kaggle.com/datasets/rmisra/news-category-dataset
  - **Format**: CSV with 41 categories
  - **Perfect for**: Large-scale training data

#### **Sentiment Analysis Datasets**
- **IMDB Reviews**: 50,000 movie reviews with sentiment labels
  - **URL**: https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews
  - **Perfect for**: Training your `ai_sentiment` model

- **News Sentiment Dataset**: News articles with sentiment analysis
  - **URL**: https://www.kaggle.com/datasets/parisrohanraj/news-category-dataset
  - **Perfect for**: News-specific sentiment training

#### **Text Summarization Datasets**
- **CNN/DailyMail**: News articles with human-written summaries
  - **URL**: https://www.kaggle.com/datasets/gowrishankarp/newspaper-text-summarization-cnn-dailymail
  - **Perfect for**: Training your `ai_summary` generation

- **XSum**: BBC news articles with summaries
  - **URL**: https://www.kaggle.com/datasets/parisrohanraj/news-category-dataset
  - **Perfect for**: Abstractive summarization training

### 4. **Academic Datasets** (Recommended for Research Quality)

#### **News Reading Behavior**
- **MIND Dataset**: Microsoft News Dataset with user behavior
  - **URL**: https://msnews.github.io/
  - **Content**: News articles + user click behavior
  - **Perfect for**: Your `ReadingHistory` model and recommendations

#### **Social Media Engagement**
- **Twitter News Dataset**: News article sharing patterns
  - **URL**: https://www.kaggle.com/datasets/parisrohanraj/news-category-dataset
  - **Content**: Retweets, likes, comments on news articles
  - **Perfect for**: Your `view_count`, `share_count` calculations

### 5. **Real-time Data Sources** (Recommended for Live Features)

#### **Reddit News Subreddits**
- **r/news**: General news
- **r/worldnews**: International news
- **r/technology**: Technology news
- **r/science**: Scientific discoveries
- **Format**: JSON API via Reddit API
- **Perfect for**: Trending topics and user engagement

#### **Hacker News API**
- **URL**: https://github.com/HackerNews/API
- **Content**: Tech news and discussions
- **Format**: JSON API
- **Perfect for**: Technology-focused content

## 🚀 **Implementation Strategy**

### **Phase 1: RSS Feeds (Immediate)**
1. Use the provided RSS feed list
2. Run the import script: `python backend/import_real_data.py`
3. Get real-time articles from established news sources

### **Phase 2: News APIs (Short-term)**
1. Sign up for NewsAPI.org (free tier)
2. Add API key to environment variables
3. Import recent articles for multiple categories

### **Phase 3: Historical Data (Medium-term)**
1. Download Kaggle datasets
2. Use the CSV import functionality
3. Build training datasets for AI models

### **Phase 4: User Behavior (Long-term)**
1. Implement real user tracking
2. Collect reading behavior data
3. Build personalized recommendations

## 📊 **Data Quality Metrics**

### **Article Quality Indicators**
- **Word Count**: Minimum 100 words for meaningful content
- **Reading Time**: Calculated at 200 words per minute
- **Source Reliability**: Established news organizations
- **Freshness**: Articles published within last 30 days

### **RSS Feed Quality**
- **Update Frequency**: At least daily updates
- **Error Rate**: Less than 5% fetch failures
- **Content Quality**: Full articles, not just headlines
- **Categorization**: Proper category assignment

### **AI Training Data**
- **Sentiment Labels**: Human-annotated sentiment scores
- **Summary Quality**: Human-written summaries for training
- **Topic Labels**: Expert-categorized topics
- **Diversity**: Multiple sources and perspectives

## 🔧 **Setup Instructions**

### **1. Environment Variables**
```bash
# Add to your .env file
NEWS_API_KEY=your_news_api_key_here
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
```

### **2. Install Dependencies**
```bash
cd backend
pip install pandas requests feedparser
```

### **3. Run Import Script**
```bash
cd backend
python import_real_data.py
```

### **4. Verify Data**
```bash
# Check imported data
python -c "
from app.core.database import SessionLocal
from app.models.article import Article
from app.models.rss_feed import RSSFeed

db = SessionLocal()
print(f'Articles: {db.query(Article).count()}')
print(f'RSS Feeds: {db.query(RSSFeed).count()}')
db.close()
"
```

## 📈 **Expected Results**

After running the import script, you should have:

- **500+ real articles** from RSS feeds
- **100+ articles** from NewsAPI (if API key provided)
- **8 news categories** with proper metadata
- **8 RSS feeds** from major news sources
- **Real article metadata** (reading time, word count, etc.)

## 🎯 **Next Steps**

1. **Run the import script** to get real data immediately
2. **Sign up for NewsAPI.org** for additional content
3. **Download Kaggle datasets** for AI training
4. **Implement real-time RSS fetching** for continuous updates
5. **Add user behavior tracking** for personalization

This approach ensures your platform has real, high-quality data from day one, avoiding any sample or mock data while building a robust foundation for your AI-powered news discovery platform.
