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
        className={`fixed top-16 bottom-0 left-0 z-40 flex w-64 flex-col justify-between border-r border-current/15 bg-inherit backdrop-blur-md p-4 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Main Navigation Links */}
          <div>
            <p className="px-3 text-[10px] font-editorial-mono font-semibold uppercase tracking-[0.2em] opacity-50 mb-3">
              JOURNEY INDEX
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
                      `group flex items-center justify-between rounded px-3 py-2 text-xs font-editorial-mono uppercase tracking-wider transition-all ${
                        isActive
                          ? 'bg-current/10 text-current font-bold border border-current/20 shadow-2xs'
                          : 'opacity-70 hover:opacity-100 hover:bg-current/5'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-4 w-4 transition-colors ${
                              isActive ? 'opacity-100 text-[#7c4422] dark:text-amber-400' : 'opacity-60 group-hover:opacity-90'
                            }`}
                          />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-editorial-mono font-semibold uppercase ${
                              isActive
                                ? 'bg-current/15'
                                : 'bg-current/10 opacity-80'
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
        <div className="rounded border border-current/15 bg-current/5 p-4 space-y-2 font-editorial-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7c4422] dark:bg-amber-400" /> TARGET
            </span>
            <span className="font-bold">{stats?.competencyCoverage || 67}%</span>
          </div>
          <p className="font-editorial-title font-bold text-sm tracking-tight uppercase truncate">
            {stats?.targetRoleTitle || 'Backend Developer'}
          </p>
          <div className="h-1 w-full overflow-hidden rounded-full bg-current/15">
            <div
              className="h-full bg-[#7c4422] dark:bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${stats?.competencyCoverage || 67}%` }}
            />
          </div>
          <div className="pt-1 flex items-center justify-between text-[10px] opacity-60">
            <span>{stats?.verifiedCount || 8} Verified</span>
            <NavLink to="/career" className="hover:underline inline-flex items-center gap-0.5 font-bold">
              Roadmap <ChevronRight className="h-3 w-3" />
            </NavLink>
          </div>
        </div>
      </aside>
    </>
  );
};
