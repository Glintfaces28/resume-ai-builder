#!/usr/bin/env python3
"""
Simple test backend to verify Railway deployment
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os

app = FastAPI(title="Test Backend")

# Simple CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return JSONResponse(
        status_code=200,
        content={
            "message": "Test Backend Running", 
            "status": "ok", 
            "railway": "health_check",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    )

@app.get("/health")
def health():
    return JSONResponse(
        status_code=200,
        content={"status": "ok", "message": "Health check passed"}
    )

@app.get("/api/health")
def api_health():
    return JSONResponse(
        status_code=200,
        content={"status": "ok", "message": "API health check"}
    )

@app.get("/railway-health")
def railway_health():
    return JSONResponse(
        status_code=200,
        content={"status": "ok", "railway": "health_check_passed"}
    )

@app.get("/test")
def test():
    return JSONResponse(
        status_code=200,
        content={
            "message": "Test endpoint working",
            "port": os.environ.get("PORT", "8000"),
            "frontend_url": os.environ.get("FRONTEND_URL", "NOT SET")
        }
    )

# Add a simple ping endpoint
@app.get("/ping")
def ping():
    return JSONResponse(
        status_code=200,
        content={"pong": "ok"}
    )

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting test server on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 