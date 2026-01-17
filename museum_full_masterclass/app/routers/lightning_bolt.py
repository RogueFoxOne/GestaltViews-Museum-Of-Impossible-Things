from __future__ import annotations

import os
from pathlib import Path

from fastapi import APIRouter, Depends, Header, HTTPException, Query

from ..engines.lightning_bolt import LightningBoltEngine
from ..models.schemas import LightningBoltCaptureRequest, LightningBoltCaptureResponse, LightningBoltListResponse
from ..storage.sqlite_store import SQLiteBoltStore

router = APIRouter(prefix="/api/lightning-bolt", tags=["lightning-bolt"])

def require_api_key(x_api_key: str = Header(None, alias="X-API-Key")):
    expected = os.getenv("API_KEY")
    if expected and x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")

def get_engine() -> LightningBoltEngine:
    db_path = os.getenv("LIGHTNING_BOLT_DB_PATH", "./data/lightning_bolts.db")
    store = SQLiteBoltStore(Path(db_path))
    return LightningBoltEngine(store=store)

@router.post(
    "/capture",
    response_model=LightningBoltCaptureResponse,
    dependencies=[Depends(require_api_key)],
    operation_id="captureLightningBolt",
)
def capture_lightning_bolt(req: LightningBoltCaptureRequest, engine: LightningBoltEngine = Depends(get_engine)):
    bolt = engine.capture(req)
    return LightningBoltCaptureResponse(bolt=bolt)

@router.get(
    "/list",
    response_model=LightningBoltListResponse,
    dependencies=[Depends(require_api_key)],
    operation_id="listLightningBolts",
)
def list_lightning_bolts(
    limit: int = Query(50, ge=1, le=200),
    cursor: str | None = Query(None),
    engine: LightningBoltEngine = Depends(get_engine),
):
    bolts, next_cursor = engine.store.list(limit=limit, cursor=cursor)
    return LightningBoltListResponse(bolts=bolts, next_cursor=next_cursor)
