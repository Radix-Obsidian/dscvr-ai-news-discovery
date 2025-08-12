# Docker Development Environment Setup

This guide will help you set up and use Docker for the Dscvr AI News Discovery Platform development environment.

## 🐳 What This Docker Setup Provides

- **Complete Development Environment**: All services in containers
- **Pre-configured Ollama**: No manual model downloads needed
- **Hot Reloading**: Code changes reflect immediately
- **Consistent Environment**: Works the same on all machines
- **Easy Onboarding**: New developers can start in minutes

## 📋 Prerequisites

1. **Docker Desktop** installed on your machine
   - [Download for macOS](https://docs.docker.com/desktop/install/mac-install/)
   - [Download for Windows](https://docs.docker.com/desktop/install/windows-install/)
   - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)

2. **Docker Compose** (usually included with Docker Desktop)

## 🚀 Quick Start

### 1. Start the Development Environment

```bash
# Start all services
docker-compose up

# Or start in background
docker-compose up -d
```

### 2. Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Ollama**: http://localhost:11434

### 3. Stop the Environment

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clears data)
docker-compose down -v
```

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │     Ollama      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│   (LLM)         │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 11434   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Cache)       │
                       │   Port: 6379    │
                       └─────────────────┘
```

## 🔧 Development Workflow

### Making Code Changes

1. **Frontend Changes**: Edit files in the root directory
   - Changes are automatically reflected in the browser
   - Hot reloading is enabled

2. **Backend Changes**: Edit files in the `backend/` directory
   - FastAPI auto-reloads on code changes
   - Database changes persist in volumes

### Viewing Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs ollama

# Follow logs in real-time
docker-compose logs -f backend
```

### Accessing Containers

```bash
# Access backend container
docker-compose exec backend bash

# Access frontend container
docker-compose exec frontend sh

# Access Ollama container
docker-compose exec ollama bash
```

## 🗄️ Database Management

### SQLite Database
- Located in `backend/database/` (mounted as volume)
- Persists between container restarts
- Can be accessed from host machine

### Redis Cache
- Runs in separate container
- Data persists in Docker volume
- Used for caching and Celery tasks

## 🤖 AI Chat Setup

### Pre-downloaded Models
The Docker setup includes:
- **llama2:7b** (~4GB) - Good general performance
- **mistral:7b** (~4GB) - Often better than Llama 2

### Adding More Models
```bash
# Access Ollama container
docker-compose exec ollama bash

# Download additional models
ollama pull codellama:7b
ollama pull llama2:13b
```

### Model Configuration
Update the environment variable in `docker-compose.yml`:
```yaml
environment:
  - OLLAMA_MODEL=mistral:7b  # Change default model
```

## 🔍 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   lsof -i :3000
   lsof -i :8000
   
   # Stop conflicting services
   docker-compose down
   ```

2. **Container Won't Start**
   ```bash
   # Check container logs
   docker-compose logs [service-name]
   
   # Rebuild containers
   docker-compose build --no-cache
   ```

3. **Ollama Models Not Loading**
   ```bash
   # Check Ollama status
   docker-compose exec ollama ollama list
   
   # Restart Ollama service
   docker-compose restart ollama
   ```

4. **Database Issues**
   ```bash
   # Reset database (WARNING: loses data)
   docker-compose down -v
   docker-compose up
   ```

### Performance Issues

1. **Slow Build Times**
   - Ensure Docker has sufficient resources (4GB+ RAM)
   - Use SSD storage for better performance

2. **Memory Issues**
   - Increase Docker memory allocation
   - Close other applications

## 🔄 Migration from Local Setup

### Keeping Your Current Setup
Your existing local setup remains unchanged. You can:
- Continue using local Python/Node.js setup
- Switch to Docker when convenient
- Use both setups in parallel

### Environment Variables
The Docker setup uses these environment variables:
```env
# Backend
DATABASE_URL=sqlite:///./database/dscvr_news.db
OLLAMA_HOST=http://ollama:11434
OLLAMA_MODEL=llama2:7b
REDIS_URL=redis://redis:6379

# Frontend
VITE_API_URL=http://localhost:8000
```

## 📊 Monitoring

### Health Checks
All services include health checks:
- Backend: http://localhost:8000/health
- Redis: Automatic ping check
- Ollama: API endpoint check

### Resource Usage
```bash
# View container resource usage
docker stats

# View disk usage
docker system df
```

## 🚀 Production Considerations

This setup is optimized for development. For production:

1. **Use production Dockerfiles** (separate from development)
2. **Implement proper logging** (ELK stack, etc.)
3. **Add monitoring** (Prometheus, Grafana)
4. **Use production database** (PostgreSQL instead of SQLite)
5. **Implement CI/CD** (GitHub Actions, etc.)

## 📚 Additional Commands

### Useful Docker Commands

```bash
# Rebuild specific service
docker-compose build backend

# Restart specific service
docker-compose restart frontend

# View running containers
docker-compose ps

# Clean up unused resources
docker system prune

# View container details
docker-compose exec backend python --version
```

### Development Tips

1. **Use VS Code with Docker extension** for better development experience
2. **Set up debugging** in containers for breakpoint debugging
3. **Use Docker volumes** for persistent data
4. **Monitor logs** during development for quick debugging

## 🆘 Getting Help

If you encounter issues:

1. Check the troubleshooting section above
2. View container logs: `docker-compose logs [service]`
3. Check Docker Desktop status
4. Restart Docker Desktop if needed
5. Create an issue in the repository

---

**Happy coding with Docker! 🐳**
