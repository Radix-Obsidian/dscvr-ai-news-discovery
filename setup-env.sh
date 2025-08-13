#!/bin/bash

# Dscvr AI News Discovery Platform - Environment Setup Script
# This script sets up the environment variables for the project

echo "🔧 Setting up environment variables for Dscvr AI News Discovery Platform"
echo "========================================================================"

# Check if .env file already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Creating backup..."
    cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create .env file with PostgreSQL configuration
cat > .env << EOF
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/dscvr_news

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI/ML Services
OPENAI_API_KEY=your-openai-api-key-here
NEWS_API_KEY=c293342f2e5244c8b5a713c43c105ee0

# Ollama Configuration (Local LLM)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2

# Cache configuration
CACHE_TTL=3600
EOF

echo "✅ Environment file created: .env"
echo ""
echo "📝 Next steps:"
echo "1. Edit .env file and update DATABASE_URL with your PostgreSQL credentials"
echo "2. Set your actual SECRET_KEY and API keys"
echo "3. Run: ./setup-postgresql.sh (if not already done)"
echo "4. Run: cd backend && python create_tables.py"
echo "5. Start the application: npm run dev"
