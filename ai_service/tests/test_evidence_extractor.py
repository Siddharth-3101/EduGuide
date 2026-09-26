import unittest
from ai_service.talent.evidence_extractor import get_contextual_evidence_extractor
from ai_service.core.enums import VerificationStatus, EvidenceSourceType

class TestContextualEvidenceExtractor(unittest.TestCase):
    def setUp(self):
        self.extractor = get_contextual_evidence_extractor()

    def test_extract_project_evidence(self):
        text = "Built AgriSmart smart farming platform using Java, Spring Boot, MySQL, and REST APIs."
        records = self.extractor.extract_evidence(text, source_type=EvidenceSourceType.PROJECT)

        skill_names = [r.skill_name for r in records]
        self.assertTrue(any("Java" in s for s in skill_names))
        self.assertTrue(any("Spring" in s for s in skill_names))

        # Check status classification
        java_rec = next(r for r in records if "Java" in r.skill_name)
        self.assertEqual(java_rec.verification_status, VerificationStatus.EVIDENCE_BACKED)
        self.assertGreater(java_rec.confidence, 0.70)

    def test_claimed_vs_demonstrated_context(self):
        text = "I am interested in learning Docker, Kubernetes, and Golang in the future."
        records = self.extractor.extract_evidence(text, source_type=EvidenceSourceType.RESUME)

        # Future interest context should classify as CLAIMED
        if records:
            for r in records:
                self.assertEqual(r.verification_status, VerificationStatus.CLAIMED)

if __name__ == "__main__":
    unittest.main()
