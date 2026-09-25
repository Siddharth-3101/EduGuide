import React from 'react';

export const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    verified: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30',
    partial: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30',
    missing: 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30',
    blue: 'bg-current/10 text-current border-current/25',
    terracotta: 'bg-[#7c4422]/15 text-[#7c4422] dark:text-amber-400 border-[#7c4422]/30',
    default: 'bg-current/5 text-current border-current/20',
  };

  const statusIcons = {
    verified: '●',
    partial: '◐',
    missing: '○'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm font-editorial-mono text-[10px] uppercase tracking-wider font-semibold border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {statusIcons[variant] && (
        <span className="text-[9px] leading-none opacity-80">{statusIcons[variant]}</span>
      )}
      {children}
    </span>
  );
};
