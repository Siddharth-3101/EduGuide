import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { learningApi } from '../../services/api/learningApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  BookOpen,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export const LearningPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillFilter = searchParams.get('skillId');

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await learningApi.getRecommendedCourses({ skillId: skillFilter });
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError('Could not load learning recommendations.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [skillFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Personalized Curriculum
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Recommended Learning
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Targeted micro-courses selected to bridge your missing competency gaps in Backend Developer roadmap.
        </p>
      </div>

      {skillFilter && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800">
          <span>Filtering courses for skill: <strong className="uppercase">{skillFilter}</strong></span>
          <button
            onClick={() => navigate('/learning')}
            className="font-bold underline hover:text-blue-950"
          >
            Clear Filter
          </button>
        </div>
      )}

      {/* Courses List */}
      {error ? (
        <ErrorState message={error} onRetry={() => navigate(0)} />
      ) : loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="space-y-5">
          {courses.map((course) => (
            <Card
              key={course.id}
              className="bg-white border border-slate-200 hover:border-slate-300 transition-all p-6 shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                      {course.provider}
                    </span>
                    <Badge variant="blue">{course.difficulty}</Badge>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      {course.price}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {course.title}
                  </h3>

                  {/* Explicit "Why this is recommended" callout */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs">
                    <span className="font-bold text-blue-700 uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Why this is recommended
                    </span>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      "{course.whyRecommended}"
                    </p>
                  </div>

                  {/* Competency coverage list */}
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Competency Coverage
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600">
                      {course.competenciesCovered?.map((c) => (
                        <div key={c} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side CTA & metadata */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right text-xs text-slate-500 space-y-1">
                    <div className="flex items-center lg:justify-end gap-1 font-semibold text-slate-800">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center lg:justify-end gap-1 text-slate-600">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{course.rating}</span>
                      <span className="text-slate-400">({course.enrolledCount} enrolled)</span>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate(`/learning/${course.id}`)}
                    iconRight={ArrowRight}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                  >
                    View Course
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
