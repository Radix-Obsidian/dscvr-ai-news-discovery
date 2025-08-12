#!/bin/bash

# Script to pull Ollama models for local development
# Run this after installing Ollama to set up your models

OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"

echo "🚀 Setting up Ollama models..."

# Pull the default model (llama2:7b - smaller, faster)
echo "📥 Pulling llama2:7b model..."
curl -X POST "${OLLAMA_URL}/api/pull" \
  -H "Content-Type: application/json" \
  -d '{"name": "llama2:7b"}' \
  --max-time 300

# Check if model was pulled successfully
echo "🔍 Checking available models..."
curl -s "${OLLAMA_URL}/api/tags" | jq '.models[]?.name' || echo "No models found"

echo "✅ Ollama setup complete!"
