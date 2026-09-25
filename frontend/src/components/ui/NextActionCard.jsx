import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export const NextActionCard = ({
  badge = 'Recommended Next Action',
  title = 'Complete Docker Verification',
  description = 'Verifying Docker will bridge your primary backend gap and increase job match rate.',
  actionText = 'Start Assessment',
  actionRoute = '/assessments/asm-docker',
  onActionClick,
  variant = 'highlight',
  icon
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onActionClick) {
      onActionClick();
    } else if (actionRoute) {
      navigate(actionRoute);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-md border border-[var(--border-line)] bg-current/5 p-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          {/* Survey coordinate marker dot */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#7c4422] dark:bg-amber-600 text-white shadow-xs">
            {icon ? icon : <Sparkles className="h-4 w-4" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-editorial-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#7c4422] dark:text-amber-400">
                {badge}
              </span>
            </div>
            <h4 className="font-editorial-title text-base sm:text-lg font-bold uppercase tracking-tight leading-snug">
              {title}
            </h4>
            <p className="font-editorial-serif text-sm italic opacity-80 mt-1 max-w-xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="shrink-0 sm:self-center">
          <Button
            variant="terracotta"
            onClick={handleAction}
            iconRight={ArrowRight}
            className="w-full sm:w-auto"
          >
            {actionText}
          </Button>
        </div>
      </div>
    </div>
  );
};
