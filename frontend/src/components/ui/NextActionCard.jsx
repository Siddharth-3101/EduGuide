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
  variant = 'highlight', // 'highlight' | 'default' | 'compact'
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
    <div className="relative overflow-hidden rounded-xl border border-blue-200/90 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
            {icon ? icon : <Sparkles className="h-5 w-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 uppercase tracking-wider">
                {badge}
              </span>
            </div>
            <h4 className="text-base font-semibold text-slate-900 leading-snug">{title}</h4>
            <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">{description}</p>
          </div>
        </div>

        <div className="shrink-0 sm:self-center">
          <Button
            variant="primary"
            onClick={handleAction}
            iconRight={ArrowRight}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs"
          >
            {actionText}
          </Button>
        </div>
      </div>
    </div>
  );
};
