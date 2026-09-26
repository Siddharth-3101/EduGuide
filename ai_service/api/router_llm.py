from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from ai_service.core.schemas import StudentProfile, PersonalizedRoadmap
from ai_service.llm.ollama_client import get_ollama_client
from ai_service.career.adaptive_roadmap_service import get_adaptive_roadmap_service
from ai_service.career.career_engine import get_career_profile_engine
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

router = APIRouter(prefix="/api/llm", tags=["LLM Personalization Layer (Ollama)"])

class LLMPersonalizeRoadmapRequest(BaseModel):
    student_profile: StudentProfile
    career_id: str
    pathway_id: Optional[str] = None
    weekly_hours: int = Field(default=10, ge=1, le=80, description="Available study hours per week")

class LLMExplainRecommendationRequest(BaseModel):
    skill_id: str
    student_profile: StudentProfile
    career_id: str
    pathway_id: Optional[str] = None

@router.get("/health")
def get_llm_health() -> Dict[str, Any]:
    """
    Check the health and connection status of the Ollama server and configured model.
    Returns status: 'online' if ready, or 'offline' with fallback mode enabled.
    """
    client = get_ollama_client()
    return client.check_health()

@router.post("/personalize-roadmap", response_model=PersonalizedRoadmap)
def personalize_roadmap(request: LLMPersonalizeRoadmapRequest) -> PersonalizedRoadmap:
    """
    Generates a deterministic multi-stage career roadmap and augments it with
    an Ollama-narrated study plan, weekly schedule, and practical advice.
    If Ollama is unreachable, gracefully falls back to deterministic presentation.
    """
    adaptive_service = get_adaptive_roadmap_service()
    try:
        return adaptive_service.generate_personalized_adaptive_roadmap(
            student_profile=request.student_profile,
            career_identifier=request.career_id,
            pathway_identifier=request.pathway_id,
            weekly_hours=request.weekly_hours
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/explain-recommendation")
def explain_recommendation(request: LLMExplainRecommendationRequest) -> Dict[str, Any]:
    """
    Generates a conversational explanation of why a skill is recommended next,
    given the student's background, target career, and prerequisite chain.
    """
    taxonomy = get_canonical_taxonomy()
    skill = taxonomy.get_skill(request.skill_id)
    skill_name = skill.skill_name if skill else request.skill_id

    career_engine = get_career_profile_engine()
    career = career_engine.get_career(request.career_id)
    career_name = career.career_name if career else request.career_id

    pathway_name = "Core Pathway"
    if career:
        for p in career.pathways:
            if p.pathway_id == request.pathway_id or request.pathway_id is None:
                pathway_name = p.pathway_name
                break

    client = get_ollama_client()
    result = client.explain_skill_recommendation(
        skill_name=skill_name,
        student_profile=request.student_profile,
        career_name=career_name,
        pathway_name=pathway_name
    )
    result["skill_id"] = skill.skill_id if skill else request.skill_id
    result["skill_name"] = skill_name
    return result
