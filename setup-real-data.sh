#!/bin/bash
# Real Data Setup Script for Dscvr AI News Discovery Platform
# This script will import real datasets to replace sample/mock data

set -e  # Exit on any error

echo "🚀 Setting up Real Data for Dscvr AI News Discovery Platform"
echo "=============================================================="

# Check if we're in the right directory
if [ ! -f "backend/import_real_data.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: Backend directory not found"
    exit 1
fi

echo "📦 Installing additional dependencies..."
cd backend

# Install additional dependencies for data import
pip install pandas>=2.0.0 beautifulsoup4>=4.12.0 lxml>=4.9.0

echo "✅ Dependencies installed successfully"

# Check if database is set up
echo "🗄️ Checking database setup..."
if ! python -c "from app.core.database import engine; engine.connect()" 2>/dev/null; then
    echo "⚠️  Database not ready. Please run setup-database.sh first"
    echo "   ./setup-database.sh"
    exit 1
fi

echo "✅ Database connection verified"

# Check for environment variables
echo "🔑 Checking environment variables..."
if [ -z "$NEWS_API_KEY" ]; then
    echo "⚠️  NEWS_API_KEY not set. NewsAPI.org import will be skipped."
    echo "   To enable NewsAPI.org data, add to your .env file:"
    echo "   NEWS_API_KEY=your_api_key_here"
    echo "   Get your free API key at: https://newsapi.org/"
    echo ""
else
    echo "✅ NEWS_API_KEY found"
fi

# Run the import script
echo "📥 Starting real data import..."
python import_real_data.py

echo ""
echo "🎉 Real data import completed!"
echo ""
echo "📊 What was imported:"
echo "   • Real RSS feeds from major news sources"
echo "   • News categories with proper metadata"
echo "   • Recent articles from RSS feeds"
if [ ! -z "$NEWS_API_KEY" ]; then
    echo "   • Recent articles from NewsAPI.org"
fi
echo ""
echo "🔍 To verify the data, run:"
echo "   cd backend"
echo "   python -c \"from app.core.database import SessionLocal; from app.models.article import Article; from app.models.rss_feed import RSSFeed; db = SessionLocal(); print(f'Articles: {db.query(Article).count()}'); print(f'RSS Feeds: {db.query(RSSFeed).count()}'); db.close()\""
echo ""
echo "📚 Next steps:"
echo "   1. Start your application: ./start-local.sh"
echo "   2. Download Kaggle datasets for AI training (see REAL_DATASETS_GUIDE.md)"
echo "   3. Set up NewsAPI.org for additional content"
echo "   4. Implement real-time RSS fetching"
echo ""
echo "✨ Your platform now has real, high-quality data!"
