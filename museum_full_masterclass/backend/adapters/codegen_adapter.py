"""GestaltView.integrations.codegen_adapter
Adapter to unify code generation via CodeGen (or other code-specialized models).
API:
  - generate_code(prompt, language='python', model=None)
"""
import os, logging, subprocess, json
try:
    import requests
except Exception:
    requests = None
def generate_code(prompt, language='python', model=None):
    model = model or os.getenv('CODEGEN_MODEL', 'codegen-2B')
    # Example: if CODEGEN_API_URL is present, call it
    url = os.getenv('CODEGEN_API_URL')
    if url and requests:
        try:
            r = requests.post(url + '/generate', json={'model': model, 'prompt': prompt, 'language': language})
            r.raise_for_status()
            return r.json().get('code') or r.text
        except Exception as e:
            logging.warning('CodeGen HTTP failed: %s', e)
    # Otherwise, fallback to Ollama if it supports code-oriented model
    try:
        from GestaltView.integrations.ollama_adapter import generate as ollama_generate
        return ollama_generate(prompt, model=model)
    except Exception as e:
        logging.warning('Fallback to Ollama failed: %s', e)
    raise RuntimeError('No CodeGen integration available. Set CODEGEN_API_URL or ensure Ollama is configured.')
