"""Ollama adapter template.
Assumes Ollama HTTP API is available (default: http://localhost:11434).
Set OLLAMA_BASE_URL env var to override.
"""
import os, requests
from typing import Optional, Dict, Any

OLLAMA_BASE = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')

class OllamaAdapter:
    def __init__(self, base_url: Optional[str] = None, model: str = 'llama2'):
        self.base = base_url or OLLAMA_BASE
        self.model = model

    def generate(self, prompt: str, **kwargs) -> Dict[str, Any]:
        url = f"{self.base}/api/generate"
        payload = {'model': self.model, 'prompt': prompt, 'max_tokens': kwargs.get('max_tokens', 512)}
        try:
            resp = requests.post(url, json=payload, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            return {'status': 'ok', 'response': data.get('text', '') if isinstance(data, dict) else str(data), 'raw': data}
        except Exception as e:
            return {'error': 'request_failed', 'exception': str(e)}
