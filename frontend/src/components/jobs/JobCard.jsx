import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Check, X, ArrowUpRight, Building } from 'lucide-react';

export const JobCard = ({ job }) => {
  const navigate = useNavigate();

  return (
    <Card className="flex flex-col justify-between h-full bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm shadow-xs">
              {job.logoUrl || <Building className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">{job.title}</h3>
              <p className="text-xs font-semibold text-slate-600 mt-0.5">{job.company}</p>
              
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-slate-400" /> {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3 text-slate-400" /> {job.workplaceType}
                </span>
                <span>•</span>
                <span>{job.experienceLevel}</span>
              </div>
            </div>
          </div>

          {/* Competency Match Indicator */}
          <div className="text-right shrink-0">
            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
              {job.competencyMatch}% Match
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Competency Match</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills breakdown */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Matching Competencies ({job.matchingSkills?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {job.matchingSkills?.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200/60"
                >
                  <Check className="h-3 w-3 text-emerald-600" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {job.missingSkills?.length > 0 && (
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Missing Skill Gaps
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.missingSkills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 border border-rose-200/60"
                  >
                    <X className="h-3 w-3 text-rose-500" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-800">{job.salaryRange}</span>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/jobs/${job.id}`)}
            iconRight={ArrowUpRight}
          >
            View Job
          </Button>
        </div>
      </div>
    </Card>
  );
};
