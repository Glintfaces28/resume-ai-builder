#!/usr/bin/env python3
"""
Main entry point for Railway deployment
"""
from App.main import app

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting Resume AI Builder backend on port {port}")
    uvicorn.run(app, host="0.0.0.0", port=port) 