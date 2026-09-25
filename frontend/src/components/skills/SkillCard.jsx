import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Award, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

export const SkillCard = ({ skill }) => {
  const navigate = useNavigate();

  const isVerified = skill.status === 'verified';
  const isPartial = skill.status === 'partial';
  const isNotVerified = skill.status === 'missing' || skill.status === 'not-verified';

  const getStatusBadge = () => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-editorial-mono text-[10px] font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          VERIFIED
        </span>
      );
    }
    if (isPartial) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-editorial-mono text-[10px] font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          PARTIAL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-editorial-mono text-[10px] font-bold">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        NOT VERIFIED
      </span>
    );
  };

  const getEvidenceList = () => {
    if (isVerified) {
      return ['Certificate', 'Assessment', 'Project'];
    }
    if (isPartial) {
      return ['Project Repository'];
    }
    return [];
  };

  return (
    <Card
      onClick={() => navigate(`/skills/${skill.id}`)}
      hoverEffect
      className="flex flex-col justify-between h-full group"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-editorial-mono uppercase tracking-wider opacity-50">
              {skill.category}
            </span>
            <h4 className="font-editorial-title text-base font-bold uppercase group-hover:text-[var(--accent-terracotta)] transition-colors leading-snug">
              {skill.name}
            </h4>
          </div>
          {getStatusBadge()}
        </div>

        <p className="text-xs opacity-70 line-clamp-2 mt-1 leading-relaxed font-sans">
          {skill.description}
        </p>

        <div className="mt-4 pt-3 border-t border-current/10 space-y-2 text-xs font-editorial-mono">
          <div className="flex items-center justify-between">
            <span className="opacity-60 text-[10px] uppercase">Level:</span>
            <span className="font-bold">{skill.level || 'Intermediate'}</span>
          </div>

          {/* Assessment Score if verified */}
          {isVerified && (
            <div className="flex items-center justify-between">
              <span className="opacity-60 text-[10px] uppercase">Assessment Score:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {skill.score || 89}%
              </span>
            </div>
          )}

          {/* Required For if not verified */}
          {isNotVerified && (
            <div className="flex items-center justify-between">
              <span className="opacity-60 text-[10px] uppercase">Required for:</span>
              <span className="font-bold text-[var(--accent-terracotta)]">Backend Developer</span>
            </div>
          )}

          {/* Evidence badges */}
          <div className="pt-1">
            <span className="opacity-60 text-[10px] uppercase block mb-1">Evidence:</span>
            {getEvidenceList().length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {getEvidenceList().map((ev) => (
                  <span
                    key={ev}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-current/15 bg-current/5 text-[9px]"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600 dark:text-emerald-400" />
                    {ev}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[10px] opacity-40 italic font-sans">
                No verified evidence on file yet
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between font-editorial-mono">
        <span className="text-[10px] opacity-60 group-hover:opacity-100 flex items-center gap-0.5">
          View Detail <ArrowUpRight className="h-3 w-3" />
        </span>

        {isNotVerified ? (
          <Button
            size="sm"
            variant="primary"
            className="text-xs py-1 px-2.5"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/assessments/${skill.relatedAssessmentId || 'asm-docker'}`);
            }}
          >
            Take Assessment
          </Button>
        ) : isPartial ? (
          <Button
            size="sm"
            variant="secondary"
            className="text-xs py-1 px-2.5"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/learning?skillId=${skill.id}`);
            }}
          >
            Practice
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            className="text-xs py-1 px-2 opacity-80"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/skills/${skill.id}`);
            }}
          >
            Evidence
          </Button>
        )}
      </div>
    </Card>
  );
};
