# Ollama Service for Railway

This service provides AI inference capabilities using Ollama on Railway.

## 🚀 Quick Setup

1. **Deploy to Railway:**
   - Go to [Railway](https://railway.app)
   - Create new project from GitHub repo
   - Select this `ollama/` directory
   - Railway will automatically build and deploy

2. **Pull Models:**
   After deployment, pull the models you need:
   ```bash
   # Connect to your Railway Ollama service
   curl -X POST https://your-ollama-service.railway.app/api/pull \
     -H "Content-Type: application/json" \
     -d '{"name": "llama2"}'
   ```

3. **Test the Service:**
   ```bash
   curl https://your-ollama-service.railway.app/api/tags
   ```

## 📋 Available Models

- `llama2` - General purpose model
- `llama2:7b` - Smaller, faster version
- `llama2:13b` - Larger, more capable version
- `mistral` - Alternative model
- `codellama` - Code-focused model

## 🔧 Environment Variables

- `OLLAMA_HOST=0.0.0.0` - Bind to all interfaces
- `OLLAMA_ORIGINS=*` - Allow all origins (for development)

## 📊 Monitoring

- Health check endpoint: `/api/tags`
- Logs available in Railway dashboard
- Model status: `/api/tags`

## 💡 Usage

Once deployed, your backend can connect to:
```
https://your-ollama-service.railway.app
```

Update your backend environment variable:
```
OLLAMA_HOST=https://your-ollama-service.railway.app
```
