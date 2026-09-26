import unittest
from ai_service.career.dependency_graph import get_dependency_graph
from ai_service.core.enums import VerificationStatus

class TestDependencyGraph(unittest.TestCase):
    def setUp(self):
        self.graph = get_dependency_graph()

    def test_dag_structure(self):
        self.assertTrue(self.graph.is_dag())
        self.assertEqual(self.graph.total_nodes(), 222)
        self.assertGreater(self.graph.total_edges(), 0)

    def test_status_aware_prerequisite_evaluation(self):
        # Case 1: Python is VERIFIED, Machine Learning is EVIDENCE_BACKED
        # Target: Deep Learning (SKL-0061)
        student_skills = {
            "SKL-0012": VerificationStatus.ASSESSMENT_VERIFIED,
            "SKL-0060": VerificationStatus.EVIDENCE_BACKED
        }
        is_reachable, readiness, satisfied, warnings = self.graph.evaluate_prerequisite_readiness(
            "SKL-0061", student_skills
        )
        
        # Deep Learning CAN still be recommended, but system issues warning that ML is not assessment-verified
        self.assertTrue(is_reachable)
        self.assertGreater(readiness, 0.8)
        self.assertGreaterEqual(len(satisfied), 2)
        self.assertTrue(any("not yet been assessment-verified" in w for w in warnings))

    def test_missing_prerequisite_blocks_reachability(self):
        # Case 2: Python is MISSING, ML is MISSING
        # Target: Deep Learning (SKL-0061)
        student_skills = {}
        is_reachable, readiness, satisfied, warnings = self.graph.evaluate_prerequisite_readiness(
            "SKL-0061", student_skills
        )
        
        self.assertFalse(is_reachable)
        self.assertEqual(readiness, 0.0)
        self.assertTrue(any("required prerequisite and is currently missing" in w for w in warnings))

if __name__ == "__main__":
    unittest.main()
