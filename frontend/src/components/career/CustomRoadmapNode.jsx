import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

export const CustomRoadmapNode = memo(({ data, selected }) => {
  const isRoot = data.isRoot;
  const isVerified = data.status === 'verified';
  const isPartial = data.status === 'partial';
  const isRecommendedNext = data.status === 'recommended-next' || data.isRecommendedNext;
  const isMissing = data.status === 'missing';

  const getBorderAndBg = () => {
    if (isRoot) {
      return 'border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-page)] shadow-md';
    }
    if (isRecommendedNext) {
      return 'border-blue-600 dark:border-blue-400 bg-blue-500/10 text-[var(--text-primary)] ring-2 ring-blue-500/30 shadow-sm';
    }
    if (isVerified) {
      return 'border-emerald-600/40 bg-emerald-500/10 text-[var(--text-primary)]';
    }
    if (isPartial) {
      return 'border-amber-600/40 bg-amber-500/10 text-[var(--text-primary)]';
    }
    return 'border-rose-600/40 bg-rose-500/10 text-[var(--text-primary)]';
  };

  const getStatusBadge = () => {
    if (isRoot) {
      return <span className="text-[9px] uppercase font-bold tracking-widest opacity-80">Target Milestone</span>;
    }
    if (isRecommendedNext) {
      return (
        <span className="flex items-center gap-1 text-[9px] font-bold text-blue-600 dark:text-blue-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping" />
          RECOMMENDED NEXT
        </span>
      );
    }
    if (isVerified) {
      return (
        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          VERIFIED ({data.score || 89}%)
        </span>
      );
    }
    if (isPartial) {
      return (
        <span className="flex items-center gap-1 text-[9px] font-bold text-amber-600 dark:text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          PARTIAL
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[9px] font-bold text-rose-600 dark:text-rose-400">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        NOT VERIFIED
      </span>
    );
  };

  return (
    <div
      className={`min-w-[170px] max-w-[210px] rounded-md border p-3 font-editorial-mono transition-all duration-200 cursor-pointer ${getBorderAndBg()} ${
        selected ? 'ring-2 ring-[var(--accent-terracotta)] scale-105 shadow-md' : 'hover:scale-[1.02]'
      }`}
    >
      {/* Top Handle for Incoming Edges */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-[var(--border-line)] !w-2 !h-2"
        />
      )}

      {/* Header status */}
      <div className="flex items-center justify-between pb-1.5 border-b border-current/10 mb-1.5">
        {getStatusBadge()}
        {data.category && !isRoot && (
          <span className="text-[8px] opacity-50 uppercase tracking-tighter truncate max-w-[70px]">
            {data.category}
          </span>
        )}
      </div>

      {/* Node Title */}
      <h4
        className={`font-bold leading-tight uppercase ${
          isRoot ? 'text-base font-editorial-title' : 'text-xs font-editorial-title'
        }`}
      >
        {data.label}
      </h4>

      {/* Levels info */}
      {!isRoot && (
        <div className="mt-2 pt-1.5 border-t border-current/10 text-[9px] space-y-0.5 opacity-80 font-sans">
          <div className="flex justify-between">
            <span className="opacity-60">Required:</span>
            <span className="font-semibold">{data.requiredLevel || 'Intermediate'}</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-60">Current:</span>
            <span className="font-semibold">{data.currentLevel || 'None'}</span>
          </div>
        </div>
      )}

      {/* Bottom Action Hint */}
      {!isRoot && (
        <div className="mt-2 pt-1 border-t border-current/10 flex items-center justify-between text-[9px] font-bold text-[var(--accent-terracotta)]">
          <span>Inspect Node</span>
          <ArrowRight className="h-2.5 w-2.5" />
        </div>
      )}

      {/* Bottom Handle for Outgoing Edges */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-[var(--border-line)] !w-2 !h-2"
      />
    </div>
  );
});
CustomRoadmapNode.displayName = 'CustomRoadmapNode';
