import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Check,
  X,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Building,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const JobIntelligenceSection = () => {
  const navigate = useNavigate();

  const jobs = [
    {
      id: 'job-1',
      title: 'Backend Developer',
      company: 'TechNova',
      source: 'LinkedIn',
      location: 'Bangalore • Hybrid',
      match: 82,
      matchingSkills: ['Python', 'SQL', 'REST API', 'Git'],
      missingSkills: ['Docker', 'AWS'],
      salary: '₹8,50,000 – ₹12,00,000 / yr'
    },
    {
      id: 'job-3',
      title: 'Python Software Engineer',
      company: 'ScaleOps Technologies',
      source: 'LinkedIn',
      location: 'Hyderabad • On-site',
      match: 91,
      matchingSkills: ['Python', 'SQL', 'REST API', 'Git'],
      missingSkills: ['Redis'],
      salary: '₹9,00,000 – ₹13,50,000 / yr'
    }
  ];

  return (
    <section id="jobs" className="py-20 sm:py-28 border-b border-[var(--border-line)] relative z-10 bg-current/[0.015]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-[var(--card-surface)] px-3.5 py-1 text-xs font-editorial-mono tracking-wider opacity-85 mb-4">
            <Briefcase className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
            <span>SECTION 08 // COMPETENCY-BASED MATCHING</span>
          </div>

          <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
            No resume keyword illusions. Real skill matches.
          </h2>

          <p className="mt-4 text-base opacity-75 max-w-2xl mx-auto leading-relaxed font-sans">
            Recruiting algorithms often reject qualified candidates due to missing keywords. SkillSync evaluates external opportunities against your verified competency passport.
          </p>

          {/* Strict Disclaimer Banner */}
          <div className="mt-6 p-3 rounded-lg border border-[var(--accent-terracotta)]/30 bg-[var(--accent-terracotta)]/5 max-w-xl mx-auto text-xs font-editorial-mono opacity-85">
            <span className="font-bold text-[var(--accent-terracotta)] block mb-0.5">
              Notice on Competency Matching:
            </span>
            Percentages reflect direct alignment between your verified skill badges and job requirements. It is never misrepresented as a hiring or selection probability.
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 sm:p-7 rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] shadow-lg flex flex-col justify-between space-y-5 hover:border-[var(--accent-terracotta)] transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] font-bold text-sm">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight text-[var(--text-primary)] leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-xs font-semibold opacity-75 mt-0.5">{job.company}</p>
                      <span className="text-[11px] font-editorial-mono opacity-60 block mt-1">
                        {job.location} • Source: {job.source}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="inline-flex items-center px-2.5 py-1 rounded font-editorial-mono text-xs font-bold bg-[var(--accent-terracotta)]/15 text-[var(--accent-terracotta)] border border-[var(--accent-terracotta)]/30">
                      {job.match}% Match
                    </div>
                    <span className="text-[9px] font-editorial-mono opacity-50 block mt-0.5">
                      Competency Alignment
                    </span>
                  </div>
                </div>

                {/* Matching vs Missing Competencies */}
                <div className="mt-5 pt-4 border-t border-current/10 space-y-3 font-editorial-mono text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                      Verified Matching Skills ({job.matchingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.matchingSkills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                        >
                          <Check className="h-3 w-3 text-emerald-500" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                      Missing Skill Gaps
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400"
                        >
                          <X className="h-3 w-3 text-rose-500" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-editorial-mono">
                <span className="font-bold opacity-80">{job.salary}</span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(`/jobs/${job.id}`)}
                  className="text-xs font-bold"
                  iconRight={ArrowRight}
                >
                  View Normalized Role
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
