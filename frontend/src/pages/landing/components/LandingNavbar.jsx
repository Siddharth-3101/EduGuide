import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { Sparkles, ArrowRight, Cpu, Compass } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-[var(--border-line)] bg-[var(--bg-page)]/85 px-6 lg:px-12 backdrop-blur-md transition-colors duration-300">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent-terracotta)]/40 bg-[var(--accent-terracotta)]/10 text-[var(--accent-terracotta)] transition-transform group-hover:scale-105">
          <Cpu className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-editorial-title text-base sm:text-lg font-extrabold tracking-tight uppercase">
              SKILLSYNC AI
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 rounded bg-[var(--accent-terracotta)]/15 border border-[var(--accent-terracotta)]/30 px-1.5 py-0.2 text-[9px] font-editorial-mono font-bold text-[var(--accent-terracotta)] uppercase tracking-wider">
              CAREER OS
            </span>
          </div>
          <span className="hidden lg:block text-[10px] opacity-60 font-sans -mt-0.5">
            Turn your skills into a career path.
          </span>
        </div>
      </Link>

      {/* Navigation links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-editorial-mono uppercase tracking-[0.14em] opacity-80">
        <a href="#how-it-works" className="hover:opacity-100 hover:text-[var(--accent-terracotta)] transition-colors">
          Ecosystem
        </a>
        <a href="#skill-intelligence" className="hover:opacity-100 hover:text-[var(--accent-terracotta)] transition-colors">
          Intelligence
        </a>
        <a href="#roadmap" className="hover:opacity-100 hover:text-[var(--accent-terracotta)] transition-colors">
          AI Graph
        </a>
        <a href="#jobs" className="hover:opacity-100 hover:text-[var(--accent-terracotta)] transition-colors">
          Job Matches
        </a>
        <a href="#interviews" className="hover:opacity-100 hover:text-[var(--accent-terracotta)] transition-colors">
          Interviews
        </a>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          title={isDark ? "Switch to Warm Parchment Theme" : "Switch to Midnight Blueprint Theme"}
          className="h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-current/20 opacity-80 hover:opacity-100 mr-1"
        >
          {isDark ? (
            <svg className="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>

        <Link
          to="/dashboard"
          className="hidden sm:inline-block text-xs font-editorial-mono font-medium opacity-80 hover:opacity-100 px-3 py-1.5 uppercase tracking-wider"
        >
          Dashboard
        </Link>

        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/career')}
          iconRight={ArrowRight}
          className="text-xs font-bold"
        >
          Build My Career Path
        </Button>
      </div>
    </header>
  );
};
