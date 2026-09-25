import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCareer } from '../../context/CareerContext';
import { careerApi } from '../../services/api/careerApi';
import { roadmapService } from '../../services/api/roadmapService';
import { BranchingRoadmapGraph } from '../../components/career/BranchingRoadmapGraph';
import { SkillGapAnalysisSection } from '../../components/career/SkillGapAnalysisSection';
import { RoadmapNode } from '../../components/career/RoadmapNode';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Map, Sparkles, Filter, ChevronRight, GitFork, ListOrdered, Target, ArrowRight } from 'lucide-react';

export const CareerRoadmapPage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { targetRoleId, selectTargetRole } = useCareer();

  const activeRoleId = roleId || targetRoleId || 'backend-developer';

  const [roles, setRoles] = useState([]);
  const [graphData, setGraphData] = useState(null);
  const [gapData, setGapData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' | 'milestones'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [rolesList, graph, gaps, roadmap] = await Promise.all([
          careerApi.getRoles(),
          roadmapService.getRoleGraph(activeRoleId),
          roadmapService.getSkillGapAnalysis(activeRoleId),
          careerApi.getRoleRoadmap(activeRoleId)
        ]);
        setRoles(rolesList);
        setGraphData(graph);
        setGapData(gaps);
        setRoadmapData(roadmap);
      } catch (err) {
        console.error('Roadmap error:', err);
        setError('Could not load career roadmap.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeRoleId]);

  const handleRoleChange = (newRoleId) => {
    selectTargetRole(newRoleId);
    navigate(`/career/${newRoleId}`);
  };

  if (error) {
    return <ErrorState message={error} onRetry={() => navigate(0)} />;
  }

  const stages = roadmapData?.stages || [];

  return (
    <div className="space-y-8">
      {/* Top Banner & Target Role Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-current/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-current/5 text-[var(--accent-terracotta)]">
              <Map className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
              BRANCHING COMPETENCY TREE
            </span>
          </div>
          <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase tracking-tight">
            {graphData?.roleTitle || 'Backend Developer'} Roadmap
          </h1>
          <p className="text-sm opacity-70 mt-1 max-w-2xl font-sans">
            Interactive skill graph and competency dependency tree mapped to production job requirements.
          </p>
        </div>

        {/* View Mode Toggle & Role Tabs */}
        <div className="flex flex-wrap items-center gap-2 font-editorial-mono text-xs">
          {/* Toggle between Graph & Milestones */}
          <div className="flex items-center p-0.5 rounded border border-current/20 bg-current/5 mr-2">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                viewMode === 'graph' ? 'bg-[var(--card-surface)] font-bold shadow-2xs border border-current/20' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <GitFork className="h-3.5 w-3.5" /> Graph View
            </button>
            <button
              onClick={() => setViewMode('milestones')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                viewMode === 'milestones' ? 'bg-[var(--card-surface)] font-bold shadow-2xs border border-current/20' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" /> Milestone View
            </button>
          </div>

          {/* Role selector */}
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id)}
              className={`px-3 py-1.5 rounded transition-all ${
                r.id === activeRoleId
                  ? 'bg-current/15 font-bold border border-current/25 shadow-2xs'
                  : 'border border-current/15 opacity-60 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              {r.title}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {/* Main Roadmap View */}
          {viewMode === 'graph' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between font-editorial-mono text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                  Interactive Competency Tree
                </span>
                <span className="text-[10px] opacity-60">
                  Pan & zoom supported · Click nodes to view gap matrix
                </span>
              </div>
              <BranchingRoadmapGraph graphData={graphData} />
            </div>
          ) : (
            /* Milestone Linear Fallback View */
            <div className="space-y-6">
              {stages.map((stage) => (
                <div key={stage.id} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-current/10">
                    <div>
                      <h3 className="font-editorial-title text-base font-bold uppercase">{stage.title}</h3>
                      <p className="text-xs opacity-70 mt-0.5">{stage.description}</p>
                    </div>
                    <span className="font-editorial-mono text-[11px] opacity-50">
                      {stage.competencies?.length} Competencies
                    </span>
                  </div>

                  <div className="pt-2">
                    {stage.competencies?.map((comp) => (
                      <RoadmapNode key={comp.id} competency={comp} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DEDICATED SKILL GAP ANALYSIS SECTION (Section 5 Requirement) */}
          <SkillGapAnalysisSection gapData={gapData} />
        </>
      )}
    </div>
  );
};
