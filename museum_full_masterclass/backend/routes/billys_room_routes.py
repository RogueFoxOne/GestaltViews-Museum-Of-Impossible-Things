# backend/routes/billysroomroutes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any

# FIXED IMPORT: Changed from llmrouterenhanced to llmrouter_enhanced
from services.llmrouter_enhanced import universal_consciousness_router, MuseumExhibitContext, LLMProvider

router = APIRouter()


class BillysRoomRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat_with_billy(request: BillysRoomRequest):
    try:
        exhibit_context = MuseumExhibitContext(
            exhibit_name="billys-room",
            consciousness_state={"safe_space_needed": True, "inner_child_active": True}
        )
        
        # Using the corrected universal_consciousness_router
        ai_response = await universal_consciousness_router.route_exhibit_request(
            message=request.message,
            exhibit_context=exhibit_context,
            preferred_provider=LLMProvider.OLLAMA
        )
        
        return {"response": ai_response.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Billy's AI companion is resting. {str(e)}")