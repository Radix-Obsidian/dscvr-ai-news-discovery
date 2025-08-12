#!/bin/bash

# Railway Deployment Script for Dscvr AI News Discovery Platform
# This script helps deploy both the frontend and Ollama services

set -e

echo "🚀 Railway Deployment Script for Dscvr AI News Discovery Platform"
echo "================================================================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Please install it first:"
    echo "   npm install -g @railway/cli"
    exit 1
fi

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "❌ You are not logged in to Railway. Please login first:"
    echo "   railway login"
    exit 1
fi

echo "✅ Railway CLI is installed and you are logged in"

# Function to deploy service
deploy_service() {
    local service_name=$1
    local dockerfile_path=$2
    local start_command=$3
    
    echo ""
    echo "📦 Deploying $service_name service..."
    
    # Create new service
    railway service create --name "$service_name"
    
    # Set service configuration
    if [ -n "$dockerfile_path" ]; then
        railway service update --dockerfile "$dockerfile_path"
    fi
    
    if [ -n "$start_command" ]; then
        railway service update --start-command "$start_command"
    fi
    
    echo "✅ $service_name service created successfully"
}

# Function to set environment variables
set_env_vars() {
    local service_name=$1
    shift
    local env_vars=("$@")
    
    echo ""
    echo "🔧 Setting environment variables for $service_name..."
    
    for var in "${env_vars[@]}"; do
        railway variables set "$var" --service "$service_name"
        echo "   Set: $var"
    done
}

# Main deployment process
echo ""
echo "🎯 Starting deployment process..."

# Deploy Frontend Service
deploy_service "dscvr-frontend" "" "npm run preview"

# Set frontend environment variables
frontend_env_vars=(
    "VITE_OLLAMA_URL=https://dscvr-ollama.railway.app"
    "VITE_API_URL=https://dscvr-backend.railway.app"
)

set_env_vars "dscvr-frontend" "${frontend_env_vars[@]}"

# Deploy Ollama Service
deploy_service "dscvr-ollama" "Dockerfile.ollama" ""

# Set Ollama environment variables
ollama_env_vars=(
    "OLLAMA_MODEL=llama2:7b"
    "OLLAMA_HOST=0.0.0.0:11434"
    "OLLAMA_ORIGINS=*"
)

set_env_vars "dscvr-ollama" "${ollama_env_vars[@]}"

echo ""
echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Wait for both services to build and deploy (this may take 5-10 minutes)"
echo "2. Get your service URLs from the Railway dashboard"
echo "3. Update the VITE_OLLAMA_URL in your frontend service with the actual Ollama service URL"
echo "4. Test the AI chat functionality"
echo ""
echo "🔗 Railway Dashboard: https://railway.app/dashboard"
echo ""
echo "📖 For more information, see: RAILWAY_OLLAMA_SETUP.md"
