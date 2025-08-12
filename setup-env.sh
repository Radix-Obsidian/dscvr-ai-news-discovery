#!/bin/bash

echo "🔧 Setting up environment variables for Dscvr AI News Discovery Platform..."

# Create root .env file
cat > .env << 'EOF'
# Frontend Environment Variables
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://itmtexyyxpzddlutxoyxxs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bXRleHl4cHpkZGx1dHhveHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzQ0NzYsImV4cCI6MjA3MDU1MDQ3Nn0.NjMkMu-fWYX8dF_eHUwDM2Mq4k1MexFTfXa4iGI-vYs
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama2
EOF

# Create backend .env file
cat > backend/.env << 'EOF'
# Database Configuration
DATABASE_URL=sqlite:///./database/dscvr_news.db

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Origins
BACKEND_CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173

# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2:7b

# Cache Configuration
CACHE_TTL=3600
EOF

echo "✅ Environment files created!"
echo "📁 .env (root directory)"
echo "📁 backend/.env"
echo ""
echo "🔐 Remember to change the SECRET_KEY in backend/.env for production!"
