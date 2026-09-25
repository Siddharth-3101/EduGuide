import re
from typing import Dict, List, Any, Tuple

# Comprehensive target role profiles and their primary core competencies
JOB_ROLE_PROFILES: Dict[str, Dict[str, Any]] = {
    "network engineer": {
        "title": "Network Engineer / Network Systems Specialist",
        "description": "Designs, implements, and troubleshoots enterprise network infrastructure, routing/switching protocols, and security.",
        "primary_skills": [
            "cisco networking", "networking", "routing", "switching", "tcp/ip",
            "lan", "wan", "firewall", "vpn", "network security", "dns", "dhcp",
            "subnetting", "packet tracer", "wireshark", "ccna", "ccnp"
        ],
        "supporting_skills": [
            "python", "linux", "bash", "sql", "troubleshooting", "critical thinking",
            "problem solving", "automation"
        ],
        "keywords": ["Routing Protocols", "Switching", "OSPF", "BGP", "VLAN", "IP Addressing", "Network Infrastructure"]
    },
    "python developer": {
        "title": "Python Backend Developer / Software Engineer",
        "description": "Develops robust backend microservices, data pipelines, APIs, and business logic using Python ecosystems.",
        "primary_skills": [
            "python", "django", "fastapi", "flask", "sql", "postgresql", "mysql",
            "rest api", "object-oriented programming", "git", "data structures", "algorithms"
        ],
        "supporting_skills": [
            "c++", "c", "java", "docker", "linux", "redis", "problem solving",
            "leadership", "critical thinking"
        ],
        "keywords": ["Asynchronous Programming", "RESTful Architecture", "ORM", "Database Design", "Unit Testing", "API Optimization"]
    },
    "full stack developer": {
        "title": "Full Stack Software Developer",
        "description": "Builds end-to-end web applications combining responsive frontend interfaces with scalable backend services.",
        "primary_skills": [
            "python", "javascript", "react", "html", "css", "sql", "node.js",
            "java", "rest api", "git", "typescript"
        ],
        "supporting_skills": [
            "c++", "c", "mysql", "mongodb", "docker", "ui/ux", "creativity", "leadership", "negotiation"
        ],
        "keywords": ["Frontend Architecture", "Backend APIs", "Responsive Design", "Database Integration", "State Management"]
    },
    "data analyst": {
        "title": "Data Analyst / BI Specialist",
        "description": "Extracts, transforms, and visualizes complex data sets to deliver actionable business intelligence and insights.",
        "primary_skills": [
            "sql", "python", "data analysis", "excel", "power bi", "tableau",
            "statistics", "pandas", "numpy", "data visualization"
        ],
        "supporting_skills": [
            "java", "c", "critical thinking", "creativity", "communication",
            "problem solving", "machine learning"
        ],
        "keywords": ["Data Modeling", "ETL Pipelines", "Business Intelligence", "Statistical Analysis", "Data Cleaning", "KPI Dashboards"]
    },
    "software engineer": {
        "title": "Software Development Engineer (SDE)",
        "description": "Engineers scalable software systems, algorithms, and application architectures across multiple tech stacks.",
        "primary_skills": [
            "python", "java", "c++", "c", "data structures", "algorithms",
            "sql", "object-oriented programming", "git", "software engineering"
        ],
        "supporting_skills": [
            "cisco networking", "networking", "linux", "problem solving", "critical thinking",
            "leadership", "creativity"
        ],
        "keywords": ["System Architecture", "Algorithms", "Concurrency", "Design Patterns", "Clean Code", "Test-Driven Development"]
    }
}

class RoleMatcher:
    """Matches and prioritizes candidate skills for a specific target job role."""

    @staticmethod
    def normalize_string(s: str) -> str:
        return re.sub(r'\s+', ' ', s.lower().strip())

    @classmethod
    def get_role_profile(cls, target_role: str) -> Dict[str, Any]:
        normalized = cls.normalize_string(target_role)
        
        # Exact or partial match in defined roles
        for key, profile in JOB_ROLE_PROFILES.items():
            if key in normalized or normalized in key:
                return profile
        
        # Generic software engineering role fallback
        return {
            "title": f"{target_role.title()} Specialist",
            "description": f"Professional focused on executing technical goals and driving impact in {target_role}.",
            "primary_skills": ["python", "java", "c++", "c", "sql", "git", "problem solving"],
            "supporting_skills": ["leadership", "critical thinking", "creativity", "communication"],
            "keywords": ["Software Architecture", "Problem Solving", "Technical Execution", "Continuous Learning"]
        }

    @classmethod
    def match_and_prioritize_skills(
        cls,
        target_role: str,
        verified_skills: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Categorizes and prioritizes candidate skills into:
        1. Core Role Competencies (Direct matches for the role)
        2. Technical & Programming Skills
        3. Professional & Soft Skills
        """
        role_profile = cls.get_role_profile(target_role)
        primary_set = set(role_profile["primary_skills"])
        supporting_set = set(role_profile["supporting_skills"])

        core_role_skills = []
        tech_skills = []
        soft_skills = []
        other_skills = []

        for skill in verified_skills:
            name_norm = cls.normalize_string(skill["skill_name"])
            category_norm = cls.normalize_string(skill.get("category", ""))

            # 1. Is it a primary role match?
            is_primary = any(p in name_norm or name_norm in p for p in primary_set)
            is_supporting = any(s in name_norm or name_norm in s for s in supporting_set)

            if is_primary:
                core_role_skills.append(skill)
            elif "soft" in category_norm or "communication" in category_norm:
                soft_skills.append(skill)
            elif "programming" in category_norm or "database" in category_norm or "technical" in category_norm:
                tech_skills.append(skill)
            else:
                if is_supporting:
                    tech_skills.append(skill)
                else:
                    other_skills.append(skill)

        # Match score calculation
        matched_primary_count = len(core_role_skills)
        target_primary_count = min(len(primary_set), 5)
        score = min(100, int((matched_primary_count / max(1, target_primary_count)) * 100))

        return {
            "target_role_title": role_profile["title"],
            "role_description": role_profile["description"],
            "role_keywords": role_profile["keywords"],
            "match_score_percentage": score,
            "core_role_skills": core_role_skills,
            "technical_skills": tech_skills,
            "soft_skills": soft_skills,
            "other_skills": other_skills
        }
