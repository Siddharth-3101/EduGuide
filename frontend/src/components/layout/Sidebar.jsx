import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  Layers,
  CheckSquare,
  BookOpen,
  FolderGit2,
  Briefcase,
  Award,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { stats } = useCareer();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Career Roadmap', path: '/career', icon: Map, badge: 'Target' },
    { label: 'Skills', path: '/skills', icon: Layers },
    { label: 'Assessments', path: '/assessments', icon: CheckSquare, badge: '1 Due' },
    { label: 'Learning', path: '/learning', icon: BookOpen },
    { label: 'Projects', path: '/projects', icon: FolderGit2 },
    { label: 'Jobs', path: '/jobs', icon: Briefcase, badge: '78% Match' },
    { label: 'Skill Passport', path: '/portfolio', icon: Award }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-slate-200 bg-white p-4 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Main Navigation Links */}
          <div>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Career Journey
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => onClose && onClose()}
                    className={({ isActive }) =>
                      `group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-slate-900 text-white font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4.5 w-4.5 transition-colors ${
                              isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Target Goal Summary widget */}
        <div className="rounded-xl border border-blue-100 bg-gradient-to-b from-blue-50/60 to-white p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Career Target
            </span>
            <span className="text-xs font-bold text-slate-900">{stats?.competencyCoverage || 67}%</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 truncate">
            {stats?.targetRoleTitle || 'Backend Developer'}
          </p>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${stats?.competencyCoverage || 67}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>{stats?.verifiedCount || 8} Verified</span>
            <NavLink to="/career" className="text-blue-600 hover:underline inline-flex items-center gap-0.5">
              Roadmap <ChevronRight className="h-3 w-3" />
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};
