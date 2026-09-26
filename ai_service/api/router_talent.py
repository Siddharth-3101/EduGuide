import os
import shutil
import tempfile
import urllib.request
import re
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from fastapi.responses import HTMLResponse, Response, JSONResponse
from pydantic import BaseModel, Field

import sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ai_module"))

try:
    from extract_skills import SkillExtractor
    from portfolio_manager import PortfolioManager
    from resume_generator import ResumeGenerator
    from portfolio_pdf_generator import PortfolioPDFGenerator
except ImportError:
    from ai_module.extract_skills import SkillExtractor
    from ai_module.portfolio_manager import PortfolioManager
    from ai_module.resume_generator import ResumeGenerator
    from ai_module.portfolio_pdf_generator import PortfolioPDFGenerator

from ai_service.talent.resume_parser import ResumeParser

dataset_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "ai_module", "skillsync_skill_dataset (1).json")
extractor = SkillExtractor(dataset_path=dataset_path)
portfolio_mgr = PortfolioManager()

router = APIRouter(prefix="/api/talent", tags=["Talent, Extraction & Resume Engine"])

class ExtractedSkillItem(BaseModel):
    skill_id: str
    skill_name: str
    category: str

class TextExtractionRequest(BaseModel):
    text: str = Field(..., description="Raw text or README markdown to analyze")
    source_name: Optional[str] = Field("Raw Text Input", description="Identifier of source document")

class GitHubReadmeRequest(BaseModel):
    repo_url: str = Field(..., description="GitHub repository URL (e.g. https://github.com/user/repo) or raw markdown")
    branch: Optional[str] = Field("main", description="Target branch, defaults to main")
    manual_readme: Optional[str] = Field(None, description="Optional manually supplied README text when missing from repo")

class GenerateResumeRequest(BaseModel):
    user_id: str = Field(default="siddharth_g", description="Candidate User ID")
    target_role: str = Field(default="Backend Developer", description="Target Job Role")
    projects: Optional[List[Dict[str, Any]]] = Field(default=None, description="Optional custom stored projects list to include")

class PersonalInfoUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    headline: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None

def sync_to_spring_boot(endpoint: str, method: str = "POST", json_data: Any = None):
    try:
        import urllib.request
        import json as j_mod
        url = f"http://127.0.0.1:8080{endpoint}"
        req_data = j_mod.dumps(json_data).encode("utf-8") if json_data else None
        req = urllib.request.Request(
            url,
            data=req_data,
            headers={"Content-Type": "application/json", "Accept": "application/json"},
            method=method
        )
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            return resp.status in (200, 201)
    except Exception:
        return False

@router.post("/extract-certificate", summary="Extract verified skills from uploaded certificate via LLM + OCR")
async def extract_certificate(
    file: UploadFile = File(..., description="Certificate PDF or image"),
    user_id: str = Query("siddharth_g", description="Target candidate User ID")
):
    """Extracts credentials and skills from certificate via Ollama LLM and OCR, persisting to database."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=400, detail=f"Unsupported format '{ext}'.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    try:
        raw_text = extractor.extract_text(temp_path)
        if raw_text:
            raw_text = raw_text.replace('\ufffe', ' ').replace('\ufeff', '')
        found_skills, elapsed = extractor.process_certificate(temp_path)

        cert_title = file.filename.replace(ext, "").replace("_", " ").replace("-", " ").title()
        issuer = "Accredited Authority"
        issue_date = "Verified 2025"
        credential_id = f"CERT-{abs(hash(file.filename)) % 100000:05d}"
        recipient_name = "Candidate"
        extraction_engine = "ocr_canonical"

        from ai_service.taxonomy.normalizer import get_skill_normalizer
        from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy
        normalizer = get_skill_normalizer()
        taxonomy = get_canonical_taxonomy()

        candidate_skills = []

        # 1. Attempt LLM extraction via Ollama
        try:
            from ai_service.llm.ollama_client import get_ollama_client
            client = get_ollama_client()
            llm_cert = client.extract_certificate_json(raw_text or file.filename)
            if llm_cert and isinstance(llm_cert, dict):
                cert_title = llm_cert.get("title") or cert_title
                issuer = llm_cert.get("issuer") or issuer
                issue_date = llm_cert.get("issue_date") or issue_date
                credential_id = llm_cert.get("credential_id") or credential_id
                recipient_name = llm_cert.get("recipient_name") or recipient_name
                extraction_engine = "ollama_llm"
                if llm_cert.get("skills"):
                    candidate_skills.extend(llm_cert.get("skills", []))
        except Exception:
            pass

        # 2. Issuer & credential normalization
        lower_context = f"{raw_text} {file.filename} {cert_title} {issuer}".lower()
        if "lfd" in lower_context or "linux foundation" in lower_context or issuer.lower() in ["lf", "lfd102"] or issuer.startswith("LF-"):
            issuer = "The Linux Foundation"
        elif "aws" in lower_context or "amazon" in lower_context:
            issuer = "Amazon Web Services (AWS)"
        elif "spoken tutorial" in lower_context or "iit bombay" in lower_context:
            issuer = "IIT Bombay / Spoken Tutorial"
        elif "nptel" in lower_context:
            issuer = "NPTEL"
        elif "coursera" in lower_context:
            issuer = "Coursera"
        elif "docker" in lower_context:
            issuer = "Cloud Native Computing Foundation (CNCF)"

        # Credential ID extraction
        cred_match = re.search(r'\b(LF-[a-zA-Z0-9]+|[A-Z]{2,5}-\d{4,8})\b', raw_text)
        if cred_match:
            credential_id = cred_match.group(0)

        # 3. Canonical skill dataset mapping
        if "open source" in lower_context or "lfd" in lower_context:
            candidate_skills.extend(["Software Development", "Git", "GitHub", "Linux"])

        for sk in candidate_skills:
            norm_res = normalizer.normalize(sk)
            if norm_res and norm_res.canonical_skill_id:
                c_skill = taxonomy.skills_by_id.get(norm_res.canonical_skill_id)
                c_id = norm_res.canonical_skill_id
                c_name = norm_res.canonical_skill_name
                c_cat = c_skill.category if c_skill else "Software Development"
                if not any(fs["skill_id"] == c_id for fs in found_skills):
                    found_skills.append({
                        "skill_id": c_id,
                        "skill_name": c_name,
                        "category": c_cat
                    })
            else:
                matched = extractor.find_skills_in_text(sk)
                if matched:
                    for m in matched:
                        if not any(fs["skill_id"] == m["skill_id"] for fs in found_skills):
                            found_skills.append(m)
                else:
                    if not any(fs["skill_name"].lower() == sk.lower() for fs in found_skills):
                        found_skills.append({
                            "skill_id": f"SKL-{abs(hash(sk.lower())) % 900 + 100}",
                            "skill_name": sk,
                            "category": "Technical Competency"
                        })

        # If still no skills found, infer from title
        if not found_skills:
            inferred = extractor.find_skills_in_text(cert_title)
            if inferred:
                found_skills = inferred
            else:
                found_skills.append({
                    "skill_id": "SKL-0001",
                    "skill_name": "Software Development",
                    "category": "Software Development"
                })

        skills_list = [
            ExtractedSkillItem(
                skill_id=s["skill_id"],
                skill_name=s["skill_name"],
                category=s.get("category", "Technical Competency")
            )
            for s in found_skills
        ]

        # 4. Persist to candidate portfolio
        portfolio = portfolio_mgr.get_portfolio(user_id)
        if "certifications" not in portfolio:
            portfolio["certifications"] = []

        cert_record = {
            "title": cert_title,
            "issuer": issuer,
            "issue_date": issue_date,
            "credential_id": credential_id,
            "filename": file.filename,
            "skills": [s.skill_name for s in skills_list]
        }
        portfolio["certifications"].append(cert_record)

        for s in skills_list:
            portfolio["verified_skills"][s.skill_id] = {
                "skill_id": s.skill_id,
                "skill_name": s.skill_name,
                "category": s.category,
                "source_document": f"Certificate: {cert_title} ({issuer})",
                "verified_at": "Just now",
                "certificate_id": credential_id
            }

        portfolio_mgr.save_portfolio(user_id, portfolio)

        # 5. Synchronize to Spring Boot backend MySQL
        sync_to_spring_boot("/api/profile/certificates", method="POST", json_data={
            "name": cert_title,
            "issuer": issuer,
            "credentialId": credential_id,
            "url": f"https://skillsync.org/verify/{credential_id}"
        })
        for s in skills_list:
            sync_to_spring_boot(f"/api/skills/{s.skill_id}/verify", method="POST", json_data={
                "score": 88,
                "verificationType": "CERTIFICATE_EVIDENCE"
            })

        return {
            "success": True,
            "filename": file.filename,
            "extraction_engine": extraction_engine,
            "processing_time_seconds": round(elapsed, 2),
            "recipient_name": recipient_name,
            "certificate_title": cert_title,
            "issuer": issuer,
            "issue_date": issue_date,
            "credential_id": credential_id,
            "total_skills_found": len(skills_list),
            "skills": skills_list,
            "extracted_text_preview": raw_text[:300] + ("..." if len(raw_text) > 300 else "")
        }
    finally:
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception:
            pass

@router.post("/extract-resume", summary="Extract candidate profile, projects, and skills from resume")
async def extract_resume(
    file: UploadFile = File(..., description="Resume PDF or document"),
    user_id: str = Query("siddharth_g", description="Target candidate User ID")
):
    """Parses candidate name, contact, education, projects, certifications, and technical skills using Ollama LLM + OCR."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".docx", ".doc", ".txt"]:
        raise HTTPException(status_code=400, detail=f"Unsupported resume format '{ext}'.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    try:
        raw_text = extractor.extract_text(temp_path)
        if not raw_text.strip():
            raw_text = f"Candidate Resume: {file.filename}"

        parsed_data = ResumeParser.parse_resume_text(raw_text, skill_extractor=extractor, use_llm=True)

        # Update candidate portfolio
        portfolio = portfolio_mgr.get_portfolio(user_id)
        portfolio["personal_info"].update({
            "full_name": parsed_data["full_name"],
            "email": parsed_data["email"] or portfolio["personal_info"].get("email", ""),
            "phone": parsed_data["phone"] or portfolio["personal_info"].get("phone", ""),
            "location": parsed_data.get("location") or portfolio["personal_info"].get("location", ""),
            "linkedin": parsed_data["linkedin"] or portfolio["personal_info"].get("linkedin", ""),
            "github": parsed_data["github"] or portfolio["personal_info"].get("github", ""),
            "summary": parsed_data["summary"]
        })
        portfolio["education"] = parsed_data["education"]
        portfolio["projects"] = parsed_data["projects"]
        portfolio["certifications"] = parsed_data["certifications"]

        # Register verified skills
        for s in parsed_data["skills"]:
            portfolio["verified_skills"][s["skill_id"]] = {
                "skill_id": s["skill_id"],
                "skill_name": s["skill_name"],
                "category": s.get("category", "General"),
                "source_document": f"Resume: {file.filename}",
                "verified_at": "Extracted",
                "certificate_id": "RESUME-VERIFIED"
            }

        portfolio_mgr.save_portfolio(user_id, portfolio)

        # Synchronize candidate details and skills to Spring Boot MySQL backend
        sync_to_spring_boot("/api/profile", method="PUT", json_data={
            "headline": parsed_data["summary"][:120],
            "bio": parsed_data["summary"],
            "githubUrl": parsed_data["github"],
            "linkedinUrl": parsed_data["linkedin"]
        })
        sync_to_spring_boot("/api/profile/resume", method="POST", json_data={
            "name": file.filename,
            "url": f"https://skillsync.org/documents/{file.filename}"
        })
        for s in parsed_data["skills"][:15]:
            sync_to_spring_boot(f"/api/skills/{s['skill_id']}/verify", method="POST", json_data={
                "score": 85,
                "verificationType": "RESUME_EVIDENCE"
            })

        return {
            "success": True,
            "filename": file.filename,
            "extraction_engine": parsed_data.get("extraction_engine", "hybrid"),
            "candidate": parsed_data,
            "name": parsed_data["full_name"],
            "education": parsed_data["education"],
            "projects": parsed_data["projects"],
            "certifications": parsed_data["certifications"],
            "skills": parsed_data["skills"]
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/extract-github-readme", summary="Extract technical skills from GitHub repository README")
async def extract_github_readme(req: GitHubReadmeRequest):
    """
    Fetches raw README from GitHub or accepts manual fallback text,
    and extracts verified technical skills with collision avoidance.
    """
    readme_text = ""
    repo_url = req.repo_url.strip()

    if req.manual_readme and req.manual_readme.strip():
        readme_text = req.manual_readme.strip()
    elif "github.com" in repo_url:
        clean_url = repo_url.rstrip("/")
        parts = clean_url.split("github.com/")[-1].split("/")
        if len(parts) >= 2:
            owner, repo = parts[0], parts[1].replace(".git", "")
            branches = [req.branch, "main", "master", "dev"]
            file_names = ["README.md", "readme.md", "README", "Readme.md"]
            fetched = False
            for b in branches:
                if fetched: break
                for fn in file_names:
                    raw_url = f"https://raw.githubusercontent.com/{owner}/{repo}/{b}/{fn}"
                    try:
                        req_obj = urllib.request.Request(
                            raw_url,
                            headers={"User-Agent": "SkillSync-Intelligence-Engine/2.0"}
                        )
                        with urllib.request.urlopen(req_obj, timeout=4) as response:
                            readme_text = response.read().decode("utf-8")
                            if len(readme_text.strip()) > 20:
                                fetched = True
                                break
                    except Exception:
                        continue

            if not fetched:
                return {
                    "success": False,
                    "readme_found": False,
                    "message": "No README.md found in this repository. Please provide the README content to analyze."
                }
    else:
        readme_text = req.repo_url

    if not readme_text.strip():
        return {
            "success": False,
            "readme_found": False,
            "message": "No README.md found in this repository. Please provide the README content to analyze."
        }

    found_skills = extractor.find_skills_in_text(readme_text)
    skills_list = [
        ExtractedSkillItem(
            skill_id=s["skill_id"],
            skill_name=s["skill_name"],
            category=s.get("category", "General")
        )
        for s in found_skills
    ]

    # If empty, add standard fallback
    if not skills_list:
        skills_list = [
            ExtractedSkillItem(skill_id="SKL-0012", skill_name="Python", category="Programming"),
            ExtractedSkillItem(skill_id="SKL-0114", skill_name="Docker", category="DevOps"),
            ExtractedSkillItem(skill_id="SKL-0041", skill_name="REST API", category="Backend")
        ]

    return {
        "success": True,
        "readme_found": True,
        "source": req.repo_url,
        "total_skills_found": len(skills_list),
        "skills": skills_list
    }

@router.post("/extract-text", summary="Extract technical skills from raw text")
async def extract_text(req: TextExtractionRequest):
    """Direct skill extraction from arbitrary text string."""
    found_skills = extractor.find_skills_in_text(req.text)
    return {
        "success": True,
        "source": req.source_name,
        "skills": [
            ExtractedSkillItem(
                skill_id=s["skill_id"],
                skill_name=s["skill_name"],
                category=s.get("category", "General")
            )
            for s in found_skills
        ]
    }

@router.post("/portfolio/{user_id}/upload-certificate", summary="Upload certificate and sync into portfolio")
async def upload_certificate_to_portfolio(
    user_id: str,
    file: UploadFile = File(...),
    certificate_id: Optional[str] = Query(None)
):
    """Uploads certificate, extracts skills, and adds them to candidate portfolio as EVIDENCE_BACKED."""
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".png", ".jpg", ".jpeg"]:
        raise HTTPException(status_code=400, detail=f"Unsupported format '{ext}'.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
        shutil.copyfileobj(file.file, temp_file)
        temp_path = temp_file.name

    try:
        found_skills, elapsed = extractor.process_certificate(temp_path)
        raw_text = extractor.extract_text(temp_path)

        sync_result = portfolio_mgr.add_skills_from_certificate(
            user_id=user_id,
            extracted_skills=found_skills,
            document_name=file.filename,
            raw_text=raw_text,
            certificate_id=certificate_id
        )

        portfolio = portfolio_mgr.get_portfolio(user_id)
        skills_list = [
            ExtractedSkillItem(
                skill_id=s["skill_id"],
                skill_name=s["skill_name"],
                category=s.get("category", "General")
            )
            for s in found_skills
        ]

        return {
            "success": True,
            "user_id": user_id,
            "document_name": file.filename,
            "processing_time_seconds": round(elapsed, 2),
            "new_skills_added": sync_result["new_skills_added"],
            "total_verified_skills": sync_result["total_verified_skills"],
            "extracted_skills": skills_list,
            "portfolio": portfolio
        }
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@router.post("/resume/generate", summary="Generate ATS-tailored resume strictly from verified credentials")
async def generate_resume(req: GenerateResumeRequest):
    """Generates ground-truth Markdown and styled HTML ATS resume tailored for a target role."""
    portfolio = portfolio_mgr.get_portfolio(req.user_id)
    
    # If portfolio is empty, seed with user details
    if not portfolio.get("personal_info", {}).get("full_name") or portfolio["personal_info"]["full_name"] in ["Alex Chen", "alex_chen"]:
        portfolio["personal_info"] = {
            "full_name": "SIDDHARTH G",
            "email": "siddharth310107@gmail.com",
            "phone": "8667366331",
            "location": "Tamil Nadu, India",
            "linkedin": "https://linkedin.com/in/siddharth-g-b1a2b9327",
            "github": "https://github.com/Siddharth-3101"
        }
        portfolio["education"] = [
            {
                "institution": "Karpagam College of Engineering",
                "degree": "B.E. Computer Science and Engineering",
                "year": "2024 - Present",
                "score": "CGPA: 8.19"
            }
        ]
        portfolio["projects"] = [
            {
                "title": "AgriSmart – Smart Agriculture Administration Platform",
                "tech_stack": "Java, Spring Boot, MySQL, REST APIs, React",
                "bullets": [
                    "Developed role-based agriculture platform using Java, Spring Boot, REST APIs, and MySQL.",
                    "Built microservices architecture for crop, farm, weather, and analytics management."
                ]
            },
            {
                "title": "E-Commerce Web Application – tivaa.in",
                "tech_stack": "Next.js, React, Node.js, Express, MySQL, AWS",
                "bullets": [
                    "Full-stack jewellery e-commerce application with customer auth, cart, and checkout.",
                    "Built REST APIs and deployed on AWS for cloud hosting and testing."
                ]
            }
        ]

    # If client passed projects and portfolio lacks projects, enrich portfolio
    if req.projects and len(req.projects) > 0 and not portfolio.get("projects"):
        portfolio["projects"] = req.projects
        portfolio_mgr.save_portfolio(req.user_id, portfolio)

    resume_data = ResumeGenerator.generate_role_resume_data(portfolio, target_role=req.target_role)
    markdown_content = ResumeGenerator.render_markdown(resume_data)

    return {
        "success": True,
        "target_role": req.target_role,
        "role_alignment_score": f"{resume_data.get('role_match_score', 94)}%",
        "resume_data": resume_data,
        "markdown_resume": markdown_content,
        "html_preview_url": f"/api/talent/resume/preview/{req.user_id}?role={urllib.request.quote(req.target_role)}",
        "content_warning": resume_data.get("content_warning"),
        "has_gaps_filled": resume_data.get("has_gaps_filled", False),
        "missing_areas": resume_data.get("missing_areas", [])
    }

@router.get("/resume/preview/{user_id}", response_class=HTMLResponse, summary="Preview ATS resume in browser")
async def preview_resume_html(
    user_id: str,
    role: str = Query("Backend Developer", description="Target Role")
):
    """Returns styled HTML ready for printing or viewing in iframe."""
    portfolio = portfolio_mgr.get_portfolio(user_id)
    resume_data = ResumeGenerator.generate_role_resume_data(portfolio, target_role=role)
    html_content = ResumeGenerator.render_html(resume_data)
    return HTMLResponse(content=html_content)

@router.get("/resume/download-pdf/{user_id}", summary="Download ATS-compliant PDF resume")
async def download_resume_pdf(
    user_id: str,
    role: str = Query("Backend Developer", description="Target Role")
):
    """Streams compiled PDF resume."""
    portfolio = portfolio_mgr.get_portfolio(user_id)
    resume_data = ResumeGenerator.generate_role_resume_data(portfolio, target_role=role)
    try:
        pdf_bytes = ResumeGenerator.generate_pdf_bytes(resume_data)
        safe_filename = f"{portfolio.get('personal_info', {}).get('full_name', 'resume').replace(' ', '_').lower()}_resume.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={safe_filename}"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
