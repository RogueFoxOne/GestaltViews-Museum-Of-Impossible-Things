# /backend/api/routes/llm_router.py
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from services.llm_service import LLMService, LLMProvider
from services.database import DatabaseService
from lib.plk_engine import PLKEngine
from adapters.openai_adapter import OpenAIAdapter
from adapters.anthropic_adapter import AnthropicAdapter
from adapters.gemini_adapter import GeminiAdapter
from adapters.huggingface_adapter import HuggingFaceAdapter
from utils.prompt_templates import PromptTemplateManager
import asyncio

router = APIRouter()

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    context: Optional[str] = None
    plk_profile: Optional[Dict[str, Any]] = None
    provider: Optional[LLMProvider] = LLMProvider.AUTO
    temperature: Optional[float] = Field(0.7, ge=0.0, le=2.0)
    max_tokens: Optional[int] = Field(2000, ge=1, le=4000)
    stream: bool = False
    exhibit_context: Optional[str] = None

class MultiLLMRequest(BaseModel):
    message: str
    providers: List[LLMProvider]
    consensus_threshold: float = 0.8
    plk_profile: Optional[Dict[str, Any]] = None

class PLKAnalysisRequest(BaseModel):
    conversation_history: List[Dict[str, str]]
    user_profile: Optional[Dict[str, Any]] = None

# Dependencies
async def get_llm_service() -> LLMService:
    return LLMService()

async def get_plk_engine() -> PLKEngine:
    return PLKEngine()

async def get_database() -> DatabaseService:
    return DatabaseService()

@router.post("/chat")
async def chat_completion(
    request: ChatRequest,
    llm_service: LLMService = Depends(get_llm_service),
    plk_engine: PLKEngine = Depends(get_plk_engine),
    database: DatabaseService = Depends(get_database)
):
    """Enhanced chat with PLK integration and consciousness-serving responses"""
    try:
        # Apply PLK analysis if profile provided
        enhanced_context = request.context
        if request.plk_profile:
            plk_insights = await plk_engine.analyze_request(
                message=request.message,
                profile=request.plk_profile,
                context=request.context
            )
            enhanced_context = plk_engine.enhance_context(
                original_context=request.context,
                plk_insights=plk_insights
            )

        # Get consciousness-serving prompt
        prompt_manager = PromptTemplateManager()
        system_prompt = prompt_manager.get_consciousness_serving_prompt(
            exhibit_context=request.exhibit_context,
            plk_profile=request.plk_profile
        )

        # Generate response
        response = await llm_service.generate_response(
            message=request.message,
            context=enhanced_context,
            system_prompt=system_prompt,
            provider=request.provider,
            temperature=request.temperature,
            max_tokens=request.max_tokens,
            stream=request.stream
        )

        # Calculate PLK resonance
        plk_resonance = await plk_engine.calculate_resonance(
            response=response.content,
            user_profile=request.plk_profile
        )

        # Store interaction
        await database.store_interaction({
            "user_message": request.message,
            "ai_response": response.content,
            "plk_resonance": plk_resonance,
            "provider": response.provider,
            "timestamp": database.get_timestamp(),
            "exhibit_context": request.exhibit_context
        })

        return {
            "response": response.content,
            "provider": response.provider,
            "plk_resonance": plk_resonance,
            "tokens_used": response.tokens_used,
            "processing_time": response.processing_time,
            "consciousness_metrics": {
                "authenticity_score": plk_resonance,
                "growth_potential": await plk_engine.assess_growth_potential(response.content),
                "empathy_rating": await plk_engine.assess_empathy(response.content)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat completion failed: {str(e)}")

@router.post("/multi-llm-consensus")
async def multi_llm_consensus(
    request: MultiLLMRequest,
    llm_service: LLMService = Depends(get_llm_service),
    plk_engine: PLKEngine = Depends(get_plk_engine)
):
    """Get consensus response from multiple LLM providers"""
    try:
        tasks = []
        for provider in request.providers:
            task = llm_service.generate_response(
                message=request.message,
                provider=provider,
                context="Multi-LLM consensus request"
            )
            tasks.append(task)

        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        valid_responses = [r for r in responses if not isinstance(r, Exception)]
        
        if not valid_responses:
            raise HTTPException(status_code=503, detail="All LLM providers failed")

        # Analyze consensus
        consensus_analysis = await plk_engine.analyze_consensus(
            responses=[r.content for r in valid_responses],
            threshold=request.consensus_threshold
        )

        # Generate final consensus response
        final_response = await llm_service.synthesize_consensus(
            responses=valid_responses,
            consensus_analysis=consensus_analysis,
            plk_profile=request.plk_profile
        )

        return {
            "consensus_response": final_response,
            "individual_responses": [
                {
                    "provider": r.provider,
                    "response": r.content,
                    "confidence": r.confidence_score
                } for r in valid_responses
            ],
            "consensus_score": consensus_analysis.consensus_score,
            "divergence_points": consensus_analysis.divergence_points,
            "plk_resonance": await plk_engine.calculate_resonance(final_response)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-LLM consensus failed: {str(e)}")

@router.post("/plk-analysis")
async def analyze_plk_profile(
    request: PLKAnalysisRequest,
    plk_engine: PLKEngine = Depends(get_plk_engine)
):
    """Analyze conversation for Personal Language Key insights"""
    try:
        analysis = await plk_engine.analyze_conversation(
            conversation_history=request.conversation_history,
            user_profile=request.user_profile
        )

        return {
            "plk_profile": analysis.plk_profile,
            "consciousness_metrics": analysis.consciousness_metrics,
            "personality_insights": analysis.personality_insights,
            "communication_patterns": analysis.communication_patterns,
            "growth_recommendations": analysis.growth_recommendations,
            "resonance_score": analysis.overall_resonance
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PLK analysis failed: {str(e)}")

@router.get("/providers/status")
async def get_provider_status(
    llm_service: LLMService = Depends(get_llm_service)
):
    """Check status of all LLM providers"""
    return await llm_service.get_provider_status()

@router.post("/prompt-templates/{template_name}")
async def get_prompt_template(
    template_name: str,
    context: Dict[str, Any],
    plk_profile: Optional[Dict[str, Any]] = None
):
    """Get consciousness-serving prompt template"""
    prompt_manager = PromptTemplateManager()
    
    template = prompt_manager.get_template(
        name=template_name,
        context=context,
        plk_profile=plk_profile
    )
    
    return {
        "template": template,
        "consciousness_score": prompt_manager.calculate_consciousness_score(template),
        "suggested_parameters": prompt_manager.get_suggested_parameters(template_name)
    }
