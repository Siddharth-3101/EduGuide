import unittest
from datetime import datetime, timezone
from ai_service.core.schemas import StudentProfile, StudentSkillEntry, AssessmentResultInput
from ai_service.core.enums import VerificationStatus
from ai_service.career.adaptive_roadmap_service import get_adaptive_roadmap_service

class TestAdaptiveRoadmap(unittest.TestCase):
    def setUp(self):
        self.service = get_adaptive_roadmap_service()

    def test_apply_passing_assessment_promotes_to_verified(self):
        profile = StudentProfile(
            student_id="STU-ADAPT-01",
            career_goal="CAR-AI-ENG",
            skills=[
                StudentSkillEntry(skill_id="SKL-0012", skill_name="Python", status=VerificationStatus.CLAIMED)
            ]
        )

        now = datetime.now(timezone.utc)
        assessment = AssessmentResultInput(
            skill_id="SKL-0012",
            assessment_score=88.5,
            verified_at=now
        )

        updated_profile = self.service.apply_assessment_result(profile, assessment)
        entry = next((s for s in updated_profile.skills if s.skill_id == "SKL-0012"), None)
        self.assertIsNotNone(entry)
        self.assertEqual(entry.status, VerificationStatus.ASSESSMENT_VERIFIED)
        self.assertEqual(entry.assessment_score, 88.5)
        self.assertEqual(entry.verified_at, now.isoformat())

    def test_apply_failing_assessment_does_not_verify(self):
        profile = StudentProfile(
            student_id="STU-ADAPT-02",
            career_goal="CAR-AI-ENG",
            skills=[
                StudentSkillEntry(
                    skill_id="SKL-0061",
                    skill_name="Machine Learning",
                    status=VerificationStatus.EVIDENCE_BACKED,
                    evidence_sources=["certificate: Coursera"]
                )
            ]
        )

        assessment = AssessmentResultInput(
            skill_id="SKL-0061",
            assessment_score=58.0
        )

        updated_profile = self.service.apply_assessment_result(profile, assessment)
        entry = next((s for s in updated_profile.skills if s.skill_id == "SKL-0061"), None)
        self.assertIsNotNone(entry)
        # Should preserve EVIDENCE_BACKED rather than degrading to CLAIMED
        self.assertEqual(entry.status, VerificationStatus.EVIDENCE_BACKED)
        self.assertEqual(entry.assessment_score, 58.0)

    def test_adaptive_roadmap_generation_flow(self):
        profile = StudentProfile(
            student_id="STU-ADAPT-03",
            career_goal="CAR-AI-ENG",
            skills=[
                StudentSkillEntry(
                    skill_id="SKL-0012",
                    skill_name="Python",
                    status=VerificationStatus.ASSESSMENT_VERIFIED,
                    assessment_score=95.0
                )
            ]
        )

        roadmap = self.service.generate_personalized_adaptive_roadmap(
            student_profile=profile,
            career_identifier="CAR-AI-ENG",
            pathway_identifier="PATH-AI-APP",
            weekly_hours=10
        )

        self.assertIsNotNone(roadmap.roadmap_id)
        self.assertGreater(len(roadmap.stages), 0)
        self.assertIn(roadmap.llm_status, ["available", "unavailable"])
        self.assertIsNotNone(roadmap.personalization_narrative)
        self.assertIsNotNone(roadmap.weekly_study_plan)

if __name__ == "__main__":
    unittest.main()
