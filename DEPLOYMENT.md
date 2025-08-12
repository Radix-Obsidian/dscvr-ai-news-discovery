# Deployment Guide

This guide will help you deploy the Dscvr AI News Discovery Platform to GitHub and Railway.

## 🚀 Quick Deployment

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `dscvr-ai-news-discovery` or your preferred name
3. Make it public or private (your choice)
4. Don't initialize with README, .gitignore, or license (we already have these)

### 2. Push to GitHub

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Dscvr AI News Discovery Platform"

# Add remote repository (replace with your GitHub URL)
git remote add origin https://github.com/yourusername/dscvr-ai-news-discovery.git

# Push to GitHub
git push -u origin main
```

### 3. Deploy to Railway

1. Go to [Railway](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your GitHub repository
4. Railway will automatically detect services:
   - **Frontend Service**: Root directory, build command: `npm run build`
   - **Backend Service**: `backend/` directory, start command: `python main.py`
   - **Ollama Service**: `ollama/` directory (optional, for AI features)
5. Add Environment Variables (see Environment Variables section below)
6. Click "Deploy"

### 4. Set up Ollama (Optional but Recommended)

1. **Deploy Ollama Service:**
   - In Railway dashboard, click "New Service" → "GitHub Repo"
   - Select your repository and choose the `ollama/` directory
   - Railway will build and deploy the Ollama service

2. **Pull AI Models:**
   After Ollama deployment, run this command to pull the model:
   ```bash
   curl -X POST https://your-ollama-service.railway.app/api/pull \
     -H "Content-Type: application/json" \
     -d '{"name": "llama2:7b"}'
   ```

3. **Test Ollama:**
   ```bash
   curl https://your-ollama-service.railway.app/api/tags
   ```

## 🔧 Railway Configuration

### Frontend Service
- **Root Directory**: `/` (root of repository)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Backend Service
- **Root Directory**: `backend/`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python main.py`
- **Port**: `8000` (Railway will auto-detect)

### Option 2: Render

1. Go to [Render](https://render.com) and sign in with GitHub
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `dscvr-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`

5. Add environment variables and deploy

### Option 3: Heroku

1. Create a `Procfile` in the backend directory:
   ```
   web: python main.py
   ```

2. Deploy using Heroku CLI or GitHub integration

## 🔗 Railway Services Communication

Railway will automatically handle communication between frontend and backend services. The frontend will be able to reach the backend using the internal Railway network.

## 🌐 Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## 🔒 Environment Variables

### Frontend Service (Railway)
```
VITE_API_URL=https://your-backend-service.railway.app
```

### Backend Service (Railway)
```
OLLAMA_HOST=https://your-ollama-service.railway.app
OLLAMA_MODEL=llama2:7b
DATABASE_URL=postgresql://...
SECRET_KEY=d3b4a16f2c6521073a2c729a26f036d8769406767d5501720041c727f0628a95
PORT=8000
```

### Ollama Service (Railway)
```
OLLAMA_HOST=0.0.0.0
OLLAMA_ORIGINS=*
```

## 📊 Monitoring

- **Railway**: Built-in logs, metrics, and performance monitoring
- **Real-time logs**: View application logs in real-time
- **Health checks**: Automatic health monitoring
- **Metrics**: CPU, memory, and network usage

## 🔄 Continuous Deployment

Railway will automatically deploy when you push to the main branch.

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**: Check Railway build logs for missing dependencies
2. **Service Communication**: Verify internal Railway network communication
3. **CORS Errors**: Ensure backend CORS is configured for Railway domains
4. **Database Issues**: Check database connection string and permissions
5. **Port Issues**: Ensure backend listens on `PORT` environment variable

### Debug Commands

```bash
# Check build locally
npm run build

# Test backend locally
cd backend
python main.py

# Check environment variables
echo $VITE_API_URL
```

## 📈 Performance Optimization

1. **Frontend**: Enable Vercel's edge caching
2. **Backend**: Use connection pooling for database
3. **Images**: Optimize images and use CDN
4. **Bundle**: Analyze bundle size with `npm run build --analyze`

## 🔐 Security

1. Use HTTPS for all API calls
2. Set secure environment variables
3. Enable CORS properly
4. Use rate limiting on API endpoints
5. Regular dependency updates

## 📞 Support

If you encounter issues:
1. Check the deployment logs
2. Verify environment variables
3. Test locally first
4. Open an issue on GitHub

---

**Happy Deploying! 🚀**
