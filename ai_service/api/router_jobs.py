from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from ai_service.core.schemas import (
    JobPosting, JobMatchResult, JobRecommendation, StudentProfile, GapImpactItem
)
from ai_service.jobs.job_catalog_loader import get_job_catalog
from ai_service.jobs.job_matcher import get_job_matcher
from ai_service.jobs.job_recommender import get_job_recommender
from ai_service.jobs.naukri_live_service import get_naukri_service
from ai_service.jobs.government_jobs_service import get_government_jobs_service

router = APIRouter(prefix="/api/jobs", tags=["Job Intelligence & Matching"])

class JobMatchRequest(BaseModel):
    student_profile: StudentProfile
    job_id: str

class JobRecommendRequest(BaseModel):
    student_profile: StudentProfile
    career_id: Optional[str] = Field(None, description="Optional target career filter e.g. CAR-BACKEND")
    limit: int = Field(6, ge=1, le=20, description="Max jobs to return")

@router.get("", response_model=List[JobPosting], summary="List all job opportunities")
def list_jobs(
    career_id: Optional[str] = Query(None, description="Filter by career ID (e.g. CAR-BACKEND)"),
    work_mode: Optional[str] = Query(None, description="Filter by work mode (Remote, Hybrid, On-site)"),
    search: Optional[str] = Query(None, description="Keyword search in title, company, or description")
):
    """List industry job postings with optional domain, work mode, and keyword filters."""
    catalog = get_job_catalog()
    jobs = catalog.get_all_jobs()

    if career_id:
        jobs = [j for j in jobs if j.career_id == career_id]
    if work_mode:
        jobs = [j for j in jobs if str(j.work_mode.value if hasattr(j.work_mode, "value") else j.work_mode).lower() == work_mode.lower()]
    if search:
        q = search.lower()
        jobs = [
            j for j in jobs
            if q in j.title.lower() or q in j.company.lower() or q in j.description.lower()
        ]

    return jobs

@router.get("/government", summary="List Indian Government exams and technical PSU jobs")
def list_government_exams(
    category: Optional[str] = Query(None, description="Category filter e.g. Scientific & Space Research, Defence, PSUs"),
    search: Optional[str] = Query(None, description="Keyword search in exam name or organization")
):
    """Lists prestigious Indian government technical exams with syllabus, eligibility, and study links."""
    service = get_government_jobs_service()
    return service.get_all_exams(category=category, search=search)

@router.get("/government/{exam_id}", summary="Get government exam details, syllabus, and study materials")
def get_government_exam(exam_id: str):
    """Retrieves full government exam specification, syllabus breakdown, application steps, and reference links."""
    service = get_government_jobs_service()
    exam = service.get_exam_by_id(exam_id)
    if not exam:
        raise HTTPException(status_code=404, detail=f"Government exam '{exam_id}' not found.")
    return exam

@router.post("/government/recommend", summary="Recommend government exams based on student competencies")
def recommend_government_exams(request: JobRecommendRequest):
    """
    Evaluates student verified & evidence skills against government examinations (ISRO, DRDO, GATE/PSU, NIC, BARC).
    Returns ranked examination recommendations with match percentages and syllabus guidance.
    """
    service = get_government_jobs_service()
    return service.recommend_for_student(request.student_profile, limit=request.limit)

@router.get("/{job_id}", response_model=JobPosting, summary="Get job posting by ID")
def get_job(job_id: str):
    """Retrieve full job specifications, required canonical skills, and application routes."""
    catalog = get_job_catalog()
    job = catalog.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job posting '{job_id}' not found.")
    return job

@router.post("/match", response_model=JobMatchResult, summary="Match student profile against a specific job")
def match_job(request: JobMatchRequest):
    """
    Computes 3-tier status-weighted competency match percentage for a student against a job posting.
    Identifies required vs. preferred skill alignment and unverified claim risks.
    """
    catalog = get_job_catalog()
    matcher = get_job_matcher()

    job = catalog.get_job(request.job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job posting '{request.job_id}' not found.")

    return matcher.match_job(request.student_profile, job)

@router.post("/recommend", response_model=List[JobRecommendation], summary="Multi-factor job recommendations")
def recommend_jobs(request: JobRecommendRequest):
    """
    Ranks industry jobs for the student using the multi-factor scoring model:
    - 50% Skill Competency Overlap (status-weighted)
    - 20% Career Goal Alignment
    - 15% Experience Level Fit
    - 15% Verification Confidence Ratio
    Includes actionable counterfactual gap impact analysis.
    """
    recommender = get_job_recommender()
    return recommender.recommend_jobs(
        student_profile=request.student_profile,
        career_id=request.career_id,
        limit=request.limit
    )

@router.get("/{job_id}/impact", response_model=List[GapImpactItem], summary="Calculate gap impact for a specific job")
def get_gap_impact(
    job_id: str,
    target_career: Optional[str] = Query(None)
):
    """
    Evaluates the marginal score lift for each missing skill in a job posting.
    """
    catalog = get_job_catalog()
    matcher = get_job_matcher()

    job = catalog.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail=f"Job posting '{job_id}' not found.")

    empty_profile = StudentProfile(student_id="ANON", career_goal=target_career or job.career_id)
    match_res = matcher.match_job(empty_profile, job)
    return match_res.gap_impacts

@router.get("/naukri/guide", summary="Naukri Enterprise API Setup & Integration Guide")
def get_naukri_guide():
    """
    Returns official Info Edge Naukri Partner API architecture guidelines,
    setup steps, required environment variables, and live fallback status.
    """
    service = get_naukri_service()
    return service.get_setup_guide()

@router.get("/naukri/live", summary="Search live jobs via Naukri")
async def search_naukri_live(
    keywords: str = Query("Backend Developer", description="Target role or tech keywords"),
    location: str = Query("Bengaluru", description="Target city e.g. Bengaluru, Coimbatore"),
    experience: int = Query(0, ge=0, le=10, description="Minimum experience in years")
):
    """
    Searches live jobs using the official Naukri API (if configured) or the live
    parameterized deep-linking aggregator with verified competency matching.
    """
    service = get_naukri_service()
    return await service.search_live_jobs(
        keywords=keywords,
        location=location,
        experience_years=experience
    )

