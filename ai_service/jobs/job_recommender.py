from typing import List, Optional
from ai_service.core.enums import VerificationStatus
from ai_service.core.schemas import (
    StudentProfile, JobPosting, JobRecommendation, JobMatchResult
)
from ai_service.jobs.job_catalog_loader import get_job_catalog
from ai_service.jobs.job_matcher import get_job_matcher

RELATED_CAREER_DOMAINS = {
    "CAR-BACKEND": {"CAR-FULLSTACK", "CAR-DEVOPS", "CAR-DATA-ENG"},
    "CAR-FRONTEND": {"CAR-FULLSTACK", "CAR-MOBILE"},
    "CAR-FULLSTACK": {"CAR-BACKEND", "CAR-FRONTEND"},
    "CAR-DEVOPS": {"CAR-BACKEND", "CAR-CYBER"},
    "CAR-AI-ENG": {"CAR-DATA-ENG", "CAR-BACKEND"},
    "CAR-DATA-ENG": {"CAR-AI-ENG", "CAR-BACKEND"},
    "CAR-CYBER": {"CAR-DEVOPS", "CAR-BACKEND"},
    "CAR-MOBILE": {"CAR-FRONTEND", "CAR-FULLSTACK"}
}

class JobRecommender:
    _instance = None

    def __init__(self):
        self.catalog = get_job_catalog()
        self.matcher = get_job_matcher()

    def recommend_jobs(
        self,
        student_profile: StudentProfile,
        career_id: Optional[str] = None,
        limit: int = 6
    ) -> List[JobRecommendation]:
        all_jobs = self.catalog.get_all_jobs()
        target_career = career_id or student_profile.career_goal

        recommendations: List[JobRecommendation] = []

        for job in all_jobs:
            match_res: JobMatchResult = self.matcher.match_job(student_profile, job)

            # 1. Skill Match Component (0.50)
            s_skill = match_res.overall_match_pct / 100.0

            # 2. Career Domain Alignment (0.20)
            if target_career and job.career_id == target_career:
                s_career = 1.0
            elif target_career and job.career_id in RELATED_CAREER_DOMAINS.get(target_career, set()):
                s_career = 0.6
            else:
                s_career = 0.2

            # 3. Experience Fit (0.15)
            exp_text = str(job.experience_level.value if hasattr(job.experience_level, "value") else job.experience_level)
            if "Entry" in exp_text or "Internship" in exp_text:
                s_exp = 1.0
            elif "Associate" in exp_text:
                s_exp = 0.8
            elif "Mid" in exp_text:
                s_exp = 0.5
            else:
                s_exp = 0.2

            # 4. Verification Confidence (0.15)
            if match_res.matched_skills:
                verified_count = sum(
                    1 for s in match_res.matched_skills
                    if s.student_status in [VerificationStatus.ASSESSMENT_VERIFIED, VerificationStatus.EVIDENCE_BACKED]
                )
                s_conf = verified_count / len(match_res.matched_skills)
            else:
                s_conf = 0.3

            # Combined Multi-Factor Score
            final_score = (
                0.50 * s_skill +
                0.20 * s_career +
                0.15 * s_exp +
                0.15 * s_conf
            )
            final_score = round(final_score, 3)

            # Generate Explainability Reasons
            reasons: List[str] = []
            if s_career == 1.0:
                reasons.append(f"Direct alignment with your target career goal ({job.career_id}).")
            elif s_career == 0.6:
                reasons.append(f"Adjacent discipline to your target career path ({job.career_id}).")

            if match_res.overall_match_pct >= 80.0:
                reasons.append(f"Strong competency match ({match_res.overall_match_pct}%).")
            elif match_res.overall_match_pct >= 50.0:
                reasons.append(f"Moderate competency match ({match_res.overall_match_pct}%).")

            if s_conf >= 0.7:
                reasons.append("High verification confidence: primary skills backed by assessments or projects.")

            if match_res.gap_impacts:
                top_gap = match_res.gap_impacts[0]
                reasons.append(
                    f"Acquiring '{top_gap.skill_name}' boosts your match by +{top_gap.score_lift_pct}% "
                    f"to {top_gap.projected_match_pct}%."
                )

            recommendations.append(JobRecommendation(
                job=job,
                recommendation_score=final_score,
                match_result=match_res,
                career_alignment_score=round(s_career, 2),
                experience_fit_score=round(s_exp, 2),
                confidence_score=round(s_conf, 2),
                explainability_reasons=reasons
            ))

        # Rank by recommendation_score descending
        recommendations.sort(key=lambda r: r.recommendation_score, reverse=True)
        return recommendations[:limit]

def get_job_recommender() -> JobRecommender:
    if JobRecommender._instance is None:
        JobRecommender._instance = JobRecommender()
    return JobRecommender._instance
