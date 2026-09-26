import networkx as nx
from typing import Dict, List, Set, Tuple, Optional
from ai_service.core.schemas import CanonicalSkill
from ai_service.core.enums import VerificationStatus, DAGRelationshipType
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy
from ai_service.config.settings import CONFIG

class PrerequisiteDependencyGraph:
    """Engine 5: Status-Aware Prerequisite & Multi-Relational Dependency DAG Engine."""

    def __init__(self):
        self.taxonomy = get_canonical_taxonomy()
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self):
        """Constructs DAG where an edge (A -> B) means A is a prerequisite for B."""
        # 1. Add all canonical skills as nodes
        for skill_id, skill in self.taxonomy.skills_by_id.items():
            self.graph.add_node(
                skill_id,
                name=skill.skill_name,
                category=skill.category,
                difficulty=skill.difficulty
            )

        # 2. Add edges from canonical prerequisite map
        for target_id, prereq_ids in self.taxonomy.prerequisite_id_map.items():
            for prereq_id in prereq_ids:
                if prereq_id != target_id and self.graph.has_node(prereq_id) and self.graph.has_node(target_id):
                    self.graph.add_edge(
                        prereq_id,
                        target_id,
                        relationship=DAGRelationshipType.PREREQUISITE.value,
                        source="canonical_taxonomy"
                    )

        # 3. Add validated pedagogical curriculum prerequisites
        domain_prereqs = {
            "SKL-0211": ["SKL-0071", "SKL-0012"],  # AI Agents -> LLMs, Python
            "SKL-0073": ["SKL-0071", "SKL-0075"],  # RAG -> LLMs, Vector DBs
            "SKL-0077": ["SKL-0061"],              # Transformers -> Deep Learning
            "SKL-0040": ["SKL-0012"],              # FastAPI -> Python
            "SKL-0038": ["SKL-0012"],              # Django -> Python
            "SKL-0039": ["SKL-0012"],              # Flask -> Python
            "SKL-0036": ["SKL-0035", "SKL-0013"],  # Express.js -> Node.js, JavaScript
            "SKL-0030": ["SKL-0027"],              # Next.js -> React
            "SKL-0028": ["SKL-0014"],              # Angular -> TypeScript
            "SKL-0029": ["SKL-0013"],              # Vue.js -> JavaScript
            "SKL-0102": ["SKL-0097"],              # AWS Lambda -> AWS
            "SKL-0104": ["SKL-0097"],              # AWS IAM -> AWS
            "SKL-0115": ["SKL-0114"],              # Kubernetes -> Docker
        }
        for target_id, p_list in domain_prereqs.items():
            for p_id in p_list:
                if self.graph.has_node(p_id) and self.graph.has_node(target_id):
                    self.graph.add_edge(
                        p_id,
                        target_id,
                        relationship=DAGRelationshipType.CURRICULUM_PREREQUISITE.value,
                        source="curriculum_spec"
                    )

        # 4. Validate DAG invariants
        if not nx.is_directed_acyclic_graph(self.graph):
            cycles = list(nx.simple_cycles(self.graph))
            raise ValueError(f"Skill dependency graph contains cycles: {cycles}")

    def is_dag(self) -> bool:
        return nx.is_directed_acyclic_graph(self.graph)

    def total_nodes(self) -> int:
        return self.graph.number_of_nodes()

    def total_edges(self) -> int:
        return self.graph.number_of_edges()

    def get_direct_prerequisites(self, skill_id: str) -> List[str]:
        if not self.graph.has_node(skill_id):
            return []
        return list(self.graph.predecessors(skill_id))

    def get_all_ancestor_prerequisites(self, skill_id: str) -> Set[str]:
        if not self.graph.has_node(skill_id):
            return set()
        return nx.ancestors(self.graph, skill_id)

    def get_downstream_skills(self, skill_id: str) -> List[str]:
        if not self.graph.has_node(skill_id):
            return []
        return list(self.graph.successors(skill_id))

    def calculate_unlock_leverage(self, skill_id: str, target_skill_ids: Optional[Set[str]] = None) -> int:
        """Calculates how many target pathway skills are unlocked downstream by mastering this skill."""
        if not self.graph.has_node(skill_id):
            return 0
        descendants = nx.descendants(self.graph, skill_id)
        if target_skill_ids is not None:
            return len(descendants.intersection(target_skill_ids))
        return len(descendants)

    def evaluate_prerequisite_readiness(
        self,
        skill_id: str,
        student_skills_map: Dict[str, VerificationStatus]
    ) -> Tuple[bool, float, List[str], List[str]]:
        """
        Evaluates prerequisite readiness for a skill in a status-aware manner.
        Returns: (is_reachable, readiness_score, satisfied_prereq_names, verification_warnings)
        """
        direct_prereqs = self.get_direct_prerequisites(skill_id)
        if not direct_prereqs:
            return True, 1.0, [], []

        total_prereqs = len(direct_prereqs)
        score_sum = 0.0
        missing_count = 0
        satisfied_names: List[str] = []
        warnings: List[str] = []

        status_weights = CONFIG.get("verification_status_weights", {
            "ASSESSMENT_VERIFIED": 1.00,
            "EVIDENCE_BACKED": 0.80,
            "CLAIMED": 0.40,
            "MISSING": 0.00
        })

        for p_id in direct_prereqs:
            p_status = student_skills_map.get(p_id, VerificationStatus.MISSING)
            p_skill = self.taxonomy.skills_by_id.get(p_id)
            p_name = p_skill.skill_name if p_skill else p_id

            weight = status_weights.get(p_status.value if hasattr(p_status, "value") else str(p_status), 0.0)
            score_sum += weight

            if p_status == VerificationStatus.ASSESSMENT_VERIFIED:
                satisfied_names.append(p_name)
            elif p_status == VerificationStatus.EVIDENCE_BACKED:
                satisfied_names.append(p_name)
                warnings.append(f"Prerequisite '{p_name}' is evidence-backed but has not yet been assessment-verified.")
            elif p_status == VerificationStatus.CLAIMED:
                satisfied_names.append(f"{p_name} (Claimed)")
                warnings.append(f"Prerequisite '{p_name}' is self-reported claim only and has not yet been assessment-verified.")
            else:
                missing_count += 1
                warnings.append(f"'{p_name}' is a required prerequisite and is currently missing.")

        readiness_score = round(score_sum / total_prereqs, 2)
        # Reachable if no strict missing prerequisite
        is_reachable = (missing_count == 0)

        return is_reachable, readiness_score, satisfied_names, warnings

# Global singleton
_dependency_graph_instance: Optional[PrerequisiteDependencyGraph] = None

def get_dependency_graph() -> PrerequisiteDependencyGraph:
    global _dependency_graph_instance
    if _dependency_graph_instance is None:
        _dependency_graph_instance = PrerequisiteDependencyGraph()
    return _dependency_graph_instance
