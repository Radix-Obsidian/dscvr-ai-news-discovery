from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # User preferences
    interests = Column(Text, nullable=True)  # JSON string of interests
    reading_preferences = Column(Text, nullable=True)  # JSON string of preferences
    
    # Relationships
    articles = relationship("Article", back_populates="author")
    reading_history = relationship("ReadingHistory", back_populates="user")
    ai_chats = relationship("AIChat", back_populates="user")

# Pydantic models for API
class UserBase(BaseModel):
    email: str
    username: str
    full_name: Optional[str] = None
    interests: Optional[List[str]] = []
    reading_preferences: Optional[dict] = {}

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    interests: Optional[List[str]] = None
    reading_preferences: Optional[dict] = None

class UserInDB(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class User(UserInDB):
    pass
