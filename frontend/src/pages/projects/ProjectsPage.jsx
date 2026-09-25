import React, { useState, useEffect } from 'react';
import { projectApi } from '../../services/api/projectApi';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { FolderGit2, Sparkles } from 'lucide-react';

export const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
    fetchProjects();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
            <FolderGit2 className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Practical Evidence Stack
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Gap-Bridging Projects
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real software systems engineered to bridge identified gaps in your target career roadmap.
        </p>
      </div>

      {/* Featured Callout */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-slate-50 border border-blue-200 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
            💡
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Portfolio Proof Over Resume Text</h4>
            <p className="text-xs text-slate-600">
              Recruiters prioritize candidates with reproducible GitHub repositories and verified test suites.
            </p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {error ? (
        <ErrorState message={error} onRetry={() => navigate(0)} />
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
