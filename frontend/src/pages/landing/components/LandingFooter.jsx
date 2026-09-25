import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Heart } from 'lucide-react';

export const LandingFooter = () => {
  return (
    <footer className="relative z-10 border-t border-[var(--border-line)] bg-[var(--bg-page)] text-[var(--text-primary)] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent-terracotta)]/40 bg-[var(--accent-terracotta)]/10 text-[var(--accent-terracotta)]">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="font-editorial-title text-lg font-extrabold tracking-tight uppercase">
                SKILLSYNC AI
              </span>
            </div>

            <p className="text-xs opacity-75 max-w-sm leading-relaxed font-sans">
              “Turn your skills into a career path.” The career intelligence operating system benchmarked against real employer competencies.
            </p>

            <div className="text-[11px] font-editorial-mono opacity-50">
              © {new Date().getFullYear()} SkillSync AI Systems. Built for technical career readiness.
            </div>
          </div>

          {/* Core Modules Links */}
          <div className="md:col-span-3 space-y-3 font-editorial-mono text-xs">
            <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--accent-terracotta)] block mb-1">
              Platform Modules
            </span>
            <ul className="space-y-2 opacity-75">
              <li>
                <Link to="/career" className="hover:text-[var(--accent-terracotta)] hover:underline">
                  AI Career Roadmap
                </Link>
              </li>
              <li>
                <Link to="/skills" className="hover:text-[var(--accent-terracotta)] hover:underline">
                  Verified Skills Audit
                </Link>
              </li>
              <li>
                <Link to="/assessments" className="hover:text-[var(--accent-terracotta)] hover:underline">
                  Standardized Assessments
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-[var(--accent-terracotta)] hover:underline">
                  GitHub Project Evidence
                </Link>
              </li>
            </ul>
          </div>

          {/* Intelligence & Resources */}
          <div className="md:col-span-4 space-y-3 font-editorial-mono text-xs">
            <span className="font-bold text-[10px] uppercase tracking-wider text-[var(--accent-terracotta)] block mb-1">
              Ecosystem & Preparedness
            </span>
            <ul className="space-y-2 opacity-75">
              <li>
                <Link to="/jobs" className="hover:text-[var(--accent-terracotta)] hover:underline">
                  Normalized Job Matching
                </Link>
              </li>
              <li>
                <Link to="/interviews" className="hover:text-[var(--accent-terracotta)] hover:underline">
                  Collaborative Interviews
                </Link>
              </li>
              <li>
                <Link to="/learning" className="hover:text-[var(--accent-terracotta)] hover:underline">
                  Prerequisite Learning
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-[var(--accent-terracotta)] hover:underline">
                  Public Skill Passport
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
