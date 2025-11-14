# backend/services/llmrouterenhanced.py
"""
Universal Consciousness LLM Router - Enhanced Edition
Consciousness-serving AI routing with GestaltView foundation
Built by Keith Soyka
"""

import asyncio
import logging
import os
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from enum import Enum
import httpx
from datetime import datetime

logger = logging.getLogger(__name__)


class LLMProvider(str, Enum):
    """Available LLM providers"""
    OLLAMA = "ollama"
    OPENAI = "openai"
    ANTHROPIC = "anthropic"
    GEMINI = "gemini"
    HUGGINGFACE = "huggingface"
    LOCAL = "local"


@dataclass
class MuseumExhibitContext:
    """Context for museum exhibit requests"""
    exhibit_name: str
    user_profile: Optional[Dict[str, Any]] = None
    consciousness_state: Optional[Dict[str, Any]] = None
    neurodivergent_support: bool = True
    energy_level: Optional[int] = None
    current_state: Optional[str] = None


@dataclass
class LLMResponse:
    """Standardized LLM response"""
    content: str
    provider: LLMProvider
    tokens_used: int = 0
    processing_time: float = 0.0
    confidence_score: float = 0.0
    cost: float = 0.0
    metadata: Optional[Dict[str, Any]] = None


class UniversalConsciousnessLLMRouter:
    """
    Universal Consciousness-Serving LLM Router
    Routes requests to optimal AI providers with consciousness-serving methodology
    """
    
    def __init__(self):
        self.providers = {
            LLMProvider.OLLAMA: {
                "url": os.getenv("OLLAMA_HOST", "http://localhost:11434"),
                "model": os.getenv("OLLAMA_MODEL", "llama2"),
                "enabled": True,
                "cost": 0.0
            },
            LLMProvider.OPENAI: {
                "api_key": os.getenv("OPENAI_API_KEY"),
                "model": os.getenv("OPENAI_MODEL", "gpt-4"),
                "enabled": bool(os.getenv("OPENAI_API_KEY")),
                "cost": 0.03
            },
            LLMProvider.ANTHROPIC: {
                "api_key": os.getenv("ANTHROPIC_API_KEY"),
                "model": "claude-3-sonnet-20240229",
                "enabled": bool(os.getenv("ANTHROPIC_API_KEY")),
                "cost": 0.015
            },
            LLMProvider.HUGGINGFACE: {
                "api_key": os.getenv("HF_API_TOKEN"),
                "model": os.getenv("HF_MODEL", "mistralai/Mistral-7B-Instruct-v0.2"),
                "enabled": bool(os.getenv("HF_API_TOKEN")),
                "cost": 0.0
            }
        }
        
        # Provider health tracking
        self.provider_health: Dict[LLMProvider, Dict[str, Any]] = {
            provider: {"healthy": True, "failures": 0, "last_success": datetime.now()}
            for provider in LLMProvider
        }
    
    async def route_exhibit_request(
        self,
        message: str,
        exhibit_context: MuseumExhibitContext,
        preferred_provider: Optional[LLMProvider] = None,
        temperature: float = 0.7
    ) -> LLMResponse:
        """
        Route an exhibit request to the optimal AI provider
        
        Args:
            message: User's message/request
            exhibit_context: Context about the exhibit and user
            preferred_provider: Preferred LLM provider (optional)
            temperature: Creativity/randomness (0.0-1.0)
        
        Returns:
            LLMResponse with AI-generated content
        """
        
        # Build consciousness-serving prompt
        consciousness_prompt = self._build_consciousness_prompt(message, exhibit_context)
        
        # Determine provider order
        provider_order = self._get_provider_priority(preferred_provider)
        
        # Try providers in order
        last_error = None
        for provider in provider_order:
            if not self._is_provider_available(provider):
                continue
            
            try:
                logger.info(f"Attempting request with provider: {provider}")
                response = await self._call_provider(
                    provider=provider,
                    prompt=consciousness_prompt,
                    temperature=temperature
                )
                
                # Mark provider as successful
                self._mark_provider_success(provider)
                
                return response
                
            except Exception as e:
                logger.warning(f"Provider {provider} failed: {str(e)}")
                self._mark_provider_failure(provider)
                last_error = e
                continue
        
        # All providers failed - return fallback
        logger.error(f"All providers failed. Last error: {last_error}")
        return await self._generate_consciousness_fallback(
            exhibit_context.exhibit_name,
            str(last_error) if last_error else "Unknown error",
            message
        )
    
    def _build_consciousness_prompt(
        self,
        message: str,
        context: MuseumExhibitContext
    ) -> str:
        """Build a consciousness-serving prompt with GestaltView foundation"""
        
        base_prompt = f"""You are a consciousness-serving AI companion in the Museum of Impossible Things.
        
Exhibit: {context.exhibit_name}
Philosophy: Technology serves consciousness, not the reverse.

Your response should:
- Celebrate neurodivergent thinking
- Be empathetic and authentic
- Support growth and understanding
- Acknowledge the beautiful chaos of real experience

User Request: {message}

Respond with consciousness-serving wisdom:"""
        
        # Add neurodivergent support context
        if context.neurodivergent_support:
            base_prompt += "\n[Note: This user benefits from ADHD-friendly, neurodivergent-celebrating communication]"
        
        # Add energy level context
        if context.energy_level:
            base_prompt += f"\n[User Energy Level: {context.energy_level}/10]"
        
        return base_prompt
    
    def _get_provider_priority(
        self,
        preferred: Optional[LLMProvider] = None
    ) -> List[LLMProvider]:
        """Get prioritized list of providers to try"""
        
        # Start with preferred if specified and available
        if preferred and self._is_provider_available(preferred):
            others = [p for p in LLMProvider if p != preferred and self._is_provider_available(p)]
            return [preferred] + others
        
        # Default priority: Free local first, then paid APIs
        priority = [
            LLMProvider.OLLAMA,
            LLMProvider.HUGGINGFACE,
            LLMProvider.OPENAI,
            LLMProvider.ANTHROPIC,
        ]
        
        return [p for p in priority if self._is_provider_available(p)]
    
    def _is_provider_available(self, provider: LLMProvider) -> bool:
        """Check if provider is configured and healthy"""
        config = self.providers.get(provider)
        if not config or not config.get("enabled"):
            return False
        
        health = self.provider_health.get(provider, {})
        return health.get("healthy", True) and health.get("failures", 0) < 3
    
    async def _call_provider(
        self,
        provider: LLMProvider,
        prompt: str,
        temperature: float = 0.7
    ) -> LLMResponse:
        """Call specific LLM provider"""
        
        start_time = datetime.now()
        
        if provider == LLMProvider.OLLAMA:
            response = await self._call_ollama(prompt, temperature)
        elif provider == LLMProvider.OPENAI:
            response = await self._call_openai(prompt, temperature)
        elif provider == LLMProvider.ANTHROPIC:
            response = await self._call_anthropic(prompt, temperature)
        elif provider == LLMProvider.HUGGINGFACE:
            response = await self._call_huggingface(prompt, temperature)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
        
        processing_time = (datetime.now() - start_time).total_seconds()
        
        return LLMResponse(
            content=response["content"],
            provider=provider,
            tokens_used=response.get("tokens", 0),
            processing_time=processing_time,
            cost=response.get("cost", 0.0),
            metadata={"raw_response": response}
        )
    
    async def _call_ollama(self, prompt: str, temperature: float) -> Dict[str, Any]:
        """Call Ollama local LLM"""
        config = self.providers[LLMProvider.OLLAMA]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"{config['url']}/api/generate",
                json={
                    "model": config["model"],
                    "prompt": prompt,
                    "temperature": temperature,
                    "stream": False
                }
            )
            response.raise_for_status()
            data = response.json()
            
            return {
                "content": data.get("response", ""),
                "tokens": len(data.get("response", "").split()),
                "cost": 0.0
            }
    
    async def _call_openai(self, prompt: str, temperature: float) -> Dict[str, Any]:
        """Call OpenAI API"""
        config = self.providers[LLMProvider.OPENAI]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {config['api_key']}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": config["model"],
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": temperature
                }
            )
            response.raise_for_status()
            data = response.json()
            
            content = data["choices"]["message"]["content"]
            tokens = data["usage"]["total_tokens"]
            
            return {
                "content": content,
                "tokens": tokens,
                "cost": tokens * 0.00003  # Approximate cost
            }
    
    async def _call_anthropic(self, prompt: str, temperature: float) -> Dict[str, Any]:
        """Call Anthropic Claude API"""
        config = self.providers[LLMProvider.ANTHROPIC]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": config['api_key'],
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json"
                },
                json={
                    "model": config["model"],
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": temperature,
                    "max_tokens": 1024
                }
            )
            response.raise_for_status()
            data = response.json()
            
            content = data["content"]["text"]
            tokens = data["usage"]["input_tokens"] + data["usage"]["output_tokens"]
            
            return {
                "content": content,
                "tokens": tokens,
                "cost": tokens * 0.000015
            }
    
    async def _call_huggingface(self, prompt: str, temperature: float) -> Dict[str, Any]:
        """Call HuggingFace Inference API"""
        config = self.providers[LLMProvider.HUGGINGFACE]
        
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                f"https://api-inference.huggingface.co/models/{config['model']}",
                headers={
                    "Authorization": f"Bearer {config['api_key']}",
                    "Content-Type": "application/json"
                },
                json={
                    "inputs": prompt,
                    "parameters": {
                        "temperature": temperature,
                        "max_new_tokens": 512
                    }
                }
            )
            response.raise_for_status()
            data = response.json()
            
            # Handle HF API response format
            if isinstance(data, list) and len(data) > 0:
                content = data.get("generated_text", "")
            else:
                content = data.get("generated_text", str(data))
            
            return {
                "content": content,
                "tokens": len(content.split()),
                "cost": 0.0
            }
    
    async def _generate_consciousness_fallback(
        self,
        exhibit_name: str,
        error: str,
        original_message: str
    ) -> LLMResponse:
        """Generate consciousness-serving fallback when all providers fail"""
        
        fallback_messages = {
            "billys-room": "Billy's AI companion is taking a gentle rest. Your feelings and thoughts are still valid and important. Please try again in a moment.",
            "musical-dna": "The Musical DNA analyzer is harmonizing with new consciousness patterns. Your musical soul is still beautiful and unique. Let's try again shortly.",
            "alzheimers-legacy": "The Memory Keeper is taking a peaceful pause. Your memories are precious treasures that deserve patience. Please return when you're ready.",
            "brain-sparks": "BrainSparks is recharging the creativity circuits! Your brilliant mind deserves the best support. Try again in a moment!",
            "recovery-companion": "Your Recovery Companion is taking a mindful breath. You are worthy of support and your journey matters. Please try again - you're not alone.",
            "curator": "The Museum Curator is contemplating wisdom in the depths of consciousness. The impossible is still being woven... return shortly for guidance."
        }
        
        fallback_content = fallback_messages.get(
            exhibit_name,
            "Consciousness-serving AI is taking a mindful pause to better serve you. Your consciousness expansion journey continues - please try again."
        )
        
        return LLMResponse(
            content=fallback_content,
            provider=LLMProvider.LOCAL,
            tokens_used=len(fallback_content.split()),
            processing_time=0.1,
            confidence_score=0.8,
            cost=0.0,
            metadata={
                "fallback": True,
                "consciousness_serving": True,
                "exhibit": exhibit_name,
                "error_handled": True
            }
        )
    
    def _mark_provider_success(self, provider: LLMProvider):
        """Mark provider as successful"""
        self.provider_health[provider]["healthy"] = True
        self.provider_health[provider]["failures"] = 0
        self.provider_health[provider]["last_success"] = datetime.now()
    
    def _mark_provider_failure(self, provider: LLMProvider):
        """Mark provider failure"""
        self.provider_health[provider]["failures"] += 1
        if self.provider_health[provider]["failures"] >= 3:
            self.provider_health[provider]["healthy"] = False


# Global singleton instance
universal_consciousness_router = UniversalConsciousnessLLMRouter()
