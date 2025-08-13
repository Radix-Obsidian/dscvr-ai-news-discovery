import httpx
import asyncio
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import json
from app.core.config import settings
from app.models.article import Article, ArticleCreate
import logging

logger = logging.getLogger(__name__)

class NewsAPIService:
    def __init__(self):
        self.api_key = settings.NEWS_API_KEY
        self.base_url = "https://newsapi.org/v2"
        self.client = httpx.AsyncClient(timeout=30.0)
        
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    async def get_top_headlines(
        self, 
        country: str = "us",
        category: Optional[str] = None,
        sources: Optional[str] = None,
        q: Optional[str] = None,
        page_size: int = 100,
        page: int = 1
    ) -> Dict[str, Any]:
        """
        Fetch top headlines from NewsAPI
        
        Args:
            country: 2-letter ISO 3166-1 country code
            category: business, entertainment, general, health, science, sports, technology
            sources: Comma-separated string of news source IDs
            q: Keywords or phrases to search for
            page_size: Number of results to return per page (max 100)
            page: Page number to retrieve
        """
        url = f"{self.base_url}/top-headlines"
        params = {
            "apiKey": self.api_key,
            "pageSize": page_size,
            "page": page
        }
        
        if country and not sources:
            params["country"] = country
        if category:
            params["category"] = category
        if sources:
            params["sources"] = sources
        if q:
            params["q"] = q
            
        try:
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"NewsAPI request failed: {e}")
            raise
    
    async def get_everything(
        self,
        q: Optional[str] = None,
        sources: Optional[str] = None,
        domains: Optional[str] = None,
        exclude_domains: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
        language: str = "en",
        sort_by: str = "publishedAt",
        page_size: int = 100,
        page: int = 1
    ) -> Dict[str, Any]:
        """
        Search through millions of articles from over 80,000 large and small news sources and blogs
        
        Args:
            q: Keywords or phrases to search for
            sources: Comma-separated string of news source IDs
            domains: Comma-separated string of domains to restrict search to
            exclude_domains: Comma-separated string of domains to exclude
            from_date: Oldest article allowed (datetime object)
            to_date: Newest article allowed (datetime object)
            language: Language code (en, de, fr, etc.)
            sort_by: relevancy, popularity, publishedAt
            page_size: Number of results to return per page (max 100)
            page: Page number to retrieve
        """
        url = f"{self.base_url}/everything"
        params = {
            "apiKey": self.api_key,
            "language": language,
            "sortBy": sort_by,
            "pageSize": page_size,
            "page": page
        }
        
        if q:
            params["q"] = q
        if sources:
            params["sources"] = sources
        if domains:
            params["domains"] = domains
        if exclude_domains:
            params["excludeDomains"] = exclude_domains
        if from_date:
            params["from"] = from_date.isoformat()
        if to_date:
            params["to"] = to_date.isoformat()
            
        try:
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"NewsAPI request failed: {e}")
            raise
    
    async def get_sources(
        self,
        category: Optional[str] = None,
        language: str = "en",
        country: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get available news sources
        
        Args:
            category: business, entertainment, general, health, science, sports, technology
            language: Language code
            country: 2-letter ISO 3166-1 country code
        """
        url = f"{self.base_url}/top-headlines/sources"
        params = {
            "apiKey": self.api_key,
            "language": language
        }
        
        if category:
            params["category"] = category
        if country:
            params["country"] = country
            
        try:
            response = await self.client.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPError as e:
            logger.error(f"NewsAPI request failed: {e}")
            raise
    
    def _parse_newsapi_article(self, article_data: Dict[str, Any]) -> ArticleCreate:
        """
        Convert NewsAPI article format to our ArticleCreate model
        """
        # Parse published date
        published_date = None
        if article_data.get("publishedAt"):
            try:
                published_date = datetime.fromisoformat(
                    article_data["publishedAt"].replace("Z", "+00:00")
                )
            except (ValueError, TypeError):
                logger.warning(f"Could not parse date: {article_data.get('publishedAt')}")
        
        # Extract source info
        source_info = article_data.get("source", {})
        source_name = source_info.get("name") if isinstance(source_info, dict) else str(source_info)
        
        # Calculate reading time (rough estimate: 200 words per minute)
        content = article_data.get("content") or article_data.get("description", "")
        word_count = len(content.split()) if content else 0
        reading_time = max(1, word_count // 200)
        
        return ArticleCreate(
            title=article_data.get("title", "")[:500],  # Limit to 500 chars
            url=article_data.get("url", ""),
            description=article_data.get("description"),
            content=article_data.get("content"),
            author=article_data.get("author"),
            published_date=published_date,
            source=source_name,
            image_url=article_data.get("urlToImage"),
            tags=[]  # NewsAPI doesn't provide tags directly
        )
    
    async def fetch_latest_articles(
        self,
        categories: List[str] = None,
        sources: List[str] = None,
        max_articles: int = 100
    ) -> List[ArticleCreate]:
        """
        Fetch latest articles across multiple categories and sources
        
        Args:
            categories: List of categories to fetch
            sources: List of source IDs to fetch from
            max_articles: Maximum number of articles to return
        """
        all_articles = []
        
        if not categories:
            categories = ["technology", "business", "science", "health"]
        
        # Fetch articles from each category
        for category in categories:
            try:
                if len(all_articles) >= max_articles:
                    break
                    
                remaining = max_articles - len(all_articles)
                page_size = min(100, remaining)
                
                response = await self.get_top_headlines(
                    category=category,
                    sources=",".join(sources) if sources else None,
                    page_size=page_size
                )
                
                if response.get("status") == "ok":
                    articles = response.get("articles", [])
                    for article_data in articles:
                        if len(all_articles) >= max_articles:
                            break
                        try:
                            article = self._parse_newsapi_article(article_data)
                            article.category = category
                            all_articles.append(article)
                        except Exception as e:
                            logger.warning(f"Failed to parse article: {e}")
                            continue
                            
                # Add delay to respect rate limits
                await asyncio.sleep(0.1)
                
            except Exception as e:
                logger.error(f"Failed to fetch articles for category {category}: {e}")
                continue
        
        return all_articles
    
    async def search_articles(
        self,
        query: str,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
        sources: Optional[List[str]] = None,
        max_articles: int = 100
    ) -> List[ArticleCreate]:
        """
        Search for articles using a specific query
        
        Args:
            query: Search query
            from_date: Start date for search
            to_date: End date for search
            sources: List of source IDs to search within
            max_articles: Maximum number of articles to return
        """
        try:
            response = await self.get_everything(
                q=query,
                sources=",".join(sources) if sources else None,
                from_date=from_date,
                to_date=to_date,
                sort_by="publishedAt",
                page_size=min(100, max_articles)
            )
            
            articles = []
            if response.get("status") == "ok":
                for article_data in response.get("articles", []):
                    try:
                        article = self._parse_newsapi_article(article_data)
                        articles.append(article)
                    except Exception as e:
                        logger.warning(f"Failed to parse article: {e}")
                        continue
            
            return articles
            
        except Exception as e:
            logger.error(f"Failed to search articles: {e}")
            return []
    
    def search_articles_sync(
        self,
        query: str,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
        sources: Optional[List[str]] = None,
        max_articles: int = 100
    ) -> List[ArticleCreate]:
        """
        Synchronous version of search_articles
        """
        try:
            # Create a new event loop for this thread
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            
            # Run the async method
            articles = loop.run_until_complete(
                self.search_articles(
                    query=query,
                    from_date=from_date,
                    to_date=to_date,
                    sources=sources,
                    max_articles=max_articles
                )
            )
            
            loop.close()
            return articles
            
        except Exception as e:
            logger.error(f"Failed to search articles synchronously: {e}")
            return []

# Global instance
news_api_service = NewsAPIService()