import React from 'react';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 text-white font-bold">
            <Compass className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-slate-800">SkillBridge</span>
          <span>— Bridge the gap between your skills and your career.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link to="/career" className="hover:text-slate-900 transition-colors">Career Roadmap</Link>
          <Link to="/skills" className="hover:text-slate-900 transition-colors">Skill Library</Link>
          <Link to="/assessments" className="hover:text-slate-900 transition-colors">Assessments</Link>
          <Link to="/jobs" className="hover:text-slate-900 transition-colors">Job Matching</Link>
          <Link to="/portfolio" className="hover:text-slate-900 transition-colors">Skill Passport</Link>
        </div>
      </div>
    </footer>
  );
};
