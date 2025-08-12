from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import QueuePool
import os

# Database URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dscvr_news.db")

# Create engine with performance optimizations
engine = create_engine(
    DATABASE_URL,
    # Connection pooling for better performance
    poolclass=QueuePool,
    pool_size=20,  # Number of connections to maintain
    max_overflow=30,  # Additional connections when pool is full
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=3600,  # Recycle connections every hour
    
    # SQLite specific optimizations
    connect_args={
        "check_same_thread": False,
        "timeout": 30,
        "isolation_level": None,  # Autocommit mode for better performance
    } if "sqlite" in DATABASE_URL else {},
    
    # Query optimization
    echo=False,  # Disable SQL logging in production
)

# Session factory with performance settings
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,  # Prevent lazy loading issues
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
