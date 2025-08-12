FROM ollama/ollama:latest

# Expose the Ollama API port
EXPOSE 11434

# Set environment variables
ENV OLLAMA_HOST=0.0.0.0
ENV OLLAMA_ORIGINS=*

# Create a directory for models
RUN mkdir -p /root/.ollama

# Copy any custom models or configurations
COPY models/ /root/.ollama/models/

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:11434/api/tags || exit 1

# Start Ollama
CMD ["ollama", "serve"]
