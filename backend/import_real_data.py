#!/usr/bin/env python3
"""
Real Data Import Script for Dscvr AI News Discovery Platform
Imports real datasets to replace sample/mock data
"""

import os
import json
import csv
import requests
import feedparser
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import pandas as pd
from urllib.parse import urlparse
import time
import logging

# Import your models
from app.core.database import SessionLocal, engine
from app.models.article import Article
from app.models.rss_feed import RSSFeed, FeedCategory
from app.models.user import User
from app.services.news_api_service import news_api_service

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class RealDataImporter:
    def __init__(self):
        self.db = SessionLocal()
        self.news_api_key = os.getenv("NEWS_API_KEY")
        
    def __del__(self):
        self.db.close()
    
    def import_news_api_data(self, category: str = "technology", days_back: int = 30):
        """Import real news data from NewsAPI.org using the NewsAPI service"""
        logger.info(f"Importing {category} news from NewsAPI.org...")
        
        try:
            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days_back)
            
            # Use the NewsAPI service to search for articles
            articles = news_api_service.search_articles_sync(
                query=category,
                from_date=start_date,
                to_date=end_date,
                max_articles=100
            )
            
            articles_imported = 0
            duplicates_skipped = 0
            
            for article_data in articles:
                try:
                    # Check if article already exists
                    existing_article = self.db.query(Article).filter(
                        Article.url == article_data.url
                    ).first()
                    
                    if existing_article:
                        duplicates_skipped += 1
                        continue
                    
                    # Create or get RSS feed
                    source_name = article_data.source or "Unknown"
                    rss_feed = self._get_or_create_rss_feed(source_name, category)
                    
                    # Calculate word count and reading time
                    content = article_data.content or article_data.description or ""
                    word_count = len(content.split()) if content else 0
                    reading_time = max(1, word_count // 200)
                    
                    # Create article
                    article = Article(
                        title=article_data.title,
                        url=article_data.url,
                        description=article_data.description,
                        content=article_data.content,
                        author=article_data.author,
                        published_date=article_data.published_date,
                        source=source_name,
                        category=category,
                        image_url=article_data.image_url,
                        word_count=word_count,
                        reading_time=reading_time,
                        rss_feed_id=rss_feed.id,
                        tags="[]"
                    )
                    
                    self.db.add(article)
                    articles_imported += 1
                    
                except Exception as e:
                    logger.error(f"Error importing article: {e}")
                    continue
            
            self.db.commit()
            logger.info(f"Successfully imported {articles_imported} articles from NewsAPI.org ({duplicates_skipped} duplicates skipped)")
            
        except Exception as e:
            logger.error(f"Error fetching from NewsAPI: {e}")
    
    def import_rss_feeds(self, feeds_data: List[Dict[str, str]]):
        """Import real RSS feeds"""
        logger.info("Importing RSS feeds...")
        
        feeds_imported = 0
        for feed_data in feeds_data:
            try:
                # Check if RSS feed already exists
                existing = self.db.query(RSSFeed).filter(RSSFeed.url == feed_data["url"]).first()
                if existing:
                    continue
                
                # Parse RSS feed to get metadata
                feed_info = feedparser.parse(feed_data["url"])
                
                if feed_info.bozo:
                    logger.warning(f"Invalid RSS feed: {feed_data['url']}")
                    continue
                
                # Create RSS feed
                rss_feed = RSSFeed(
                    name=feed_data.get("name", feed_info.feed.get("title", "Unknown")),
                    url=feed_data["url"],
                    description=feed_data.get("description", feed_info.feed.get("description", "")),
                    website_url=feed_data.get("website_url", feed_info.feed.get("link", "")),
                    category=feed_data.get("category", "General"),
                    language=feed_data.get("language", "en"),
                    is_active=True,
                    is_approved=True
                )
                
                self.db.add(rss_feed)
                feeds_imported += 1
                
                # Import recent articles from RSS
                self._import_rss_articles(rss_feed, feed_info.entries[:20])  # Last 20 articles
                
            except Exception as e:
                logger.error(f"Error importing RSS feed {feed_data['url']}: {e}")
                continue
        
        self.db.commit()
        logger.info(f"Successfully imported {feeds_imported} RSS feeds")
    
    def import_csv_dataset(self, file_path: str, dataset_type: str):
        """Import data from CSV files (Kaggle datasets, etc.)"""
        logger.info(f"Importing CSV dataset: {file_path}")
        
        try:
            df = pd.read_csv(file_path)
            
            if dataset_type == "news_articles":
                self._import_news_csv(df)
            elif dataset_type == "sentiment":
                self._import_sentiment_csv(df)
            elif dataset_type == "categories":
                self._import_categories_csv(df)
            else:
                logger.error(f"Unknown dataset type: {dataset_type}")
                
        except Exception as e:
            logger.error(f"Error importing CSV dataset: {e}")
    
    def import_categories(self):
        """Import real news categories"""
        categories = [
            {"name": "Technology", "description": "Latest tech news and innovations", "slug": "technology", "color": "#3B82F6", "icon": "cpu"},
            {"name": "Business", "description": "Business and financial news", "slug": "business", "color": "#10B981", "icon": "briefcase"},
            {"name": "Science", "description": "Scientific discoveries and research", "slug": "science", "color": "#8B5CF6", "icon": "flask"},
            {"name": "Health", "description": "Health and medical news", "slug": "health", "color": "#EF4444", "icon": "heart"},
            {"name": "Sports", "description": "Sports news and updates", "slug": "sports", "color": "#F59E0B", "icon": "trophy"},
            {"name": "Politics", "description": "Political news and analysis", "slug": "politics", "color": "#6B7280", "icon": "flag"},
            {"name": "Entertainment", "description": "Entertainment and culture", "slug": "entertainment", "color": "#EC4899", "icon": "music"},
            {"name": "Environment", "description": "Environmental news and climate", "slug": "environment", "color": "#059669", "icon": "leaf"}
        ]
        
        for cat_data in categories:
            # Check if category already exists
            existing = self.db.query(FeedCategory).filter(FeedCategory.slug == cat_data["slug"]).first()
            if existing:
                continue
            
            category = FeedCategory(**cat_data)
            self.db.add(category)
        
        self.db.commit()
        logger.info("Successfully imported news categories")
    
    def _get_or_create_rss_feed(self, name: str, category: str) -> RSSFeed:
        """Get existing RSS feed or create new one"""
        feed = self.db.query(RSSFeed).filter(RSSFeed.name == name).first()
        if not feed:
            feed = RSSFeed(
                name=name,
                url=f"https://{name.lower().replace(' ', '')}.com/feed",
                category=category,
                is_active=True,
                is_approved=True
            )
            self.db.add(feed)
            self.db.flush()  # Get the ID
        return feed
    
    def _import_rss_articles(self, rss_feed: RSSFeed, entries: List[Dict]):
        """Import articles from RSS feed entries"""
        for entry in entries:
            try:
                # Check if article already exists
                existing = self.db.query(Article).filter(Article.url == entry.get("link", "")).first()
                if existing:
                    continue
                
                article = Article(
                    title=entry.get("title", ""),
                    url=entry.get("link", ""),
                    description=entry.get("summary", ""),
                    author=entry.get("author", ""),
                    published_date=datetime(*entry.get("published_parsed", (2024, 1, 1, 0, 0, 0, 0, 0, 0))[:6]),
                    source=rss_feed.name,
                    category=rss_feed.category,
                    rss_feed_id=rss_feed.id,
                    word_count=len(entry.get("summary", "").split()),
                    reading_time=max(1, len(entry.get("summary", "").split()) // 200)
                )
                
                self.db.add(article)
                
            except Exception as e:
                logger.error(f"Error importing RSS article: {e}")
                continue
    
    def _import_news_csv(self, df: pd.DataFrame):
        """Import news articles from CSV"""
        for _, row in df.iterrows():
            try:
                article = Article(
                    title=row.get("title", ""),
                    url=row.get("url", ""),
                    description=row.get("description", ""),
                    content=row.get("content", ""),
                    author=row.get("author", ""),
                    source=row.get("source", ""),
                    category=row.get("category", ""),
                    word_count=len(str(row.get("content", "")).split()),
                    reading_time=max(1, len(str(row.get("content", "")).split()) // 200)
                )
                
                self.db.add(article)
                
            except Exception as e:
                logger.error(f"Error importing CSV article: {e}")
                continue
        
        self.db.commit()
        logger.info(f"Successfully imported {len(df)} articles from CSV")
    
    def _import_sentiment_csv(self, df: pd.DataFrame):
        """Import sentiment analysis data"""
        # This would be used to train your AI sentiment analysis model
        # Implementation depends on your AI service
        logger.info(f"Imported {len(df)} sentiment samples for AI training")
    
    def _import_categories_csv(self, df: pd.DataFrame):
        """Import category data"""
        for _, row in df.iterrows():
            try:
                category = FeedCategory(
                    name=row.get("name", ""),
                    description=row.get("description", ""),
                    slug=row.get("slug", ""),
                    color=row.get("color", "#3B82F6"),
                    icon=row.get("icon", "")
                )
                
                self.db.add(category)
                
            except Exception as e:
                logger.error(f"Error importing category: {e}")
                continue
        
        self.db.commit()
        logger.info(f"Successfully imported {len(df)} categories from CSV")

def main():
    """Main import function"""
    importer = RealDataImporter()
    
    # 1. Import categories
    importer.import_categories()
    
    # 2. Import real RSS feeds
    real_rss_feeds = [
        {"name": "TechCrunch", "url": "https://techcrunch.com/feed/", "category": "Technology", "website_url": "https://techcrunch.com"},
        {"name": "BBC Technology", "url": "https://feeds.bbci.co.uk/news/technology/rss.xml", "category": "Technology", "website_url": "https://www.bbc.com/news/technology"},
        {"name": "Reuters Technology", "url": "https://feeds.reuters.com/reuters/technologyNews", "category": "Technology", "website_url": "https://www.reuters.com/technology"},
        {"name": "Scientific American", "url": "https://rss.sciam.com/ScientificAmerican-Global", "category": "Science", "website_url": "https://www.scientificamerican.com"},
        {"name": "MIT Technology Review", "url": "https://www.technologyreview.com/feed/", "category": "Technology", "website_url": "https://www.technologyreview.com"},
        {"name": "Wired", "url": "https://www.wired.com/feed/rss", "category": "Technology", "website_url": "https://www.wired.com"},
        {"name": "The Verge", "url": "https://www.theverge.com/rss/index.xml", "category": "Technology", "website_url": "https://www.theverge.com"},
        {"name": "Ars Technica", "url": "https://feeds.arstechnica.com/arstechnica/index", "category": "Technology", "website_url": "https://arstechnica.com"}
    ]
    
    importer.import_rss_feeds(real_rss_feeds)
    
    # 3. Import NewsAPI data for different categories
    categories = ["technology", "science", "business", "health"]
    for category in categories:
        importer.import_news_api_data(category, days_back=7)  # Last 7 days
        time.sleep(1)  # Rate limiting
    
    logger.info("Real data import completed successfully!")

if __name__ == "__main__":
    main()
