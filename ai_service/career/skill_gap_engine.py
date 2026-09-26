from typing import Dict, List, Optional, Any
from ai_service.core.schemas import (
    StudentProfile, StudentSkillEntry, SkillGapAnalysisResult, SkillGapItem,
    CompetencyProgress, Competency
)
from ai_service.core.enums import (
    VerificationStatus, SkillImportance, RequirementCategory, GapClassification
)
from ai_service.career.career_engine import get_career_profile_engine, generate_competencies_for_pathway
from ai_service.career.dependency_graph import get_dependency_graph
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

class SkillGapEngine:
    """Engine 4: 6-Category Status-Aware & Competency-Aware Skill Gap Analysis Engine."""

    def __init__(self):
        self.career_engine = get_career_profile_engine()
        self.dependency_graph = get_dependency_graph()
        self.taxonomy = get_canonical_taxonomy()

    def analyze_gap(
        self,
        student_profile: StudentProfile,
        career_identifier: str,
        pathway_identifier: Optional[str] = None
    ) -> SkillGapAnalysisResult:
        career = self.career_engine.get_career(career_identifier)
        if not career:
            raise ValueError(f"Career not found: {career_identifier}")

        # If pathway not specified, select the highest relevance candidate pathway
        student_skill_ids = [s.skill_id for s in student_profile.skills if s.skill_id]
        if not pathway_identifier:
            candidates = self.career_engine.find_relevant_pathways(career.career_id, student_skill_ids)
            pathway_identifier = candidates[0]["pathway_id"] if candidates else career.pathways[0].pathway_id

        pathway = self.career_engine.get_pathway(career.career_id, pathway_identifier)
        if not pathway:
            raise ValueError(f"Pathway '{pathway_identifier}' not found in career '{career.career_name}'")

        # Map student skills by ID
        student_map: Dict[str, StudentSkillEntry] = {}
        for entry in student_profile.skills:
            if entry.skill_id:
                student_map[entry.skill_id] = entry
            else:
                norm = self.taxonomy.get_skill(entry.skill_name)
                if norm:
                    student_map[norm.skill_id] = entry

        student_status_map = {k: v.status for k, v in student_map.items()}

        strong_skills: List[SkillGapItem] = []
        evidence_backed_skills: List[SkillGapItem] = []
        claimed_only_skills: List[SkillGapItem] = []
        missing_skills: List[SkillGapItem] = []
        verification_gaps: List[str] = []

        total_core = len(pathway.core_skills)
        verified_count = 0
        covered_count = 0

        for req in pathway.core_skills:
            skill_id = req.skill_id
            skill_name = req.skill_name
            importance = req.importance or SkillImportance.HIGH
            category = req.requirement_category or (
                RequirementCategory.MANDATORY if importance in [SkillImportance.CRITICAL, SkillImportance.HIGH]
                else RequirementCategory.IMPORTANT
            )

            # Check upstream prerequisites
            is_reachable, prereq_score, satisfied_prereqs, warnings = (
                self.dependency_graph.evaluate_prerequisite_readiness(skill_id, student_status_map)
            )
            all_prereqs = self.dependency_graph.get_direct_prerequisites(skill_id)
            unmet_prereqs = [
                self.taxonomy.skills_by_id[pid].skill_name
                for pid in all_prereqs
                if pid in self.taxonomy.skills_by_id and student_status_map.get(pid) not in [VerificationStatus.ASSESSMENT_VERIFIED, VerificationStatus.EVIDENCE_BACKED]
            ]

            if skill_id in student_map:
                covered_count += 1
                entry = student_map[skill_id]
                status = entry.status
                score = entry.assessment_score

                if status == VerificationStatus.ASSESSMENT_VERIFIED:
                    verified_count += 1
                    strong_skills.append(SkillGapItem(
                        skill_id=skill_id,
                        skill_name=skill_name,
                        importance=importance,
                        requirement_category=category,
                        student_status=status,
                        score=score,
                        gap_type="SATISFIED_VERIFIED",
                        gap_classification=GapClassification.SATISFIED_VERIFIED,
                        gap_severity="RESOLVED",
                        priority_level="Verified Competency",
                        verification_warning=None,
                        prerequisites_satisfied=True,
                        unmet_prerequisites=[]
                    ))
                elif status == VerificationStatus.EVIDENCE_BACKED:
                    warning = f"{skill_name} is backed by practical evidence ({', '.join(entry.evidence_sources) if entry.evidence_sources else 'project/certificate'}) but pending assessment verification."
                    verification_gaps.append(warning)
                    evidence_backed_skills.append(SkillGapItem(
                        skill_id=skill_id,
                        skill_name=skill_name,
                        importance=importance,
                        requirement_category=category,
                        student_status=status,
                        score=score,
                        gap_type="ASSESSMENT_GAP",
                        gap_classification=GapClassification.ASSESSMENT_GAP,
                        gap_severity="LOW",
                        priority_level="Assessment Pending",
                        verification_warning=warning,
                        prerequisites_satisfied=True,
                        unmet_prerequisites=[]
                    ))
                elif status == VerificationStatus.CLAIMED:
                    warning = f"{skill_name} is self-reported with no external verification or project artifact."
                    verification_gaps.append(warning)
                    claimed_only_skills.append(SkillGapItem(
                        skill_id=skill_id,
                        skill_name=skill_name,
                        importance=importance,
                        requirement_category=category,
                        student_status=status,
                        score=score,
                        gap_type="CLAIMED_ONLY",
                        gap_classification=GapClassification.CLAIMED_ONLY,
                        gap_severity="MEDIUM",
                        priority_level="Evidence Needed",
                        verification_warning=warning,
                        prerequisites_satisfied=is_reachable,
                        unmet_prerequisites=unmet_prereqs
                    ))
            else:
                # Missing Skill Classification
                if not is_reachable and unmet_prereqs:
                    gap_class = GapClassification.PREREQUISITE_GAP
                    gap_type = "PREREQUISITE_GAP"
                    priority = "Prerequisite Blocked"
                    severity = "HIGH" if category == RequirementCategory.MANDATORY else "MEDIUM"
                    warning = f"Prerequisite {', '.join(unmet_prereqs)} must be satisfied before learning {skill_name}."
                elif is_reachable and prereq_score >= 0.80:
                    gap_class = GapClassification.EVIDENCE_GAP
                    gap_type = "EVIDENCE_GAP"
                    priority = "High Priority Action"
                    severity = "CRITICAL" if importance == SkillImportance.CRITICAL else "HIGH"
                    warning = f"Prerequisites are satisfied. Ready to build project and take assessment in {skill_name}."
                else:
                    gap_class = GapClassification.MISSING
                    gap_type = "MISSING"
                    priority = "High Priority" if category == RequirementCategory.MANDATORY else "Medium Priority"
                    severity = "CRITICAL" if importance == SkillImportance.CRITICAL else ("HIGH" if category == RequirementCategory.MANDATORY else "MEDIUM")
                    warning = f"Core requirement missing from skill passport."

                missing_skills.append(SkillGapItem(
                    skill_id=skill_id,
                    skill_name=skill_name,
                    importance=importance,
                    requirement_category=category,
                    student_status=VerificationStatus.MISSING,
                    score=None,
                    gap_type=gap_type,
                    gap_classification=gap_class,
                    gap_severity=severity,
                    priority_level=priority,
                    verification_warning=warning,
                    prerequisites_satisfied=is_reachable,
                    unmet_prerequisites=unmet_prereqs
                ))

        # Competency Progress Breakdown
        competency_progress: List[CompetencyProgress] = []
        competencies = pathway.competencies or generate_competencies_for_pathway(pathway.pathway_id, pathway.pathway_name, pathway.core_skills)
        for comp in competencies:
            comp_sids = comp.skill_ids
            if not comp_sids:
                continue
            ver_count = sum(1 for sid in comp_sids if sid in student_map and student_map[sid].status in [VerificationStatus.ASSESSMENT_VERIFIED, VerificationStatus.EVIDENCE_BACKED])
            tot_count = len(comp_sids)
            pct = round((ver_count / tot_count) * 100.0, 1)
            is_sat = pct >= 60.0
            status_summary = "Satisfied" if is_sat else f"{tot_count - ver_count} skills needed"
            competency_progress.append(CompetencyProgress(
                competency_id=comp.competency_id,
                competency_name=comp.competency_name,
                coverage_pct=pct,
                verified_skills_count=ver_count,
                total_skills_count=tot_count,
                is_satisfied=is_sat,
                status_summary=status_summary
            ))

        overall_cov = round((covered_count / total_core) * 100.0, 1) if total_core > 0 else 0.0
        verified_cov = round((verified_count / total_core) * 100.0, 1) if total_core > 0 else 0.0

        summary = (
            f"Coverage: {verified_cov}% verified ({verified_count}/{total_core} core skills). "
            f"Identified {len(missing_skills)} missing skills and {len(verification_gaps)} verification gaps."
        )

        return SkillGapAnalysisResult(
            student_id=student_profile.student_id,
            career_id=career.career_id,
            career_name=career.career_name,
            pathway_id=pathway.pathway_id,
            pathway_name=pathway.pathway_name,
            overall_coverage_pct=overall_cov,
            verified_coverage_pct=verified_cov,
            strong_skills=strong_skills,
            evidence_backed_skills=evidence_backed_skills,
            claimed_only_skills=claimed_only_skills,
            missing_skills=missing_skills,
            verification_gaps=verification_gaps,
            competency_progress=competency_progress,
            summary=summary
        )

# Global singleton
_skill_gap_engine_instance: Optional[SkillGapEngine] = None

def get_skill_gap_engine() -> SkillGapEngine:
    global _skill_gap_engine_instance
    if _skill_gap_engine_instance is None:
        _skill_gap_engine_instance = SkillGapEngine()
    return _skill_gap_engine_instance
