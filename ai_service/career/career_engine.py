import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
from ai_service.core.schemas import (
    CareerProfile, CareerPathway, PathwayRecommendation,
    Competency, CompetencyProgress, StudentProfile, Provenance
)
from ai_service.core.enums import (
    VerificationStatus, SkillImportance, RequirementCategory, SourceType, ValidationStatus
)
from ai_service.config.settings import STRUCTURED_ROADMAPS_PATH, CONFIG
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

def generate_competencies_for_pathway(pathway_id: str, pathway_name: str, core_skills: List[Any]) -> List[Competency]:
    """Dynamically organizes pathway skills into coherent functional competency clusters."""
    p_id_lower = pathway_id.lower()
    p_name_lower = pathway_name.lower()
    all_sids = [s.skill_id if hasattr(s, "skill_id") else s.get("skill_id") for s in core_skills if s]

    # Domain-specific functional grouping
    if "ai" in p_id_lower or "ml" in p_id_lower or "data" in p_name_lower:
        comp1 = Competency(
            competency_id="COMP-AI-CORE",
            competency_name="Core Mathematical & Language Foundations",
            description="Foundational programming in Python, linear algebra, vector arithmetic, and data manipulation.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0012", "SKL-0001", "SKL-0002", "SKL-0060", "SKL-0051", "SKL-0047"]]
        )
        comp2 = Competency(
            competency_id="COMP-AI-MODELS",
            competency_name="Deep Learning & Neural Architectures",
            description="Designing and training multi-layer neural networks, CNNs, autograd backprop, and PyTorch tensors.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0061", "SKL-0067", "SKL-0068", "SKL-0069", "SKL-0064"]]
        )
        comp3 = Competency(
            competency_id="COMP-AI-GENAI",
            competency_name="Generative AI & LLM Systems",
            description="Transformer attention mechanisms, RAG retrieval architectures, Vector DB indexes, and agent orchestration.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0070", "SKL-0071", "SKL-0073", "SKL-0075", "SKL-0077", "SKL-0211"]]
        )
        comp4 = Competency(
            competency_id="COMP-AI-PROD",
            competency_name="Production MLOps & Model Deployment",
            description="Packaging model artifacts into Docker containers, low-latency FastAPI endpoints, and monitoring metrics.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0040", "SKL-0114", "SKL-0097", "SKL-0113", "SKL-0120"]]
        )
        comps = [comp1, comp2, comp3, comp4]
        assigned = set(comp1.skill_ids + comp2.skill_ids + comp3.skill_ids + comp4.skill_ids)
        unassigned = [sid for sid in all_sids if sid not in assigned]
        if unassigned:
            comps.append(Competency(
                competency_id="COMP-AI-SPEC",
                competency_name="Applied Specialization Competencies",
                description="Domain-specific capabilities and supporting ecosystem skills.",
                skill_ids=unassigned
            ))
        return [c for c in comps if c.skill_ids]

    elif "front" in p_id_lower or "react" in p_name_lower:
        comp1 = Competency(
            competency_id="COMP-FE-CORE",
            competency_name="Core Web & JavaScript Foundations",
            description="HTML5 semantics, modern responsive CSS layouts, ES6+ syntax, and strict TypeScript types.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0021", "SKL-0022", "SKL-0013", "SKL-0014", "SKL-0023"]]
        )
        comp2 = Competency(
            competency_id="COMP-FE-FRAMEWORK",
            competency_name="Declarative UI & Framework Architecture",
            description="Component lifecycles, state management, custom hooks, and Next.js SSR/SSG rendering.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0027", "SKL-0028", "SKL-0029", "SKL-0030", "SKL-0031"]]
        )
        comp3 = Competency(
            competency_id="COMP-FE-PERF",
            competency_name="Web Performance, Testing & Delivery",
            description="Core Web Vitals optimization, accessibility (WCAG), component unit tests, and CI pipelines.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0024", "SKL-0025", "SKL-0026", "SKL-0113", "SKL-0114"]]
        )
        comps = [comp1, comp2, comp3]
        assigned = set(comp1.skill_ids + comp2.skill_ids + comp3.skill_ids)
        unassigned = [sid for sid in all_sids if sid not in assigned]
        if unassigned:
            comps.append(Competency(
                competency_id="COMP-FE-SPEC",
                competency_name="Specialized Frontend Tooling",
                description="Supporting design systems, styling frameworks, and client tooling.",
                skill_ids=unassigned
            ))
        return [c for c in comps if c.skill_ids]

    elif "java" in p_id_lower or "java" in p_name_lower or "backend" in p_id_lower:
        comp1 = Competency(
            competency_id="COMP-BE-LANG",
            competency_name="Core Language & Enterprise Architecture",
            description="Core language syntax, OOP design patterns, concurrency, and memory management.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0013", "SKL-0012", "SKL-0014", "SKL-0001", "SKL-0002", "SKL-0044"]] or all_sids[:max(1, len(all_sids)//3)]
        )
        comp2 = Competency(
            competency_id="COMP-BE-DATA",
            competency_name="Databases, ORM & Data Access",
            description="Relational databases, SQL queries, JPA/Hibernate, connection pooling, and caching.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0080", "SKL-0081", "SKL-0085", "SKL-0086", "SKL-0089", "SKL-0090"]] or all_sids[max(1, len(all_sids)//3):max(2, (len(all_sids)*2)//3)]
        )
        comp3 = Competency(
            competency_id="COMP-BE-API",
            competency_name="REST APIs, Security & Cloud Deployment",
            description="Building RESTful services, JWT/OAuth auth, Docker containerization, and cloud deployment.",
            skill_ids=[sid for sid in all_sids if sid in ["SKL-0041", "SKL-0042", "SKL-0043", "SKL-0114", "SKL-0115", "SKL-0120"]] or all_sids[max(2, (len(all_sids)*2)//3):]
        )
        comps = [comp1, comp2, comp3]
        assigned = set(comp1.skill_ids + comp2.skill_ids + comp3.skill_ids)
        unassigned = [sid for sid in all_sids if sid not in assigned]
        if unassigned:
            comps.append(Competency(
                competency_id="COMP-BE-ADV",
                competency_name="Advanced Backend Engineering",
                description="Message queues, caching, testing, and microservices.",
                skill_ids=unassigned
            ))
        return [c for c in comps if c.skill_ids]

    # Default Generic Clustering
    comp1 = Competency(
        competency_id="COMP-CORE-PROG",
        competency_name="Core Language & Algorithmic Foundations",
        description="Mastery of procedural logic, OOP architecture, and data structures.",
        skill_ids=[sid for sid in all_sids[:max(2, len(all_sids)//3)]]
    )
    comp2 = Competency(
        competency_id="COMP-ARCH-DATA",
        competency_name="Service Architecture & Data Persistence",
        description="Relational data retrieval, indexing, microservice endpoints, and REST APIs.",
        skill_ids=[sid for sid in all_sids[max(2, len(all_sids)//3):max(4, (len(all_sids)*2)//3)]]
    )
    comp3 = Competency(
        competency_id="COMP-CLOUD-DEVOPS",
        competency_name="Infrastructure, Containers & Deployment",
        description="Container packaging, cloud topology, automated CI/CD pipelines, and observability.",
        skill_ids=[sid for sid in all_sids[max(4, (len(all_sids)*2)//3):]]
    )
    return [c for c in [comp1, comp2, comp3] if c.skill_ids]

class CareerProfileEngine:
    """Engine 2: Career Profile & Hybrid Candidate Pathway Engine."""

    def __init__(self, roadmaps_path: Optional[Path] = None):
        self.roadmaps_path = roadmaps_path or STRUCTURED_ROADMAPS_PATH
        self.careers_by_id: Dict[str, CareerProfile] = {}
        self.careers_by_name: Dict[str, CareerProfile] = {}
        self._load()

    def _load(self):
        if not self.roadmaps_path.exists():
            return
        with open(self.roadmaps_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            for item in data:
                career = CareerProfile(**item)
                # Augment pathways with competencies if empty
                for pathway in career.pathways:
                    if not pathway.competencies:
                        pathway.competencies = generate_competencies_for_pathway(
                            pathway.pathway_id, pathway.pathway_name, pathway.core_skills
                        )
                self.careers_by_id[career.career_id] = career
                self.careers_by_name[career.career_name.lower()] = career

    def get_all_careers(self) -> List[CareerProfile]:
        return list(self.careers_by_id.values())

    def get_career(self, identifier: str) -> Optional[CareerProfile]:
        if not identifier:
            return None
        if identifier in self.careers_by_id:
            return self.careers_by_id[identifier]
        return self.careers_by_name.get(identifier.lower())

    def get_pathways_for_career(self, career_id: str) -> List[CareerPathway]:
        career = self.get_career(career_id)
        return career.pathways if career else []

    def get_pathway(self, career_identifier: str, pathway_identifier: str) -> Optional[CareerPathway]:
        career = self.get_career(career_identifier)
        if not career:
            return None
        for p in career.pathways:
            if p.pathway_id == pathway_identifier or p.pathway_name.lower() == pathway_identifier.lower():
                return p
        return None

    def find_relevant_pathways(
        self,
        career_identifier: str,
        student_skill_ids: List[str]
    ) -> List[Dict[str, Any]]:
        """Identifies candidate pathways for a career based on skill overlap and competency alignment."""
        career = self.get_career(career_identifier)
        if not career:
            return []

        student_set = set(student_skill_ids)
        candidate_pathways = []

        for pathway in career.pathways:
            core_skill_ids = [req.skill_id for req in pathway.core_skills]
            if not core_skill_ids:
                continue

            matching_skills = [sid for sid in core_skill_ids if sid in student_set]
            overlap_count = len(matching_skills)
            total_core = len(core_skill_ids)
            relevance_pct = round((overlap_count / total_core) * 100.0, 1)

            candidate_pathways.append({
                "pathway_id": pathway.pathway_id,
                "pathway_name": pathway.pathway_name,
                "description": pathway.description,
                "total_core_skills": total_core,
                "matching_skills_count": overlap_count,
                "relevance_pct": relevance_pct,
                "provenance": pathway.provenance.model_dump() if pathway.provenance else None
            })

        candidate_pathways.sort(key=lambda x: x["relevance_pct"], reverse=True)
        return candidate_pathways

    def recommend_pathways(
        self,
        student_profile: Any,
        career_identifier: Optional[str] = None
    ) -> List[PathwayRecommendation]:
        """
        Multi-Factor Hybrid Pathway Recommendation Engine 2.0:
        Combines:
        1. Skill Alignment (Core & mandatory skills)
        2. Verification Strength (Verified vs Evidence vs Claimed)
        3. Competency Alignment (Coverage across functional pillars)
        4. Project Alignment (Practical repository / domain evidence)
        5. Interest Alignment (Declared candidate interests)
        6. Prerequisite Readiness (DAG reachable state)
        7. Semantic Profile Similarity (Vector cosine match)
        """
        from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy
        from ai_service.taxonomy.semantic_matcher import get_semantic_matcher
        from ai_service.career.dependency_graph import get_dependency_graph

        target_career = career_identifier or getattr(student_profile, "career_goal", None)
        career = self.get_career(target_career)
        if not career:
            return []

        taxonomy = get_canonical_taxonomy()
        semantic_matcher = get_semantic_matcher()
        dep_graph = get_dependency_graph()

        # Build student status map
        student_status_map: Dict[str, Any] = {}
        for entry in getattr(student_profile, "skills", []):
            s_id = getattr(entry, "skill_id", None)
            s_name = getattr(entry, "skill_name", None)
            if not s_id and s_name:
                norm = taxonomy.get_skill(s_name)
                if norm:
                    s_id = norm.skill_id
            if s_id:
                student_status_map[s_id] = entry

        interests = [i.lower() for i in getattr(student_profile, "interests", [])]
        completed_projects = getattr(student_profile, "completed_projects", [])

        # Load weights from config
        weights = CONFIG.get("pathway_scoring_weights", {
            "skill_alignment": 0.30,
            "verification_strength": 0.20,
            "competency_alignment": 0.20,
            "project_alignment": 0.15,
            "interest_alignment": 0.10,
            "prerequisite_readiness": 0.05
        })

        status_weights = {
            VerificationStatus.ASSESSMENT_VERIFIED: 1.00,
            VerificationStatus.EVIDENCE_BACKED: 0.80,
            VerificationStatus.CLAIMED: 0.40,
            VerificationStatus.MISSING: 0.00
        }

        # Build student text summary for semantic similarity
        student_skill_names = [getattr(e, "skill_name", "") for e in getattr(student_profile, "skills", [])]
        student_summary = f"{getattr(student_profile, 'career_goal', '')} {' '.join(student_skill_names)} {' '.join(completed_projects)}"

        recommendations: List[PathwayRecommendation] = []

        for pathway in career.pathways:
            core_reqs = pathway.core_skills
            if not core_reqs:
                continue

            total_core = len(core_reqs)
            verified_count = 0
            evidence_count = 0
            claimed_count = 0
            matched_count = 0
            weighted_verification_sum = 0.0

            verified_names = []
            evidence_names = []
            missing_names = []

            for req in core_reqs:
                entry = student_status_map.get(req.skill_id)
                status = getattr(entry, "status", VerificationStatus.MISSING) if entry else VerificationStatus.MISSING
                w = status_weights.get(status, 0.0)
                weighted_verification_sum += w

                if status == VerificationStatus.ASSESSMENT_VERIFIED:
                    verified_count += 1
                    matched_count += 1
                    verified_names.append(req.skill_name)
                elif status == VerificationStatus.EVIDENCE_BACKED:
                    evidence_count += 1
                    matched_count += 1
                    evidence_names.append(req.skill_name)
                elif status == VerificationStatus.CLAIMED:
                    claimed_count += 1
                    matched_count += 1
                else:
                    missing_names.append(req.skill_name)

            skill_alignment_score = matched_count / total_core if total_core > 0 else 0.0
            verification_strength_score = weighted_verification_sum / total_core if total_core > 0 else 0.0

            # 3. Competency Alignment
            strong_competencies: List[str] = []
            weak_competencies: List[str] = []
            satisfied_comp_count = 0
            competencies = pathway.competencies or generate_competencies_for_pathway(pathway.pathway_id, pathway.pathway_name, core_reqs)

            for comp in competencies:
                comp_sids = comp.skill_ids
                if not comp_sids:
                    continue
                comp_matches = [sid for sid in comp_sids if sid in student_status_map and getattr(student_status_map[sid], "status", None) in [VerificationStatus.ASSESSMENT_VERIFIED, VerificationStatus.EVIDENCE_BACKED]]
                comp_cov = len(comp_matches) / len(comp_sids)
                if comp_cov >= 0.50:
                    satisfied_comp_count += 1
                    strong_competencies.append(comp.competency_name)
                else:
                    weak_competencies.append(comp.competency_name)

            competency_alignment_score = satisfied_comp_count / len(competencies) if competencies else 0.0

            # 4. Project Alignment
            project_alignment_score = 0.0
            project_reasons = []
            p_name_lower = pathway.pathway_name.lower()
            p_desc_lower = pathway.description.lower()

            if completed_projects:
                for proj in completed_projects:
                    proj_lower = proj.lower()
                    if any(kw in proj_lower for kw in ["ai", "ml", "rag", "gpt", "agent", "data", "bot", "deep learning"]):
                        if any(kw in p_name_lower or kw in p_desc_lower for kw in ["ai", "machine learning", "generative", "data", "deep learning"]):
                            project_alignment_score = 1.0
                            project_reasons.append(f"Practical project experience: '{proj}'")
                    elif any(kw in proj_lower for kw in ["web", "api", "backend", "full stack", "react", "node", "spring", "ecommerce", "e-commerce"]):
                        if any(kw in p_name_lower or kw in p_desc_lower for kw in ["backend", "full stack", "frontend", "systems", "cloud"]):
                            project_alignment_score = 1.0
                            project_reasons.append(f"Practical project experience: '{proj}'")

            # 5. Interest Alignment
            interest_alignment_score = 0.0
            interest_reasons = []
            for interest in interests:
                if interest in p_name_lower or interest in p_desc_lower:
                    interest_alignment_score = 1.0
                    interest_reasons.append(f"Direct match with declared interest in '{interest.title()}'")
                    break

            # 6. Prerequisite Readiness (DAG)
            prereq_scores = []
            for req in core_reqs:
                is_r, p_score, _, _ = dep_graph.evaluate_prerequisite_readiness(req.skill_id, {k: getattr(v, "status", VerificationStatus.MISSING) for k, v in student_status_map.items()})
                prereq_scores.append(p_score)
            prereq_readiness_score = sum(prereq_scores) / len(prereq_scores) if prereq_scores else 1.0

            # 7. Semantic Profile Similarity
            pathway_text = f"{pathway.pathway_name} {pathway.description} {' '.join([r.skill_name for r in core_reqs])}"
            semantic_score = semantic_matcher.calculate_semantic_similarity(student_summary, pathway_text)

            # Composite Multi-Factor Formula
            suitability = (
                weights["skill_alignment"] * skill_alignment_score +
                weights["verification_strength"] * verification_strength_score +
                weights["competency_alignment"] * competency_alignment_score +
                weights["project_alignment"] * project_alignment_score +
                weights["interest_alignment"] * interest_alignment_score +
                weights["prerequisite_readiness"] * prereq_readiness_score +
                0.10 * semantic_score
            )
            suitability = round(min(1.0, max(0.15, suitability)), 2)
            match_pct = round(suitability * 100.0, 1)

            # Build explainability reasons
            reasons = []
            if verified_names:
                reasons.append(f"Verified foundation in {', '.join(verified_names[:3])} ({len(verified_names)} verified skills)")
            elif evidence_names:
                reasons.append(f"Practical evidence in {', '.join(evidence_names[:3])}")

            if strong_competencies:
                reasons.append(f"Solid competency in {strong_competencies[0]}")

            reasons.extend(project_reasons)
            reasons.extend(interest_reasons)

            if not reasons:
                reasons.append(f"Foundational specialization pathway for {career.career_name}")

            explanation = (
                f"Recommended with {match_pct}% alignment based on {matched_count}/{total_core} matched skills, "
                f"{len(strong_competencies)} satisfied functional competencies, and {round(prereq_readiness_score * 100)}% prerequisite readiness."
            )

            recommendations.append(PathwayRecommendation(
                pathway_id=pathway.pathway_id,
                pathway_name=pathway.pathway_name,
                suitability_score=suitability,
                match_percentage=match_pct,
                match_score=match_pct,
                reasons=reasons,
                recommendation_reasons=reasons,
                strong_competencies=strong_competencies,
                weak_competencies=weak_competencies,
                matched_skills_count=matched_count,
                missing_skills_count=len(missing_names),
                prerequisite_readiness_pct=round(prereq_readiness_score * 100.0, 1),
                explanation=explanation
            ))

        recommendations.sort(key=lambda r: r.suitability_score, reverse=True)
        return recommendations

# Global singleton
_career_engine_instance: Optional[CareerProfileEngine] = None

def get_career_profile_engine() -> CareerProfileEngine:
    global _career_engine_instance
    if _career_engine_instance is None:
        _career_engine_instance = CareerProfileEngine()
    return _career_engine_instance
