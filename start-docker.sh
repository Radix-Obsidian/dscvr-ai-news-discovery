#!/bin/bash

# Dscvr AI News Discovery Platform - Docker Startup Script

echo "🐳 Starting Dscvr AI News Discovery Platform with Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "✅ Docker is running"

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose is not installed. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker Compose is available"

# Check if ports are available
check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $port is already in use. $service might not start properly."
        echo "   You can stop the conflicting service or change the port in docker-compose.yml"
    else
        echo "✅ Port $port is available"
    fi
}

echo ""
echo "🔍 Checking port availability..."
check_port 3000 "Frontend"
check_port 8000 "Backend"
check_port 11434 "Ollama"
check_port 6379 "Redis"

echo ""
echo "🚀 Starting services..."

# Start the services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."

# Wait for services to be ready
sleep 10

# Check service status
echo ""
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "🌐 Your application is available at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Ollama: http://localhost:11434"

echo ""
echo "📝 Useful commands:"
echo "   View logs: docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart services: docker-compose restart"
echo "   Access backend: docker-compose exec backend bash"
echo "   Access frontend: docker-compose exec frontend sh"

echo ""
echo "🎉 Setup complete! Happy coding! 🚀"
