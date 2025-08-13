#!/usr/bin/env python3
"""
Database initialization script for Dscvr AI News Discovery Platform

This script creates all database tables and sets up initial data.
Run this after setting up your PostgreSQL database.
"""

import os
import sys
from sqlalchemy import create_engine, text
from app.core.database import Base, engine
from app.models import *  # Import all models to register them with Base

# Determine database type
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dscvr_news.db")
is_postgresql = "postgresql" in DATABASE_URL

def create_database_tables():
    """Create all database tables"""
    print("Creating database tables...")
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        # Verify tables were created
        with engine.connect() as conn:
            if is_postgresql:
                result = conn.execute(text("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = 'public'
                    ORDER BY table_name
                """))
            else:
                # SQLite syntax
                result = conn.execute(text("""
                    SELECT name 
                    FROM sqlite_master 
                    WHERE type='table'
                    ORDER BY name
                """))
            tables = [row[0] for row in result]
            
        print(f"\n📋 Created tables:")
        for table in tables:
            print(f"  - {table}")
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        sys.exit(1)

def create_initial_data():
    """Create initial data for the database"""
    print("\nCreating initial data...")
    
    try:
        with engine.connect() as conn:
            # Create default feed categories
            categories_data = [
                ('Technology', 'Latest tech news and updates', 'technology', '#3B82F6', 'laptop'),
                ('Business', 'Business and finance news', 'business', '#10B981', 'briefcase'),
                ('Science', 'Scientific discoveries and research', 'science', '#8B5CF6', 'microscope'),
                ('Health', 'Health and medical news', 'health', '#EF4444', 'heart'),
                ('Sports', 'Sports news and updates', 'sports', '#F59E0B', 'trophy'),
                ('Entertainment', 'Entertainment and celebrity news', 'entertainment', '#EC4899', 'film'),
                ('Politics', 'Political news and analysis', 'politics', '#6B7280', 'flag'),
                ('World', 'International news', 'world', '#059669', 'globe'),
            ]
            
            # Insert categories if they don't exist
            for name, description, slug, color, icon in categories_data:
                if is_postgresql:
                    conn.execute(text("""
                        INSERT INTO feed_categories (name, description, slug, color, icon, is_active, sort_order)
                        VALUES (:name, :description, :slug, :color, :icon, true, :sort_order)
                        ON CONFLICT (slug) DO NOTHING
                    """), {
                        "name": name,
                        "description": description, 
                        "slug": slug,
                        "color": color,
                        "icon": icon,
                        "sort_order": len([c for c in categories_data if c[0] <= name])
                    })
                else:
                    # SQLite doesn't support ON CONFLICT, use INSERT OR IGNORE
                    conn.execute(text("""
                        INSERT OR IGNORE INTO feed_categories (name, description, slug, color, icon, is_active, sort_order)
                        VALUES (:name, :description, :slug, :color, :icon, true, :sort_order)
                    """), {
                        "name": name,
                        "description": description, 
                        "slug": slug,
                        "color": color,
                        "icon": icon,
                        "sort_order": len([c for c in categories_data if c[0] <= name])
                    })
            
            # Create some sample RSS feeds
            sample_feeds = [
                ('TechCrunch', 'https://techcrunch.com/feed/', 'Startup and technology news', 'https://techcrunch.com', 'technology'),
                ('BBC News - Technology', 'http://feeds.bbci.co.uk/news/technology/rss.xml', 'BBC Technology News', 'https://bbc.com/news/technology', 'technology'),
                ('Reuters - Business', 'https://feeds.reuters.com/reuters/businessNews', 'Reuters Business News', 'https://reuters.com', 'business'),
                ('Scientific American', 'https://www.scientificamerican.com/xml/rss.xml', 'Science news and articles', 'https://scientificamerican.com', 'science'),
            ]
            
            for name, url, description, website, category in sample_feeds:
                if is_postgresql:
                    conn.execute(text("""
                        INSERT INTO rss_feeds (name, url, description, website_url, category, is_active, is_approved)
                        VALUES (:name, :url, :description, :website_url, :category, true, true)
                        ON CONFLICT (url) DO NOTHING
                    """), {
                        "name": name,
                        "url": url,
                        "description": description,
                        "website_url": website,
                        "category": category
                    })
                else:
                    # SQLite doesn't support ON CONFLICT, use INSERT OR IGNORE
                    conn.execute(text("""
                        INSERT OR IGNORE INTO rss_feeds (name, url, description, website_url, category, is_active, is_approved)
                        VALUES (:name, :url, :description, :website_url, :category, true, true)
                    """), {
                        "name": name,
                        "url": url,
                        "description": description,
                        "website_url": website,
                        "category": category
                    })
            
            conn.commit()
            print("✅ Initial data created successfully!")
            
    except Exception as e:
        print(f"❌ Error creating initial data: {e}")
        # Don't exit here as tables are already created

def main():
    """Main function"""
    print("🚀 Initializing Dscvr AI News Discovery Platform Database\n")
    
    # Check if DATABASE_URL is set
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL environment variable not set!")
        print("Please set your PostgreSQL connection string:")
        print("export DATABASE_URL='postgresql://username:password@localhost:5432/dscvr_news'")
        sys.exit(1)
    
    print(f"📊 Database URL: {database_url.split('@')[0]}@***")  # Hide password
    
    # Test database connection
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful!")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure PostgreSQL is running")
        print("2. Check your DATABASE_URL format")
        print("3. Verify database exists and credentials are correct")
        sys.exit(1)
    
    # Create tables
    create_database_tables()
    
    # Create initial data
    create_initial_data()
    
    print("\n🎉 Database initialization complete!")
    print("\nNext steps:")
    print("1. Start the backend server: python -m uvicorn main:app --reload")
    print("2. Visit http://localhost:8000/docs for API documentation")

if __name__ == "__main__":
    main()