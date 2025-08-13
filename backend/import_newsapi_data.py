#!/usr/bin/env python3
"""
Import real news data from NewsAPI.org into the database
"""

import asyncio
import sys
import os
from datetime import datetime, timedelta
from typing import List
import logging

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.core.database import engine, SessionLocal
from app.models.article import Article, ArticleCreate
from app.services.news_api_service import news_api_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class NewsAPIImporter:
    def __init__(self):
        self.db = SessionLocal()
        
    def close(self):
        """Close database connection"""
        self.db.close()
    
    async def import_articles(
        self,
        categories: List[str] = None,
        max_articles: int = 200,
        sources: List[str] = None
    ):
        """
        Import articles from NewsAPI into the database
        
        Args:
            categories: List of categories to import
            max_articles: Maximum number of articles to import
            sources: List of specific news sources to import from
        """
        logger.info("Starting NewsAPI data import...")
        
        if not categories:
            categories = [
                "technology", "business", "science", "health", 
                "general", "entertainment", "sports"
            ]
        
        try:
            # Fetch articles from NewsAPI
            logger.info(f"Fetching articles from categories: {categories}")
            articles = await news_api_service.fetch_latest_articles(
                categories=categories,
                sources=sources,
                max_articles=max_articles
            )
            
            logger.info(f"Fetched {len(articles)} articles from NewsAPI")
            
            # Import articles into database
            imported_count = 0
            duplicate_count = 0
            error_count = 0
            
            for article_data in articles:
                try:
                    # Check if article already exists
                    existing_article = self.db.query(Article).filter(
                        Article.url == article_data.url
                    ).first()
                    
                    if existing_article:
                        duplicate_count += 1
                        logger.debug(f"Article already exists: {article_data.title[:50]}...")
                        continue
                    
                    # Calculate word count and reading time
                    content = article_data.content or article_data.description or ""
                    word_count = len(content.split()) if content else 0
                    reading_time = max(1, word_count // 200)  # 200 words per minute
                    
                    # Create new article
                    db_article = Article(
                        title=article_data.title,
                        url=article_data.url,
                        description=article_data.description,
                        content=article_data.content,
                        author=article_data.author,
                        published_date=article_data.published_date,
                        source=article_data.source,
                        category=article_data.category,
                        image_url=article_data.image_url,
                        word_count=word_count,
                        reading_time=reading_time,
                        tags="[]",  # Empty tags for now
                        created_at=datetime.utcnow()
                    )
                    
                    self.db.add(db_article)
                    self.db.commit()
                    imported_count += 1
                    
                    logger.debug(f"Imported: {article_data.title[:50]}...")
                    
                except IntegrityError as e:
                    self.db.rollback()
                    duplicate_count += 1
                    logger.debug(f"Duplicate article (integrity error): {article_data.title[:50]}...")
                    
                except Exception as e:
                    self.db.rollback()
                    error_count += 1
                    logger.error(f"Error importing article '{article_data.title[:50]}...': {e}")
            
            logger.info(f"""
Import completed:
- Articles imported: {imported_count}
- Duplicates skipped: {duplicate_count}
- Errors: {error_count}
- Total processed: {len(articles)}
            """)
            
        except Exception as e:
            logger.error(f"Failed to import articles: {e}")
            raise
        
        finally:
            await news_api_service.close()
    
    async def import_trending_articles(self, max_articles: int = 50):
        """
        Import trending articles and mark them as trending
        """
        logger.info("Importing trending articles...")
        
        try:
            # Get trending tech and business articles
            articles = await news_api_service.fetch_latest_articles(
                categories=["technology", "business"],
                max_articles=max_articles
            )
            
            imported_count = 0
            
            for article_data in articles[:max_articles//2]:  # Take top half as trending
                try:
                    existing_article = self.db.query(Article).filter(
                        Article.url == article_data.url
                    ).first()
                    
                    if existing_article:
                        # Mark existing article as trending
                        existing_article.is_trending = True
                        self.db.commit()
                        logger.debug(f"Marked as trending: {existing_article.title[:50]}...")
                    else:
                        # Import new article as trending
                        content = article_data.content or article_data.description or ""
                        word_count = len(content.split()) if content else 0
                        reading_time = max(1, word_count // 200)
                        
                        db_article = Article(
                            title=article_data.title,
                            url=article_data.url,
                            description=article_data.description,
                            content=article_data.content,
                            author=article_data.author,
                            published_date=article_data.published_date,
                            source=article_data.source,
                            category=article_data.category,
                            image_url=article_data.image_url,
                            word_count=word_count,
                            reading_time=reading_time,
                            tags="[]",
                            is_trending=True,
                            created_at=datetime.utcnow()
                        )
                        
                        self.db.add(db_article)
                        self.db.commit()
                        logger.debug(f"Imported as trending: {article_data.title[:50]}...")
                    
                    imported_count += 1
                    
                except Exception as e:
                    self.db.rollback()
                    logger.error(f"Error processing trending article: {e}")
            
            logger.info(f"Processed {imported_count} trending articles")
            
        except Exception as e:
            logger.error(f"Failed to import trending articles: {e}")
            raise

async def main():
    """Main import function"""
    importer = NewsAPIImporter()
    
    try:
        # Import general articles
        await importer.import_articles(
            categories=["technology", "business", "science", "health", "general"],
            max_articles=150
        )
        
        # Import trending articles
        await importer.import_trending_articles(max_articles=30)
        
        logger.info("NewsAPI data import completed successfully!")
        
    except Exception as e:
        logger.error(f"Import failed: {e}")
        sys.exit(1)
    
    finally:
        importer.close()

if __name__ == "__main__":
    print("Starting NewsAPI data import...")
    print("This will fetch real news articles from NewsAPI.org")
    print("Categories: technology, business, science, health, general")
    print("-" * 50)
    
    # Run the import
    asyncio.run(main())
    
    print("-" * 50)
    print("Import completed! Check the logs above for details.")