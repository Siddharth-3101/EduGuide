import unittest
from ai_service.core.schemas import StudentProfile, StudentSkillEntry
from ai_service.core.enums import VerificationStatus, GapClassification, RequirementCategory
from ai_service.career.career_engine import get_career_profile_engine
from ai_service.career.skill_gap_engine import get_skill_gap_engine
from ai_service.career.priority_recommender import get_skill_priority_recommender
from ai_service.jobs.job_matcher import get_job_matcher
from ai_service.jobs.job_catalog_loader import get_job_catalog

class TestCareerIntelligenceV2(unittest.TestCase):
    def setUp(self):
        self.career_engine = get_career_profile_engine()
        self.gap_engine = get_skill_gap_engine()
        self.priority_recommender = get_skill_priority_recommender()
        self.job_matcher = get_job_matcher()
        self.catalog = get_job_catalog()

    def test_competency_grouping_and_gap_classification(self):
        # Student with Java verified, Spring Boot claimed, MySQL evidence-backed
        profile = StudentProfile(
            student_id="STU-TEST-001",
            career_goal="CAR-BACKEND",
            interests=["Backend Development", "Cloud"],
            skills=[
                StudentSkillEntry(skill_id="SKL-0011", skill_name="Java", status=VerificationStatus.ASSESSMENT_VERIFIED, assessment_score=85.0),
                StudentSkillEntry(skill_id="SKL-0037", skill_name="Spring Boot", status=VerificationStatus.CLAIMED),
                StudentSkillEntry(skill_id="SKL-0048", skill_name="MySQL", status=VerificationStatus.EVIDENCE_BACKED)
            ],
            completed_projects=["AgriSmart"]
        )

        gap_result = self.gap_engine.analyze_gap(profile, "CAR-BACKEND", "PATH-BACKEND-JAVA")

        # 1. Competency progress check
        self.assertTrue(len(gap_result.competency_progress) > 0)
        self.assertTrue(any(c.coverage_pct > 0.0 for c in gap_result.competency_progress))

        # 2. Claimed only classification check
        claimed_ids = [item.skill_id for item in gap_result.claimed_only_skills]
        self.assertIn("SKL-0037", claimed_ids)

        # 3. Next best action recommendation check
        recs = self.priority_recommender.recommend_next_skills(profile, "CAR-BACKEND", "PATH-BACKEND-JAVA", top_k=3)
        self.assertTrue(len(recs) > 0)
        self.assertTrue(hasattr(recs[0], "reasons"))
        self.assertTrue(len(recs[0].reasons) > 0)
        self.assertIn(recs[0].action_type, ["LEARN", "ASSESS", "PRACTICE", "PROJECT"])

    def test_explainable_pathway_recommendation(self):
        profile = StudentProfile(
            student_id="STU-TEST-002",
            career_goal="CAR-BACKEND",
            skills=[
                StudentSkillEntry(skill_id="SKL-0011", skill_name="Java", status=VerificationStatus.ASSESSMENT_VERIFIED)
            ]
        )
        recs = self.career_engine.recommend_pathways(profile, "CAR-BACKEND")
        self.assertTrue(len(recs) > 0)
        top_pathway = recs[0]
        self.assertTrue(len(top_pathway.recommendation_reasons) > 0)
        self.assertGreaterEqual(top_pathway.match_score, 0.0)

    def test_job_matching_with_semantic_and_evidence_strength(self):
        profile = StudentProfile(
            student_id="STU-TEST-003",
            career_goal="CAR-BACKEND",
            skills=[
                StudentSkillEntry(skill_id="SKL-0011", skill_name="Java", status=VerificationStatus.ASSESSMENT_VERIFIED),
                StudentSkillEntry(skill_id="SKL-0037", skill_name="Spring Boot", status=VerificationStatus.EVIDENCE_BACKED)
            ],
            completed_projects=["AgriSmart Agriculture Platform"]
        )
        jobs = self.catalog.get_all_jobs()
        self.assertTrue(len(jobs) > 0)

        match_res = self.job_matcher.match_job(profile, jobs[0])
        self.assertIsNotNone(match_res.evidence_strength_score)
        self.assertIsNotNone(match_res.semantic_similarity_score)
        self.assertIsNotNone(match_res.main_recommendation)
        self.assertTrue(len(match_res.summary) > 0)

if __name__ == "__main__":
    unittest.main()
