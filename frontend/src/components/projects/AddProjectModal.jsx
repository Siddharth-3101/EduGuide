import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { projectApi } from '../../services/api/projectApi';
import {
  X,
  FolderGit2,
  GitBranch,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Code2,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddProjectModal = ({ isOpen, onClose, onProjectAdded }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    githubRepoUrl: '',
    liveDemoUrl: '',
    skillsUsed: '',
    projectType: 'Backend API'
  });

  const [step, setStep] = useState('input'); // 'input' | 'analyzing' | 'result'
  const [analyzingProgress, setAnalyzingProgress] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAnalyzeAndSubmit = async (e) => {
    e.preventDefault();
    if (!formData.githubRepoUrl || !formData.projectName) {
      setError('Please provide a Project Name and GitHub Repository URL.');
      return;
    }

    setError(null);
    setStep('analyzing');
    setAnalyzingProgress([]);

    const stepsSequence = [
      'Repository found',
      'README retrieved',
      'Project structure analyzed',
      'Technologies detected',
      'Skills mapped'
    ];

    for (let i = 0; i < stepsSequence.length; i++) {
      await new Promise((r) => setTimeout(r, 380));
      setAnalyzingProgress((prev) => [...prev, stepsSequence[i]]);
    }

    try {
      const result = await projectApi.analyzeProject(formData.githubRepoUrl);
      setAnalysisResult(result);

      // Create project in background
      const created = await projectApi.addProject({
        ...formData,
        detectedTechnologies: result.technologies,
        detectedSkills: result.skills
      });

      if (onProjectAdded) {
        onProjectAdded(created);
      }
      setStep('result');
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please check the repository URL and try again.');
      setStep('input');
    }
  };

  const handlePrefillSample = () => {
    setFormData({
      projectName: 'Student Management API',
      description: 'Production RESTful service with FastAPI, PostgreSQL relational modeling, Dockerized container deployment, and JWT authentication.',
      githubRepoUrl: 'https://github.com/example/student-management-api',
      liveDemoUrl: 'https://api.students-portal.example',
      skillsUsed: 'Python, FastAPI, PostgreSQL, Docker',
      projectType: 'Backend API'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-2xl text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-current/10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)]">
              <FolderGit2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-editorial-title text-xl font-bold uppercase tracking-tight">
                Add Project Evidence
              </h2>
              <p className="text-xs opacity-70">
                Submit a repository to extract practical evidence for skill verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-current/10 opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: FORM INPUT */}
        {step === 'input' && (
          <form onSubmit={handleAnalyzeAndSubmit} className="mt-5 space-y-4">
            <div className="flex justify-between items-center bg-current/5 p-3 rounded border border-current/10 text-xs">
              <span className="opacity-75">Need a quick test template?</span>
              <button
                type="button"
                onClick={handlePrefillSample}
                className="font-editorial-mono font-bold text-[var(--accent-terracotta)] hover:underline"
              >
                Prefill "Student Management API"
              </button>
            </div>

            {error && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-80 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  name="projectName"
                  required
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="e.g. Student Management API"
                  className="w-full px-3 py-2 text-xs rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
                />
              </div>

              <div>
                <label className="block text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-80 mb-1">
                  Project Type
                </label>
                <select
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
                >
                  <option value="Backend API">Backend API</option>
                  <option value="Full Stack App">Full Stack App</option>
                  <option value="DevOps / Cloud Infrastructure">DevOps / Cloud Infrastructure</option>
                  <option value="Distributed System">Distributed System</option>
                  <option value="Data Pipeline">Data Pipeline</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-80 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief summary of architecture, endpoints, and deployment setup..."
                className="w-full px-3 py-2 text-xs rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-80 mb-1">
                  GitHub Repository URL *
                </label>
                <input
                  type="url"
                  name="githubRepoUrl"
                  required
                  value={formData.githubRepoUrl}
                  onChange={handleInputChange}
                  placeholder="https://github.com/example/project"
                  className="w-full px-3 py-2 text-xs font-mono rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
                />
              </div>

              <div>
                <label className="block text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-80 mb-1">
                  Live Demo URL (Optional)
                </label>
                <input
                  type="url"
                  name="liveDemoUrl"
                  value={formData.liveDemoUrl}
                  onChange={handleInputChange}
                  placeholder="https://demo.example.com"
                  className="w-full px-3 py-2 text-xs font-mono rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-80 mb-1">
                Skills Used (Comma-separated)
              </label>
              <input
                type="text"
                name="skillsUsed"
                value={formData.skillsUsed}
                onChange={handleInputChange}
                placeholder="Python, FastAPI, PostgreSQL, Docker"
                className="w-full px-3 py-2 text-xs rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
              />
            </div>

            {/* Privacy notice banner */}
            <div className="p-3 rounded border border-current/15 bg-current/5 text-[11px] opacity-75 flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[var(--accent-terracotta)] mt-0.5" />
              <span>
                "Your documents and repositories are used strictly to analyze your career profile and evidence. Do not submit repositories containing private production secrets or API keys."
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-current/10">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                iconRight={Sparkles}
              >
                Analyze GitHub Project
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: ANALYZING SIMULATION */}
        {step === 'analyzing' && (
          <div className="py-8 space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] animate-pulse">
              <Search className="h-7 w-7" />
            </div>

            <div>
              <h3 className="font-editorial-title text-xl font-bold uppercase tracking-tight">
                Analyzing Repository...
              </h3>
              <p className="text-xs opacity-70 font-mono mt-1 truncate max-w-md mx-auto">
                {formData.githubRepoUrl}
              </p>
            </div>

            <div className="max-w-sm mx-auto text-left space-y-2.5 p-4 rounded border border-current/15 bg-current/5 text-xs font-editorial-mono">
              {[
                'Repository found',
                'README retrieved',
                'Project structure analyzed',
                'Technologies detected',
                'Skills mapped'
              ].map((item) => {
                const isComplete = analyzingProgress.includes(item);
                return (
                  <div
                    key={item}
                    className={`flex items-center gap-2.5 transition-all ${
                      isComplete ? 'opacity-100 text-emerald-600 dark:text-emerald-400 font-bold' : 'opacity-40'
                    }`}
                  >
                    <CheckCircle2
                      className={`h-4 w-4 ${isComplete ? 'text-emerald-500' : 'text-current/30'}`}
                    />
                    <span>{isComplete ? `✓ ${item}` : item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: ANALYSIS RESULT & PROJECT -> SKILL CONNECTION */}
        {step === 'result' && analysisResult && (
          <div className="mt-5 space-y-5">
            <div className="p-4 rounded border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span className="font-bold">Project Analysis Complete — Evidence Extracted</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] font-editorial-mono uppercase font-bold">
                Evidence Identified
              </span>
            </div>

            {/* Detected Technologies & Skills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded border border-current/15 bg-current/5 space-y-2">
                <span className="text-[11px] font-editorial-mono font-bold uppercase tracking-wider opacity-70 block">
                  Detected Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-[var(--card-surface)] border border-current/20 text-xs font-editorial-mono font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded border border-current/15 bg-current/5 space-y-2">
                <span className="text-[11px] font-editorial-mono font-bold uppercase tracking-wider opacity-70 block">
                  Detected Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded bg-[var(--card-surface)] border border-current/20 text-xs font-editorial-mono font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Project -> Skill Connection Card */}
            <div className="p-4 rounded border border-[var(--border-line)] bg-[var(--bg-page)] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-editorial-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
                  Project → Skill Connection
                </span>
                <span className="text-[10px] opacity-70 italic font-editorial-serif">
                  "Projects provide evidence, assessments verify competency."
                </span>
              </div>

              {analysisResult.evidence.map((ev, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded border border-current/10 bg-[var(--card-surface)] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-editorial-title">{ev.skill}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-editorial-mono text-[10px] font-bold">
                        🟡 {ev.status}
                      </span>
                    </div>
                    <p className="opacity-70 text-[11px]">
                      <strong>Evidence:</strong> {formData.projectName} • <strong>Source:</strong> {ev.source}
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        onClose();
                        if (ev.assessmentRoute) {
                          navigate(ev.assessmentRoute);
                        }
                      }}
                      className="text-xs"
                      iconRight={ArrowRight}
                    >
                      {ev.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-current/10">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  setStep('input');
                }}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
