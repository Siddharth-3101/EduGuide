import React from 'react';

export const Button = ({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'terracotta'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  icon,
  iconLeft,
  iconRight: IconRight,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const Icon = icon || iconLeft;
  const baseStyles = 'inline-flex items-center justify-center font-editorial-mono uppercase tracking-wider font-semibold transition-all duration-150 rounded-sm focus:outline-none disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99] select-none';

  const sizes = {
    sm: 'text-[11px] px-2.5 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5',
  };

  const variants = {
    primary: 'bg-[#1d1b19] text-[#f4efe6] dark:bg-[#f4efe6] dark:text-[#121110] hover:opacity-90 shadow-2xs border border-transparent',
    secondary: 'bg-[var(--card-surface)] text-inherit border border-[var(--border-line)] hover:border-current/40 shadow-2xs',
    outline: 'border border-current/25 text-inherit hover:bg-current/5',
    ghost: 'opacity-70 hover:opacity-100 hover:bg-current/5',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 shadow-2xs',
    terracotta: 'bg-[#7c4422] dark:bg-amber-600 text-white hover:opacity-90 shadow-2xs'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      ) : null}
      
      {children}

      {!loading && IconRight && (
        <IconRight className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      )}
    </button>
  );
};
