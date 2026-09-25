import json
import re
import argparse
import sys
import os
import time
from PIL import Image

# Ensure UTF-8 stdout printing on Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')

# Configure environment for Surya-OCR backend if needed
script_dir = os.path.dirname(os.path.abspath(__file__))
venv_scripts = os.path.join(script_dir, "venv", "Scripts")
if os.path.exists(venv_scripts):
    os.environ["PATH"] = venv_scripts + os.pathsep + os.environ.get("PATH", "")
    llama_exe = os.path.join(venv_scripts, "llama-server.exe")
    if os.path.exists(llama_exe):
        os.environ["LLAMA_CPP_BINARY"] = llama_exe

class SkillExtractor:
    def __init__(self, dataset_path="skillsync_skill_dataset (1).json"):
        # Load dataset
        with open(dataset_path, 'r', encoding='utf-8') as f:
            self.skills_data = json.load(f)
        
        # Build lookup table for efficient matching
        self.skill_lookup = {}
        for skill in self.skills_data:
            self._add_to_lookup(skill['skill_name'], skill)
            if skill.get('aliases'):
                aliases = [a.strip() for a in skill['aliases'].split(';')]
                for alias in aliases:
                    if alias:
                        self._add_to_lookup(alias, skill)

        self.rec_predictor = None

    def _add_to_lookup(self, phrase, skill):
        normalized = re.sub(r'\s+', ' ', phrase.lower().strip())
        if normalized not in self.skill_lookup:
            self.skill_lookup[normalized] = skill

    def _init_surya_ocr(self):
        """Lazy load Surya-OCR only when dealing with scanned images/documents."""
        if self.rec_predictor is None:
            print("Initializing Surya-OCR for image/scanned document...")
            from surya.inference import SuryaInferenceManager
            from surya.recognition import RecognitionPredictor
            manager = SuryaInferenceManager()
            self.rec_predictor = RecognitionPredictor(manager)

    def extract_text_from_pdf_fast(self, pdf_path):
        """Extract digital text from PDF in milliseconds using pypdfium2."""
        try:
            import pypdfium2 as pdfium
            pdf = pdfium.PdfDocument(pdf_path)
            extracted_pages = []
            for page in pdf:
                text_page = page.get_textpage()
                page_text = text_page.get_text_range()
                if page_text:
                    extracted_pages.append(page_text)
            return " ".join(extracted_pages).strip()
        except Exception as e:
            return ""

    def extract_text_with_surya(self, document_path):
        """High-accuracy fallback OCR using Surya-OCR for images and scanned PDFs."""
        self._init_surya_ocr()
        from surya.input.load import load_from_file
        try:
            images, _ = load_from_file(document_path)
        except Exception as e:
            print(f"Error opening document {document_path}: {e}")
            return ""

        page_results = self.rec_predictor(images, full_page=True)
        extracted_text = []
        for page in page_results:
            for block in page.blocks:
                raw_text = re.sub(r'<[^>]+>', ' ', block.html)
                extracted_text.append(raw_text)
        return " ".join(extracted_text)

    def extract_text(self, document_path):
        """Hybrid extractor: checks for instant digital text first, falls back to Surya-OCR."""
        ext = os.path.splitext(document_path)[1].lower()
        
        # 1. If it's a PDF, try ultra-fast digital text extraction first (<0.05s)
        if ext == '.pdf':
            fast_text = self.extract_text_from_pdf_fast(document_path)
            # If we found sufficient text, return immediately
            if len(fast_text.strip()) > 30:
                print("⚡ Extracted text using Fast Digital Stream (< 0.05s)")
                return fast_text
            else:
                print("ℹ️ PDF appears to be a scanned image. Using Surya-OCR...")

        # 2. Fall back to Surya-OCR for image files or scanned PDFs
        print("🔍 Running Surya-OCR deep recognition model...")
        return self.extract_text_with_surya(document_path)

    def find_skills_in_text(self, text):
        normalized_text = re.sub(r'\s+', ' ', text.lower().strip())
        extracted_skills = {}
        
        # Search for longest matching phrases first to avoid sub-phrase collisions
        sorted_phrases = sorted(self.skill_lookup.keys(), key=len, reverse=True)
        
        for phrase in sorted_phrases:
            escaped_phrase = re.escape(phrase)
            pattern = r'\b' + escaped_phrase + r'\b'
            
            if re.search(pattern, normalized_text):
                skill = self.skill_lookup[phrase]
                extracted_skills[skill['skill_id']] = skill
                # Remove matched phrase to prevent subset matching
                normalized_text = re.sub(pattern, ' ', normalized_text)
                
        return list(extracted_skills.values())

    def process_certificate(self, document_path):
        start_time = time.time()
        print(f"\nProcessing document: {document_path}")
        text = self.extract_text(document_path)
        elapsed = time.time() - start_time
        
        print(f"\n--- Extracted Text ({elapsed:.2f}s) ---\n{text}\n----------------------")
        
        skills = self.find_skills_in_text(text)
        return skills, elapsed

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Extract skills from certificates using Hybrid Fast Extraction & Surya OCR")
    parser.add_argument("document_path", help="Path to the certificate file (Image or PDF)")
    parser.add_argument("--dataset", default="skillsync_skill_dataset (1).json", help="Path to the skills dataset JSON file")
    
    args = parser.parse_args()
    
    extractor = SkillExtractor(dataset_path=args.dataset)
    found_skills, elapsed = extractor.process_certificate(args.document_path)
    
    print(f"\n--- Found Skills ({len(found_skills)}) [Processed in {elapsed:.2f}s] ---")
    for skill in found_skills:
        print(f"[+] {skill['skill_name']} ({skill['category']}) - ID: {skill['skill_id']}")

    # Flush output buffers and exit cleanly
    sys.stdout.flush()
    sys.stderr.flush()
    os._exit(0)
