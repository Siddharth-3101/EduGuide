import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  CheckSquare,
  FolderGit2,
  ArrowRight
} from 'lucide-react';

export const RoadmapNode = ({ competency }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case 'partial':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'missing':
        return <AlertCircle className="h-5 w-5 text-rose-500" />;
      default:
        return null;
    }
  };

  const getBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="verified">Verified</Badge>;
      case 'partial':
        return <Badge variant="partial">Partial</Badge>;
      case 'missing':
        return <Badge variant="missing">Missing</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="relative pl-8 pb-8 group last:pb-0 before:absolute before:left-3.5 before:top-4 before:bottom-0 before:w-0.5 before:bg-slate-200 last:before:hidden">
      {/* Node pin */}
      <div className="absolute -left-0.5 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-white ring-4 ring-slate-50 border border-slate-200 shadow-xs">
        {getStatusIcon(competency.status)}
      </div>

      {/* Competency Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-base font-bold text-slate-900">{competency.name}</h4>
              {getBadge(competency.status)}
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {competency.importance}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
              <span>
                Required Level: <strong className="text-slate-800 font-semibold">{competency.level}</strong>
              </span>
              <span>•</span>
              <span>
                Current Status: <strong className="text-slate-800 font-semibold">{competency.currentLevel}</strong>
              </span>
              {competency.evidenceType && (
                <>
                  <span>•</span>
                  <span>
                    Evidence: <strong className="text-slate-800 font-semibold">{competency.evidenceType}</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Action flow based on status */}
          <div className="flex items-center gap-2 pt-2 sm:pt-0 shrink-0">
            {competency.status === 'verified' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/skills/${competency.id}`)}
              >
                View Evidence
              </Button>
            )}

            {competency.status === 'partial' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={BookOpen}
                  onClick={() => navigate(`/learning?skillId=${competency.id}`)}
                >
                  Learn
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  icon={CheckSquare}
                  onClick={() => navigate(`/assessments`)}
                >
                  Take Assessment
                </Button>
              </>
            )}

            {competency.status === 'missing' && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  icon={BookOpen}
                  onClick={() => navigate(`/learning?skillId=${competency.id}`)}
                >
                  Learn
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  iconRight={ArrowRight}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate(`/assessments/asm-docker`)}
                >
                  Assess & Verify
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Action roadmap flow pill when in progress */}
        {competency.status === 'partial' && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
            <span className="text-blue-600 font-semibold">Recommended path:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">1. Review Spring Data</span>
            <span>→</span>
            <span className="bg-blue-50 px-2 py-0.5 rounded text-blue-700 font-semibold">2. Take Assessment</span>
            <span>→</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">3. Verify Badge</span>
          </div>
        )}
      </div>
    </div>
  );
};
