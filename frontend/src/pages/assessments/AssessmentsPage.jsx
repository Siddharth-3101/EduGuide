import React, { useState, useEffect } from 'react';
import { assessmentApi } from '../../services/api/assessmentApi';
import { AssessmentCard } from '../../components/assessments/AssessmentCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { CheckSquare, Sparkles } from 'lucide-react';

export const AssessmentsPage = () => {
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
              <CheckSquare className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Technical Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Skills Assessments
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Standardized technical evaluations designed to verify backend and cloud competencies.
          </p>
        </div>

        {/* Category Tabs: Recommended, In Progress, Completed */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Next Action Alert */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            🎯
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Top Priority: Docker Fundamentals</h4>
            <p className="text-xs text-slate-600">
              Completing this 15-minute test will bridge your critical Backend Developer gap.
            </p>
          </div>
        </div>
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
