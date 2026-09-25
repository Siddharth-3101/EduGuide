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
      className={`bg-white rounded-xl border border-slate-200 shadow-xs transition-all duration-200 ${
        hoverEffect ? 'hover:border-slate-300 hover:shadow-sm cursor-pointer' : ''
      } ${padding} ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => {
  return (
    <div className={`flex items-start justify-between gap-4 pb-4 border-b border-slate-100 mb-4 ${className}`}>
      <div>
        <h3 className="text-base font-semibold text-slate-900 leading-snug">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
