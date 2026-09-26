import os
from pathlib import Path
from typing import Dict, Any
import yaml

# Base directory for the AI Service
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent
DATA_DIR = BASE_DIR / "data"
CONFIG_DIR = BASE_DIR / "config"
CANONICAL_TAXONOMY_PATH = PROJECT_ROOT / "skillsync_skill_dataset_enriched.csv"
CANDIDATE_SKILLS_PATH = DATA_DIR / "canonical" / "candidate_skills.json"
STRUCTURED_ROADMAPS_PATH = DATA_DIR / "roadmaps" / "structured_roadmaps.json"
PROJECT_CATALOG_PATH = DATA_DIR / "projects" / "project_catalog.json"
LEARNING_RESOURCES_PATH = DATA_DIR / "resources" / "learning_resources.json"
RAW_CAREER_DIR = PROJECT_ROOT / "career"

# Ollama LLM Configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
OLLAMA_TIMEOUT = float(os.getenv("OLLAMA_TIMEOUT", "65.0"))

def load_recommendation_config() -> Dict[str, Any]:
    config_file = CONFIG_DIR / "recommendation_weights.yaml"
    if not config_file.exists():
        return {}
    with open(config_file, "r", encoding="utf-8") as f:
        return yaml.safe_load(f) or {}

CONFIG = load_recommendation_config()
