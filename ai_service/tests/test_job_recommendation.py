import unittest
from ai_service.core.enums import VerificationStatus, JobMatchTier, SkillImportance
from ai_service.core.schemas import StudentProfile, StudentSkillEntry
from ai_service.jobs.job_catalog_loader import get_job_catalog
from ai_service.jobs.job_matcher import get_job_matcher
from ai_service.jobs.job_recommender import get_job_recommender
from starlette.testclient import TestClient
from ai_service.api.main import app

class TestJobRecommendation(unittest.TestCase):

    def setUp(self):
        self.catalog = get_job_catalog()
        self.matcher = get_job_matcher()
        self.recommender = get_job_recommender()
        self.client = TestClient(app)

    def test_job_catalog_loaded(self):
        jobs = self.catalog.get_all_jobs()
        self.assertGreaterEqual(len(jobs), 5)
        job1 = self.catalog.get_job("JOB-BE-001")
        self.assertIsNotNone(job1)
        self.assertEqual(job1.title, "Junior Backend Developer")
        self.assertGreater(len(job1.required_skills), 0)

    def test_three_tier_status_weighting(self):
        job = self.catalog.get_job("JOB-BE-001")

        # Profile with Claimed only
        claimed_profile = StudentProfile(
            student_id="STU-CLAIMED",
            career_goal="CAR-BACKEND",
            skills=[
                StudentSkillEntry(skill_id="SKL-0012", skill_name="Python", status=VerificationStatus.CLAIMED),
                StudentSkillEntry(skill_id="SKL-0047", skill_name="SQL", status=VerificationStatus.CLAIMED)
            ]
        )
        claimed_res = self.matcher.match_job(claimed_profile, job)

        # Profile with Verified
        verified_profile = StudentProfile(
            student_id="STU-VERIFIED",
            career_goal="CAR-BACKEND",
            skills=[
                StudentSkillEntry(skill_id="SKL-0012", skill_name="Python", status=VerificationStatus.ASSESSMENT_VERIFIED, assessment_score=90.0),
                StudentSkillEntry(skill_id="SKL-0047", skill_name="SQL", status=VerificationStatus.ASSESSMENT_VERIFIED, assessment_score=88.0)
            ]
        )
        verified_res = self.matcher.match_job(verified_profile, job)

        # Verified match percentage MUST be strictly higher than claimed match percentage
        self.assertGreater(verified_res.overall_match_pct, claimed_res.overall_match_pct)
        # Claimed profile must flag verification warnings
        self.assertIn("Python", claimed_res.claimed_only_skills)

    def test_counterfactual_gap_impact(self):
        job = self.catalog.get_job("JOB-BE-001")
        profile = StudentProfile(
            student_id="STU-BASE",
            career_goal="CAR-BACKEND",
            skills=[
                StudentSkillEntry(skill_id="SKL-0012", skill_name="Python", status=VerificationStatus.ASSESSMENT_VERIFIED)
            ]
        )
        res = self.matcher.match_job(profile, job)
        self.assertGreater(len(res.gap_impacts), 0)

        # Top gap should provide positive lift
        top_gap = res.gap_impacts[0]
        self.assertGreater(top_gap.score_lift_pct, 0.0)
        self.assertGreater(top_gap.projected_match_pct, res.overall_match_pct)

    def test_multi_factor_recommendation_ranking(self):
        profile = StudentProfile(
            student_id="STU-DEV",
            career_goal="CAR-BACKEND",
            skills=[
                StudentSkillEntry(skill_id="SKL-0012", skill_name="Python", status=VerificationStatus.ASSESSMENT_VERIFIED),
                StudentSkillEntry(skill_id="SKL-0047", skill_name="SQL", status=VerificationStatus.ASSESSMENT_VERIFIED),
                StudentSkillEntry(skill_id="SKL-0041", skill_name="REST API", status=VerificationStatus.ASSESSMENT_VERIFIED),
                StudentSkillEntry(skill_id="SKL-0108", skill_name="Git", status=VerificationStatus.ASSESSMENT_VERIFIED),
                StudentSkillEntry(skill_id="SKL-0114", skill_name="Docker", status=VerificationStatus.ASSESSMENT_VERIFIED)
            ]
        )
        recs = self.recommender.recommend_jobs(profile, limit=5)
        self.assertGreater(len(recs), 0)
        # Top recommended job should be in Backend since career goal is CAR-BACKEND and student has all skills
        top_rec = recs[0]
        self.assertEqual(top_rec.job.career_id, "CAR-BACKEND")
        self.assertGreaterEqual(top_rec.match_result.overall_match_pct, 80.0)
        self.assertEqual(top_rec.match_result.match_tier, JobMatchTier.STRONG_MATCH)

    def test_api_jobs_endpoints(self):
        # 1. List jobs
        resp = self.client.get("/api/jobs")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

        # 2. Get single job
        resp_single = self.client.get("/api/jobs/JOB-BE-001")
        self.assertEqual(resp_single.status_code, 200)
        self.assertEqual(resp_single.json()["job_id"], "JOB-BE-001")

        # 3. Recommend jobs POST
        payload = {
            "student_profile": {
                "student_id": "STU-TEST",
                "career_goal": "CAR-BACKEND",
                "skills": [
                    {"skill_id": "SKL-0012", "skill_name": "Python", "status": "ASSESSMENT_VERIFIED"}
                ]
            },
            "career_id": "CAR-BACKEND",
            "limit": 3
        }
        resp_rec = self.client.post("/api/jobs/recommend", json=payload)
        self.assertEqual(resp_rec.status_code, 200)
        rec_data = resp_rec.json()
        self.assertIsInstance(rec_data, list)
        self.assertLessEqual(len(rec_data), 3)

        # 4. Text skill extraction
        resp_extract = self.client.post("/api/talent/extract-text", json={
            "text": "Experience developing containerized microservices in Python with Docker and PostgreSQL."
        })
        self.assertEqual(resp_extract.status_code, 200)
        extract_data = resp_extract.json()
        self.assertTrue(extract_data["success"])
        skill_names = [s["skill_name"] for s in extract_data["skills"]]
        self.assertIn("Python", skill_names)
        self.assertIn("Docker", skill_names)

if __name__ == "__main__":
    unittest.main()
