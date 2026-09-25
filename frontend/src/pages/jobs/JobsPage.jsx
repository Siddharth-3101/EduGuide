import React, { useState, useEffect } from 'react';
import { jobApi } from '../../services/api/jobApi';
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
  X
} from 'lucide-react';

export const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [workplaceType, setWorkplaceType] = useState('All');
  const [minMatch, setMinMatch] = useState(0);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobApi.getJobs({
        search: searchQuery,
        roleCategory: selectedRole,
        workplaceType,
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
  }, [searchQuery, selectedRole, workplaceType, minMatch]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRole('All');
    setWorkplaceType('All');
    setMinMatch(0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
            <Briefcase className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Verified Opportunities
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Job Competency Matching
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Roles evaluated strictly against your verified competencies. No keyword filtering illusions.
        </p>
      </div>

      {/* Main Grid: Left Filters Sidebar + Right Job Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" /> Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Search Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Company, title, location..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">All Roles</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Cloud Engineer">Cloud Engineer</option>
                <option value="Software Engineer">Software Engineer</option>
              </select>
            </div>

            {/* Remote / Workplace */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Workplace Type</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">Any Workplace Type</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            {/* Match Percentage Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-semibold text-slate-700">Min. Competency Match</label>
                <span className="font-bold text-blue-600">{minMatch}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minMatch}
                onChange={(e) => setMinMatch(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>90%+</span>
              </div>
            </div>
          </div>

          {/* Important Match Disclaimer Banner as strictly instructed */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 leading-relaxed">
            <span className="font-bold text-slate-700 block mb-1">Notice on Competency Matching</span>
            Match percentages reflect the proportion of verified technical skills you possess compared to the job listing requirements. It does not imply a legal probability of employment.
          </div>
        </aside>

        {/* Right Job Listings Feed */}
        <main className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Showing <strong className="text-slate-900 font-bold">{jobs.length}</strong> matching positions</span>
            <span>Sorted by Competency Match</span>
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
              description="Lower your minimum competency match or broaden your filters to see more opportunities."
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
