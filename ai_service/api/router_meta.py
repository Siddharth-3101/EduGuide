from typing import Dict, Any, List
from collections import Counter
import networkx as nx
from fastapi import APIRouter

from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy
from ai_service.career.career_engine import get_career_profile_engine
from ai_service.career.dependency_graph import get_dependency_graph
from ai_service.learning.project_recommender import get_project_recommender
from ai_service.learning.resource_recommender import get_learning_resource_recommender
from ai_service.llm.ollama_client import get_ollama_client
from ai_service.config.settings import CONFIG

router = APIRouter(prefix="/api", tags=["System Meta & Graph Inspection"])

@router.get("/meta")
def get_system_metadata() -> Dict[str, Any]:
    """
    High-level platform metadata, catalog counts, and service health statuses.
    """
    taxonomy = get_canonical_taxonomy()
    career_engine = get_career_profile_engine()
    graph = get_dependency_graph()
    project_recommender = get_project_recommender()
    resource_recommender = get_learning_resource_recommender()
    ollama_client = get_ollama_client()

    careers = career_engine.get_all_careers()
    total_pathways = sum(len(c.pathways) for c in careers)

    return {
        "platform": "SkillSync AI Career Intelligence Backend",
        "version": "2.0.0",
        "architecture": {
            "canonical_taxonomy_skills": taxonomy.total_skills(),
            "career_domains": len(careers),
            "specialization_pathways": total_pathways,
            "prerequisite_dag_nodes": graph.total_nodes(),
            "prerequisite_dag_edges": graph.total_edges(),
            "project_catalog_items": len(project_recommender.catalog),
            "curated_learning_resources": resource_recommender.total_resources(),
        },
        "verification_tiers": [
            {"tier": "CLAIMED", "weight": 0.40, "description": "Self-reported on profile"},
            {"tier": "EVIDENCE_BACKED", "weight": 0.80, "description": "Supported by project/certificate artifacts"},
            {"tier": "ASSESSMENT_VERIFIED", "weight": 1.00, "description": "Proctored SkillSync assessment passed (>= 70%)"}
        ],
        "llm_service": ollama_client.check_health()
    }

@router.get("/graph/stats")
def get_prerequisite_graph_stats() -> Dict[str, Any]:
    """
    NetworkX Directed Acyclic Graph (DAG) structural topology and centrality statistics.
    """
    dep_graph = get_dependency_graph()
    g = dep_graph.graph
    taxonomy = get_canonical_taxonomy()

    in_degrees = dict(g.in_degree())
    out_degrees = dict(g.out_degree())

    # Roots: zero incoming prerequisite edges (foundational starting points)
    roots = [n for n, deg in in_degrees.items() if deg == 0 and out_degrees.get(n, 0) > 0]
    # Leaves: zero outgoing prerequisite edges (terminal/specialized competencies)
    leaves = [n for n, deg in out_degrees.items() if deg == 0 and in_degrees.get(n, 0) > 0]

    # Top foundational prerequisites (highest out-degree)
    top_prereqs = sorted(out_degrees.items(), key=lambda x: x[1], reverse=True)[:10]
    top_prereqs_formatted = [
        {
            "skill_id": sid,
            "skill_name": (taxonomy.get_skill(sid).skill_name if taxonomy.get_skill(sid) else sid),
            "downstream_dependent_count": count
        }
        for sid, count in top_prereqs if count > 0
    ]

    # Top advanced skills requiring most prerequisites (highest in-degree)
    top_advanced = sorted(in_degrees.items(), key=lambda x: x[1], reverse=True)[:10]
    top_advanced_formatted = [
        {
            "skill_id": sid,
            "skill_name": (taxonomy.get_skill(sid).skill_name if taxonomy.get_skill(sid) else sid),
            "required_prerequisite_count": count
        }
        for sid, count in top_advanced if count > 0
    ]

    return {
        "graph_type": "Directed Acyclic Graph (DiGraph)",
        "is_acyclic": nx.is_directed_acyclic_graph(g),
        "total_nodes": g.number_of_nodes(),
        "total_edges": g.number_of_edges(),
        "foundational_roots_count": len(roots),
        "terminal_leaves_count": len(leaves),
        "top_foundational_prerequisites": top_prereqs_formatted,
        "top_multi_prerequisite_skills": top_advanced_formatted
    }

@router.get("/taxonomy/stats")
def get_canonical_taxonomy_stats() -> Dict[str, Any]:
    """
    Canonical skill taxonomy distributions by category, difficulty, and assessment readiness.
    """
    taxonomy = get_canonical_taxonomy()
    skills = list(taxonomy.skills_by_id.values())

    categories = Counter(s.category for s in skills if s.category)
    difficulties = Counter(s.difficulty for s in skills if s.difficulty)
    assessment_status = Counter(s.assessment_available for s in skills if s.assessment_available)

    return {
        "total_canonical_skills": len(skills),
        "total_aliases_indexed": len(taxonomy.normalized_alias_to_id),
        "category_distribution": dict(categories.most_common()),
        "difficulty_distribution": dict(difficulties.most_common()),
        "assessment_availability": dict(assessment_status.most_common())
    }
