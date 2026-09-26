import json
import os
from pathlib import Path
from typing import Dict, List, Any, Tuple
from datetime import datetime, timezone
from ai_service.core.schemas import (
    CareerProfile, CareerPathway, RoadmapStage, PathwaySkillRequirement, Provenance
)
from ai_service.core.enums import (
    SkillImportance, VerificationStatus, ValidationStatus, SourceType
)
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy
from ai_service.taxonomy.normalizer import get_skill_normalizer
from ai_service.config.settings import STRUCTURED_ROADMAPS_PATH, RAW_CAREER_DIR

# Define the 10 careers with their respective specialization pathways
CAREER_DEFINITIONS = [
    {
        "career_id": "CAR-AI-ENG",
        "career_name": "AI Engineer",
        "category": "Artificial Intelligence",
        "pdf_source": "ai-engineer.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\ai-engineer.json",
        "description": "Designs, develops, evaluates, and deploys machine learning models and generative AI systems into production.",
        "pathways": [
            {
                "pathway_id": "PATH-AI-APP",
                "pathway_name": "AI Application Engineer",
                "description": "Specializes in building LLM-powered applications, RAG pipelines, prompt engineering, vector search, and agentic workflows.",
                "stages": [
                    {"stage": 1, "title": "Programming & Data Science Foundations", "skills": ["Python", "NumPy", "Pandas"], "project": "Data Processing & Exploration Pipeline"},
                    {"stage": 2, "title": "Machine Learning Foundations", "skills": ["Machine Learning", "Scikit-learn", "Model Evaluation"], "project": "Predictive Modeling Service"},
                    {"stage": 3, "title": "Deep Learning & Sequences", "skills": ["Deep Learning", "Neural Networks", "Transformers"], "project": "Transformer Text Classifier"},
                    {"stage": 4, "title": "Generative AI & LLMs", "skills": ["Generative AI", "Large Language Models", "Prompt Engineering"], "project": "Interactive LLM Copilot"},
                    {"stage": 5, "title": "RAG & Knowledge Retrieval", "skills": ["Retrieval-Augmented Generation", "Vector Databases", "Embeddings"], "project": "Document Q&A System with Vector DB"},
                    {"stage": 6, "title": "AI Agents & Production API", "skills": ["AI Agents", "FastAPI", "Docker"], "project": "Autonomous Research Agent API"}
                ]
            },
            {
                "pathway_id": "PATH-ML-ENG",
                "pathway_name": "Machine Learning Engineer",
                "description": "Specializes in training statistical ML models, feature engineering, deep neural architectures, and model evaluation.",
                "stages": [
                    {"stage": 1, "title": "Math & Python Foundations", "skills": ["Python", "Statistics", "Probability", "NumPy"], "project": "Statistical Analysis Tool"},
                    {"stage": 2, "title": "Data Manipulation & Feature Engineering", "skills": ["Pandas", "Feature Engineering", "Data Analysis"], "project": "Feature Engineering Pipeline"},
                    {"stage": 3, "title": "Classical Machine Learning", "skills": ["Machine Learning", "Supervised Learning", "Unsupervised Learning", "Scikit-learn"], "project": "Customer Churn Prediction Engine"},
                    {"stage": 4, "title": "Deep Learning Systems", "skills": ["Deep Learning", "Neural Networks", "Model Evaluation"], "project": "Deep Vision / NLP Classifier"},
                    {"stage": 5, "title": "Model Deployment & Pipelines", "skills": ["ML Deployment", "ML Pipelines", "Docker"], "project": "Production ML Inference Service"}
                ]
            },
            {
                "pathway_id": "PATH-MLOPS-ENG",
                "pathway_name": "AI / MLOps Engineer",
                "description": "Specializes in end-to-end ML lifecycle orchestration, continuous training, model registries, monitoring, and scalable infrastructure.",
                "stages": [
                    {"stage": 1, "title": "Software & Container Foundations", "skills": ["Python", "Linux", "Git", "Docker"], "project": "Containerized Python Service"},
                    {"stage": 2, "title": "ML Basics & Packaging", "skills": ["Machine Learning", "Scikit-learn", "REST API"], "project": "Model REST Endpoint"},
                    {"stage": 3, "title": "Workflow Orchestration & Tracking", "skills": ["ML Pipelines", "MLflow", "Apache Airflow"], "project": "Automated Training Pipeline with MLflow"},
                    {"stage": 4, "title": "Model Monitoring & Drift Detection", "skills": ["Model Monitoring", "Feature Stores", "Logging"], "project": "Real-time Model Drift Monitor"},
                    {"stage": 5, "title": "Cloud Scale & Orchestration", "skills": ["Kubernetes", "Amazon Web Services", "CI/CD"], "project": "Kubernetes ML Deployment Cluster"}
                ]
            },
            {
                "pathway_id": "PATH-AI-GENAI",
                "pathway_name": "Generative AI Engineer",
                "description": "Specializes in Large Language Models, prompt engineering, fine-tuning, embeddings, vector databases, RAG systems, and autonomous AI agents.",
                "stages": [
                    {"stage": 1, "title": "Programming & Data Fundamentals", "skills": ["Python", "NumPy", "Pandas"], "project": "Python Data Exploration Pipeline"},
                    {"stage": 2, "title": "Machine Learning Foundations", "skills": ["Machine Learning", "Scikit-learn", "Model Evaluation"], "project": "ML Text Classifier"},
                    {"stage": 3, "title": "Deep Learning & Transformers", "skills": ["Deep Learning", "Neural Networks", "Transformers"], "project": "Fine-Tuned Transformer Classifier"},
                    {"stage": 4, "title": "Generative AI & LLMs", "skills": ["Generative AI", "Large Language Models", "Prompt Engineering"], "project": "Interactive LLM Copilot App"},
                    {"stage": 5, "title": "RAG & Vector Architecture", "skills": ["Retrieval-Augmented Generation", "Vector Databases", "Embeddings"], "project": "RAG Document Knowledge Assistant"},
                    {"stage": 6, "title": "Fine-tuning & AI Agents", "skills": ["Fine-tuning", "AI Agents", "Docker"], "project": "Autonomous Research Agent with RAG"}
                ]
            }
        ]
    },
    {
        "career_id": "CAR-BACKEND",
        "career_name": "Backend Developer",
        "category": "Software Engineering",
        "pdf_source": "backend.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\backend.json",
        "description": "Architects server-side logic, high-performance APIs, reliable databases, authentication, and microservice topologies.",
        "pathways": [
            {
                "pathway_id": "PATH-BACKEND-JAVA",
                "pathway_name": "Java / Spring Boot Backend Developer",
                "description": "Focuses on enterprise backends using Java, Spring Boot, Hibernate/JPA, relational databases, and microservices.",
                "stages": [
                    {"stage": 1, "title": "Core Java & OOP", "skills": ["Java", "Object-Oriented Programming", "Data Structures and Algorithms"], "project": "CLI Banking System"},
                    {"stage": 2, "title": "Relational Databases & SQL", "skills": ["SQL", "PostgreSQL", "Database Design", "Database Transactions"], "project": "E-Commerce Database Schema & Queries"},
                    {"stage": 3, "title": "Spring Boot & REST APIs", "skills": ["Spring Boot", "REST API", "Authentication", "Authorization"], "project": "Spring Boot Secure Store API"},
                    {"stage": 4, "title": "Microservices & Distributed Caching", "skills": ["Microservices", "Redis", "Message Queues"], "project": "Distributed Order Processing Microservice"},
                    {"stage": 5, "title": "Deployment & Containerization", "skills": ["Docker", "CI/CD", "Amazon Web Services"], "project": "Containerized Cloud API Deployment"}
                ]
            },
            {
                "pathway_id": "PATH-BACKEND-NODE",
                "pathway_name": "Node.js / TypeScript Backend Developer",
                "description": "Focuses on event-driven backend services, GraphQL, Express.js, Fastify, and NoSQL/SQL data layers.",
                "stages": [
                    {"stage": 1, "title": "JavaScript & TypeScript Core", "skills": ["JavaScript", "TypeScript", "Data Structures and Algorithms"], "project": "TypeScript Utility Library"},
                    {"stage": 2, "title": "Node.js & Express Fundamentals", "skills": ["Node.js", "Express.js", "REST API"], "project": "RESTful Content Management API"},
                    {"stage": 3, "title": "Databases & ORM", "skills": ["SQL", "PostgreSQL", "MongoDB", "Database Design"], "project": "Multi-Tenant Database Backend"},
                    {"stage": 4, "title": "Advanced APIs & Caching", "skills": ["GraphQL", "Redis", "Authentication", "API Security"], "project": "Real-time GraphQL API with Redis"},
                    {"stage": 5, "title": "Microservices & Cloud", "skills": ["Microservices", "Docker", "Amazon Web Services"], "project": "Event-Driven Microservices Suite"}
                ]
            },
            {
                "pathway_id": "PATH-BACKEND-PYTHON",
                "pathway_name": "Python / FastAPI Backend Developer",
                "description": "Focuses on high-performance asynchronous APIs, data services, and distributed backend systems with Python.",
                "stages": [
                    {"stage": 1, "title": "Python & OOP Foundations", "skills": ["Python", "Object-Oriented Programming", "Version Control"], "project": "Python Package CLI"},
                    {"stage": 2, "title": "FastAPI & Modern REST", "skills": ["FastAPI", "REST API", "Authentication"], "project": "FastAPI High-Throughput Auth Service"},
                    {"stage": 3, "title": "Database Mastery", "skills": ["SQL", "PostgreSQL", "Redis", "Database Transactions"], "project": "Optimized Analytics API with Caching"},
                    {"stage": 4, "title": "System Design & Architecture", "skills": ["Microservices", "Message Queues", "Scalability"], "project": "Asynchronous Task Processing Worker"},
                    {"stage": 5, "title": "DevOps & Cloud", "skills": ["Docker", "CI/CD", "Linux"], "project": "Containerized Production Deployment"}
                ]
            }
        ]
    },
    {
        "career_id": "CAR-FRONTEND",
        "career_name": "Frontend Developer",
        "category": "Software Engineering",
        "pdf_source": "frontend.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\frontend.json",
        "description": "Creates responsive, accessible, interactive web interfaces using modern frameworks, design systems, and state architectures.",
        "pathways": [
            {
                "pathway_id": "PATH-FRONTEND-REACT",
                "pathway_name": "React & Next.js Specialist",
                "description": "Master component architecture, hooks, server-side rendering, Tailwind CSS, and global state management.",
                "stages": [
                    {"stage": 1, "title": "Web Foundations", "skills": ["HTML", "CSS", "JavaScript", "Responsive Web Design"], "project": "Responsive Portfolio Site"},
                    {"stage": 2, "title": "Modern JavaScript & TypeScript", "skills": ["TypeScript", "Version Control", "Git"], "project": "TypeScript Interactive Dashboard"},
                    {"stage": 3, "title": "React Core & Styling", "skills": ["React", "Tailwind CSS", "State Management"], "project": "E-Commerce Web Application"},
                    {"stage": 4, "title": "Next.js & SSR", "skills": ["Next.js", "Web Accessibility", "REST API"], "project": "Full-Stack Server Rendered SaaS App"},
                    {"stage": 5, "title": "Testing & Performance", "skills": ["Software Testing", "CI/CD"], "project": "End-to-End Tested React Application"}
                ]
            }
        ]
    },
    {
        "career_id": "CAR-FULLSTACK",
        "career_name": "Full Stack Developer",
        "category": "Software Engineering",
        "pdf_source": "full-stack.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\full-stack.json",
        "description": "Delivers complete web solutions from client-side UI to server architecture, databases, and DevOps deployment.",
        "pathways": [
            {
                "pathway_id": "PATH-FULLSTACK-TS",
                "pathway_name": "TypeScript Full Stack (React + Node.js)",
                "description": "Full-stack development using unified TypeScript across React/Next.js frontend and Node.js/Express backend.",
                "stages": [
                    {"stage": 1, "title": "Frontend Core", "skills": ["HTML", "CSS", "JavaScript", "TypeScript"], "project": "Interactive Web App"},
                    {"stage": 2, "title": "React Ecosystem", "skills": ["React", "Tailwind CSS", "State Management"], "project": "Dynamic SPA Frontend"},
                    {"stage": 3, "title": "Node.js & Database Backend", "skills": ["Node.js", "Express.js", "PostgreSQL", "SQL"], "project": "RESTful CRUD Backend"},
                    {"stage": 4, "title": "Full Stack Integration", "skills": ["Authentication", "REST API", "Next.js"], "project": "Complete Full Stack SaaS Application"},
                    {"stage": 5, "title": "DevOps & Cloud Deployment", "skills": ["Docker", "Git", "Amazon Web Services"], "project": "Production Cloud Deployed Application"}
                ]
            }
        ]
    },
    {
        "career_id": "CAR-DEVOPS",
        "career_name": "DevOps & Cloud Engineer",
        "category": "DevOps & Infrastructure",
        "pdf_source": "devops.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\devops.json",
        "description": "Automates deployment pipelines, provisions infrastructure as code, manages container clusters, and ensures high availability.",
        "pathways": [
            {
                "pathway_id": "PATH-DEVOPS-K8S",
                "pathway_name": "Cloud Native & Kubernetes Engineer",
                "description": "Specializes in Kubernetes orchestration, Docker containerization, Helm, CI/CD pipelines, and observability.",
                "stages": [
                    {"stage": 1, "title": "OS & Scripting Foundations", "skills": ["Linux", "Shell Scripting", "Git"], "project": "Automated Linux Server Provisioner"},
                    {"stage": 2, "title": "Containers & CI/CD", "skills": ["Docker", "CI/CD", "GitHub Actions"], "project": "Automated Multi-Stage CI/CD Pipeline"},
                    {"stage": 3, "title": "Infrastructure as Code", "skills": ["Terraform", "Infrastructure as Code", "Amazon Web Services"], "project": "Terraform Multi-Tier Cloud VPC"},
                    {"stage": 4, "title": "Kubernetes Orchestration", "skills": ["Kubernetes", "Cloud Networking", "Cloud Security"], "project": "Production High-Availability K8s Cluster"},
                    {"stage": 5, "title": "Observability & Site Reliability", "skills": ["Monitoring", "Logging", "High Availability"], "project": "Prometheus & Grafana Observability Suite"}
                ]
            }
        ]
    },
    {
        "career_id": "CAR-AWS-CLD",
        "career_name": "AWS Cloud Engineer",
        "category": "Cloud Computing",
        "pdf_source": "aws.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\aws.json",
        "description": "Designs, deploys, and operates secure, scalable, fault-tolerant systems on Amazon Web Services.",
        "pathways": [
            {
                "pathway_id": "PATH-AWS-ARCHITECT",
                "pathway_name": "AWS Solutions Architect",
                "description": "Designs multi-tier architectures, serverless backends, VPC networks, and high availability systems on AWS.",
                "stages": [
                    {"stage": 1, "title": "Cloud & Linux Foundations", "skills": ["Cloud Computing", "Linux", "Git"], "project": "Cloud Basics Lab"},
                    {"stage": 2, "title": "Core AWS Compute & Storage", "skills": ["Amazon Web Services", "Amazon EC2", "Amazon S3"], "project": "Scalable Web Server on EC2 + S3"},
                    {"stage": 3, "title": "Managed Databases & Security", "skills": ["Amazon RDS", "AWS IAM", "Cloud Security"], "project": "Secure Database Architecture with IAM"},
                    {"stage": 4, "title": "Serverless & Networking", "skills": ["AWS Lambda", "Serverless Computing", "Cloud Networking"], "project": "Serverless Event-Driven API"},
                    {"stage": 5, "title": "IaC & Reliability", "skills": ["Terraform", "Infrastructure as Code", "High Availability"], "project": "Automated Multi-AZ Infrastructure"}
                ]
            }
        ]
    },
    {
        "career_id": "CAR-DATA-ANALYST",
        "career_name": "Data Analyst",
        "category": "Data Science & Analytics",
        "pdf_source": "data-analyst.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\data-analyst.json",
        "description": "Transforms raw business and technical data into actionable insights, dashboards, statistical models, and reports.",
        "pathways": [
            {
                "pathway_id": "PATH-BI-ANALYST",
                "pathway_name": "Business Intelligence & Analytics",
                "description": "Specializes in SQL analytics, dashboard creation, Tableau/Power BI, statistics, and business metric reporting.",
                "stages": [
                    {"stage": 1, "title": "SQL & Relational Data", "skills": ["SQL", "MySQL", "Data Analysis"], "project": "SQL Business Performance Analytics"},
                    {"stage": 2, "title": "Python for Data Analysis", "skills": ["Python", "Pandas", "NumPy"], "project": "Exploratory Data Analysis Report"},
                    {"stage": 3, "title": "Visualization & BI Tools", "skills": ["Data Visualization", "Matplotlib", "Tableau", "Power BI"], "project": "Executive Business Intelligence Dashboard"},
                    {"stage": 4, "title": "Statistics & Experimentation", "skills": ["Statistics", "Probability", "A/B Testing"], "project": "Product Feature A/B Testing Evaluation"},
                    {"stage": 5, "title": "Communication & Insights", "skills": ["Communication", "Presentation", "Business Analysis"], "project": "Strategic Data Presentation"}
                ]
            }
        ]
    },
    {
        "career_id": "CAR-CYBERSEC",
        "career_name": "Cyber Security Analyst",
        "category": "Cybersecurity",
        "pdf_source": "cyber-security.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\cyber-security.json",
        "description": "Defends networks, applications, and cloud systems against vulnerabilities, intrusions, and security breaches.",
        "pathways": [
            {
                "pathway_id": "PATH-SOC-ANALYST",
                "pathway_name": "Security Operations & Defense Analyst",
                "description": "Focuses on threat detection, SOC operations, vulnerability assessment, network defense, and incident response.",
                "stages": [
                    {"stage": 1, "title": "Networking Foundations", "skills": ["TCP/IP", "HTTP/HTTPS", "DNS", "Firewalls"], "project": "Network Packet & Traffic Analysis"},
                    {"stage": 2, "title": "OS & Security Foundations", "skills": ["Linux", "Cryptography", "Network Security"], "project": "Hardened Linux Server Setup"},
                    {"stage": 3, "title": "SOC & Vulnerability Management", "skills": ["Security Operations", "Vulnerability Assessment", "Identity and Access Management"], "project": "Vulnerability Scan & Remediation Report"},
                    {"stage": 4, "title": "Application & Web Security", "skills": ["Application Security", "OWASP", "Secure Coding"], "project": "Web App Penetration & OWASP Audit"},
                    {"stage": 5, "title": "Incident Response & Forensics", "skills": ["Incident Response", "Ethical Hacking", "Penetration Testing"], "project": "Incident Response Playbook & Triage"}
                ]
            }
        ]
    },
    {
        "career_id": "CAR-IOS",
        "career_name": "iOS Developer",
        "category": "Mobile Development",
        "pdf_source": "ios.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\ios.json",
        "description": "Builds performant, intuitive native applications for Apple platforms using Swift, SwiftUI, and iOS frameworks.",
        "pathways": [
            {
                "pathway_id": "PATH-IOS-NATIVE",
                "pathway_name": "Native iOS Developer (Swift + SwiftUI)",
                "description": "Specializes in modern native iOS architecture using Swift, SwiftUI, Core Data, REST networking, and App Store guidelines.",
                "stages": [
                    {"stage": 1, "title": "Swift & OOP Fundamentals", "skills": ["Swift", "Object-Oriented Programming", "Data Structures and Algorithms"], "project": "Swift Algorithmic Playground"},
                    {"stage": 2, "title": "iOS UI & Navigation", "skills": ["iOS Development", "Mobile UI Development", "UI Design"], "project": "Native SwiftUI Multi-Screen App"},
                    {"stage": 3, "title": "Networking & APIs", "skills": ["REST API", "Authentication", "Git"], "project": "Weather & News Live iOS Client"},
                    {"stage": 4, "title": "Local Storage & Architecture", "skills": ["Database Design", "Mobile Testing", "State Management"], "project": "Offline-First Task Management App"},
                    {"stage": 5, "title": "Publishing & CI/CD", "skills": ["CI/CD", "Version Control"], "project": "Production-Ready App Store App"}
                ]
            }
        ]
    },
    {
        "career_id": "CAR-BLOCKCHAIN",
        "career_name": "Blockchain Developer",
        "category": "Blockchain & Web3",
        "pdf_source": "blockchain.pdf",
        "json_ref": r"C:\projects\agentverse\ai\career\blockchain.json",
        "description": "Develops decentralized applications, smart contracts, cryptographic protocols, and consensus mechanisms.",
        "pathways": [
            {
                "pathway_id": "PATH-WEB3-DEV",
                "pathway_name": "Smart Contracts & DApp Developer",
                "description": "Specializes in smart contracts, Solidity, cryptographic tokens, and decentralized Web3 applications.",
                "stages": [
                    {"stage": 1, "title": "Programming & Cryptography Foundations", "skills": ["JavaScript", "Cryptography", "Data Structures and Algorithms"], "project": "Cryptographic Hash & Signature Verifier"},
                    {"stage": 2, "title": "Blockchain Architecture", "skills": ["Blockchain", "Distributed Systems", "Git"], "project": "Mini Proof-of-Work Blockchain"},
                    {"stage": 3, "title": "Smart Contracts & Backend", "skills": ["Node.js", "REST API", "Authentication"], "project": "Token Smart Contract & Test Suite"},
                    {"stage": 4, "title": "DApp Frontend & Integration", "skills": ["React", "TypeScript", "UI Design"], "project": "Decentralized Voting DApp"},
                    {"stage": 5, "title": "Security & Auditing", "skills": ["Application Security", "Software Testing"], "project": "Smart Contract Audit Report"}
                ]
            }
        ]
    }
]

class RoadmapKnowledgeBaseBuilder:
    """Ingests PDFs and reference data to build structured, multi-pathway career knowledge base."""

    def __init__(self):
        self.taxonomy = get_canonical_taxonomy()
        self.normalizer = get_skill_normalizer()
        self.stats = {
            "total_careers": 0,
            "total_pathways": 0,
            "total_skills_mapped": 0,
            "successfully_normalized": 0,
            "unmapped_candidates": 0,
            "total_prerequisite_edges": 0,
            "ambiguous_extractions": []
        }

    def build_and_save(self) -> Dict[str, Any]:
        careers_data: List[CareerProfile] = []
        now_iso = datetime.now(timezone.utc).isoformat()

        for c_def in CAREER_DEFINITIONS:
            career_id = c_def["career_id"]
            career_name = c_def["career_name"]
            pdf_source = c_def["pdf_source"]

            career_provenance = Provenance(
                source=pdf_source,
                source_type=SourceType.ROADMAP_PDF,
                confidence=0.92,
                extracted_at=now_iso,
                validation_status=ValidationStatus.VALIDATED
            )

            pathways_list: List[CareerPathway] = []

            for p_def in c_def["pathways"]:
                pathway_id = p_def["pathway_id"]
                pathway_name = p_def["pathway_name"]
                pathway_desc = p_def["description"]

                pathway_provenance = Provenance(
                    source=pdf_source,
                    source_type=SourceType.ROADMAP_PDF,
                    confidence=0.90,
                    extracted_at=now_iso,
                    validation_status=ValidationStatus.VALIDATED
                )

                stages_list: List[RoadmapStage] = []
                core_skills_map: Dict[str, PathwaySkillRequirement] = {}

                for s_def in p_def["stages"]:
                    stage_order = s_def["stage"]
                    stage_title = s_def["title"]
                    stage_project = s_def.get("project")
                    stage_skills: List[PathwaySkillRequirement] = []

                    for raw_skill_name in s_def["skills"]:
                        self.stats["total_skills_mapped"] += 1
                        norm_res = self.normalizer.normalize(
                            raw_skill_name,
                            context=f"{career_name} -> {pathway_name} -> Stage {stage_order}",
                            source=pdf_source
                        )

                        if norm_res.canonical_skill_id:
                            self.stats["successfully_normalized"] += 1
                            canonical_id = norm_res.canonical_skill_id
                            canonical_name = norm_res.canonical_skill_name

                            # Skill importance heuristic based on stage
                            # Stage 1-2: CRITICAL, Stage 3-4: HIGH, Stage 5-6: MEDIUM
                            if stage_order <= 2:
                                importance = SkillImportance.CRITICAL
                            elif stage_order <= 4:
                                importance = SkillImportance.HIGH
                            else:
                                importance = SkillImportance.MEDIUM

                            req_provenance = Provenance(
                                source=pdf_source,
                                source_type=SourceType.ROADMAP_PDF,
                                confidence=norm_res.confidence,
                                extracted_at=now_iso,
                                validation_status=ValidationStatus.VALIDATED
                            )

                            req = PathwaySkillRequirement(
                                skill_id=canonical_id,
                                skill_name=canonical_name,
                                importance=importance,
                                recommended_status=VerificationStatus.ASSESSMENT_VERIFIED if importance == SkillImportance.CRITICAL else VerificationStatus.EVIDENCE_BACKED,
                                stage_order=stage_order,
                                provenance=req_provenance
                            )
                            stage_skills.append(req)
                            core_skills_map[canonical_id] = req
                        else:
                            self.stats["unmapped_candidates"] += 1
                            self.stats["ambiguous_extractions"].append({
                                "career": career_name,
                                "pathway": pathway_name,
                                "raw_skill": raw_skill_name,
                                "candidate_id": norm_res.candidate_id
                            })

                    stages_list.append(RoadmapStage(
                        stage_order=stage_order,
                        title=stage_title,
                        description=f"Stage {stage_order} milestone for {pathway_name}",
                        skills=stage_skills,
                        checkpoint_project=stage_project
                    ))

                pathway = CareerPathway(
                    pathway_id=pathway_id,
                    pathway_name=pathway_name,
                    description=pathway_desc,
                    core_skills=list(core_skills_map.values()),
                    optional_skills=[],
                    recommended_stages=stages_list,
                    provenance=pathway_provenance
                )
                pathways_list.append(pathway)
                self.stats["total_pathways"] += 1

            profile = CareerProfile(
                career_id=career_id,
                career_name=career_name,
                category=c_def["category"],
                description=c_def["description"],
                pathways=pathways_list,
                provenance=career_provenance
            )
            careers_data.append(profile)
            self.stats["total_careers"] += 1

        # Count total prerequisite edges across canonical taxonomy
        for skill_id, prereqs in self.taxonomy.prerequisite_id_map.items():
            self.stats["total_prerequisite_edges"] += len(prereqs)

        # Write to structured_roadmaps.json
        STRUCTURED_ROADMAPS_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(STRUCTURED_ROADMAPS_PATH, "w", encoding="utf-8") as f:
            json.dump([c.model_dump() for c in careers_data], f, indent=2)

        return {
            "storage_path": str(STRUCTURED_ROADMAPS_PATH),
            "stats": self.stats
        }

if __name__ == "__main__":
    builder = RoadmapKnowledgeBaseBuilder()
    res = builder.build_and_save()
    print("Roadmap Knowledge Base Builder finished successfully!")
    print(f"Stored at: {res['storage_path']}")
    for k, v in res['stats'].items():
        if k != "ambiguous_extractions":
            print(f"  {k}: {v}")
