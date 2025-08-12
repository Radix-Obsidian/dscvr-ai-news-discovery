# Railway Ollama Service Setup Guide

This guide will help you deploy your Dscvr AI News Discovery Platform with Ollama as a separate Railway service.

## Overview

We'll deploy two separate services on Railway:
1. **Frontend Service**: Your React application
2. **Ollama Service**: AI model service for chat functionality

## Prerequisites

- Railway account (https://railway.app)
- GitHub repository with your project
- Railway CLI (optional but recommended)

## Step 1: Deploy the Frontend Service

### Option A: Using Railway Dashboard

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will automatically detect it as a Node.js project
5. Set the following environment variables:
   ```
   OLLAMA_SERVICE_URL=https://your-ollama-service-url.railway.app
   ```

### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Deploy
railway up
```

## Step 2: Deploy the Ollama Service

### Create a New Service for Ollama

1. In your Railway project, click "New Service" → "GitHub Repo"
2. Select the same repository
3. In the service settings, configure:
   - **Build Command**: Leave empty (uses Dockerfile)
   - **Start Command**: Leave empty (uses Dockerfile)
   - **Dockerfile Path**: `Dockerfile.ollama`

### Set Environment Variables for Ollama Service

```
OLLAMA_MODEL=llama2:7b
OLLAMA_HOST=0.0.0.0:11434
OLLAMA_ORIGINS=*
```

## Step 3: Configure Service Communication

### Get Service URLs

1. After deployment, note the URLs for both services:
   - Frontend: `https://your-frontend.railway.app`
   - Ollama: `https://your-ollama.railway.app`

### Update Frontend Environment Variables

In your frontend service, set:
```
VITE_OLLAMA_URL=https://your-ollama.railway.app
```

## Step 4: Test the Setup

1. Visit your frontend URL
2. Navigate to an article
3. Click the AI chat button (🤖)
4. Test with a simple question

## Environment Variables Reference

### Frontend Service Variables
```env
VITE_OLLAMA_URL=https://your-ollama-service.railway.app
VITE_API_URL=https://your-backend-service.railway.app (if you have a backend)
```

### Ollama Service Variables
```env
OLLAMA_MODEL=llama2:7b
OLLAMA_HOST=0.0.0.0:11434
OLLAMA_ORIGINS=*
```

## Model Options

### Recommended Models for Railway

**Small Models (Faster, Less Memory)**
- `llama2:7b` - Good balance of speed and capability
- `mistral:7b` - Often better performance than Llama 2
- `phi:2.7b` - Very fast, good for simple tasks

**Medium Models (Better Performance)**
- `llama2:13b` - Better reasoning, more memory
- `mistral:13b` - Excellent performance
- `codellama:7b` - Good for technical content

**Large Models (Best Performance, Most Memory)**
- `llama2:70b` - Best reasoning (requires significant memory)
- `mistral:70b` - Excellent performance

## Troubleshooting

### Ollama Service Not Starting

1. **Check Logs**: Go to your Ollama service → Logs
2. **Memory Issues**: Try a smaller model
3. **Build Issues**: Check if Dockerfile.ollama is in the root directory

### Frontend Can't Connect to Ollama

1. **Check URLs**: Verify the Ollama service URL is correct
2. **CORS Issues**: Ensure `OLLAMA_ORIGINS=*` is set
3. **Network Issues**: Check if both services are in the same Railway project

### Model Download Issues

1. **Timeout**: Larger models take longer to download
2. **Memory**: Ensure your Railway plan has enough memory
3. **Retry**: The service will retry model downloads automatically

## Cost Optimization

### Railway Pricing Considerations

1. **Free Tier**: Limited resources, suitable for small models
2. **Pro Plan**: More memory and CPU for larger models
3. **Usage-Based**: Pay for what you use

### Model Selection for Cost

- **Free Tier**: Use `llama2:7b` or `phi:2.7b`
- **Pro Plan**: Can handle `llama2:13b` or `mistral:13b`
- **Enterprise**: Can handle the largest models

## Monitoring

### Railway Dashboard

1. **Service Health**: Check service status in Railway dashboard
2. **Logs**: Monitor logs for errors
3. **Metrics**: Track resource usage

### Health Checks

- Frontend: `https://your-frontend.railway.app/`
- Ollama: `https://your-ollama.railway.app/api/tags`

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **Service URLs**: Use Railway's internal networking when possible
3. **CORS**: Configure `OLLAMA_ORIGINS` appropriately
4. **Authentication**: Consider adding API keys for production

## Next Steps

1. **Test thoroughly** with different models
2. **Monitor performance** and costs
3. **Scale up** if needed
4. **Add authentication** for production use
5. **Set up monitoring** and alerts

## Support

- Railway Documentation: https://docs.railway.app
- Ollama Documentation: https://ollama.ai/docs
- Community Discord: https://discord.gg/ollama
