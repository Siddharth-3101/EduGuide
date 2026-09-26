import unittest
from ai_service.core.schemas import StudentProfile, StudentSkillEntry
from ai_service.core.enums import VerificationStatus
from ai_service.learning.project_recommender import get_project_recommender

class TestProjectRecommendation(unittest.TestCase):
    def setUp(self):
        self.recommender = get_project_recommender()

    def test_catalog_loaded(self):
        self.assertGreaterEqual(len(self.recommender.catalog), 10)
        project_ids = [p.project_id for p in self.recommender.catalog]
        self.assertIn("PRJ-PY-001", project_ids)      # Python CLI
        self.assertIn("PRJ-RAG-001", project_ids)     # Production RAG
        self.assertIn("PRJ-AGENT-001", project_ids)   # Multi-Agent Workflow

    def test_recommend_projects_for_intermediate_student(self):
        profile = StudentProfile(
            student_id="STU-PRJ-01",
            career_goal="CAR-AI-ENG",
            skills=[
                StudentSkillEntry(skill_id="SKL-0012", skill_name="Python", status=VerificationStatus.ASSESSMENT_VERIFIED),
                StudentSkillEntry(skill_id="SKL-0060", skill_name="Machine Learning", status=VerificationStatus.CLAIMED),
                StudentSkillEntry(skill_id="SKL-0040", skill_name="FastAPI", status=VerificationStatus.CLAIMED)
            ]
        )

        recommendations = self.recommender.recommend_projects(profile, top_k=3)
        self.assertGreater(len(recommendations), 0)
        self.assertLessEqual(len(recommendations), 3)

        for rec in recommendations:
            self.assertIsNotNone(rec.project.project_id)
            self.assertIsNotNone(rec.reason)
            self.assertGreaterEqual(rec.suitability_score, 0.0)
            self.assertLessEqual(rec.suitability_score, 1.0)
            self.assertIsInstance(rec.skills_to_practice, list)

    def test_complete_project_promotes_claimed_to_evidence_backed(self):
        profile = StudentProfile(
            student_id="STU-PRJ-02",
            career_goal="CAR-AI-ENG",
            completed_projects=[],
            skills=[
                StudentSkillEntry(
                    skill_id="SKL-0012",
                    skill_name="Python",
                    status=VerificationStatus.ASSESSMENT_VERIFIED,
                    assessment_score=90.0
                ),
                StudentSkillEntry(
                    skill_id="SKL-0040",
                    skill_name="FastAPI",
                    status=VerificationStatus.CLAIMED  # Currently claimed!
                )
            ]
        )

        # Complete PRJ-FASTAPI-001: Production ML Inference REST API
        resp = self.recommender.complete_project(
            student_profile=profile,
            project_id="PRJ-FASTAPI-001",
            artifact_url="https://github.com/student/fastapi-production"
        )

        # 1. Project should be recorded in completed_projects
        self.assertIn("Production ML Inference REST API", resp.updated_profile.completed_projects)

        # 2. FastAPI should be promoted to EVIDENCE_BACKED, NOT ASSESSMENT_VERIFIED
        fastapi_entry = next((s for s in resp.updated_profile.skills if s.skill_id == "SKL-0040"), None)
        self.assertIsNotNone(fastapi_entry)
        self.assertEqual(fastapi_entry.status, VerificationStatus.EVIDENCE_BACKED)
        self.assertTrue(any("Production ML Inference REST API" in src for src in fastapi_entry.evidence_sources))

        # 3. Python was ASSESSMENT_VERIFIED; it MUST remain ASSESSMENT_VERIFIED!
        python_entry = next((s for s in resp.updated_profile.skills if s.skill_id == "SKL-0012"), None)
        self.assertIsNotNone(python_entry)
        self.assertEqual(python_entry.status, VerificationStatus.ASSESSMENT_VERIFIED)

        # 4. Check promoted_skills in response
        self.assertIn("FastAPI", resp.promoted_skills)
        self.assertNotIn("Python", resp.promoted_skills)

    def test_complete_unknown_project_raises_value_error(self):
        profile = StudentProfile(student_id="STU-03", career_goal="CAR-AI-ENG")
        with self.assertRaises(ValueError):
            self.recommender.complete_project(profile, "PRJ-999")

if __name__ == "__main__":
    unittest.main()
