#!/usr/bin/env python3
"""
Test script to verify the backend can start locally
"""
import os
import sys

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    """Test if all imports work"""
    try:
        print("Testing imports...")
        from App.main import app
        print("✅ App imported successfully")
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_health_endpoint():
    """Test if health endpoint works"""
    try:
        from App.main import app
        from fastapi.testclient import TestClient
        
        client = TestClient(app)
        response = client.get("/health")
        print(f"✅ Health endpoint: {response.status_code} - {response.json()}")
        return True
    except Exception as e:
        print(f"❌ Health endpoint test failed: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing backend configuration...")
    
    if test_imports():
        test_health_endpoint()
    else:
        sys.exit(1) 