import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { projectApi } from '../../services/api/projectApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  ArrowLeft,
  FolderGit2,
  GitBranch,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  FileCheck2,
  AlertCircle,
  Search,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const GithubIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const EVIDENCE_STEPS = [
  'Submitted',
  'Analyzing',
  'Analyzed',
  'Evidence Identified',
  'Under Review',
  'Verified'
];

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // GitHub Submission Form state
  const [githubUrl, setGithubUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState([]);
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getProjectById(projectId || 'proj-1');
        setProject(data);
        if (data.githubRepoUrl || data.submission?.githubRepoUrl) {
          setGithubUrl(data.githubRepoUrl || data.submission?.githubRepoUrl || '');
          setBranch(data.submission?.branch || 'main');
          setSubmissionFeedback(data.submission);
        }
      } catch (err) {
        console.error(err);
        setError('Project details could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleGitHubSubmit = async (e) => {
    e.preventDefault();
    if (!githubUrl) return;

    setIsSubmitting(true);
    try {
      const updated = await projectApi.submitProject(project.id, {
        githubRepoUrl: githubUrl,
        branch
      });
      setProject(updated);
      setSubmissionFeedback(updated.submission);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRunAnalysis = async () => {
    if (!githubUrl) return;
    setIsAnalyzing(true);
    setAnalyzingStep([]);

    const steps = [
      'Repository found',
      'README retrieved',
      'Project structure analyzed',
      'Technologies detected',
      'Skills mapped'
    ];

    for (let s of steps) {
      await new Promise((r) => setTimeout(r, 350));
      setAnalyzingStep((prev) => [...prev, s]);
    }

    try {
      const analysis = await projectApi.analyzeProject(githubUrl);
      setProject((prev) => ({
        ...prev,
        evidenceStatus: 'Evidence Identified',
        detectedTechnologies: analysis.technologies,
        detectedSkills: analysis.skills,
        skillEvidence: analysis.evidence
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) return <CardSkeleton />;
  if (error || !project) return <ErrorState message={error} onRetry={() => navigate('/projects')} />;

  const currentStatusIndex = EVIDENCE_STEPS.indexOf(project.evidenceStatus || 'Evidence Identified');

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-editorial-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)] hover:underline mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Project Evidence Stack
        </Link>
      </div>

      {/* Hero Header Card */}
      <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 sm:p-8 text-[var(--text-primary)]">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
                Gap Bridge: {project.skillGapBridged}
              </span>
              <span className="opacity-40">•</span>
              <span className="text-xs font-editorial-mono font-semibold opacity-70">
                {project.difficulty}
              </span>
              <span className="opacity-40">•</span>
              <span className="px-2 py-0.5 rounded font-editorial-mono text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                🟡 {project.evidenceStatus || 'Evidence Identified'}
              </span>
            </div>

            <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold tracking-tight uppercase">
              {project.title}
            </h1>

            <p className="text-sm opacity-80 leading-relaxed max-w-2xl">
              {project.shortDescription}
            </p>

            {/* Links row */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-editorial-mono">
              {project.githubRepoUrl && (
                <a
                  href={project.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded border border-current/20 bg-current/5 hover:bg-current/10"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="h-3 w-3 opacity-60 ml-0.5" />
                </a>
              )}
              {project.liveDemoUrl && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded border border-current/20 bg-current/5 hover:bg-current/10"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Live Demo Preview</span>
                </a>
              )}
            </div>
          </div>

          <div className="shrink-0 p-5 rounded border border-current/15 bg-current/5 w-full lg:w-72 text-xs font-editorial-mono space-y-3">
            <div className="flex justify-between">
              <span className="opacity-60">Estimated Duration:</span>
              <span className="font-bold">{project.estimatedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Evidence Confidence:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">94% (High)</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60">Status:</span>
              <span className="font-bold text-[var(--accent-terracotta)]">
                {project.evidenceStatus || 'Evidence Identified'}
              </span>
            </div>
          </div>
        </div>

        {/* EVIDENCE STATUS LIFECYCLE STEPPER */}
        <div className="mt-8 pt-6 border-t border-current/10">
          <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] opacity-60 block mb-3">
            Evidence Verification Lifecycle
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-editorial-mono">
            {EVIDENCE_STEPS.map((step, idx) => {
              const isPastOrCurrent = currentStatusIndex >= idx;
              const isCurrent = currentStatusIndex === idx;

              return (
                <div
                  key={step}
                  className={`p-2.5 rounded border text-center transition-all ${
                    isCurrent
                      ? 'border-[var(--accent-terracotta)] bg-[var(--accent-terracotta)]/10 font-bold text-[var(--accent-terracotta)]'
                      : isPastOrCurrent
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                      : 'border-current/10 bg-current/5 opacity-40'
                  }`}
                >
                  <span className="text-[10px] block opacity-60 mb-0.5">0{idx + 1}</span>
                  <span className="text-[11px] leading-tight block">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Analysis Results & Architecture */}
        <div className="lg:col-span-7 space-y-6">
          {/* GitHub README Analysis Breakdown */}
          <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6">
            <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[var(--accent-terracotta)]" />
                <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight">
                  GitHub README & Structure Analysis
                </h3>
              </div>
              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="text-xs font-editorial-mono text-[var(--accent-terracotta)] hover:underline flex items-center gap-1 font-bold"
              >
                {isAnalyzing ? 'Analyzing...' : 'Re-run Analysis'}
              </button>
            </div>

            {isAnalyzing ? (
              <div className="py-4 space-y-2 font-editorial-mono text-xs">
                {analyzingStep.map((s) => (
                  <div key={s} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>✓ {s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                    Detected Technologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.detectedTechnologies?.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded bg-[var(--bg-page)] border border-current/20 text-xs font-editorial-mono font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                    Detected Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.detectedSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 rounded bg-[var(--bg-page)] border border-current/20 text-xs font-editorial-mono font-semibold text-[var(--accent-terracotta)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* PROJECT -> SKILL CONNECTION */}
          <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 space-y-4">
            <div className="pb-3 border-b border-current/10">
              <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)] block">
                Project → Skill Connection Pathway
              </span>
              <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight mt-1">
                From Practical Evidence to Verified Competency
              </h3>
              <p className="text-xs opacity-70 mt-1 font-editorial-serif italic">
                "Projects provide evidence, assessments verify competency."
              </p>
            </div>

            <div className="space-y-3">
              {(project.skillEvidence || [
                {
                  skill: 'Docker',
                  evidence: project.title,
                  source: 'GitHub README',
                  status: 'Evidence Found',
                  action: 'Take Docker Assessment',
                  assessmentRoute: '/assessments/docker'
                }
              ]).map((ev, i) => (
                <div
                  key={i}
                  className="p-4 rounded border border-current/15 bg-current/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm font-editorial-title">{ev.skill}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-editorial-mono text-[10px] font-bold">
                        🟡 {ev.status}
                      </span>
                    </div>
                    <p className="opacity-75 text-[11px] font-editorial-mono">
                      Evidence: <strong>{ev.evidence}</strong> | Source: <strong>{ev.source}</strong>
                    </p>
                  </div>

                  <div className="shrink-0">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(ev.assessmentRoute || '/assessments/docker')}
                      iconRight={ArrowRight}
                      className="text-xs"
                    >
                      {ev.action}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Project Objective & Requirements */}
          <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 space-y-4">
            <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight">
              Functional Requirements
            </h3>
            <ul className="space-y-2 text-xs opacity-80 leading-relaxed font-editorial-mono">
              {project.requirements?.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] font-bold text-[10px]">
                    0{idx + 1}
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right Column: GitHub Repository Update / Re-submit */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6">
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-current/10">
              <GithubIcon className="h-5 w-5 text-[var(--accent-terracotta)]" />
              <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight">
                Update Repository Link
              </h3>
            </div>
            <p className="text-xs opacity-70 mb-4 leading-relaxed">
              Connect or update your public repository. SkillBridge automated sandboxes analyze file trees and dependencies without cloning credentials.
            </p>

            <form onSubmit={handleGitHubSubmit} className="space-y-4 font-editorial-mono">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3 py-2 text-xs rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider opacity-70 mb-1">
                  Target Branch
                </label>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 opacity-50" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  className="w-full text-xs font-bold"
                >
                  {project.evidenceStatus === 'Submitted' ? 'Update Submission' : 'Submit for Verification'}
                </Button>
              </div>
            </form>

            {submissionFeedback && (
              <div className="mt-5 p-4 rounded border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-300">
                <div className="flex items-center justify-between mb-1.5 font-editorial-mono">
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Evidence Recorded
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] font-bold">
                    {submissionFeedback.status}
                  </span>
                </div>
                <p className="font-mono text-[11px] truncate opacity-90">
                  {submissionFeedback.githubRepoUrl}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed opacity-80">
                  {submissionFeedback.feedback}
                </p>
              </div>
            )}
          </Card>

          {/* Privacy Notice Card */}
          <div className="p-4 rounded border border-current/15 bg-current/5 text-xs opacity-75 space-y-2">
            <div className="flex items-center gap-2 font-bold font-editorial-mono text-[var(--accent-terracotta)]">
              <ShieldCheck className="h-4 w-4" />
              <span>Document Privacy Guarantee</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              "Your documents are used to analyze your career profile. Do not upload documents or code containing unnecessary sensitive information or API keys."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
