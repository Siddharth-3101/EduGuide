from typing import Dict, Any, Optional, List
from ai_service.core.schemas import (
    StudentProfile, StudentSkillEntry, PersonalizedRoadmap, AssessmentResultInput
)
from ai_service.core.enums import VerificationStatus
from ai_service.career.roadmap_generator import get_roadmap_generator
from ai_service.career.skill_gap_engine import get_skill_gap_engine
from ai_service.career.priority_recommender import get_skill_priority_recommender
from ai_service.learning.project_recommender import get_project_recommender
from ai_service.learning.resource_recommender import get_learning_resource_recommender
from ai_service.llm.ollama_client import get_ollama_client
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

class AdaptiveRoadmapService:
    """Service orchestrating adaptive roadmap updates, assessment sync, and LLM personalization."""

    def __init__(self):
        self.roadmap_generator = get_roadmap_generator()
        self.gap_engine = get_skill_gap_engine()
        self.priority_recommender = get_skill_priority_recommender()
        self.project_recommender = get_project_recommender()
        self.resource_recommender = get_learning_resource_recommender()
        self.ollama_client = get_ollama_client()
        self.taxonomy = get_canonical_taxonomy()

    def apply_assessment_result(
        self,
        student_profile: StudentProfile,
        assessment: AssessmentResultInput
    ) -> StudentProfile:
        """
        Applies a new assessment result to the student profile.
        If score >= 70%, marks ASSESSMENT_VERIFIED.
        If score < 70%, marks CLAIMED or retains EVIDENCE_BACKED with recorded score.
        """
        skill_obj = self.taxonomy.get_skill(assessment.skill_id)
        skill_id = skill_obj.skill_id if skill_obj else assessment.skill_id
        skill_name = skill_obj.skill_name if skill_obj else skill_id

        # Determine verification threshold (default 70.0)
        is_pass = assessment.assessment_score >= 70.0
        new_status = VerificationStatus.ASSESSMENT_VERIFIED if is_pass else VerificationStatus.CLAIMED

        existing_entry: Optional[StudentSkillEntry] = None
        for entry in student_profile.skills:
            if entry.skill_id == skill_id or (entry.skill_name and entry.skill_name.lower() == skill_name.lower()):
                existing_entry = entry
                break

        verified_at_str = assessment.verified_at.isoformat() if hasattr(assessment.verified_at, "isoformat") else assessment.verified_at

        if existing_entry:
            existing_entry.assessment_score = assessment.assessment_score
            # If it was already evidence-backed and failed assessment, preserve evidence-backed status
            if not is_pass and existing_entry.status == VerificationStatus.EVIDENCE_BACKED:
                pass
            else:
                existing_entry.status = new_status
            existing_entry.verified_at = verified_at_str
        else:
            new_entry = StudentSkillEntry(
                skill_id=skill_id,
                skill_name=skill_name,
                status=new_status,
                assessment_score=assessment.assessment_score,
                verified_at=verified_at_str,
                evidence_sources=[f"assessment: score {assessment.assessment_score}%"]
            )
            student_profile.skills.append(new_entry)

        return student_profile

    def generate_personalized_adaptive_roadmap(
        self,
        student_profile: StudentProfile,
        career_identifier: str,
        pathway_identifier: Optional[str] = None,
        weekly_hours: int = 10
    ) -> PersonalizedRoadmap:
        """
        Generates deterministic roadmap, then passes structured facts to Ollama for narrative
        and study plan personalization with resilient fallback.
        """
        # 1. Deterministic roadmap generation
        deterministic_roadmap = self.roadmap_generator.generate_roadmap(
            student_profile, career_identifier, pathway_identifier
        )

        # 2. Ollama personalization
        llm_result = self.ollama_client.personalize_roadmap(
            deterministic_roadmap, student_profile, weekly_hours=weekly_hours
        )

        # 3. Attach personalization to response
        deterministic_roadmap.llm_status = llm_result.get("llm_status", "unavailable")
        deterministic_roadmap.personalization_narrative = llm_result.get("personalization_narrative")
        deterministic_roadmap.weekly_study_plan = llm_result.get("weekly_study_plan")
        deterministic_roadmap.practical_advice = llm_result.get("practical_advice")

        return deterministic_roadmap

# Singleton instance
_adaptive_service_instance: Optional[AdaptiveRoadmapService] = None

def get_adaptive_roadmap_service() -> AdaptiveRoadmapService:
    global _adaptive_service_instance
    if _adaptive_service_instance is None:
        _adaptive_service_instance = AdaptiveRoadmapService()
    return _adaptive_service_instance
