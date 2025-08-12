# Ollama Setup Guide for Dscvr AI News Platform

This guide will help you set up Ollama (local LLM) for the AI chat functionality in your news discovery platform.

## What is Ollama?

Ollama is a free, open-source tool that allows you to run large language models locally on your machine. This means:
- No API costs
- No internet dependency for inference
- Complete privacy
- Multiple model options

## Installation

### macOS
```bash
# Install using Homebrew
brew install ollama

# Or download from https://ollama.ai
```

### Linux
```bash
# Install using curl
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
Download the installer from https://ollama.ai

## Setup Steps

### 1. Start Ollama
```bash
ollama serve
```

### 2. Download a Model
We recommend starting with Llama 2 (7B parameters) for good performance:

```bash
# Download Llama 2 (7B) - ~4GB
ollama pull llama2

# Or try Mistral (7B) - often better performance
ollama pull mistral

# For better performance (but larger size), try Llama 2 (13B)
ollama pull llama2:13b
```

### 3. Test the Installation
```bash
# Test with a simple query
ollama run llama2 "Hello, how are you?"
```

### 4. Configure Your Application

Update your `.env` file in the backend directory:

```env
# Ollama Configuration
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2  # or mistral, codellama, etc.
```

### 5. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

## Model Recommendations

### For MVP (Good Performance, Reasonable Size):
- **Llama 2 (7B)**: ~4GB, good general performance
- **Mistral (7B)**: ~4GB, often better than Llama 2
- **CodeLlama (7B)**: ~4GB, good for technical content

### For Better Performance (Larger Size):
- **Llama 2 (13B)**: ~8GB, better reasoning
- **Mistral (13B)**: ~8GB, excellent performance
- **CodeLlama (13B)**: ~8GB, excellent for technical content

### For Development/Testing (Small Size):
- **Llama 2 (3B)**: ~2GB, faster but less capable
- **Phi-2**: ~1.5GB, Microsoft's small but capable model

## Usage Examples

### Start the Backend
```bash
cd backend
python main.py
```

### Test AI Chat
1. Open your frontend application
2. Navigate to any article
3. Click the AI chat button (🤖 icon)
4. Ask questions about the article

## Troubleshooting

### Ollama Not Starting
```bash
# Check if Ollama is running
ps aux | grep ollama

# Restart Ollama
pkill ollama
ollama serve
```

### Model Not Found
```bash
# List available models
ollama list

# Pull the model again
ollama pull llama2
```

### Performance Issues
- Try a smaller model (3B instead of 7B)
- Close other applications to free up RAM
- Consider using a model with quantization (e.g., `llama2:7b-q4_0`)

### Memory Issues
- Models require significant RAM (4-8GB for 7B models)
- Close other applications
- Use smaller models if needed

## Advanced Configuration

### Custom Model Configuration
Create a `Modelfile` for custom configurations:

```dockerfile
FROM llama2:7b
PARAMETER temperature 0.7
PARAMETER top_p 0.9
SYSTEM "You are a helpful AI assistant for news articles."
```

Build and use:
```bash
ollama create mynews -f Modelfile
ollama run mynews
```

### Environment Variables
You can customize Ollama behavior:

```bash
export OLLAMA_HOST=0.0.0.0:11434  # Allow external connections
export OLLAMA_ORIGINS=*  # Allow CORS
```

## Security Considerations

- Ollama runs locally, so your data stays private
- No data is sent to external servers
- Models are downloaded once and cached locally
- Consider firewall rules if running on a server

## Performance Tips

1. **Use SSD storage** for faster model loading
2. **Allocate sufficient RAM** (8GB+ recommended)
3. **Close unnecessary applications** when running large models
4. **Use quantized models** for better performance (e.g., `llama2:7b-q4_0`)
5. **Consider GPU acceleration** if available (requires CUDA setup)

## Next Steps

Once Ollama is set up:

1. Test the AI chat functionality
2. Try different models to find the best fit
3. Customize the system prompts in `ai_service.py`
4. Consider fine-tuning models for your specific use case

## Support

- Ollama Documentation: https://ollama.ai/docs
- GitHub Issues: https://github.com/ollama/ollama/issues
- Community Discord: https://discord.gg/ollama
