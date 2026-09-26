from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from ai_service.api.router_career import router as career_router
from ai_service.api.router_skills import router as skills_router
from ai_service.api.router_projects import router as projects_router
from ai_service.api.router_resources import router as resources_router
from ai_service.api.router_llm import router as llm_router
from ai_service.api.router_meta import router as meta_router
from ai_service.api.router_jobs import router as jobs_router
from ai_service.api.router_talent import router as talent_router
from ai_service.llm.ollama_client import get_ollama_client
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy
from ai_service.career.career_engine import get_career_profile_engine

openapi_tags = [
    {
        "name": "Career Intelligence",
        "description": "Career profiling, candidate pathway matching, 3-tier skill gap analysis, priority ranking, and multi-stage roadmaps."
    },
    {
        "name": "Skills & Taxonomy",
        "description": "Canonical 220-skill taxonomy lookup, fuzzy text normalization, and alias resolution."
    },
    {
        "name": "Job Intelligence & Matching",
        "description": "Multi-factor job recommendation, 3-tier verification weighted competency matching, and counterfactual gap impact analysis."
    },
    {
        "name": "Talent, Extraction & Resume Engine",
        "description": "Sub-second certificate OCR, GitHub README skill extraction, persistent portfolios, and ATS Ivy-League resume generation."
    },
    {
        "name": "Progressive Projects",
        "description": "Scaffolded portfolio projects, 70/30 capability matching, and verified evidence-backed skill promotion."
    },
    {
        "name": "Learning Resources",
        "description": "Curated documentation, courses, and tutorials indexed by canonical skill ID."
    },
    {
        "name": "LLM Personalization Layer (Ollama)",
        "description": "Local Ollama LLM study plan synthesis, narrative generation, and advice with offline fallback resilience."
    },
    {
        "name": "System Meta & Graph Inspection",
        "description": "NetworkX prerequisite DAG metrics, cycle verification, and taxonomy statistics."
    }
]

app = FastAPI(
    title="SkillSync AI Intelligence Engine",
    description="""
# SkillSync AI Career & Talent Intelligence Backend (Phase 2)

An intelligent skill, career, and job alignment platform for students and career changers.
    """,
    version="2.0.0",
    openapi_tags=openapi_tags
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all modular routers
app.include_router(career_router)
app.include_router(skills_router)
app.include_router(jobs_router)
app.include_router(talent_router)
app.include_router(projects_router)
app.include_router(resources_router)
app.include_router(llm_router)
app.include_router(meta_router)


@app.get("/health", tags=["System Meta & Graph Inspection"])
def health_check():
    """Service liveness probe with quick catalog stats and Ollama reachability."""
    taxonomy = get_canonical_taxonomy()
    engine = get_career_profile_engine()
    ollama = get_ollama_client()
    llm_health = ollama.check_health()

    from ai_service.jobs.job_catalog_loader import get_job_catalog
    jobs_cat = get_job_catalog()

    return {
        "status": "healthy",
        "service": "SkillSync AI Career & Talent Intelligence Backend",
        "version": "2.0.0",
        "catalogs": {
            "canonical_skills": taxonomy.total_skills(),
            "careers": len(engine.careers_by_id),
            "job_postings": len(jobs_cat.get_all_jobs())
        },
        "llm_layer": {
            "status": llm_health.get("status"),
            "model": llm_health.get("configured_model"),
            "available": llm_health.get("available")
        }
    }

@app.get("/", tags=["System Meta & Graph Inspection"])
def root():
    return {
        "message": "Welcome to SkillSync AI Intelligence Engine v2.0",
        "docs_url": "/docs",
        "health_url": "/health",
        "meta_url": "/api/meta"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("ai_service.api.main:app", host="0.0.0.0", port=8000, reload=True)
