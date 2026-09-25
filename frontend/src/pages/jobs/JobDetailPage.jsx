import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobApi } from '../../services/api/jobApi';
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
  CheckCircle2
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
        const data = await jobApi.getJobById(jobId || 'job-1');
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

  const getCompetencyIcon = (status) => {
    if (status === 'verified') return <Check className="h-4 w-4 text-emerald-600 font-bold" />;
    if (status === 'partial') return <AlertTriangle className="h-4 w-4 text-amber-500 font-bold" />;
    return <X className="h-4 w-4 text-rose-500 font-bold" />;
  };

  const getCompetencyRowStyle = (status) => {
    if (status === 'verified') return 'bg-emerald-50/60 border-emerald-200 text-emerald-900';
    if (status === 'partial') return 'bg-amber-50/60 border-amber-200 text-amber-900';
    return 'bg-rose-50/60 border-rose-200 text-rose-900';
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Job Opportunities
        </Link>
      </div>

      {/* Hero Job Banner Card */}
      <Card className="bg-white border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold text-lg shadow-sm">
              {job.logoUrl || <Building className="h-7 w-7" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {job.roleCategory}
                </span>
                <span>•</span>
                <span className="text-xs text-slate-400">{job.postedDate}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <p className="text-sm font-semibold text-slate-700 mt-1">{job.company}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" /> {job.workplaceType}
                </span>
                <span>•</span>
                <span>{job.employmentType}</span>
                {job.salaryRange && (
                  <>
                    <span>•</span>
                    <span className="font-bold text-slate-800">{job.salaryRange}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* External Apply CTA */}
          <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                variant="primary"
                size="lg"
                iconRight={ExternalLink}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-sm"
              >
                Apply on Company Site
              </Button>
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/portfolio')}
              className="w-full text-xs"
            >
              Attach Skill Passport
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid: Required Competencies vs Match Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Required Competencies Checklist */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Required Competencies</h3>
            <p className="text-xs text-slate-500 mb-4">
              Real-time audit of requirements matched against your SkillBridge verified passport.
            </p>

            <div className="space-y-2.5">
              {job.requiredCompetencies?.map((comp) => (
                <div
                  key={comp.name}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${getCompetencyRowStyle(
                    comp.status
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-2xs">
                      {getCompetencyIcon(comp.status)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{comp.name}</h4>
                      <span className="text-[11px] text-slate-500">Expected: {comp.level}</span>
                    </div>
                  </div>

                  <span className="font-bold text-xs">
                    {comp.status === 'verified' && '✓ Verified'}
                    {comp.status === 'partial' && '⚠ Partial'}
                    {comp.status === 'missing' && '✕ Gap'}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Job Description & Responsibilities */}
          <Card className="bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-2">Role Overview</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {job.description}
            </p>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Key Responsibilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-700">
              {job.responsibilities?.map((resp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Right Column: Your Match Analysis */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border border-slate-200 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
              Your Match Analysis
            </h3>

            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div>
                <span className="text-3xl font-extrabold text-slate-900">
                  {job.competencyMatch}%
                </span>
                <p className="text-xs text-slate-500 mt-0.5">Competency Coverage</p>
              </div>
              <CircularProgress value={job.competencyMatch} size={80} strokeWidth={8} />
            </div>

            {/* Explanations: Strong matches vs Gaps */}
            <div className="mt-5 space-y-4 text-xs">
              <div>
                <span className="font-bold text-emerald-800 uppercase tracking-wider text-[11px] block mb-1.5 flex items-center gap-1">
                  <Check className="h-3.5 w-3.5 text-emerald-600" /> Strong Matches
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.matchingSkills?.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-bold text-rose-800 uppercase tracking-wider text-[11px] block mb-1.5 flex items-center gap-1">
                  <X className="h-3.5 w-3.5 text-rose-600" /> Gaps & Partial Competencies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...(job.partialSkills || []), ...(job.missingSkills || [])].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded bg-rose-50 text-rose-800 font-semibold border border-rose-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Gap remediation CTA */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/assessments/asm-docker')}
              >
                Verify Docker to Increase Match (+14%)
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
