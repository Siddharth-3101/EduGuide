import math
import re
from collections import Counter
from typing import Dict, List, Optional, Tuple
from ai_service.taxonomy.canonical_loader import get_canonical_taxonomy

def tokenize_and_ngram(text: str) -> List[str]:
    """Generates word tokens and 3-5 character n-grams for robust sub-string & semantic similarity."""
    if not text:
        return []
    clean = re.sub(r'[^\w\s]', ' ', text.lower()).strip()
    words = clean.split()
    tokens = list(words)
    # Character n-grams for fuzzy root matching (e.g., 'dockerized' -> 'docker', 'postgresql' -> 'postgres')
    for word in words:
        if len(word) >= 3:
            for n in (3, 4, 5):
                for i in range(len(word) - n + 1):
                    tokens.append(f"__ng_{word[i:i+n]}__")
    return tokens

class SemanticSkillMatcher:
    """
    Lightweight, high-performance Vector Space Semantic Matching Service.
    Indexes all 222 canonical skills, aliases, descriptions, and categories.
    Provides sub-millisecond semantic similarity, synonym mapping, and text-to-skill matching.
    """
    _instance = None

    def __init__(self):
        self.taxonomy = get_canonical_taxonomy()
        self.skill_vectors: Dict[str, Dict[str, float]] = {}
        self.idf: Dict[str, float] = {}
        self.cache: Dict[str, List[Tuple[str, str, float]]] = {}
        self._build_index()

    def _build_index(self):
        doc_count = len(self.taxonomy.skills_by_id)
        if doc_count == 0:
            return

        doc_frequencies: Counter = Counter()
        skill_token_docs: Dict[str, List[str]] = {}

        for skill_id, skill in self.taxonomy.skills_by_id.items():
            # Build rich document for each skill with strong name weighting
            parts = (
                [skill.skill_name] * 4 +
                (skill.aliases * 3 if skill.aliases else []) +
                [skill.category or "", skill.subcategory or "", skill.description or ""] +
                (skill.related_skills or [])
            )
            doc_text = " ".join([p for p in parts if p])
            tokens = tokenize_and_ngram(doc_text)
            skill_token_docs[skill_id] = tokens
            unique_tokens = set(tokens)
            for t in unique_tokens:
                doc_frequencies[t] += 1

        # Calculate IDF with smoothing
        for token, df in doc_frequencies.items():
            self.idf[token] = math.log((doc_count + 1) / (df + 1)) + 1.0

        # Calculate normalized TF-IDF vectors for all skills
        for skill_id, tokens in skill_token_docs.items():
            tf = Counter(tokens)
            vec = {}
            norm_sq = 0.0
            for token, count in tf.items():
                val = (1.0 + math.log(count)) * self.idf.get(token, 1.0)
                vec[token] = val
                norm_sq += val * val
            norm = math.sqrt(norm_sq) if norm_sq > 0 else 1.0
            self.skill_vectors[skill_id] = {k: v / norm for k, v in vec.items()}

    def _vectorize_query(self, query_text: str) -> Dict[str, float]:
        tokens = tokenize_and_ngram(query_text)
        if not tokens:
            return {}
        tf = Counter(tokens)
        vec = {}
        norm_sq = 0.0
        for token, count in tf.items():
            idf_val = self.idf.get(token, 1.0)
            val = (1.0 + math.log(count)) * idf_val
            vec[token] = val
            norm_sq += val * val
        norm = math.sqrt(norm_sq) if norm_sq > 0 else 1.0
        return {k: v / norm for k, v in vec.items()}

    def find_closest_skills(
        self,
        query_text: str,
        top_k: int = 5,
        threshold: float = 0.35
    ) -> List[Tuple[str, str, float]]:
        """
        Finds the top-K canonical skills semantically closest to the query text.
        Returns list of (skill_id, skill_name, similarity_score).
        """
        if not query_text or not query_text.strip():
            return []

        q_clean = query_text.lower().strip()
        q_words = [w for w in re.sub(r'[^\w\s]', ' ', q_clean).split() if len(w) >= 2]

        GENERIC_STOP_WORDS = {"framework", "development", "engineering", "programming", "system", "systems", "tool", "tools", "design", "testing", "management", "basics", "principles"}

        if q_clean in self.cache:
            scored_skills = self.cache[q_clean]
        else:
            q_vec = self._vectorize_query(query_text)
            if not q_vec:
                return []

            scored_skills = []
            for skill_id, s_vec in self.skill_vectors.items():
                skill = self.taxonomy.skills_by_id[skill_id]
                score = 0.0
                for t, w in q_vec.items():
                    if t in s_vec:
                        score += w * s_vec[t]

                s_name_lower = skill.skill_name.lower()
                s_words = [sw for sw in re.sub(r'[^\w\s]', ' ', s_name_lower).split() if len(sw) >= 2]
                common_words = set(q_words).intersection(set(s_words))

                # Direct match and containment boost (guarding against single/two-character false positives)
                if s_name_lower == q_clean:
                    score = max(score, 0.95)
                elif len(s_name_lower) >= 3 and (s_name_lower in q_clean or (len(q_clean) >= 3 and q_clean in s_name_lower)):
                    score = max(score, 0.88)
                elif common_words:
                    if len(s_words) == 1:
                        score = max(score, 0.88)
                    elif set(s_words).issubset(common_words):
                        score = max(score, 0.92)
                    else:
                        overlap_ratio = len(common_words) / max(len(s_words), 1)
                        score = max(score, 0.55 + 0.25 * overlap_ratio)
                elif any(len(w) >= 3 and (w == s_name_lower or (len(s_name_lower) >= 3 and s_name_lower.startswith(w))) for w in q_words):
                    score = max(score, 0.65)

                for alias in (skill.aliases or []):
                    alias_lower = alias.lower()
                    if alias_lower == q_clean:
                        score = max(score, 0.90)
                        break
                    elif len(alias_lower) >= 3 and (alias_lower in q_clean or (len(q_clean) >= 3 and q_clean in alias_lower)):
                        score = max(score, 0.75)
                        break

                scored_skills.append((skill_id, skill.skill_name, round(min(1.0, score), 4)))

            scored_skills.sort(key=lambda x: x[2], reverse=True)
            self.cache[q_clean] = scored_skills

        filtered = [s for s in scored_skills if s[2] >= threshold]
        return filtered[:top_k]

    def match_skill(
        self,
        raw_term: str,
        threshold: float = 0.50
    ) -> Optional[Tuple[str, str, float]]:
        """Finds the single best canonical skill match if similarity exceeds threshold."""
        results = self.find_closest_skills(raw_term, top_k=1, threshold=threshold)
        return results[0] if results else None

    def calculate_semantic_similarity(self, text_a: str, text_b: str) -> float:
        """Calculates cosine similarity between two arbitrary texts."""
        if not text_a or not text_b:
            return 0.0
        vec_a = self._vectorize_query(text_a)
        vec_b = self._vectorize_query(text_b)
        if not vec_a or not vec_b:
            return 0.0
        score = 0.0
        for t, w in vec_a.items():
            if t in vec_b:
                score += w * vec_b[t]
        return round(min(1.0, max(0.0, score)), 4)

def get_semantic_matcher() -> SemanticSkillMatcher:
    if SemanticSkillMatcher._instance is None:
        SemanticSkillMatcher._instance = SemanticSkillMatcher()
    return SemanticSkillMatcher._instance

def get_semantic_skill_matcher() -> SemanticSkillMatcher:
    return get_semantic_matcher()
