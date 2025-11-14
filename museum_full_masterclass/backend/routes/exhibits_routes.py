from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.llmrouter_enhanced import universal_consciousness_router, MuseumExhibitContext, LLMProvider
from services.auth import get_current_user

router = APIRouter(prefix="/exhibits", tags=["exhibits"])

# Exhibit models
class ExhibitQuery(BaseModel):
    query: str
    exhibit_type: str
    context: Optional[Dict[str, Any]] = None

class ExhibitResponse(BaseModel):
    response: str
    exhibit_type: str
    metadata: Optional[Dict[str, Any]] = None

@router.post("/explore", response_model=ExhibitResponse)
async def explore_exhibit(
    query: ExhibitQuery,
    current_user: dict = Depends(get_current_user)
):
    """Explore any exhibit in the museum."""
    try:
        context = MuseumExhibitContext(
            exhibit_type=query.exhibit_type,
            user_context=query.context or {},
            user_id=current_user.get("user_id"),
            session_id=f"exhibit_{query.exhibit_type}"
        )
        
        response = await universal_consciousness_router(
            query.query,
            context,
            LLMProvider.OPENAI
        )
        
        return ExhibitResponse(
            response=response,
            exhibit_type=query.exhibit_type,
            metadata={"user_id": current_user.get("user_id")}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
