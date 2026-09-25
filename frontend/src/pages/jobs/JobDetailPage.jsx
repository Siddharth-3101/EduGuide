import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobService } from '../../services/api/jobService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  ExternalLink,
  Check,
  AlertTriangle,
  X,
  Sparkles,
  Building,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await jobService.getJobById(jobId || 'job-1');
        setJob(data);
      } catch (err) {
        console.error(err);
        setError('Job details not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [jobId]);

  if (loading) return <CardSkeleton />;
  if (error || !job) return <ErrorState message={error} onRetry={() => navigate('/jobs')} />;

  const match = job.matchPercentage || job.competencyMatch || 82;

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-editorial-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)] hover:underline mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Job Opportunities
        </Link>
      </div>

      {/* Hero Job Banner Card */}
      <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 sm:p-8 text-[var(--text-primary)]">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] font-bold text-lg">
              <Building className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
                  {job.roleCategory || 'Backend Engineering'}
                </span>
                <span className="opacity-40">•</span>
                <span className="text-xs font-editorial-mono opacity-60">Source: {job.source}</span>
                <span className="opacity-40">•</span>
                <span className="text-xs font-editorial-mono opacity-60">{job.postedDate}</span>
              </div>

              <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold tracking-tight uppercase">
                {job.title}
              </h1>
              <p className="text-sm font-semibold opacity-80 mt-1">{job.company}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-editorial-mono opacity-70">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> {job.workMode}
                </span>
                <span>•</span>
                <span>{job.experience}</span>
                {job.salary && (
                  <>
                    <span>•</span>
                    <span className="font-bold opacity-100">{job.salary}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* External Apply CTA (Redirects to original sourceUrl) */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href={job.sourceUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                variant="primary"
                size="lg"
                iconRight={ExternalLink}
                className="w-full text-xs font-bold"
              >
                Apply on Original Job Source ({job.source})
              </Button>
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/portfolio')}
              className="w-full text-xs font-editorial-mono"
            >
              Attach Skill Passport
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid: Requirements vs Competency Match & Preparation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Requirements & Description */}
        <div className="lg:col-span-7 space-y-6">
          {/* Job Overview */}
          <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 space-y-4 text-[var(--text-primary)]">
            <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight">
              Job Description
            </h3>
            <p className="text-sm opacity-80 leading-relaxed">
              {job.description}
            </p>

            {job.requirements && (
              <div className="pt-2 space-y-3">
                <h4 className="text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-60">
                  Requirements & Responsibilities
                </h4>
                <ul className="space-y-2 text-xs font-editorial-mono opacity-80">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--accent-terracotta)] font-bold">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          {/* Matching Skills vs Missing Skills */}
          <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 space-y-5 text-[var(--text-primary)]">
            <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight">
              Competencies Comparison
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-editorial-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Check className="h-4 w-4" /> Matching Verified Skills ({job.matchingSkills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2">
                  {job.matchingSkills?.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-xs font-editorial-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" /> {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-editorial-mono font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <X className="h-4 w-4" /> Missing Skill Gaps ({job.missingSkills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2">
                  {job.missingSkills?.map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-xs font-editorial-mono font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1"
                    >
                      <X className="h-3 w-3" /> {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Match Analysis & Recommended Preparation */}
        <div className="lg:col-span-5 space-y-6">
          {/* Match Analysis Card */}
          <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 text-[var(--text-primary)]">
            <div className="flex items-center justify-between pb-4 border-b border-current/10">
              <div>
                <span className="font-editorial-title text-3xl font-extrabold text-[var(--accent-terracotta)]">
                  {match}%
                </span>
                <p className="text-xs font-editorial-mono opacity-70 mt-0.5">Competency Match</p>
              </div>
              <CircularProgress value={match} size={75} strokeWidth={8} />
            </div>

            <div className="mt-3 p-3 rounded border border-current/10 bg-current/5 text-[11px] font-editorial-mono opacity-75">
              Notice: This percentage reflects alignment between your verified skills and job requirements. It is not an employment guarantee or hiring probability.
            </div>
          </Card>

          {/* Recommended Preparation Card */}
          <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 space-y-4 text-[var(--text-primary)]">
            <div className="flex items-center gap-2 pb-3 border-b border-current/10">
              <Sparkles className="h-4 w-4 text-[var(--accent-terracotta)]" />
              <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight">
                Recommended Preparation
              </h3>
            </div>

            <div className="text-xs font-editorial-mono space-y-3">
              <p className="opacity-80">
                You are currently missing: <strong className="text-rose-600 dark:text-rose-400">{job.missingSkills?.join(', ')}</strong>
              </p>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-2">
                  Actionable Steps to Close Gap:
                </span>
                <div className="space-y-2">
                  {(job.recommendedPreparation || [
                    'Learn Docker Fundamentals',
                    'Complete Docker assessment',
                    'Build containerized project'
                  ]).map((action, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded border border-current/10 bg-current/5 flex items-center justify-between gap-2"
                    >
                      <span className="font-semibold">{i + 1}. {action}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full text-xs font-bold"
                  onClick={() => navigate('/learning?gap=Docker')}
                  iconRight={ArrowRight}
                >
                  Start Learning Docker
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
