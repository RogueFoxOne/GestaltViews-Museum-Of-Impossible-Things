# backend/routes/adhdpoweruproutes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

# FIXED IMPORT: Changed from llmrouterenhanced to llmrouter_enhanced
from services.llmrouter_enhanced import universal_consciousness_router, MuseumExhibitContext

router = APIRouter()


class ADHDChatRequest(BaseModel):
    message: str
    energy_level: int
    adhd_state: str
    context: Optional[Dict[str, Any]] = None


@router.post("/chat")
async def adhd_companion_chat(request: ADHDChatRequest):
    try:
        exhibit_context = MuseumExhibitContext(
            exhibit_name="adhd-power-up",
            user_profile={"adhd": True, "energy_level": request.energy_level, "current_state": request.adhd_state},
            neurodivergent_support=True
        )
        
        # Using the corrected universal_consciousness_router
        ai_response = await universal_consciousness_router.route_exhibit_request(
            message=request.message,
            exhibit_context=exhibit_context
        )
        
        return {"response": ai_response.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ADHD Power-Up Error: {str(e)}")