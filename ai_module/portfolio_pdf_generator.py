import os
import io
from datetime import datetime
from typing import Dict, Any, List
from xhtml2pdf import pisa

class PortfolioPDFGenerator:
    """Generates an executive, company-ready Verified Candidate Portfolio & Skill Dossier PDF."""

    @classmethod
    def render_portfolio_html(cls, portfolio: Dict[str, Any]) -> str:
        """Renders an executive, recruiter & enterprise-ready Portfolio layout."""
        p = portfolio.get("personal_info", {})
        skills_dict = portfolio.get("verified_skills", {})
        skills_list = list(skills_dict.values())
        certs = portfolio.get("certificates", [])
        education = portfolio.get("education", [])
        projects = portfolio.get("projects", [])

        # Categorize verified skills
        categories: Dict[str, List[Dict[str, Any]]] = {}
        for s in skills_list:
            cat = s.get("category", "General Technical Competencies")
            categories.setdefault(cat, []).append(s)

        # Build skill matrix HTML
        skill_matrix_html = ""
        for cat_name, cat_skills in categories.items():
            skill_badges = "".join([
                f'<span class="skill-badge"><span class="check">✓</span> {s["skill_name"]} <small class="id">({s["skill_id"]})</small></span>'
                for s in cat_skills
            ])
            skill_matrix_html += f"""
            <div class="category-block">
                <div class="category-title">{cat_name}</div>
                <div class="badges-container">{skill_badges}</div>
            </div>
            """

        # Build certificates log
        cert_log_html = ""
        for idx, cert in enumerate(certs, start=1):
            cert_id = cert.get("certificate_id") or "SKILLSYNC-VERIFIED"
            skills_str = ", ".join(cert.get("skills_extracted", []))
            cert_log_html += f"""
            <tr class="table-row">
                <td class="td-num">{idx}</td>
                <td class="td-main">
                    <strong>{cert['document_name']}</strong>
                    <div class="cert-sub">Verified Skills: {skills_str}</div>
                </td>
                <td class="td-id"><code>{cert_id}</code></td>
                <td class="td-status"><span class="status-badge">AUTHENTICATED</span></td>
            </tr>
            """

        # Build projects HTML
        projects_html = ""
        for proj in projects:
            tech_str = ", ".join(proj.get("technologies", []))
            projects_html += f"""
            <div class="project-card">
                <div class="project-header">
                    <h4>{proj['title']}</h4>
                </div>
                <p class="project-desc">{proj.get('description', '')}</p>
                <div class="project-tech"><strong>Core Tech Stack:</strong> {tech_str}</div>
            </div>
            """

        # Build education HTML
        education_html = ""
        for edu in education:
            education_html += f"""
            <div class="edu-card">
                <div class="edu-header">
                    <strong>{edu['degree']}</strong>
                    <span class="edu-year">{edu.get('year', '')}</span>
                </div>
                <div class="edu-inst">{edu['institution']} — <span class="edu-score">Performance: {edu.get('score', '')}</span></div>
            </div>
            """

        now_str = datetime.utcnow().strftime("%d %B %Y")

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Verified Talent Portfolio - {p.get('full_name', 'Candidate')}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f1f5f9;
            color: #0f172a;
            line-height: 1.5;
            padding: 30px 15px;
        }}
        .action-bar {{
            max-width: 900px;
            margin: 0 auto 20px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .btn {{
            background: #059669;
            color: white;
            padding: 10px 22px;
            border-radius: 6px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            border: none;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(5,150,105,0.25);
        }}
        .btn:hover {{ background: #047857; }}
        .btn-print {{ background: #2563eb; }}
        .btn-print:hover {{ background: #1d4ed8; }}
        
        .dossier {{
            max-width: 900px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }}
        .top-banner {{
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            padding: 35px 45px;
            position: relative;
        }}
        .verif-badge {{
            position: absolute;
            top: 35px;
            right: 45px;
            background: #10b981;
            color: white;
            font-size: 12px;
            font-weight: 700;
            padding: 6px 14px;
            border-radius: 20px;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 10px rgba(16,185,129,0.3);
        }}
        .candidate-name {{
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }}
        .candidate-title {{
            font-size: 16px;
            color: #94a3b8;
            margin-top: 4px;
            font-weight: 500;
        }}
        .contact-grid {{
            display: flex;
            flex-wrap: wrap;
            gap: 15px 25px;
            margin-top: 18px;
            font-size: 13px;
            color: #cbd5e1;
        }}
        .contact-grid a {{ color: #38bdf8; text-decoration: none; }}
        
        .content-body {{
            padding: 40px 45px;
        }}
        .stats-ribbon {{
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }}
        .stat-val {{ font-size: 22px; font-weight: 800; color: #0f172a; }}
        .stat-label {{ font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }}

        .section {{ margin-bottom: 30px; }}
        .section-header {{
            font-size: 16px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #0f172a;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 6px;
            margin-bottom: 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .section-subtitle {{ font-size: 11px; color: #64748b; font-weight: 500; text-transform: none; }}

        .category-block {{ margin-bottom: 16px; }}
        .category-title {{ font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 8px; }}
        .badges-container {{ display: flex; flex-wrap: wrap; gap: 8px; }}
        .skill-badge {{
            background: #f0fdf4;
            color: #166534;
            border: 1px solid #bbf7d0;
            padding: 5px 12px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }}
        .skill-badge .check {{ color: #15803d; font-weight: 800; }}
        .skill-badge .id {{ color: #65a30d; font-size: 10px; font-weight: 500; }}

        /* Table */
        .cert-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }}
        .cert-table th {{
            text-align: left;
            background: #f1f5f9;
            color: #475569;
            padding: 10px 12px;
            font-weight: 700;
            font-size: 11px;
            text-transform: uppercase;
        }}
        .cert-table td {{
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
        }}
        .td-num {{ width: 35px; color: #94a3b8; font-weight: 600; }}
        .td-main strong {{ color: #0f172a; }}
        .cert-sub {{ font-size: 12px; color: #64748b; margin-top: 3px; }}
        .td-id code {{
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            color: #0f172a;
        }}
        .status-badge {{
            background: #dcfce7;
            color: #15803d;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 12px;
        }}

        .project-card, .edu-card {{
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 12px;
        }}
        .project-header h4 {{ font-size: 15px; font-weight: 700; color: #0f172a; }}
        .project-desc {{ font-size: 13px; color: #334155; margin-top: 4px; }}
        .project-tech {{ font-size: 12px; color: #2563eb; margin-top: 6px; }}

        .edu-header {{ display: flex; justify-content: space-between; }}
        .edu-header strong {{ font-size: 14px; color: #0f172a; }}
        .edu-year {{ font-size: 12px; color: #64748b; }}
        .edu-inst {{ font-size: 13px; color: #475569; margin-top: 2px; }}
        .edu-score {{ color: #059669; font-weight: 600; }}

        .footer-sign {{
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px dashed #cbd5e1;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #64748b;
        }}

        @media print {{
            body {{ background: white; padding: 0; }}
            .action-bar {{ display: none; }}
            .dossier {{ box-shadow: none; width: 100%; max-width: 100%; border: none; }}
            .top-banner {{ -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
        }}
    </style>
</head>
<body>
    <div class="action-bar">
        <span style="font-weight: 700; color: #0f172a;">💼 Official Enterprise Portfolio Dossier</span>
        <div style="display: flex; gap: 10px;">
            <a class="btn" href="/api/v1/portfolio/download-pdf/{portfolio.get('user_id', 'sanjay_krishna')}">📥 Download Official Portfolio PDF</a>
            <button class="btn btn-print" onclick="window.print()">🖨️ Print Document</button>
        </div>
    </div>

    <div class="dossier">
        <div class="top-banner">
            <span class="verif-badge">✓ VERIFIED PROFILE</span>
            <h1 class="candidate-name">{p.get('full_name', 'Sanjay Krishna')}</h1>
            <div class="candidate-title">{p.get('headline', 'Computer Science & Engineering Graduate')}</div>
            <div class="contact-grid">
                <span>📍 {p.get('location', 'Pollachi, Tamil Nadu, India')}</span>
                <span>✉️ <a href="mailto:{p.get('email', '')}">{p.get('email', '')}</a></span>
                <span>📞 {p.get('phone', '')}</span>
                <span>🔗 <a href="{p.get('linkedin', '#')}">LinkedIn Profile</a></span>
                <span>💻 <a href="{p.get('github', '#')}">GitHub Portfolio</a></span>
            </div>
        </div>

        <div class="content-body">
            <div class="stats-ribbon">
                <div>
                    <div class="stat-val">{len(skills_list)}</div>
                    <div class="stat-label">Verified Skills</div>
                </div>
                <div>
                    <div class="stat-val">{len(certs)}</div>
                    <div class="stat-label">Accredited Certifications</div>
                </div>
                <div>
                    <div class="stat-val">100%</div>
                    <div class="stat-label">Verification Integrity</div>
                </div>
            </div>

            <!-- Skill Matrix -->
            <div class="section">
                <div class="section-header">
                    <span>1. Verified Technical & Soft Skill Matrix</span>
                    <span class="section-subtitle">Categorized & ID-Anchored</span>
                </div>
                {skill_matrix_html if skill_matrix_html else '<p style="font-size: 13px; color: #64748b;">No skills verified yet.</p>'}
            </div>

            <!-- Certification Log -->
            <div class="section">
                <div class="section-header">
                    <span>2. Official Certification & Credential Log</span>
                    <span class="section-subtitle">Proof of Verification</span>
                </div>
                <table class="cert-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Certificate Name & Extracted Skills</th>
                            <th>Certificate ID</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cert_log_html if cert_log_html else '<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding:15px;">No certificates uploaded yet.</td></tr>'}
                    </tbody>
                </table>
            </div>

            <!-- Technical Projects -->
            <div class="section">
                <div class="section-header">
                    <span>3. Applied Engineering & Technical Projects</span>
                </div>
                {projects_html}
            </div>

            <!-- Education -->
            <div class="section">
                <div class="section-header">
                    <span>4. Academic Background & Qualifications</span>
                </div>
                {education_html}
            </div>

            <div class="footer-sign">
                <span>SkillSync Verified Talent Dossier • System Generated on {now_str}</span>
                <span>Audit Reference: SS-REC-{len(skills_list)}-{len(certs)}</span>
            </div>
        </div>
    </div>
</body>
</html>
"""
        return html

    @classmethod
    def render_pdf_html(cls, portfolio: Dict[str, Any]) -> str:
        """Renders clean PDF-engine compatible HTML for company presentation."""
        p = portfolio.get("personal_info", {})
        skills_dict = portfolio.get("verified_skills", {})
        skills_list = list(skills_dict.values())
        certs = portfolio.get("certificates", [])
        education = portfolio.get("education", [])
        projects = portfolio.get("projects", [])

        # Group skills
        categories: Dict[str, List[Dict[str, Any]]] = {}
        for s in skills_list:
            cat = s.get("category", "General Technical Competencies")
            categories.setdefault(cat, []).append(s)

        skills_pdf_html = ""
        for cat_name, cat_skills in categories.items():
            skills_str = ", ".join([f"{s['skill_name']} ({s['skill_id']})" for s in cat_skills])
            skills_pdf_html += f"""
            <div style="margin-bottom: 5px; font-size: 9.5pt;">
                <strong>{cat_name}:</strong> {skills_str}
            </div>
            """

        certs_pdf_html = ""
        for idx, cert in enumerate(certs, start=1):
            cert_id = cert.get("certificate_id") or "VERIFIED-CREDENTIAL"
            skills_str = ", ".join(cert.get("skills_extracted", []))
            certs_pdf_html += f"""
            <tr style="border-bottom: 1px solid #e2e8f0; font-size: 9pt;">
                <td style="padding: 4px;"><strong>{cert['document_name']}</strong><br/><span style="color: #666; font-size: 8pt;">Skills: {skills_str}</span></td>
                <td style="padding: 4px; font-family: monospace;">{cert_id}</td>
                <td style="padding: 4px; color: #15803d; font-weight: bold;">AUTHENTICATED</td>
            </tr>
            """

        projects_pdf_html = ""
        for proj in projects:
            tech_str = ", ".join(proj.get("technologies", []))
            projects_pdf_html += f"""
            <div style="margin-bottom: 6px;">
                <p><strong>{proj['title']}</strong></p>
                <p style="font-size: 9.5pt; color: #333;">{proj.get('description', '')}</p>
                <p style="font-size: 8.5pt; color: #2563eb;">Tech Stack: {tech_str}</p>
            </div>
            """

        edu_pdf_html = ""
        for edu in education:
            edu_pdf_html += f"""
            <div style="margin-bottom: 5px; font-size: 9.5pt;">
                <strong>{edu['degree']}</strong> — {edu['institution']} ({edu.get('year', '')}) | Score: <strong>{edu.get('score', '')}</strong>
            </div>
            """

        now_str = datetime.utcnow().strftime("%d %B %Y")

        html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page {{
            size: a4 portrait;
            margin: 1.2cm;
        }}
        body {{
            font-family: Helvetica, Arial, sans-serif;
            font-size: 10pt;
            color: #1a202c;
            line-height: 1.35;
        }}
        .top {{
            border-bottom: 2px solid #0f172a;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }}
        h1 {{ font-size: 18pt; color: #0f172a; margin: 0; }}
        .title {{ font-size: 11pt; color: #2563eb; font-weight: bold; margin-top: 2px; }}
        .contact {{ font-size: 8.5pt; color: #475569; margin-top: 3px; }}
        .section-header {{
            font-size: 10.5pt;
            font-weight: bold;
            color: #0f172a;
            text-transform: uppercase;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 2px;
            margin-top: 10px;
            margin-bottom: 5px;
        }}
        .table {{ width: 100%; border-collapse: collapse; margin-top: 4px; }}
        .table th {{ background: #f1f5f9; text-align: left; padding: 4px; font-size: 8.5pt; color: #475569; }}
    </style>
</head>
<body>
    <div class="top">
        <h1>{p.get('full_name', 'Sanjay Krishna')}</h1>
        <div class="title">{p.get('headline', 'Computer Science & Engineering Specialist')} — [VERIFIED TALENT DOSSIER]</div>
        <div class="contact">
            {p.get('location', '')} | {p.get('email', '')} | {p.get('phone', '')} | Total Verified Skills: {len(skills_list)}
        </div>
    </div>

    <div class="section-header">1. Verified Skill Matrix (Taxonomy Anchored)</div>
    {skills_pdf_html if skills_pdf_html else '<p>No skills recorded.</p>'}

    <div class="section-header">2. Official Certificate Credentials & Provenance</div>
    <table class="table">
        <thead>
            <tr>
                <th>Certificate & Extracted Competencies</th>
                <th>Credential ID</th>
                <th>Verification</th>
            </tr>
        </thead>
        <tbody>
            {certs_pdf_html if certs_pdf_html else '<tr><td colspan="3">No certificates logged.</td></tr>'}
        </tbody>
    </table>

    <div class="section-header">3. Applied Technical Projects</div>
    {projects_pdf_html}

    <div class="section-header">4. Academic Background</div>
    {edu_pdf_html}

    <div style="margin-top: 15px; border-top: 1px dashed #cbd5e1; padding-top: 6px; font-size: 8pt; color: #64748b;">
        SkillSync Verified Company Portfolio • Authenticated on {now_str} • Ref: SS-PORT-{portfolio.get('user_id', 'user')}
    </div>
</body>
</html>
"""
        return html

    @classmethod
    def generate_portfolio_pdf_bytes(cls, portfolio: Dict[str, Any]) -> bytes:
        """Converts company portfolio into binary PDF bytes."""
        pdf_html = cls.render_pdf_html(portfolio)
        pdf_buffer = io.BytesIO()
        pisa_status = pisa.CreatePDF(pdf_html, dest=pdf_buffer)
        if pisa_status.err:
            raise RuntimeError(f"Portfolio PDF generation error {pisa_status.err}")
        return pdf_buffer.getvalue()
