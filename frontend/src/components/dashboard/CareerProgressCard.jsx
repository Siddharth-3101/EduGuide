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
    <Card className="flex flex-col justify-between h-full bg-white border border-slate-200">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <Target className="h-4 w-4" />
            </span>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Career Progress
            </span>
          </div>
          <Link
            to="/career"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
          >
            View Roadmap <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">{targetRole}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Competency Coverage</p>

            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-slate-800">{verified}</span>
                <span className="text-slate-500">Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                <span className="font-semibold text-slate-800">{partial}</span>
                <span className="text-slate-500">Partial</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <span className="font-semibold text-slate-800">{missing}</span>
                <span className="text-slate-500">Missing</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex items-center justify-center">
            <CircularProgress value={coverage} size={105} strokeWidth={9} label="Coverage" />
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Target benchmark: 80% for verified interviews</span>
        <span className="font-medium text-blue-600">+{13}% to target</span>
      </div>
    </Card>
  );
};
