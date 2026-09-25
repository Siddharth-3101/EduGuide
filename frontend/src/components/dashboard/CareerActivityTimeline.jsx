import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, Award, FolderGit2, Target, Clock } from 'lucide-react';

export const CareerActivityTimeline = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'assessment_completed':
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case 'skill_verified':
        return <Award className="h-4 w-4 text-blue-600" />;
      case 'project_submitted':
        return <FolderGit2 className="h-4 w-4 text-indigo-600" />;
      case 'recommendation':
        return <Target className="h-4 w-4 text-amber-600" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Card className="bg-white border border-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Recent Career Activity</h3>
          <p className="text-xs text-slate-500 mt-0.5">Verification events, project milestones and suggestions</p>
        </div>
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Timeline</span>
      </div>

      <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            {/* Timeline node dot */}
            <div className="absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-white shadow-xs">
              {getIcon(act.type)}
            </div>

            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-semibold text-slate-900">{act.title}</h4>
                <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
