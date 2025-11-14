"""OpenAI adapter template.
Usage: set OPENAI_API_KEY in env and call OpenAIAdapter.generate(prompt).
This file provides a ready-to-fill synchronous implementation using 'requests'.
"""
import os
import json
from typing import Optional, Dict, Any
import requests

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

class OpenAIAdapter:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or OPENAI_API_KEY

    def generate(self, prompt: str, **kwargs) -> Dict[str, Any]:
        """Call OpenAI's completion/chat endpoint.
        This is a template — uncomment and adapt to the specific API version you use.
        """
        if not self.api_key:
            return {'error': 'missing_api_key', 'provider': 'openai'}

        # Example payload for chat completions (adjust model & endpoint as needed):
        url = 'https://api.openai.com/v1/chat/completions'
        headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json'
        }
        body = {
            'model': kwargs.get('model', 'gpt-4o-mini'),
            'messages': [
                {'role': 'system', 'content': kwargs.get('system', 'You are a helpful assistant.')},
                {'role': 'user', 'content': prompt}
            ],
            'max_tokens': kwargs.get('max_tokens', 512)
        }
        # Do a safe request (networking may be disabled in this environment)
        try:
            resp = requests.post(url, headers=headers, json=body, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            # extract text based on response shape
            choice = data.get('choices', [{}])[0]
            content = choice.get('message', {}).get('content') or choice.get('text')
            return {'status': 'ok', 'response': content, 'raw': data}
        except Exception as e:
            return {'error': 'request_failed', 'exception': str(e)}
