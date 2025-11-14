# backend/routes/curatorroutes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any, List

# FIXED IMPORT: Changed from llmrouterenhanced to llmrouter_enhanced
from services.llmrouter_enhanced import universal_consciousness_router, MuseumExhibitContext, LLMProvider

router = APIRouter()


class CuratorRequest(BaseModel):
    visitor_question: str


@router.post("/guide")
async def get_curator_guidance(request: CuratorRequest):
    try:
        exhibit_context = MuseumExhibitContext(
            exhibit_name="curator",
            consciousness_state={"wisdom_mode": True}
        )
        
        # Using the corrected universal_consciousness_router
        ai_response = await universal_consciousness_router.route_exhibit_request(
            message=request.visitor_question,
            exhibit_context=exhibit_context
        )
        
        return {"curator_response": ai_response.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))