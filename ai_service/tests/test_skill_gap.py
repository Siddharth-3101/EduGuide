import unittest
from ai_service.core.schemas import StudentProfile, StudentSkillEntry
from ai_service.core.enums import VerificationStatus
from ai_service.career.skill_gap_engine import get_skill_gap_engine

class TestSkillGap(unittest.TestCase):
    def setUp(self):
        self.engine = get_skill_gap_engine()

    def test_skill_gap_three_tier_partitioning(self):
        profile = StudentProfile(
            student_id="TEST-GAP-01",
            career_goal="CAR-AI-ENG",
            target_pathway="PATH-AI-APP",
            skills=[
                StudentSkillEntry(
                    skill_id="SKL-0012",
                    skill_name="Python",
                    status=VerificationStatus.ASSESSMENT_VERIFIED,
                    assessment_score=88.0
                ),
                StudentSkillEntry(
                    skill_id="SKL-0060",
                    skill_name="Machine Learning",
                    status=VerificationStatus.EVIDENCE_BACKED,
                    evidence_sources=["certificate: Coursera ML"]
                ),
                StudentSkillEntry(
                    skill_id="SKL-0072",
                    skill_name="Prompt Engineering",
                    status=VerificationStatus.CLAIMED
                )
            ]
        )

        result = self.engine.analyze_gap(profile, "CAR-AI-ENG", "PATH-AI-APP")

        self.assertEqual(result.career_name, "AI Engineer")
        self.assertEqual(result.pathway_name, "AI Application Engineer")

        strong_ids = [s.skill_id for s in result.strong_skills]
        evidence_ids = [s.skill_id for s in result.evidence_backed_skills]
        claimed_ids = [s.skill_id for s in result.claimed_only_skills]
        missing_ids = [s.skill_id for s in result.missing_skills]

        self.assertIn("SKL-0012", strong_ids)
        self.assertIn("SKL-0060", evidence_ids)
        self.assertIn("SKL-0072", claimed_ids)
        self.assertGreater(len(missing_ids), 0)
        self.assertGreaterEqual(len(result.verification_gaps), 2)
        self.assertGreater(result.overall_coverage_pct, result.verified_coverage_pct)

if __name__ == "__main__":
    unittest.main()
