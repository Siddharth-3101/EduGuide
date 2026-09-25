import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-current/15 bg-[var(--card-surface)] py-8 px-4 sm:px-6 relative z-10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs opacity-70">
        <div className="flex items-center gap-2.5">
          <span className="font-editorial-mono text-[10px] font-bold tracking-[0.2em] px-1.5 py-0.5 rounded border border-current/25">
            S / B
          </span>
          <span className="font-editorial-title font-bold tracking-tight uppercase">SkillBridge</span>
          <span className="hidden md:inline font-editorial-serif italic text-sm opacity-80">
            — bridge the gap between your skills and your career, verified whole.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5 font-editorial-mono text-[11px] uppercase tracking-wider">
          <Link to="/career" className="hover:text-[var(--accent-terracotta)] transition-colors">Roadmap</Link>
          <Link to="/skills" className="hover:text-[var(--accent-terracotta)] transition-colors">Skills</Link>
          <Link to="/assessments" className="hover:text-[var(--accent-terracotta)] transition-colors">Assessments</Link>
          <Link to="/jobs" className="hover:text-[var(--accent-terracotta)] transition-colors">Matching</Link>
          <Link to="/portfolio" className="hover:text-[var(--accent-terracotta)] transition-colors">Passport</Link>
        </div>
      </div>
    </footer>
  );
};
