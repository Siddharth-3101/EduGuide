import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CircularProgress } from '../ui/CircularProgress';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const SkillGapAnalysisSection = ({ gapData }) => {
  const navigate = useNavigate();

  if (!gapData) return null;

  const { targetRole, competencyCoverage, missingCount, partialCount, verifiedCount, gapCards } = gapData;

  const getPriorityBadge = (priority) => {
    if (priority.includes('High')) {
      return (
        <span className="px-2 py-0.5 rounded border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-editorial-mono text-[9px] font-bold">
          {priority}
        </span>
      );
    }
    if (priority.includes('Medium')) {
      return (
        <span className="px-2 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-editorial-mono text-[9px] font-bold">
          {priority}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded border border-current/20 bg-current/5 font-editorial-mono text-[9px] opacity-70">
        {priority}
      </span>
    );
  };

  return (
    <div className="space-y-6 pt-4 border-t border-current/10">
      {/* Top Gap Summary Card */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-current/5 text-[var(--accent-terracotta)]">
                <TrendingUp className="h-3.5 w-3.5" />
              </span>
              <h2 className="font-editorial-title text-lg font-bold uppercase tracking-tight">
                Skill Gap Analysis · {targetRole}
              </h2>
            </div>
            <p className="text-xs opacity-75 font-sans leading-relaxed">
              Targeted benchmark analysis identifies precisely which missing competencies are gating your verified interview readiness for {targetRole} positions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 font-editorial-mono text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-bold">{verifiedCount}</span>
                <span className="opacity-60 text-[10px]">VERIFIED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-bold">{partialCount}</span>
                <span className="opacity-60 text-[10px]">PARTIAL GAPS</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="font-bold">{missingCount}</span>
                <span className="opacity-60 text-[10px]">CRITICAL GAPS</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 p-4 rounded border border-current/15 bg-[var(--bg-page)]/60 font-editorial-mono">
            <div>
              <span className="text-[10px] opacity-50 uppercase tracking-wider block">Current Benchmark</span>
              <span className="font-editorial-title text-2xl font-bold">{competencyCoverage}%</span>
              <span className="text-[10px] text-[var(--accent-terracotta)] block mt-0.5 font-bold">
                Target: 80% Required
              </span>
            </div>
            <CircularProgress value={competencyCoverage} size={70} strokeWidth={6} />
          </div>
        </div>
      </Card>

      {/* Prioritized Skill Gap Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-editorial-mono">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            Prioritized Competency Gaps ({gapCards?.length || 0})
          </span>
          <span className="text-[10px] opacity-50">Ranked by job requisition overlap</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gapCards?.map((gap) => (
            <Card key={gap.id} className="p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-current/10">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    <h3 className="font-editorial-title text-base font-bold uppercase leading-snug">
                      {gap.skillName}
                    </h3>
                  </div>
                  {getPriorityBadge(gap.priority)}
                </div>

                <p className="text-xs opacity-75 font-sans mt-2 leading-relaxed">
                  {gap.why}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-editorial-mono">
                  <div className="p-2 rounded bg-current/5 border border-current/10">
                    <span className="opacity-50 text-[9px] uppercase block">Required</span>
                    <span className="font-bold">{gap.requiredLevel}</span>
                  </div>
                  <div className="p-2 rounded bg-current/5 border border-current/10">
                    <span className="opacity-50 text-[9px] uppercase block">Current</span>
                    <span className="font-bold">{gap.currentLevel}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-current/10 flex flex-wrap items-center justify-end gap-2 font-editorial-mono">
                {gap.actions?.map((act, i) => (
                  <Button
                    key={i}
                    size="sm"
                    variant={act.type === 'assess' ? 'primary' : 'secondary'}
                    className="text-[11px] py-1 px-3"
                    onClick={() => navigate(act.route)}
                  >
                    {act.label}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
