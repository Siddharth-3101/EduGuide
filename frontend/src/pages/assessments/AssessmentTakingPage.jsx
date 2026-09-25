import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../../services/api/assessmentApi';
import { Button } from '../../components/ui/Button';
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
  ChevronRight
} from 'lucide-react';

export const AssessmentTakingPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
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
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

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
      // Navigate to result page
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

  return (
    <div className="min-h-screen bg-slate-100/60 -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 flex flex-col font-sans">
      {/* Top Assessment Control Bar */}
      <div className="sticky top-0 z-30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">{assessment.title}</h1>
            <p className="text-xs text-slate-500">
              Question <span className="font-semibold text-slate-800">{currentQuestionIndex + 1}</span> of{' '}
              <span className="font-semibold text-slate-800">{questions.length}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
          {/* Timer Display */}
          <div
            className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 font-mono text-sm font-bold border ${
              secondsRemaining < 180
                ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                : 'bg-slate-50 text-slate-700 border-slate-200'
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
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
          >
            Finish & Submit
          </Button>
        </div>
      </div>

      {/* Main Assessment Testing Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left: Question Area & Answer Options */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div>
            {/* Question Header & Review Flag */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Question {currentQuestionIndex + 1}
              </span>
              <button
                type="button"
                onClick={handleToggleReview}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  isMarked
                    ? 'bg-amber-50 text-amber-700 border-amber-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Flag className="h-3.5 w-3.5" />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Prompt */}
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed mb-6 font-mono text-left">
              {currentQ?.prompt}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ?.options?.map((opt) => {
                const checked = isSelected === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex items-center gap-3.5 p-4 rounded-xl border text-sm transition-all cursor-pointer ${
                      checked
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 text-blue-900 font-medium'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 bg-white text-slate-800'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold border transition-colors ${
                        checked
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 text-slate-600 bg-slate-50'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="leading-relaxed">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls: Previous, Next */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Button
              variant="secondary"
              size="md"
              icon={ArrowLeft}
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="md"
                iconRight={ArrowRight}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={handleSubmit}
                loading={submitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Submit Assessment
              </Button>
            )}
          </div>
        </div>

        {/* Right: Question Number Grid Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Question Navigator</h3>
            <p className="text-xs text-slate-500 mb-4">Click any question number to jump directly.</p>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const answered = Boolean(selectedAnswers[q.id]);
                const marked = Boolean(markedForReview[q.id]);
                const isCurrent = idx === currentQuestionIndex;

                let btnStyles = 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100';
                if (answered) {
                  btnStyles = 'border-blue-600 bg-blue-600 text-white font-bold';
                }
                if (marked) {
                  btnStyles = 'border-amber-400 bg-amber-100 text-amber-800 font-bold ring-2 ring-amber-300';
                }
                if (isCurrent) {
                  btnStyles += ' ring-2 ring-slate-900 ring-offset-1';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-lg border text-xs font-semibold flex items-center justify-center transition-all ${btnStyles}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-blue-600" />
                <span>Answered ({Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-amber-200 border border-amber-400" />
                <span>Marked for review ({Object.values(markedForReview).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-slate-100 border border-slate-200" />
                <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
              </div>
            </div>
          </div>

          {/* Honor Code & Security Indicator */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <p>
              Anti-cheat monitoring active. Tab switches and window blurs are registered during standardized evaluations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
