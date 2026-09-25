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
    <div className="relative overflow-hidden rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-lg text-[var(--accent-terracotta)]">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-editorial-mono font-bold text-[var(--accent-terracotta)] uppercase tracking-[0.2em]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-terracotta)]"></span>
                Next Recommended Step [01 // ACTION]
              </span>
            </div>
            <h3 className="font-editorial-title text-lg font-bold text-[var(--text-primary)] uppercase tracking-tight">{title}</h3>
            <p className="text-sm opacity-75 mt-1 max-w-xl leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="shrink-0 sm:self-center">
          <Button
            variant="primary"
            onClick={() => navigate(route)}
            iconRight={ArrowRight}
            className="w-full sm:w-auto"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};
