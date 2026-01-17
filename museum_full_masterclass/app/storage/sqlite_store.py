from __future__ import annotations

import json
import sqlite3
from datetime import datetime
from pathlib import Path
from typing import Any, Optional

_SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS lightning_bolts (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  intensity INTEGER NOT NULL,
  tags_json TEXT NOT NULL,
  context TEXT,
  source TEXT NOT NULL,
  created_at TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  ip_proof TEXT NOT NULL,
  relevance_score REAL,
  plk_resonance REAL,
  suggested_apps_json TEXT NOT NULL,
  extra_json TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lightning_bolts_created_at ON lightning_bolts(created_at DESC);
"""

class SQLiteBoltStore:
    def __init__(self, db_path: str | Path):
        self.db_path = str(db_path)
        Path(self.db_path).parent.mkdir(parents=True, exist_ok=True)
        with self._connect() as conn:
            conn.executescript(_SCHEMA_SQL)
            conn.commit()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def insert(self, record: dict[str, Any]) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                INSERT INTO lightning_bolts (
                  id, content, intensity, tags_json, context, source, created_at,
                  sha256, ip_proof, relevance_score, plk_resonance, suggested_apps_json, extra_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    record["id"],
                    record["content"],
                    int(record["intensity"]),
                    json.dumps(record.get("tags", []), ensure_ascii=False),
                    record.get("context"),
                    record.get("source", "unknown"),
                    record["created_at"],
                    record["sha256"],
                    record["ip_proof"],
                    record.get("relevance_score"),
                    record.get("plk_resonance"),
                    json.dumps(record.get("suggested_apps", []), ensure_ascii=False),
                    json.dumps(record.get("extra", {}), ensure_ascii=False),
                ),
            )
            conn.commit()

    def list(self, limit: int = 50, cursor: Optional[str] = None):
        limit = max(1, min(int(limit), 200))
        q = "SELECT * FROM lightning_bolts "
        params: list[Any] = []
        if cursor:
            q += "WHERE created_at < ? "
            params.append(cursor)
        q += "ORDER BY created_at DESC LIMIT ?"
        params.append(limit + 1)

        with self._connect() as conn:
            rows = conn.execute(q, params).fetchall()

        next_cursor = None
        if len(rows) > limit:
            next_cursor = rows[-1]["created_at"]
            rows = rows[:limit]

        out: list[dict[str, Any]] = []
        for r in rows:
            out.append({
                "id": r["id"],
                "content": r["content"],
                "intensity": int(r["intensity"]),
                "tags": json.loads(r["tags_json"] or "[]"),
                "context": r["context"],
                "source": r["source"],
                "created_at": datetime.fromisoformat(r["created_at"]),
                "sha256": r["sha256"],
                "ip_proof": r["ip_proof"],
                "relevance_score": r["relevance_score"],
                "plk_resonance": r["plk_resonance"],
                "suggested_apps": json.loads(r["suggested_apps_json"] or "[]"),
                "extra": json.loads(r["extra_json"] or "{}"),
            })
        return out, next_cursor
