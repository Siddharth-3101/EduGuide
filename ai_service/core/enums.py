from enum import Enum

class VerificationStatus(str, Enum):
    CLAIMED = "CLAIMED"
    EVIDENCE_BACKED = "EVIDENCE_BACKED"
    ASSESSMENT_VERIFIED = "ASSESSMENT_VERIFIED"
    MISSING = "MISSING"

class RequirementCategory(str, Enum):
    MANDATORY = "MANDATORY"
    IMPORTANT = "IMPORTANT"
    OPTIONAL = "OPTIONAL"
    FRONTIER = "FRONTIER"

class SkillImportance(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class GapClassification(str, Enum):
    MISSING = "MISSING"
    WEAK = "WEAK"
    CLAIMED_ONLY = "CLAIMED_ONLY"
    EVIDENCE_GAP = "EVIDENCE_GAP"
    ASSESSMENT_GAP = "ASSESSMENT_GAP"
    PREREQUISITE_GAP = "PREREQUISITE_GAP"
    SATISFIED_VERIFIED = "SATISFIED_VERIFIED"
    SATISFIED_EVIDENCE = "SATISFIED_EVIDENCE"

class DAGRelationshipType(str, Enum):
    PREREQUISITE = "PREREQUISITE"
    CURRICULUM_PREREQUISITE = "CURRICULUM_PREREQUISITE"
    RELATED = "RELATED"
    ALTERNATIVE = "ALTERNATIVE"
    SPECIALIZATION = "SPECIALIZATION"

class EvidenceSourceType(str, Enum):
    RESUME = "RESUME"
    CERTIFICATE = "CERTIFICATE"
    GITHUB = "GITHUB"
    PROJECT = "PROJECT"
    ASSESSMENT = "ASSESSMENT"
    MANUAL = "MANUAL"

class ProficiencyLevel(str, Enum):
    NONE = "None"
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    EXPERT = "Expert"

class ValidationStatus(str, Enum):
    VALIDATED = "VALIDATED"
    PROVISIONAL = "PROVISIONAL"
    CANDIDATE = "CANDIDATE"

class SourceType(str, Enum):
    CANONICAL_TAXONOMY = "CANONICAL_TAXONOMY"
    ROADMAP_PDF = "ROADMAP_PDF"
    INDUSTRY_DATA = "INDUSTRY_DATA"
    CURRICULUM_SPEC = "CURRICULUM_SPEC"
    STUDENT_INPUT = "STUDENT_INPUT"

class SkillDifficulty(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"

class MatchType(str, Enum):
    EXACT = "EXACT"
    ALIAS = "ALIAS"
    FUZZY = "FUZZY"
    SEMANTIC = "SEMANTIC"
    CANDIDATE = "CANDIDATE"

class ResourceType(str, Enum):
    DOCUMENTATION = "DOCUMENTATION"
    COURSE = "COURSE"
    TUTORIAL = "TUTORIAL"
    VIDEO = "VIDEO"
    ARTICLE = "ARTICLE"
    BOOK = "BOOK"
    PRACTICE = "PRACTICE"

class ProjectDifficulty(str, Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    CAPSTONE = "CAPSTONE"

class JobMatchTier(str, Enum):
    STRONG_MATCH = "STRONG_MATCH"
    MODERATE_MATCH = "MODERATE_MATCH"
    DEVELOPING_MATCH = "DEVELOPING_MATCH"

class ExperienceLevel(str, Enum):
    ENTRY_LEVEL = "Entry Level (0-2 yrs)"
    ASSOCIATE = "Associate (1-3 yrs)"
    MID_LEVEL = "Mid-Level (2-5 yrs)"
    SENIOR = "Senior (5+ yrs)"

class WorkMode(str, Enum):
    REMOTE = "Remote"
    HYBRID = "Hybrid"
    ONSITE = "On-site"

class EmploymentType(str, Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    INTERNSHIP = "Internship"
