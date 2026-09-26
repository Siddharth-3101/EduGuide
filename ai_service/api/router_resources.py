from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from ai_service.core.schemas import LearningResource, StudentProfile
from ai_service.core.enums import ResourceType, SkillDifficulty
from ai_service.learning.resource_recommender import get_learning_resource_recommender

router = APIRouter(prefix="/api/resources", tags=["Learning Resources"])

class RecommendResourcesRequest(BaseModel):
    student_profile: StudentProfile
    career_id: Optional[str] = Field(None, description="Target career ID e.g. CAR-AI-ENG")
    pathway_id: Optional[str] = Field(None, description="Target pathway ID e.g. PATH-AI-GENAI")
    limit_per_skill: int = Field(2, ge=1, le=5, description="Resources per recommended skill")

    model_config = {
        "json_schema_extra": {
            "example": {
                "student_profile": {
                    "student_id": "STU-001",
                    "career_goal": "CAR-AI-ENG",
                    "skills": [
                        {"skill_id": "SKL-0012", "skill_name": "Python", "status": "ASSESSMENT_VERIFIED", "assessment_score": 90.0}
                    ]
                },
                "career_id": "CAR-AI-ENG",
                "limit_per_skill": 2
            }
        }
    }

@router.get("/{skill_id}", response_model=List[LearningResource], summary="Get learning resources for a skill")
def get_skill_resources(
    skill_id: str,
    resource_type: Optional[ResourceType] = Query(None, description="Filter by resource type e.g. DOCUMENTATION, COURSE"),
    difficulty: Optional[SkillDifficulty] = Query(None, description="Filter by difficulty e.g. Beginner, Intermediate")
):
    """Retrieve curated learning resources with real documentation and tutorial URLs for a skill."""
    recommender = get_learning_resource_recommender()
    resources = recommender.get_resources_for_skill(skill_id, resource_type=resource_type, difficulty=difficulty)
    if not resources:
        # Check if skill exists
        skill = recommender.taxonomy.get_skill(skill_id)
        if not skill:
            raise HTTPException(status_code=404, detail=f"Skill '{skill_id}' not found in canonical taxonomy.")
    return resources

@router.post("/recommend", response_model=Dict[str, List[LearningResource]], summary="Recommend resources for priority skills")
def recommend_resources(request: RecommendResourcesRequest):
    """
    Retrieve top curated learning resources for the student's highest priority recommended skills.
    """
    recommender = get_learning_resource_recommender()
    return recommender.recommend_resources_for_profile(
        request.student_profile,
        request.career_id,
        request.pathway_id,
        limit_per_skill=request.limit_per_skill
    )
