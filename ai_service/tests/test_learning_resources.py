import unittest
from ai_service.core.schemas import StudentProfile, StudentSkillEntry
from ai_service.core.enums import VerificationStatus
from ai_service.learning.resource_recommender import get_learning_resource_recommender

class TestLearningResources(unittest.TestCase):
    def setUp(self):
        self.recommender = get_learning_resource_recommender()

    def test_resource_catalog_loaded(self):
        total = self.recommender.total_resources()
        self.assertGreaterEqual(total, 20)

    def test_lookup_resources_by_skill_id(self):
        # Python
        python_res = self.recommender.get_resources_for_skill("SKL-0012")
        self.assertGreater(len(python_res), 0)
        first = python_res[0]
        self.assertTrue(first.url.startswith("http"))
        self.assertIsNotNone(first.provider)

        # AI Agents
        agent_res = self.recommender.get_resources_for_skill("SKL-0211")
        self.assertGreater(len(agent_res), 0)
        self.assertTrue(any("Agent" in r.title or "DeepLearning.AI" in r.provider for r in agent_res))

    def test_recommend_resources_for_profile_gaps(self):
        profile = StudentProfile(
            student_id="STU-RES-01",
            career_goal="CAR-AI-ENG",
            skills=[
                StudentSkillEntry(skill_id="SKL-0012", skill_name="Python", status=VerificationStatus.ASSESSMENT_VERIFIED)
            ]
        )
        recommendations = self.recommender.recommend_resources_for_profile(
            profile, career_id="CAR-AI-ENG", pathway_id="PATH-AI-APP", max_per_skill=2
        )
        self.assertIsInstance(recommendations, dict)
        self.assertGreater(len(recommendations), 0)
        # Should not recommend Python since Python is verified
        self.assertNotIn("SKL-0012", recommendations)

if __name__ == "__main__":
    unittest.main()
