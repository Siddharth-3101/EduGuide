import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { learningApi } from '../../services/api/learningApi';
import { Card } from '../../components/ui/Card';
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
  GraduationCap,
  Filter,
  FileText,
  Video,
  Layers
} from 'lucide-react';

export const LearningPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillParam = searchParams.get('skillId');

  const [courses, setCourses] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(skillParam || 'All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skillParam) {
      setSelectedSkill(skillParam);
    }
  }, [skillParam]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await learningApi.getRecommendedCourses();
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError('Could not load learning reference materials.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) => {
    const matchType = selectedType === 'All' || c.type === selectedType;
    const matchSkill = selectedSkill === 'All' || c.skillId === selectedSkill;
    return matchType && matchSkill;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-current/10">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-current/5 text-[var(--accent-terracotta)]">
            <BookOpen className="h-3.5 w-3.5" />
          </span>
          <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
            CURATED REFERENCE MATERIALS & GAPS
          </span>
        </div>
        <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase tracking-tight">
          Learning & Reference Library
        </h1>
        <p className="text-sm opacity-70 mt-1 max-w-2xl font-sans">
          Targeted micro-courses, official documentation, and practical labs directly mapped to your active skill gaps.
        </p>
      </div>

      {/* Filter Bars */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded border border-current/15 bg-[var(--card-surface)] font-editorial-mono text-xs">
        {/* Filter by Material Type */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="opacity-50 text-[10px] uppercase mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Type:
          </span>
          {['All', 'Course', 'Documentation', 'Video Tutorial'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded transition-all ${
                selectedType === t
                  ? 'bg-current/15 font-bold border border-current/20'
                  : 'opacity-60 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filter by Target Skill Gap */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="opacity-50 text-[10px] uppercase mr-1">Skill Gap:</span>
          {['All', 'docker', 'aws', 'spring-boot', 'redis'].map((sk) => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk)}
              className={`px-2.5 py-1 rounded uppercase tracking-wider transition-all ${
                selectedSkill === sk
                  ? 'bg-current/15 font-bold border border-current/20'
                  : 'opacity-60 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Courses List */}
      {error ? (
        <ErrorState message={error} onRetry={() => navigate(0)} />
      ) : loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 text-center rounded border border-dashed border-current/20 bg-[var(--card-surface)] font-editorial-mono text-xs">
          <p className="opacity-60 mb-2">No learning resources match the selected filters.</p>
          <button
            onClick={() => {
              setSelectedType('All');
              setSelectedSkill('All');
            }}
            className="text-[var(--accent-terracotta)] hover:underline font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  {/* Badges & Provider */}
                  <div className="flex flex-wrap items-center gap-2 font-editorial-mono text-[10px]">
                    <span className="px-2 py-0.5 rounded border border-current/20 font-bold uppercase">
                      {course.type}
                    </span>
                    <span className="px-2 py-0.5 rounded border border-current/15 bg-current/5 opacity-80">
                      {course.provider}
                    </span>
                    <span className="px-2 py-0.5 rounded border border-current/15 opacity-70">
                      {course.difficulty}
                    </span>
                    <span className="px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold">
                      {course.price}
                    </span>
                  </div>

                  <h3 className="font-editorial-title text-lg font-bold uppercase leading-snug">
                    {course.title}
                  </h3>

                  {/* Why this is recommended */}
                  <div className="p-3.5 rounded border border-current/15 bg-current/5 text-xs font-sans">
                    <span className="font-editorial-mono text-[10px] font-bold text-[var(--accent-terracotta)] uppercase tracking-wider block mb-0.5 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Why this is recommended for your gap
                    </span>
                    <p className="opacity-80 leading-relaxed font-medium">
                      "{course.whyRecommended}"
                    </p>
                  </div>

                  {/* Competencies covered */}
                  <div>
                    <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider opacity-50 block mb-1.5">
                      Competencies Covered
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs font-sans opacity-80">
                      {course.competenciesCovered?.map((c) => (
                        <div key={c} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span className="truncate">{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side CTA & metadata */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-current/10 font-editorial-mono text-xs">
                  <div className="text-left lg:text-right opacity-70 space-y-1">
                    <div className="flex items-center lg:justify-end gap-1 font-bold">
                      <Clock className="h-3.5 w-3.5 opacity-60" />
                      <span>{course.duration}</span>
                    </div>
                    {course.rating && (
                      <div className="flex items-center lg:justify-end gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{course.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    {course.externalUrl && (
                      <a
                        href={course.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded border border-current/25 font-editorial-mono text-xs font-semibold hover:bg-current/10 transition-colors"
                      >
                        Open Resource <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/assessments/asm-${course.skillId || 'docker'}`)}
                      className="text-xs"
                    >
                      Verify Skill After Study
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
