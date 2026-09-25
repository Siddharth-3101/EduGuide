import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { Clock, HelpCircle, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';

export const AssessmentCard = ({ assessment }) => {
  const navigate = useNavigate();

  const isCompleted = assessment.status === 'Completed';
  const isInProgress = assessment.status === 'In Progress';

  return (
    <Card className="flex flex-col justify-between h-full border border-slate-200 bg-white">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {assessment.category}
            </span>
            <h4 className="text-base font-bold text-slate-900 leading-snug">{assessment.title}</h4>
          </div>
          {isCompleted ? (
            <Badge variant="verified">Completed</Badge>
          ) : isInProgress ? (
            <Badge variant="partial">In Progress</Badge>
          ) : (
            <Badge variant="slate">Not Started</Badge>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
          {assessment.description}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Questions</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <HelpCircle className="h-3 w-3 text-slate-400" />
              {assessment.questionCount} Qs
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Time</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3 text-slate-400" />
              {assessment.durationMinutes} Mins
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Difficulty</span>
            <span className="font-semibold text-slate-800 mt-0.5 block">{assessment.difficulty}</span>
          </div>
        </div>

        {isCompleted && assessment.score && (
          <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs">
            <span className="text-emerald-800 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Verified Score
            </span>
            <span className="font-bold text-emerald-700 text-sm">{assessment.score}%</span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        {isCompleted ? (
          <>
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={() => navigate(`/assessments/${assessment.id}`)}
            >
              Retake
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/assessments/${assessment.id}/result`)}
            >
              View Result
            </Button>
          </>
        ) : isInProgress ? (
          <Button
            variant="primary"
            size="sm"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            iconRight={ArrowRight}
            onClick={() => navigate(`/assessments/${assessment.id}`)}
          >
            Resume Assessment
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
            iconRight={ArrowRight}
            onClick={() => navigate(`/assessments/${assessment.id}`)}
          >
            Start Assessment
          </Button>
        )}
      </div>
    </Card>
  );
};
