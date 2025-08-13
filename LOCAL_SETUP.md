# 🚀 Local Development Setup - Dscvr AI News Discovery Platform

## Prerequisites

### 1. Install Node.js (v18 or higher)
```bash
# macOS (using Homebrew)
brew install node

# Or download from https://nodejs.org/
```

### 2. Install Python (3.11 or higher)
```bash
# macOS (using Homebrew)
brew install python@3.11

# Or download from https://www.python.org/
```

### 3. Install Ollama (for AI features)
```bash
# macOS
curl -fsSL https://ollama.ai/install.sh | sh

# Or download from https://ollama.ai/
```

## 🛠️ Setup Instructions

### Step 1: Clone and Navigate to Project
```bash
cd "Dscvr AI News Discovery Platform"
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

### Step 3: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Step 4: Download AI Models
```bash
# Download the default model (llama2:7b - ~4GB)
ollama pull llama2:7b

# Optional: Download additional models
ollama pull mistral:7b
ollama pull codellama:7b
```

### Step 5: Set Up Environment Variables

Create `.env` file in the root directory:
```env
# Frontend Environment Variables
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://itmtexyyxpzddlutxoyxxs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bXRleHl4cHpkZGx1dHhveHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzQ0NzYsImV4cCI6MjA3MDU1MDQ3Nn0.NjMkMu-fWYX8dF_eHUwDM2Mq4k1MexFTfXa4iGI-vYs
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama2
```

Create `.env` file in the `backend/` directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/dscvr_news

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
```

## 🚀 Running the Application

### Option 1: Run Everything Manually

#### Terminal 1: Start Ollama
```bash
ollama serve
```

#### Terminal 2: Start Backend
```bash
cd backend
python main.py
```

#### Terminal 3: Start Frontend
```bash
npm run dev
```

### Option 2: Use the Convenience Script

Create a startup script:
```bash
# Create start-local.sh
cat > start-local.sh << 'EOF'
#!/bin/bash

echo "🚀 Starting Dscvr AI News Discovery Platform..."

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "🤖 Starting Ollama..."
    ollama serve &
    sleep 5
fi

# Start backend
echo "🔧 Starting Backend..."
cd backend
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend
echo "🎨 Starting Frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ All services started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "🤖 Ollama: http://localhost:11434"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for interrupt
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
EOF

chmod +x start-local.sh
```

Then run:
```bash
./start-local.sh
```

## 📱 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Ollama API**: http://localhost:11434

## 🔧 Development Workflow

### Making Changes
1. **Frontend**: Edit files in the root directory - changes auto-reload
2. **Backend**: Edit files in `backend/` - FastAPI auto-reloads
3. **AI Models**: Use Ollama commands to manage models

### Useful Commands
```bash
# View Ollama models
ollama list

# Test AI model
ollama run llama2:7b "Hello, how are you?"

# View backend logs
cd backend && python main.py

# View frontend logs
npm run dev

# Install new dependencies
npm install <package-name>  # Frontend
cd backend && pip install <package-name>  # Backend
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :8000  # Backend
lsof -i :3000  # Frontend
lsof -i :11434 # Ollama

# Kill the process
kill -9 <PID>
```

### Ollama Issues
```bash
# Restart Ollama
pkill ollama
ollama serve

# Check model status
ollama list
ollama pull llama2:7b  # Re-download if needed
```

### Python Issues
```bash
# Create virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # On macOS/Linux
pip install -r requirements.txt
```

### Node.js Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Production Deployment

When you're ready to deploy to production:

1. **Frontend**: Build with `npm run build` and deploy to any static hosting service
2. **Backend**: Deploy to any Python hosting service (Heroku, DigitalOcean, etc.)
3. **Database**: Set up a production database (PostgreSQL, MySQL, etc.)
4. **AI Service**: Deploy Ollama to a cloud service or use a hosted AI API

## 📊 Local Development Benefits

Your local development environment provides:
- ✅ **Fast startup** (no container overhead)
- ✅ **Better performance** (no virtualization)
- ✅ **Easy debugging** (direct access to processes)
- ✅ **Simplified development** (fewer moving parts)
- ✅ **Reduced complexity** (no orchestration needed)

## 🎉 You're All Set!

Your development environment is now simplified and ready to use. The application maintains all functionality while being much easier to work with locally.
