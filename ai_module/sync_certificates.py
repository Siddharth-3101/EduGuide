import os
from extract_skills import SkillExtractor
from portfolio_manager import PortfolioManager
from resume_generator import ResumeGenerator

def process_certificates_folder(user_id: str = "sanjay_krishna", cert_dir: str = "certificates"):
    extractor = SkillExtractor()
    mgr = PortfolioManager()

    print(f"=== Scanning '{cert_dir}' Folder for User '{user_id}' ===")
    if not os.path.exists(cert_dir):
        print(f"Folder '{cert_dir}' does not exist.")
        return

    processed_count = 0
    for filename in os.listdir(cert_dir):
        if filename.lower().endswith(('.pdf', '.png', '.jpg', '.jpeg')):
            file_path = os.path.join(cert_dir, filename)
            print(f"\n📄 Processing: {filename}")
            
            skills, elapsed = extractor.process_certificate(file_path)
            raw_text = extractor.extract_text(file_path)
            skill_names = [s['skill_name'] for s in skills]
            print(f"   ⏱️ Extracted {len(skills)} skills in {elapsed:.2f}s: {skill_names}")
            
            sync_res = mgr.add_skills_from_certificate(
                user_id=user_id,
                extracted_skills=skills,
                document_name=filename,
                raw_text=raw_text
            )
            print(f"   📊 Newly added skills: {sync_res['new_skills_added']} | Total portfolio skills: {sync_res['total_verified_skills']}")
            processed_count += 1

    portfolio = mgr.get_portfolio(user_id)
    print(f"\n==========================================")
    print(f"🎉 Processed {processed_count} certificates.")
    print(f"Total Verified Skills in Profile: {len(portfolio.get('verified_skills', {}))}")
    print(f"Total Certifications Logged: {len(portfolio.get('certificates', []))}")
    
    # Generate updated PDF resumes for target roles
    for role in ["Software Engineer", "Frontend Developer", "Network Engineer"]:
        resume_data = ResumeGenerator.generate_role_resume_data(portfolio, target_role=role)
        pdf_bytes = ResumeGenerator.generate_pdf_bytes(resume_data)
        
        safe_role = role.lower().replace(" ", "_")
        out_pdf_name = f"{user_id}_{safe_role}_resume.pdf"
        with open(out_pdf_name, "wb") as f:
            f.write(pdf_bytes)
        print(f"💾 Generated downloadable PDF: {out_pdf_name} ({len(pdf_bytes)} bytes)")

if __name__ == "__main__":
    process_certificates_folder()
