from __future__ import annotations

import os
from fastapi import APIRouter, Depends, Header, HTTPException

from ..engines.creation_corner import CreationCornerEngine
from ..models.schemas import CreationCornerSynthesizeRequest, CreationCornerSynthesizeResponse

router = APIRouter(prefix="/api/creation-corner", tags=["creation-corner"])

def require_api_key(x_api_key: str = Header(None, alias="X-API-Key")):
    expected = os.getenv("API_KEY")
    if expected and x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")

def get_engine() -> CreationCornerEngine:
    return CreationCornerEngine()

@router.post(
    "/synthesize",
    response_model=CreationCornerSynthesizeResponse,
    dependencies=[Depends(require_api_key)],
    operation_id="synthesizeArtifact",
)
def synthesize(req: CreationCornerSynthesizeRequest, engine: CreationCornerEngine = Depends(get_engine)):
    artifact = engine.synthesize(req)
    return CreationCornerSynthesizeResponse(artifact=artifact)

@router.get("/types", dependencies=[Depends(require_api_key)], operation_id="getCreationCornerTypes")
def get_types():
    return {
        "artifact_types": [
            "document", "pitch-deck", "mind-map", "image", "video", "poem", "code",
            "essay", "brainstorm", "daily-journey", "emotional-heatmap", "narrative-arc",
        ],
        "styles": ["convergent", "divergent", "analytical", "revolutionary", "therapeutic"],
    }
