#!/usr/bin/env python3
"""
Main entry point for Railway deployment
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
        "message": "Railway backend is running",
        "port": os.environ.get("PORT", "NOT SET"),
        "host": request.headers.get("host", "NOT SET"),
        "url": str(request.url)
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
            "RAILWAY_ENVIRONMENT": os.environ.get("RAILWAY_ENVIRONMENT", "NOT SET")
        },
        "request": {
            "host": request.headers.get("host", "NOT SET"),
            "url": str(request.url),
            "method": request.method
        }
    })

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting Railway backend on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 