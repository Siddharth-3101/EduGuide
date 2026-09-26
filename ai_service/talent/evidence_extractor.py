import re
from typing import Dict, List, Optional, Tuple, Set, Any
from ai_service.core.enums import VerificationStatus, EvidenceSourceType, MatchType
from ai_service.core.schemas import EvidenceRecord
from ai_service.taxonomy.normalizer import get_skill_normalizer
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

DEMONSTRATED_ACTION_PATTERNS = [
    r'\b(?:built|developed|architected|implemented|deployed|engineered|designed|created|maintained|integrated|configured|optimized|orchestrated|leveraged|scaled|automated|tested|refactored|containerized|migrated)\b',
    r'\b(?:experience with|proficient in|hands-on with|specialized in|certified in|mastery of|working knowledge of)\b',
    r'\b(?:production|pipeline|microservices|architecture|full-stack|full stack|backend|frontend|framework)\b'
]

CLAIMED_OR_INTEREST_PATTERNS = [
    r'\b(?:interested in|planning to learn|want to learn|curious about|exploring|aiming to|seeking to learn|beginner in|looking into)\b',
    r'\b(?:future learning|goals|wish to|aspiring)\b'
]

NEGATIVE_EXCLUSION_PATTERNS = [
    r'\b(?:do not know|no experience with|never used|lack experience in|not familiar with|not proficient)\b'
]

class ContextualSkillExtractor:
    """
    Context-Aware NLP Evidence & Skill Extractor.
    Extracts skills from unstructured text (Resumes, Certificates, GitHub READMEs, Project Specs),
    classifies whether the mention demonstrates concrete applied evidence or merely self-reported interest,
    and normalizes strictly to canonical taxonomy IDs.
    """
    _instance = None

    def __init__(self):
        self.normalizer = get_skill_normalizer()
        self.taxonomy = get_canonical_taxonomy()

    def _split_into_sentences(self, text: str) -> List[str]:
        if not text:
            return []
        # Split by punctuation and newlines
        raw_chunks = re.split(r'[\n\r]+|[.!?]+', text)
        return [c.strip() for c in raw_chunks if len(c.strip()) > 3]

    def _classify_context(self, sentence: str) -> Tuple[VerificationStatus, float]:
        """
        Analyzes surrounding sentence context to classify evidence level:
        - EVIDENCE_BACKED: Concrete action verbs, production descriptions, project statements.
        - CLAIMED: Self-reported claims, interest, or ambiguous mentions.
        - MISSING: Explicit negation / lack of knowledge.
        """
        s_lower = sentence.lower()

        # Check negative exclusion
        for pat in NEGATIVE_EXCLUSION_PATTERNS:
            if re.search(pat, s_lower):
                return VerificationStatus.MISSING, 0.0

        # Check aspirational / interest patterns
        for pat in CLAIMED_OR_INTEREST_PATTERNS:
            if re.search(pat, s_lower):
                return VerificationStatus.CLAIMED, 0.40

        # Check active demonstrated action patterns
        for pat in DEMONSTRATED_ACTION_PATTERNS:
            if re.search(pat, s_lower):
                return VerificationStatus.EVIDENCE_BACKED, 0.85

        # Default: If mentioned in a resume/project without negative markers, treat as EVIDENCE_BACKED with 0.80
        return VerificationStatus.EVIDENCE_BACKED, 0.80

    def extract_skills_from_text(
        self,
        text: str,
        source_type: EvidenceSourceType = EvidenceSourceType.RESUME,
        source_name: str = "Document"
    ) -> List[Dict[str, Any]]:
        """
        Extracts all canonical skills from text with context-aware evidence classification.
        """
        if not text or not text.strip():
            return []

        sentences = self._split_into_sentences(text)
        detected_skills: Dict[str, Dict[str, Any]] = {}

        # 1. Scan for canonical skill names and pre-indexed aliases across sentences
        for sentence in sentences:
            context_status, context_conf = self._classify_context(sentence)
            if context_status == VerificationStatus.MISSING:
                continue

            # Check canonical skills and high-frequency terms
            words = re.findall(r'[A-Za-z0-9+#\.\-_/]+', sentence)
            
            # Check single and multi-word phrases (up to 4-grams)
            max_n = min(4, len(words))
            for n in range(1, max_n + 1):
                for i in range(len(words) - n + 1):
                    phrase = " ".join(words[i:i+n]).strip()
                    if len(phrase) < 2 or phrase.isdigit():
                        continue

                    # Try normalizing phrase
                    norm = self.normalizer.normalize(phrase, source=source_name, context=sentence[:100])
                    if norm.canonical_skill_id and norm.match_type in [MatchType.EXACT, MatchType.ALIAS, MatchType.FUZZY, MatchType.SEMANTIC]:
                        sid = norm.canonical_skill_id
                        sname = norm.canonical_skill_name

                        # If already detected, update evidence if higher confidence
                        if sid in detected_skills:
                            existing = detected_skills[sid]
                            if context_status == VerificationStatus.EVIDENCE_BACKED:
                                existing["status"] = VerificationStatus.EVIDENCE_BACKED
                                existing["confidence"] = max(existing["confidence"], context_conf)
                            if sentence not in existing["snippets"]:
                                existing["snippets"].append(sentence[:120])
                        else:
                            detected_skills[sid] = {
                                "skill_id": sid,
                                "skill_name": sname,
                                "status": context_status,
                                "confidence": context_conf,
                                "match_type": norm.match_type.value,
                                "source_type": source_type.value,
                                "source_name": source_name,
                                "snippets": [sentence[:120]]
                            }

        return list(detected_skills.values())

    def extract_evidence(
        self,
        text: str,
        source_type: EvidenceSourceType = EvidenceSourceType.RESUME,
        source_name: str = "Document"
    ) -> List[EvidenceRecord]:
        """Extracts structured EvidenceRecord models from text."""
        raw_skills = self.extract_skills_from_text(text, source_type, source_name)
        records = []
        for r in raw_skills:
            records.append(EvidenceRecord(
                evidence_id=f"EVD-{r['skill_id']}",
                skill_id=r["skill_id"],
                skill_name=r["skill_name"],
                source_type=source_type,
                source_name=source_name,
                verification_status=r["status"],
                confidence=r["confidence"],
                demonstrated_context="; ".join(r["snippets"])
            ))
        return records

def get_contextual_skill_extractor() -> ContextualSkillExtractor:
    if ContextualSkillExtractor._instance is None:
        ContextualSkillExtractor._instance = ContextualSkillExtractor()
    return ContextualSkillExtractor._instance

def get_contextual_evidence_extractor() -> ContextualSkillExtractor:
    return get_contextual_skill_extractor()
