#!/usr/bin/env python3
"""
Status check script for Dscvr AI News Discovery Platform
"""

import requests
import time

def check_backend():
    """Check if backend is running"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ Backend (Python/FastAPI): Running on http://localhost:8000")
            print(f"   Health: {response.json()}")
            return True
        else:
            print(f"❌ Backend: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Backend: {e}")
        return False

def check_frontend():
    """Check if frontend is running"""
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend (React/TypeScript): Running on http://localhost:3000")
            return True
        else:
            print(f"❌ Frontend: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Frontend: {e}")
        return False

def check_api_docs():
    """Check if API documentation is accessible"""
    try:
        response = requests.get("http://localhost:8000/docs", timeout=5)
        if response.status_code == 200:
            print("✅ API Documentation: Available at http://localhost:8000/docs")
            return True
        else:
            print(f"❌ API Documentation: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API Documentation: {e}")
        return False

def main():
    print("🚀 Dscvr AI News Discovery Platform - Status Check")
    print("=" * 55)
    
    backend_ok = check_backend()
    print()
    
    frontend_ok = check_frontend()
    print()
    
    docs_ok = check_api_docs()
    print()
    
    print("=" * 55)
    if backend_ok and frontend_ok and docs_ok:
        print("🎉 All services are running successfully!")
        print()
        print("📱 Next steps:")
        print("   1. Open http://localhost:3000 in your browser")
        print("   2. Explore the API at http://localhost:8000/docs")
        print("   3. Register a test user and start exploring!")
        print()
        print("🔧 Architecture:")
        print("   • Backend: Python FastAPI with SQLite database")
        print("   • Frontend: React TypeScript with Tailwind CSS")
        print("   • AI Features: OpenAI integration ready")
        print("   • Authentication: JWT-based security")
    else:
        print("⚠️  Some services are not running properly.")
        print("   Check the logs above for details.")

if __name__ == "__main__":
    main()
