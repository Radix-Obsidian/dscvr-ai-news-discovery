from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

class Article(Base):
    __tablename__ = "articles"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    url = Column(String(2000), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    author = Column(String(255), nullable=True)
    published_date = Column(DateTime(timezone=True), nullable=True)
    source = Column(String(255), nullable=True, index=True)
    category = Column(String(100), nullable=True, index=True)
    tags = Column(Text, nullable=True)  # JSON string of tags
    image_url = Column(String(2000), nullable=True)
    word_count = Column(Integer, default=0)
    reading_time = Column(Integer, default=0)  # in minutes
    
    # AI-generated content
    ai_summary = Column(Text, nullable=True)
    ai_sentiment = Column(String(50), nullable=True)  # positive, negative, neutral
    ai_topics = Column(Text, nullable=True)  # JSON string of extracted topics
    
    # Metadata
    is_featured = Column(Boolean, default=False)
    is_trending = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    share_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign keys
    rss_feed_id = Column(Integer, ForeignKey("rss_feeds.id"), nullable=True)
    
    # Relationships
    rss_feed = relationship("RSSFeed", back_populates="articles")
    reading_history = relationship("ReadingHistory", back_populates="article")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_article_published_date', 'published_date'),
        Index('idx_article_source_category', 'source', 'category'),
        Index('idx_article_trending_featured', 'is_trending', 'is_featured'),
    )

class ReadingHistory(Base):
    __tablename__ = "reading_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=False)
    read_at = Column(DateTime(timezone=True), server_default=func.now())
    reading_progress = Column(Integer, default=0)  # Percentage read (0-100)
    time_spent = Column(Integer, default=0)  # Time spent reading in seconds
    
    # Relationships
    user = relationship("User", back_populates="reading_history")
    article = relationship("Article", back_populates="reading_history")
    
    # Composite index for efficient queries
    __table_args__ = (
        Index('idx_reading_history_user_article', 'user_id', 'article_id'),
        Index('idx_reading_history_read_at', 'read_at'),
    )

class AIChat(Base):
    __tablename__ = "ai_chats"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    article_id = Column(Integer, ForeignKey("articles.id"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    context_type = Column(String(50), default="general")  # general, article-specific, summary
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="ai_chats")
    
    # Index for user queries
    __table_args__ = (
        Index('idx_ai_chat_user_created', 'user_id', 'created_at'),
    )

# Pydantic models for API
class ArticleBase(BaseModel):
    title: str
    url: str
    description: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    published_date: Optional[datetime] = None
    source: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = []
    image_url: Optional[str] = None

class ArticleCreate(ArticleBase):
    rss_feed_id: Optional[int] = None

class ArticleUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[List[str]] = None
    ai_summary: Optional[str] = None
    ai_sentiment: Optional[str] = None
    ai_topics: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    is_trending: Optional[bool] = None

class ArticleInDB(ArticleBase):
    id: int
    word_count: int
    reading_time: int
    ai_summary: Optional[str] = None
    ai_sentiment: Optional[str] = None
    ai_topics: Optional[List[str]] = None
    is_featured: bool
    is_trending: bool
    view_count: int
    share_count: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    rss_feed_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class ArticleResponse(ArticleInDB):
    pass

class ReadingHistoryCreate(BaseModel):
    article_id: int
    reading_progress: int = 0
    time_spent: int = 0

class ReadingHistoryInDB(BaseModel):
    id: int
    user_id: int
    article_id: int
    read_at: datetime
    reading_progress: int
    time_spent: int
    
    class Config:
        from_attributes = True

class AIChatCreate(BaseModel):
    question: str
    article_id: Optional[int] = None
    context_type: str = "general"

class AIChatInDB(BaseModel):
    id: int
    user_id: int
    article_id: Optional[int] = None
    question: str
    answer: str
    context_type: str
    created_at: datetime
    
    class Config:
        from_attributes = True