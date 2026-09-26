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
        if not os.path.isabs(dataset_path):
            dataset_path = os.path.join(script_dir, dataset_path)
            
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
        """Extract digital text from PDF in milliseconds using pypdfium2 or pypdf."""
        try:
            import pypdfium2 as pdfium
            pdf = pdfium.PdfDocument(pdf_path)
            extracted_pages = []
            try:
                for page in pdf:
                    text_page = page.get_textpage()
                    page_text = text_page.get_text_range()
                    if page_text:
                        clean_page = page_text.replace('\ufffe', ' ').replace('\ufeff', '')
                        extracted_pages.append(clean_page)
            finally:
                pdf.close()
            res = " ".join(extracted_pages).strip()
            if res:
                return res
        except Exception:
            pass

        try:
            import pypdf
            reader = pypdf.PdfReader(pdf_path)
            extracted_pages = []
            try:
                for page in reader.pages:
                    t = page.extract_text()
                    if t:
                        clean_t = t.replace('\ufffe', ' ').replace('\ufeff', '')
                        extracted_pages.append(clean_t)
            finally:
                if hasattr(reader, 'stream') and hasattr(reader.stream, 'close'):
                    reader.stream.close()
            return " ".join(extracted_pages).strip()
        except Exception:
            return ""

    def extract_text_with_surya(self, document_path):
        """High-accuracy fallback OCR using Surya-OCR for images and scanned PDFs."""
        try:
            self._init_surya_ocr()
            from surya.input.load import load_from_file
            images, _ = load_from_file(document_path)
            page_results = self.rec_predictor(images, full_page=True)
            extracted_text = []
            for page in page_results:
                for block in page.blocks:
                    raw_text = re.sub(r'<[^>]+>', ' ', block.html)
                    extracted_text.append(raw_text)
            return " ".join(extracted_text)
        except Exception as e:
            print(f"OCR processing unavailable for {document_path}: {e}")
            return ""

    def extract_text(self, document_path):
        """Hybrid extractor: supports direct text files, instant digital PDF text, and fallback OCR."""
        ext = os.path.splitext(document_path)[1].lower()

        # 1. Plain text and markdown files
        if ext in ['.txt', '.text', '.md', '.markdown', '.csv', '.json']:
            try:
                with open(document_path, 'r', encoding='utf-8', errors='ignore') as f:
                    return f.read()
            except Exception as e:
                print(f"Error reading text document: {e}")
                return ""

        # 2. DOCX documents
        if ext == '.docx':
            try:
                import zipfile
                import xml.etree.ElementTree as ET
                with zipfile.ZipFile(document_path) as z:
                    xml_content = z.read('word/document.xml')
                    tree = ET.fromstring(xml_content)
                    texts = [node.text for node in tree.iter() if node.text]
                    return " ".join(texts)
            except Exception:
                pass

        # 3. If it's a PDF, try ultra-fast digital text extraction first (<0.05s)
        if ext == '.pdf':
            fast_text = self.extract_text_from_pdf_fast(document_path)
            if len(fast_text.strip()) > 30:
                print("⚡ Extracted text using Fast Digital Stream (< 0.05s)")
                return fast_text
            else:
                print("ℹ️ PDF appears to be a scanned image. Using OCR fallback...")

        # 4. Fall back to OCR for image files or scanned PDFs
        print("🔍 Running OCR recognition model...")
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
