import json
import os
from typing import List, Optional, Dict
from ai_service.core.schemas import JobPosting, JobSkillRequirement, Provenance
from ai_service.core.enums import SourceType, ValidationStatus

class JobCatalog:
    _instance = None

    def __init__(self, catalog_path: Optional[str] = None):
        if not catalog_path:
            base_dir = os.path.dirname(os.path.dirname(__file__))
            catalog_path = os.path.join(base_dir, "data", "jobs", "job_catalog.json")
        self.catalog_path = catalog_path
        self.jobs_by_id: Dict[str, JobPosting] = {}
        self._load_catalog()

    def _load_catalog(self):
        if not os.path.exists(self.catalog_path):
            raise FileNotFoundError(f"Job catalog not found at {self.catalog_path}")

        with open(self.catalog_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)

        for item in raw_data:
            job = JobPosting(
                job_id=item["job_id"],
                title=item["title"],
                company=item["company"],
                location=item["location"],
                work_mode=item.get("work_mode", "Hybrid"),
                experience_level=item.get("experience_level", "Entry Level (0-2 yrs)"),
                employment_type=item.get("employment_type", "Full-time"),
                salary_range=item["salary_range"],
                career_id=item["career_id"],
                required_skills=[JobSkillRequirement(**s) for s in item.get("required_skills", [])],
                preferred_skills=[JobSkillRequirement(**s) for s in item.get("preferred_skills", [])],
                description=item.get("description", ""),
                responsibilities=item.get("responsibilities", []),
                application_url=item.get("application_url"),
                naukri_search_url=item.get("naukri_search_url"),
                linkedin_search_url=item.get("linkedin_search_url"),
                posted_date=item.get("posted_date", "2026-09-24"),
                provenance=Provenance(
                    source="SkillSync Industry Catalog",
                    source_type=SourceType.INDUSTRY_DATA,
                    confidence=1.0,
                    validation_status=ValidationStatus.VALIDATED
                )
            )
            self.jobs_by_id[job.job_id] = job

    def get_all_jobs(self) -> List[JobPosting]:
        return list(self.jobs_by_id.values())

    def get_job(self, job_id: str) -> Optional[JobPosting]:
        return self.jobs_by_id.get(job_id)

    def get_jobs_by_career(self, career_id: str) -> List[JobPosting]:
        return [j for j in self.jobs_by_id.values() if j.career_id == career_id]

def get_job_catalog() -> JobCatalog:
    if JobCatalog._instance is None:
        JobCatalog._instance = JobCatalog()
    return JobCatalog._instance
