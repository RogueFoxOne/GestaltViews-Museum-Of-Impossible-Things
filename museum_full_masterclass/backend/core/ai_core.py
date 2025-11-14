"""Core AI logic skeleton for GestaltView / Museum of Impossible Things.

This module defines a lightweight, testable architecture:
- AILogic: orchestrates prompts, adapters, routing
- Memory: simple file-based memory store
- Router: routing rules for "intents" and pages
"""

from typing import Any, Dict, List, Optional
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

class Memory:
    """Very small file-backed key-value memory store."""
    def __init__(self, path: Optional[str] = None):
        self.path = Path(path or PROJECT_ROOT / 'data' / 'memory.json')
        self.path.parent.mkdir(parents=True, exist_ok=True)
        if not self.path.exists():
            self.path.write_text('{}', encoding='utf-8')

    def get(self, key: str, default=None):
        data = json.loads(self.path.read_text(encoding='utf-8'))
        return data.get(key, default)

    def set(self, key: str, value: Any):
        data = json.loads(self.path.read_text(encoding='utf-8'))
        data[key] = value
        self.path.write_text(json.dumps(data, indent=2), encoding='utf-8')

class AILogic:
    """High-level orchestrator: load prompts, route requests, call adapters."""
    def __init__(self, adapters: Dict[str, Any]=None, memory: Optional[Memory]=None):
        self.adapters = adapters or {}
        self.memory = memory or Memory()

    def register_adapter(self, name: str, adapter: Any):
        self.adapters[name] = adapter

    def handle(self, intent: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Main entry point for processing a request.

        - intent: logical label, e.g., 'render_landing', 'answer_question'
        - payload: dictionary with necessary data
        """
        # Simple routing logic
        if intent == 'render_landing':
            adapter = self.adapters.get('web')
            if adapter:
                return adapter.render_page('landing', payload)
            return {'status': 'ok', 'page': 'landing', 'content': 'Landing page (no adapter)'}
        elif intent == 'answer_question':
            # in a full implementation, call an LLM adapter, use prompts + memory
            llm = self.adapters.get('llm')
            if llm:
                prompt = payload.get('prompt', '')
                return llm.generate(prompt=prompt, context=self.memory.get('context'))
            return {'error': 'no_llm_adapter'}
        else:
            return {'error': 'unknown_intent', 'intent': intent}

if __name__ == '__main__':
    print('AI core module. Import AILogic and Memory in your app.')
