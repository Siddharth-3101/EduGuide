import os
import shutil
import tempfile
from typing import List, Optional, Dict, Any
from fastapi import FastAPI, File, UploadFile, HTTPException, Query, Body
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from extract_skills import SkillExtractor
from portfolio_manager import PortfolioManager
from resume_generator import ResumeGenerator
from role_matcher import JOB_ROLE_PROFILES

# Initialize FastAPI App
app = FastAPI(
    title="SkillSync: Dynamic Portfolio & Role-Based Resume Engine",
    description=(
        "**SkillSync API** extracts verified skills from uploaded certificates, "
        "dynamically maintains candidate portfolios, and generates ATS-optimized, "
        "Job-Role tailored resumes on demand."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Singletons
extractor = SkillExtractor(dataset_path="skillsync_skill_dataset (1).json")
portfolio_mgr = PortfolioManager()

# --- Pydantic Schemas ---

class SkillItem(BaseModel):
    skill_id: str
    skill_name: str
    category: str

class ExtractionResponse(BaseModel):
    success: bool
    filename: str
    processing_time_seconds: float
    total_skills_found: int
    skills: List[SkillItem]
    extracted_text_preview: str

class UploadAndSyncResponse(BaseModel):
    success: bool
    user_id: str
    document_name: str
    processing_time_seconds: float
    new_skills_added: int
    total_verified_skills: int
    extracted_skills: List[SkillItem]
    portfolio_summary: Dict[str, Any]

class GenerateResumeRequest(BaseModel):
    user_id: str = Field(default="sanjay_krishna", description="Candidate User ID")
    target_role: str = Field(
        default="Network Engineer",
        description="Target Job Role (e.g., 'Network Engineer', 'Python Developer', 'Software Engineer', 'Data Analyst')"
    )

class PersonalInfoUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

# --- API Endpoints ---

@app.get("/", tags=["Health"])
def health_check():
    """Service health and quick links."""
    return {
        "status": "healthy",
        "service": "SkillSync Resume Engine",
        "supported_sample_roles": list(JOB_ROLE_PROFILES.keys()),
        "swagger_docs": "/docs"
    }

# 1. Direct Skill Extraction (Stateless)
@app.post(
    "/api/v1/extract-skills",
    response_model=ExtractionResponse,
    tags=["Skill Extraction"],
    summary="1. Extract Skills from Certificate (Stateless)"
)
async def extract_skills_endpoint(
    file: UploadFile = File(..., description="Certificate file (.pdf, .png, .jpg, .jpeg)")
):
    """Extracts skills from a certificate file without saving to a portfolio."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=400, detail=f"Unsupported format '{ext}'.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    try:
        found_skills, elapsed = extractor.process_certificate(temp_path)
        raw_text = extractor.extract_text(temp_path)

        skills_list = [
            SkillItem(
                skill_id=s["skill_id"],
                skill_name=s["skill_name"],
                category=s.get("category", "General")
            )
            for s in found_skills
        ]

        return ExtractionResponse(
            success=True,
            filename=file.filename,
            processing_time_seconds=round(elapsed, 2),
            total_skills_found=len(skills_list),
            skills=skills_list,
            extracted_text_preview=raw_text[:300] + ("..." if len(raw_text) > 300 else "")
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# 2. Upload Certificate and Auto-Add to User Portfolio
@app.post(
    "/api/v1/portfolio/{user_id}/upload-certificate",
    response_model=UploadAndSyncResponse,
    tags=["Portfolio Management"],
    summary="2. Upload Certificate & Automatically Sync to Portfolio"
)
async def upload_and_sync_certificate(
    user_id: str,
    file: UploadFile = File(..., description="Certificate file (.pdf, .png, .jpg, .jpeg)"),
    certificate_id: Optional[str] = Query(None, description="Optional Certificate ID")
):
    """
    **Uploads a certificate**, runs skill extraction, and **automatically accumulates**
    the verified skills into the candidate's persistent profile portfolio.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=400, detail=f"Unsupported format '{ext}'.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    try:
        found_skills, elapsed = extractor.process_certificate(temp_path)
        
        raw_text = extractor.extract_text(temp_path)
        
        # Merge skills into portfolio
        sync_result = portfolio_mgr.add_skills_from_certificate(
            user_id=user_id,
            extracted_skills=found_skills,
            document_name=file.filename,
            raw_text=raw_text,
            certificate_id=certificate_id
        )

        portfolio = portfolio_mgr.get_portfolio(user_id)

        skills_list = [
            SkillItem(
                skill_id=s["skill_id"],
                skill_name=s["skill_name"],
                category=s.get("category", "General")
            )
            for s in found_skills
        ]

        return UploadAndSyncResponse(
            success=True,
            user_id=user_id,
            document_name=file.filename,
            processing_time_seconds=round(elapsed, 2),
            new_skills_added=sync_result["new_skills_added"],
            total_verified_skills=sync_result["total_verified_skills"],
            extracted_skills=skills_list,
            portfolio_summary={
                "candidate_name": portfolio["personal_info"]["full_name"],
                "total_certificates_recorded": len(portfolio.get("certificates", [])),
                "total_verified_skills": len(portfolio.get("verified_skills", {}))
            }
        )
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# 2b. Sync Entire Certificates Folder
@app.post(
    "/api/v1/portfolio/{user_id}/sync-certificates-folder",
    tags=["Portfolio Management"],
    summary="2b. Scan and Sync all files in 'certificates/' folder"
)
def sync_certificates_folder_endpoint(
    user_id: str,
    folder_path: str = Query(default="certificates", description="Folder containing certificate files")
):
    """
    **Scans the local `certificates/` directory**, extracts text and skills from every
    certificate (PDF, PNG, JPG), updates the candidate portfolio, and returns the accumulated skills.
    """
    if not os.path.exists(folder_path):
        raise HTTPException(status_code=404, detail=f"Folder '{folder_path}' not found.")

    processed = []
    total_new = 0

    for filename in os.listdir(folder_path):
        if filename.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg')):
            full_path = os.path.join(folder_path, filename)
            skills, elapsed = extractor.process_certificate(full_path)
            raw_text = extractor.extract_text(full_path)
            sync_res = portfolio_mgr.add_skills_from_certificate(
                user_id=user_id,
                extracted_skills=skills,
                document_name=filename,
                raw_text=raw_text
            )
            total_new += sync_res["new_skills_added"]
            processed.append({
                "filename": filename,
                "skills_found": [s["skill_name"] for s in skills],
                "time_seconds": round(elapsed, 2)
            })

    portfolio = portfolio_mgr.get_portfolio(user_id)
    return {
        "success": True,
        "user_id": user_id,
        "certificates_processed": len(processed),
        "newly_added_skills_count": total_new,
        "total_verified_skills_in_portfolio": len(portfolio.get("verified_skills", {})),
        "details": processed,
        "resume_pdf_url": f"/api/v1/resume/download-pdf/{user_id}?role=Software+Engineer",
        "portfolio_pdf_url": f"/api/v1/portfolio/download-pdf/{user_id}"
    }

# 3. View Candidate Portfolio
@app.get(
    "/api/v1/portfolio/{user_id}",
    tags=["Portfolio Management"],
    summary="3. Get Candidate Portfolio & Verified Skills"
)
def get_user_portfolio(user_id: str):
    """Fetches full candidate profile, accumulated skills, and certificate provenance."""
    portfolio = portfolio_mgr.get_portfolio(user_id)
    return {
        "success": True,
        "portfolio": portfolio,
        "preview_url": f"/api/v1/portfolio/preview/{user_id}",
        "download_pdf_url": f"/api/v1/portfolio/download-pdf/{user_id}"
    }

# 3b. Interactive Company-Ready Portfolio Preview (HTML)
@app.get(
    "/api/v1/portfolio/preview/{user_id}",
    response_class=HTMLResponse,
    tags=["Portfolio Management"],
    summary="3b. Company-Ready Candidate Portfolio Preview (HTML)"
)
def preview_portfolio_html(user_id: str):
    """
    Renders an **executive, company-ready Verified Candidate Portfolio & Skill Dossier** in HTML.
    """
    from portfolio_pdf_generator import PortfolioPDFGenerator
    portfolio = portfolio_mgr.get_portfolio(user_id)
    html_content = PortfolioPDFGenerator.render_portfolio_html(portfolio)
    return HTMLResponse(content=html_content)

# 3c. Direct Company-Ready Portfolio PDF Download
@app.get(
    "/api/v1/portfolio/download-pdf/{user_id}",
    tags=["Portfolio Management"],
    summary="3c. Download Company-Ready Verified Portfolio as PDF"
)
def download_portfolio_pdf(user_id: str):
    """
    Directly generates and downloads the **Company-Ready Verified Talent Portfolio as a `.pdf` file**.
    """
    from fastapi import Response
    from portfolio_pdf_generator import PortfolioPDFGenerator
    portfolio = portfolio_mgr.get_portfolio(user_id)
    pdf_bytes = PortfolioPDFGenerator.generate_portfolio_pdf_bytes(portfolio)

    filename = f"{user_id}_company_verified_portfolio.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

# 4. Update Personal Info
@app.put(
    "/api/v1/portfolio/{user_id}/personal-info",
    tags=["Portfolio Management"],
    summary="4. Update Candidate Personal Details"
)
def update_personal_info_endpoint(user_id: str, info: PersonalInfoUpdate):
    """Updates candidate contact information, headline, or links."""
    update_data = {k: v for k, v in info.dict().items() if v is not None}
    updated_portfolio = portfolio_mgr.update_personal_info(user_id, update_data)
    return {
        "success": True,
        "message": "Personal info updated successfully.",
        "personal_info": updated_portfolio["personal_info"]
    }

# 5. Generate Job-Role Tailored Resume
@app.post(
    "/api/v1/resume/generate",
    tags=["Role-Based Resume Generation"],
    summary="5. Generate Job-Role Tailored Resume (JSON & Markdown)"
)
def generate_role_resume(req: GenerateResumeRequest):
    """
    Generates an **ATS-compliant, Role-Tailored Resume** based on the candidate's
    accumulated skills and the specified target job role (e.g. *Network Engineer*, *Python Developer*).
    """
    portfolio = portfolio_mgr.get_portfolio(req.user_id)
    resume_data = ResumeGenerator.generate_role_resume_data(portfolio, target_role=req.target_role)
    markdown_version = ResumeGenerator.render_markdown(resume_data)

    return {
        "success": True,
        "target_role": req.target_role,
        "role_alignment_score": f"{resume_data['role_match_score']}%",
        "resume_data": resume_data,
        "markdown_resume": markdown_version,
        "html_preview_url": f"/api/v1/resume/preview/{req.user_id}?role={req.target_role.replace(' ', '+')}"
    }

# 6. Interactive HTML Browser Preview
@app.get(
    "/api/v1/resume/preview/{user_id}",
    response_class=HTMLResponse,
    tags=["Role-Based Resume Generation"],
    summary="6. Interactive HTML Resume Preview (Printable to PDF)"
)
def preview_resume_html(
    user_id: str,
    role: str = Query(default="Network Engineer", description="Target Job Role")
):
    """
    Renders an **interactive, professionally styled HTML resume** ready for
    1-click **Print to PDF** directly in your browser.
    """
    portfolio = portfolio_mgr.get_portfolio(user_id)
    resume_data = ResumeGenerator.generate_role_resume_data(portfolio, target_role=role)
    html_content = ResumeGenerator.render_html(resume_data)
    return HTMLResponse(content=html_content)

# 7. Direct PDF File Download Endpoint
@app.get(
    "/api/v1/resume/download-pdf/{user_id}",
    tags=["Role-Based Resume Generation"],
    summary="7. Download Resume as PDF File"
)
def download_resume_pdf(
    user_id: str,
    role: str = Query(default="Network Engineer", description="Target Job Role")
):
    """
    Directly generates and downloads the **ATS-formatted Resume as a `.pdf` file**.
    """
    from fastapi import Response
    portfolio = portfolio_mgr.get_portfolio(user_id)
    resume_data = ResumeGenerator.generate_role_resume_data(portfolio, target_role=role)
    pdf_bytes = ResumeGenerator.generate_pdf_bytes(resume_data)

    safe_role = role.lower().replace(' ', '_')
    filename = f"{user_id}_{safe_role}_resume.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
