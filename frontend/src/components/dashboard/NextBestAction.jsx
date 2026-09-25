import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export const NextBestAction = ({ action }) => {
  const navigate = useNavigate();

  const title = action?.title || 'Complete Docker Verification';
  const description =
    action?.description ||
    'Verifying Docker could improve your match with several backend roles by up to 14%.';
  const buttonText = action?.buttonText || 'Start Assessment';
  const route = action?.route || '/assessments/asm-docker';
  const icon = action?.icon || '🎯';

  return (
    <div className="relative overflow-hidden rounded-xl border border-blue-200/90 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-white p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-lg shadow-xs text-white">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                <Sparkles className="h-3 w-3" /> Your Next Best Action
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="shrink-0 sm:self-center">
          <Button
            variant="primary"
            onClick={() => navigate(route)}
            iconRight={ArrowRight}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 shadow-sm"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
