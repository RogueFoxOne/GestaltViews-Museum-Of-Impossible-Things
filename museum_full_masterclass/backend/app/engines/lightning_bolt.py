from __future__ import annotations

import hashlib
import uuid
from dataclasses import dataclass
from datetime import datetime, timezone

from ..models.schemas import LightningBoltCaptureRequest, LightningBoltRecord
from ..storage.sqlite_store import SQLiteBoltStore

def utcnow() -> datetime:
    return datetime.now(timezone.utc)

@dataclass
class LightningBoltEngine:
    store: SQLiteBoltStore

    def _hash(self, s: str) -> str:
        return hashlib.sha256(s.encode("utf-8")).hexdigest()

    def capture(self, req: LightningBoltCaptureRequest) -> LightningBoltRecord:
        created_at = utcnow()
        bolt_id = str(uuid.uuid4())
        sha = self._hash(req.content)
        ip_proof = self._hash(f"{sha}|{created_at.isoformat()}|{bolt_id}")

        record = {
            "id": bolt_id,
            "content": req.content,
            "intensity": int(req.intensity),
            "tags": list(req.tags),
            "context": req.context,
            "source": req.source or "unknown",
            "created_at": created_at.isoformat(),
            "sha256": sha,
            "ip_proof": ip_proof,
            "relevance_score": None,
            "plk_resonance": None,
            "suggested_apps": [],
            "extra": {},
        }
        self.store.insert(record)

        return LightningBoltRecord(
            id=record["id"],
            content=record["content"],
            intensity=record["intensity"],
            tags=record["tags"],
            context=record["context"],
            source=record["source"],
            created_at=created_at,
            sha256=record["sha256"],
            ip_proof=record["ip_proof"],
        )
