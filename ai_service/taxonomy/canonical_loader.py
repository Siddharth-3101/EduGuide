import csv
import re
from pathlib import Path
from typing import Dict, List, Optional
from ai_service.core.schemas import CanonicalSkill, Provenance
from ai_service.core.enums import SourceType, ValidationStatus
from ai_service.config.settings import CANONICAL_TAXONOMY_PATH

def normalize_text(text: str) -> str:
    """Normalize text for consistent key lookups: lowercase, strip punctuation and extra spaces."""
    if not text:
        return ""
    text = text.lower().strip()
    # Replace separators/punctuation like -, _, /, . with space except for specific tokens
    text = re.sub(r'[\-_/\\.]', ' ', text)
    # Remove remaining non-alphanumeric chars
    text = re.sub(r'[^\w\s]', '', text)
    return " ".join(text.split())

class CanonicalTaxonomy:
    """Canonical SkillSync Skill Taxonomy (220 skills). Single source of truth."""
    
    def __init__(self, csv_path: Optional[Path] = None):
        self.csv_path = csv_path or CANONICAL_TAXONOMY_PATH
        self.skills_by_id: Dict[str, CanonicalSkill] = {}
        self.skills_by_name: Dict[str, CanonicalSkill] = {}
        self.name_to_id: Dict[str, str] = {}
        self.normalized_alias_to_id: Dict[str, str] = {}
        self.prerequisite_name_map: Dict[str, List[str]] = {}
        self.prerequisite_id_map: Dict[str, List[str]] = {}
        self._load_taxonomy()

    def _split_semicolon(self, val: str) -> List[str]:
        if not val or not val.strip():
            return []
        return [item.strip() for item in val.split(";") if item.strip()]

    def _load_taxonomy(self):
        if not self.csv_path.exists():
            raise FileNotFoundError(f"Canonical taxonomy CSV not found at {self.csv_path}")

        with open(self.csv_path, mode="r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                skill_id = row.get("skill_id", "").strip()
                skill_name = row.get("skill_name", "").strip()
                if not skill_id or not skill_name:
                    continue

                aliases = self._split_semicolon(row.get("aliases", ""))
                related = self._split_semicolon(row.get("related_skills", ""))
                careers = self._split_semicolon(row.get("career_relevance", ""))
                prereqs = self._split_semicolon(row.get("prerequisite_skills", ""))

                provenance = Provenance(
                    source=str(self.csv_path.name),
                    source_type=SourceType.CANONICAL_TAXONOMY,
                    confidence=1.0,
                    validation_status=ValidationStatus.VALIDATED
                )

                skill = CanonicalSkill(
                    skill_id=skill_id,
                    skill_name=skill_name,
                    category=row.get("category", "").strip(),
                    subcategory=row.get("subcategory", "").strip(),
                    skill_type=row.get("skill_type", "Technical").strip(),
                    description=row.get("description", "").strip(),
                    aliases=aliases,
                    parent_skill=row.get("parent_skill", "").strip() or None,
                    related_skills=related,
                    difficulty=row.get("difficulty", "Intermediate").strip(),
                    assessment_available=row.get("assessment_available", "Planned").strip(),
                    career_relevance=careers,
                    source=row.get("source", "SkillSync initial taxonomy").strip(),
                    status=row.get("status", "Active").strip(),
                    prerequisite_skills=prereqs,
                    taxonomy_version=row.get("taxonomy_version", "SkillSync v1.1").strip(),
                    provenance=provenance
                )

                self.skills_by_id[skill_id] = skill
                self.skills_by_name[skill_name.lower()] = skill
                self.name_to_id[skill_name.lower()] = skill_id

                # Index normalized name
                norm_name = normalize_text(skill_name)
                self.normalized_alias_to_id[norm_name] = skill_id

                # Index aliases
                for alias in aliases:
                    norm_alias = normalize_text(alias)
                    if norm_alias:
                        self.normalized_alias_to_id[norm_alias] = skill_id

                # Record prerequisite names
                self.prerequisite_name_map[skill_id] = prereqs

        # Second pass: resolve prerequisite names to canonical skill IDs
        for skill_id, prereq_names in self.prerequisite_name_map.items():
            resolved_ids = []
            for name in prereq_names:
                norm = normalize_text(name)
                if norm in self.normalized_alias_to_id:
                    resolved_ids.append(self.normalized_alias_to_id[norm])
                elif name.lower() in self.name_to_id:
                    resolved_ids.append(self.name_to_id[name.lower()])
            self.prerequisite_id_map[skill_id] = resolved_ids

    def get_skill(self, identifier: str) -> Optional[CanonicalSkill]:
        """Look up by skill_id or name."""
        if not identifier:
            return None
        if identifier in self.skills_by_id:
            return self.skills_by_id[identifier]
        lower_id = identifier.lower()
        if lower_id in self.skills_by_name:
            return self.skills_by_name[lower_id]
        norm = normalize_text(identifier)
        if norm in self.normalized_alias_to_id:
            s_id = self.normalized_alias_to_id[norm]
            return self.skills_by_id[s_id]
        return None

    def total_skills(self) -> int:
        return len(self.skills_by_id)

# Singleton instance
_taxonomy_instance: Optional[CanonicalTaxonomy] = None

def get_canonical_taxonomy() -> CanonicalTaxonomy:
    global _taxonomy_instance
    if _taxonomy_instance is None:
        _taxonomy_instance = CanonicalTaxonomy()
    return _taxonomy_instance
