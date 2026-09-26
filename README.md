# SkillSync (EduGuide) — AI-Powered Career-Readiness & Talent Platform

> **"Bridge the gap between academic credentials, verified skills, and industry job readiness."**

SkillSync (EduGuide) is an end-to-end career readiness and skill intelligence platform. It features AI-driven certificate/resume OCR extraction, verified competency mapping, interactive branching career roadmaps (ReactFlow DAGs), skill gap analysis, full 1-page ATS resume generation, mock interviews, and personalized job matching.

---

## 🏛️ System Architecture

The platform operates across four coordinated services:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SkillSync Architecture                            │
└─────────────────────────────────────────────────────────────────────────────┘

       ┌────────────────────────────────────────────────────────┐
       │             Frontend Application (React 19)            │
       │           Vite 8 • Tailwind CSS • ReactFlow DAGs       │
       │                   http://localhost:5173                │
       └──────────────┬──────────────────────────┬──────────────┘
                      │                          │
           REST APIs  │                          │  REST APIs
           (Talent/AI)│                          │  (Auth/Skills/Roadmap)
                      ▼                          ▼
       ┌──────────────────────────┐   ┌──────────────────────────┐
       │   FastAPI AI Service     │   │   Spring Boot Backend    │
       │  (Port 8000 - Python)    │   │   (Port 8080 - Java 17)  │
       │ ──────────────────────── │   │ ──────────────────────── │
       │ • Resume & Cert OCR/Sync │   │ • Skill Catalog (222+)   │
       │ • 1-Page ATS Generator   │   │ • Career Roles & Stages  │
       │ • Skill Canonicalizer    │   │ • Auth & User Profiles   │
       │ • Portfolio JSON Storage │   │ • H2 / PostgreSQL DB     │
       └──────────────┬───────────┘   └──────────────────────────┘
                      │
                      │ LLM Inferences (Prompt Engine)
                      ▼
       ┌──────────────────────────┐
       │      Ollama Daemon       │
       │  (Port 11434 - Llama 3)  │
       └──────────────────────────┘
```

---

## 📋 Prerequisites

Before starting, ensure the following are installed on your machine:

| Component | Minimum Version | Notes |
|---|---|---|
| **Node.js** | `v18.0.0+` | Includes `npm` (v9+) |
| **Python** | `v3.10+` | With `pip` |
| **Java JDK** | `17+` | (e.g., Eclipse Temurin 17, OpenJDK 17) |
| **Apache Maven** | `3.8+` | `mvn` command available in PATH |
| **Ollama** | Latest | Local LLM runner ([ollama.com](https://ollama.com)) |
| **Tesseract OCR** *(Optional)* | `v5.0+` | For scanned image certificates |

---

## 🚀 How to Run Each and Every Part of the Project

Follow these steps to run all 4 parts of the application. Open **4 separate terminal windows** (or run them as background processes).

---

### Part 1: Local LLM Daemon (Ollama)

SkillSync uses local LLM inference via Ollama for semantic skill extraction, gap explanation, and interview feedback.

1. **Start the Ollama server**:
   ```bash
   ollama serve
   ```
2. **Pull the required language model** (in another terminal, first time only):
   ```bash
   ollama pull llama3
   ```
   *Verified endpoint: `http://127.0.0.1:11434`*

---

### Part 2: AI Intelligence & Talent Engine (FastAPI)

The AI service handles document OCR, skill extraction from PDF/images, canonical synonym deduplication, and ground-truth 1-page ATS resume compilation.

1. **Navigate to the project root**:
   ```bash
   cd C:\projects\SkillSync
   ```
2. **Install Python dependencies**:
   ```bash
   pip install -r ai_module/requirements.txt
   ```
   *(Key packages: `fastapi`, `uvicorn`, `pydantic`, `xhtml2pdf`, `pypdf`, `pypdf2`, `pytesseract`, `pdfplumber`, `pillow`, `requests`)*

3. **Start the FastAPI server**:
   ```bash
   python -m uvicorn ai_service.api.main:app --host 127.0.0.1 --port 8000 --reload
   ```
   *Interactive API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)*  
   *Resume Preview: [http://127.0.0.1:8000/api/talent/resume/preview/siddharth_g](http://127.0.0.1:8000/api/talent/resume/preview/siddharth_g)*

---

### Part 3: Core Enterprise Microservices Backend (Spring Boot)

The Spring Boot backend manages user authentication, skill catalog taxonomy (222+ industry skills), career roles, branching pathway stages, and readiness calculations.

1. **Navigate to the project root**:
   ```bash
   cd C:\projects\SkillSync
   ```
2. **Run the Spring Boot application with Maven**:
   - **PowerShell (Windows)**:
     ```powershell
     $env:DB_PASSWORD = ''; & "mvn" -f backend/pom.xml -pl skillbridge-runner spring-boot:run
     ```
   - **Bash (Linux / macOS)**:
     ```bash
     DB_PASSWORD='' mvn -f backend/pom.xml -pl skillbridge-runner spring-boot:run
     ```
   *The application automatically seeds 222+ skills and 10 career roles on first boot.*  
   *Backend Base URL: [http://localhost:8080](http://localhost:8080)*

---

### Part 4: Web Frontend Application (React + Vite)

The frontend is built with React 19, Tailwind CSS v4, and ReactFlow for interactive career graphs.

1. **Navigate to the frontend directory**:
   ```bash
   cd C:\projects\SkillSync\frontend
   ```
2. **Install Node dependencies**:
   ```bash
   npm install
   ```
3. **Start the Vite development server**:
   ```bash
   npm run dev
   ```
4. **Access the application**:
   Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## ⚡ Quick Start: All Services at Once (PowerShell)

To launch all services concurrently from the root directory on Windows:

```powershell
# In PowerShell:
Start-Process powershell -ArgumentList "-NoExit", "-Command", "ollama serve"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\projects\SkillSync; python -m uvicorn ai_service.api.main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\projects\SkillSync; $env:DB_PASSWORD = ''; mvn -f backend/pom.xml -pl skillbridge-runner spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\projects\SkillSync\frontend; npm run dev"
```

---

## 🔍 Key Feature Walkthrough

### 1. 📄 Zero-Hallucination 1-Page ATS Resume Engine
- **Accredited Skill Extraction**: Upload resumes or certificates (PDF/PNG/JPG) to extract verified skills mapped to 70+ canonical tech synonyms.
- **Strict 1-Page Constraint**: Built with calibrated print and `xhtml2pdf` stylesheets to guarantee exactly 1 full page with no overflow and no empty bottom space.
- **Intelligent Gap-Filling**: If a candidate has limited portfolio data, standard verified production architecture projects (EduGuide, AgriSmart, Tivaa) and accredited certifications are synthesized with a clear notice banner.
- **Instant Export**: Copy clean Markdown, view interactive browser HTML print preview, or download compiled ATS PDF.

### 2. 🗺️ Branching Career Roadmaps (ReactFlow DAGs)
- Select from 10 data-backed engineering career roles (Backend, AI/ML, Cloud Platform, Full Stack, Data Engineering, etc.).
- Switch between specialized technical pathways (e.g. `Java Spring Track`, `Python FastAPI Track`, `Node.js Track`, `MLOps Track`).
- Visualize dependencies, locked/unlocked stages, and personal skill gaps in real time.

### 3. 🎯 Skill Verification & Portfolio Hub
- Manage verified competencies across 5 standard ATS buckets: *Languages*, *Frameworks & Architecture*, *Cloud & DevOps*, *Databases & Systems*, and *AI & Machine Learning*.
- Synced across Spring Boot database and local JSON portfolio storage.

---

## 🌐 Port & Endpoint Reference

| Service | Port | Base URL / Health Check |
|---|---|---|
| **Vite Frontend** | `5173` | `http://localhost:5173` |
| **FastAPI AI Service** | `8000` | `http://127.0.0.1:8000/docs` |
| **Spring Boot Backend** | `8080` | `http://localhost:8080/api/skills/catalog` |
| **Ollama Daemon** | `11434` | `http://127.0.0.1:11434/api/tags` |

---

## 🛠️ Project Structure

```text
SkillSync/
├── ai_module/                      # Core AI skill extraction, role matching & PDF generator
│   ├── data/portfolios/            # User portfolio JSON records (skills, projects, certs)
│   ├── extract_skills.py           # OCR & PDF text parsing with canonical skill matcher
│   ├── resume_generator.py         # 1-Page ATS Resume Generator (Markdown/HTML/PDF)
│   ├── role_matcher.py             # Career role matching algorithms
│   └── sync_certificates.py        # Certificate evidence validator
│
├── ai_service/                     # FastAPI Application Layer
│   ├── api/
│   │   ├── main.py                 # FastAPI app entry point & CORS configuration
│   │   └── router_talent.py        # Resume generation, preview, PDF download & OCR routes
│   └── career/                     # Career profile engine
│
├── backend/                        # Spring Boot 3 Multi-Module Microservices
│   ├── career-service/             # Career role & pathway REST endpoints
│   ├── skill-service/              # Skill catalog & verification management
│   ├── readiness-service/          # Readiness score evaluation engine
│   ├── project-service/            # Hands-on project submission & grading
│   ├── skillbridge-common/         # Shared models, repositories, security & DatabaseSeeder
│   └── skillbridge-runner/         # Spring Boot application runner
│
├── frontend/                       # React 19 Single Page Application
│   ├── src/
│   │   ├── components/             # Reusable UI cards, modal dialogs, DAG roadmap graphs
│   │   ├── context/                # AuthContext, CareerContext, ThemeContext
│   │   ├── data/mock/              # Pathway roadmaps, mock roles, and fallback data
│   │   ├── pages/                  # Profile, CareerRoadmap, Skills, Assessments, Jobs
│   │   ├── services/api/           # Axios API connectors for backend & FastAPI
│   │   └── index.css               # Architectural Parchment / Midnight Blueprint themes
│   ├── index.html                  # Shell with typography preconnects
│   ├── package.json
│   └── vite.config.js
│
└── README.md                       # Complete Project Documentation
```

---

## 🛡️ License

This project is developed for educational and portfolio demonstration purposes. All rights reserved.
