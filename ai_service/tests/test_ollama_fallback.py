import unittest
from ai_service.core.schemas import StudentProfile, StudentSkillEntry, PersonalizedRoadmap
from ai_service.core.enums import VerificationStatus
from ai_service.llm.ollama_client import OllamaClient
from ai_service.career.roadmap_generator import get_roadmap_generator

class TestOllamaFallback(unittest.TestCase):
    def setUp(self):
        # Point to a guaranteed non-existent local port to test offline fallback
        self.offline_client = OllamaClient(base_url="http://127.0.0.1:54321", timeout=0.5)
        self.roadmap_gen = get_roadmap_generator()

    def test_health_check_offline(self):
        health = self.offline_client.check_health()
        self.assertFalse(health["available"])
        self.assertEqual(health["status"], "offline")
        self.assertIn("message", health)

    def test_personalize_roadmap_offline_fallback(self):
        profile = StudentProfile(
            student_id="STU-FALLBACK-01",
            career_goal="CAR-AI-ENG",
            skills=[
                StudentSkillEntry(skill_id="SKL-0012", skill_name="Python", status=VerificationStatus.ASSESSMENT_VERIFIED)
            ]
        )
        roadmap = self.roadmap_gen.generate_roadmap(profile, "CAR-AI-ENG", "PATH-AI-APP")

        result = self.offline_client.personalize_roadmap(roadmap, profile, weekly_hours=12)

        self.assertEqual(result["llm_status"], "unavailable")
        self.assertIsNone(result["model_used"])
        self.assertIsNotNone(result["personalization_narrative"])
        self.assertIn("SkillSync has constructed", result["personalization_narrative"])
        self.assertIsInstance(result["weekly_study_plan"], list)
        self.assertGreater(len(result["weekly_study_plan"]), 0)
        self.assertEqual(result["weekly_study_plan"][0]["hours_per_week"], 12)
        self.assertIsNotNone(result["practical_advice"])

    def test_explain_skill_offline_fallback(self):
        profile = StudentProfile(student_id="STU-02", career_goal="CAR-AI-ENG")
        result = self.offline_client.explain_skill_recommendation(
            skill_name="Docker",
            student_profile=profile,
            career_name="AI Engineer",
            pathway_name="AI Application Engineering"
        )
        self.assertEqual(result["llm_status"], "unavailable")
        self.assertIn("Docker", result["explanation"])

if __name__ == "__main__":
    unittest.main()
