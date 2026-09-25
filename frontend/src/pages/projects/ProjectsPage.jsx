import React, { useState, useEffect } from 'react';
import { projectApi } from '../../services/api/projectApi';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { AddProjectModal } from '../../components/projects/AddProjectModal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import {
  FolderGit2,
  Plus,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
  GitBranch,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectApi.getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError('Could not load recommended projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectAdded = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const filteredProjects = projects.filter((p) => {
    if (filterStatus === 'All') return true;
    return (p.evidenceStatus || p.status) === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Add Project CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)]">
              <FolderGit2 className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-editorial-mono font-bold text-[var(--accent-terracotta)] uppercase tracking-[0.2em]">
              Section 08 // Practical Evidence Stack
            </span>
          </div>
          <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold tracking-tight uppercase">
            Project Evidence & GitHub Analysis
          </h1>
          <p className="text-sm opacity-70 mt-1 max-w-2xl leading-relaxed">
            Real software systems engineered to bridge identified career gaps. Submit GitHub repositories to extract verifiable proof of technical competence.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            iconLeft={Plus}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Project
          </Button>
        </div>
      </div>

      {/* Principle Callout */}
      <div className="p-4 rounded-md bg-[var(--card-surface)] border border-[var(--border-line)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] font-bold text-sm">
            💡
          </div>
          <div>
            <h4 className="font-editorial-title text-sm font-bold uppercase tracking-tight text-[var(--text-primary)]">
              Core Architecture Principle: Evidence vs Verification
            </h4>
            <p className="text-xs opacity-75 mt-0.5 max-w-2xl">
              "Projects provide technical evidence; standardized assessments verify competency." Document analysis parses README files and code to identify skills, directing you to rapid verification assessments.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-editorial-mono opacity-80 self-end md:self-center">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>RAG Pipeline Ready</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-current/10 pb-3 overflow-x-auto text-xs font-editorial-mono">
        {['All', 'Evidence Identified', 'Under Review', 'Verified'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
              filterStatus === tab
                ? 'bg-[var(--accent-terracotta)] text-white font-bold'
                : 'bg-current/5 hover:bg-current/10 opacity-70 hover:opacity-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {error ? (
        <ErrorState message={error} onRetry={fetchProjects} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProjectAdded={handleProjectAdded}
      />
    </div>
  );
};
