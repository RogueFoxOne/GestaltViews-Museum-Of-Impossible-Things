from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from services.llmrouter_enhanced import universal_consciousness_router, MuseumExhibitContext, LLMProvider
from services.auth import get_current_user

router = APIRouter(prefix="/brain-sparks", tags=["brain-sparks"])

class BrainSparkQuery(BaseModel):
    thought: str
    spark_type: str
    context: Optional[Dict[str, Any]] = None

class BrainSparkResponse(BaseModel):
    spark: str
    connections: List[str]
    next_thoughts: List[str]

@router.post("/ignite", response_model=BrainSparkResponse)
async def ignite_brain_spark(
    query: BrainSparkQuery,
    current_user: dict = Depends(get_current_user)
):
    """Ignite a brain spark and explore neural pathways."""
    try:
        context = MuseumExhibitContext(
            exhibit_type="brain_sparks",
            user_context={
                "thought": query.thought,
                "spark_type": query.spark_type,
                "context": query.context or {}
            },
            user_id=current_user.get("user_id"),
            session_id=f"brain_spark_{current_user.get('user_id')}"
        )
        
        prompt = f"""
        Generate a brain spark based on this thought:
        
        Original Thought: {query.thought}
        Spark Type: {query.spark_type}
        Context: {query.context}
        
        Please provide:
        1. An expanded brain spark
        2. Related neural connections
        3. Next potential thoughts to explore
        """
        
        response = await universal_consciousness_router(
            prompt,
            context,
            LLMProvider.OPENAI
        )
        
        return BrainSparkResponse(
            spark=response,
            connections=["Connection 1", "Connection 2", "Connection 3"],
            next_thoughts=["Next thought 1", "Next thought 2", "Next thought 3"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
