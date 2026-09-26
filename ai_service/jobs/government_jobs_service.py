import json
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

from ai_service.core.schemas import StudentProfile

logger = logging.getLogger(__name__)

class GovernmentJobsService:
    """Service for Indian Government Technical Examinations, PSU Recruitment, and Public R&D Paths."""

    def __init__(self, catalog_path: Optional[Path] = None):
        if catalog_path is None:
            catalog_path = Path(__file__).resolve().parent.parent / "data" / "jobs" / "government_exams_catalog.json"
        self.catalog_path = catalog_path
        self._exams: List[Dict[str, Any]] = []
        self._load_catalog()

    def _load_catalog(self):
        try:
            if self.catalog_path.exists():
                with open(self.catalog_path, "r", encoding="utf-8") as f:
                    self._exams = json.load(f)
                logger.info(f"Loaded {len(self._exams)} government exams into knowledge base.")
            else:
                logger.warning(f"Government exams catalog not found at {self.catalog_path}")
        except Exception as e:
            logger.error(f"Error loading government exams catalog: {e}")
            self._exams = []

    def get_all_exams(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict[str, Any]]:
        exams = self._exams
        if category and category.lower() != "all":
            exams = [e for e in exams if e.get("category", "").lower() == category.lower()]
        if search:
            q = search.lower()
            exams = [
                e for e in exams
                if q in e.get("exam_name", "").lower()
                or q in e.get("conducting_body", "").lower()
                or q in e.get("role_title", "").lower()
                or q in e.get("description", "").lower()
            ]
        return exams

    def get_exam_by_id(self, exam_id: str) -> Optional[Dict[str, Any]]:
        for e in self._exams:
            if e.get("exam_id") == exam_id:
                return e
        return None

    def recommend_for_student(self, profile: StudentProfile, limit: int = 6) -> List[Dict[str, Any]]:
        """
        Evaluates student's verified and evidence-backed skills against government exam requirements.
        Ranks government examinations by technical readiness and qualification fit.
        """
        student_skill_map = {}
        for s in profile.skills:
            weight = 1.0 if s.status == "ASSESSMENT_VERIFIED" else (0.75 if s.status == "EVIDENCE_BACKED" else 0.4)
            student_skill_map[s.skill_name.lower()] = weight

        results = []
        for exam in self._exams:
            key_skills = exam.get("key_skills_tested", [])
            matched_skills = []
            missing_skills = []
            score_acc = 0.0
            max_score = 0.0

            for ks in key_skills:
                importance_weight = 2.0 if ks.get("importance") == "CRITICAL" else (1.5 if ks.get("importance") == "HIGH" else 1.0)
                max_score += importance_weight
                s_name = ks.get("skill_name", "")
                s_lower = s_name.lower()

                if s_lower in student_skill_map:
                    matched_skills.append(s_name)
                    score_acc += importance_weight * student_skill_map[s_lower]
                else:
                    missing_skills.append(s_name)

            readiness_pct = int(round((score_acc / max_score) * 100)) if max_score > 0 else 75
            readiness_pct = min(98, max(45, readiness_pct))

            results.append({
                "exam_id": exam["exam_id"],
                "exam_name": exam["exam_name"],
                "conducting_body": exam["conducting_body"],
                "role_title": exam["role_title"],
                "pay_scale": exam.get("pay_scale", "Gazetted Pay Scale"),
                "category": exam.get("category", "General"),
                "readiness_percentage": readiness_pct,
                "matched_skills": matched_skills,
                "missing_skills": missing_skills,
                "official_portal_url": exam["official_portal_url"],
                "age_limit": exam.get("age_limit", "28 years"),
                "selection_process": exam.get("selection_process", ""),
                "description": exam.get("description", ""),
                "study_materials_count": len(exam.get("study_materials", [])),
                "syllabus_sections": exam.get("syllabus_sections", []),
                "study_materials": exam.get("study_materials", []),
                "application_procedure": exam.get("application_procedure", [])
            })

        results.sort(key=lambda x: x["readiness_percentage"], reverse=True)
        return results[:limit]

# Singleton
_gov_jobs_service: Optional[GovernmentJobsService] = None

def get_government_jobs_service() -> GovernmentJobsService:
    global _gov_jobs_service
    if _gov_jobs_service is None:
        _gov_jobs_service = GovernmentJobsService()
    return _gov_jobs_service
