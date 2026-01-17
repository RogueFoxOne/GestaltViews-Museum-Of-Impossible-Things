from __future__ import annotations

from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
from types import ModuleType


_SOURCE_PATH = Path(__file__).with_name("GestaltView Manifest Index Layer.py")


def _load_source_module() -> ModuleType:
    spec = spec_from_file_location("gestaltview_manifest_index_layer_source", _SOURCE_PATH)
    if spec is None or spec.loader is None:
        raise ImportError(f"Unable to load manifest pipeline from {_SOURCE_PATH}")
    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


_source_module = _load_source_module()

Config = _source_module.Config
LLMProvider = _source_module.LLMProvider
OpenAIProvider = _source_module.OpenAIProvider
ManifestPipeline = _source_module.ManifestPipeline
