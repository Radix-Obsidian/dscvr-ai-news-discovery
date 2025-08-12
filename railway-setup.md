# Railway Deployment Setup Guide

## Prerequisites
- GitHub account
- Railway account (free at railway.app)

## Step 1: Deploy Backend

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Python backend

### Backend Environment Variables
Add these in Railway dashboard → Variables:

```
OLLAMA_HOST=https://your-ollama-instance.com
OLLAMA_MODEL=llama2
SECRET_KEY=your-secret-key-here
PORT=8000
```

### Add Database
1. In Railway project → "New" → "Database" → "PostgreSQL"
2. Railway auto-sets `DATABASE_URL`

## Step 2: Deploy Frontend

1. Same Railway project → "New" → "GitHub Repo"
2. Select same repository
3. Set root directory to `/` (leave empty)

### Frontend Environment Variables
Add in Railway dashboard → Variables:

```
VITE_API_URL=https://your-backend-service-name.railway.app
```

## Step 3: Get Service URLs

1. Railway dashboard shows service URLs
2. Backend URL: `https://your-backend-name.railway.app`
3. Frontend URL: `https://your-frontend-name.railway.app`

## Step 4: Update Variables

1. Copy your backend URL
2. Update frontend `VITE_API_URL` with backend URL
3. Copy your Ollama service URL
4. Update backend `OLLAMA_HOST` with Ollama URL

## Step 5: Test Deployment

1. Visit your frontend URL
2. Test the app functionality
3. Check Railway logs if issues

## Troubleshooting

- Check Railway logs for errors
- Verify environment variables are set correctly
- Ensure service URLs are accessible
- Check CORS settings if frontend can't connect to backend
