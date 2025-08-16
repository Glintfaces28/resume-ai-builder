#!/usr/bin/env python3
"""
Railway-specific startup script
"""
import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Create the app
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "message": "Railway backend is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/health")
def api_health():
    return {"status": "ok", "message": "API health check"}

@app.get("/ping")
def ping():
    return {"pong": "ok"}

if __name__ == "__main__":
    import uvicorn
    
    # Railway sets PORT environment variable
    port = int(os.environ.get("PORT", 8000))
    
    print(f"🚀 Starting Railway backend on port {port}")
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