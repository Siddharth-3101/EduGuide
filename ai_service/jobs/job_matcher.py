from typing import Dict, List, Optional
from ai_service.core.enums import VerificationStatus, JobMatchTier
from ai_service.core.schemas import (
    JobPosting, StudentProfile, JobMatchResult,
    JobSkillMatchDetail, GapImpactItem
)
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy
from ai_service.taxonomy.normalizer import get_skill_normalizer

from ai_service.taxonomy.semantic_matcher import get_semantic_skill_matcher

VERIFICATION_WEIGHTS = {
    VerificationStatus.ASSESSMENT_VERIFIED: 1.00,
    VerificationStatus.EVIDENCE_BACKED: 0.85,
    VerificationStatus.CLAIMED: 0.40,
    VerificationStatus.MISSING: 0.00,
}

class JobMatcher:
    _instance = None

    def __init__(self):
        self.taxonomy = get_canonical_taxonomy()
        self.normalizer = get_skill_normalizer()
        self.semantic_matcher = get_semantic_skill_matcher()

    def _index_student_skills(self, student_profile: StudentProfile) -> Dict[str, VerificationStatus]:
        """Indexes student skills by canonical skill_id and normalized names."""
        index: Dict[str, VerificationStatus] = {}
        for entry in student_profile.skills:
            if entry.skill_id:
                index[entry.skill_id] = entry.status
            if entry.skill_name:
                norm_res = self.normalizer.normalize(entry.skill_name)
                if norm_res.canonical_skill_id:
                    index[norm_res.canonical_skill_id] = entry.status
                index[entry.skill_name.lower().strip()] = entry.status
        return index

    def match_job(self, student_profile: StudentProfile, job: JobPosting) -> JobMatchResult:
        student_skills = self._index_student_skills(student_profile)

        matched_skills: List[JobSkillMatchDetail] = []
        missing_required: List[JobSkillMatchDetail] = []
        missing_preferred: List[JobSkillMatchDetail] = []
        claimed_only_names: List[str] = []

        req_weights: List[float] = []
        pref_weights: List[float] = []

        # Evaluate Required Skills
        for req in job.required_skills:
            status = student_skills.get(req.skill_id, student_skills.get(req.skill_name.lower().strip(), VerificationStatus.MISSING))
            weight = VERIFICATION_WEIGHTS.get(status, 0.0)
            req_weights.append(weight)

            warning = None
            if status == VerificationStatus.CLAIMED:
                warning = f"Self-reported claim for '{req.skill_name}'. Pass assessment to maximize employer match score."
                claimed_only_names.append(req.skill_name)

            detail = JobSkillMatchDetail(
                skill_id=req.skill_id,
                skill_name=req.skill_name,
                is_required=True,
                importance=req.importance,
                student_status=status,
                weight_contribution=weight,
                verification_warning=warning
            )

            if status != VerificationStatus.MISSING:
                matched_skills.append(detail)
            else:
                missing_required.append(detail)

        # Evaluate Preferred Skills
        for pref in job.preferred_skills:
            status = student_skills.get(pref.skill_id, student_skills.get(pref.skill_name.lower().strip(), VerificationStatus.MISSING))
            weight = VERIFICATION_WEIGHTS.get(status, 0.0)
            pref_weights.append(weight)

            warning = None
            if status == VerificationStatus.CLAIMED:
                warning = f"Self-reported claim for preferred skill '{pref.skill_name}'."
                claimed_only_names.append(pref.skill_name)

            detail = JobSkillMatchDetail(
                skill_id=pref.skill_id,
                skill_name=pref.skill_name,
                is_required=False,
                importance=pref.importance,
                student_status=status,
                weight_contribution=weight,
                verification_warning=warning
            )

            if status != VerificationStatus.MISSING:
                matched_skills.append(detail)
            else:
                missing_preferred.append(detail)

        # Calculate Base Requirement & Preferred Scores
        req_score = sum(req_weights) / len(req_weights) if req_weights else 1.0
        pref_score = sum(pref_weights) / len(pref_weights) if pref_weights else 1.0

        # Calculate Evidence Strength (proportion of verified / evidence-backed skills)
        if matched_skills:
            verified_or_evidence = sum(
                1 for s in matched_skills
                if s.student_status in [VerificationStatus.ASSESSMENT_VERIFIED, VerificationStatus.EVIDENCE_BACKED]
            )
            evidence_strength = round(verified_or_evidence / len(matched_skills), 3)
        else:
            evidence_strength = 0.0

        # Semantic Similarity between student profile & job
        student_text_parts = [s.skill_name for s in student_profile.skills if s.skill_name]
        student_text_parts += getattr(student_profile, "completed_projects", [])
        student_text = " ".join(student_text_parts)

        job_text_parts = [r.skill_name for r in job.required_skills] + [p.skill_name for p in job.preferred_skills]
        if job.description:
            job_text_parts.append(job.description[:200])
        job_text = " ".join(job_text_parts)

        semantic_sim = self.semantic_matcher.calculate_semantic_similarity(student_text, job_text) if (student_text and job_text) else 0.50

        # Composite Match Score
        if job.required_skills and job.preferred_skills:
            overall_pct = (0.70 * req_score + 0.20 * pref_score + 0.10 * semantic_sim) * 100.0
        elif job.required_skills:
            overall_pct = (0.85 * req_score + 0.15 * semantic_sim) * 100.0
        elif job.preferred_skills:
            overall_pct = (0.85 * pref_score + 0.15 * semantic_sim) * 100.0
        else:
            overall_pct = 100.0

        overall_pct = min(100.0, max(0.0, round(overall_pct, 1)))
        req_pct = min(100.0, max(0.0, round(req_score * 100.0, 1)))
        pref_pct = min(100.0, max(0.0, round(pref_score * 100.0, 1)))

        if overall_pct >= 80.0:
            tier = JobMatchTier.STRONG_MATCH
        elif overall_pct >= 50.0:
            tier = JobMatchTier.MODERATE_MATCH
        else:
            tier = JobMatchTier.DEVELOPING_MATCH

        # Compute Counterfactual Gap Impacts
        gap_impacts = self.compute_gap_impacts(student_profile, job, overall_pct, missing_required, missing_preferred)

        # Generate Main Recommendation
        if tier == JobMatchTier.STRONG_MATCH:
            if claimed_only_names:
                main_rec = f"Strong candidate! Verify claimed '{claimed_only_names[0]}' to further boost your ranking."
            else:
                main_rec = "Excellent profile match! Submit your application and highlight verified projects."
        elif tier == JobMatchTier.MODERATE_MATCH:
            if missing_required:
                main_rec = f"Bridge required gap '{missing_required[0].skill_name}' via roadmap to reach 80%+ match tier."
            else:
                main_rec = "Good baseline match. Verify remaining skills through assessments."
        else:
            main_rec = "Focus on foundational roadmap milestones before applying to this position."

        summary = (
            f"{job.title} at {job.company}: {overall_pct}% match ({tier.value}). "
            f"You satisfy {len(matched_skills)}/{len(job.required_skills) + len(job.preferred_skills)} total skills "
            f"({len(missing_required)} required skills missing)."
        )

        return JobMatchResult(
            job_id=job.job_id,
            job_title=job.title,
            company=job.company,
            overall_match_pct=overall_pct,
            required_match_pct=req_pct,
            preferred_match_pct=pref_pct,
            match_tier=tier,
            matched_skills=matched_skills,
            missing_required_skills=missing_required,
            missing_preferred_skills=missing_preferred,
            claimed_only_skills=claimed_only_names,
            gap_impacts=gap_impacts,
            evidence_strength_score=evidence_strength,
            semantic_similarity_score=semantic_sim,
            main_recommendation=main_rec,
            summary=summary
        )

    def compute_gap_impacts(
        self,
        student_profile: StudentProfile,
        job: JobPosting,
        base_match_pct: float,
        missing_required: List[JobSkillMatchDetail],
        missing_preferred: List[JobSkillMatchDetail]
    ) -> List[GapImpactItem]:
        """
        Calculates counterfactual score lift if the student closes each specific missing gap
        with verified mastery (ASSESSMENT_VERIFIED = 1.0).
        """
        impacts: List[GapImpactItem] = []
        all_missing = [(m, True) for m in missing_required] + [(m, False) for m in missing_preferred]

        total_req = len(job.required_skills) or 1
        total_pref = len(job.preferred_skills) or 1
        has_both = bool(job.required_skills and job.preferred_skills)

        for item, is_req in all_missing:
            # Lift calculation:
            if has_both:
                weight_share = 0.75 if is_req else 0.25
                count = total_req if is_req else total_pref
                lift_pct = round((weight_share / count) * 100.0, 1)
            else:
                count = total_req if is_req else total_pref
                lift_pct = round((1.0 / count) * 100.0, 1)

            projected_pct = min(100.0, round(base_match_pct + lift_pct, 1))
            action = f"Complete practical project & verify '{item.skill_name}' via proctored assessment."

            impacts.append(GapImpactItem(
                skill_id=item.skill_id,
                skill_name=item.skill_name,
                is_required=is_req,
                current_match_pct=base_match_pct,
                projected_match_pct=projected_pct,
                score_lift_pct=lift_pct,
                recommended_action=action
            ))

        # Sort by lift descending
        impacts.sort(key=lambda x: x.score_lift_pct, reverse=True)
        return impacts

def get_job_matcher() -> JobMatcher:
    if JobMatcher._instance is None:
        JobMatcher._instance = JobMatcher()
    return JobMatcher._instance
