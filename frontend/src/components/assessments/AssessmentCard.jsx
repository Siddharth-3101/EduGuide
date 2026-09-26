import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, ArrowRight, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

export const AssessmentCard = ({ assessment }) => {
  const navigate = useNavigate();

  const isCompleted = assessment.status === 'Completed';
  const isInProgress = assessment.status === 'In Progress';
  const qCount = assessment.questionsCount || assessment.questionCount || assessment.questions?.length || 5;
  const duration = assessment.duration || (assessment.durationMinutes ? `${assessment.durationMinutes} Mins` : '15 Mins');

  return (
    <Card className="flex flex-col justify-between h-full border border-[var(--border-line)] bg-[var(--card-surface)] text-[var(--text-primary)] hover:border-[var(--accent-terracotta)]/50 transition-all shadow-2xs rounded-xl p-5">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
              {assessment.category || 'Core Engineering'}
            </span>
            <h4 className="text-base font-bold font-editorial-title uppercase tracking-tight leading-snug mt-0.5">
              {assessment.title}
            </h4>
          </div>
          {isCompleted ? (
            <Badge variant="verified">Verified</Badge>
          ) : isInProgress ? (
            <Badge variant="partial">In Progress</Badge>
          ) : (
            <Badge variant="default">Proctored</Badge>
          )}
        </div>

        <p className="text-xs font-editorial-mono opacity-70 mt-1 line-clamp-2 leading-relaxed">
          {assessment.description}
        </p>

        <div className="mt-4 pt-3 border-t border-current/10 grid grid-cols-3 gap-2 text-xs font-editorial-mono">
          <div>
            <span className="text-[10px] uppercase font-bold opacity-60 block">Questions</span>
            <span className="font-semibold flex items-center gap-1 mt-0.5">
              <HelpCircle className="h-3 w-3 opacity-60" />
              {qCount} Qs
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold opacity-60 block">Time</span>
            <span className="font-semibold flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3 opacity-60" />
              {duration}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold opacity-60 block">Passing</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {assessment.passScore || 70}%
            </span>
          </div>
        </div>

        {isCompleted && assessment.score && (
          <div className="mt-3 p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs font-editorial-mono">
            <span className="text-emerald-700 dark:text-emerald-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Score Achieved
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{assessment.score}%</span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between gap-2">
        {isCompleted ? (
          <>
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => navigate(`/assessments/${assessment.id}`)}
              className="text-xs font-editorial-mono"
            >
              Retake
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/assessments/${assessment.id}/result`)}
              className="text-xs font-editorial-mono"
            >
              View Result
            </Button>
          </>
        ) : isInProgress ? (
          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs font-editorial-mono"
            iconRight={ArrowRight}
            onClick={() => navigate(`/assessments/${assessment.id}`)}
          >
            Resume Evaluation
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full text-xs font-editorial-mono"
            iconRight={ArrowRight}
            onClick={() => navigate(`/assessments/${assessment.id}`)}
          >
            Take Assessment
          </Button>
        )}
      </div>
    </Card>
  );
};
