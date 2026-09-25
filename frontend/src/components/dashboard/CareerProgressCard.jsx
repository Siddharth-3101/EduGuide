import React from 'react';
import { Card } from '../ui/Card';
import { CircularProgress } from '../ui/CircularProgress';
import { ChevronRight, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CareerProgressCard = ({ stats, targetRole = 'Backend Developer' }) => {
  const verified = stats?.verifiedCount || 8;
  const partial = stats?.partialCount || 3;
  const missing = stats?.missingCount || 4;
  const coverage = stats?.competencyCoverage || 67;

  return (
    <Card className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-current/10">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)]">
              <Target className="h-4 w-4" />
            </span>
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] opacity-70">
              Career Progress
            </span>
          </div>
          <Link
            to="/career"
            className="text-xs font-editorial-mono font-medium hover:text-[var(--accent-terracotta)] hover:underline flex items-center gap-0.5"
          >
            Roadmap <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-editorial-title text-xl font-bold uppercase tracking-tight">{targetRole}</h3>
            <p className="text-xs font-editorial-serif italic opacity-75 mt-0.5">Competency Coverage Index</p>

            <div className="mt-4 flex items-center gap-4 text-xs font-editorial-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="font-bold">{verified}</span>
                <span className="opacity-60 text-[10px]">VERIFIED</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span className="font-bold">{partial}</span>
                <span className="opacity-60 text-[10px]">PARTIAL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span className="font-bold">{missing}</span>
                <span className="opacity-60 text-[10px]">MISSING</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <CircularProgress value={coverage} size={105} strokeWidth={9} label="Coverage" />
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-editorial-mono opacity-70">
        <span>Target: 80% for interviews</span>
        <span className="font-bold text-[var(--accent-terracotta)]">+{13}% to target</span>
      </div>
    </Card>
  );
};
