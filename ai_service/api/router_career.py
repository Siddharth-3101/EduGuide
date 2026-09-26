from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from ai_service.core.schemas import (
    StudentProfile, CareerProfile, CareerPathway, SkillGapAnalysisResult,
    SkillRecommendation, PersonalizedRoadmap, PathwayRecommendation,
    AssessmentResultInput
)
from ai_service.career.career_engine import get_career_profile_engine
from ai_service.career.skill_gap_engine import get_skill_gap_engine
from ai_service.career.priority_recommender import get_skill_priority_recommender
from ai_service.career.roadmap_generator import get_roadmap_generator
from ai_service.career.adaptive_roadmap_service import get_adaptive_roadmap_service

router = APIRouter(prefix="/api/career", tags=["Career Intelligence"])

# ---------------------------------------------------------------------------
# Request Models
# ---------------------------------------------------------------------------

class CareerAnalyzeRequest(BaseModel):
    student_profile: StudentProfile
    career_id: str
    target_pathway_id: Optional[str] = None

class SkillGapRequest(BaseModel):
    student_profile: StudentProfile
    career_id: str
    pathway_id: Optional[str] = None

class RecommendSkillsRequest(BaseModel):
    student_profile: StudentProfile
    career_id: str
    pathway_id: Optional[str] = None
    top_k: int = 5

class GenerateRoadmapRequest(BaseModel):
    student_profile: StudentProfile
    career_id: str
    pathway_id: Optional[str] = None

class RecommendPathwaysRequest(BaseModel):
    student_profile: StudentProfile
    career_id: str

class PersonalizeRoadmapRequest(BaseModel):
    student_profile: StudentProfile
    career_id: str
    pathway_id: Optional[str] = None
    weekly_hours: int = Field(default=10, ge=1, le=80, description="Available study hours per week")

class AssessAndAdaptRequest(BaseModel):
    student_profile: StudentProfile
    assessment: AssessmentResultInput
    career_id: str
    pathway_id: Optional[str] = None
    weekly_hours: int = Field(default=10, ge=1, le=80, description="Available study hours per week")

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("", response_model=List[Dict[str, Any]])
def list_careers():
    """List all available careers and their candidate pathways."""
    engine = get_career_profile_engine()
    careers = engine.get_all_careers()
    return [
        {
            "career_id": c.career_id,
            "career_name": c.career_name,
            "category": c.category,
            "description": c.description,
            "pathways_count": len(c.pathways)
        }
        for c in careers
    ]

@router.get("/{career_id}", response_model=CareerProfile)
def get_career_profile(career_id: str):
    """Retrieve full career profile and all candidate pathways."""
    engine = get_career_profile_engine()
    career = engine.get_career(career_id)
    if not career:
        raise HTTPException(status_code=404, detail=f"Career '{career_id}' not found.")
    return career

@router.get("/{career_id}/roadmaps", response_model=List[CareerPathway])
def get_career_roadmaps(career_id: str):
    """Retrieve candidate pathways and milestone stages for a specific career."""
    engine = get_career_profile_engine()
    pathways = engine.get_pathways_for_career(career_id)
    if not pathways:
        raise HTTPException(status_code=404, detail=f"No pathways found for career '{career_id}'.")
    return pathways

@router.get("/{career_id}/pathways", response_model=List[Dict[str, Any]])
def get_career_pathways(career_id: str):
    """List specialization pathways under a career with stage and skill summaries."""
    engine = get_career_profile_engine()
    pathways = engine.get_pathways_for_career(career_id)
    if not pathways:
        raise HTTPException(status_code=404, detail=f"No pathways found for career '{career_id}'.")
    return [
        {
            "pathway_id": p.pathway_id,
            "pathway_name": p.pathway_name,
            "description": p.description,
            "stages_count": len(p.recommended_stages),
            "total_skills": sum(len(s.skills) for s in p.recommended_stages)
        }
        for p in pathways
    ]

@router.post("/analyze", response_model=Dict[str, Any])
def analyze_career(request: CareerAnalyzeRequest):
    """
    Comprehensive career evaluation: identifies candidate pathways,
    calculates relevance, and performs initial skill gap analysis.
    """
    engine = get_career_profile_engine()
    gap_engine = get_skill_gap_engine()
    
    career = engine.get_career(request.career_id)
    if not career:
        raise HTTPException(status_code=404, detail=f"Career '{request.career_id}' not found.")

    student_skill_ids = [s.skill_id for s in request.student_profile.skills if s.skill_id]
    candidate_pathways = engine.find_relevant_pathways(career.career_id, student_skill_ids)

    # Perform gap analysis on selected or top candidate pathway
    target_pathway = request.target_pathway_id or (candidate_pathways[0]["pathway_id"] if candidate_pathways else None)
    gap_result = None
    if target_pathway:
        gap_result = gap_engine.analyze_gap(request.student_profile, career.career_id, target_pathway)

    return {
        "career_id": career.career_id,
        "career_name": career.career_name,
        "candidate_pathways": candidate_pathways,
        "selected_pathway_gap_analysis": gap_result.model_dump() if gap_result else None
    }

@router.post("/recommend-pathways", response_model=List[PathwayRecommendation])
def recommend_pathways(request: RecommendPathwaysRequest):
    """
    Module 1: Recommend candidate specialization pathways within a career,
    scoring each by status-weighted skill overlap, interest alignment, and project evidence.
    """
    engine = get_career_profile_engine()
    try:
        return engine.recommend_pathways(request.student_profile, request.career_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/skill-gap", response_model=SkillGapAnalysisResult)
def evaluate_skill_gap(request: SkillGapRequest):
    """Perform 3-tier status-aware skill gap analysis against a career pathway."""
    gap_engine = get_skill_gap_engine()
    try:
        return gap_engine.analyze_gap(request.student_profile, request.career_id, request.pathway_id)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/recommend-skills", response_model=List[SkillRecommendation])
def recommend_skills(request: RecommendSkillsRequest):
    """Recommend next priority skills with prerequisite-aware gating and explainability."""
    recommender = get_skill_priority_recommender()
    try:
        return recommender.recommend_next_skills(
            request.student_profile,
            request.career_id,
            request.pathway_id,
            request.top_k
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/generate-roadmap", response_model=PersonalizedRoadmap)
def generate_roadmap(request: GenerateRoadmapRequest):
    """Generate dynamic, multi-stage personalized roadmap tailored to student skill gaps."""
    generator = get_roadmap_generator()
    try:
        return generator.generate_roadmap(
            request.student_profile,
            request.career_id,
            request.pathway_id
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/personalize-roadmap", response_model=PersonalizedRoadmap)
def personalize_roadmap(request: PersonalizeRoadmapRequest):
    """
    Generate deterministic roadmap augmented with Ollama LLM narrative,
    weekly study schedule, and tactical study advice (with offline resilience).
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

@router.post("/assess-and-adapt", response_model=Dict[str, Any])
def assess_and_adapt(request: AssessAndAdaptRequest):
    """
    Module 5: Ingest a verified assessment score, update student profile verification status,
    and dynamically regenerate the personalized learning roadmap.
    """
    adaptive_service = get_adaptive_roadmap_service()
    try:
        updated_profile = adaptive_service.apply_assessment_result(
            request.student_profile, request.assessment
        )
        adapted_roadmap = adaptive_service.generate_personalized_adaptive_roadmap(
            student_profile=updated_profile,
            career_identifier=request.career_id,
            pathway_identifier=request.pathway_id,
            weekly_hours=request.weekly_hours
        )
        return {
            "message": "Assessment recorded and roadmap adapted successfully.",
            "assessment_result": request.assessment.model_dump(),
            "updated_profile": updated_profile.model_dump(),
            "adapted_roadmap": adapted_roadmap.model_dump()
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
