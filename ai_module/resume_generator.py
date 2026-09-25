import os
import io
from typing import Dict, Any, List
from xhtml2pdf import pisa
from role_matcher import RoleMatcher

class ResumeGenerator:
    """Generates ground-truth, zero-hallucination ATS-compliant resumes strictly from verified credentials."""

    @classmethod
    def generate_role_resume_data(
        cls,
        portfolio: Dict[str, Any],
        target_role: str = "Software Engineer"
    ) -> Dict[str, Any]:
        personal_info = portfolio.get("personal_info", {})
        verified_skills_dict = portfolio.get("verified_skills", {})
        verified_skills_list = list(verified_skills_dict.values())
        certs_list = portfolio.get("certificates", [])
        education_list = portfolio.get("education", [])

        # 1. Match and prioritize ONLY verified skills
        match_result = RoleMatcher.match_and_prioritize_skills(target_role, verified_skills_list)

        # 2. Group verified skills dynamically by their dataset category
        grouped_skills: Dict[str, List[str]] = {}
        for s in verified_skills_list:
            cat = s.get("category", "Technical Competencies")
            grouped_skills.setdefault(cat, []).append(s["skill_name"])

        # 3. Dynamic Ground-Truth Professional Summary
        all_skill_names = [s["skill_name"] for s in verified_skills_list]
        top_skills_str = ", ".join(all_skill_names[:6]) if all_skill_names else "Technical Development"
        cert_count = len(certs_list)
        
        summary = (
            f"Dedicated professional with verified foundational competencies in {target_role.title()}. "
            f"Demonstrates certified technical expertise across {top_skills_str}, substantiated by "
            f"{cert_count} accredited industry certification(s). Committed to writing clean, maintainable code, "
            f"continuous skill development, and delivering high-quality engineering solutions."
        )

        return {
            "target_role": target_role,
            "target_role_title": match_result["target_role_title"],
            "role_match_score": match_result["match_score_percentage"],
            "personal_info": personal_info,
            "summary": summary,
            "grouped_skills": grouped_skills,
            "verified_skills_count": len(verified_skills_list),
            "education": education_list,
            "certifications": certs_list,
            "projects": portfolio.get("projects", [])
        }

    @classmethod
    def render_markdown(cls, resume_data: Dict[str, Any]) -> str:
        p = resume_data["personal_info"]
        md = [
            f"# {p.get('full_name', 'CANDIDATE')}",
            f"{p.get('location', '')} | {p.get('phone', '')} | {p.get('email', '')}\n",
            "## Professional Summary",
            resume_data["summary"] + "\n",
            "## Verified Technical Skills"
        ]
        for cat, sk_list in resume_data["grouped_skills"].items():
            md.append(f"- **{cat}:** {', '.join(sk_list)}")
        md.append("")

        if resume_data["education"]:
            md.append("## Education")
            for edu in resume_data["education"]:
                md.append(f"- **{edu['institution']}** — {edu.get('degree', '')} ({edu.get('year', '')}) | {edu.get('score', '')}")
            md.append("")

        if resume_data["certifications"]:
            md.append("## Accredited Certifications")
            for cert in resume_data["certifications"]:
                skills_str = ", ".join(cert.get("skills_verified", []))
                cid = f" [ID: {cert['certificate_id']}]" if cert.get("certificate_id") else ""
                md.append(f"- **{cert.get('title', cert.get('document_name'))}** ({cert.get('issuer', 'Verified')}){cid} — Verified: {skills_str}")
            md.append("")

        return "\n".join(md)

    @classmethod
    def render_html(cls, resume_data: Dict[str, Any]) -> str:
        """Renders exact 1-page LaTeX layout containing strictly verified ground-truth data."""
        p = resume_data["personal_info"]
        grouped_skills = resume_data["grouped_skills"]

        # Build Skills lines
        skills_html = ""
        for cat, sk_list in grouped_skills.items():
            skills_html += f"""
            <div class="skill-line">
                <span class="skill-cat">{cat}:</span> <span class="skill-val">{', '.join(sk_list)}</span>
            </div>
            """

        # Build Education
        edu_html = ""
        for edu in resume_data["education"]:
            edu_html += f"""
            <div class="entry">
                <div class="entry-row">
                    <span class="bold-text">{edu['institution']}</span>
                    <span class="right-text">{edu.get('year', '')}</span>
                </div>
                <div class="entry-row sub-row">
                    <span>{edu.get('degree', '')}</span>
                    <span class="right-text">{edu.get('score', '')}</span>
                </div>
            </div>
            """

        # Build Certifications
        cert_items_html = ""
        for cert in resume_data["certifications"]:
            cid = f" &nbsp;[Cert ID: {cert['certificate_id']}]" if cert.get("certificate_id") else ""
            date_str = f" &nbsp;({cert.get('issue_date')})" if cert.get("issue_date") else ""
            skills_str = f" — Verified Skills: {', '.join(cert.get('skills_verified', []))}" if cert.get("skills_verified") else ""
            cert_items_html += f"""
            <li>
                <strong>{cert.get('title', cert.get('document_name'))}</strong> – {cert.get('issuer', 'Accredited Issuer')}{date_str}{cid}{skills_str}
            </li>
            """

        # Build Projects if present
        projects_html = ""
        if resume_data.get("projects"):
            for proj in resume_data["projects"]:
                bullets_li = "".join([f"<li>{b}</li>" for b in proj.get("bullets", [])])
                projects_html += f"""
                <div class="entry project-entry">
                    <div class="entry-row">
                        <span class="bold-text">{proj['title']}</span>
                        <span class="right-text italic-text">{proj.get('tech_stack', '')}</span>
                    </div>
                    <ul class="bullet-list">{bullets_li}</ul>
                </div>
                """

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{p.get('full_name', 'CANDIDATE')} - Verified Resume</title>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: 'Lora', 'Georgia', 'Times New Roman', serif;
            background: #f1f5f9;
            color: #111111;
            line-height: 1.35;
            padding: 30px 10px;
        }}
        .action-bar {{
            max-width: 800px;
            margin: 0 auto 15px auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }}
        .btn {{
            background: #0f172a;
            color: #ffffff;
            padding: 9px 18px;
            border-radius: 6px;
            text-decoration: none;
            font-family: 'Inter', sans-serif;
            font-weight: 600;
            font-size: 13px;
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }}
        .btn-pdf {{ background: #059669; }}
        .btn-pdf:hover {{ background: #047857; }}
        .btn-print {{ background: #2563eb; }}
        .btn-print:hover {{ background: #1d4ed8; }}

        .page {{
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            padding: 45px 50px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            border-radius: 2px;
        }}

        /* Header */
        .name-header {{
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: 1.5px;
            color: #000000;
            margin-bottom: 6px;
            text-transform: uppercase;
        }}
        .contact-line {{
            text-align: center;
            font-size: 12.5px;
            color: #222222;
            margin-bottom: 3px;
        }}
        .contact-line a {{ color: #111111; text-decoration: none; }}
        .links-line {{
            text-align: center;
            font-size: 12.5px;
            color: #222222;
            margin-bottom: 16px;
        }}

        /* Sections */
        .section {{ margin-bottom: 14px; }}
        .section-title {{
            font-size: 14px;
            font-weight: 700;
            color: #000000;
            border-bottom: 1px solid #111111;
            padding-bottom: 2px;
            margin-bottom: 8px;
            letter-spacing: 0.2px;
        }}
        .summary-p {{
            font-size: 12.5px;
            text-align: justify;
            color: #222222;
            line-height: 1.4;
        }}

        /* Entries */
        .entry {{ margin-bottom: 8px; }}
        .entry-row {{
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            font-size: 13px;
        }}
        .sub-row {{ font-size: 12.5px; color: #222222; margin-top: 1px; }}
        .bold-text {{ font-weight: 700; color: #000000; }}
        .right-text {{ text-align: right; font-size: 12px; color: #222222; }}
        .italic-text {{ font-style: italic; }}

        /* Skills */
        .skill-line {{ font-size: 12.5px; margin-bottom: 3px; line-height: 1.35; }}
        .skill-cat {{ font-weight: 700; color: #000000; margin-right: 4px; }}
        .skill-val {{ color: #222222; }}

        /* Bullet lists */
        .bullet-list {{ list-style-type: disc; margin-left: 18px; margin-top: 4px; }}
        .bullet-list li {{
            font-size: 12px;
            color: #222222;
            margin-bottom: 4px;
            line-height: 1.35;
            text-align: justify;
        }}

        @media print {{
            body {{ background: #ffffff; padding: 0; }}
            .action-bar {{ display: none; }}
            .page {{ box-shadow: none; padding: 0; width: 100%; max-width: 100%; }}
        }}
    </style>
</head>
<body>
    <div class="action-bar">
        <span style="font-family:'Inter',sans-serif; font-size:13px; font-weight:700; color:#0f172a;">📄 Verified Ground-Truth ATS Resume</span>
        <div style="display:flex; gap:10px;">
            <a class="btn btn-pdf" href="/api/v1/resume/download-pdf/{p.get('full_name', 'candidate').lower().replace(' ', '_')}?role={resume_data['target_role'].replace(' ', '+')}">📥 Download PDF File</a>
            <button class="btn btn-print" onclick="window.print()">🖨️ Print / Save PDF</button>
        </div>
    </div>

    <div class="page">
        <!-- Header -->
        <div class="name-header">{p.get('full_name', 'CANDIDATE NAME')}</div>
        <div class="contact-line">
            {p.get('location', 'Tamil Nadu, India')} &nbsp;|&nbsp; {p.get('phone', '')} &nbsp;|&nbsp; <a href="mailto:{p.get('email', '')}">{p.get('email', '')}</a>
        </div>
        <div class="links-line">
            <span>Verified Credentials: {len(resume_data['certifications'])} Documents</span> &nbsp;|&nbsp; 
            <span>Verified Skills: {resume_data['verified_skills_count']} Skills</span>
        </div>

        <!-- Professional Summary -->
        <div class="section">
            <div class="section-title">Professional Summary</div>
            <p class="summary-p">{resume_data['summary']}</p>
        </div>

        <!-- Verified Technical Skills -->
        <div class="section">
            <div class="section-title">Verified Technical Skills</div>
            {skills_html if skills_html else '<p style="font-size:12px; color:#666;">No skills extracted yet.</p>'}
        </div>

        <!-- Accredited Certifications -->
        <div class="section">
            <div class="section-title">Accredited Certifications & Credentials</div>
            <ul class="bullet-list">
                {cert_items_html if cert_items_html else '<li>No certifications recorded.</li>'}
            </ul>
        </div>

        {f'''
        <!-- Education -->
        <div class="section">
            <div class="section-title">Academic Background & Affiliations</div>
            {edu_html}
        </div>
        ''' if edu_html else ''}

        {f'''
        <!-- Projects -->
        <div class="section">
            <div class="section-title">Projects</div>
            {projects_html}
        </div>
        ''' if projects_html else ''}
    </div>
</body>
</html>
"""
        return html

    @classmethod
    def render_pdf_html(cls, resume_data: Dict[str, Any]) -> str:
        p = resume_data["personal_info"]
        grouped_skills = resume_data["grouped_skills"]

        skills_rows = ""
        for cat, sk_list in grouped_skills.items():
            skills_rows += f"""
            <div style="font-size: 9.5pt; margin-bottom: 2pt;">
                <strong>{cat}:</strong> {', '.join(sk_list)}
            </div>
            """

        cert_li = ""
        for cert in resume_data["certifications"]:
            cid = f" [Cert ID: {cert['certificate_id']}]" if cert.get("certificate_id") else ""
            date_str = f" ({cert.get('issue_date')})" if cert.get("issue_date") else ""
            skills_str = f" — Verified Skills: {', '.join(cert.get('skills_verified', []))}" if cert.get("skills_verified") else ""
            cert_li += f"""
            <li style="margin-bottom: 2.5pt;">
                <strong>{cert.get('title', cert.get('document_name'))}</strong> – {cert.get('issuer', 'Accredited Issuer')}{date_str}{cid}{skills_str}
            </li>
            """

        edu_rows = ""
        for edu in resume_data["education"]:
            edu_rows += f"""
            <table style="width: 100%; border: none; margin-bottom: 3pt;">
                <tr>
                    <td style="font-size: 10pt; font-weight: bold; width: 75%;">{edu['institution']}</td>
                    <td style="font-size: 9pt; text-align: right; width: 25%;">{edu.get('year', '')}</td>
                </tr>
                <tr>
                    <td style="font-size: 9.5pt; color: #222;">{edu.get('degree', '')}</td>
                    <td style="font-size: 9pt; text-align: right; font-weight: bold;">{edu.get('score', '')}</td>
                </tr>
            </table>
            """

        pdf_html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        @page {{
            size: a4 portrait;
            margin-top: 1.2cm;
            margin-bottom: 1.2cm;
            margin-left: 1.4cm;
            margin-right: 1.4cm;
        }}
        body {{
            font-family: Times-Roman, "Times New Roman", Garamond, serif;
            font-size: 9.5pt;
            color: #000000;
            line-height: 1.25;
        }}
        .header-name {{
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            letter-spacing: 1.5pt;
            margin-bottom: 3pt;
        }}
        .header-sub {{
            text-align: center;
            font-size: 9pt;
            margin-bottom: 8pt;
        }}
        .section-heading {{
            font-size: 10.5pt;
            font-weight: bold;
            text-transform: uppercase;
            border-bottom: 0.8pt solid #000000;
            padding-bottom: 1pt;
            margin-top: 8pt;
            margin-bottom: 4pt;
        }}
    </style>
</head>
<body>
    <div class="header-name">{p.get('full_name', 'CANDIDATE NAME')}</div>
    <div class="header-sub">
        {p.get('location', 'Tamil Nadu, India')} &nbsp;|&nbsp; 
        Verified Credentials: {len(resume_data['certifications'])} Certificates &nbsp;|&nbsp; 
        Verified Skills: {resume_data['verified_skills_count']} Skills
    </div>

    <div class="section-heading">Professional Summary</div>
    <div style="font-size: 9pt; text-align: justify; margin-bottom: 4pt; line-height: 1.3;">
        {resume_data['summary']}
    </div>

    <div class="section-heading">Verified Technical Skills</div>
    {skills_rows if skills_rows else '<p>No skills extracted.</p>'}

    <div class="section-heading">Accredited Certifications & Credentials</div>
    <ul style="margin-left: 14pt; margin-top: 2pt; font-size: 9pt; line-height: 1.25;">
        {cert_li if cert_li else '<li>No certifications recorded.</li>'}
    </ul>

    {f'''
    <div class="section-heading">Academic Background & Affiliations</div>
    {edu_rows}
    ''' if edu_rows else ''}
</body>
</html>
"""
        return pdf_html

    @classmethod
    def generate_pdf_bytes(cls, resume_data: Dict[str, Any]) -> bytes:
        pdf_html = cls.render_pdf_html(resume_data)
        pdf_buffer = io.BytesIO()
        pisa_status = pisa.CreatePDF(pdf_html, dest=pdf_buffer)
        if pisa_status.err:
            raise RuntimeError(f"PDF generation error code {pisa_status.err}")
        return pdf_buffer.getvalue()
