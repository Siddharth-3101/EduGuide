import React from 'react';

export const CircularProgress = ({
  value = 67,
  size = 110,
  strokeWidth = 9,
  label = 'Coverage',
  color = 'var(--accent-terracotta)',
  trackColor = 'currentColor',
  trackOpacity = 0.12
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value, 0), 100);
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeOpacity={trackOpacity}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-editorial-title text-xl font-bold tracking-tight leading-none text-[var(--text-primary)]">{value}%</span>
        {label && <span className="font-editorial-mono text-[9px] font-semibold opacity-60 mt-0.5 uppercase tracking-wider">{label}</span>}
      </div>
    </div>
  );
};
