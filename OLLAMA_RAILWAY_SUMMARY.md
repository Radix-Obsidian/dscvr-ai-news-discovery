# Ollama Railway Setup Summary

## What We've Accomplished

✅ **Created separate Railway services** for your Dscvr AI News Discovery Platform:
- **Frontend Service**: Your React application
- **Ollama Service**: AI model service for chat functionality

✅ **Updated configuration files** for Railway deployment:
- `vite.config.ts` - Now uses Railway's PORT environment variable
- `railway.json` - Updated for production deployment
- `package.json` - Added production scripts
- `Dockerfile.ollama` - Optimized for Railway deployment

✅ **Created new services**:
- `src/services/ollamaService.ts` - Frontend service to communicate with Ollama
- `components/AIChatDialog.tsx` - Updated to use real AI responses

✅ **Created deployment tools**:
- `deploy-railway.sh` - Automated deployment script
- `RAILWAY_OLLAMA_SETUP.md` - Comprehensive setup guide

## How It Works

### Architecture
```
┌─────────────────┐    HTTP Requests    ┌─────────────────┐
│   Frontend      │ ──────────────────► │   Ollama        │
│   (React App)   │                     │   (AI Service)  │
│                 │ ◄────────────────── │                 │
└─────────────────┘    AI Responses     └─────────────────┘
```

### Service Communication
1. **Frontend** makes HTTP requests to **Ollama service**
2. **Ollama service** processes AI requests and returns responses
3. **Frontend** displays AI responses in the chat interface

## Quick Deployment Steps

### Option 1: Automated Script
```bash
# Run the deployment script
./deploy-railway.sh
```

### Option 2: Manual Deployment

#### Step 1: Deploy Frontend
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Create new project → Deploy from GitHub
3. Select your repository
4. Set environment variables:
   ```
   VITE_OLLAMA_URL=https://your-ollama-service.railway.app
   ```

#### Step 2: Deploy Ollama Service
1. In your Railway project, click "New Service"
2. Select the same repository
3. Set Dockerfile path: `Dockerfile.ollama`
4. Set environment variables:
   ```
   OLLAMA_MODEL=llama2:7b
   OLLAMA_HOST=0.0.0.0:11434
   OLLAMA_ORIGINS=*
   ```

## Environment Variables

### Frontend Service
```env
VITE_OLLAMA_URL=https://your-ollama-service.railway.app
VITE_API_URL=https://your-backend-service.railway.app (optional)
```

### Ollama Service
```env
OLLAMA_MODEL=llama2:7b
OLLAMA_HOST=0.0.0.0:11434
OLLAMA_ORIGINS=*
```

## Model Options

### Recommended for Railway
- **`llama2:7b`** - Good balance (4GB, fast)
- **`mistral:7b`** - Better performance (4GB)
- **`phi:2.7b`** - Very fast (1.5GB)

### For Better Performance (More Memory)
- **`llama2:13b`** - Better reasoning (8GB)
- **`mistral:13b`** - Excellent performance (8GB)

## Testing Your Setup

1. **Deploy both services** to Railway
2. **Get service URLs** from Railway dashboard
3. **Update environment variables** with actual URLs
4. **Test AI chat**:
   - Open your frontend
   - Navigate to an article
   - Click the AI chat button (🤖)
   - Ask a question

## Troubleshooting

### Common Issues

**❌ Frontend can't connect to Ollama**
- Check `VITE_OLLAMA_URL` environment variable
- Verify Ollama service is running
- Check CORS settings

**❌ Ollama service not starting**
- Check Railway logs
- Verify Dockerfile.ollama exists
- Try a smaller model

**❌ Model download issues**
- Larger models take longer to download
- Check Railway plan memory limits
- Use smaller models for free tier

### Railway Plan Considerations

- **Free Tier**: Limited memory, use small models
- **Pro Plan**: More memory, can handle larger models
- **Usage-Based**: Pay for what you use

## Files Created/Modified

### New Files
- `src/services/ollamaService.ts` - Ollama API service
- `railway-ollama.json` - Ollama service configuration
- `railway-project.json` - Multi-service configuration
- `RAILWAY_OLLAMA_SETUP.md` - Detailed setup guide
- `deploy-railway.sh` - Deployment script
- `OLLAMA_RAILWAY_SUMMARY.md` - This summary

### Modified Files
- `vite.config.ts` - Railway port configuration
- `railway.json` - Production deployment settings
- `package.json` - Production scripts
- `Dockerfile.ollama` - Railway optimization
- `components/AIChatDialog.tsx` - Real AI integration

## Next Steps

1. **Deploy to Railway** using the provided tools
2. **Test the AI chat functionality**
3. **Monitor performance** and costs
4. **Scale up** if needed
5. **Add authentication** for production use

## Support Resources

- **Railway Documentation**: https://docs.railway.app
- **Ollama Documentation**: https://ollama.ai/docs
- **Community Discord**: https://discord.gg/ollama
- **Setup Guide**: `RAILWAY_OLLAMA_SETUP.md`

---

🎉 **You're all set!** Your Dscvr AI News Discovery Platform now has a separate Ollama service ready for Railway deployment.
