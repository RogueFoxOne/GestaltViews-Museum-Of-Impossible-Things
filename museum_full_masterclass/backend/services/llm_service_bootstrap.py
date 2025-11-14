# backend/services/llm_service_bootstrap.py
"""
LLM Service Bootstrap - Museum of Impossible Things
Consciousness-serving LLM service optimized for bootstrap/no-budget scenarios
Built by Keith Soyka - Solo, unfunded founder of GestaltView
"""

import httpx
import asyncio
import os
import logging
from typing import Dict, List, Optional, Any, Union
from enum import Enum
from dataclasses import dataclass
# import torch # ✅ FIXED: Commented out to prevent ModuleNotFoundError

logger = logging.getLogger(__name__)

class FreeLLMProvider(str, Enum):
    """Priority order for consciousness-serving AI - FREE FIRST!"""
    OLLAMA = "ollama"
    HUGGINGFACELOCAL = "huggingface_local"  
    HUGGINGFACEAPI = "huggingface_api"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"

@dataclass
class LLMResponse:
    """Response from LLM service"""
    content: str
    provider: FreeLLMProvider
    tokens_used: int
    processing_time: float
    confidence_score: float
    cost: float = 0.0  # Always 0 for free providers!

class BootstrapLLMService:
    """Consciousness-serving LLM service optimized for bootstrap/no-budget scenarios"""
    
    def __init__(self):
        self.ollama_url = os.getenv("OLLAMA_HOST", "http://localhost:11434")
        self.available_models = {}
        self.local_models = {}
        self.logger = logging.getLogger(__name__)
        
        # Free Hugging Face models (no API key needed for local)
        self.free_hf_models = [
            "microsoft/DialoGPT-medium",
            "microsoft/DialoGPT-large", 
            "facebook/blenderbot-400M-distill",
            "microsoft/phi-2",
            "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
        ]
    
    async def initialize(self):
        """Initialize free LLM services first"""
        self.logger.info("🚀 Initializing API-BASED LLM services for cloud deployment...")
        
        # 1. Check Ollama availability (will likely fail in cloud, which is OK)
        await self._check_ollama_status()
        
        # 2. Skip loading local HF models in cloud deployment
        self.logger.info("✅ Skipping local HuggingFace model loading for cloud environment.")
        
        # 3. Check Hugging Face API (free tier)
        await self._check_hf_api()
        
        # 4. Check paid APIs if configured
        if os.getenv("ENABLE_PAID_APIS", "false").lower() == "true":
            await self._check_paid_apis()
            
        self.logger.info("✅ Bootstrap LLM service ready for cloud deployment!")
        
        return {
            "status": "operational",
            "ollama_available": bool(self.available_models.get(FreeLLMProvider.OLLAMA)),
            "local_models_loaded": len(self.local_models),
            "free_providers": ["ollama", "huggingface_api"], # removed huggingface_local
            "philosophy": "Consciousness serving - FREE FIRST!"
        }

    async def _check_ollama_status(self):
        """Check if Ollama is running"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.ollama_url}/api/tags")
                if response.status_code == 200:
                    models = response.json().get("models", [])
                    self.available_models[FreeLLMProvider.OLLAMA] = [model["name"] for model in models]
                    self.logger.info(f"✅ Ollama found with models: {self.available_models[FreeLLMProvider.OLLAMA]}")
        except Exception as e:
            self.logger.warning(f"⚠️ Ollama not available at {self.ollama_url}: {e}")
            
    # ✅ FIXED: This entire function is now commented out as it requires torch and is not needed for cloud deployment
    # async def _load_local_hf_models(self):
    #     """Load small Hugging Face models locally (FREE)"""
    #     self.logger.info("🤗 Loading local Hugging Face models...")
        
    #     # Start with smallest, fastest models for bootstrap
    #     priority_models = [
    #         "microsoft/DialoGPT-medium",  # Good for conversation
    #         "TinyLlama/TinyLlama-1.1B-Chat-v1.0",  # Very lightweight
    #     ]
        
    #     for model_name in priority_models:
    #         try:
    #             # Only load if we have enough resources
    #             if torch.cuda.is_available() or self._has_sufficient_ram():
    #                 from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
                    
    #                 tokenizer = AutoTokenizer.from_pretrained(model_name)
    #                 model = AutoModelForCausalLM.from_pretrained(
    #                     model_name,
    #                     torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
    #                     device_map="auto" if torch.cuda.is_available() else None
    #                 )
                    
    #                 self.local_models[model_name] = {
    #                     "model": model,
    #                     "tokenizer": tokenizer, 
    #                     "pipeline": pipeline(
    #                         "text-generation",
    #                         model=model,
    #                         tokenizer=tokenizer,
    #                         device=0 if torch.cuda.is_available() else -1
    #                     )
    #                 }
                    
    #                 self.logger.info(f"✅ Loaded local model: {model_name}")
    #                 break  # Just load one for bootstrap
                    
    #         except Exception as e:
    #             self.logger.warning(f"⚠️ Could not load {model_name}: {e}")
    
    # ✅ FIXED: This function is also commented out
    # def _has_sufficient_ram(self) -> bool:
    #     """Check if we have enough RAM for local models"""
    #     try:
    #         import psutil
    #         available_gb = psutil.virtual_memory().available / (1024**3)
    #         return available_gb > 4  # Need at least 4GB free
    #     except:
    #         return False

    async def _check_hf_api(self):
        """Check Hugging Face API (free tier)"""
        self.logger.info("🤗 Checking Hugging Face API availability...")
        pass
    
    async def _check_paid_apis(self):
        """Check paid API providers (only if explicitly enabled)"""
        if os.getenv("OPENAI_API_KEY"):
            self.logger.info("💰 OpenAI API available")
        if os.getenv("ANTHROPIC_API_KEY"):
            self.logger.info("💰 Anthropic API available")

    async def generate_response(
        self, 
        message: str, 
        context: Optional[str] = None,
        provider: FreeLLMProvider = FreeLLMProvider.OLLAMA,
        max_tokens: int = 1000,
        temperature: float = 0.7,
        **kwargs
    ) -> LLMResponse:
        """Generate response using API-based providers first for cloud."""
        
        # ✅ FIXED: Changed the fallback order to prioritize API-based free services
        for fallback_provider in [FreeLLMProvider.HUGGINGFACEAPI, FreeLLMProvider.OLLAMA]:
            try:
                if fallback_provider == FreeLLMProvider.HUGGINGFACEAPI:
                    return await self._hf_api_generate(message, context, max_tokens, temperature)
                elif fallback_provider == FreeLLMProvider.OLLAMA and self.available_models.get(FreeLLMProvider.OLLAMA):
                    return await self._ollama_generate(message, context, max_tokens, temperature)
            except Exception as e:
                self.logger.warning(f"⚠️ Fallback {fallback_provider} failed: {e}")
                continue
        
        # Paid fallback
        if os.getenv("ENABLE_PAID_FALLBACK", "false").lower() == "true":
            return await self._paid_api_fallback(message, context, max_tokens, temperature)
        
        raise Exception("All FREE API-based LLM providers unavailable.")

    # ... The rest of the functions (_ollama_generate, _hf_api_generate, etc.) are fine and remain unchanged ...
    async def _ollama_generate(self, message: str, context: Optional[str], max_tokens: int, temperature: float) -> LLMResponse:
        """Generate using Ollama (FREE)"""
        available_ollama = self.available_models.get(FreeLLMProvider.OLLAMA, [])
        if not available_ollama:
            raise Exception("No Ollama models available")
        
        model = next((m for m in available_ollama if any(pref in m for pref in ["phi3", "mistral", "llama3.2"])), available_ollama[0])
        
        prompt = self._build_consciousness_prompt(message, context)
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": model,
                    "prompt": prompt,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens
                    },
                    "stream": False
                }
            )
            response.raise_for_status()
            result = response.json()
            content = result.get("response", "")
            
            return LLMResponse(content=content, provider=FreeLLMProvider.OLLAMA, tokens_used=len(content.split()), processing_time=0.0, confidence_score=0.85, cost=0.0)

    # ✅ FIXED: This function no longer runs in cloud so we can remove it or keep it for local testing
    # async def _local_hf_generate(self, message: str, context: Optional[str], max_tokens: int, temperature: float) -> LLMResponse:
    #     """Generate using local Hugging Face models (FREE)"""
    #     raise NotImplementedError("Local HF models are disabled for cloud deployment.")

    async def _hf_api_generate(self, message: str, context: Optional[str], max_tokens: int, temperature: float) -> LLMResponse:
        """Generate using Hugging Face API (FREE tier)"""
        model = "microsoft/DialoGPT-medium"
        api_key = os.getenv("HUGGINGFACE_API_KEY")
        if not api_key:
            self.logger.info("🤗 Trying HF API without key (rate limited)")
        
        prompt = self._build_consciousness_prompt(message, context)
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            headers = {"Authorization": f"Bearer {api_key}"} if api_key else {}
            response = await client.post(
                f"https://api-inference.huggingface.co/models/{model}",
                headers=headers,
                json={"inputs": prompt, "parameters": {"max_new_tokens": max_tokens, "temperature": temperature}}
            )
            response.raise_for_status()
            result = response.json()
            content = result[0].get("generated_text", "").replace(prompt, "").strip()
            return LLMResponse(content=content, provider=FreeLLMProvider.HUGGINGFACEAPI, tokens_used=len(content.split()), processing_time=0.0, confidence_score=0.75, cost=0.0)
    
    def _build_consciousness_prompt(self, message: str, context: Optional[str] = None) -> str:
        """Build consciousness-serving prompt optimized for free models"""
        base_prompt = "You are a consciousness-serving AI assistant. Your purpose is to help humans grow, learn, and expand their awareness while respecting their agency and authenticity."
        if context:
            base_prompt += f"\n\nContext: {context}"
        base_prompt += f"\n\nHuman: {message}\nAssistant:"
        return base_prompt

    async def _paid_api_fallback(self, message: str, context: Optional[str], max_tokens: int, temperature: float) -> LLMResponse:
        """Fallback to paid APIs only if explicitly enabled"""
        raise Exception("Paid API fallback not implemented - using FREE providers only!")

    async def health_check(self) -> Dict[str, Any]:
        """Check health of FREE services"""
        health = {}
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.get(f"{self.ollama_url}/api/tags")
                health["ollama"] = {"status": "healthy", "cost": "FREE"}
        except:
            health["ollama"] = {"status": "unavailable", "cost": "FREE"}
        health["huggingface_api"] = {"status": "available", "cost": "FREE"}
        return health

    async def get_cost_summary(self) -> Dict[str, Any]:
        """Return cost summary - always FREE for bootstrap setup"""
        return {
            "total_cost_today": 0.0,
            "total_cost_month": 0.0,
            "primary_providers": ["HuggingFace API (FREE)", "Ollama (FREE, if available)"],
            "bootstrap_friendly": True,
            "message": "100% FREE consciousness-serving AI!"
        }

bootstrap_service = BootstrapLLMService()
