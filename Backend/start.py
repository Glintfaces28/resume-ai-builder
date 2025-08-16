import uvicorn
import os
import sys

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from App.main import app
    print("✅ Successfully imported FastAPI app")
except ImportError as e:
    print(f"❌ Failed to import app: {e}")
    sys.exit(1)

if __name__ == "__main__":
    # Railway sets PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    print(f"🔧 Environment: PORT={os.environ.get('PORT', '8000')}")
    print(f"🔧 Environment: FRONTEND_URL={os.environ.get('FRONTEND_URL', 'NOT SET')}")
    
    try:
        uvicorn.run(
            app, 
            host="0.0.0.0", 
            port=port, 
            log_level="info",
            access_log=True
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1) 