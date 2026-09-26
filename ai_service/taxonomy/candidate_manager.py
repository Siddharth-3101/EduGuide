import json
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime, timezone
from ai_service.core.schemas import CandidateSkill, Provenance
from ai_service.core.enums import ValidationStatus, SourceType
from ai_service.config.settings import CANDIDATE_SKILLS_PATH

class CandidateSkillManager:
    """Manages emerging or unmapped skills in a quarantined registry."""

    def __init__(self, storage_path: Optional[Path] = None):
        self.storage_path = storage_path or CANDIDATE_SKILLS_PATH
        self.candidates: Dict[str, CandidateSkill] = {}
        self._load()

    def _load(self):
        if self.storage_path.exists():
            try:
                with open(self.storage_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for item in data:
                        candidate = CandidateSkill(**item)
                        self.candidates[candidate.candidate_id] = candidate
            except Exception:
                self.candidates = {}

    def save(self):
        self.storage_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.storage_path, "w", encoding="utf-8") as f:
            json.dump([c.model_dump() for c in self.candidates.values()], f, indent=2)

    def register_candidate(self, raw_name: str, context: str = "", source: str = "Unknown") -> CandidateSkill:
        clean_name = raw_name.strip()
        key = clean_name.lower()
        now = datetime.now(timezone.utc).isoformat()

        # Find existing by raw name
        for cand in self.candidates.values():
            if cand.raw_name.lower() == key:
                cand.frequency += 1
                cand.last_seen = now
                if context and context not in cand.detected_contexts:
                    cand.detected_contexts.append(context)
                self.save()
                return cand

        # Create new candidate record
        cand_id = f"CAND-{len(self.candidates) + 1:04d}"
        provenance = Provenance(
            source=source,
            source_type=SourceType.CURRICULUM_SPEC if "pdf" in source.lower() else SourceType.STUDENT_INPUT,
            confidence=0.50,
            validation_status=ValidationStatus.CANDIDATE
        )

        new_candidate = CandidateSkill(
            candidate_id=cand_id,
            raw_name=clean_name,
            detected_contexts=[context] if context else [],
            frequency=1,
            first_seen=now,
            last_seen=now,
            status=ValidationStatus.CANDIDATE,
            provenance=provenance
        )
        self.candidates[cand_id] = new_candidate
        self.save()
        return new_candidate

    def get_candidate(self, candidate_id: str) -> Optional[CandidateSkill]:
        return self.candidates.get(candidate_id)

    def list_candidates(self) -> List[CandidateSkill]:
        return list(self.candidates.values())

# Singleton instance
_candidate_manager_instance: Optional[CandidateSkillManager] = None

def get_candidate_manager() -> CandidateSkillManager:
    global _candidate_manager_instance
    if _candidate_manager_instance is None:
        _candidate_manager_instance = CandidateSkillManager()
    return _candidate_manager_instance
