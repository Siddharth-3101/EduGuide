import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Award,
  FolderGit2,
  RotateCcw,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { MOCK_DEFAULT_RESULT } from '../../data/mock/assessments';

export const AssessmentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state?.result || MOCK_DEFAULT_RESULT;
  const isPass = result.passed !== false && (result.score >= 70);

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 font-editorial-mono">
      {/* Result Hero Header */}
      <div className="text-center py-4">
        <div
          className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full border mb-4 shadow-sm ${
            isPass
              ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              : 'border-rose-500/40 bg-rose-500/15 text-rose-600 dark:text-rose-400'
          }`}
        >
          {isPass ? <CheckCircle2 className="h-9 w-9" /> : <AlertCircle className="h-9 w-9" />}
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-current/20 text-xs font-semibold mb-2">
          <span
            className={`h-2 w-2 rounded-full ${isPass ? 'bg-emerald-500' : 'bg-rose-500'}`}
          />
          {isPass ? 'EVALUATION COMPLETE · BENCHMARK MET' : 'EVALUATION COMPLETE · RETRY RECOMMENDED'}
        </div>

        <h1 className="font-editorial-title text-3xl font-bold uppercase tracking-tight">
          {isPass ? 'Assessment Passed' : 'Assessment Incomplete'}
        </h1>
        <p className="text-xs opacity-70 mt-1 font-sans">
          {result.title || 'Docker Fundamentals & Containers'}
        </p>
      </div>

      {/* Main Scorecard Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-current/10">
          <div className="text-center sm:text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
              Verified Score
            </span>
            <div className="flex items-baseline gap-3 mt-1 justify-center sm:justify-start">
              <span className="font-editorial-title text-5xl font-bold tracking-tight">
                {result.score}%
              </span>
              <span
                className={`text-xs font-bold uppercase ${
                  isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {isPass ? 'PASS ✓ (Benchmark 70%)' : 'FAIL (Benchmark 70%)'}
              </span>
            </div>
            <p className="text-xs opacity-70 mt-1 font-sans">
              Evaluated under standardized constraints and recorded in your competency profile.
            </p>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <div className="mb-2">
              {isPass ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded border border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase">
                  🟢 Competency Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded border border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300 text-xs font-bold uppercase">
                  🔴 Not Verified
                </span>
              )}
            </div>
            <p className="text-xs opacity-75 font-sans">
              Level Rating: <strong className="uppercase font-editorial-mono">{result.competencyLevel || 'Intermediate'}</strong>
            </p>
          </div>
        </div>

        {/* Competency Breakdown */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 opacity-70">
            Sub-Domain Competency Breakdown
          </h3>
          <div className="space-y-3.5 text-xs">
            {result.breakdown?.map((item) => (
              <div key={item.area}>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="opacity-80">{item.area}</span>
                  <span className="font-bold">{item.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-current/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[var(--accent-terracotta)] rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Action Next Step Card */}
      {isPass ? (
        <Card className="p-6 space-y-4 border-[var(--accent-terracotta)] bg-current/5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--accent-terracotta)]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
              Next Recommended Milestone
            </span>
          </div>
          <h3 className="font-editorial-title text-lg font-bold uppercase leading-snug">
            Build a Docker Project to Strengthen Practical Evidence
          </h3>
          <p className="text-xs opacity-80 font-sans leading-relaxed">
            Now that theoretical competency is verified, containerize a real production API and submit the GitHub repository to earn verified evidence status in your Skill Passport.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              iconRight={ArrowRight}
              onClick={() => navigate('/projects/proj-1')}
              className="w-full sm:w-auto text-xs"
            >
              View Recommended Project
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate('/portfolio')}
              className="w-full sm:w-auto text-xs"
            >
              View Skill Passport
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-6 space-y-4 border-rose-500/30 bg-rose-500/5">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Recommended Study Pathway
            </span>
          </div>
          <h3 className="font-editorial-title text-lg font-bold uppercase leading-snug">
            Review Targeted Materials Before Retrying
          </h3>
          <p className="text-xs opacity-80 font-sans leading-relaxed">
            Your score did not meet the 70% passing threshold for verified passport status. Review the recommended micro-courses and practical labs, then re-attempt when ready.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="primary"
              iconLeft={BookOpen}
              onClick={() => navigate(`/learning?skillId=${result.skillId || 'docker'}`)}
              className="w-full sm:w-auto text-xs"
            >
              Review Learning Materials
            </Button>

            <Button
              variant="secondary"
              iconLeft={RotateCcw}
              onClick={() => navigate(`/assessments/${result.assessmentId || 'asm-docker'}`)}
              className="w-full sm:w-auto text-xs"
            >
              Retry Assessment
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
