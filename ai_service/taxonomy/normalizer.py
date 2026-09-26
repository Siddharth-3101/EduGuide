import re
from difflib import SequenceMatcher
from typing import Optional, Tuple
from ai_service.core.schemas import NormalizationResult
from ai_service.core.enums import MatchType
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy, normalize_text
from ai_service.taxonomy.candidate_manager import get_candidate_manager

# Common domain acronyms and high-frequency shorthands
DOMAIN_SYNONYMS = {
    "k8s": "SKL-0115",               # Kubernetes
    "kube": "SKL-0115",
    "kubernetes": "SKL-0115",
    "dsa": "SKL-0002",               # Data Structures and Algorithms
    "algo": "SKL-0002",
    "algorithms": "SKL-0002",
    "data structures": "SKL-0002",
    "oop": "SKL-0003",               # Object-Oriented Programming
    "oops": "SKL-0003",
    "nlp": "SKL-0069",               # Natural Language Processing
    "natural language processing": "SKL-0069",
    "cv": "SKL-0068",                # Computer Vision
    "computer vision": "SKL-0068",
    "genai": "SKL-0070",             # Generative AI
    "generative ai": "SKL-0070",
    "gen ai": "SKL-0070",
    "llm": "SKL-0071",               # Large Language Models
    "llms": "SKL-0071",
    "large language model": "SKL-0071",
    "large language models": "SKL-0071",
    "rag": "SKL-0073",               # Retrieval-Augmented Generation
    "vector db": "SKL-0075",         # Vector Databases
    "vector databases": "SKL-0075",
    "vector dbs": "SKL-0075",
    "ml": "SKL-0060",                # Machine Learning
    "machine learning": "SKL-0060",
    "dl": "SKL-0061",                # Deep Learning
    "deep learning": "SKL-0061",
    "rl": "SKL-0064",                # Reinforcement Learning
    "reinforcement learning": "SKL-0064",
    "ann": "SKL-0067",               # Neural Networks
    "neural networks": "SKL-0067",
    "neural network": "SKL-0067",
    "transformers": "SKL-0077",       # Transformers
    "transformer": "SKL-0077",
    "aws": "SKL-0097",               # Amazon Web Services
    "amazon web services": "SKL-0097",
    "gcp": "SKL-0099",               # Google Cloud Platform
    "google cloud": "SKL-0099",
    "azure": "SKL-0098",             # Microsoft Azure
    "microsoft azure": "SKL-0098",
    "ec2": "SKL-0100",               # Amazon EC2
    "amazon ec2": "SKL-0100",
    "s3": "SKL-0101",                # Amazon S3
    "amazon s3": "SKL-0101",
    "lambda": "SKL-0102",            # AWS Lambda
    "aws lambda": "SKL-0102",
    "rds": "SKL-0103",               # Amazon RDS
    "amazon rds": "SKL-0103",
    "iam": "SKL-0104",               # AWS IAM
    "aws iam": "SKL-0104",
    "iac": "SKL-0120",               # Infrastructure as Code
    "infrastructure as code": "SKL-0120",
    "terraform": "SKL-0116",         # Terraform
    "docker": "SKL-0114",            # Docker
    "ci cd": "SKL-0113",             # CI/CD
    "cicd": "SKL-0113",
    "continuous integration": "SKL-0113",
    "js": "SKL-0013",                # JavaScript
    "javascript": "SKL-0013",
    "ts": "SKL-0014",                # TypeScript
    "typescript": "SKL-0014",
    "py": "SKL-0012",                # Python
    "python": "SKL-0012",
    "python 3": "SKL-0012",
    "python3": "SKL-0012",
    "react": "SKL-0027",             # React
    "reactjs": "SKL-0027",
    "react js": "SKL-0027",
    "nextjs": "SKL-0030",            # Next.js
    "next js": "SKL-0030",
    "vue": "SKL-0029",               # Vue.js
    "vuejs": "SKL-0029",
    "vue js": "SKL-0029",
    "angular": "SKL-0028",           # Angular
    "angularjs": "SKL-0028",
    "angular js": "SKL-0028",
    "springboot": "SKL-0037",        # Spring Boot
    "spring boot": "SKL-0037",
    "spring": "SKL-0037",
    "fastapi": "SKL-0040",           # FastAPI
    "fast api": "SKL-0040",
    "express": "SKL-0036",           # Express.js
    "expressjs": "SKL-0036",
    "express js": "SKL-0036",
    "node": "SKL-0035",              # Node.js
    "nodejs": "SKL-0035",
    "node js": "SKL-0035",
    "sql": "SKL-0047",               # SQL
    "postgres": "SKL-0049",          # PostgreSQL
    "postgresql": "SKL-0049",
    "mysql": "SKL-0048",             # MySQL
    "mongo": "SKL-0052",             # MongoDB
    "mongodb": "SKL-0052",
    "redis": "SKL-0053",             # Redis
    "sklearn": "SKL-0084",           # Scikit-learn
    "scikit learn": "SKL-0084",
    "pandas": "SKL-0083",            # Pandas
    "numpy": "SKL-0082",             # NumPy
    "matplotlib": "SKL-0085",        # Matplotlib
    "ai agents": "SKL-0211",         # AI Agents
    "ai agent": "SKL-0211",
    "agentic ai": "SKL-0211",
    "prompt engineering": "SKL-0072",# Prompt Engineering
    "fine tuning": "SKL-0076",       # Fine-tuning
    "finetuning": "SKL-0076",
    "rest api": "SKL-0041",          # REST API
    "rest apis": "SKL-0041",
    "restful api": "SKL-0041",
    "apis": "SKL-0041",
    "graphql": "SKL-0042",           # GraphQL
    "microservices": "SKL-0043",     # Microservices
    "microservice": "SKL-0043",
    "soc": "SKL-0130",               # Security Operations
    "security operations": "SKL-0130",
    "pentesting": "SKL-0127",        # Penetration Testing
    "penetration testing": "SKL-0127",
    "ethical hacking": "SKL-0126",   # Ethical Hacking
    "appsec": "SKL-0124",            # Application Security
    "application security": "SKL-0124",
    "ui design": "SKL-0174",         # UI Design
    "ux design": "SKL-0175",         # UX Design
    "figma": "SKL-0178",             # Figma
    "linux": "SKL-0118",             # Linux
    "git": "SKL-0108",               # Git
    "github": "SKL-0109",            # GitHub
    "gitlab": "SKL-0110",            # GitLab
}

def clean_skill_string(text: str) -> str:
    """Removes common conversational or descriptor suffixes like 'programming', 'basics', etc."""
    if not text:
        return ""
    text = text.strip()
    # Strip versions like v1, v2, 3.0
    text = re.sub(r'\bv?\d+(\.\d+)*\b', '', text)
    # Strip parenthetical descriptions e.g. "React (JavaScript Library)" -> "React"
    text = re.sub(r'\(.*?\)', '', text)
    # Strip common filler suffixes
    text = re.sub(r'\b(programming language|programming|language|framework|library|basics|fundamentals|overview|introduction to|intro to)\b', '', text, flags=re.IGNORECASE)
    return text.strip()

class SkillNormalizer:
    """Engine 1: Multi-Stage Skill Normalizer with candidate isolation."""

    def __init__(self, fuzzy_threshold: float = 0.88):
        self.taxonomy = get_canonical_taxonomy()
        self.candidate_manager = get_candidate_manager()
        self.fuzzy_threshold = fuzzy_threshold

    def normalize(self, raw_input: str, context: str = "", source: str = "Unknown") -> NormalizationResult:
        if not raw_input or not raw_input.strip():
            return NormalizationResult(
                raw_input="",
                canonical_skill_id=None,
                canonical_skill_name=None,
                confidence=0.0,
                match_type=MatchType.CANDIDATE,
                is_candidate=False,
                message="Empty input"
            )

        trimmed = raw_input.strip()
        cleaned = clean_skill_string(trimmed)
        norm_raw = normalize_text(trimmed)
        norm_clean = normalize_text(cleaned)

        # 1. Tier 1: Exact Match against Canonical Skill Name
        for check in [trimmed, cleaned]:
            if check.lower() in self.taxonomy.skills_by_name:
                skill = self.taxonomy.skills_by_name[check.lower()]
                return NormalizationResult(
                    raw_input=trimmed,
                    canonical_skill_id=skill.skill_id,
                    canonical_skill_name=skill.skill_name,
                    confidence=1.0,
                    match_type=MatchType.EXACT,
                    is_candidate=False
                )

        # 2. Tier 2: Domain Synonyms & Acronyms dictionary
        for check in [norm_raw, norm_clean]:
            if check in DOMAIN_SYNONYMS:
                skill_id = DOMAIN_SYNONYMS[check]
                skill = self.taxonomy.skills_by_id.get(skill_id)
                if skill:
                    return NormalizationResult(
                        raw_input=trimmed,
                        canonical_skill_id=skill.skill_id,
                        canonical_skill_name=skill.skill_name,
                        confidence=0.98,
                        match_type=MatchType.ALIAS,
                        is_candidate=False
                    )

        # 3. Tier 3: Pre-indexed Canonical Aliases
        for check in [norm_raw, norm_clean]:
            if check in self.taxonomy.normalized_alias_to_id:
                skill_id = self.taxonomy.normalized_alias_to_id[check]
                skill = self.taxonomy.skills_by_id[skill_id]
                return NormalizationResult(
                    raw_input=trimmed,
                    canonical_skill_id=skill.skill_id,
                    canonical_skill_name=skill.skill_name,
                    confidence=0.95,
                    match_type=MatchType.ALIAS,
                    is_candidate=False
                )

        # 4. Tier 4: Substring containment check (Word boundary matches)
        # Check if canonical skill name or common alias is contained in the input
        # e.g., "Docker containerization" contains "docker"
        best_sub_match: Optional[Tuple[str, str, float]] = None
        for canonical_name_lower, skill in self.taxonomy.skills_by_name.items():
            if len(canonical_name_lower) < 3:
                continue
            pattern = r'\b' + re.escape(canonical_name_lower) + r'\b'
            if re.search(pattern, trimmed.lower()):
                # length weight to prefer longer more specific matches
                score = 0.90 + (len(canonical_name_lower) / 100.0)
                if best_sub_match is None or score > best_sub_match[2]:
                    best_sub_match = (skill.skill_id, skill.skill_name, score)

        if best_sub_match:
            return NormalizationResult(
                raw_input=trimmed,
                canonical_skill_id=best_sub_match[0],
                canonical_skill_name=best_sub_match[1],
                confidence=min(0.92, best_sub_match[2]),
                match_type=MatchType.FUZZY,
                is_candidate=False
            )

        # 5. Tier 5: Fuzzy Levenshtein / Token Ratio Matching
        best_fuzzy_match: Optional[Tuple[str, str, float]] = None
        highest_ratio = 0.0

        for norm_alias, skill_id in self.taxonomy.normalized_alias_to_id.items():
            # Skip tiny aliases for fuzzy check to prevent false positives (e.g. "c", "r", "go")
            if len(norm_alias) < 3:
                continue
            ratio = SequenceMatcher(None, norm_clean, norm_alias).ratio()
            if ratio > highest_ratio:
                highest_ratio = ratio
                skill = self.taxonomy.skills_by_id[skill_id]
                best_fuzzy_match = (skill.skill_id, skill.skill_name, ratio)

        if best_fuzzy_match and highest_ratio >= self.fuzzy_threshold:
            return NormalizationResult(
                raw_input=trimmed,
                canonical_skill_id=best_fuzzy_match[0],
                canonical_skill_name=best_fuzzy_match[1],
                confidence=round(highest_ratio, 3),
                match_type=MatchType.FUZZY,
                is_candidate=False
            )

        # 6. Tier 6: Semantic Vector Match (Embeddings / TF-IDF Cosine)
        try:
            from ai_service.taxonomy.semantic_matcher import get_semantic_matcher
            matcher = get_semantic_matcher()
            semantic_match = matcher.match_skill(trimmed, threshold=0.85)
            if semantic_match:
                skill_id, skill_name, sim_score = semantic_match
                return NormalizationResult(
                    raw_input=trimmed,
                    canonical_skill_id=skill_id,
                    canonical_skill_name=skill_name,
                    confidence=round(sim_score, 3),
                    match_type=MatchType.SEMANTIC,
                    semantic_score=round(sim_score, 3),
                    is_candidate=False
                )
        except Exception:
            pass

        # 7. Tier 7: Quarantined Candidate Registration (Unmapped Skill)
        candidate = self.candidate_manager.register_candidate(
            raw_name=trimmed,
            context=context,
            source=source
        )

        return NormalizationResult(
            raw_input=trimmed,
            canonical_skill_id=None,
            canonical_skill_name=None,
            confidence=0.50,
            match_type=MatchType.CANDIDATE,
            is_candidate=True,
            candidate_id=candidate.candidate_id,
            message="No canonical skill match found. Quarantined in candidate registry."
        )

# Global singleton normalizer
_normalizer_instance: Optional[SkillNormalizer] = None

def get_skill_normalizer() -> SkillNormalizer:
    global _normalizer_instance
    if _normalizer_instance is None:
        _normalizer_instance = SkillNormalizer()
    return _normalizer_instance
