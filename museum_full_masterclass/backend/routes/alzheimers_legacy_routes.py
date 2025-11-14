from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.llmrouter_enhanced import universal_consciousness_router, MuseumExhibitContext, LLMProvider
from services.auth import get_current_user

router = APIRouter(prefix="/alzheimers-legacy", tags=["alzheimers-legacy"])

class MemoryQuery(BaseModel):
    memory_fragment: str
    context: Optional[Dict[str, Any]] = None
    preservation_type: str

class LegacyResponse(BaseModel):
    preserved_memory: str
    connections: List[str]
    legacy_insights: List[str]

@router.post("/preserve", response_model=LegacyResponse)
async def preserve_memory(
    query: MemoryQuery,
    current_user: dict = Depends(get_current_user)
):
    """Preserve and enhance memories in the Alzheimer's Legacy exhibit."""
    try:
        context = MuseumExhibitContext(
            exhibit_type="alzheimers_legacy",
            user_context={
                "memory_fragment": query.memory_fragment,
                "preservation_type": query.preservation_type,
                "context": query.context or {}
            },
            user_id=current_user.get("user_id"),
            session_id=f"alzheimers_legacy_{current_user.get('user_id')}"
        )
        
        prompt = f"""
        Help preserve and enhance this memory fragment:
        
        Memory: {query.memory_fragment}
        Preservation Type: {query.preservation_type}
        Context: {query.context}
        
        Please provide:
        1. An enhanced, preserved version of the memory
        2. Related memory connections
        3. Legacy insights and wisdom
        """
        
        response = await universal_consciousness_router(
            prompt,
            context,
            LLMProvider.OPENAI
        )
        
        return LegacyResponse(
            preserved_memory=response,
            connections=["Connected memory 1", "Connected memory 2"],
            legacy_insights=["Legacy insight 1", "Legacy insight 2"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
