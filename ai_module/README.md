# SkillSync AI Module 🧠

Independent AI & Skill Extraction microservice for EduGuide.

## Features
- **Hybrid Certificate OCR & Extraction**: Sub-0.2s extraction on digital PDFs via `pypdfium2` with fallback to deep `surya-ocr` for scanned images.
- **Taxonomy Grounding**: Matches extracted text against official `skillsync_skill_dataset.json` with zero hallucinations and collision avoidance.
- **Dynamic Portfolio Manager**: Persistent user profiles that automatically accumulate verified skills across uploaded certificates.
- **Role-Based ATS Resume Generator**: Generates 1-page Ivy-League / LaTeX-style resumes in Markdown, JSON, and downloadable PDF format.
- **Interactive Swagger UI**: Full OpenAPI 3.0 documentation at `/docs`.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Batch Sync All Certificates in `certificates/`
```bash
python sync_certificates.py
```

### 3. Run FastAPI Web Service & Swagger UI
```bash
python app.py
```
Open [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) in your browser.
