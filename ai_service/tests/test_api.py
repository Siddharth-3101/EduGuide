import unittest
from starlette.testclient import TestClient
from ai_service.api.main import app

class TestCareerAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_health_endpoint(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "healthy")

    def test_list_careers_endpoint(self):
        response = self.client.get("/api/career")
        self.assertEqual(response.status_code, 200)
        careers = response.json()
        self.assertGreaterEqual(len(careers), 10)
        career_ids = [c["career_id"] for c in careers]
        self.assertIn("CAR-AI-ENG", career_ids)
        self.assertIn("CAR-BACKEND", career_ids)

    def test_get_career_details(self):
        response = self.client.get("/api/career/CAR-AI-ENG")
        self.assertEqual(response.status_code, 200)
        career = response.json()
        self.assertEqual(career["career_name"], "AI Engineer")
        self.assertGreaterEqual(len(career["pathways"]), 3)
        self.assertEqual(career["provenance"]["source"], "ai-engineer.pdf")

    def test_get_career_roadmaps(self):
        response = self.client.get("/api/career/CAR-AI-ENG/roadmaps")
        self.assertEqual(response.status_code, 200)
        pathways = response.json()
        self.assertGreaterEqual(len(pathways), 3)
        self.assertEqual(pathways[0]["pathway_id"], "PATH-AI-APP")
        self.assertGreater(len(pathways[0]["recommended_stages"]), 0)

    def test_career_analyze_endpoint(self):
        payload = {
            "student_profile": {
                "student_id": "TEST-API-STU",
                "career_goal": "CAR-AI-ENG",
                "skills": [
                    {
                        "skill_id": "SKL-0012",
                        "skill_name": "Python",
                        "status": "ASSESSMENT_VERIFIED",
                        "assessment_score": 85.0
                    }
                ]
            },
            "career_id": "CAR-AI-ENG"
        }
        response = self.client.post("/api/career/analyze", json=payload)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("candidate_pathways", data)
        self.assertGreaterEqual(len(data["candidate_pathways"]), 3)
        self.assertIsNotNone(data["selected_pathway_gap_analysis"])

    def test_recommend_skills_endpoint(self):
        payload = {
            "student_profile": {
                "student_id": "TEST-API-STU",
                "career_goal": "CAR-AI-ENG",
                "skills": [
                    {
                        "skill_id": "SKL-0012",
                        "skill_name": "Python",
                        "status": "ASSESSMENT_VERIFIED",
                        "assessment_score": 85.0
                    }
                ]
            },
            "career_id": "CAR-AI-ENG",
            "pathway_id": "PATH-AI-APP",
            "top_k": 3
        }
        response = self.client.post("/api/career/recommend-skills", json=payload)
        self.assertEqual(response.status_code, 200)
        recs = response.json()
        self.assertLessEqual(len(recs), 3)
        self.assertTrue(all("rationale" in r for r in recs))

    def test_skills_lookup_and_normalize_endpoints(self):
        # Lookup
        res_skill = self.client.get("/api/skills/SKL-0012")
        self.assertEqual(res_skill.status_code, 200)
        self.assertEqual(res_skill.json()["skill_name"], "Python")

        # Prerequisites
        res_prereq = self.client.get("/api/skills/SKL-0061/prerequisites")
        self.assertEqual(res_prereq.status_code, 200)
        self.assertGreater(len(res_prereq.json()["direct_prerequisites"]), 0)

        # Normalize endpoint
        res_norm = self.client.post("/api/skills/normalize", json={"raw_skill": "k8s"})
        self.assertEqual(res_norm.status_code, 200)
        self.assertEqual(res_norm.json()["canonical_skill_id"], "SKL-0115")
        self.assertEqual(res_norm.json()["canonical_skill_name"], "Kubernetes")

if __name__ == "__main__":
    unittest.main()
