import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div
          className={`w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-[var(--card-surface)] p-6 text-left align-middle shadow-2xl transition-all border border-[var(--border-line)] text-[var(--text-primary)] relative animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
            <h3 className="text-lg font-bold font-editorial-title uppercase tracking-tight text-[var(--text-primary)]">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 opacity-60 hover:opacity-100 hover:bg-current/10 text-[var(--text-primary)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};
