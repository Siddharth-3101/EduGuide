import unittest
from ai_service.core.schemas import StudentProfile, StudentSkillEntry
from ai_service.core.enums import VerificationStatus
from ai_service.career.career_engine import get_career_profile_engine

class TestPathwayRecommendation(unittest.TestCase):
    def setUp(self):
        self.engine = get_career_profile_engine()

    def test_recommend_pathways_generative_ai_interest(self):
        profile = StudentProfile(
            student_id="STU-PATH-01",
            career_goal="CAR-AI-ENG",
            interests=["generative ai", "llm applications"],
            skills=[
                StudentSkillEntry(
                    skill_id="SKL-0012",
                    skill_name="Python",
                    status=VerificationStatus.ASSESSMENT_VERIFIED,
                    assessment_score=92.0
                ),
                StudentSkillEntry(
                    skill_id="SKL-0061",
                    skill_name="Machine Learning",
                    status=VerificationStatus.EVIDENCE_BACKED,
                    evidence_sources=["certificate: Coursera ML"]
                )
            ]
        )

        recs = self.engine.recommend_pathways(profile, "CAR-AI-ENG")
        self.assertGreater(len(recs), 0)

        # Check PathwayRecommendation schema integrity
        for rec in recs:
            self.assertIsNotNone(rec.pathway_id)
            self.assertIsNotNone(rec.pathway_name)
            self.assertGreaterEqual(rec.suitability_score, 0.0)
            self.assertLessEqual(rec.suitability_score, 1.0)
            self.assertGreaterEqual(rec.match_percentage, 0.0)
            self.assertLessEqual(rec.match_percentage, 100.0)
            self.assertGreater(len(rec.reasons), 0)

        # The GenAI pathway or AI App pathway should be top-ranked due to interests
        pathway_ids = [r.pathway_id for r in recs]
        self.assertIn("PATH-AI-GENAI", pathway_ids)

        top_rec = recs[0]
        # Should contain interest or skill foundation reason
        reasons_text = " ".join(top_rec.reasons).lower()
        self.assertTrue(
            "python" in reasons_text or "interest" in reasons_text or "machine learning" in reasons_text
        )

    def test_recommend_pathways_unknown_career_returns_empty(self):
        profile = StudentProfile(student_id="STU-02", career_goal="UNKNOWN")
        recs = self.engine.recommend_pathways(profile, "CAR-NON-EXISTENT")
        self.assertEqual(len(recs), 0)

if __name__ == "__main__":
    unittest.main()
