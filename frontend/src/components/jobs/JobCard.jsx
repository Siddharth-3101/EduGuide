import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  Check,
  X,
  ArrowUpRight,
  Building,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const match = job.matchPercentage || job.competencyMatch || 80;

  const getSourceBadge = (source) => {
    switch (source?.toLowerCase()) {
      case 'linkedin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-editorial-mono text-[10px] font-bold bg-[#0A66C2]/10 text-[#0A66C2] border border-[#0A66C2]/20">
            LinkedIn
          </span>
        );
      case 'naukri':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-editorial-mono text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Naukri
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-editorial-mono text-[10px] font-bold bg-current/5 border border-current/15 opacity-80">
            {source || 'Direct'}
          </span>
        );
    }
  };

  return (
    <Card className="flex flex-col justify-between h-full bg-[var(--card-surface)] border border-[var(--border-line)] text-[var(--text-primary)] hover:border-[var(--accent-terracotta)]/50 transition-all shadow-2xs">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] font-bold text-sm">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight leading-snug">
                  {job.title}
                </h3>
              </div>
              <p className="text-xs font-semibold opacity-75 mt-0.5">{job.company}</p>

              <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-editorial-mono opacity-70">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" /> {job.workMode}
                </span>
                <span>•</span>
                <span>{job.experience}</span>
              </div>
            </div>
          </div>

          {/* Competency Match Indicator */}
          <div className="text-right shrink-0">
            <div className="inline-flex items-center px-2.5 py-1 rounded font-editorial-mono text-xs font-bold bg-[var(--accent-terracotta)]/10 text-[var(--accent-terracotta)] border border-[var(--accent-terracotta)]/30">
              {match}% Competency Match
            </div>
            <div className="flex items-center justify-end gap-1 text-[9px] font-editorial-mono opacity-50 mt-1">
              <span>Verified Alignment</span>
            </div>
          </div>
        </div>

        <p className="text-xs opacity-75 mt-3 line-clamp-2 leading-relaxed">
          {job.description}
        </p>

        {/* Skills breakdown: Matching vs Missing */}
        <div className="mt-4 pt-3 border-t border-current/10 space-y-2.5 font-editorial-mono text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1.5">
              Verified Matching Skills ({job.matchingSkills?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {job.matchingSkills?.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  <Check className="h-3 w-3 text-emerald-500" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {job.missingSkills?.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                Missing Skill Gaps
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.missingSkills?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400"
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

      <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-editorial-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold opacity-80">{job.salary}</span>
          <span>•</span>
          <span>Source: {getSourceBadge(job.source)}</span>
        </div>

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
