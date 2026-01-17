from __future__ import annotations

from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field, conint

# ----------------------------
# Lightning Bolt Capture
# ----------------------------

class LightningBoltCaptureRequest(BaseModel):
    content: str = Field(..., min_length=1, max_length=20000)
    intensity: conint(ge=1, le=10) = Field(...)
    tags: list[str] = Field(default_factory=list)
    context: Optional[str] = None
    source: Optional[str] = "gpt-action"

class LightningBoltRecord(BaseModel):
    id: str
    content: str
    intensity: int
    tags: list[str]
    context: Optional[str] = None
    source: str = "unknown"
    created_at: datetime
    sha256: str
    ip_proof: str
    relevance_score: Optional[float] = None
    plk_resonance: Optional[float] = None
    suggested_apps: list[str] = Field(default_factory=list)
    extra: dict[str, Any] = Field(default_factory=dict)

class LightningBoltCaptureResponse(BaseModel):
    ok: bool = True
    bolt: LightningBoltRecord

class LightningBoltListResponse(BaseModel):
    ok: bool = True
    bolts: list[LightningBoltRecord]
    next_cursor: Optional[str] = None

# ----------------------------
# Creation Corner
# ----------------------------

ArtifactType = Literal[
    "document", "pitch-deck", "mind-map", "image", "video", "poem", "code",
    "essay", "brainstorm", "daily-journey", "emotional-heatmap", "narrative-arc"
]
SynthesisStyle = Literal["convergent", "divergent", "analytical", "revolutionary", "therapeutic"]

class ChaosInput(BaseModel):
    text: str = Field(..., min_length=1, max_length=20000)
    emotional_markers: list[str] = Field(default_factory=list)
    timestamp: Optional[datetime] = None

class CreationCornerSynthesizeRequest(BaseModel):
    inputs: list[ChaosInput] = Field(..., min_length=1)
    artifact_type: ArtifactType
    style: SynthesisStyle = "convergent"
    title: Optional[str] = None
    constraints: dict[str, Any] = Field(default_factory=dict)

class ArtifactMetadata(BaseModel):
    resonance_score: float = 0.0
    tribunal_consensus: str = "unvalidated"
    plk_applied: list[str] = Field(default_factory=list)
    creation_time_ms: int = 0

class Artifact(BaseModel):
    type: ArtifactType
    content: str
    metadata: ArtifactMetadata

class CreationCornerSynthesizeResponse(BaseModel):
    ok: bool = True
    artifact: Artifact
