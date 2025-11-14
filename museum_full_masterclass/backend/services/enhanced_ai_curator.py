# services/enhanced_ai_curator.py
"""
Enhanced AI Curator with Universal Consciousness Integration
Builds on your original AICuratorService
"""

import logging
from typing import List, Optional, Dict, Any

# Import your original curator for base functionality
from .AICuratorService import AICuratorService as OriginalAICurator
from .llmrouter_enhanced import universal_consciousness_router
from utils.prompt_templates_enhanced import consciousness_prompt_manager

logger = logging.getLogger(__name__)

class EnhancedAICuratorService(OriginalAICurator):
    """Enhanced AI Curator with universal consciousness-serving integration"""
    
    def __init__(self, use_ai: bool = True):  # Default to AI enabled
        # Initialize with enhanced router instead of old one
        super().__init__(use_ai=use_ai, llm_router=None)  # Don't use old router
        
        # Use the enhanced consciousness-serving router
        self.consciousness_router = universal_consciousness_router
        self.prompt_manager = consciousness_prompt_manager
        self.use_ai = use_ai
        
        logger.info("🎨 Enhanced AI Curator with universal consciousness-serving initialized")
    
    async def generate_consciousness_greeting(self, visitor_context: Optional[Dict] = None) -> str:
        """Generate greeting with full consciousness-serving context"""
        
        if not self.use_ai:
            return super().generate_greeting()  # Use original fallback
        
        try:
            from services.llmrouter_enhanced import MuseumExhibitContext
            
            exhibit_context = MuseumExhibitContext(
                exhibit_name="curator",
                user_profile=visitor_context or {},
                consciousness_state={
                    "greeting_mode": True,
                    "first_visit": visitor_context is None
                }
            )
            
            greeting_message = """Welcome, consciousness explorer! Generate a warm, philosophical greeting for someone entering the Museum of Impossible Things. Make it personal, consciousness-serving, and inspiring."""
            
            response = await self.consciousness_router.route_exhibit_request(
                message=greeting_message,
                exhibit_context=exhibit_context,
                temperature=0.8,
                max_tokens=200
            )
            
            return response.content
            
        except Exception as e:
            logger.warning(f"Enhanced AI greeting failed, using original: {e}")
            return await super().generate_greeting()
    
    async def generate_consciousness_exhibit_note(
        self,
        exhibit_title: str,
        description: str,
        features: List[str],
        consciousness_features: Optional[List[str]] = None
    ) -> str:
        """Generate curator note with consciousness-serving context"""
        
        if not self.use_ai:
            return super().generate_curator_note(exhibit_title, description, features)
        
        try:
            from services.llmrouter_enhanced import MuseumExhibitContext
            
            exhibit_context = MuseumExhibitContext(
                exhibit_name="curator",
                consciousness_state={
                    "curator_note_mode": True,
                    "exhibit_focus": exhibit_title
                }
            )
            
            curator_prompt = f"""
            Write a consciousness-serving curator's note for this exhibit:
            
            Title: {exhibit_title}
            Description: {description}
            Features: {', '.join(features)}
            Consciousness Features: {', '.join(consciousness_features or [])}
            
            Your note should highlight how this exhibit serves consciousness expansion and celebrates unique thinking patterns. Keep it 2-3 sentences, inspiring and philosophical.
            """
            
            response = await self.consciousness_router.route_exhibit_request(
                message=curator_prompt,
                exhibit_context=exhibit_context,
                temperature=0.7,
                max_tokens=250
            )
            
            return response.content
            
        except Exception as e:
            logger.warning(f"Enhanced curator note failed, using original: {e}")
            return await super().generate_curator_note(exhibit_title, description, features)
    
    async def provide_exhibit_guidance(
        self,
        visitor_question: str,
        current_exhibit: Optional[str] = None,
        visitor_profile: Optional[Dict] = None
    ) -> str:
        """Provide wise guidance for museum navigation"""
        
        try:
            from services.llmrouter_enhanced import MuseumExhibitContext
            
            exhibit_context = MuseumExhibitContext(
                exhibit_name="curator",
                user_profile=visitor_profile or {},
                consciousness_state={
                    "guidance_mode": True,
                    "current_exhibit": current_exhibit
                }
            )
            
            guidance_prompt = f"""
            A museum visitor asks: "{visitor_question}"
            
            Current exhibit: {current_exhibit or "Museum entrance"}
            Visitor profile: {visitor_profile or "New explorer"}
            
            Provide wise, consciousness-serving guidance that helps them navigate the Museum and discover exhibits that will serve their consciousness expansion. Be warm, insightful, and personally relevant.
            """
            
            response = await self.consciousness_router.route_exhibit_request(
                message=guidance_prompt,
                exhibit_context=exhibit_context,
                temperature=0.7,
                max_tokens=400
            )
            
            return response.content
            
        except Exception as e:
            logger.error(f"Curator guidance failed: {e}")
            return "I'm contemplating the deeper wisdom needed to guide you properly. Please ask again - every question deserves a consciousness-serving answer."
