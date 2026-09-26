import unittest
from unittest.mock import patch, MagicMock
from ai_service.core.schemas import StudentProfile, StudentSkillEntry
from ai_service.core.enums import VerificationStatus
from ai_service.llm.ollama_client import OllamaClient
from ai_service.career.roadmap_generator import get_roadmap_generator

class TestOllamaMocked(unittest.TestCase):
    def setUp(self):
        self.client = OllamaClient(base_url="http://mock-ollama:11434", model="mistral:latest")
        self.roadmap_gen = get_roadmap_generator()

    @patch("httpx.Client")
    def test_check_health_online(self, mock_client_cls):
        mock_instance = MagicMock()
        mock_client_cls.return_value.__enter__.return_value = mock_instance

        mock_resp = MagicMock()
        mock_resp.status_code = 200
        mock_resp.json.return_value = {
            "models": [{"name": "mistral:latest"}, {"name": "llama3:latest"}]
        }
        mock_instance.get.return_value = mock_resp

        health = self.client.check_health()
        self.assertTrue(health["available"])
        self.assertEqual(health["status"], "online")
        self.assertTrue(health["model_installed"])
        self.assertIn("mistral:latest", health["available_models"])

    @patch("httpx.Client")
    def test_personalize_roadmap_online_generation(self, mock_client_cls):
        mock_instance = MagicMock()
        mock_client_cls.return_value.__enter__.return_value = mock_instance

        # 1. Health check call to /api/tags
        mock_tags_resp = MagicMock()
        mock_tags_resp.status_code = 200
        mock_tags_resp.json.return_value = {"models": [{"name": "mistral:latest"}]}
        mock_instance.get.return_value = mock_tags_resp

        # 2. Generation call to /api/generate
        mock_gen_resp = MagicMock()
        mock_gen_resp.status_code = 200
        mock_gen_resp.json.return_value = {
            "response": "Here is your tailored AI Engineering progression plan. Given your verified Python proficiency..."
        }
        mock_instance.post.return_value = mock_gen_resp

        profile = StudentProfile(
            student_id="STU-MOCK-01",
            career_goal="CAR-AI-ENG",
            skills=[
                StudentSkillEntry(skill_id="SKL-0012", skill_name="Python", status=VerificationStatus.ASSESSMENT_VERIFIED)
            ]
        )
        roadmap = self.roadmap_gen.generate_roadmap(profile, "CAR-AI-ENG", "PATH-AI-APP")

        result = self.client.personalize_roadmap(roadmap, profile, weekly_hours=15)

        self.assertEqual(result["llm_status"], "available")
        self.assertEqual(result["model_used"], "mistral:latest")
        self.assertIn("tailored AI Engineering progression", result["personalization_narrative"])
        self.assertIsInstance(result["weekly_study_plan"], list)

    @patch("httpx.Client")
    def test_explain_skill_online_generation(self, mock_client_cls):
        mock_instance = MagicMock()
        mock_client_cls.return_value.__enter__.return_value = mock_instance

        # Health
        mock_tags_resp = MagicMock()
        mock_tags_resp.status_code = 200
        mock_tags_resp.json.return_value = {"models": [{"name": "mistral:latest"}]}
        mock_instance.get.return_value = mock_tags_resp

        # Generate
        mock_gen_resp = MagicMock()
        mock_gen_resp.status_code = 200
        mock_gen_resp.json.return_value = {
            "response": "FastAPI enables high-performance asynchronous web APIs required for deploying modern LLM endpoints."
        }
        mock_instance.post.return_value = mock_gen_resp

        profile = StudentProfile(student_id="STU-MOCK-02", career_goal="CAR-AI-ENG")
        result = self.client.explain_skill_recommendation(
            skill_name="FastAPI",
            student_profile=profile,
            career_name="AI Engineer",
            pathway_name="AI Application Engineering"
        )

        self.assertEqual(result["llm_status"], "available")
        self.assertIn("high-performance asynchronous", result["explanation"])

if __name__ == "__main__":
    unittest.main()
