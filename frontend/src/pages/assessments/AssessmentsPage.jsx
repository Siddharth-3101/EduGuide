import React, { useState, useEffect } from 'react';
import { assessmentApi } from '../../services/api/assessmentApi';
import { AssessmentCard } from '../../components/assessments/AssessmentCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { CheckSquare, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AssessmentsPage = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All'); // 'All' | 'Recommended' | 'In Progress' | 'Completed'
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Recommended', 'In Progress', 'Completed'];

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentApi.getAssessments(activeCategory);
      setAssessments(data);
    } catch (err) {
      console.error(err);
      setError('Could not load technical assessments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [activeCategory]);

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-line)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[var(--accent-terracotta)]/15 text-[var(--accent-terracotta)]">
              <CheckSquare className="h-3.5 w-3.5" />
            </span>
            <span className="font-editorial-mono text-[10px] font-bold text-[var(--accent-terracotta)] uppercase tracking-[0.2em]">
              Section 04 // Technical Verification
            </span>
          </div>
          <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold tracking-tight uppercase">
            Proctored Skills Assessments
          </h1>
          <p className="text-xs font-editorial-mono opacity-70 mt-1">
            Standardized, browser-proctored technical evaluations designed to verify backend, cloud, and systems competencies.
          </p>
        </div>

        {/* Category Tabs: Recommended, In Progress, Completed */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg border border-[var(--border-line)] bg-current/5 shrink-0 font-editorial-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded transition-all font-semibold uppercase text-[11px] ${
                activeCategory === cat
                  ? 'bg-[var(--card-surface)] text-[var(--accent-terracotta)] border border-current/20 shadow-2xs font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Next Action Alert */}
      <div className="p-4 sm:p-5 rounded-xl bg-[var(--card-surface)] border border-[var(--border-line)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-terracotta)]/15 text-[var(--accent-terracotta)] font-bold text-base border border-[var(--accent-terracotta)]/30">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-editorial-title text-sm font-bold uppercase tracking-tight">
                Top Priority Benchmark: Docker Fundamentals & Architecture
              </h4>
              <span className="inline-flex items-center gap-1 text-[10px] font-editorial-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3" /> Strict Proctoring
              </span>
            </div>
            <p className="text-xs font-editorial-mono opacity-75 mt-0.5">
              Completing this 15-minute evaluation will promote Docker to verified and lift your readiness coverage to 92%.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/assessments/asmt-docker')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded font-editorial-mono text-xs font-bold bg-[var(--accent-terracotta)] text-white hover:opacity-90 transition-all shrink-0 uppercase tracking-wider"
        >
          Start Assessment <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Assessment Cards Grid */}
      {error ? (
        <ErrorState message={error} onRetry={fetchAssessments} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assessments.map((asm) => (
            <AssessmentCard key={asm.id} assessment={asm} />
          ))}
        </div>
      )}
    </div>
  );
};
