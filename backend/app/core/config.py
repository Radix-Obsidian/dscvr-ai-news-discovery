from pydantic_settings import BaseSettings
from typing import Optional, List
import os

class Settings(BaseSettings):
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Dscvr AI News Discovery Platform"
    
    # Database
    DATABASE_URL: str = "sqlite:///./dscvr_news.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
    
    # AI/ML Services
    OPENAI_API_KEY: Optional[str] = None
    NEWS_API_KEY: Optional[str] = None
    
    # Ollama Configuration (Local LLM)
    OLLAMA_HOST: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama2"  # or "mistral", "codellama", etc.
    
    # Redis (for caching and background tasks)
    REDIS_URL: str = "redis://localhost:6379"
    
    # News Sources
    NEWS_SOURCES: List[str] = [
        "https://feeds.bbci.co.uk/news/rss.xml",
        "https://rss.cnn.com/rss/edition.rss",
        "https://feeds.npr.org/1001/rss.xml",
        "https://www.theguardian.com/world/rss",
        "https://feeds.reuters.com/Reuters/worldNews"
    ]
    
    # User Preferences
    DEFAULT_INTERESTS: List[str] = [
        "Technology", "Science", "Business", "Politics", 
        "Health", "Entertainment", "Sports", "Environment"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
