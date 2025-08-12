# Ollama Local Setup

This directory contains configuration for running Ollama locally for AI inference capabilities.

## 🚀 Quick Setup

1. **Install Ollama:**
   - Download from [ollama.ai](https://ollama.ai)
   - Install and start the service

2. **Pull Models:**
   ```bash
   # Pull the default model
   ollama pull llama2
   
   # Or pull specific models
   ollama pull llama2:7b
   ollama pull mistral:7b
   ```

3. **Test the Service:**
   ```bash
   # Start Ollama
   ollama serve
   
   # Test in another terminal
   curl http://localhost:11434/api/tags
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
- Logs available in your terminal
- Model status: `/api/tags`

## 💡 Usage

For local development, your backend connects to:
```
http://localhost:11434
```

Update your backend environment variable:
```
OLLAMA_HOST=http://localhost:11434
```
