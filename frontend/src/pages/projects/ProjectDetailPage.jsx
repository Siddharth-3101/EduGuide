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
  AlertCircle
} from 'lucide-react';

const GithubIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

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
  const [submissionFeedback, setSubmissionFeedback] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getProjectById(projectId || 'proj-1');
        setProject(data);
        if (data.submission) {
          setGithubUrl(data.submission.githubRepoUrl || '');
          setBranch(data.submission.branch || 'main');
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

  if (loading) return <CardSkeleton />;
  if (error || !project) return <ErrorState message={error} onRetry={() => navigate('/projects')} />;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Gap-Bridging Projects
        </Link>
      </div>

      {/* Hero Header Card */}
      <Card className="bg-white border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Gap Bridge: {project.skillGapBridged}
              </span>
              <span>•</span>
              <Badge variant="blue">{project.difficulty}</Badge>
              {project.status === 'Submitted' && <Badge variant="verified">Submitted</Badge>}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {project.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed">
              {project.shortDescription}
            </p>

            {/* Skills Practiced */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Skills Practiced
              </span>
              <div className="flex flex-wrap gap-2">
                {project.skills?.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200/80"
                  >
                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="shrink-0 p-5 rounded-xl border border-slate-200 bg-slate-50 w-full lg:w-72 text-xs space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Duration:</span>
              <span className="font-semibold text-slate-800">{project.estimatedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Milestone Progress:</span>
              <span className="font-bold text-blue-600">{project.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Objective, Requirements, Suggested Architecture, Criteria */}
        <div className="lg:col-span-7 space-y-6">
          {/* Project Objective */}
          <Card className="bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Project Objective</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {project.objective}
            </p>
          </Card>

          {/* Requirements */}
          <Card className="bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Functional Requirements</h3>
            <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
              {project.requirements?.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-bold text-[11px] mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Suggested Architecture */}
          <Card className="bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Suggested Architecture</h3>
            <p className="text-xs text-slate-500 mb-3">
              Standard component hierarchy recommended for production-grade review.
            </p>
            <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
              {project.architecture}
            </pre>
          </Card>

          {/* Evaluation Criteria */}
          <Card className="bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-3">Evaluation Criteria</h3>
            <div className="space-y-3">
              {project.evaluationCriteria?.map((crit) => (
                <div key={crit.criterion} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs">
                  <div className="flex justify-between font-bold text-slate-900 mb-0.5">
                    <span>{crit.criterion}</span>
                    <span className="text-blue-600">{crit.weight}</span>
                  </div>
                  <p className="text-slate-600">{crit.detail}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: GitHub Submission UI Placeholder & Feedback */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-slate-100">
              <GithubIcon className="h-5 w-5 text-slate-900" />
              <h3 className="text-base font-bold text-slate-900">GitHub Project Submission</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Link your repository. SkillBridge will clone the repo in a secure sandbox, verify your multi-stage Dockerfile layers, and inspect unit test coverage.
            </p>

            <form onSubmit={handleGitHubSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GitHub Repository URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/docker-fastapi-service"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Branch
                </label>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  loading={isSubmitting}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5"
                >
                  {project.status === 'Submitted' ? 'Update Submission' : 'Submit for Verification'}
                </Button>
              </div>
            </form>

            {/* Submission Status & Feedback */}
            {submissionFeedback && (
              <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Submission Recorded
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                    {submissionFeedback.status}
                  </span>
                </div>
                <p className="text-emerald-700 font-mono text-[11px] truncate">
                  {submissionFeedback.githubRepoUrl}
                </p>
                <p className="text-slate-600 mt-2 text-[11px] leading-relaxed">
                  {submissionFeedback.feedback}
                </p>
              </div>
            )}
          </Card>

          {/* Submission Guidelines */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800">Submission Requirements</h4>
            <p>1. Must contain an .env.example with mock credentials.</p>
            <p>2. Docker compose file must start with "docker compose up --build" without errors.</p>
            <p>3. Include brief documentation in README.md explaining API endpoints.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
