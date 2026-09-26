import unittest
from starlette.testclient import TestClient
from ai_service.api.main import app

class TestAPIPhase2(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    # ---------------------------------------------------------
    # Progressive Projects Endpoints
    # ---------------------------------------------------------
    def test_list_and_get_projects(self):
        # List
        res_list = self.client.get("/api/projects")
        self.assertEqual(res_list.status_code, 200)
        projects = res_list.json()
        self.assertGreaterEqual(len(projects), 10)

        # Get by ID
        res_one = self.client.get("/api/projects/PRJ-PY-001")
        self.assertEqual(res_one.status_code, 200)
        data = res_one.json()
        self.assertEqual(data["project_id"], "PRJ-PY-001")
        self.assertIn("CLI Utility", data["title"])

        # Not found
        res_404 = self.client.get("/api/projects/NON-EXISTENT")
        self.assertEqual(res_404.status_code, 404)

    def test_recommend_and_complete_projects(self):
        payload = {
            "student_profile": {
                "student_id": "STU-API-01",
                "career_goal": "CAR-AI-ENG",
                "skills": [
                    {"skill_id": "SKL-0012", "skill_name": "Python", "status": "ASSESSMENT_VERIFIED"},
                    {"skill_id": "SKL-0040", "skill_name": "FastAPI", "status": "CLAIMED"}
                ]
            },
            "limit": 3
        }
        res_rec = self.client.post("/api/projects/recommend", json=payload)
        self.assertEqual(res_rec.status_code, 200)
        recs = res_rec.json()
        self.assertGreater(len(recs), 0)

        # Complete project
        complete_payload = {
            "student_profile": payload["student_profile"],
            "artifact_url": "https://github.com/student/my-api"
        }
        res_comp = self.client.post("/api/projects/PRJ-FASTAPI-001/complete", json=complete_payload)
        self.assertEqual(res_comp.status_code, 200)
        comp_data = res_comp.json()
        self.assertIn("FastAPI", comp_data["promoted_skills"])
        self.assertIn("Production ML Inference REST API", comp_data["updated_profile"]["completed_projects"])

    # ---------------------------------------------------------
    # Learning Resources Endpoints
    # ---------------------------------------------------------
    def test_learning_resources_endpoints(self):
        # By skill ID
        res_skill = self.client.get("/api/resources/SKL-0012")
        self.assertEqual(res_skill.status_code, 200)
        resources = res_skill.json()
        self.assertGreater(len(resources), 0)

        # Recommend for gaps
        payload = {
            "student_profile": {
                "student_id": "STU-API-02",
                "career_goal": "CAR-AI-ENG",
                "skills": [
                    {"skill_id": "SKL-0012", "skill_name": "Python", "status": "ASSESSMENT_VERIFIED"}
                ]
            },
            "career_id": "CAR-AI-ENG",
            "pathway_id": "PATH-AI-APP"
        }
        res_rec = self.client.post("/api/resources/recommend", json=payload)
        self.assertEqual(res_rec.status_code, 200)
        data = res_rec.json()
        self.assertIsInstance(data, dict)

    # ---------------------------------------------------------
    # Career Pathway & Personalization Endpoints
    # ---------------------------------------------------------
    def test_career_pathways_and_recommend_pathways(self):
        # List pathways under career
        res_pathways = self.client.get("/api/career/CAR-AI-ENG/pathways")
        self.assertEqual(res_pathways.status_code, 200)
        pathways = res_pathways.json()
        self.assertGreaterEqual(len(pathways), 3)

        # Recommend pathways
        payload = {
            "student_profile": {
                "student_id": "STU-API-03",
                "career_goal": "CAR-AI-ENG",
                "interests": ["generative ai"],
                "skills": [
                    {"skill_id": "SKL-0012", "skill_name": "Python", "status": "ASSESSMENT_VERIFIED"}
                ]
            },
            "career_id": "CAR-AI-ENG"
        }
        res_rec = self.client.post("/api/career/recommend-pathways", json=payload)
        self.assertEqual(res_rec.status_code, 200)
        recs = res_rec.json()
        self.assertGreater(len(recs), 0)
        self.assertIn("PATH-AI-GENAI", [r["pathway_id"] for r in recs])

    def test_personalize_roadmap_endpoint(self):
        payload = {
            "student_profile": {
                "student_id": "STU-API-04",
                "career_goal": "CAR-AI-ENG",
                "skills": [
                    {"skill_id": "SKL-0012", "skill_name": "Python", "status": "ASSESSMENT_VERIFIED"}
                ]
            },
            "career_id": "CAR-AI-ENG",
            "pathway_id": "PATH-AI-APP",
            "weekly_hours": 12
        }
        res = self.client.post("/api/career/personalize-roadmap", json=payload)
        self.assertEqual(res.status_code, 200)
        roadmap = res.json()
        self.assertIsNotNone(roadmap["roadmap_id"])
        self.assertIn(roadmap["llm_status"], ["available", "unavailable"])
        self.assertIsNotNone(roadmap["personalization_narrative"])
        self.assertIsNotNone(roadmap["weekly_study_plan"])

    def test_assess_and_adapt_endpoint(self):
        payload = {
            "student_profile": {
                "student_id": "STU-API-05",
                "career_goal": "CAR-AI-ENG",
                "skills": [
                    {"skill_id": "SKL-0012", "skill_name": "Python", "status": "CLAIMED"}
                ]
            },
            "assessment": {
                "skill_id": "SKL-0012",
                "assessment_score": 88.0
            },
            "career_id": "CAR-AI-ENG",
            "pathway_id": "PATH-AI-APP",
            "weekly_hours": 10
        }
        res = self.client.post("/api/career/assess-and-adapt", json=payload)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn("adapted_roadmap", data)
        updated_skills = data["updated_profile"]["skills"]
        python_skill = next((s for s in updated_skills if s["skill_id"] == "SKL-0012"), None)
        self.assertIsNotNone(python_skill)
        self.assertEqual(python_skill["status"], "ASSESSMENT_VERIFIED")

    # ---------------------------------------------------------
    # LLM & Meta Endpoints
    # ---------------------------------------------------------
    def test_llm_endpoints(self):
        # LLM Health
        res_health = self.client.get("/api/llm/health")
        self.assertEqual(res_health.status_code, 200)
        self.assertIn("status", res_health.json())

        # LLM Explain Recommendation
        payload = {
            "skill_id": "SKL-0061",
            "student_profile": {
                "student_id": "STU-API-06",
                "career_goal": "CAR-AI-ENG"
            },
            "career_id": "CAR-AI-ENG",
            "pathway_id": "PATH-AI-APP"
        }
        res_explain = self.client.post("/api/llm/explain-recommendation", json=payload)
        self.assertEqual(res_explain.status_code, 200)
        self.assertIn("explanation", res_explain.json())

    def test_meta_and_graph_inspection_endpoints(self):
        # /api/meta
        res_meta = self.client.get("/api/meta")
        self.assertEqual(res_meta.status_code, 200)
        data_meta = res_meta.json()
        self.assertEqual(data_meta["platform"], "SkillSync AI Career Intelligence Backend")
        self.assertEqual(data_meta["version"], "2.0.0")

        # /api/graph/stats
        res_graph = self.client.get("/api/graph/stats")
        self.assertEqual(res_graph.status_code, 200)
        data_graph = res_graph.json()
        self.assertTrue(data_graph["is_acyclic"])
        self.assertGreater(data_graph["total_nodes"], 0)
        self.assertGreater(data_graph["total_edges"], 0)

        # /api/taxonomy/stats
        res_tax = self.client.get("/api/taxonomy/stats")
        self.assertEqual(res_tax.status_code, 200)
        data_tax = res_tax.json()
        self.assertEqual(data_tax["total_canonical_skills"], 222)
        self.assertIn("category_distribution", data_tax)

if __name__ == "__main__":
    unittest.main()
