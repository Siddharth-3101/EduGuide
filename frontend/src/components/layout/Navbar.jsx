import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Compass,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { stats } = useCareer();
  const { isDark, toggleTheme, themeMode, setThemeMode } = useTheme();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-current/15 px-4 sm:px-8 backdrop-blur-md transition-colors duration-300">
      {/* Left: Mobile hamburger & Editorial Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-1.5 opacity-70 hover:opacity-100 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <span className="font-editorial-mono text-xs font-bold tracking-[0.2em] px-2 py-1 rounded border border-current/25">
            S / B
          </span>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-editorial-title text-base font-bold tracking-tight uppercase">
                SkillBridge
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Center: Target Context & Crescent Moon Theme Toggle (from reference design) */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 rounded-full border border-current/20 px-3.5 py-1 text-xs font-editorial-mono">
          <span className="opacity-60">TARGET:</span>
          <span className="font-bold">
            {stats?.targetRoleTitle || 'Backend Developer'}
          </span>
          <span className="opacity-30">|</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            {stats?.competencyCoverage || 67}% Coverage
          </span>
        </div>

        {/* The Exact Crescent Moon ☾ Theme Toggle from reference image */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark/Light Blueprint Mode"
          title={isDark ? "Switch to Warm Parchment Theme" : "Switch to Midnight Blueprint Theme"}
          className="h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-current/20 opacity-80 hover:opacity-100"
        >
          {isDark ? (
            <svg className="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Right: Actions & User Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Next Best Action Link with subtle coordinate tag style */}
        <Link
          to="/assessments/asm-docker"
          className="hidden sm:inline-flex items-center gap-1.5 rounded border border-current/25 px-2.5 py-1 text-xs font-editorial-mono font-medium hover:bg-current/10 transition-colors"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#7c4422] dark:bg-amber-400"></span>
          <span>Verify Docker</span>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded p-2 opacity-70 hover:opacity-100 hover:bg-current/10 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[var(--accent-terracotta)] ring-2 ring-[var(--bg-page)]"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-3 shadow-lg z-50 animate-in fade-in duration-100 text-[var(--text-primary)]">
              <div className="flex items-center justify-between pb-2 border-b border-current/10 mb-2 font-editorial-mono">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">Recent Activity</span>
                <span className="text-[10px] text-[var(--accent-terracotta)] hover:underline cursor-pointer">Mark read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded border border-current/10 bg-[var(--bg-page)]/70">
                  <p className="font-editorial-title font-semibold uppercase">Python Assessment Verified</p>
                  <p className="opacity-70 text-[11px] mt-0.5 font-sans">Scored 89% — competency added to passport.</p>
                </div>
                <div className="p-2 rounded border border-current/10 bg-[var(--bg-page)]/70">
                  <p className="font-editorial-title font-semibold uppercase text-[var(--accent-terracotta)]">New High-Match Job</p>
                  <p className="opacity-70 text-[11px] mt-0.5 font-sans">TechNova posted Backend Developer (78% match).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded p-1.5 hover:bg-current/10 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded border border-current/25 bg-current/10 text-xs font-editorial-mono font-bold shadow-2xs">
              {user?.fullName
                ? user.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                : 'AC'}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-editorial-title font-semibold uppercase leading-tight">
                {user?.fullName || 'Alex Chen'}
              </p>
              <p className="text-[10px] font-editorial-mono opacity-50">Student</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] py-1.5 shadow-lg z-50 animate-in fade-in duration-100 text-[var(--text-primary)]">
              <div className="px-3.5 py-2 border-b border-current/10">
                <p className="text-xs font-editorial-title font-bold uppercase">{user?.fullName || 'Alex Chen'}</p>
                <p className="text-[11px] font-editorial-mono opacity-60 truncate">{user?.email || 'alex.chen@university.edu'}</p>
              </div>

              <div className="py-1 font-editorial-mono text-xs">
                <Link
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 opacity-80 hover:opacity-100 hover:bg-current/10"
                >
                  <User className="h-3.5 w-3.5 opacity-60" />
                  My Profile
                </Link>

                <Link
                  to="/portfolio"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2 opacity-80 hover:opacity-100 hover:bg-current/10"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
                    <span>Skill Passport</span>
                  </div>
                  <ExternalLink className="h-3 w-3 opacity-50" />
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 opacity-80 hover:opacity-100 hover:bg-current/10"
                >
                  <Settings className="h-3.5 w-3.5 opacity-60" />
                  Settings
                </Link>
              </div>

              {/* Theme Selector inside profile menu */}
              <div className="border-t border-current/10 px-3.5 py-2 font-editorial-mono text-[11px]">
                <p className="opacity-50 uppercase tracking-widest text-[9px] mb-1.5">Theme Preference</p>
                <div className="grid grid-cols-3 gap-1 p-0.5 rounded border border-current/20 bg-current/5">
                  <button
                    onClick={() => setThemeMode('light')}
                    className={`py-1 rounded text-center transition-all ${
                      themeMode === 'light' ? 'bg-[var(--card-surface)] font-bold shadow-2xs border border-current/20' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setThemeMode('dark')}
                    className={`py-1 rounded text-center transition-all ${
                      themeMode === 'dark' ? 'bg-[var(--card-surface)] font-bold shadow-2xs border border-current/20' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setThemeMode('system')}
                    className={`py-1 rounded text-center transition-all ${
                      themeMode === 'system' ? 'bg-[var(--card-surface)] font-bold shadow-2xs border border-current/20' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div className="border-t border-current/10 pt-1 font-editorial-mono text-xs">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
