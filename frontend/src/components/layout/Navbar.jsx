import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';
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
  const { stats, targetRoleId } = useCareer();
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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 sm:px-6 backdrop-blur-sm">
      {/* Left: Mobile hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle Navigation"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-xs">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
                SkillBridge
              </span>
              <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                PRO
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Center: Search / Target Context */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50/80 px-3 py-1 text-xs text-slate-600">
          <span className="font-medium text-slate-500">Target Role:</span>
          <span className="font-semibold text-slate-900">
            {stats?.targetRoleTitle || 'Backend Developer'}
          </span>
          <span className="text-slate-300">|</span>
          <span className="font-medium text-emerald-600 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            {stats?.competencyCoverage || 67}% Coverage
          </span>
        </div>
      </div>

      {/* Right: Actions & User Menu */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Next Best Action Link */}
        <Link
          to="/assessments/asm-docker"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Verify Docker</span>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-lg z-50 animate-in fade-in duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Recent Activity</span>
                <span className="text-[10px] text-blue-600 hover:underline cursor-pointer">Mark read</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <p className="font-medium text-slate-900">Python Assessment Verified</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Scored 89% — competency added to passport.</p>
                </div>
                <div className="p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                  <p className="font-medium text-blue-900">New High-Match Job</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">TechNova posted Backend Developer (78% match).</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow-xs">
              {user?.fullName
                ? user.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                : 'AC'}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-semibold text-slate-900 leading-tight">
                {user?.fullName || 'Alex Chen'}
              </p>
              <p className="text-[10px] text-slate-500">Student</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg z-50 animate-in fade-in duration-100">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">{user?.fullName || 'Alex Chen'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'alex.chen@university.edu'}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  My Profile
                </Link>

                <Link
                  to="/portfolio"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                    <span>Skill Passport</span>
                  </div>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Settings className="h-3.5 w-3.5 text-slate-400" />
                  Settings
                </Link>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
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
