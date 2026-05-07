import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import router
from app.rag_routes import rag_router
from app.multilingual_rag import ChatRequest, chat_multilingual

app = FastAPI(
    title="StartupHub AI Backend",
    description="AI Funding Co-Founder for Indian Startups",
    version="1.0.0"
)

# CORS — allow all in dev, restrict to specific origins in production
raw_origins = os.getenv("ALLOWED_ORIGINS", "")
if raw_origins:
    ALLOWED_ORIGINS = [o.strip() for o in raw_origins.split(",") if o.strip()]
else:
    ALLOWED_ORIGINS = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(rag_router)

@app.post("/chat-multilingual")
async def chat_multilingual_endpoint(request: ChatRequest):
    return await chat_multilingual(request)

@app.get("/")
async def root():
    return {"status": "ok", "service": "StartupHub AI Backend"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
