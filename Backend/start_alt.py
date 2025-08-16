#!/usr/bin/env python3
"""
Alternative startup script for Railway
"""
import os
import sys

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from App.main import app
    print("✅ Successfully imported main app")
except ImportError as e:
    print(f"❌ Failed to import main app: {e}")
    print("🔄 Trying simple test backend...")
    from test_simple import app
    print("✅ Using simple test backend")

if __name__ == "__main__":
    import uvicorn
    
    # Get port from Railway
    port = int(os.environ.get("PORT", 8000))
    
    print(f"🚀 Starting server on port {port}")
    print(f"🔧 Environment variables:")
    print(f"   PORT: {os.environ.get('PORT', 'NOT SET')}")
    print(f"   FRONTEND_URL: {os.environ.get('FRONTEND_URL', 'NOT SET')}")
    
    try:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="info",
            access_log=True,
            reload=False
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1) 