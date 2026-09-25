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
    <div className="space-y-6">
      <div>
        <Link
          to="/learning"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Recommended Learning
        </Link>
      </div>

      <Card className="bg-white border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                {course.provider}
              </span>
              <Badge variant="blue">{course.difficulty}</Badge>
              <Badge variant="verified">{course.price}</Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {course.title}
            </h1>

            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700">
              <span className="font-bold text-blue-700 uppercase tracking-wider block mb-1">
                Why this is recommended
              </span>
              <p className="leading-relaxed font-medium">"{course.whyRecommended}"</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> {course.duration} Total
              </span>
              <span>•</span>
              <span>{course.modules?.length || 5} Interactive Modules</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold">Self-Paced</span>
            </div>
          </div>

          <div className="shrink-0 p-5 rounded-xl border border-slate-200 bg-slate-50 text-center w-full lg:w-72">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Enrollment
            </span>
            <span className="text-2xl font-extrabold text-slate-900 block mb-4">Free Access</span>

            {enrolled ? (
              <div className="space-y-2">
                <div className="p-2 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">
                  ✓ Enrolled — Module 1 Ready
                </div>
                <Button
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/assessments/asm-docker')}
                  iconRight={ArrowRight}
                >
                  Jump to Assessment
                </Button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={handleEnroll}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5"
              >
                Enroll Now (Free)
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Curriculum Breakdown */}
      <Card className="bg-white border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-1">Course Curriculum & Modules</h3>
        <p className="text-xs text-slate-500 mb-5">
          Step-by-step practical modules covering container architecture and multi-stage configs.
        </p>

        <div className="divide-y divide-slate-100">
          {course.modules?.map((m, idx) => (
            <div key={m.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500 text-[11px]">
                  {idx + 1}
                </span>
                <span className="font-semibold text-slate-800">{m.title}</span>
              </div>
              <span className="text-slate-400 font-mono">{m.duration}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
