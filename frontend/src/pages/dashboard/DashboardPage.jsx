import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';
import { skillsApi } from '../../services/api/skillsApi';
import { jobService } from '../../services/api/jobService';
import { profileApi } from '../../services/api/profileApi';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CircularProgress } from '../../components/ui/CircularProgress';
import {
  Target,
  ShieldCheck,
  AlertCircle,
  FolderGit2,
  Briefcase,
  Users,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Building,
  Check,
  X
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { careerApi } from '../../services/api/careerApi';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, targetRoleId, selectTargetRole } = useCareer();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [skillsData, jobsData, rolesList] = await Promise.all([
        skillsApi.getSkills(),
        jobService.getJobs(),
        careerApi.getRoles()
      ]);
      setSkills(skillsData);
      setJobs(jobsData);
      setAvailableRoles(rolesList || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Could not load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleTargetRoleChange = async (newRoleId) => {
    await selectTargetRole(newRoleId);
  };

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  const studentName = user?.fullName || 'Siddharth G';
  const targetRole = stats?.targetRoleTitle || 'Backend Developer';

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* Top Greeting & Dynamic Target Career Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-current/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)]">
              <Target className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-editorial-mono font-bold text-[var(--accent-terracotta)] uppercase tracking-[0.2em]">
              Overview // Ecosystem Cockpit
            </span>
          </div>
          <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold tracking-tight uppercase">
            Good day, {studentName}
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Your journey toward your target career as a{' '}
            <span className="font-semibold underline decoration-[var(--accent-terracotta)] underline-offset-4">
              {targetRole}
            </span>
            .
          </p>
        </div>

        {/* Change Target Role Pill / Dropdown at Top of Dashboard */}
        <div className="flex flex-wrap items-center gap-2.5 bg-current/[0.03] p-2.5 rounded-xl border border-current/15">
          <div className="flex items-center gap-1.5 text-xs font-editorial-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
            <Target className="h-4 w-4" />
            <span>Target Role:</span>
          </div>
          <select
            value={targetRoleId || 'backend-developer'}
            onChange={(e) => handleTargetRoleChange(e.target.value)}
            className="text-xs font-editorial-mono bg-[var(--card-surface)] text-[var(--text-primary)] border border-current/20 rounded-lg px-3 py-1.5 font-semibold cursor-pointer focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
          >
            {availableRoles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
          <Link
            to={`/career/${targetRoleId || 'backend-developer'}`}
            className="text-xs px-3 py-1.5 rounded-lg bg-[var(--accent-terracotta)] text-white font-editorial-mono font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity"
            title="Explore Interactive Roadmap"
          >
            <span>Roadmap</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {/* ROW 1: CAREER PROGRESS & YOUR SKILL STATUS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 1. CAREER PROGRESS */}
            <div className="lg:col-span-7">
              <Card className="h-full bg-[var(--card-surface)] border border-[var(--border-line)] p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-current/10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] opacity-70">
                        Section 10 // Career Progress
                      </span>
                    </div>
                    <Link
                      to="/career"
                      className="text-xs font-editorial-mono font-bold text-[var(--accent-terracotta)] hover:underline flex items-center gap-1"
                    >
                      Branching Graph <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <span className="font-editorial-title text-3xl font-extrabold text-[var(--accent-terracotta)]">
                        67%
                      </span>
                      <h3 className="font-editorial-title text-lg font-bold uppercase tracking-tight">
                        Competency Coverage
                      </h3>
                      <p className="text-xs opacity-75 max-w-sm leading-relaxed">
                        Evaluated across 16 core competencies required for high-probability consideration in target {targetRole} roles.
                      </p>
                    </div>

                    <div className="shrink-0">
                      <CircularProgress value={67} size={110} strokeWidth={10} label="Coverage" />
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-editorial-mono opacity-70">
                  <span>Target Benchmark: 80%</span>
                  <span className="font-bold text-[var(--accent-terracotta)]">+13% to Target Readiness</span>
                </div>
              </Card>
            </div>

            {/* 2. YOUR SKILL STATUS */}
            <div className="lg:col-span-5">
              <Card className="h-full bg-[var(--card-surface)] border border-[var(--border-line)] p-6 flex flex-col justify-between shadow-2xs">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-current/10">
                    <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] opacity-70">
                      Your Skill Status
                    </span>
                    <Link
                      to="/skills"
                      className="text-xs font-editorial-mono font-bold text-[var(--accent-terracotta)] hover:underline flex items-center gap-1"
                    >
                      Audit Skills <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="mt-5 space-y-3 font-editorial-mono text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        <span className="font-bold uppercase tracking-wider">Verified Skills</span>
                      </div>
                      <span className="font-bold text-base font-editorial-title">8</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        <span className="font-bold uppercase tracking-wider">Partial Verification</span>
                      </div>
                      <span className="font-bold text-base font-editorial-title">3</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                        <span className="font-bold uppercase tracking-wider">Not Verified</span>
                      </div>
                      <span className="font-bold text-base font-editorial-title">4</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-current/10 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/skills')}
                    className="text-xs w-full sm:w-auto"
                  >
                    View All 15 Skills
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* ROW 2: CURRENT SKILL GAP & RECOMMENDED PROJECT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3. CURRENT SKILL GAP */}
            <div className="lg:col-span-6">
              <Card className="h-full bg-[var(--card-surface)] border border-[var(--border-line)] p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-current/10">
                  <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
                    Current Skill Gap [Priority 01]
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 font-editorial-mono text-[10px] font-bold text-rose-600 dark:text-rose-400">
                    🔴 Not Verified
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-editorial-title text-xl font-bold uppercase tracking-tight">
                      Docker
                    </h3>
                    <p className="text-xs opacity-75 mt-1 leading-relaxed">
                      Required by 72% of selected target backend roles. Containerization is essential for production deployments.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded border border-current/10 bg-current/5 text-xs font-editorial-mono flex items-center justify-between">
                  <span className="opacity-70">Target Level: <strong>Intermediate</strong></span>
                  <span className="opacity-70">Current Level: <strong className="text-rose-600 dark:text-rose-400">None</strong></span>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/learning?gap=Docker')}
                    className="text-xs flex-1"
                    iconLeft={BookOpen}
                  >
                    Learn
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate('/assessments/docker')}
                    className="text-xs flex-1"
                    iconRight={ArrowRight}
                  >
                    Take Assessment
                  </Button>
                </div>
              </Card>
            </div>

            {/* 4. RECOMMENDED PROJECT */}
            <div className="lg:col-span-6">
              <Card className="h-full bg-[var(--card-surface)] border border-[var(--border-line)] p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-current/10">
                  <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
                    Recommended Project Evidence
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 font-editorial-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                    🟡 Evidence Identified
                  </span>
                </div>

                <div>
                  <h3 className="font-editorial-title text-xl font-bold uppercase tracking-tight">
                    Containerized REST API
                  </h3>
                  <p className="text-xs opacity-75 mt-1 leading-relaxed">
                    Build and package a stateless FastAPI service alongside PostgreSQL via Docker Compose to supply portfolio evidence.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 font-editorial-mono text-[11px]">
                  {['Docker', 'PostgreSQL', 'FastAPI', 'REST API'].map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded border border-current/15 bg-current/5">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate('/projects/proj-1')}
                    className="w-full text-xs font-bold"
                    iconRight={FolderGit2}
                  >
                    View Project
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* ROW 3: INTERVIEW PREPARATION CALLOUT */}
          <div className="p-5 rounded-md border border-[var(--accent-terracotta)]/40 bg-[var(--accent-terracotta)]/5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-[var(--accent-terracotta)]/30 bg-[var(--bg-page)] text-[var(--accent-terracotta)] text-lg">
                  🎙️
                </div>
                <div>
                  <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)] block">
                    Interview Preparation Workspace
                  </span>
                  <h4 className="font-editorial-title text-base font-bold uppercase tracking-tight text-[var(--text-primary)] mt-0.5">
                    Practice Collaborative Technical Questions
                  </h4>
                  <p className="text-xs opacity-80 mt-1 max-w-xl">
                    You have <strong>12 interview questions</strong> to practice for Backend Developer roles, covering REST API design, SQL indexes, and system scaling.
                  </p>
                </div>
              </div>

              <div className="shrink-0 sm:self-center">
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => navigate('/interviews/int-backend-dev')}
                  iconRight={ArrowRight}
                  className="w-full sm:w-auto text-xs font-bold"
                >
                  Practice Interviews
                </Button>
              </div>
            </div>
          </div>

          {/* ROW 4: RECOMMENDED JOBS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)] block">
                  Top Recommended Opportunities
                </span>
                <h3 className="font-editorial-title text-lg font-bold uppercase tracking-tight">
                  Normalized External Job Matches
                </h3>
              </div>
              <Link
                to="/jobs"
                className="text-xs font-editorial-mono font-bold text-[var(--accent-terracotta)] hover:underline flex items-center gap-1"
              >
                View All Jobs <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.slice(0, 2).map((job) => (
                <Card
                  key={job.id}
                  className="bg-[var(--card-surface)] border border-[var(--border-line)] p-5 flex flex-col justify-between text-[var(--text-primary)] shadow-2xs hover:border-[var(--accent-terracotta)]/40 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] font-bold text-sm">
                          <Building className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-editorial-title text-base font-bold uppercase leading-snug">
                            {job.title}
                          </h4>
                          <p className="text-xs opacity-75">{job.company}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded font-editorial-mono text-xs font-bold bg-[var(--accent-terracotta)]/10 text-[var(--accent-terracotta)] border border-[var(--accent-terracotta)]/30">
                          {job.matchPercentage || 82}% Match
                        </span>
                        <p className="text-[9px] font-editorial-mono opacity-50 mt-0.5">Competency Match</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs font-editorial-mono opacity-70">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.workMode}</span>
                      <span>•</span>
                      <span>Source: {job.source}</span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-current/10 space-y-2 font-editorial-mono text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-bold opacity-60">Verified:</span>
                        {job.matchingSkills?.slice(0, 3).map((s) => (
                          <span key={s} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                      {job.missingSkills?.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-bold opacity-60">Missing:</span>
                          {job.missingSkills?.map((s) => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold text-[10px]">
                              ✕ {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-editorial-mono">
                    <span className="font-bold opacity-80">{job.salary}</span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="text-xs"
                    >
                      View Job
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
