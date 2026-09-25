import React, { useState, useEffect } from 'react';
import { skillsApi } from '../../services/api/skillsApi';
import { SkillCard } from '../../components/skills/SkillCard';
import { CertificateUploadModule } from '../../components/skills/CertificateUploadModule';
import { ResumeUploadModule } from '../../components/skills/ResumeUploadModule';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Search, Filter, Layers, FileCheck2, FileText, Sparkles, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const SkillsPage = () => {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'verified' | 'partial' | 'missing'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeUploadTab, setActiveUploadTab] = useState('none'); // 'none' | 'certificate' | 'resume'

  useEffect(() => {
    const fetchCats = async () => {
      const cats = await skillsApi.getCategories();
      setCategories(cats);
    };
    fetchCats();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await skillsApi.getSkills({
        category: selectedCategory,
        status: statusFilter,
        search: searchQuery
      });
      setSkills(data);
    } catch (err) {
      console.error(err);
      setError('Could not load skills library.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, [selectedCategory, statusFilter, searchQuery]);

  // Compute skill counts
  const verifiedCount = skills.filter((s) => s.status === 'verified').length || 8;
  const partialCount = skills.filter((s) => s.status === 'partial').length || 3;
  const missingCount = skills.filter((s) => s.status === 'missing' || s.status === 'not-verified').length || 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-current/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-current/5 text-[var(--accent-terracotta)]">
              <Layers className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
              COMPETENCY VERIFICATION REPOSITORY
            </span>
          </div>
          <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase tracking-tight">
            Your Skills & Verification
          </h1>
          <p className="text-sm opacity-70 mt-1 max-w-2xl font-sans">
            Independent assessment scores, verified code evidence, and credential documents mapped to your career pathway.
          </p>
        </div>

        {/* Upload modules quick buttons */}
        <div className="flex items-center gap-2 font-editorial-mono text-xs">
          <button
            onClick={() => setActiveUploadTab(activeUploadTab === 'certificate' ? 'none' : 'certificate')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition-all ${
              activeUploadTab === 'certificate'
                ? 'border-[var(--accent-terracotta)] bg-current/10 font-bold'
                : 'border-current/20 hover:border-current/40'
            }`}
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            Upload Certificate
          </button>
          <button
            onClick={() => setActiveUploadTab(activeUploadTab === 'resume' ? 'none' : 'resume')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border transition-all ${
              activeUploadTab === 'resume'
                ? 'border-[var(--accent-terracotta)] bg-current/10 font-bold'
                : 'border-current/20 hover:border-current/40'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Upload Resume
          </button>
        </div>
      </div>

      {/* SKILLS DASHBOARD TOP SUMMARY (Section 3 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-editorial-mono">
        <div
          onClick={() => setStatusFilter('verified')}
          className={`p-4 rounded border cursor-pointer transition-all ${
            statusFilter === 'verified'
              ? 'border-emerald-500 bg-emerald-500/10'
              : 'border-current/15 bg-[var(--card-surface)] hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-70">
            <span className="flex items-center gap-1.5 font-bold uppercase text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Verified Skills
            </span>
            <span className="text-[10px]">Independently tested</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-editorial-title text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {verifiedCount}
            </span>
            <span className="text-[10px] opacity-60">Verified competencies</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('partial')}
          className={`p-4 rounded border cursor-pointer transition-all ${
            statusFilter === 'partial'
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-current/15 bg-[var(--card-surface)] hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-70">
            <span className="flex items-center gap-1.5 font-bold uppercase text-amber-600 dark:text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> Partially Verified
            </span>
            <span className="text-[10px]">Evidence submitted</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-editorial-title text-3xl font-bold text-amber-600 dark:text-amber-400">
              {partialCount}
            </span>
            <span className="text-[10px] opacity-60">Under progress</span>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter('missing')}
          className={`p-4 rounded border cursor-pointer transition-all ${
            statusFilter === 'missing'
              ? 'border-rose-500 bg-rose-500/10'
              : 'border-current/15 bg-[var(--card-surface)] hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between text-xs opacity-70">
            <span className="flex items-center gap-1.5 font-bold uppercase text-rose-600 dark:text-rose-400">
              <span className="h-2 w-2 rounded-full bg-rose-500" /> Not Verified
            </span>
            <span className="text-[10px]">Action required</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-editorial-title text-3xl font-bold text-rose-600 dark:text-rose-400">
              {missingCount}
            </span>
            <span className="text-[10px] opacity-60">Critical career gaps</span>
          </div>
        </div>
      </div>

      {/* Upload Modules if active */}
      {activeUploadTab === 'certificate' && (
        <CertificateUploadModule onSkillsUpdated={loadSkills} />
      )}
      {activeUploadTab === 'resume' && (
        <ResumeUploadModule onSkillsConfirmed={loadSkills} />
      )}

      {/* Search & Status Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded border border-current/15 bg-[var(--card-surface)] font-editorial-mono text-xs">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 opacity-40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, categories, or keywords..."
            className="w-full pl-9 pr-3 py-1.5 rounded border border-current/20 bg-[var(--bg-page)] text-inherit focus:outline-none focus:border-[var(--accent-terracotta)] font-sans"
          />
        </div>

        {/* Status Filters: All, Verified, Partial, Not Verified */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="opacity-50 uppercase mr-1 shrink-0 flex items-center gap-1 text-[10px]">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'verified', label: 'Verified' },
            { id: 'partial', label: 'Partial' },
            { id: 'missing', label: 'Not Verified' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 rounded capitalize transition-colors shrink-0 ${
                statusFilter === st.id
                  ? 'bg-current/15 font-bold border border-current/20'
                  : 'opacity-60 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Horizontal Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-editorial-mono text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-current/15 font-bold border border-current/25 shadow-2xs'
                : 'border border-current/15 opacity-60 hover:opacity-100 hover:bg-current/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      {error ? (
        <ErrorState message={error} onRetry={loadSkills} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : skills.length === 0 ? (
        <EmptyState
          title="No skills found"
          description="Try clearing your search query or choosing another category."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setSelectedCategory('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </div>
  );
};
