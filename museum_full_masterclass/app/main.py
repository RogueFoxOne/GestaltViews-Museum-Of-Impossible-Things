from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers.lightning_bolt import router as lightning_bolt_router
from .routers.creation_corner import router as creation_corner_router

app = FastAPI(title="GestaltView Actions", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(lightning_bolt_router)
app.include_router(creation_corner_router)

@app.get("/health")
def health():
    return {"ok": True}
