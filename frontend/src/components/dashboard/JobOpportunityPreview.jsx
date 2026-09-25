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
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">Jobs Matching Your Profile</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by competency coverage against your verified skill profile
          </p>
        </div>
        <Link
          to="/jobs"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
        >
          Explore All Opportunities <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.slice(0, 2).map((job) => (
          <Card
            key={job.id}
            className="flex flex-col justify-between border border-slate-200 hover:border-slate-300 transition-all shadow-xs"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-sm shadow-xs">
                    {job.logoUrl || <Building className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 leading-snug">{job.title}</h4>
                    <p className="text-xs font-medium text-slate-600">{job.company}</p>
                  </div>
                </div>

                {/* Match percentage badge */}
                <div className="text-right">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                    {job.competencyMatch}% match
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">Competency Match</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> {job.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" /> {job.workplaceType}
                </span>
              </div>

              {/* Skills breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                    Matching Skills ({job.matchingSkills?.length || 0})
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
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                      Missing Competencies
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
              <span className="text-xs font-semibold text-slate-700">{job.salaryRange}</span>
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
