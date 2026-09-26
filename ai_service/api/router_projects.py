from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel, Field
from ai_service.core.schemas import (
    ProjectItem, ProjectRecommendation, ProjectCompletionResponse, StudentProfile
)
from ai_service.core.enums import ProjectDifficulty
from ai_service.learning.project_recommender import get_project_recommender

router = APIRouter(prefix="/api/projects", tags=["Project Recommendations"])

class RecommendProjectsRequest(BaseModel):
    student_profile: StudentProfile
    career_id: Optional[str] = Field(None, description="Target career ID e.g. CAR-AI-ENG")
    pathway_id: Optional[str] = Field(None, description="Target pathway ID e.g. PATH-AI-GENAI")
    limit: int = Field(3, ge=1, le=10, description="Max projects to recommend")

    model_config = {
        "json_schema_extra": {
            "example": {
                "student_profile": {
                    "student_id": "STU-001",
                    "career_goal": "CAR-AI-ENG",
                    "target_pathway": "PATH-AI-APP",
                    "skills": [
                        {"skill_id": "SKL-0012", "skill_name": "Python", "status": "ASSESSMENT_VERIFIED", "assessment_score": 88.0},
                        {"skill_id": "SKL-0060", "skill_name": "Machine Learning", "status": "EVIDENCE_BACKED"}
                    ],
                    "completed_projects": ["Basic Python Calculator"],
                    "interests": ["Generative AI", "Machine Learning"]
                },
                "career_id": "CAR-AI-ENG",
                "limit": 3
            }
        }
    }

class CompleteProjectRequest(BaseModel):
    student_profile: StudentProfile
    artifact_url: Optional[str] = Field(None, description="GitHub URL or live artifact demo")

@router.get("", response_model=List[ProjectItem], summary="List curated project catalog")
def list_projects(
    difficulty: Optional[ProjectDifficulty] = Query(None, description="Filter by difficulty"),
    career_id: Optional[str] = Query(None, description="Filter by career ID e.g. CAR-AI-ENG")
):
    """Retrieve all available progressively scaffolded projects from the catalog."""
    recommender = get_project_recommender()
    projects = recommender.get_all_projects()

    if difficulty:
        projects = [p for p in projects if p.difficulty == difficulty]
    if career_id:
        projects = [p for p in projects if career_id in p.career_relevance]

    return projects

@router.get("/{project_id}", response_model=ProjectItem, summary="Get project details")
def get_project_details(project_id: str):
    """Retrieve detailed description, required skills, and expected outcomes for a project."""
    recommender = get_project_recommender()
    proj = recommender.get_project(project_id)
    if not proj:
        raise HTTPException(status_code=404, detail=f"Project '{project_id}' not found in catalog.")
    return proj

@router.post("/recommend", response_model=List[ProjectRecommendation], summary="Recommend capability-matched projects")
def recommend_projects(request: RecommendProjectsRequest):
    """
    Recommend difficulty-appropriate projects based on student's current skills and target pathway.
    Ensures student knows ~70-80% of required skills while practicing 1-2 frontier skills.
    """
    recommender = get_project_recommender()
    return recommender.recommend_projects(
        request.student_profile,
        request.career_id,
        request.pathway_id,
        limit=request.limit
    )

@router.post("/{project_id}/complete", response_model=ProjectCompletionResponse, summary="Record project completion and update evidence")
def complete_project(project_id: str, request: CompleteProjectRequest):
    """
    Record project completion. Practiced claimed skills become EVIDENCE_BACKED.
    Note: Skills are NEVER automatically marked assessment-verified.
    """
    recommender = get_project_recommender()
    try:
        return recommender.complete_project(
            student_profile=request.student_profile,
            project_id=project_id,
            artifact_url=request.artifact_url
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
