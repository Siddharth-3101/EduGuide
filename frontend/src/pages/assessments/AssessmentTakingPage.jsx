import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../../services/api/assessmentApi';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Play,
  FileCheck2,
  Layers,
  Sparkles
} from 'lucide-react';

export const AssessmentTakingPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15 mins
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const data = await assessmentApi.getAssessmentById(assessmentId || 'asm-docker');
        setAssessment(data);
        if (data.durationMinutes) {
          setSecondsRemaining(data.durationMinutes * 60);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [assessmentId]);

  // Live Timer countdown
  useEffect(() => {
    if (!hasStarted || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, secondsRemaining]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId) => {
    const qId = assessment?.questions?.[currentQuestionIndex]?.id;
    if (qId) {
      setSelectedAnswers((prev) => ({ ...prev, [qId]: optionId }));
    }
  };

  const handleToggleReview = () => {
    const qId = assessment?.questions?.[currentQuestionIndex]?.id;
    if (qId) {
      setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await assessmentApi.submitAssessment(assessment?.id || 'asm-docker', selectedAnswers);
      navigate(`/assessments/${assessment?.id || 'asm-docker'}/result`, {
        state: { result }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !assessment) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <CardSkeleton />
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentQuestionIndex] || questions[0];
  const qId = currentQ?.id;
  const isMarked = Boolean(markedForReview[qId]);
  const isSelected = selectedAnswers[qId];

  // 1. ASSESSMENT INTRODUCTION SCREEN (Section 7 Requirement)
  if (!hasStarted) {
    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6 font-editorial-mono">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>

        <Card className="p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-current/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)] block mb-1">
                STANDARDIZED SKILL ASSESSMENT
              </span>
              <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase leading-tight">
                {assessment.title}
              </h1>
              <p className="text-xs opacity-75 mt-1 font-sans leading-relaxed">
                {assessment.description || 'Evaluate your practical and architectural competency to earn a verified credential badge.'}
              </p>
            </div>

            <div className="shrink-0 p-3 rounded border border-current/20 bg-current/5 text-center">
              <span className="text-[9px] uppercase opacity-50 block">Passing Benchmark</span>
              <span className="font-editorial-title text-xl font-bold text-emerald-600 dark:text-emerald-400">
                70% PASS
              </span>
            </div>
          </div>

          {/* Assessment Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded border border-current/10 bg-[var(--bg-page)]">
              <span className="opacity-50 text-[9px] uppercase block">Skill</span>
              <span className="font-bold">{assessment.skillName || 'Docker'}</span>
            </div>
            <div className="p-3 rounded border border-current/10 bg-[var(--bg-page)]">
              <span className="opacity-50 text-[9px] uppercase block">Difficulty</span>
              <span className="font-bold">{assessment.difficulty || 'Intermediate'}</span>
            </div>
            <div className="p-3 rounded border border-current/10 bg-[var(--bg-page)]">
              <span className="opacity-50 text-[9px] uppercase block">Total Questions</span>
              <span className="font-bold">{questions.length} Items</span>
            </div>
            <div className="p-3 rounded border border-current/10 bg-[var(--bg-page)]">
              <span className="opacity-50 text-[9px] uppercase block">Duration</span>
              <span className="font-bold">{assessment.durationMinutes || 15} Minutes</span>
            </div>
          </div>

          {/* Competencies Evaluated */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
              Competencies Evaluated in this Session
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              {[
                'Multi-stage Dockerfile layering & optimization',
                'Network isolation & bridge drivers',
                'Volume persistence & Postgres state',
                'Container security & non-root privileges'
              ].map((c) => (
                <div key={c} className="flex items-center gap-2 p-2 rounded bg-current/5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluation Rules Notice */}
          <div className="p-4 rounded border border-current/15 bg-current/5 text-xs font-sans space-y-1">
            <span className="font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)] block">
              Assessment Instructions & Constraints
            </span>
            <ul className="space-y-1 list-disc list-inside opacity-80 text-xs">
              <li>Once started, the timer will run continuously.</li>
              <li>You may navigate between questions and mark items for review.</li>
              <li>Scoring 70% or higher automatically converts your skill to 🟢 Verified on your Skill Passport.</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              iconRight={Play}
              onClick={() => setHasStarted(true)}
              className="w-full sm:w-auto text-xs px-6 py-2.5"
            >
              Start Assessment
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 2. ACTIVE ASSESSMENT SCREEN
  return (
    <div className="min-h-screen bg-inherit -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 flex flex-col font-sans">
      {/* Top Assessment Control Bar */}
      <div className="sticky top-0 z-30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-4 shadow-sm font-editorial-mono">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-current/25 bg-current/10 text-[var(--accent-terracotta)] font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-editorial-title text-base font-bold uppercase">{assessment.title}</h1>
            <p className="text-xs opacity-60">
              Question <span className="font-bold">{currentQuestionIndex + 1}</span> of{' '}
              <span className="font-bold">{questions.length}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
          {/* Timer Display */}
          <div
            className={`flex items-center gap-2 rounded px-3 py-1.5 font-editorial-mono text-sm font-bold border ${
              secondsRemaining < 180
                ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 animate-pulse'
                : 'border-current/20 bg-[var(--bg-page)]'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            loading={submitting}
            className="text-xs font-editorial-mono"
          >
            Finish & Submit
          </Button>
        </div>
      </div>

      {/* Main Assessment Testing Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left: Question Area & Answer Options */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 sm:p-8 shadow-2xs">
          <div>
            {/* Question Header & Review Flag */}
            <div className="flex items-center justify-between pb-4 border-b border-current/10 mb-6 font-editorial-mono">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <button
                type="button"
                onClick={handleToggleReview}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors ${
                  isMarked
                    ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-current/20 opacity-70 hover:opacity-100'
                }`}
              >
                <Flag className="h-3 w-3" />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Prompt */}
            <h2 className="text-base sm:text-lg font-semibold leading-relaxed mb-6 font-editorial-title uppercase text-left">
              {currentQ?.prompt}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3 font-editorial-mono">
              {currentQ?.options?.map((opt) => {
                const checked = isSelected === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex items-center gap-3.5 p-4 rounded border text-xs transition-all cursor-pointer ${
                      checked
                        ? 'border-[var(--accent-terracotta)] bg-current/10 font-bold shadow-2xs'
                        : 'border-current/20 hover:border-current/40 hover:bg-current/5'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold border transition-colors ${
                        checked
                          ? 'border-[var(--accent-terracotta)] bg-[var(--accent-terracotta)] text-white'
                          : 'border-current/25 bg-[var(--bg-page)]'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="leading-relaxed font-sans">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls: Previous, Next */}
          <div className="mt-8 pt-6 border-t border-current/10 flex items-center justify-between font-editorial-mono">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={ArrowLeft}
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                iconRight={ArrowRight}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                loading={submitting}
              >
                Submit Assessment
              </Button>
            )}
          </div>
        </div>

        {/* Right: Question Number Grid Sidebar */}
        <div className="lg:col-span-4 space-y-4 font-editorial-mono">
          <div className="rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Question Navigator</h3>
            <p className="text-[10px] opacity-60 mb-4 font-sans">Click any question number to navigate directly.</p>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const answered = Boolean(selectedAnswers[q.id]);
                const marked = Boolean(markedForReview[q.id]);
                const isCurrent = idx === currentQuestionIndex;

                let btnStyles = 'border-current/20 bg-current/5 opacity-70 hover:opacity-100';
                if (answered) {
                  btnStyles = 'border-emerald-600/40 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold';
                }
                if (marked) {
                  btnStyles = 'border-amber-400 bg-amber-400/20 text-amber-700 dark:text-amber-300 font-bold';
                }
                if (isCurrent) {
                  btnStyles += ' ring-2 ring-[var(--accent-terracotta)]';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded border text-xs font-semibold flex items-center justify-center transition-all ${btnStyles}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-current/10 space-y-2 text-[10px] opacity-70">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500" />
                <span>Answered ({Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded bg-amber-400" />
                <span>Marked for review ({Object.values(markedForReview).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded bg-current/20" />
                <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
              </div>
            </div>
          </div>

          {/* Integrity Note */}
          <div className="p-4 rounded border border-current/15 bg-current/5 text-[11px] opacity-60 flex items-start gap-2.5 font-sans">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-[var(--accent-terracotta)]" />
            <p>
              Standardized evaluation environment. Results are cryptographically linked to your verified Skill Passport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
