import json
from pathlib import Path
from typing import Dict, List, Optional
from ai_service.core.schemas import LearningResource, StudentProfile
from ai_service.core.enums import ResourceType, SkillDifficulty
from ai_service.config.settings import LEARNING_RESOURCES_PATH
from ai_service.career.priority_recommender import get_skill_priority_recommender
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

class LearningResourceRecommender:
    """Module 5: Learning Resource Catalog & Recommender Engine."""

    def __init__(self, catalog_path: Optional[Path] = None):
        self.catalog_path = catalog_path or LEARNING_RESOURCES_PATH
        self.resources_by_id: Dict[str, LearningResource] = {}
        self.resources_by_skill: Dict[str, List[LearningResource]] = {}
        self.taxonomy = get_canonical_taxonomy()
        self._load()

    def _load(self):
        if not self.catalog_path.exists():
            return
        with open(self.catalog_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            for item in data:
                res = LearningResource(**item)
                self.resources_by_id[res.resource_id] = res
                if res.skill_id not in self.resources_by_skill:
                    self.resources_by_skill[res.skill_id] = []
                self.resources_by_skill[res.skill_id].append(res)

    def get_resource(self, resource_id: str) -> Optional[LearningResource]:
        return self.resources_by_id.get(resource_id)

    def get_resources_for_skill(
        self,
        skill_identifier: str,
        resource_type: Optional[ResourceType] = None,
        difficulty: Optional[SkillDifficulty] = None
    ) -> List[LearningResource]:
        """Look up curated learning resources for a skill by ID or name."""
        skill = self.taxonomy.get_skill(skill_identifier)
        skill_id = skill.skill_id if skill else skill_identifier

        resources = self.resources_by_skill.get(skill_id, [])

        if resource_type:
            resources = [r for r in resources if r.resource_type == resource_type]
        if difficulty:
            resources = [r for r in resources if r.difficulty == difficulty]

        # Sort by quality score descending
        return sorted(resources, key=lambda r: r.quality_score, reverse=True)

    def total_resources(self) -> int:
        return len(self.resources_by_id)

    def recommend_resources_for_profile(
        self,
        student_profile: StudentProfile,
        career_identifier: Optional[str] = None,
        pathway_identifier: Optional[str] = None,
        limit_per_skill: int = 2,
        career_id: Optional[str] = None,
        pathway_id: Optional[str] = None,
        max_per_skill: Optional[int] = None
    ) -> Dict[str, List[LearningResource]]:
        """
        Retrieves top learning resources for the student's highest priority recommended skills.
        """
        recommender = get_skill_priority_recommender()
        c_id = career_id or career_identifier or student_profile.career_goal
        p_id = pathway_id or pathway_identifier
        limit = max_per_skill if max_per_skill is not None else limit_per_skill

        rec_skills = recommender.recommend_next_skills(
            student_profile,
            c_id,
            p_id,
            top_k=4
        )

        results: Dict[str, List[LearningResource]] = {}
        for rec in rec_skills:
            res_list = self.get_resources_for_skill(rec.skill_id)
            if res_list:
                results[rec.skill_name] = res_list[:limit]

        return results

# Singleton instance
_resource_recommender_instance: Optional[LearningResourceRecommender] = None

def get_learning_resource_recommender() -> LearningResourceRecommender:
    global _resource_recommender_instance
    if _resource_recommender_instance is None:
        _resource_recommender_instance = LearningResourceRecommender()
    return _resource_recommender_instance
