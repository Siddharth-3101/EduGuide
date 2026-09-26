import unittest
from ai_service.taxonomy.normalizer import get_skill_normalizer
from ai_service.core.enums import MatchType

class TestNormalizer(unittest.TestCase):
    def setUp(self):
        self.normalizer = get_skill_normalizer()

    def test_exact_normalization(self):
        res = self.normalizer.normalize("Python")
        self.assertEqual(res.canonical_skill_id, "SKL-0012")
        self.assertEqual(res.canonical_skill_name, "Python")
        self.assertEqual(res.match_type, MatchType.EXACT)
        self.assertEqual(res.confidence, 1.0)
        self.assertFalse(res.is_candidate)

    def test_alias_normalization(self):
        cases = [
            ("k8s", "SKL-0115", "Kubernetes"),
            ("react js", "SKL-0027", "React"),
            ("NLP", "SKL-0069", "Natural Language Processing"),
            ("ML", "SKL-0060", "Machine Learning"),
            ("DL", "SKL-0061", "Deep Learning"),
            ("RAG", "SKL-0073", "Retrieval-Augmented Generation"),
            ("AWS", "SKL-0097", "Amazon Web Services"),
            ("springboot", "SKL-0037", "Spring Boot"),
        ]
        for raw_input, expected_id, expected_name in cases:
            res = self.normalizer.normalize(raw_input)
            self.assertEqual(
                res.canonical_skill_id, expected_id,
                f"Failed on '{raw_input}': expected {expected_id}, got {res.canonical_skill_id}"
            )
            self.assertEqual(res.canonical_skill_name, expected_name)
            self.assertIn(res.match_type, [MatchType.EXACT, MatchType.ALIAS, MatchType.FUZZY])
            self.assertFalse(res.is_candidate)

    def test_candidate_skill_quarantine(self):
        fake_skill = "Quantum-Hyper-Compiler-X9000"
        res = self.normalizer.normalize(fake_skill, context="Test Context")
        self.assertIsNone(res.canonical_skill_id)
        self.assertTrue(res.is_candidate)
        self.assertIsNotNone(res.candidate_id)
        self.assertEqual(res.match_type, MatchType.CANDIDATE)

if __name__ == "__main__":
    unittest.main()
