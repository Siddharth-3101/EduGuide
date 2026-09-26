import json
import logging
from typing import Dict, Any, Optional, List
import httpx
from ai_service.config.settings import OLLAMA_BASE_URL, OLLAMA_MODEL, OLLAMA_TIMEOUT
from ai_service.core.schemas import PersonalizedRoadmap, StudentProfile

logger = logging.getLogger(__name__)

class OllamaClient:
    """Module 6: Resilient Ollama LLM Personalization Client."""

    def __init__(
        self,
        base_url: Optional[str] = None,
        model: Optional[str] = None,
        timeout: Optional[float] = None
    ):
        self.base_url = (base_url or OLLAMA_BASE_URL).rstrip("/")
        self.model = model or OLLAMA_MODEL
        self.timeout = timeout or OLLAMA_TIMEOUT

    def check_health(self) -> Dict[str, Any]:
        """Probes the Ollama server for availability and model listings, auto-detecting model."""
        try:
            with httpx.Client(timeout=3.0) as client:
                res = client.get(f"{self.base_url}/api/tags")
                if res.status_code == 200:
                    models = [m.get("name") for m in res.json().get("models", [])]
                    # If configured model is not installed, auto-fallback to any available completion model
                    if not any(self.model in m for m in models) and models:
                        gen_models = [m for m in models if "embed" not in m]
                        if gen_models:
                            self.model = gen_models[0]

                    return {
                        "available": True,
                        "status": "online",
                        "base_url": self.base_url,
                        "configured_model": self.model,
                        "model_installed": any(self.model in m for m in models),
                        "available_models": models
                    }
        except Exception as e:
            logger.debug(f"Ollama server not reachable: {e}")

        return {
            "available": False,
            "status": "offline",
            "base_url": self.base_url,
            "configured_model": self.model,
            "model_installed": False,
            "message": "Ollama server is currently offline or unreachable. Deterministic fallback active."
        }

    def personalize_roadmap(
        self,
        roadmap: PersonalizedRoadmap,
        student_profile: StudentProfile,
        weekly_hours: int = 10
    ) -> Dict[str, Any]:
        """
        Synthesizes a conversational study plan and narrative from the deterministic roadmap.
        Falls back to a structured deterministic narrative if Ollama is unavailable.
        """
        health = self.check_health()
        if not health["available"]:
            return self._build_deterministic_fallback(roadmap, student_profile, weekly_hours)

        # Build structured fact prompt for Ollama
        verified_skills = [
            s.skill_name for s in student_profile.skills
            if s.status == "ASSESSMENT_VERIFIED" and s.skill_name
        ]
        evidence_skills = [
            s.skill_name for s in student_profile.skills
            if s.status == "EVIDENCE_BACKED" and s.skill_name
        ]

        stage_summaries = []
        for s in roadmap.stages:
            skill_names = [sk.skill_name for sk in s.skills]
            stage_summaries.append(f"Stage {s.stage_number} ({s.stage_title}): {', '.join(skill_names)}")

        prompt = (
            f"You are SkillSync AI, a career coaching assistant. Explain and personalize this study plan.\n\n"
            f"Student Profile:\n"
            f"- Career Goal: {roadmap.career_name}\n"
            f"- Pathway: {roadmap.pathway_name}\n"
            f"- Verified Skills: {', '.join(verified_skills) if verified_skills else 'None'}\n"
            f"- Evidence-backed Skills: {', '.join(evidence_skills) if evidence_skills else 'None'}\n"
            f"- Weekly Hours Committed: {weekly_hours} hours/week\n\n"
            f"Deterministic Learning Stages:\n"
            + "\n".join(stage_summaries) + "\n\n"
            f"Instructions:\n"
            f"1. Explain why this sequence is optimal for this student based on what they already know.\n"
            f"2. Provide an actionable weekly study plan allocating {weekly_hours} hours per week.\n"
            f"3. Do NOT invent new skills or change the stage order.\n"
            f"4. Keep the tone encouraging, concise, and professional."
        )

        try:
            with httpx.Client(timeout=self.timeout) as client:
                res = client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    response_text = data.get("response", "").strip()
                    if response_text:
                        return {
                            "llm_status": "available",
                            "model_used": self.model,
                            "personalization_narrative": response_text,
                            "weekly_study_plan": self._generate_structured_weekly_plan(roadmap, weekly_hours),
                            "practical_advice": "Focus on assessment verification for evidence-backed skills to strengthen your profile."
                        }
        except Exception as e:
            logger.info(f"Ollama generation failed ({e}), falling back to deterministic presentation.")

        return self._build_deterministic_fallback(roadmap, student_profile, weekly_hours)

    def explain_skill_recommendation(
        self,
        skill_name: str,
        student_profile: StudentProfile,
        career_name: str,
        pathway_name: str
    ) -> Dict[str, Any]:
        """Provides a natural-language conversational explanation for a recommended skill."""
        health = self.check_health()
        fallback_msg = (
            f"'{skill_name}' is prioritized because it is an essential competency for '{pathway_name}' "
            f"and aligns with your target career in {career_name}."
        )

        if not health["available"]:
            return {
                "llm_status": "unavailable",
                "explanation": fallback_msg
            }

        prompt = (
            f"Briefly explain in 2-3 sentences why learning '{skill_name}' is valuable for a student "
            f"pursuing '{pathway_name}' within '{career_name}'. Keep it direct and motivational."
        )

        try:
            with httpx.Client(timeout=self.timeout) as client:
                res = client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "stream": False
                    }
                )
                if res.status_code == 200:
                    text = res.json().get("response", "").strip()
                    if text:
                        return {
                            "llm_status": "available",
                            "explanation": text
                        }
        except Exception:
            pass

        return {
            "llm_status": "unavailable",
            "explanation": fallback_msg
        }

    def _generate_structured_weekly_plan(
        self,
        roadmap: PersonalizedRoadmap,
        weekly_hours: int
    ) -> List[Dict[str, Any]]:
        """Generates estimated week-by-week schedule based on stages."""
        plan = []
        current_week = 1
        for stage in roadmap.stages:
            estimated_weeks = max(1, len(stage.skills))
            plan.append({
                "weeks": f"Weeks {current_week} - {current_week + estimated_weeks - 1}",
                "stage": stage.stage_title,
                "focus_skills": [s.skill_name for s in stage.skills],
                "hours_per_week": weekly_hours,
                "milestone_checkpoint": stage.recommended_checkpoint or "Milestone assessment and practice"
            })
            current_week += estimated_weeks
        return plan

    def _build_deterministic_fallback(
        self,
        roadmap: PersonalizedRoadmap,
        student_profile: StudentProfile,
        weekly_hours: int
    ) -> Dict[str, Any]:
        """Clean, structured fallback narrative when Ollama is offline."""
        stage_names = [f"Stage {s.stage_number} ({s.stage_title})" for s in roadmap.stages]
        narrative = (
            f"Based on your profile and declared career goal ({roadmap.career_name} - {roadmap.pathway_name}), "
            f"SkillSync has constructed a structured {len(roadmap.stages)}-stage progression: {', '.join(stage_names)}. "
            f"Starting with {roadmap.stages[0].stage_title if roadmap.stages else 'foundations'}, "
            f"dedicating ~{weekly_hours} hours per week will allow steady progression toward verified competency."
        )
        return {
            "llm_status": "unavailable",
            "model_used": None,
            "personalization_narrative": narrative,
            "weekly_study_plan": self._generate_structured_weekly_plan(roadmap, weekly_hours),
        }

    @staticmethod
    def _clean_and_parse_json(raw: str) -> Optional[Dict[str, Any]]:
        """Parses LLM JSON output with fallback repairs for quotes, trailing commas, and brackets."""
        if not raw:
            return None
        import re
        text = raw.strip()
        text = re.sub(r'^```json\s*', '', text, flags=re.IGNORECASE)
        text = re.sub(r'^```\s*', '', text)
        text = re.sub(r'```$', '', text).strip()

        # 1. Direct parse attempt
        try:
            return json.loads(text)
        except Exception:
            pass

        # 2. Strip trailing commas before closing braces/brackets
        cleaned = re.sub(r',\s*([\}\]])', r'\1', text)
        try:
            return json.loads(cleaned)
        except Exception:
            pass

        # 3. Handle truncation by attempting to auto-close brackets/braces
        start = cleaned.find('{')
        if start != -1:
            snippet = cleaned[start:]
            for suffix in ['"}', '"]}', '}]}', '}', ']}', ']}}', '"]}}']:
                try:
                    return json.loads(snippet + suffix)
                except Exception:
                    pass

        return None

    def extract_resume_json(self, raw_text: str) -> Optional[Dict[str, Any]]:
        """
        Extracts structured candidate details, education, projects, certifications,
        and skills from raw resume text using Ollama LLM with strict JSON mode.
        """
        health = self.check_health()
        if not health.get("available"):
            return None

        # Clean and clamp text size to keep prompt inference under ~12-15 seconds
        cleaned_snippet = raw_text[:2800].strip()

        prompt = (
            "You are a talent intelligence system. Extract all candidate information from this resume into valid JSON only.\n"
            "Extract individual technical skills (e.g. 'Python', 'React', 'Docker' - do NOT extract section headers like 'Programming Languages').\n"
            "Do NOT include markdown quotes (like ```json), explanations, or notes. Output purely valid JSON.\n\n"
            "Keep all descriptions and summaries concise (under 15 words each).\n"
            "Format:\n"
            "{\n"
            '  "full_name": "Candidate Full Name",\n'
            '  "email": "candidate email or empty string",\n'
            '  "phone": "candidate phone or empty string",\n'
            '  "location": "City, Country or empty string",\n'
            '  "linkedin": "LinkedIn profile link or empty string",\n'
            '  "github": "GitHub profile link or empty string",\n'
            '  "summary": "1-2 sentence professional engineering summary",\n'
            '  "education": [{"institution": "College/University", "degree": "Degree and Major", "year": "Graduation period", "score": "GPA or score"}],\n'
            '  "projects": [{"title": "Project Name", "tech_stack": "Technologies used", "description": "Short description", "bullets": ["Key bullet points"], "github_url": "repo url if any"}],\n'
            '  "certifications": [{"title": "Certification Name", "issuer": "Issuing Authority", "issue_date": "Year or date"}],\n'
            '  "skills": [{"skill_name": "Specific skill name (e.g. Python)", "category": "Category name"}]\n'
            "}\n\n"
            f"Resume Text:\n{cleaned_snippet}"
        )

        try:
            with httpx.Client(timeout=self.timeout) as client:
                res = client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "format": "json",
                        "stream": False,
                        "options": {
                            "temperature": 0.1,
                            "num_predict": 220
                        }
                    }
                )
                if res.status_code == 200:
                    raw_resp = res.json().get("response", "").strip()
                    if raw_resp:
                        parsed = self._clean_and_parse_json(raw_resp)
                        if parsed:
                            return parsed
        except Exception as e:
            logger.warning(f"Ollama resume extraction error: {e}")
        return None

    def extract_certificate_json(self, raw_text: str) -> Optional[Dict[str, Any]]:
        """
        Extracts certificate title, issuing organization, issue date, credential ID,
        and verified technical skills from certificate document text using Ollama LLM.
        """
        health = self.check_health()
        if not health.get("available"):
            return None

        cleaned_snippet = raw_text[:2500].strip()

        prompt = (
            "Extract accredited certificate information and technical skills from this document into valid JSON only.\n"
            "Do NOT include markdown fences, comments, or intro text. Output purely valid JSON.\n\n"
            "Format:\n"
            "{\n"
            '  "recipient_name": "Full name of recipient",\n'
            '  "title": "Certificate or Course title",\n'
            '  "issuer": "Issuing authority (e.g. AWS, Coursera, NPTEL, IIT Bombay, MongoDB, Oracle)",\n'
            '  "issue_date": "Date or year of issuance",\n'
            '  "credential_id": "Certificate verification ID or code",\n'
            '  "skills": ["Skill 1", "Skill 2"]\n'
            "}\n\n"
            f"Certificate Text:\n{cleaned_snippet}"
        )

        try:
            with httpx.Client(timeout=self.timeout) as client:
                res = client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": self.model,
                        "prompt": prompt,
                        "format": "json",
                        "stream": False,
                        "options": {
                            "temperature": 0.1,
                            "num_predict": 180
                        }
                    }
                )
                if res.status_code == 200:
                    raw_resp = res.json().get("response", "").strip()
                    if raw_resp:
                        parsed = self._clean_and_parse_json(raw_resp)
                        if parsed:
                            return parsed
        except Exception as e:
            logger.warning(f"Ollama certificate extraction error: {e}")
        return None

# Singleton instance
_ollama_client_instance: Optional[OllamaClient] = None

def get_ollama_client() -> OllamaClient:
    global _ollama_client_instance
    if _ollama_client_instance is None:
        _ollama_client_instance = OllamaClient()
    return _ollama_client_instance
