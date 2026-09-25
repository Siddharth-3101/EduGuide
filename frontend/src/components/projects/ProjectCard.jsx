import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useNavigate } from 'react-router-dom';
import { Clock, FolderGit2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const isStarted = (project.progress || 0) > 0;
  const isSubmitted = project.status === 'Submitted';

  return (
    <Card className="flex flex-col justify-between h-full bg-white border border-slate-200">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <FolderGit2 className="h-4.5 w-4.5" />
            </span>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {project.difficulty}
              </span>
              <h4 className="text-base font-bold text-slate-900 leading-snug">{project.title}</h4>
            </div>
          </div>
          {isSubmitted ? (
            <Badge variant="verified">Submitted</Badge>
          ) : isStarted ? (
            <Badge variant="blue">{project.progress}% Complete</Badge>
          ) : (
            <Badge variant="slate">Recommended</Badge>
          )}
        </div>

        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Gap bridged info */}
        {project.skillGapBridged && (
          <div className="mt-3 text-[11px] bg-slate-50 border border-slate-100 p-2 rounded-lg text-slate-600">
            <span className="font-semibold text-slate-800">Bridges Gap: </span>
            <span>{project.skillGapBridged}</span>
          </div>
        )}

        {/* Skills practiced pills */}
        <div className="mt-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
            Skills Practiced
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.skills?.map((s) => (
              <span
                key={s}
                className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Progress bar if started */}
        {isStarted && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Practical Milestone Progress</span>
              <span className="font-semibold text-slate-800">{project.progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-slate-500">
          <Clock className="h-3.5 w-3.5 text-slate-400" /> {project.estimatedTime}
        </span>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            View Details
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            {isSubmitted ? 'View Submission' : isStarted ? 'Continue Project' : 'Start Project'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
