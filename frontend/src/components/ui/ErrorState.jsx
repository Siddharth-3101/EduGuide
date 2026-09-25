import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an error loading this information. Please try again.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`p-6 sm:p-8 rounded-xl border border-rose-200 bg-rose-50/50 text-center flex flex-col items-center justify-center ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} icon={RefreshCw} size="sm">
          Retry
        </Button>
      )}
    </div>
  );
};
