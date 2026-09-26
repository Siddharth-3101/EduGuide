import unittest
from ai_service.taxonomy.semantic_matcher import get_semantic_matcher

class TestSemanticSkillMatcher(unittest.TestCase):
    def setUp(self):
        self.matcher = get_semantic_matcher()

    def test_exact_and_alias_matches(self):
        # Match 'python 3' -> Python
        match = self.matcher.match_skill("python 3", threshold=0.60)
        self.assertIsNotNone(match)
        self.assertEqual(match[1], "Python")

    def test_fuzzy_and_semantic_term_match(self):
        # Match 'spring framework backend' -> Spring Boot / Spring
        match = self.matcher.match_skill("spring framework", threshold=0.50)
        self.assertIsNotNone(match)
        self.assertTrue("Spring" in match[1])

    def test_text_similarity_calculation(self):
        text_a = "Java Spring Boot microservices with REST APIs and MySQL database"
        text_b = "Backend engineer developing Spring Boot microservices with Java and SQL"
        text_c = "Figma UI/UX design and wireframing for mobile app interface"

        sim_ab = self.matcher.calculate_semantic_similarity(text_a, text_b)
        sim_ac = self.matcher.calculate_semantic_similarity(text_a, text_c)

        self.assertGreater(sim_ab, 0.40)
        self.assertGreater(sim_ab, sim_ac)

    def test_query_cache_hit(self):
        res1 = self.matcher.find_closest_skills("machine learning deep neural nets", top_k=3)
        res2 = self.matcher.find_closest_skills("machine learning deep neural nets", top_k=3)
        self.assertEqual(res1, res2)

if __name__ == "__main__":
    unittest.main()
