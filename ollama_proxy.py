#!/usr/bin/env python3
"""
Simple proxy server to handle CORS issues when accessing Ollama from browser
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import time

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

OLLAMA_BASE_URL = "http://localhost:11434"

@app.route('/api/tags', methods=['GET'])
def get_models():
    """Proxy for getting available models"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags")
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/show', methods=['POST'])
def show_model():
    """Proxy for getting model information"""
    try:
        data = request.get_json()
        response = requests.post(f"{OLLAMA_BASE_URL}/api/show", json=data)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    """Proxy for chat API"""
    try:
        data = request.get_json()
        response = requests.post(f"{OLLAMA_BASE_URL}/api/chat", json=data)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate():
    """Proxy for generate API"""
    try:
        data = request.get_json()
        response = requests.post(f"{OLLAMA_BASE_URL}/api/generate", json=data)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags")
        if response.status_code == 200:
            return jsonify({"status": "healthy", "ollama": "connected"}), 200
        else:
            return jsonify({"status": "unhealthy", "ollama": "disconnected"}), 500
    except Exception as e:
        return jsonify({"status": "unhealthy", "ollama": "error", "error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting Ollama Proxy Server...")
    print("📍 Proxy URL: http://localhost:5001")
    print("🔗 Ollama URL: http://localhost:11434")
    print("🌐 CORS enabled for browser access")
    app.run(host='0.0.0.0', port=5001, debug=True)
