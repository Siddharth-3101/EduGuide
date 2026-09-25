import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  FolderGit2,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Code2,
  FileCheck2,
  Sparkles
} from 'lucide-react';

export const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-editorial-mono text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            🟢 Verified
          </span>
        );
      case 'Evidence Identified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-editorial-mono text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            🟡 Evidence Identified
          </span>
        );
      case 'Under Review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-editorial-mono text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            🔵 Under Review
          </span>
        );
      case 'Submitted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-editorial-mono text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            🟣 Submitted
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-editorial-mono text-[10px] font-bold uppercase tracking-wider bg-current/5 border border-current/10 opacity-70">
            ⚪ Recommended
          </span>
        );
    }
  };

  return (
    <Card className="flex flex-col justify-between h-full bg-[var(--card-surface)] border border-[var(--border-line)] text-[var(--text-primary)] hover:border-[var(--accent-terracotta)]/50 transition-all shadow-2xs">
      <div>
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2 pb-3 border-b border-current/10">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)]">
              <FolderGit2 className="h-4 w-4" />
            </span>
            <div>
              <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider opacity-60">
                {project.projectType || 'Project Stack'} • {project.difficulty}
              </span>
              <h4 className="text-base font-bold font-editorial-title leading-snug">
                {project.title}
              </h4>
            </div>
          </div>
          <div className="shrink-0">
            {getStatusBadge(project.evidenceStatus || project.status)}
          </div>
        </div>

        <p className="text-xs opacity-75 mt-2 line-clamp-2 leading-relaxed">
          {project.shortDescription}
        </p>

        {/* Bridges gap */}
        {project.skillGapBridged && (
          <div className="mt-3 text-[11px] font-editorial-mono bg-current/5 border border-current/10 p-2 rounded text-xs">
            <span className="opacity-60 uppercase tracking-wider font-bold">Bridges Gap: </span>
            <span className="font-semibold text-[var(--accent-terracotta)]">{project.skillGapBridged}</span>
          </div>
        )}

        {/* Detected technologies or skills */}
        <div className="mt-4">
          <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider opacity-60 block mb-1.5">
            Technologies & Competencies
          </span>
          <div className="flex flex-wrap gap-1.5">
            {(project.detectedTechnologies || project.skills)?.map((s) => (
              <span
                key={s}
                className="inline-flex items-center px-2 py-0.5 rounded bg-[var(--bg-page)] border border-current/15 text-[11px] font-editorial-mono font-medium opacity-90"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Skill Evidence connection preview */}
        {project.skillEvidence && project.skillEvidence.length > 0 && (
          <div className="mt-3.5 pt-3 border-t border-current/10 space-y-1.5">
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)] block">
              Skill Evidence Mapped:
            </span>
            {project.skillEvidence.slice(0, 1).map((ev, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-current/5 p-2 rounded">
                <span className="font-semibold font-editorial-mono text-[11px]">{ev.skill}</span>
                <span className="text-[10px] font-editorial-mono opacity-80">{ev.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-current/10 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 font-editorial-mono text-[11px] opacity-70">
          <Clock className="h-3.5 w-3.5" /> {project.estimatedTime}
        </span>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            Details
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/projects/${project.id}`)}
            iconRight={ArrowRight}
          >
            Inspect Evidence
          </Button>
        </div>
      </div>
    </Card>
  );
};
