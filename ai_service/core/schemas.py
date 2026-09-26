from datetime import datetime, timezone
import uuid
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field
from .enums import (
    VerificationStatus,
    RequirementCategory,
    SkillImportance,
    GapClassification,
    DAGRelationshipType,
    EvidenceSourceType,
    ProficiencyLevel,
    ValidationStatus,
    SourceType,
    MatchType,
    SkillDifficulty,
    ResourceType,
    ProjectDifficulty,
    JobMatchTier,
    ExperienceLevel,
    WorkMode,
    EmploymentType
)

class Provenance(BaseModel):
    source: str
    source_type: SourceType
    confidence: float = Field(default=1.0, ge=0.0, le=1.0)
    extracted_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    validation_status: ValidationStatus = ValidationStatus.VALIDATED

class CanonicalSkill(BaseModel):
    skill_id: str
    skill_name: str
    category: str
    subcategory: str
    skill_type: str
    description: str
    aliases: List[str] = Field(default_factory=list)
    parent_skill: Optional[str] = None
    related_skills: List[str] = Field(default_factory=list)
    difficulty: str
    assessment_available: str
    career_relevance: List[str] = Field(default_factory=list)
    source: str
    status: str
    prerequisite_skills: List[str] = Field(default_factory=list)
    taxonomy_version: str
    provenance: Optional[Provenance] = None

class NormalizationResult(BaseModel):
    raw_input: str
    canonical_skill_id: Optional[str] = None
    canonical_skill_name: Optional[str] = None
    confidence: float
    match_type: MatchType
    is_candidate: bool = False
    candidate_id: Optional[str] = None
    message: Optional[str] = None
    semantic_score: Optional[float] = None

class CandidateSkill(BaseModel):
    candidate_id: str
    raw_name: str
    detected_contexts: List[str] = Field(default_factory=list)
    frequency: int = 1
    first_seen: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    last_seen: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    status: ValidationStatus = ValidationStatus.CANDIDATE
    provenance: Provenance

class EvidenceRecord(BaseModel):
    evidence_id: str = Field(default_factory=lambda: f"EV-{uuid.uuid4().hex[:8].upper()}")
    skill_id: Optional[str] = None
    skill_name: Optional[str] = None
    source_type: EvidenceSourceType
    source_name: str
    verification_status: VerificationStatus = VerificationStatus.EVIDENCE_BACKED
    context_snippet: Optional[str] = None
    demonstrated_context: Optional[str] = None
    confidence: float = 0.85
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class StudentSkillEntry(BaseModel):
    skill_id: Optional[Union[str, int]] = None
    skill_name: Optional[str] = None
    status: VerificationStatus = VerificationStatus.CLAIMED
    proficiency_level: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    confidence: float = 0.80
    assessment_score: Optional[float] = None
    verified_at: Optional[str] = None
    last_demonstrated_at: Optional[str] = None
    evidence_count: int = 1
    evidence_sources: List[str] = Field(default_factory=list)
    evidence_records: List[EvidenceRecord] = Field(default_factory=list)

class StudentProfile(BaseModel):
    student_id: Union[str, int] = "1"
    career_goal: Optional[str] = "Software Engineer"
    target_pathway: Optional[str] = None
    skills: List[StudentSkillEntry] = Field(default_factory=list)
    completed_projects: List[str] = Field(default_factory=list)
    interests: List[str] = Field(default_factory=list)
    experience_summary: Optional[str] = None

class Competency(BaseModel):
    competency_id: str
    competency_name: str
    description: str
    skill_ids: List[str] = Field(default_factory=list)
    required_level: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    importance: SkillImportance = SkillImportance.HIGH

class CompetencyProgress(BaseModel):
    competency_id: str
    competency_name: str
    coverage_pct: float
    verified_skills_count: int
    total_skills_count: int
    is_satisfied: bool
    status_summary: str

class PathwaySkillRequirement(BaseModel):
    skill_id: str
    skill_name: str
    importance: SkillImportance = SkillImportance.HIGH
    requirement_category: RequirementCategory = RequirementCategory.MANDATORY
    recommended_status: VerificationStatus = VerificationStatus.ASSESSMENT_VERIFIED
    stage_order: int = 1
    provenance: Optional[Provenance] = None

class RoadmapStage(BaseModel):
    stage_order: int
    title: str
    description: str = ""
    skills: List[PathwaySkillRequirement] = Field(default_factory=list)
    checkpoint_project: Optional[str] = None

class CareerPathway(BaseModel):
    pathway_id: str
    pathway_name: str
    description: str
    competencies: List[Competency] = Field(default_factory=list)
    core_skills: List[PathwaySkillRequirement] = Field(default_factory=list)
    optional_skills: List[PathwaySkillRequirement] = Field(default_factory=list)
    recommended_stages: List[RoadmapStage] = Field(default_factory=list)
    provenance: Optional[Provenance] = None

class CareerProfile(BaseModel):
    career_id: str
    career_name: str
    category: str
    description: str
    pathways: List[CareerPathway] = Field(default_factory=list)
    provenance: Optional[Provenance] = None

class PathwayRecommendation(BaseModel):
    pathway_id: str
    pathway_name: str
    suitability_score: float
    match_percentage: float
    match_score: Optional[float] = None
    reasons: List[str] = Field(default_factory=list)
    recommendation_reasons: List[str] = Field(default_factory=list)
    strong_competencies: List[str] = Field(default_factory=list)
    weak_competencies: List[str] = Field(default_factory=list)
    matched_skills_count: int = 0
    missing_skills_count: int = 0
    prerequisite_readiness_pct: float = 100.0
    explanation: Optional[str] = None

class SkillGapItem(BaseModel):
    skill_id: str
    skill_name: str
    importance: SkillImportance = SkillImportance.HIGH
    requirement_category: RequirementCategory = RequirementCategory.MANDATORY
    student_status: VerificationStatus = VerificationStatus.MISSING
    score: Optional[float] = None
    gap_type: str = "MISSING"
    gap_classification: GapClassification = GapClassification.MISSING
    gap_severity: str = "HIGH"
    priority_level: str = "High Priority"
    verification_warning: Optional[str] = None
    prerequisites_satisfied: bool = True
    unmet_prerequisites: List[str] = Field(default_factory=list)

class SkillGapAnalysisResult(BaseModel):
    student_id: str
    career_id: str
    career_name: str
    pathway_id: str
    pathway_name: str
    overall_coverage_pct: float
    verified_coverage_pct: float
    strong_skills: List[SkillGapItem] = Field(default_factory=list)
    evidence_backed_skills: List[SkillGapItem] = Field(default_factory=list)
    claimed_only_skills: List[SkillGapItem] = Field(default_factory=list)
    missing_skills: List[SkillGapItem] = Field(default_factory=list)
    verification_gaps: List[str] = Field(default_factory=list)
    competency_progress: List[CompetencyProgress] = Field(default_factory=list)
    summary: str

class SkillRecommendation(BaseModel):
    skill_id: str
    skill_name: str
    priority_score: float
    career_importance: SkillImportance = SkillImportance.HIGH
    requirement_category: RequirementCategory = RequirementCategory.MANDATORY
    prerequisite_readiness: float = 1.0
    prerequisites_satisfied: List[str] = Field(default_factory=list)
    unmet_prerequisites: List[str] = Field(default_factory=list)
    verification_warning: Optional[str] = None
    rationale: str
    reasons: List[str] = Field(default_factory=list)
    category: Optional[str] = None
    difficulty: Optional[str] = None
    action_type: str = "LEARN"  # LEARN | ASSESS | PRACTICE | PROJECT

class PersonalizedRoadmapStage(BaseModel):
    stage_number: int
    stage_title: str
    skills: List[SkillRecommendation] = Field(default_factory=list)
    stage_rationale: str
    recommended_checkpoint: Optional[str] = None

class PersonalizedRoadmap(BaseModel):
    roadmap_id: str = Field(default_factory=lambda: f"RDM-{uuid.uuid4().hex[:8].upper()}")
    student_id: str
    career_id: str
    career_name: str
    pathway_id: str
    pathway_name: str
    generated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    stages: List[PersonalizedRoadmapStage] = Field(default_factory=list)
    next_best_action: Optional[SkillRecommendation] = None
    summary: str
    llm_status: str = "unavailable"
    personalization_narrative: Optional[str] = None
    weekly_study_plan: Optional[List[Dict[str, Any]]] = None
    practical_advice: Optional[str] = None

class LearningResource(BaseModel):
    resource_id: str
    skill_id: str
    title: str
    provider: str
    url: str
    resource_type: ResourceType
    difficulty: SkillDifficulty
    description: str
    estimated_hours: float
    quality_score: float = Field(default=0.85, ge=0.0, le=1.0)
    status: ValidationStatus = ValidationStatus.VALIDATED

class ProjectItem(BaseModel):
    project_id: str
    title: str
    difficulty: ProjectDifficulty
    skills_required: List[str] = Field(default_factory=list)  # skill_ids
    skills_practiced: List[str] = Field(default_factory=list)  # skill_ids
    prerequisites: List[str] = Field(default_factory=list)  # skill_ids
    career_relevance: List[str] = Field(default_factory=list)
    pathway_relevance: List[str] = Field(default_factory=list)
    description: str
    expected_outcomes: List[str] = Field(default_factory=list)

class ProjectRecommendation(BaseModel):
    project: ProjectItem
    suitability_score: float
    reason: str
    known_skills_count: int
    total_required_count: int
    skills_to_practice: List[str] = Field(default_factory=list)

class ProjectCompletionResponse(BaseModel):
    student_id: str
    project_id: str
    project_title: str
    promoted_skills: List[str] = Field(default_factory=list)
    updated_profile: StudentProfile
    message: str

class AssessmentResultInput(BaseModel):
    skill_id: str
    assessment_score: float
    status: VerificationStatus = VerificationStatus.ASSESSMENT_VERIFIED
    verified_at: Optional[Union[str, datetime]] = None

class JobSkillRequirement(BaseModel):
    skill_id: str
    skill_name: str
    importance: SkillImportance = SkillImportance.HIGH
    requirement_category: RequirementCategory = RequirementCategory.MANDATORY
    is_required: bool = True  # True = Required (Must-have), False = Preferred (Nice-to-have)

class JobPosting(BaseModel):
    job_id: str
    title: str
    company: str
    location: str
    work_mode: WorkMode = WorkMode.HYBRID
    experience_level: ExperienceLevel = ExperienceLevel.ENTRY_LEVEL
    employment_type: EmploymentType = EmploymentType.FULL_TIME
    salary_range: str
    career_id: str
    required_skills: List[JobSkillRequirement] = Field(default_factory=list)
    preferred_skills: List[JobSkillRequirement] = Field(default_factory=list)
    description: str
    responsibilities: List[str] = Field(default_factory=list)
    application_url: Optional[str] = None
    naukri_search_url: Optional[str] = None
    linkedin_search_url: Optional[str] = None
    posted_date: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%Y-%m-%d"))
    provenance: Optional[Provenance] = None

class JobSkillMatchDetail(BaseModel):
    skill_id: str
    skill_name: str
    is_required: bool
    importance: SkillImportance
    student_status: VerificationStatus
    weight_contribution: float
    verification_warning: Optional[str] = None

class GapImpactItem(BaseModel):
    skill_id: str
    skill_name: str
    is_required: bool
    current_match_pct: float
    projected_match_pct: float
    score_lift_pct: float
    recommended_action: str

class JobMatchResult(BaseModel):
    job_id: str
    job_title: str
    company: str
    overall_match_pct: float
    required_match_pct: float
    preferred_match_pct: float
    match_tier: JobMatchTier
    matched_skills: List[JobSkillMatchDetail] = Field(default_factory=list)
    missing_required_skills: List[JobSkillMatchDetail] = Field(default_factory=list)
    missing_preferred_skills: List[JobSkillMatchDetail] = Field(default_factory=list)
    claimed_only_skills: List[str] = Field(default_factory=list)
    gap_impacts: List[GapImpactItem] = Field(default_factory=list)
    evidence_strength_score: float = 0.0
    semantic_similarity_score: float = 0.0
    main_recommendation: Optional[str] = None
    summary: str

class JobRecommendation(BaseModel):
    job: JobPosting
    recommendation_score: float  # Multi-factor score in [0, 1]
    match_result: JobMatchResult
    career_alignment_score: float
    experience_fit_score: float
    confidence_score: float
    explainability_reasons: List[str] = Field(default_factory=list)
