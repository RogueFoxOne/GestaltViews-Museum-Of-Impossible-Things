from __future__ import annotations

import dataclasses
import json
import logging
import os
import tempfile
from pathlib import Path
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Request, Security, status
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, Field

from context_weaver import weave_search
from loom_orchestrator import MODULE_CONTEXT_MAP, build_context_appendix, parse_bundle_keys


BASE_DIR = Path(__file__).resolve().parent
logger = logging.getLogger("gestaltview.api")


class ContextWeaverRequest(BaseModel):
    query: str = Field(..., min_length=1)
    corpus_id: str | None = None
    top_k: int = Field(8, ge=1, le=50)


class LoomAnalyzeRequest(BaseModel):
    content: str = Field(..., min_length=1)
    loom_module: str | None = None


class ManifestDocument(BaseModel):
    path: str = Field(..., min_length=1)
    content: str = Field(..., min_length=1)


class ManifestSynthesizeRequest(BaseModel):
    documents: list[ManifestDocument] = Field(..., min_length=1)
    model: str = Field("gpt-4o", min_length=1)


api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def configure_logging() -> None:
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(
        level=getattr(logging, log_level, logging.INFO),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )


def get_api_key(api_key: str | None = Security(api_key_header)) -> str:
    expected = os.getenv("API_KEY")
    if not expected:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="API_KEY environment variable is not configured.",
        )
    if not api_key or api_key != expected:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key.",
        )
    return api_key


def _normalize_cors_origins() -> list[str]:
    origins = os.getenv("CORS_ORIGINS", "*")
    if origins.strip() == "*":
        return ["*"]
    return [origin.strip() for origin in origins.split(",") if origin.strip()]


def _ensure_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError("DATABASE_URL is required but not set.")
    return database_url


def _resolve_weaver_db_path(corpus_id: str | None) -> Path:
    configured_path = os.getenv("CONTEXT_WEAVER_DB_PATH")
    if configured_path:
        return Path(configured_path)

    db_dir = Path(os.getenv("CONTEXT_WEAVER_DB_DIR", str(BASE_DIR)))
    filename = f"{corpus_id}.db" if corpus_id else "weaver.db"
    return db_dir / filename


def _load_manifest_module() -> Any:
    manifest_path = BASE_DIR / "GestaltView-Manifest-Index-Layer.py"
    if not manifest_path.exists():
        raise RuntimeError(f"Manifest module not found at {manifest_path}")

    import importlib.util

    spec = importlib.util.spec_from_file_location(
        "gestaltview_manifest_index_layer", manifest_path
    )
    if spec is None or spec.loader is None:
        raise RuntimeError("Unable to load GestaltView Manifest pipeline module")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class SimpleLLMProvider:
    def __init__(self, base_provider: Any):
        self._base_provider = base_provider
        self.model = base_provider.model
        self.max_tokens = base_provider.max_tokens
        self.cfg = base_provider.cfg

    def estimate_tokens(self, text: str) -> int:
        return self._base_provider.estimate_tokens(text)

    def generate(self, prompt: str, temperature: float = 0.7) -> tuple[str, int]:
        content_block = prompt
        if "DOCUMENT:" in prompt:
            content_block = prompt.split("DOCUMENT:", 1)[1]
        content_block = " ".join(content_block.strip().split())
        if not content_block:
            content_block = "No content provided for synthesis."
        summary = content_block[:1200]
        token_count = self.estimate_tokens(summary)
        return summary, token_count


def _build_llm_provider(manifest_module: Any, cfg: Any) -> Any:
    openai_key = os.getenv("OPENAI_API_KEY")
    if openai_key:
        logger.info("Using OpenAIProvider for manifest synthesis.")
        return manifest_module.OpenAIProvider(cfg.llm_model, cfg.max_tokens, cfg)

    logger.warning("OPENAI_API_KEY not set. Falling back to SimpleLLMProvider.")
    return SimpleLLMProvider(manifest_module.LLMProvider(cfg.llm_model, cfg.max_tokens, cfg))


def _write_manifest_documents(temp_root: Path, documents: list[ManifestDocument]) -> None:
    for doc in documents:
        relative_path = Path(doc.path)
        if relative_path.is_absolute() or ".." in relative_path.parts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid document path: {doc.path}",
            )
        target_path = (temp_root / relative_path).resolve()
        if temp_root not in target_path.parents and target_path != temp_root:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Document path escapes corpus root: {doc.path}",
            )
        target_path.parent.mkdir(parents=True, exist_ok=True)
        target_path.write_text(doc.content, encoding="utf-8")


configure_logging()

app = FastAPI(title="GestaltView Context Services", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_normalize_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup() -> None:
    try:
        _ensure_database_url()
    except RuntimeError as exc:
        logger.error("Startup configuration error: %s", exc)
        raise


@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info("Request started", extra={"method": request.method, "path": request.url.path})
    try:
        response = await call_next(request)
    except Exception:
        logger.exception("Unhandled exception")
        raise
    logger.info(
        "Request completed",
        extra={"method": request.method, "path": request.url.path, "status": response.status_code},
    )
    return response


@app.exception_handler(Exception)
async def handle_exception(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled error on %s", request.url.path)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error."},
    )


@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/context-weaver/query")
async def context_weaver_query(
    payload: ContextWeaverRequest,
    _: str = Depends(get_api_key),
) -> dict[str, Any]:
    db_path = _resolve_weaver_db_path(payload.corpus_id)
    try:
        result = weave_search(db_path=db_path, query=payload.query, top_k=payload.top_k)
    except FileNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Context index not found at {db_path}",
        )
    except Exception as exc:
        logger.exception("Context weaver query failed")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Context weaver query failed: {exc}",
        )
    return {"weave_plan": result["weave_plan"], "hits": result["hits"]}


@app.post("/api/loom/analyze")
async def loom_analyze(
    payload: LoomAnalyzeRequest,
    _: str = Depends(get_api_key),
) -> dict[str, list[Any]]:
    module_key = payload.loom_module or "foundation"
    if module_key not in MODULE_CONTEXT_MAP:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown loom module: {module_key}",
        )

    bundle_keys = parse_bundle_keys(os.getenv("LOOM_CONTEXT_BUNDLES"))
    appendix = build_context_appendix(module_key, bundle_keys)
    annotations: list[dict[str, str]] = []
    if payload.content:
        annotations.append({"type": "content", "text": payload.content})
    if appendix:
        annotations.append({"type": "appendix", "text": appendix})

    return {"annotations": annotations}


@app.post("/api/manifest/synthesize")
async def manifest_synthesize(
    payload: ManifestSynthesizeRequest,
    _: str = Depends(get_api_key),
) -> dict[str, Any]:
    database_url = _ensure_database_url()
    manifest_module = _load_manifest_module()

    with tempfile.TemporaryDirectory() as temp_dir:
        temp_root = Path(temp_dir)
        _write_manifest_documents(temp_root, payload.documents)

        manifest_path = temp_root / "manifest_index.json"
        cfg = manifest_module.Config.from_env()
        cfg = dataclasses.replace(
            cfg,
            corpus_root=temp_root,
            manifest_out=manifest_path,
            llm_model=payload.model,
            db_dsn=database_url,
        )

        pipeline = manifest_module.ManifestPipeline(
            cfg,
            llm_provider=_build_llm_provider(manifest_module, cfg),
        )

        try:
            await run_in_threadpool(pipeline.run)
        except Exception as exc:
            logger.exception("Manifest synthesis failed")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Manifest synthesis failed: {exc}",
            )

        if not manifest_path.exists():
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Manifest synthesis did not produce output.",
            )

        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))

    return {
        "corpus_summary": manifest.get("corpus_summary", {}),
        "loom_annotations": manifest.get("loom_annotations", []),
        "metrics": manifest.get("metrics", {}),
    }
