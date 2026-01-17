# /context_weaver.py
"""
Context Weaver — layered query parsing + local corpus retrieval.


What you get
- Local SQLite indexer with FTS5 (chunks + metadata).
- Query "WeavePlan" generator: intent + 5W1H + layered expansions
  (iteration/evolution, emergence/patterns, significance/implications, ripples).
- Multi-query retrieval fused via Reciprocal Rank Fusion (RRF).


Why this exists
LLMs don't hold nuance across large corpora by brute force. This tool makes
context "walk forward" in layers: intent → evolution → emergence → meaning → ripples,
grounded by who/what/where/when/how and aligned with Manifest-style metadata.


Python: 3.10+
Deps: standard library + PyPDF2 (optional but recommended for PDFs)
"""


from __future__ import annotations


import argparse
import dataclasses
import datetime as dt
import hashlib
import json
import os
import re
import sqlite3
import sys
import textwrap
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple




# ---------------------------
# Models
# ---------------------------


@dataclass(frozen=True)
class FiveW1H:
    who: Optional[str] = None
    what: Optional[str] = None
    where: Optional[str] = None
    when: Optional[str] = None
    how: Optional[str] = None
    confidence: float = 0.0
    evidence: Tuple[str, ...] = ()




@dataclass(frozen=True)
class WeaverLayer:
    name: str
    guiding_questions: Tuple[str, ...]
    expansions: Tuple[str, ...]
    weight: float = 1.0




@dataclass(frozen=True)
class WeavePlan:
    original_query: str
    normalized_query: str
    intent: str
    five_w1h: FiveW1H
    layers: Tuple[WeaverLayer, ...]
    subqueries: Tuple[Tuple[str, float, str], ...]
    """
    subqueries: list of (query_text, weight, layer_name)
    """




@dataclass(frozen=True)
class SearchHit:
    doc_id: str
    chunk_id: int
    score: float
    title: str
    snippet: str
    meta: Dict[str, Any]




# ---------------------------
# Utilities
# ---------------------------


_STOPWORDS = {
    "a", "an", "the", "and", "or", "but", "if", "then", "than", "to", "of", "in", "on", "at", "for",
    "from", "with", "without", "about", "into", "over", "under", "between", "within", "near", "by",
    "is", "are", "was", "were", "be", "been", "being", "it", "this", "that", "these", "those",
    "i", "you", "we", "they", "he", "she", "them", "us", "my", "your", "our", "their",
    "as", "not", "no", "yes", "do", "does", "did", "can", "could", "should", "would",
    "how", "what", "why", "when", "where", "who",
}


_DATE_PATTERNS = [
    re.compile(r"\b(?:19|20)\d{2}\b"),  # year
    re.compile(r"\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b", re.I),
    re.compile(r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b"),
    re.compile(r"\b\d{4}-\d{2}-\d{2}\b"),
    re.compile(r"\b(?:today|yesterday|tomorrow|tonight|this week|next week|last week)\b", re.I),
]


_NAME_PATTERN = re.compile(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b")
_HANDLE_PATTERN = re.compile(r"@[\w_]{2,}")




def stable_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8", errors="ignore")).hexdigest()[:24]




def now_iso() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat()




def chunk_text(text: str, chunk_size: int = 2400, overlap: int = 250) -> List[str]:
    """
    Split text into overlapping chunks.


    Why: overlap helps preserve narrative continuity across chunk boundaries.
    """
    text = text.strip()
    if not text:
        return []
    if len(text) <= chunk_size:
        return [text]


    chunks: List[str] = []
    start = 0
    step = max(1, chunk_size - max(0, overlap))
    while start < len(text):
        end = min(len(text), start + chunk_size)
        chunks.append(text[start:end])
        start += step
    return chunks




def normalize_query(q: str) -> str:
    q = q.strip()
    q = re.sub(r"\s+", " ", q)
    return q




def extract_when(q: str) -> Optional[str]:
    hits: List[str] = []
    for pat in _DATE_PATTERNS:
        hits.extend([m.group(0) for m in pat.finditer(q)])
    if not hits:
        return None
    return ", ".join(dict.fromkeys(hits))  # de-dupe preserving order




def extract_where(q: str) -> Optional[str]:
    # Very lightweight heuristic: capture short phrase after location prepositions.
    m = re.search(r"\b(?:in|at|on|from|near|around)\s+([A-Z][\w-]+(?:\s+[A-Z][\w-]+){0,4})\b", q)
    if m:
        return m.group(1).strip()
    return None




def extract_who(q: str) -> Optional[str]:
    handles = _HANDLE_PATTERN.findall(q)
    names = [m.group(1) for m in _NAME_PATTERN.finditer(q)]
    items = []
    for x in handles + names:
        x = x.strip()
        if x and x.lower() not in _STOPWORDS:
            items.append(x)
    if not items:
        return None
    return ", ".join(dict.fromkeys(items))




def extract_how(q: str) -> Optional[str]:
    m = re.search(r"\b(how to|how do i|ways to|method(?:s)? to|approach(?:es)? to)\b(.+)$", q, re.I)
    if m:
        tail = normalize_query(m.group(2))
        return tail[:220] if tail else m.group(1)
    if q.lower().startswith("how "):
        return q[4:].strip()[:220]
    return None




def extract_what(q: str) -> Optional[str]:
    # crude keyword extraction from remaining tokens
    tokens = re.findall(r"[A-Za-z0-9_'-]{2,}", q)
    kept = [t for t in tokens if t.lower() not in _STOPWORDS]
    if not kept:
        return None
    # keep the most informative-looking tokens
    return " ".join(kept[:18])




def classify_intent(q: str) -> str:
    ql = q.lower()
    rules = [
        ("build", ["build", "implement", "create", "design", "architecture", "tool", "pipeline"]),
        ("debug", ["error", "bug", "fix", "issue", "crash", "traceback", "failing"]),
        ("compare", ["compare", "vs", "versus", "difference", "tradeoff", "pros", "cons"]),
        ("summarize", ["summarize", "tl;dr", "overview", "recap"]),
        ("plan", ["plan", "roadmap", "steps", "milestones"]),
        ("learn", ["explain", "teach", "understand", "what is", "how does"]),
    ]
    for intent, keys in rules:
        if any(k in ql for k in keys):
            return intent
    return "general"




def build_layers(plan_seed: str, five: FiveW1H) -> Tuple[WeaverLayer, ...]:
    """
    Create canonical layers. Expansions are intentionally short — the model/tool can
    grow them later. These seed terms drive multi-pass retrieval.
    """
    base = plan_seed


    intent_layer = WeaverLayer(
        name="intent",
        guiding_questions=(
            "What is the user trying to accomplish right now?",
            "What is the output form: code, decision, explanation, plan?",
        ),
        expansions=(
            base,
            f"{base} requirements",
            f"{base} constraints",
        ),
        weight=1.25,
    )


    iteration_layer = WeaverLayer(
        name="iteration_evolution",
        guiding_questions=(
            "What changed over time? What are versions, iterations, refinements?",
            "What are earlier assumptions that evolved?",
        ),
        expansions=(
            base,
            f"{base} evolution",
            f"{base} iteration",
            f"{base} refinement",
            "timeline changes milestones",
        ),
        weight=1.0,
    )


    emergence_layer = WeaverLayer(
        name="emergence_patterns",
        guiding_questions=(
            "What patterns repeat across the corpus?",
            "What signals emerge when connecting sources?",
        ),
        expansions=(
            base,
            f"{base} pattern",
            f"{base} themes",
            f"{base} emergence",
            "signal trend motif",
        ),
        weight=1.05,
    )


    significance_layer = WeaverLayer(
        name="significance_implications",
        guiding_questions=(
            "Why does this matter? What are the implications?",
            "What decision does this unlock or constrain?",
        ),
        expansions=(
            base,
            f"{base} significance",
            f"{base} implications",
            f"{base} risks",
            f"{base} opportunities",
            "why it matters impact",
        ),
        weight=1.1,
    )


    ripple_layer = WeaverLayer(
        name="ripples_downstream",
        guiding_questions=(
            "What downstream effects follow if this is true/implemented?",
            "What second-order consequences show up elsewhere in the corpus?",
        ),
        expansions=(
            base,
            f"{base} downstream effects",
            f"{base} second-order",
            f"{base} ripple",
            "dependencies externalities",
        ),
        weight=0.95,
    )


    fivew_layer = WeaverLayer(
        name="five_w_one_h",
        guiding_questions=(
            "Who/What/Where/When/How are explicitly involved?",
            "What’s missing and needs disambiguation?",
        ),
        expansions=tuple(x for x in [
            base,
            five.who and f"{base} {five.who}",
            five.where and f"{base} {five.where}",
            five.when and f"{base} {five.when}",
            five.how and f"{base} {five.how}",
        ] if x),
        weight=1.15,
    )


    return (intent_layer, iteration_layer, emergence_layer, significance_layer, ripple_layer, fivew_layer)




def build_weave_plan(query: str) -> WeavePlan:
    q0 = query
    q = normalize_query(query)
    intent = classify_intent(q)


    who = extract_who(q)
    where = extract_where(q)
    when = extract_when(q)
    how = extract_how(q)
    what = extract_what(q)


    evidence: List[str] = []
    for x in [who, where, when, how, what]:
        if x:
            evidence.append(x)


    filled = sum(1 for x in [who, what, where, when, how] if x)
    confidence = min(1.0, filled / 5.0 + 0.15)


    five = FiveW1H(
        who=who,
        what=what,
        where=where,
        when=when,
        how=how,
        confidence=confidence,
        evidence=tuple(evidence[:8]),
    )


    # Plan seed: prefer "what", otherwise raw query.
    seed = what or q
    layers = build_layers(seed, five)


    subqueries: List[Tuple[str, float, str]] = []
    seen = set()
    for layer in layers:
        for exp in layer.expansions:
            expn = normalize_query(exp)
            if expn and expn.lower() not in seen:
                seen.add(expn.lower())
                subqueries.append((expn, layer.weight, layer.name))


    return WeavePlan(
        original_query=q0,
        normalized_query=q,
        intent=intent,
        five_w1h=five,
        layers=layers,
        subqueries=tuple(subqueries),
    )




# ---------------------------
# Corpus IO
# ---------------------------


def iter_corpus_files(corpus_path: Path) -> Iterable[Tuple[str, bytes]]:
    """
    Yield (virtual_path, bytes) for files in a directory or zip.


    Why: keeps indexing the same regardless of storage shape.
    """
    if corpus_path.is_file() and corpus_path.suffix.lower() == ".zip":
        with zipfile.ZipFile(corpus_path, "r") as z:
            for name in z.namelist():
                if name.endswith("/"):
                    continue
                try:
                    data = z.read(name)
                except Exception:
                    continue
                yield (name, data)
        return


    if corpus_path.is_dir():
        for p in corpus_path.rglob("*"):
            if p.is_file():
                try:
                    yield (str(p.relative_to(corpus_path)), p.read_bytes())
                except Exception:
                    continue
        return


    raise ValueError(f"Unsupported corpus_path: {corpus_path}")




def decode_text(data: bytes) -> str:
    for enc in ("utf-8", "utf-8-sig", "cp1252", "latin-1"):
        try:
            return data.decode(enc)
        except Exception:
            continue
    return data.decode("utf-8", errors="ignore")




def extract_text_from_pdf_bytes(data: bytes) -> str:
    """
    Best-effort PDF text extraction.


    Why: avoids OCR; relies on embedded text where possible.
    """
    try:
        from PyPDF2 import PdfReader  # type: ignore
    except Exception:
        return ""


    try:
        import io
        reader = PdfReader(io.BytesIO(data))
        parts: List[str] = []
        for page in reader.pages:
            t = page.extract_text() or ""
            if t.strip():
                parts.append(t)
        return "\n\n".join(parts).strip()
    except Exception:
        return ""




def extract_text(virtual_path: str, data: bytes) -> Tuple[str, Dict[str, Any]]:
    ext = Path(virtual_path).suffix.lower()
    meta = {
        "source_path": virtual_path,
        "ext": ext,
        "indexed_at": now_iso(),
    }


    if ext in {".txt", ".md", ".json", ".csv", ".log"}:
        return decode_text(data), meta
    if ext == ".pdf":
        return extract_text_from_pdf_bytes(data), meta


    # Unknown formats are skipped, but we keep the hook.
    return "", meta




# ---------------------------
# SQLite Index (FTS)
# ---------------------------


SCHEMA_SQL = """
PRAGMA journal_mode=WAL;


CREATE TABLE IF NOT EXISTS docs (
  doc_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source_path TEXT NOT NULL,
  meta_json TEXT NOT NULL
);


CREATE TABLE IF NOT EXISTS chunks (
  doc_id TEXT NOT NULL,
  chunk_id INTEGER NOT NULL,
  text TEXT NOT NULL,
  meta_json TEXT NOT NULL,
  PRIMARY KEY (doc_id, chunk_id),
  FOREIGN KEY (doc_id) REFERENCES docs(doc_id) ON DELETE CASCADE
);
"""




FTS_SQL = """
CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  text,
  doc_id UNINDEXED,
  chunk_id UNINDEXED,
  tokenize='unicode61'
);


CREATE TRIGGER IF NOT EXISTS chunks_ai AFTER INSERT ON chunks BEGIN
  INSERT INTO chunks_fts(text, doc_id, chunk_id) VALUES (new.text, new.doc_id, new.chunk_id);
END;


CREATE TRIGGER IF NOT EXISTS chunks_ad AFTER DELETE ON chunks BEGIN
  DELETE FROM chunks_fts WHERE doc_id = old.doc_id AND chunk_id = old.chunk_id;
END;


CREATE TRIGGER IF NOT EXISTS chunks_au AFTER UPDATE ON chunks BEGIN
  DELETE FROM chunks_fts WHERE doc_id = old.doc_id AND chunk_id = old.chunk_id;
  INSERT INTO chunks_fts(text, doc_id, chunk_id) VALUES (new.text, new.doc_id, new.chunk_id);
END;
"""




def connect_db(db_path: Path) -> sqlite3.Connection:
    con = sqlite3.connect(str(db_path))
    con.row_factory = sqlite3.Row
    return con




def ensure_schema(con: sqlite3.Connection) -> None:
    con.executescript(SCHEMA_SQL)
    try:
        con.executescript(FTS_SQL)
    except sqlite3.OperationalError:
        # FTS5 may be unavailable; we fall back to LIKE search.
        pass
    con.commit()




def has_fts(con: sqlite3.Connection) -> bool:
    try:
        con.execute("SELECT 1 FROM chunks_fts LIMIT 1;").fetchone()
        return True
    except sqlite3.OperationalError:
        return False




def upsert_doc(con: sqlite3.Connection, title: str, source_path: str, meta: Dict[str, Any]) -> str:
    doc_id = stable_hash(source_path)
    con.execute(
        """
        INSERT INTO docs(doc_id, title, source_path, meta_json)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(doc_id) DO UPDATE SET
          title=excluded.title,
          source_path=excluded.source_path,
          meta_json=excluded.meta_json;
        """,
        (doc_id, title, source_path, json.dumps(meta, ensure_ascii=False)),
    )
    return doc_id




def replace_chunks(con: sqlite3.Connection, doc_id: str, chunks: Sequence[str], base_meta: Dict[str, Any]) -> None:
    con.execute("DELETE FROM chunks WHERE doc_id = ?;", (doc_id,))
    for i, ch in enumerate(chunks):
        meta = dict(base_meta)
        meta["chunk_index"] = i
        meta["char_len"] = len(ch)
        con.execute(
            "INSERT INTO chunks(doc_id, chunk_id, text, meta_json) VALUES (?, ?, ?, ?);",
            (doc_id, i, ch, json.dumps(meta, ensure_ascii=False)),
        )




def index_corpus(corpus: Path, db_path: Path, chunk_size: int = 2400, overlap: int = 250) -> None:
    con = connect_db(db_path)
    ensure_schema(con)


    total_docs = 0
    total_chunks = 0


    for vpath, data in iter_corpus_files(corpus):
        text, meta = extract_text(vpath, data)
        if not text.strip():
            continue


        title = Path(vpath).name
        doc_id = upsert_doc(con, title=title, source_path=vpath, meta=meta)
        chunks = chunk_text(text, chunk_size=chunk_size, overlap=overlap)
        if not chunks:
            continue
        replace_chunks(con, doc_id, chunks, base_meta=meta)


        total_docs += 1
        total_chunks += len(chunks)


        if total_docs % 25 == 0:
            con.commit()


    con.commit()
    con.close()


    print(f"Indexed {total_docs} docs, {total_chunks} chunks into {db_path}")




# ---------------------------
# Search
# ---------------------------


def make_snippet(text: str, query: str, width: int = 240) -> str:
    q_tokens = [t for t in re.findall(r"[A-Za-z0-9_'-]{2,}", query) if t.lower() not in _STOPWORDS]
    if not q_tokens:
        return (text[:width] + "…") if len(text) > width else text


    # find earliest match
    lower = text.lower()
    pos = None
    for tok in q_tokens[:12]:
        p = lower.find(tok.lower())
        if p != -1:
            pos = p if pos is None else min(pos, p)
    if pos is None:
        return (text[:width] + "…") if len(text) > width else text


    start = max(0, pos - width // 2)
    end = min(len(text), start + width)
    snippet = text[start:end].replace("\n", " ").strip()
    if start > 0:
        snippet = "…" + snippet
    if end < len(text):
        snippet = snippet + "…"
    return snippet




def fts_search(con: sqlite3.Connection, q: str, limit: int) -> List[sqlite3.Row]:
    # bm25() is supported by FTS5; lower is better, so we negate.
    return con.execute(
        """
        SELECT d.title, c.doc_id, c.chunk_id, c.text, c.meta_json,
               (-bm25(chunks_fts)) AS score
        FROM chunks_fts
        JOIN chunks c ON (c.doc_id = chunks_fts.doc_id AND c.chunk_id = chunks_fts.chunk_id)
        JOIN docs d ON d.doc_id = c.doc_id
        WHERE chunks_fts MATCH ?
        ORDER BY score DESC
        LIMIT ?;
        """,
        (q, limit),
    ).fetchall()




def like_search(con: sqlite3.Connection, q: str, limit: int) -> List[sqlite3.Row]:
    # fallback: LIKE scoring by count of token hits (very rough)
    toks = [t for t in re.findall(r"[A-Za-z0-9_'-]{2,}", q) if t.lower() not in _STOPWORDS][:8]
    if not toks:
        toks = [q[:32]]


    where = " OR ".join(["c.text LIKE ?"] * len(toks))
    params = [f"%{t}%" for t in toks]


    rows = con.execute(
        f"""
        SELECT d.title, c.doc_id, c.chunk_id, c.text, c.meta_json
        FROM chunks c
        JOIN docs d ON d.doc_id = c.doc_id
        WHERE {where}
        LIMIT ?;
        """,
        (*params, limit),
    ).fetchall()


    # score: number of matched tokens
    scored: List[sqlite3.Row] = []
    out: List[Dict[str, Any]] = []
    for r in rows:
        text = (r["text"] or "").lower()
        score = sum(1 for t in toks if t.lower() in text)
        out.append({**dict(r), "score": float(score)})


    # emulate Row objects
    out.sort(key=lambda x: x["score"], reverse=True)
    return [sqlite3.Row(sqlite3.Cursor(con), tuple(x.values())) for x in out[:limit]]  # type: ignore




def run_single_query(con: sqlite3.Connection, q: str, limit: int) -> List[SearchHit]:
    use_fts = has_fts(con)
    rows = fts_search(con, q, limit) if use_fts else like_search(con, q, limit)


    hits: List[SearchHit] = []
    for r in rows:
        meta = json.loads(r["meta_json"]) if r.get("meta_json") else {}
        snippet = make_snippet(r["text"] or "", q)
        hits.append(
            SearchHit(
                doc_id=str(r["doc_id"]),
                chunk_id=int(r["chunk_id"]),
                score=float(r["score"]) if "score" in r.keys() else 0.0,
                title=str(r["title"]),
                snippet=snippet,
                meta=meta,
            )
        )
    return hits




def reciprocal_rank_fusion(
    ranked_lists: Sequence[Tuple[Sequence[SearchHit], float]],
    k: int = 60,
) -> List[SearchHit]:
    """
    RRF: score(doc) = sum(weight / (k + rank))
    Why: robustly merges different query "views" (layers).
    """
    scores: Dict[Tuple[str, int], float] = {}
    payload: Dict[Tuple[str, int], SearchHit] = {}


    for hits, weight in ranked_lists:
        for rank, hit in enumerate(hits, start=1):
            key = (hit.doc_id, hit.chunk_id)
            payload[key] = hit
            scores[key] = scores.get(key, 0.0) + (weight / (k + rank))


    fused = []
    for key, s in scores.items():
        h = payload[key]
        fused.append(dataclasses.replace(h, score=s))
    fused.sort(key=lambda x: x.score, reverse=True)
    return fused




def weave_search(db_path: Path, query: str, top_k: int = 8, per_subquery: int = 12) -> Dict[str, Any]:
    plan = build_weave_plan(query)
    con = connect_db(db_path)
    ensure_schema(con)  # safe; no-op if exists


    ranked_lists: List[Tuple[List[SearchHit], float]] = []
    for subq, weight, layer_name in plan.subqueries:
        try:
            hits = run_single_query(con, subq, limit=per_subquery)
        except Exception:
            hits = []
        # layer weight * mild intent-based bias
        intent_boost = 1.15 if plan.intent == "build" and layer_name in {"intent", "five_w_one_h"} else 1.0
        ranked_lists.append((hits, weight * intent_boost))


    fused = reciprocal_rank_fusion(ranked_lists, k=60)[:top_k]
    con.close()


    return {
        "weave_plan": dataclasses.asdict(plan),
        "hits": [dataclasses.asdict(h) for h in fused],
    }




# ---------------------------
# CLI
# ---------------------------


def cmd_index(args: argparse.Namespace) -> None:
    index_corpus(
        corpus=Path(args.corpus),
        db_path=Path(args.db),
        chunk_size=int(args.chunk_size),
        overlap=int(args.overlap),
    )




def cmd_query(args: argparse.Namespace) -> None:
    result = weave_search(
        db_path=Path(args.db),
        query=args.query,
        top_k=int(args.k),
        per_subquery=int(args.per_subquery),
    )
    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
        return


    plan = result["weave_plan"]
    print(f"Intent: {plan['intent']}")
    five = plan["five_w1h"]
    print(f"5W1H: who={five['who']} | what={five['what']} | where={five['where']} | when={five['when']} | how={five['how']}")
    print("\nTop hits:")
    for i, h in enumerate(result["hits"], start=1):
        print(f"\n{i}. {h['title']}  (doc={h['doc_id']} chunk={h['chunk_id']} score={h['score']:.4f})")
        print(textwrap.fill(h["snippet"], width=96))




def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(prog="context_weaver", description="Layered query parsing + corpus retrieval.")
    sub = p.add_subparsers(dest="cmd", required=True)


    p_index = sub.add_parser("index", help="Index a folder or zip corpus into SQLite.")
    p_index.add_argument("corpus", type=str, help="Path to folder or .zip")
    p_index.add_argument("--db", type=str, default="weaver.db", help="SQLite database path")
    p_index.add_argument("--chunk-size", type=int, default=2400, help="Chunk size in characters")
    p_index.add_argument("--overlap", type=int, default=250, help="Chunk overlap in characters")
    p_index.set_defaults(func=cmd_index)


    p_query = sub.add_parser("query", help="Search via Context Weaver multi-layer retrieval.")
    p_query.add_argument("--db", type=str, default="weaver.db", help="SQLite database path")
    p_query.add_argument("--k", type=int, default=8, help="Top results to return")
    p_query.add_argument("--per-subquery", type=int, default=12, help="Candidates per layer subquery")
    p_query.add_argument("--json", action="store_true", help="Print JSON")
    p_query.add_argument("query", type=str, help="Query text")
    p_query.set_defaults(func=cmd_query)


    return p




def main(argv: Optional[Sequence[str]] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    args.func(args)
    return 0




if __name__ == "__main__":
    raise SystemExit(main())
