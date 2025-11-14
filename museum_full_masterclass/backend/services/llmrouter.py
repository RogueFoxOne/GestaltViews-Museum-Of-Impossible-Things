# backend/services/llmrouter.py
"""
Base Consciousness-Serving LLM Router
Built by Keith Soyka - Solo, unfunded founder of GestaltView
"""

import httpx
import asyncio
import os
import logging
from typing import Dict, List, Optional, Any, Union
from enum import Enum
from dataclasses import dataclass

logger = logging.getLogger(__name__)

class LLMProvider(str, Enum):
    OLLAMA = "ollama"
    HUGGINGFACE = "huggingface"
    PERPLEXITY = "perplexity"
    GEMINI = "gemini"
    OPENAI = "openai"

@dataclass
class LLMResponse:
    content: str
    provider: LLMProvider
    tokens_used: int
    processing_time: float
    metadata: Dict[str, Any] = None

@dataclass
class MuseumExhibitContext:
    exhibit_name: str
    user_profile: Optional[Dict] = None
    session_id: Optional[str] = None
    consciousness_state: Optional[Dict] = None
    neurodivergent_support: bool = False
    recovery_support: bool = False

class ConsciousnessServingLLMRouter:
    def __init__(self):
        self.ollama_url = os.getenv("OLLAMA_HOST", "http://localhost:11434")
        self.hf_api_key = os.getenv("HUGGINGFACE_API_KEY")
        self.logger = logging.getLogger(__name__)
        # Add other API keys as needed

    async def route_exhibit_request(
        self,
        message: str,
        exhibit_context: MuseumExhibitContext,
        preferred_provider: Optional[LLMProvider] = None,
        **kwargs
    ) -> LLMResponse:
        # Simplified routing: Try Ollama first, then HuggingFace API as a fallback.
        try:
            return await self._ollama_generate(message, **kwargs)
        except Exception as e:
            self.logger.warning(f"Ollama failed: {e}. Falling back to HuggingFace API.")
            try:
                return await self._hf_api_generate(message, **kwargs)
            except Exception as hf_e:
                self.logger.error(f"HuggingFace API also failed: {hf_e}")
                raise Exception("All available free LLM providers failed.")

    async def _ollama_generate(self, message: str, **kwargs) -> LLMResponse:
        async with httpx.AsyncClient(timeout=60.0) as client:
            start_time = asyncio.get_event_loop().time()
            response = await client.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": "phi3:mini",  # A good default
                    "prompt": message,
                    "stream": False
                }
            )
            response.raise_for_status()
            result = response.json()
            processing_time = asyncio.get_event_loop().time() - start_time
            content = result.get("response", "")
            return LLMResponse(
                content=content,
                provider=LLMProvider.OLLAMA,
                tokens_used=len(content.split()),
                processing_time=processing_time
            )

    async def _hf_api_generate(self, message: str, **kwargs) -> LLMResponse:
        if not self.hf_api_key:
            raise Exception("HUGGINGFACE_API_KEY not set.")
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            start_time = asyncio.get_event_loop().time()
            response = await client.post(
                "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
                headers={"Authorization": f"Bearer {self.hf_api_key}"},
                json={"inputs": message, "parameters": {"max_new_tokens": 500}}
            )
            response.raise_for_status()
            result = response.json()
            processing_time = asyncio.get_event_loop().time() - start_time
            content = result[0].get("generated_text", "").replace(message, "").strip()
            return LLMResponse(
                content=content,
                provider=LLMProvider.HUGGINGFACE,
                tokens_used=len(content.split()),
                processing_time=processing_time
            )
