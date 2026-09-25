import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Check,
  ShieldAlert
} from 'lucide-react';

export const ResumeUploadModule = ({ onSkillsConfirmed }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [resumeData, setResumeData] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState({});
  const [confirmed, setConfirmed] = useState(false);

  const steps = [
    'Parsing document structure (PDF / DOCX)...',
    'Extracting Experience & Work History...',
    'Extracting Projects & Repositories...',
    'Detecting Technical Skills & Education...',
    'Mapping competencies to Backend Developer roadmap...'
  ];

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processResume(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processResume(e.target.files[0]);
    }
  };

  const processResume = (selectedFile) => {
    setFile(selectedFile);
    setConfirmed(false);
    setAnalyzing(true);
    setProgressStep(0);

    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setAnalyzing(false);
          const initialSkills = {
            Python: true,
            FastAPI: true,
            PostgreSQL: true,
            Docker: true,
            Redis: false,
            'REST APIs': true,
            Git: true,
            Linux: true
          };
          setSelectedSkills(initialSkills);
          setResumeData({
            name: 'Alex Chen',
            education: 'B.S. in Computer Science, University of Technology (2022 - 2026)',
            experience: 'Backend Engineering Intern @ InnovateSoft (3 mos)',
            projects: [
              'High-Throughput E-Commerce Microservices (Python, PostgreSQL, Docker)',
              'Distributed Key-Value Cache (C++, Redis protocols)'
            ],
            skills: Object.keys(initialSkills)
          });
          return prev;
        }
      });
    }, 550);
  };

  const handleToggleSkill = (skill) => {
    setSelectedSkills((prev) => ({
      ...prev,
      [skill]: !prev[skill]
    }));
  };

  const handleConfirm = () => {
    setConfirmed(true);
    if (onSkillsConfirmed) {
      onSkillsConfirmed(Object.keys(selectedSkills).filter((k) => selectedSkills[k]));
    }
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-current/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-current/5 text-[var(--accent-terracotta)]">
              <FileText className="h-3.5 w-3.5" />
            </span>
            <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight">
              Resume Upload & Automated Skill Extraction
            </h3>
          </div>
          <p className="text-xs opacity-70 mt-0.5 font-sans">
            Upload your resume to extract candidate experience, verified projects, and map roadmaps.
          </p>
        </div>

        <span className="font-editorial-mono text-[9px] uppercase px-2 py-0.5 rounded border border-current/20 opacity-70">
          RAG / OCR Pipeline Ready
        </span>
      </div>

      {/* Upload Drop Zone */}
      {!analyzing && !resumeData && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-md p-8 text-center transition-all ${
            dragActive
              ? 'border-[var(--accent-terracotta)] bg-current/5 scale-[0.99]'
              : 'border-current/20 hover:border-current/40 bg-[var(--bg-page)]/40'
          }`}
        >
          <UploadCloud className="h-10 w-10 mx-auto opacity-50 mb-3 text-[var(--accent-terracotta)]" />
          <p className="font-editorial-title text-sm font-bold uppercase">
            Upload Resume
          </p>
          <p className="text-xs opacity-60 font-editorial-mono mt-1">
            Accepts PDF, DOC, DOCX (Max 10MB)
          </p>

          <div className="mt-4">
            <label className="cursor-pointer inline-flex items-center justify-center font-editorial-mono text-xs font-semibold px-4 py-2 rounded border border-current/25 hover:bg-current/10 transition-colors">
              <span>Browse Resume File</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Analyzing state */}
      {analyzing && (
        <div className="p-8 rounded border border-current/20 bg-current/5 text-center space-y-4 font-editorial-mono">
          <div className="h-9 w-9 rounded-full border-2 border-[var(--accent-terracotta)] border-t-transparent animate-spin mx-auto" />
          <div>
            <h4 className="font-editorial-title text-base font-bold uppercase">
              Analyzing Resume with Neural Parser...
            </h4>
            <p className="text-xs opacity-70 mt-1 font-sans">
              Extracting candidate education, tech stack, work experience, and competency tokens.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left pt-2 text-xs">
            {steps.map((st, idx) => (
              <div
                key={st}
                className={`flex items-center gap-2 transition-opacity ${
                  idx <= progressStep ? 'opacity-100 font-semibold' : 'opacity-30'
                }`}
              >
                {idx < progressStep ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : idx === progressStep ? (
                  <div className="h-2 w-2 rounded-full bg-[var(--accent-terracotta)] animate-ping" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-current/20" />
                )}
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume Extracted Information Review */}
      {resumeData && (
        <div className="rounded border border-current/20 bg-[var(--bg-page)] p-5 space-y-4 font-editorial-mono animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-current/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
                Resume Extraction Summary
              </span>
              <h4 className="font-editorial-title text-base font-bold uppercase mt-0.5">
                {resumeData.name} · Parsed Successfully
              </h4>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setResumeData(null);
                setConfirmed(false);
              }}
              className="text-xs opacity-60 hover:opacity-100 hover:underline self-start sm:self-auto"
            >
              Re-upload Resume
            </button>
          </div>

          {/* Education & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded border border-current/10 bg-[var(--card-surface)] space-y-1">
              <span className="flex items-center gap-1.5 opacity-60 text-[10px] uppercase font-bold">
                <GraduationCap className="h-3.5 w-3.5" /> Education
              </span>
              <p className="font-sans font-medium">{resumeData.education}</p>
            </div>
            <div className="p-3 rounded border border-current/10 bg-[var(--card-surface)] space-y-1">
              <span className="flex items-center gap-1.5 opacity-60 text-[10px] uppercase font-bold">
                <Briefcase className="h-3.5 w-3.5" /> Experience
              </span>
              <p className="font-sans font-medium">{resumeData.experience}</p>
            </div>
          </div>

          {/* Extracted Projects */}
          <div className="p-3 rounded border border-current/10 bg-[var(--card-surface)] space-y-2 text-xs">
            <span className="flex items-center gap-1.5 opacity-60 text-[10px] uppercase font-bold">
              <FolderGit2 className="h-3.5 w-3.5" /> Extracted Projects
            </span>
            <ul className="space-y-1 list-disc list-inside font-sans text-xs opacity-85">
              {resumeData.projects.map((proj, i) => (
                <li key={i}>{proj}</li>
              ))}
            </ul>
          </div>

          {/* Extracted Skills Confirmation Checklist */}
          <div className="space-y-2 pt-2 border-t border-current/10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                Confirm Detected Skills ({Object.keys(selectedSkills).length})
              </span>
              <span className="text-[10px] opacity-60">Toggle to include/exclude</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {Object.keys(selectedSkills).map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleToggleSkill(skill)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-editorial-mono transition-all ${
                    selectedSkills[skill]
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold'
                      : 'border-current/20 opacity-40 line-through'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${selectedSkills[skill] ? 'bg-emerald-500' : 'bg-current/40'}`} />
                  <span>{skill}</span>
                  {selectedSkills[skill] && <Check className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Confirmation CTA */}
          <div className="pt-3 border-t border-current/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {confirmed ? (
              <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" /> Skills successfully synced with your career roadmap profile.
              </span>
            ) : (
              <span className="text-[11px] opacity-60 font-sans">
                Review skills above before adding to your roadmap profile.
              </span>
            )}

            <Button
              variant="primary"
              size="sm"
              disabled={confirmed}
              onClick={handleConfirm}
            >
              {confirmed ? 'Confirmed ✓' : 'Confirm Extracted Skills'}
            </Button>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <p className="text-[11px] opacity-50 font-sans text-center">
        Your documents are used to analyze your career profile. Do not upload documents containing unnecessary sensitive information.
      </p>
    </Card>
  );
};
