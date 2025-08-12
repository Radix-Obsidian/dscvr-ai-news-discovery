# Deployment Guide

This guide will help you deploy the Dscvr AI News Discovery Platform to GitHub and Vercel.

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

### 3. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `VITE_API_URL`: Your backend API URL (e.g., `https://your-backend.railway.app`)

6. Click "Deploy"

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

1. Go to [Railway](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure the project:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python main.py`

5. Add Environment Variables:
   ```
   OLLAMA_HOST=https://your-ollama-instance.com
   OLLAMA_MODEL=llama2
   DATABASE_URL=postgresql://...
   ```

6. Deploy and get your backend URL

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

## 🔗 Connect Frontend to Backend

1. Update the `VITE_API_URL` environment variable in Vercel with your backend URL
2. Redeploy the frontend if needed

## 🌐 Custom Domain (Optional)

1. In Vercel dashboard, go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Configure DNS settings as instructed

## 🔒 Environment Variables

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (Railway/Render)
```
OLLAMA_HOST=https://your-ollama-instance.com
OLLAMA_MODEL=llama2
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
```

## 📊 Monitoring

- **Vercel**: Built-in analytics and performance monitoring
- **Railway**: Logs and metrics in dashboard
- **Render**: Application logs and health checks

## 🔄 Continuous Deployment

Both Vercel and Railway/Render will automatically deploy when you push to the main branch.

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**: Check build logs for missing dependencies
2. **API Connection**: Verify `VITE_API_URL` is correct
3. **CORS Errors**: Ensure backend CORS is configured for your frontend domain
4. **Database Issues**: Check database connection string and permissions

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
