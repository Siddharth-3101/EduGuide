import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, Check, X, ChevronRight, Building } from 'lucide-react';

export const JobOpportunityPreview = ({ jobs = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-editorial-title text-lg font-bold uppercase tracking-tight">Jobs Matching Your Profile</h3>
          <p className="text-xs font-editorial-serif italic opacity-70 mt-0.5">
            Ranked by competency coverage against your verified skill profile
          </p>
        </div>
        <Link
          to="/jobs"
          className="text-xs font-editorial-mono font-medium hover:text-[var(--accent-terracotta)] hover:underline flex items-center gap-0.5"
        >
          Explore All Opportunities <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.slice(0, 2).map((job) => (
          <Card
            key={job.id}
            className="flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-inherit font-editorial-mono font-bold text-sm shadow-xs">
                    {job.logoUrl || <Building className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="font-editorial-title text-base font-bold uppercase leading-snug">{job.title}</h4>
                    <p className="text-xs opacity-75 font-sans">{job.company}</p>
                  </div>
                </div>

                {/* Match percentage badge */}
                <div className="text-right">
                  <div className="inline-flex items-center px-2 py-0.5 rounded border border-current/25 font-editorial-mono text-xs font-bold text-[var(--accent-terracotta)]">
                    {job.competencyMatch}% MATCH
                  </div>
                  <p className="text-[10px] font-editorial-mono opacity-50 mt-0.5">VERIFIED MATCH</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs opacity-60 font-editorial-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 opacity-60" /> {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 opacity-60" /> {job.workplaceType}
                </span>
              </div>

              {/* Skills breakdown */}
              <div className="mt-4 pt-3 border-t border-current/10 space-y-2">
                <div>
                  <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider opacity-60 block mb-1">
                    Matching Skills ({job.matchingSkills?.length || 0})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {job.matchingSkills?.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded border border-emerald-600/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-editorial-mono font-medium text-emerald-700 dark:text-emerald-400"
                      >
                        <Check className="h-3 w-3" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {job.missingSkills?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider opacity-60 block mb-1">
                      Missing Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.missingSkills?.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1 rounded border border-rose-600/30 bg-rose-500/10 px-2 py-0.5 text-xs font-editorial-mono font-medium text-rose-700 dark:text-rose-400"
                        >
                          <X className="h-3 w-3" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between">
              <span className="text-xs font-editorial-mono font-semibold opacity-80">{job.salaryRange}</span>
              <Button
                size="sm"
                variant="primary"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                View Job
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
