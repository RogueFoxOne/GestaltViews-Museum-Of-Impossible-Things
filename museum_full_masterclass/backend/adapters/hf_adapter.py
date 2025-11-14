"""HuggingFace Hub adapter template.
Usage: set HUGGINGFACE_API_KEY in env.
Supports calling the HF Inference API for text-generation models.
"""
import os, requests
from typing import Optional, Dict, Any

HF_API_KEY = os.getenv('HUGGINGFACE_API_KEY')

class HFAdapter:
    def __init__(self, api_key: Optional[str] = None, model: str = 'gpt2'):
        self.api_key = api_key or HF_API_KEY
        self.model = model

    def generate(self, prompt: str, **kwargs) -> Dict[str, Any]:
        if not self.api_key:
            return {'error': 'missing_api_key', 'provider': 'huggingface'}
        url = f'https://api-inference.huggingface.co/models/{self.model}'
        headers = {'Authorization': f'Bearer {self.api_key}'}
        body = {'inputs': prompt, 'parameters': {'max_new_tokens': kwargs.get('max_tokens',256)}}
        try:
            resp = requests.post(url, headers=headers, json=body, timeout=20)
            resp.raise_for_status()
            data = resp.json()
            # HF may return a list or dict depending on model
            if isinstance(data, list):
                text = ''.join([item.get('generated_text','') for item in data])
            else:
                text = data.get('generated_text') or str(data)
            return {'status': 'ok', 'response': text, 'raw': data}
        except Exception as e:
            return {'error': 'request_failed', 'exception': str(e)}
