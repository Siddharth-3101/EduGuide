import React from 'react';

export const Skeleton = ({ className = '', rounded = 'rounded-md' }) => {
  return (
    <div className={`animate-pulse bg-slate-200/80 ${rounded} ${className}`} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-16" rounded="rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="pt-2 flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
      <Skeleton className="h-6 w-48 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8" rounded="rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-20" rounded="rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
};
