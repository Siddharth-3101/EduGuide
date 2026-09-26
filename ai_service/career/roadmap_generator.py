from typing import Dict, List, Optional
from datetime import datetime, timezone
from ai_service.core.schemas import (
    StudentProfile, PersonalizedRoadmap, PersonalizedRoadmapStage, SkillRecommendation
)
from ai_service.core.enums import VerificationStatus
from ai_service.career.career_engine import get_career_profile_engine
from ai_service.career.dependency_graph import get_dependency_graph
from ai_service.career.skill_gap_engine import get_skill_gap_engine
from ai_service.career.priority_recommender import get_skill_priority_recommender
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

class PersonalizedRoadmapGenerator:
    """Engine 7: Dynamic Personalized Roadmap Generator."""

    def __init__(self):
        self.career_engine = get_career_profile_engine()
        self.dependency_graph = get_dependency_graph()
        self.gap_engine = get_skill_gap_engine()
        self.priority_recommender = get_skill_priority_recommender()
        self.taxonomy = get_canonical_taxonomy()

    def generate_roadmap(
        self,
        student_profile: StudentProfile,
        career_identifier: str,
        pathway_identifier: Optional[str] = None
    ) -> PersonalizedRoadmap:
        career = self.career_engine.get_career(career_identifier)
        if not career:
            raise ValueError(f"Career not found: {career_identifier}")

        student_skill_ids = [s.skill_id for s in student_profile.skills if s.skill_id]
        if not pathway_identifier:
            candidates = self.career_engine.find_relevant_pathways(career.career_id, student_skill_ids)
            pathway_identifier = candidates[0]["pathway_id"] if candidates else career.pathways[0].pathway_id

        pathway = self.career_engine.get_pathway(career.career_id, pathway_identifier)
        if not pathway:
            raise ValueError(f"Pathway '{pathway_identifier}' not found in career '{career.career_name}'")

        # Student status map
        student_status_map: Dict[str, VerificationStatus] = {}
        for entry in student_profile.skills:
            if entry.skill_id:
                student_status_map[entry.skill_id] = entry.status
            else:
                norm = self.taxonomy.get_skill(entry.skill_name)
                if norm:
                    student_status_map[norm.skill_id] = entry.status

        # Analyze current gaps
        gap_result = self.gap_engine.analyze_gap(student_profile, career.career_id, pathway.pathway_id)
        covered_skill_ids = {item.skill_id for item in gap_result.strong_skills + gap_result.evidence_backed_skills}

        stages_output: List[PersonalizedRoadmapStage] = []

        # Iterate through roadmap stages
        stage_num = 1
        for stage in pathway.recommended_stages:
            stage_skills_to_learn: List[SkillRecommendation] = []
            
            for req in stage.skills:
                skill_id = req.skill_id
                # If already covered, skip from learning list
                if skill_id in covered_skill_ids:
                    continue

                skill = self.taxonomy.skills_by_id.get(skill_id)
                if not skill:
                    continue

                is_r, prereq_score, satisfied, warnings = (
                    self.dependency_graph.evaluate_prerequisite_readiness(skill_id, student_status_map)
                )

                warning_str = "; ".join(warnings) if warnings else None
                rationale = f"Milestone skill for '{stage.title}'."
                reasons = [f"Required competency for Stage {stage_num}: {stage.title}"]
                if satisfied:
                    rationale += f" Prerequisites {', '.join(satisfied)} are ready."
                    reasons.append(f"Prerequisites {', '.join(satisfied)} satisfied")
                else:
                    reasons.append("Foundational competency")

                # Action type
                current_st = student_status_map.get(skill_id, VerificationStatus.MISSING)
                if current_st == VerificationStatus.CLAIMED:
                    action_type = "ASSESS"
                else:
                    action_type = "LEARN"

                rec = SkillRecommendation(
                    skill_id=skill_id,
                    skill_name=skill.skill_name,
                    priority_score=0.90 if is_r else 0.70,
                    career_importance=req.importance,
                    requirement_category=req.requirement_category,
                    prerequisite_readiness=prereq_score,
                    prerequisites_satisfied=satisfied,
                    unmet_prerequisites=[],
                    verification_warning=warning_str,
                    rationale=rationale,
                    reasons=reasons,
                    category=skill.category,
                    difficulty=skill.difficulty,
                    action_type=action_type
                )
                stage_skills_to_learn.append(rec)

            if stage_skills_to_learn:
                stages_output.append(PersonalizedRoadmapStage(
                    stage_number=stage_num,
                    stage_title=stage.title,
                    skills=stage_skills_to_learn,
                    stage_rationale=f"Focus on mastering and verifying skills for {stage.title}.",
                    recommended_checkpoint=stage.checkpoint_project
                ))
                stage_num += 1

        # Next Best Action
        next_actions = self.priority_recommender.recommend_next_skills(
            student_profile, career.career_id, pathway.pathway_id, top_k=1
        )
        next_best_action = next_actions[0] if next_actions else None

        summary = (
            f"Personalized roadmap for {career.career_name} ({pathway.pathway_name}) generated. "
            f"Organized into {len(stages_output)} progressive milestone stages tailored to your skill gaps."
        )

        return PersonalizedRoadmap(
            student_id=student_profile.student_id,
            career_id=career.career_id,
            career_name=career.career_name,
            pathway_id=pathway.pathway_id,
            pathway_name=pathway.pathway_name,
            generated_at=datetime.now(timezone.utc).isoformat(),
            stages=stages_output,
            next_best_action=next_best_action,
            summary=summary
        )

# Singleton instance
_roadmap_generator_instance: Optional[PersonalizedRoadmapGenerator] = None

def get_roadmap_generator() -> PersonalizedRoadmapGenerator:
    global _roadmap_generator_instance
    if _roadmap_generator_instance is None:
        _roadmap_generator_instance = PersonalizedRoadmapGenerator()
    return _roadmap_generator_instance
