import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, AlertTriangle, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export const HorizontalSkillNode = memo(({ data, selected }) => {
  const isVerified = data.status === 'verified';
  const isPartial = data.status === 'partial';
  const isNotVerified = data.status === 'missing' || data.status === 'not-verified';
  const isRecommendedNext = !!data.isRecommendedNext;

  // Styling based on status
  const getContainerStyle = () => {
    if (isRecommendedNext) {
      return 'border-blue-500/70 bg-[var(--card-surface)] ring-2 ring-blue-500/40 shadow-md';
    }
    if (isVerified) {
      return 'border-emerald-500/40 bg-[var(--card-surface)] hover:border-emerald-500/80 shadow-2xs';
    }
    if (isPartial) {
      return 'border-amber-500/40 bg-[var(--card-surface)] hover:border-amber-500/80 shadow-2xs';
    }
    return 'border-rose-500/30 bg-[var(--card-surface)] hover:border-rose-500/60 opacity-90 shadow-2xs';
  };

  const getStatusBadge = () => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-editorial-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
          VERIFIED
        </span>
      );
    }
    if (isPartial) {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400 font-editorial-mono">
          <span className="h-2 w-2 rounded-full bg-amber-500 inline-block" />
          PARTIAL
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 dark:text-rose-400 font-editorial-mono">
        <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" />
        NOT VERIFIED
      </span>
    );
  };

  return (
    <div
      className={`relative w-[210px] rounded-lg border p-3.5 font-editorial-mono transition-all duration-200 cursor-pointer ${getContainerStyle()} ${
        selected ? 'ring-2 ring-[var(--accent-terracotta)] scale-[1.03] shadow-lg' : 'hover:scale-[1.02]'
      }`}
    >
      {/* Left Input Handle (Prerequisites flow in from the Left) */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-[var(--border-line)] !w-2.5 !h-2.5 !border-2 !border-[var(--card-surface)] -ml-1"
      />

      {/* Recommended Next Floating Highlight Badge */}
      {isRecommendedNext && (
        <div className="absolute -top-3 left-3 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
          RECOMMENDED NEXT
        </div>
      )}

      {/* Status Row */}
      <div className="flex items-center justify-between pb-1.5 border-b border-current/10 mb-1.5">
        {getStatusBadge()}
        <span className="text-[9px] opacity-50 uppercase tracking-tighter truncate max-w-[80px]">
          {data.category}
        </span>
      </div>

      {/* Skill Name */}
      <h4 className="font-editorial-title text-sm font-bold uppercase tracking-tight text-[var(--text-primary)] leading-tight">
        {data.name}
      </h4>

      {/* Current Level vs Required Level */}
      <div className="mt-2.5 pt-1.5 border-t border-current/10 text-[10px] font-sans space-y-0.5 opacity-80">
        <div className="flex justify-between">
          <span className="opacity-60 font-editorial-mono text-[9px] uppercase">Current:</span>
          <span className={`font-semibold ${isVerified ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
            {data.currentLevel || 'None'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="opacity-60 font-editorial-mono text-[9px] uppercase">Required:</span>
          <span className="font-semibold text-[var(--text-primary)]">
            {data.requiredLevel || 'Intermediate'}
          </span>
        </div>
      </div>

      {/* Bottom Inspect Action */}
      <div className="mt-2.5 pt-1.5 border-t border-current/10 flex items-center justify-between text-[9px] font-bold text-[var(--accent-terracotta)]">
        <span>Inspect Node</span>
        <ArrowRight className="h-2.5 w-2.5" />
      </div>

      {/* Right Output Handle (Unlocked Skills flow out to the Right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-[var(--border-line)] !w-2.5 !h-2.5 !border-2 !border-[var(--card-surface)] -mr-1"
      />
    </div>
  );
});
HorizontalSkillNode.displayName = 'HorizontalSkillNode';
