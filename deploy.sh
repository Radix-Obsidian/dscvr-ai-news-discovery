#!/bin/bash

# Dscvr AI News Discovery Platform - Deployment Script
# This script helps you deploy the project to GitHub and Vercel

echo "🚀 Dscvr AI News Discovery Platform - Deployment Script"
echo "=================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we have a remote repository
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "📝 No remote repository configured."
    echo "Please create a GitHub repository and add it as origin:"
    echo "git remote add origin https://github.com/yourusername/dscvr-ai-news-discovery.git"
    echo ""
    read -p "Have you created the GitHub repository? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter your GitHub repository URL: " repo_url
        git remote add origin "$repo_url"
        echo "✅ Remote repository added: $repo_url"
    else
        echo "❌ Please create a GitHub repository first."
        exit 1
    fi
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 You have uncommitted changes. Committing them..."
    git add .
    git commit -m "Update: Latest changes before deployment"
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "❌ Failed to push to GitHub. Please check your repository URL and permissions."
    exit 1
fi

echo ""
echo "🎉 GitHub deployment complete!"
echo ""
echo "📋 Next steps for Railway deployment:"
echo "1. Go to https://railway.app and sign in with GitHub"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select your GitHub repository"
echo "4. Railway will automatically detect frontend and backend services"
echo "5. Configure environment variables:"
echo "   - VITE_API_URL: Your backend service URL"
echo "   - OLLAMA_HOST: Your Ollama instance URL"
echo "   - DATABASE_URL: PostgreSQL connection string"
echo "6. Click 'Deploy'"
echo ""
echo "🔧 For detailed setup, see DEPLOYMENT.md"
echo ""
echo "🌐 Your app will be available at: https://your-project.railway.app"
echo ""
echo "Happy deploying! 🚀"
