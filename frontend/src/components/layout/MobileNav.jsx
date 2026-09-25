import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Layers, CheckSquare, Briefcase } from 'lucide-react';

export const MobileNav = () => {
  const items = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Roadmap', path: '/career', icon: Map },
    { label: 'Skills', path: '/skills', icon: Layers },
    { label: 'Assess', path: '/assessments', icon: CheckSquare },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-2 py-1 text-[11px] font-medium transition-colors ${
                isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`
            }
          >
            <Icon className="h-4.5 w-4.5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
