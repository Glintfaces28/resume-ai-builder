#!/usr/bin/env python3
"""
Railway debug script to identify port and routing issues
"""
import os
import sys
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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
def root(request: Request):
    return JSONResponse({
        "status": "ok",
        "message": "Railway debug backend is running",
        "port": os.environ.get("PORT", "NOT SET"),
        "host": request.headers.get("host", "NOT SET"),
        "url": str(request.url),
        "method": request.method
    })

@app.get("/health")
def health():
    return JSONResponse({"status": "ok", "message": "Health check passed"})

@app.get("/api/health")
def api_health():
    return JSONResponse({"status": "ok", "message": "API health check"})

@app.get("/debug")
def debug(request: Request):
    return JSONResponse({
        "status": "ok",
        "environment": {
            "PORT": os.environ.get("PORT", "NOT SET"),
            "FRONTEND_URL": os.environ.get("FRONTEND_URL", "NOT SET"),
            "RAILWAY_ENVIRONMENT": os.environ.get("RAILWAY_ENVIRONMENT", "NOT SET"),
            "RAILWAY_PROJECT_ID": os.environ.get("RAILWAY_PROJECT_ID", "NOT SET")
        },
        "request": {
            "host": request.headers.get("host", "NOT SET"),
            "url": str(request.url),
            "method": request.method,
            "headers": dict(request.headers)
        }
    })

if __name__ == "__main__":
    import uvicorn
    
    # Get port from Railway
    port = int(os.environ.get("PORT", 8000))
    
    print(f"🔍 Railway Debug Backend")
    print(f"🚀 Starting on port {port}")
    print(f"🔧 Environment variables:")
    print(f"   PORT: {os.environ.get('PORT', 'NOT SET')}")
    print(f"   FRONTEND_URL: {os.environ.get('FRONTEND_URL', 'NOT SET')}")
    print(f"   RAILWAY_ENVIRONMENT: {os.environ.get('RAILWAY_ENVIRONMENT', 'NOT SET')}")
    
    try:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=port,
            log_level="debug",
            access_log=True
        )
    except Exception as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1) 