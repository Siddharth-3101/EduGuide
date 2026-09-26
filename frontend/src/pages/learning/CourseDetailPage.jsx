import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { learningApi } from '../../services/api/learningApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await learningApi.getCourseById(courseId || 'course-docker-101');
        setCourse(data);
      } catch (err) {
        console.error(err);
        setError('Course not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    await learningApi.enrollCourse(course?.id);
    setEnrolled(true);
  };

  if (loading) return <CardSkeleton />;
  if (error || !course) return <ErrorState message={error} onRetry={() => navigate('/learning')} />;

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      <div>
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 text-xs font-editorial-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)] hover:underline mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Reference Materials
        </Link>
      </div>

      <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 font-editorial-mono text-[10px]">
              <span className="font-semibold opacity-70 bg-current/5 px-2.5 py-0.5 rounded border border-current/15">
                {course.provider}
              </span>
              <span className="px-2 py-0.5 rounded border border-current/20 font-bold uppercase">
                {course.difficulty}
              </span>
              <span className="px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold">
                {course.price}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-editorial-title tracking-tight uppercase">
              {course.title}
            </h1>

            <div className="p-4 rounded-xl bg-current/5 border border-current/15 text-xs">
              <span className="font-editorial-mono font-bold text-[var(--accent-terracotta)] uppercase tracking-wider block mb-1">
                Why this is recommended for your gap
              </span>
              <p className="leading-relaxed opacity-85">"{course.whyRecommended}"</p>
            </div>

            <div className="flex items-center gap-4 text-xs font-editorial-mono opacity-70 pt-1">
              <span className="flex items-center gap-1 font-semibold">
                <Clock className="h-3.5 w-3.5 opacity-60" /> {course.duration} Total
              </span>
              <span>•</span>
              <span>{course.modules?.length || 5} Interactive Modules</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Self-Paced</span>
            </div>
          </div>

          <div className="shrink-0 p-5 rounded border border-current/15 bg-current/5 text-center w-full lg:w-72 font-editorial-mono">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block mb-1">
              Curriculum Enrollment
            </span>
            <span className="text-2xl font-bold font-editorial-title block mb-4">Free Access</span>

            {enrolled ? (
              <div className="space-y-2">
                <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  ✓ Enrolled — Module 1 Ready
                </div>
                <Button
                  variant="primary"
                  className="w-full text-xs"
                  onClick={() => navigate('/assessments/asmt-docker')}
                  iconRight={ArrowRight}
                >
                  Take Proctored Assessment
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={handleEnroll}
                className="w-full py-2.5 text-xs"
              >
                Enroll Now (Free)
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Curriculum Breakdown */}
      <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6">
        <h3 className="text-base font-bold font-editorial-title uppercase mb-1">Course Curriculum & Modules</h3>
        <p className="text-xs opacity-70 mb-5">
          Step-by-step practical modules covering core principles, debugging, and production best practices.
        </p>

        <div className="divide-y divide-current/10 font-editorial-mono text-xs">
          {course.modules?.map((m, idx) => (
            <div key={m.id} className="py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current/10 font-bold opacity-70 text-[11px]">
                  {idx + 1}
                </span>
                <span className="font-semibold">{m.title}</span>
              </div>
              <span className="opacity-60">{m.duration}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
