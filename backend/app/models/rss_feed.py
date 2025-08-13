from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Index, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

class RSSFeed(Base):
    __tablename__ = "rss_feeds"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    url = Column(String(2000), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    website_url = Column(String(2000), nullable=True)
    category = Column(String(100), nullable=True, index=True)
    language = Column(String(10), default="en")
    
    # Feed metadata
    last_fetched = Column(DateTime(timezone=True), nullable=True)
    last_modified = Column(String(255), nullable=True)  # HTTP Last-Modified header
    etag = Column(String(255), nullable=True)  # HTTP ETag header
    fetch_frequency = Column(Integer, default=60)  # Minutes between fetches
    
    # Feed status
    is_active = Column(Boolean, default=True)
    is_approved = Column(Boolean, default=False)  # For moderation
    fetch_errors = Column(Integer, default=0)
    last_error = Column(Text, nullable=True)
    last_successful_fetch = Column(DateTime(timezone=True), nullable=True)
    
    # Statistics
    total_articles = Column(Integer, default=0)
    articles_this_month = Column(Integer, default=0)
    avg_articles_per_day = Column(Integer, default=0)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    articles = relationship("Article", back_populates="rss_feed")
    user_subscriptions = relationship("UserFeedSubscription", back_populates="rss_feed")
    
    # Indexes for performance
    __table_args__ = (
        Index('idx_rss_feed_active_category', 'is_active', 'category'),
        Index('idx_rss_feed_last_fetched', 'last_fetched'),
        Index('idx_rss_feed_fetch_frequency', 'fetch_frequency'),
    )

class UserFeedSubscription(Base):
    __tablename__ = "user_feed_subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rss_feed_id = Column(Integer, ForeignKey("rss_feeds.id"), nullable=False)
    subscribed_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)
    notification_enabled = Column(Boolean, default=True)
    custom_name = Column(String(255), nullable=True)  # User's custom name for the feed
    
    # User preferences for this feed
    priority = Column(Integer, default=1)  # 1-5, higher = more important
    categories_filter = Column(Text, nullable=True)  # JSON string of categories to include
    
    # Relationships
    user = relationship("User", back_populates="feed_subscriptions")
    rss_feed = relationship("RSSFeed", back_populates="user_subscriptions")
    
    # Composite index for unique subscriptions
    __table_args__ = (
        Index('idx_user_feed_subscription', 'user_id', 'rss_feed_id', unique=True),
        Index('idx_user_subscriptions_active', 'user_id', 'is_active'),
    )

class FeedCategory(Base):
    __tablename__ = "feed_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    color = Column(String(7), default="#3B82F6")  # Hex color for UI
    icon = Column(String(50), nullable=True)  # Icon name or class
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Pydantic models for API
class RSSFeedBase(BaseModel):
    name: str
    url: str
    description: Optional[str] = None
    website_url: Optional[str] = None
    category: Optional[str] = None
    language: str = "en"
    fetch_frequency: int = 60

class RSSFeedCreate(RSSFeedBase):
    pass

class RSSFeedUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    website_url: Optional[str] = None
    category: Optional[str] = None
    language: Optional[str] = None
    fetch_frequency: Optional[int] = None
    is_active: Optional[bool] = None

class RSSFeedInDB(RSSFeedBase):
    id: int
    last_fetched: Optional[datetime] = None
    is_active: bool
    is_approved: bool
    fetch_errors: int
    last_error: Optional[str] = None
    last_successful_fetch: Optional[datetime] = None
    total_articles: int
    articles_this_month: int
    avg_articles_per_day: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class RSSFeedResponse(RSSFeedInDB):
    pass

class UserFeedSubscriptionCreate(BaseModel):
    rss_feed_id: int
    notification_enabled: bool = True
    custom_name: Optional[str] = None
    priority: int = 1
    categories_filter: Optional[List[str]] = None

class UserFeedSubscriptionUpdate(BaseModel):
    is_active: Optional[bool] = None
    notification_enabled: Optional[bool] = None
    custom_name: Optional[str] = None
    priority: Optional[int] = None
    categories_filter: Optional[List[str]] = None

class UserFeedSubscriptionInDB(BaseModel):
    id: int
    user_id: int
    rss_feed_id: int
    subscribed_at: datetime
    is_active: bool
    notification_enabled: bool
    custom_name: Optional[str] = None
    priority: int
    categories_filter: Optional[List[str]] = None
    
    class Config:
        from_attributes = True

class FeedCategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None
    slug: str
    color: str = "#3B82F6"
    icon: Optional[str] = None

class FeedCategoryInDB(FeedCategoryCreate):
    id: int
    is_active: bool
    sort_order: int
    created_at: datetime
    
    class Config:
        from_attributes = True