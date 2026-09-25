import React, { useState, useEffect } from 'react';
import { skillsApi } from '../../services/api/skillsApi';
import { SkillCard } from '../../components/skills/SkillCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Search, Filter, Layers, Sparkles } from 'lucide-react';

export const SkillsPage = () => {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'verified' | 'partial' | 'missing'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
            <Layers className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Verified Competency Library
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Skill Library & Competency Mapping
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore benchmarked skills, inspect verification evidence, and tackle gap areas.
        </p>
      </div>

      {/* Search & Status Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills..."
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
        </div>

        {/* Status Filters: All, Verified, Partial, Missing */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-500 font-semibold mr-1 shrink-0 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Status:
          </span>
          {[
            { id: 'all', label: 'All' },
            { id: 'verified', label: 'Verified' },
            { id: 'partial', label: 'Partial' },
            { id: 'missing', label: 'Missing' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold capitalize transition-colors shrink-0 ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Horizontal Filter Tags */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
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
