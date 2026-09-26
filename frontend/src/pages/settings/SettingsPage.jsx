import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import {
  Settings,
  User,
  Bell,
  Lock,
  Briefcase,
  Share2,
  Check,
  Globe,
  Sliders
} from 'lucide-react';

const GithubIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [savedNotice, setSavedNotice] = useState(false);

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Sharing', icon: Lock },
    { id: 'career', label: 'Career Preferences', icon: Briefcase },
    { id: 'connected', label: 'Connected Accounts', icon: Share2 }
  ];

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
            <Settings className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Configuration
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Account Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials, notifications, and public passport permissions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Tabs Sidebar */}
        <div className="lg:col-span-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Body Surface */}
        <div className="lg:col-span-9">
          <Card className="bg-white border border-slate-200 p-6 sm:p-8">
            {savedNotice && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Settings preferences updated successfully.</span>
              </div>
            )}

            {/* TAB: Account */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Account Security</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Change password and recovery emails.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button variant="primary" onClick={handleSave}>
                    Update Password
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Notification Channels</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Select when you want to receive alerts.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-blue-600" />
                    <div>
                      <span className="font-semibold text-slate-900 block">Assessment Results & Verification Badges</span>
                      <span className="text-slate-500">Instant notification when a submitted test or project passes.</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-blue-600" />
                    <div>
                      <span className="font-semibold text-slate-900 block">High-Match Job Alerts (80%+)</span>
                      <span className="text-slate-500">Weekly digest of roles matching your verified skills.</span>
                    </div>
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button variant="primary" onClick={handleSave}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Public Visibility</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Control how recruiters see your Skill Passport.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-900 block">Public Skill Passport URL</span>
                      <span className="text-slate-500">Allow employers to view your verified scores with public link.</span>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded accent-blue-600 h-4 w-4" />
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="font-semibold text-slate-900 block">Anonymous Recruiter Browsing</span>
                      <span className="text-slate-500">Hide your university name until mutual invitation.</span>
                    </div>
                    <input type="checkbox" className="rounded accent-blue-600 h-4 w-4" />
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button variant="primary" onClick={handleSave}>
                    Save Privacy Settings
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: Career Preferences */}
            {activeTab === 'career' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Career Targets & Locations</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Used to calculate your competency coverage and job matches.</p>
                </div>

                <div className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Role</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white">
                      <option>Backend Developer</option>
                      <option>Cloud Engineer</option>
                      <option>Software Engineer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Workplace Model</label>
                    <select className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white">
                      <option>Hybrid & Remote</option>
                      <option>Remote Only</option>
                      <option>On-site Only</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button variant="primary" onClick={handleSave}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* TAB: Connected Accounts */}
            {activeTab === 'connected' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Connected Accounts</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Integrate developer platforms for automated verification.</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GithubIcon className="h-6 w-6 text-slate-900" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">GitHub</h4>
                        <p className="text-[11px] text-slate-500">Connected as @siddharth-g (3 repositories verified)</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      Disconnect
                    </Button>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">LinkedIn</h4>
                        <p className="text-[11px] text-slate-500">Sync certificates and export passport badges</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
