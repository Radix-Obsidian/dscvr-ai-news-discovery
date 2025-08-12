#!/usr/bin/env python3
"""
Docker Environment Test Script
Tests if all services in the Docker environment are running correctly.
"""

import requests
import time
import sys
from urllib.parse import urljoin

def test_service(url, service_name, timeout=10):
    """Test if a service is responding"""
    try:
        response = requests.get(url, timeout=timeout)
        if response.status_code == 200:
            print(f"✅ {service_name}: {url} - OK")
            return True
        else:
            print(f"❌ {service_name}: {url} - Status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ {service_name}: {url} - Error: {e}")
        return False

def test_ollama():
    """Test Ollama API"""
    try:
        response = requests.get("http://localhost:11434/api/tags", timeout=10)
        if response.status_code == 200:
            models = response.json().get('models', [])
            model_names = [model['name'] for model in models]
            print(f"✅ Ollama: http://localhost:11434 - OK (Models: {', '.join(model_names)})")
            return True
        else:
            print(f"❌ Ollama: http://localhost:11434 - Status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Ollama: http://localhost:11434 - Error: {e}")
        return False

def main():
    print("🐳 Testing Docker Environment...")
    print("=" * 50)
    
    # Wait a bit for services to start
    print("⏳ Waiting for services to start...")
    time.sleep(5)
    
    # Test services
    services = [
        ("http://localhost:3000", "Frontend"),
        ("http://localhost:8000/health", "Backend Health"),
        ("http://localhost:8000/docs", "API Documentation"),
    ]
    
    all_passed = True
    
    for url, name in services:
        if not test_service(url, name):
            all_passed = False
    
    # Test Ollama separately
    if not test_ollama():
        all_passed = False
    
    print("=" * 50)
    
    if all_passed:
        print("🎉 All services are running correctly!")
        print("\n🌐 Your application is ready:")
        print("   Frontend: http://localhost:3000")
        print("   Backend API: http://localhost:8000")
        print("   API Docs: http://localhost:8000/docs")
        print("   Ollama: http://localhost:11434")
    else:
        print("❌ Some services failed to start.")
        print("\n🔧 Troubleshooting:")
        print("   1. Check if Docker is running: docker info")
        print("   2. View container logs: docker-compose logs")
        print("   3. Restart services: docker-compose restart")
        print("   4. Rebuild containers: docker-compose build --no-cache")
        sys.exit(1)

if __name__ == "__main__":
    main()
