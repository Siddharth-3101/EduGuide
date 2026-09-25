import React from 'react';

export const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    verified: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    partial: 'bg-amber-50 text-amber-700 border-amber-200/80',
    missing: 'bg-rose-50 text-rose-700 border-rose-200/80',
    blue: 'bg-blue-50 text-blue-700 border-blue-200/80',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    default: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const statusIcons = {
    verified: '●',
    partial: '◐',
    missing: '○'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {statusIcons[variant] && (
        <span className="text-[10px] leading-none opacity-80">{statusIcons[variant]}</span>
      )}
      {children}
    </span>
  );
};
