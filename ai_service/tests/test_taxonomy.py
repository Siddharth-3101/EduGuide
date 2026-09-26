import unittest
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

class TestTaxonomy(unittest.TestCase):
    def test_canonical_taxonomy_loaded(self):
        taxonomy = get_canonical_taxonomy()
        self.assertEqual(taxonomy.total_skills(), 222)
        self.assertIn("SKL-0012", taxonomy.skills_by_id)
        python_skill = taxonomy.skills_by_id["SKL-0012"]
        self.assertEqual(python_skill.skill_name, "Python")
        self.assertEqual(python_skill.category, "Programming Languages")
        self.assertIsNotNone(python_skill.provenance)
        self.assertEqual(python_skill.provenance.confidence, 1.0)

    def test_canonical_taxonomy_alias_lookup(self):
        taxonomy = get_canonical_taxonomy()
        skill = taxonomy.get_skill("k8s")
        self.assertIsNotNone(skill)
        self.assertEqual(skill.skill_name, "Kubernetes")

        skill_oop = taxonomy.get_skill("oop")
        self.assertIsNotNone(skill_oop)
        self.assertEqual(skill_oop.skill_name, "Object-Oriented Programming")

    def test_canonical_prerequisite_map(self):
        taxonomy = get_canonical_taxonomy()
        self.assertIn("SKL-0061", taxonomy.prerequisite_id_map)
        prereqs = taxonomy.prerequisite_id_map["SKL-0061"]
        self.assertGreater(len(prereqs), 0)
        self.assertIn("SKL-0012", prereqs)
        self.assertIn("SKL-0060", prereqs)

if __name__ == "__main__":
    unittest.main()
