import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/api/jobService';
import { JobCard } from '../../components/jobs/JobCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  X,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [minMatch, setMinMatch] = useState(0);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobs({
        search: searchQuery,
        source: selectedSource,
        workMode,
        minMatch
      });
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError('Could not load matched jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, selectedSource, workMode, minMatch]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSource('All');
    setWorkMode('All');
    setMinMatch(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)]">
            <Briefcase className="h-3.5 w-3.5" />
          </span>
          <span className="text-[10px] font-editorial-mono font-bold text-[var(--accent-terracotta)] uppercase tracking-[0.2em]">
            Section 09 // Verified Opportunities
          </span>
        </div>
        <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold tracking-tight uppercase">
          Job Competency Matching
        </h1>
        <p className="text-sm opacity-70 mt-1 max-w-2xl leading-relaxed">
          Aggregated and normalized across external platforms (LinkedIn, Naukri, Employer Feeds). Evaluated strictly against your verified competencies.
        </p>
      </div>

      {/* Main Grid: Left Filters Sidebar + Right Job Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-[var(--card-surface)] p-5 rounded-md border border-[var(--border-line)] shadow-2xs space-y-5 text-[var(--text-primary)]">
            <div className="flex items-center justify-between pb-3 border-b border-current/10">
              <span className="text-xs font-editorial-mono font-bold uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" /> Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-xs font-editorial-mono text-[var(--accent-terracotta)] hover:underline font-bold"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-70 mb-1.5">
                Search Roles & Tech
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Docker, Python, TechNova..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
                />
              </div>
            </div>

            {/* External Source Filter */}
            <div>
              <label className="block text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-70 mb-1.5">
                External Job Source
              </label>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)] font-editorial-mono"
              >
                <option value="All">All Sources</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Naukri">Naukri</option>
                <option value="Employer Direct">Employer Direct</option>
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <label className="block text-xs font-editorial-mono font-bold uppercase tracking-wider opacity-70 mb-1.5">
                Workplace Mode
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-current/20 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)] font-editorial-mono"
              >
                <option value="All">Any Mode</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Match Percentage Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-editorial-mono mb-1.5">
                <label className="font-bold opacity-75">Min. Competency Match</label>
                <span className="font-bold text-[var(--accent-terracotta)]">{minMatch}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                className="w-full accent-[var(--accent-terracotta)] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-editorial-mono opacity-50 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>90%+</span>
              </div>
            </div>
          </div>

          {/* Important Match Disclaimer Banner */}
          <div className="p-4 rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] text-xs opacity-75 leading-relaxed font-editorial-mono">
            <span className="font-bold block mb-1 text-[var(--accent-terracotta)]">
              Notice on Competency Matching
            </span>
            Match percentages reflect the proportion of verified technical skills you possess compared to the job listing requirements. It does not imply a legal probability of employment or selection.
          </div>
        </aside>

        {/* Right Job Listings Feed */}
        <main className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-editorial-mono opacity-70 px-1">
            <span>Showing <strong>{jobs.length}</strong> matching positions</span>
            <span>Sorted by Competency Alignment</span>
          </div>

          {error ? (
            <ErrorState message={error} onRetry={fetchJobs} />
          ) : loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              title="No matching roles found"
              description="Lower your minimum competency match or broaden your filters to discover more opportunities."
              actionText="Reset Filters"
              onAction={resetFilters}
            />
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
