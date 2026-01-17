from __future__ import annotations

from pathlib import Path
from typing import Iterable
import os


DEFAULT_CONTEXT_BUNDLES: list[str] = ["foundation"]


def _bundle_root() -> Path:
    base_dir = os.getenv("CONTEXT_BUNDLES_DIR", "./context_bundles")
    return Path(base_dir)


def get_bundle_paths(bundle_key: str) -> Iterable[Path]:
    bundle_dir = _bundle_root() / bundle_key
    if not bundle_dir.exists():
        return []
    return [path for path in sorted(bundle_dir.iterdir()) if path.is_file()]
