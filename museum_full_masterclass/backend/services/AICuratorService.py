import random
from typing import List, Optional
import logging
from services.llmrouter_enhanced import universal_consciousness_router
# ✅ FIXED: Changed 'prompts' to 'utils' to match your current file structure
from utils.gestaltview_seed import GESTALTVIEW_SEED_PROMPT

logger = logging.getLogger(__name__)

class AICuratorService:
    """AI Curator service for generating museum content with GestaltView consciousness-serving methodology"""

    # Predefined greetings as fallback
    GREETINGS = [
        "Welcome, traveler of consciousness. I am your curator through realms where technology serves the human mind.",
        "Greetings. You stand at the threshold of impossible things—projects that celebrate neurodivergent brilliance.",
        "Enter freely, and leave with your mind expanded. Each exhibit here defies conventional thinking.",
        "Welcome to where chaos becomes creation. I'm here to guide you through these consciousness-serving innovations.",
        "Step into a realm where technology bends to human consciousness, not the other way around.",
        "Welcome, seeker. These halls showcase the future—where AI serves neurodivergent minds with empathy.",
    ]

    def __init__(
        self,
        use_ai: bool = False,
        llm_router: Optional = None # Simplified Optional for this context
    ):
        """
        Initialize AI Curator Service

        Args:
            use_ai: Whether to use AI generation (vs templates)
            llm_router: Shared LLMRouter instance for API calls
        """
        self.use_ai = use_ai
        self.llm_router = llm_router
        logger.info(f"AI Curator initialized (use_ai={use_ai}, router={'present' if llm_router else 'None'})")

    def _build_consciousness_prompt(self, base_prompt: str) -> str:
        """
        Prepend GestaltView seed prompt to any AI generation request

        Args:
            base_prompt: The specific task prompt

        Returns:
            Full prompt with consciousness-serving context
        """
        return f"""{GESTALTVIEW_SEED_PROMPT}

---

## Current Task

{base_prompt}

Remember to embody the GestaltView principles in your response: empathetic, consciousness-serving, 
neurodivergent-celebrating, and authentic.
"""

    async def generate_greeting(self) -> str:
        """Generate curator greeting using LLM hierarchy with GestaltView consciousness"""
        if self.use_ai and self.llm_router:
            try:
                base_prompt = (
                    "You are the AI curator of the Museum of Impossible Things, "
                    "a space showcasing consciousness-serving technology. "
                    "Generate a warm, philosophical greeting (2-3 sentences) "
                    "that welcomes visitors to explore neurodivergent innovation."
                )

                # Build full prompt with GestaltView seed
                full_prompt = self._build_consciousness_prompt(base_prompt)

                # The actual routing logic would be more complex, this is illustrative
                response = await self.llm_router.route_exhibit_request(full_prompt, {})
                return response.content

            except Exception as e:
                logger.warning(f"AI greeting generation failed: {e}. Falling back to predefined list.")
                return random.choice(self.GREETINGS)
        
        # Fallback for when AI is not in use
        return random.choice(self.GREETINGS)
