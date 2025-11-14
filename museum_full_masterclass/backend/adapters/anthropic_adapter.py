"""Anthropic adapter template.
Set ANTHROPIC_API_KEY in env. This shows how to call Claude-style endpoints.
"""
import os, requests
from typing import Optional, Dict, Any

ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')

class AnthropicAdapter:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or ANTHROPIC_API_KEY

    def generate(self, prompt: str, **kwargs) -> Dict[str, Any]:
        if not self.api_key:
            return {'error': 'missing_api_key', 'provider': 'anthropic'}
        url = 'https://api.anthropic.com/v1/complete'
        headers = {'x-api-key': self.api_key, 'Content-Type': 'application/json'}
        body = {
            'model': kwargs.get('model', 'claude-v1'),
            'prompt': prompt,
            'max_tokens_to_sample': kwargs.get('max_tokens', 512)
        }
        try:
            resp = requests.post(url, headers=headers, json=body, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            return {'status': 'ok', 'response': data.get('completion', ''), 'raw': data}
        except Exception as e:
            return {'error': 'request_failed', 'exception': str(e)}
