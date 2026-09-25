import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Target, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const TargetCareerNode = memo(({ data, selected }) => {
  const isCompleted = data.isCompleted || (data.verifiedSkillsCount >= data.totalSkillsCount);

  return (
    <div
      className={`relative w-[230px] rounded-xl border-2 p-4 font-editorial-mono transition-all duration-300 ${
        isCompleted
          ? 'border-emerald-500 bg-emerald-500/10 text-[var(--text-primary)] shadow-xl ring-4 ring-emerald-500/20'
          : 'border-[var(--accent-terracotta)] bg-[var(--card-surface)] text-[var(--text-primary)] shadow-lg'
      } ${selected ? 'scale-105 ring-2 ring-[var(--accent-terracotta)]' : 'hover:scale-[1.02]'}`}
    >
      {/* Left Input Handle from last branches */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-[var(--accent-terracotta)] !w-3 !h-3 !border-2 !border-[var(--card-surface)] -ml-1.5"
      />

      {/* Target Milestone Header Badge */}
      <div className="flex items-center justify-between pb-2 border-b border-current/15 mb-2">
        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
          <Target className="h-3 w-3" />
          TARGET CAREER
        </span>
        <Award className="h-4 w-4 text-[var(--accent-terracotta)] opacity-80" />
      </div>

      {/* Career Title */}
      <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight leading-tight text-[var(--text-primary)]">
        {data.title || 'Backend Developer'}
      </h3>

      <p className="text-[10px] font-sans opacity-70 mt-1 leading-snug">
        Ultimate career objective unlocked upon verifying prerequisite branches.
      </p>

      {/* Progress Breakdown */}
      <div className="mt-3 pt-2 border-t border-current/15 space-y-1.5">
        <div className="flex justify-between items-center text-[10px]">
          <span className="opacity-60">Verified Competencies:</span>
          <span className="font-bold text-[var(--accent-terracotta)]">
            {data.verifiedSkillsCount || 5} / {data.totalSkillsCount || 11}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full rounded-full bg-current/10 overflow-hidden">
          <div
            className="h-full bg-[var(--accent-terracotta)] rounded-full transition-all duration-500"
            style={{ width: `${Math.round(((data.verifiedSkillsCount || 5) / (data.totalSkillsCount || 11)) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[9px] opacity-75 font-editorial-mono">
          <span>{Math.round(((data.verifiedSkillsCount || 5) / (data.totalSkillsCount || 11)) * 100)}% Complete</span>
          <span>{isCompleted ? 'Ready for Roles!' : 'In Progress'}</span>
        </div>
      </div>
    </div>
  );
});
TargetCareerNode.displayName = 'TargetCareerNode';
