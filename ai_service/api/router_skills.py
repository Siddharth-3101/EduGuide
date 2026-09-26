from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ai_service.core.schemas import CanonicalSkill, NormalizationResult
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy
from ai_service.taxonomy.normalizer import get_skill_normalizer
from ai_service.career.dependency_graph import get_dependency_graph

router = APIRouter(prefix="/api/skills", tags=["Skills Taxonomy & Normalization"])

class NormalizeSkillRequest(BaseModel):
    raw_skill: str
    context: str = ""
    source: str = "API"

@router.get("/{skill_id}", response_model=CanonicalSkill)
def get_skill_details(skill_id: str):
    """Retrieve details for a canonical skill by ID or name."""
    taxonomy = get_canonical_taxonomy()
    skill = taxonomy.get_skill(skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail=f"Skill '{skill_id}' not found in canonical taxonomy.")
    return skill

@router.get("/{skill_id}/prerequisites", response_model=Dict[str, Any])
def get_skill_prerequisites(skill_id: str):
    """Retrieve direct prerequisites, ancestor chain, and downstream dependent skills."""
    taxonomy = get_canonical_taxonomy()
    skill = taxonomy.get_skill(skill_id)
    if not skill:
        raise HTTPException(status_code=404, detail=f"Skill '{skill_id}' not found in canonical taxonomy.")

    graph = get_dependency_graph()
    direct_prereqs = [
        {"skill_id": pid, "skill_name": taxonomy.skills_by_id[pid].skill_name}
        for pid in graph.get_direct_prerequisites(skill.skill_id)
        if pid in taxonomy.skills_by_id
    ]
    downstream = [
        {"skill_id": sid, "skill_name": taxonomy.skills_by_id[sid].skill_name}
        for sid in graph.get_downstream_skills(skill.skill_id)
        if sid in taxonomy.skills_by_id
    ]

    return {
        "skill_id": skill.skill_id,
        "skill_name": skill.skill_name,
        "direct_prerequisites": direct_prereqs,
        "downstream_dependent_skills": downstream
    }

@router.post("/normalize", response_model=NormalizationResult)
def normalize_raw_skill(request: NormalizeSkillRequest):
    """Normalize any raw skill string into canonical skill taxonomy or candidate registry."""
    normalizer = get_skill_normalizer()
    return normalizer.normalize(request.raw_skill, context=request.context, source=request.source)
