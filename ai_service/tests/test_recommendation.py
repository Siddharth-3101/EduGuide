import unittest
from ai_service.core.schemas import StudentProfile, StudentSkillEntry
from ai_service.core.enums import VerificationStatus
from ai_service.career.priority_recommender import get_skill_priority_recommender
from ai_service.career.roadmap_generator import get_roadmap_generator

class TestRecommendation(unittest.TestCase):
    def setUp(self):
        self.recommender = get_skill_priority_recommender()
        self.generator = get_roadmap_generator()

    def test_novice_recommendation_does_not_recommend_rag(self):
        profile = StudentProfile(
            student_id="STU-NOVICE",
            career_goal="CAR-AI-ENG",
            target_pathway="PATH-AI-APP",
            skills=[
                StudentSkillEntry(
                    skill_id="SKL-0012",
                    skill_name="Python",
                    status=VerificationStatus.ASSESSMENT_VERIFIED,
                    assessment_score=85.0
                )
            ]
        )

        recs = self.recommender.recommend_next_skills(profile, "CAR-AI-ENG", "PATH-AI-APP", top_k=5)
        rec_ids = [r.skill_id for r in recs]

        # RAG (SKL-0073) and AI Agents (SKL-0211) must NOT be in immediate recommendations
        self.assertNotIn("SKL-0073", rec_ids)
        self.assertNotIn("SKL-0211", rec_ids)

        # Machine Learning (SKL-0060) or NumPy (SKL-0082) or Pandas (SKL-0083) SHOULD be recommended
        found_foundation = any(s_id in ["SKL-0060", "SKL-0082", "SKL-0083"] for s_id in rec_ids)
        self.assertTrue(found_foundation)

    def test_intermediate_recommendation_status_aware(self):
        profile = StudentProfile(
            student_id="STU-INTERMEDIATE",
            career_goal="CAR-AI-ENG",
            target_pathway="PATH-AI-APP",
            skills=[
                StudentSkillEntry(
                    skill_id="SKL-0012",
                    skill_name="Python",
                    status=VerificationStatus.ASSESSMENT_VERIFIED,
                    assessment_score=90.0
                ),
                StudentSkillEntry(
                    skill_id="SKL-0082",
                    skill_name="NumPy",
                    status=VerificationStatus.ASSESSMENT_VERIFIED,
                    assessment_score=88.0
                ),
                StudentSkillEntry(
                    skill_id="SKL-0083",
                    skill_name="Pandas",
                    status=VerificationStatus.ASSESSMENT_VERIFIED,
                    assessment_score=85.0
                ),
                StudentSkillEntry(
                    skill_id="SKL-0060",
                    skill_name="Machine Learning",
                    status=VerificationStatus.EVIDENCE_BACKED,
                    evidence_sources=["certificate: Andrew Ng ML"]
                )
            ]
        )

        recs = self.recommender.recommend_next_skills(profile, "CAR-AI-ENG", "PATH-AI-APP", top_k=5)
        rec_dict = {r.skill_id: r for r in recs}

        # Deep Learning (SKL-0061) should be reachable and recommended
        self.assertIn("SKL-0061", rec_dict)
        dl_rec = rec_dict["SKL-0061"]
        self.assertIsNotNone(dl_rec.verification_warning)
        self.assertIn("not yet been assessment-verified", dl_rec.verification_warning)
        self.assertIn("AI Application Engineer", dl_rec.rationale)

    def test_dynamic_roadmap_generator(self):
        profile = StudentProfile(
            student_id="STU-ROADMAP-TEST",
            career_goal="CAR-BACKEND",
            target_pathway="PATH-BACKEND-JAVA",
            skills=[
                StudentSkillEntry(
                    skill_id="SKL-0011",
                    skill_name="Java",
                    status=VerificationStatus.ASSESSMENT_VERIFIED,
                    assessment_score=86.0
                )
            ]
        )

        roadmap = self.generator.generate_roadmap(profile, "CAR-BACKEND", "PATH-BACKEND-JAVA")
        self.assertEqual(roadmap.career_name, "Backend Developer")
        self.assertEqual(roadmap.pathway_name, "Java / Spring Boot Backend Developer")
        self.assertGreater(len(roadmap.stages), 0)
        # First stage should not contain Java because it is already verified
        stage1_skills = [s.skill_id for s in roadmap.stages[0].skills]
        self.assertNotIn("SKL-0011", stage1_skills)

if __name__ == "__main__":
    unittest.main()
