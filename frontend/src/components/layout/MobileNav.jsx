import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Layers, MessagesSquare, Briefcase } from 'lucide-react';

export const MobileNav = () => {
  const items = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Roadmap', path: '/career', icon: Map },
    { label: 'Skills', path: '/skills', icon: Layers },
    { label: 'Interviews', path: '/interviews', icon: MessagesSquare },
    { label: 'Jobs', path: '/jobs', icon: Briefcase },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-current/15 bg-[var(--card-surface)]/95 px-2 backdrop-blur-md lg:hidden font-editorial-mono text-[10px]">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-2 py-1 uppercase tracking-wider transition-colors ${
                isActive ? 'text-[var(--accent-terracotta)] font-bold' : 'opacity-60 hover:opacity-100'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
