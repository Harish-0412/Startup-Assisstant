# Deployment-Ready Startup Script for Render
import os

def main():
    port = int(os.getenv("PORT", "8000"))
    print(f"Starting Nivesh.ai Backend on port {port}...")
    
    # Verify critical environment variables
    if not os.getenv("GEMINI_API_KEY"):
        print("WARNING: GEMINI_API_KEY not set. Running in demo mode.")
    else:
        print("✓ GEMINI_API_KEY configured")
    
    # Start uvicorn
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        log_level="info",
        access_log=True
    )

if __name__ == "__main__":
    main()
