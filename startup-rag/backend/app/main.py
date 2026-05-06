import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.rag_routes import rag_router
from app.multilingual_rag import ChatRequest, chat_multilingual

app = FastAPI(
    title="Nivesh.ai Backend",
    description="AI Funding Co-Founder for Indian Startups",
    version="1.0.0"
)

# Production-ready CORS configuration
# Note: FastAPI requires exact origin matches - wildcards like *.vercel.app don't work
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5000,http://localhost:5173,http://localhost:5001,https://verse-rho.vercel.app"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if os.getenv("ALLOWED_ORIGINS") else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(rag_router)

@app.post("/chat-multilingual")
async def chat_multilingual_endpoint(request: ChatRequest):
    return await chat_multilingual(request)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)