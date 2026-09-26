from typing import Dict, List, Optional
from ai_service.core.schemas import (
    StudentProfile, SkillRecommendation, SkillGapAnalysisResult
)
from ai_service.core.enums import VerificationStatus, SkillImportance, RequirementCategory
from ai_service.career.career_engine import get_career_profile_engine
from ai_service.career.dependency_graph import get_dependency_graph
from ai_service.career.skill_gap_engine import get_skill_gap_engine
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy
from ai_service.config.settings import CONFIG

class SkillPriorityRecommender:
    """Engine 6: Prerequisite-Aware Skill Priority & Recommendation Engine."""

    def __init__(self):
        self.career_engine = get_career_profile_engine()
        self.dependency_graph = get_dependency_graph()
        self.gap_engine = get_skill_gap_engine()
        self.taxonomy = get_canonical_taxonomy()
        self._load_config()

    def _load_config(self):
        weights = CONFIG.get("recommendation_ranking_weights", {})
        self.w_career = weights.get("career_importance", 0.35)
        self.w_prereq = weights.get("prerequisite_readiness", 0.25)
        self.w_demand = weights.get("market_demand", 0.15)
        self.w_difficulty = weights.get("difficulty_fit", 0.15)
        self.w_verification = weights.get("verification_boost", 0.10)

        self.importance_weights = CONFIG.get("skill_importance_weights", {
            "CRITICAL": 1.00,
            "HIGH": 0.80,
            "MEDIUM": 0.50,
            "LOW": 0.20
        })

    def recommend_next_skills(
        self,
        student_profile: StudentProfile,
        career_identifier: str,
        pathway_identifier: Optional[str] = None,
        top_k: int = 5
    ) -> List[SkillRecommendation]:
        # 1. Analyze skill gaps
        gap_result = self.gap_engine.analyze_gap(student_profile, career_identifier, pathway_identifier)

        # 2. Build student status map
        student_status_map: Dict[str, VerificationStatus] = {}
        for entry in student_profile.skills:
            if entry.skill_id:
                student_status_map[entry.skill_id] = entry.status
            else:
                norm = self.taxonomy.get_skill(entry.skill_name)
                if norm:
                    student_status_map[norm.skill_id] = entry.status

        # 3. Candidate target skills: Missing skills + Claimed-Only skills + Verification Gap skills
        candidate_items = list(gap_result.missing_skills) + list(gap_result.claimed_only_skills)
        recommendations: List[SkillRecommendation] = []

        # Determine current stage frontier in pathway
        pathway = self.career_engine.get_pathway(gap_result.career_id, gap_result.pathway_id)
        skill_stage_map: Dict[str, int] = {}
        if pathway:
            for stage in pathway.recommended_stages:
                for req in stage.skills:
                    skill_stage_map[req.skill_id] = req.stage_order

        # Minimum stage among missing/claimed skills
        missing_stages = [skill_stage_map[item.skill_id] for item in candidate_items if item.skill_id in skill_stage_map]
        current_stage_frontier = min(missing_stages) if missing_stages else 1

        seen_skills = set()

        for item in candidate_items:
            skill_id = item.skill_id
            if skill_id in seen_skills:
                continue
            seen_skills.add(skill_id)

            skill = self.taxonomy.skills_by_id.get(skill_id)
            if not skill:
                continue

            # Stage Horizon: Skip skills that belong to distant future stages (> current_stage_frontier + 1)
            item_stage = skill_stage_map.get(skill_id, 1)
            if item_stage > current_stage_frontier + 1:
                continue

            # Evaluate prerequisite readiness
            is_reachable, prereq_score, satisfied_prereqs, warnings = (
                self.dependency_graph.evaluate_prerequisite_readiness(skill_id, student_status_map)
            )

            # Prerequisite gating: Only recommend immediately reachable skills
            if not is_reachable:
                continue

            # Downstream unlock leverage
            downstream = self.dependency_graph.get_downstream_skills(skill_id)
            downstream_names = [
                self.taxonomy.skills_by_id[d].skill_name
                for d in downstream if d in self.taxonomy.skills_by_id
            ][:3]
            unlock_leverage = self.dependency_graph.calculate_unlock_leverage(skill_id)

            # Compute component scores
            c_score = self.importance_weights.get(item.importance.value, 0.50)
            p_score = prereq_score
            m_score = 0.85 if skill.assessment_available == "Available" else 0.70  # proxy market demand
            d_score = 0.90 if skill.difficulty == "Beginner" else (0.80 if skill.difficulty == "Intermediate" else 0.65)
            v_score = 0.80  # Baseline verification boost

            # Requirement category multiplier
            req_multiplier = 1.0 if getattr(item, "requirement_category", None) != "OPTIONAL" else 0.75

            # Action type determination
            if item.student_status == VerificationStatus.CLAIMED:
                action_type = "ASSESS"
            elif item.gap_classification.value == "WEAK":
                action_type = "PRACTICE"
            elif item.gap_classification.value == "EVIDENCE_GAP":
                action_type = "PROJECT"
            else:
                action_type = "LEARN"

            # Interest alignment
            interests = [i.lower() for i in getattr(student_profile, "interests", [])]
            interest_boost = 0.0
            matched_interest = None
            for interest in interests:
                if interest in skill.skill_name.lower() or interest in skill.category.lower():
                    interest_boost = 0.05
                    matched_interest = interest.title()
                    break

            # Completed projects alignment
            completed_projects = getattr(student_profile, "completed_projects", [])
            project_boost = 0.0
            matched_proj = None
            for proj in completed_projects:
                if any(w in proj.lower() for w in skill.skill_name.lower().split()):
                    project_boost = 0.04
                    matched_proj = proj
                    break

            # Stage proximity factor: earlier stages get a boost over later stages
            stage_proximity_multiplier = max(0.60, 1.0 - (item_stage - current_stage_frontier) * 0.20)

            # Priority score formula with unlock leverage
            raw_priority = (
                self.w_career * c_score +
                self.w_prereq * p_score +
                self.w_demand * m_score +
                self.w_difficulty * d_score +
                self.w_verification * v_score +
                (0.08 * unlock_leverage) +
                interest_boost +
                project_boost
            ) * stage_proximity_multiplier * req_multiplier
            priority_score = round(min(1.0, raw_priority), 3)

            # Construct transparent, explainable reasons list
            reasons_list: List[str] = [
                f"{item.importance.value} priority for selected '{gap_result.pathway_name}' pathway"
            ]
            if satisfied_prereqs:
                reasons_list.append(f"Prerequisites {', '.join(satisfied_prereqs)} are satisfied")
            else:
                reasons_list.append("Foundational skill with no outstanding prerequisites")

            if downstream_names:
                reasons_list.append(f"Unlocks downstream skills: {', '.join(downstream_names)}")

            if action_type == "ASSESS":
                reasons_list.append(f"Claimed on profile: take assessment to verify and boost readiness score")
            elif action_type == "PROJECT":
                reasons_list.append(f"Needs portfolio project evidence to demonstrate applied mastery")

            if matched_interest:
                reasons_list.append(f"Matches your declared interest in '{matched_interest}'")

            if matched_proj:
                reasons_list.append(f"Builds on your completed project '{matched_proj}'")

            verification_warning = "; ".join(warnings) if warnings else None
            rationale_str = ". ".join(reasons_list) + "."

            recommendations.append(SkillRecommendation(
                skill_id=skill_id,
                skill_name=skill.skill_name,
                priority_score=priority_score,
                career_importance=item.importance,
                requirement_category=getattr(item, "requirement_category", RequirementCategory.MANDATORY),
                prerequisite_readiness=prereq_score,
                prerequisites_satisfied=satisfied_prereqs,
                unmet_prerequisites=[],
                verification_warning=verification_warning,
                rationale=rationale_str,
                reasons=reasons_list,
                category=skill.category,
                difficulty=skill.difficulty,
                action_type=action_type
            ))

        # Sort by priority score descending
        recommendations.sort(key=lambda r: r.priority_score, reverse=True)
        return recommendations[:top_k]

# Singleton instance
_recommender_instance: Optional[SkillPriorityRecommender] = None

def get_skill_priority_recommender() -> SkillPriorityRecommender:
    global _recommender_instance
    if _recommender_instance is None:
        _recommender_instance = SkillPriorityRecommender()
    return _recommender_instance
