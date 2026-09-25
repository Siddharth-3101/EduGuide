import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Award, FileCheck2, ArrowRight } from 'lucide-react';

export const SkillCard = ({ skill }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="verified">✓ Verified</Badge>;
      case 'partial':
        return <Badge variant="partial">Partial</Badge>;
      case 'missing':
        return <Badge variant="missing">Missing</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getEvidenceText = () => {
    if (skill.evidenceList?.length > 0) {
      return skill.evidenceList.map((e) => e.type).slice(0, 2).join(' + ');
    }
    return skill.status === 'verified' ? 'Assessment + Project' : 'No evidence submitted';
  };

  return (
    <Card
      onClick={() => navigate(`/skills/${skill.id}`)}
      hoverEffect
      className="flex flex-col justify-between h-full bg-white border border-slate-200"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {skill.category}
            </span>
            <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {skill.name}
            </h4>
          </div>
          {getStatusBadge(skill.status)}
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
          {skill.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">Level:</span>
            <span className="font-semibold text-slate-800">{skill.level}</span>
          </div>

          <div className="flex items-center justify-between text-slate-600">
            <span className="text-slate-400">Evidence:</span>
            <span className="font-medium text-slate-700 truncate max-w-[160px] text-right">
              {getEvidenceText()}
            </span>
          </div>

          {skill.status === 'verified' && skill.score > 0 && (
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-400">Score:</span>
              <span className="font-bold text-emerald-600">{skill.score}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-blue-600 font-medium group-hover:underline flex items-center gap-0.5">
          View Breakdown
        </span>

        {skill.status === 'missing' ? (
          <Button
            size="sm"
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2.5"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/assessments/${skill.relatedAssessmentId || 'asm-docker'}`);
            }}
          >
            Verify
          </Button>
        ) : skill.status === 'partial' ? (
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
            variant="ghost"
            className="text-xs py-1 px-2 text-slate-500"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/skills/${skill.id}`);
            }}
          >
            Details
          </Button>
        )}
      </div>
    </Card>
  );
};
