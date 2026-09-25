import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-[var(--card-surface)] text-inherit rounded-md border border-[var(--border-line)] shadow-2xs transition-all duration-200 ${
        hoverEffect ? 'hover:border-[var(--accent-terracotta)] hover:shadow-xs cursor-pointer' : ''
      } ${padding} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-4 pb-4 border-b border-current/10 mb-4 ${className}`}>
      <div>
        <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight leading-snug">{title}</h3>
        {subtitle && <p className="font-editorial-serif text-sm italic opacity-75 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
