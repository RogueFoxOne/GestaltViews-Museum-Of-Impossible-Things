from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.llmrouter_enhanced import universal_consciousness_router, MuseumExhibitContext, LLMProvider
from services.auth import get_current_user

router = APIRouter(prefix="/musical-dna", tags=["musical-dna"])

class MusicalAnalysisQuery(BaseModel):
    musical_data: str
    analysis_type: str
    preferences: Optional[Dict[str, Any]] = None

class MusicalDNAResponse(BaseModel):
    analysis: str
    dna_profile: Dict[str, Any]
    recommendations: List[str]

@router.post("/analyze", response_model=MusicalDNAResponse)
async def analyze_musical_dna(
    query: MusicalAnalysisQuery,
    current_user: dict = Depends(get_current_user)
):
    """Analyze musical DNA and provide personalized insights."""
    try:
        context = MuseumExhibitContext(
            exhibit_type="musical_dna",
            user_context={
                "musical_data": query.musical_data,
                "analysis_type": query.analysis_type,
                "preferences": query.preferences or {}
            },
            user_id=current_user.get("user_id"),
            session_id=f"musical_dna_{current_user.get('user_id')}"
        )
        
        prompt = f"""
        Analyze this musical data and create a Musical DNA profile:
        
        Musical Data: {query.musical_data}
        Analysis Type: {query.analysis_type}
        User Preferences: {query.preferences}
        
        Please provide:
        1. A detailed musical DNA analysis
        2. A personality profile based on musical preferences
        3. Personalized music recommendations
        """
        
        response = await universal_consciousness_router(
            prompt,
            context,
            LLMProvider.OPENAI
        )
        
        return MusicalDNAResponse(
            analysis=response,
            dna_profile={
                "musical_personality": "Generated from analysis",
                "dominant_traits": ["creativity", "emotional_depth"],
                "musical_preferences": query.preferences or {}
            },
            recommendations=["Recommendation 1", "Recommendation 2", "Recommendation 3"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
