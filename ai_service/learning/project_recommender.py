import json
from pathlib import Path
from typing import Dict, List, Optional, Any
from ai_service.core.schemas import (
    ProjectItem, ProjectRecommendation, StudentProfile, StudentSkillEntry, ProjectCompletionResponse
)
from ai_service.core.enums import VerificationStatus, ProjectDifficulty
from ai_service.config.settings import PROJECT_CATALOG_PATH
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

class ProjectRecommender:
    """Module 4: Progressive Project Recommendation & Evidence Completion Engine."""

    def __init__(self, catalog_path: Optional[Path] = None):
        self.catalog_path = catalog_path or PROJECT_CATALOG_PATH
        self.projects_by_id: Dict[str, ProjectItem] = {}
        self.catalog: List[ProjectItem] = []
        self.taxonomy = get_canonical_taxonomy()
        self._load()

    def _load(self):
        if not self.catalog_path.exists():
            return
        with open(self.catalog_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            for item in data:
                proj = ProjectItem(**item)
                self.projects_by_id[proj.project_id] = proj
        self.catalog = list(self.projects_by_id.values())

    def get_all_projects(self) -> List[ProjectItem]:
        return list(self.projects_by_id.values())

    def get_project(self, project_id: str) -> Optional[ProjectItem]:
        return self.projects_by_id.get(project_id)

    def recommend_projects(
        self,
        student_profile: StudentProfile,
        career_identifier: Optional[str] = None,
        pathway_identifier: Optional[str] = None,
        limit: int = 3,
        top_k: Optional[int] = None
    ) -> List[ProjectRecommendation]:
        """
        Progressively recommends projects matching student's current capability:
        Targeting ~70-80% known skills + 20-30% new skills to practice.
        Does not recommend projects with unfulfilled prerequisites.
        """
        # Map student skills by ID
        student_skills_map: Dict[str, VerificationStatus] = {}
        for entry in student_profile.skills:
            s_id = entry.skill_id
            if not s_id and entry.skill_name:
                norm = self.taxonomy.get_skill(entry.skill_name)
                if norm:
                    s_id = norm.skill_id
            if s_id:
                student_skills_map[s_id] = entry.status

        target_career = career_identifier or student_profile.career_goal
        target_pathway = pathway_identifier or student_profile.target_pathway

        recommendations: List[ProjectRecommendation] = []

        for proj in self.projects_by_id.values():
            # Skip if already completed
            if proj.project_id in student_profile.completed_projects or proj.title in student_profile.completed_projects:
                continue

            # Career relevance filter if specified
            if target_career and proj.career_relevance and target_career not in proj.career_relevance:
                # Also allow if matching pathway
                if not (target_pathway and target_pathway in proj.pathway_relevance):
                    continue

            # Check prerequisites
            prereqs_satisfied = True
            for prereq_id in proj.prerequisites:
                if prereq_id not in student_skills_map:
                    prereqs_satisfied = False
                    break
            if not prereqs_satisfied:
                continue

            # Evaluate required skills coverage
            required = proj.skills_required
            total_req = len(required)
            if total_req == 0:
                known_count = 0
                known_ratio = 1.0
            else:
                known_count = sum(1 for sid in required if sid in student_skills_map)
                known_ratio = known_count / total_req

            # Pedagogical capability threshold: Student must know at least 70% of required skills
            if known_ratio < 0.69:
                continue

            # Identify which skills will be practiced/reinforced
            skills_to_practice = []
            for sid in proj.skills_practiced:
                skill_obj = self.taxonomy.skills_by_id.get(sid)
                name = skill_obj.skill_name if skill_obj else sid
                skills_to_practice.append(name)

            # Score suitability: higher when known ratio is in the sweet spot (0.75 - 1.0)
            suitability = round(min(1.0, 0.50 + (known_ratio * 0.40) + (0.10 if target_pathway and target_pathway in proj.pathway_relevance else 0.0)), 2)

            # Build human-readable reason
            known_skill_names = [
                self.taxonomy.skills_by_id[sid].skill_name
                for sid in required if sid in student_skills_map and sid in self.taxonomy.skills_by_id
            ][:2]
            reason = (
                f"Matches your background in {', '.join(known_skill_names) if known_skill_names else 'foundations'} "
                f"while giving you hands-on practice in {', '.join(skills_to_practice[:2])}."
            )

            recommendations.append(ProjectRecommendation(
                project=proj,
                suitability_score=suitability,
                reason=reason,
                known_skills_count=known_count,
                total_required_count=total_req,
                skills_to_practice=skills_to_practice
            ))

        # Sort by suitability descending
        recommendations.sort(key=lambda r: r.suitability_score, reverse=True)
        effective_limit = top_k if top_k is not None else limit
        return recommendations[:effective_limit]

    def complete_project(
        self,
        student_profile: StudentProfile,
        project_id: str,
        artifact_url: Optional[str] = None
    ) -> ProjectCompletionResponse:
        """
        Records project completion and converts practiced CLAIMED skills into EVIDENCE_BACKED.
        NEVER automatically converts skills to ASSESSMENT_VERIFIED.
        """
        proj = self.get_project(project_id)
        if not proj:
            raise ValueError(f"Project '{project_id}' not found in catalog.")

        # 1. Add to completed projects
        if project_id not in student_profile.completed_projects:
            student_profile.completed_projects.append(project_id)
        if proj.title not in student_profile.completed_projects:
            student_profile.completed_projects.append(proj.title)

        promoted_skills: List[str] = []
        evidence_tag = f"project: {proj.title}"
        if artifact_url:
            evidence_tag += f" ({artifact_url})"

        # 2. Update skills practiced
        student_skill_dict: Dict[str, StudentSkillEntry] = {}
        for entry in student_profile.skills:
            s_id = entry.skill_id
            if not s_id and entry.skill_name:
                norm = self.taxonomy.get_skill(entry.skill_name)
                if norm:
                    s_id = norm.skill_id
            if s_id:
                student_skill_dict[s_id] = entry

        for s_id in proj.skills_practiced:
            skill_obj = self.taxonomy.skills_by_id.get(s_id)
            skill_name = skill_obj.skill_name if skill_obj else s_id

            if s_id in student_skill_dict:
                entry = student_skill_dict[s_id]
                if evidence_tag not in entry.evidence_sources:
                    entry.evidence_sources.append(evidence_tag)

                # If previously CLAIMED, promote to EVIDENCE_BACKED
                if entry.status == VerificationStatus.CLAIMED:
                    entry.status = VerificationStatus.EVIDENCE_BACKED
                    promoted_skills.append(skill_name)
                elif entry.status == VerificationStatus.ASSESSMENT_VERIFIED:
                    # Keep verified, do not downgrade
                    pass
                elif entry.status == VerificationStatus.EVIDENCE_BACKED:
                    pass
            else:
                # Add new evidence-backed skill entry
                new_entry = StudentSkillEntry(
                    skill_id=s_id,
                    skill_name=skill_name,
                    status=VerificationStatus.EVIDENCE_BACKED,
                    assessment_score=None,
                    evidence_sources=[evidence_tag]
                )
                student_profile.skills.append(new_entry)
                promoted_skills.append(skill_name)

        msg = (
            f"Successfully completed '{proj.title}'. "
            f"{len(promoted_skills)} skill(s) updated with project evidence. "
            f"Note: These skills are now Evidence-Backed and require passing SkillSync assessments for verified status."
        )

        return ProjectCompletionResponse(
            student_id=student_profile.student_id,
            project_id=proj.project_id,
            project_title=proj.title,
            promoted_skills=promoted_skills,
            updated_profile=student_profile,
            message=msg
        )

# Singleton instance
_project_recommender_instance: Optional[ProjectRecommender] = None

def get_project_recommender() -> ProjectRecommender:
    global _project_recommender_instance
    if _project_recommender_instance is None:
        _project_recommender_instance = ProjectRecommender()
    return _project_recommender_instance
