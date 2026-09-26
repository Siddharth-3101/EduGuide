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
  const [pathways, setPathways] = useState([]);
  const [activePathwayId, setActivePathwayId] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [gapData, setGapData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [viewMode, setViewMode] = useState('graph'); // 'graph' | 'milestones'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [rolesList, pathwaysList] = await Promise.all([
          careerApi.getRoles(),
          careerApi.getPathways(activeRoleId)
        ]);
        if (isCancelled) return;
        setRoles(rolesList || []);
        setPathways(pathwaysList || []);

        const initialPathwayId = pathwaysList && pathwaysList.length > 0 ? pathwaysList[0].id : null;
        setActivePathwayId(initialPathwayId);

        const [graph, gaps, roadmap] = await Promise.all([
          roadmapService.getRoleGraph(activeRoleId, initialPathwayId),
          roadmapService.getSkillGapAnalysis(activeRoleId, initialPathwayId),
          careerApi.getRoleRoadmap(activeRoleId, initialPathwayId)
        ]);
        if (isCancelled) return;
        setGraphData(graph);
        setGapData(gaps);
        setRoadmapData(roadmap);
      } catch (err) {
        if (!isCancelled) {
          console.error('Roadmap error:', err);
          setError('Could not load career roadmap.');
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { isCancelled = true; };
  }, [activeRoleId]);

  const handleRoleChange = (newRoleId) => {
    selectTargetRole(newRoleId);
    navigate(`/career/${newRoleId}`);
  };

  const handlePathwayChange = async (pathwayId) => {
    if (pathwayId === activePathwayId) return;
    setActivePathwayId(pathwayId);
    try {
      setLoading(true);
      const [graph, roadmap, gaps] = await Promise.all([
        roadmapService.getRoleGraph(activeRoleId, pathwayId),
        careerApi.getRoleRoadmap(activeRoleId, pathwayId),
        roadmapService.getSkillGapAnalysis(activeRoleId, pathwayId)
      ]);
      setGraphData(graph);
      setRoadmapData(roadmap);
      setGapData(gaps);
    } catch (err) {
      console.error('Error switching pathway:', err);
    } finally {
      setLoading(false);
    }
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
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              {graphData?.roleTitle || 'Backend Developer'} Roadmap
            </h1>
            {activeRoleId === targetRoleId ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-editorial-mono text-[10px] font-bold">
                ✓ Primary Target Career
              </span>
            ) : (
              <button
                onClick={() => selectTargetRole(activeRoleId)}
                className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[var(--accent-terracotta)] text-white font-editorial-mono text-[10px] font-bold shadow-2xs hover:opacity-90 transition-opacity cursor-pointer"
                title="Designate this career path as your primary target on Dashboard and Jobs"
              >
                ★ Set as My Primary Target
              </button>
            )}
          </div>
          <p className="text-sm opacity-70 mt-1 max-w-2xl font-sans">
            Interactive skill graph and competency dependency tree mapped to production job requirements.
          </p>
        </div>

        {/* View Mode Toggle & Role Tabs */}
        <div className="flex flex-wrap items-center gap-2 font-editorial-mono text-xs">
          {/* Toggle between Graph, Skill Gaps, & Milestones */}
          <div className="flex items-center p-0.5 rounded border border-current/20 bg-current/5 mr-2">
            <button
              onClick={() => setViewMode('graph')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                viewMode === 'graph' ? 'bg-[var(--card-surface)] font-bold shadow-2xs border border-current/20 text-[var(--accent-terracotta)]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <GitFork className="h-3.5 w-3.5" /> Graph View
            </button>
            <button
              onClick={() => setViewMode('gaps')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                viewMode === 'gaps' ? 'bg-[var(--card-surface)] font-bold shadow-2xs border border-current/20 text-[var(--accent-terracotta)]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Skill Gap Analyzer
            </button>
            <button
              onClick={() => setViewMode('milestones')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                viewMode === 'milestones' ? 'bg-[var(--card-surface)] font-bold shadow-2xs border border-current/20 text-[var(--accent-terracotta)]' : 'opacity-60 hover:opacity-100'
              }`}
            >
              <ListOrdered className="h-3.5 w-3.5" /> Milestone View
            </button>
          </div>

          {/* Role selector dropdown on small screens & buttons on larger */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            <select
              value={activeRoleId}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="md:hidden text-xs font-editorial-mono bg-[var(--card-surface)] text-[var(--text-primary)] border border-current/20 rounded-lg px-2.5 py-1.5 font-bold cursor-pointer"
            >
              {roles.map((r) => {
                const rSlug = r.roleId || r.id;
                return (
                  <option key={rSlug} value={rSlug}>
                    {r.title}
                  </option>
                );
              })}
            </select>

            <div className="hidden md:flex flex-wrap items-center gap-1.5">
              {roles.map((r) => {
                const rSlug = r.roleId || r.id;
                const isSelected = rSlug === activeRoleId || r.id === activeRoleId;
                return (
                  <button
                    key={rSlug}
                    onClick={() => handleRoleChange(rSlug)}
                    className={`px-3 py-1.5 rounded text-xs font-editorial-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--accent-terracotta)] text-white font-bold shadow-2xs'
                        : 'border border-current/15 opacity-70 hover:opacity-100 hover:bg-current/5'
                    }`}
                  >
                    {r.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Specialization Track Selector */}
      {pathways && pathways.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 p-3.5 rounded-xl border border-current/15 bg-current/[0.02]">
          <span className="font-editorial-mono text-xs font-bold uppercase tracking-wider text-[var(--accent-terracotta)] flex items-center gap-1.5 mr-1">
            <GitFork className="h-3.5 w-3.5" /> Specialization Tracks:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {pathways.map((pw) => {
              const isSelected = pw.id === activePathwayId;
              return (
                <button
                  key={pw.id}
                  onClick={() => handlePathwayChange(pw.id)}
                  className={`text-xs px-3 py-1.5 rounded-full font-editorial-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--accent-terracotta)] text-white font-bold shadow-xs'
                      : 'border border-current/20 opacity-70 hover:opacity-100 hover:bg-current/10'
                  }`}
                >
                  <span>{pw.title || pw.name}</span>
                  {pw.stageCount ? (
                    <span className="text-[10px] opacity-80 px-1.5 py-0.2 rounded-full bg-black/20">
                      {pw.stageCount} stages
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {/* Main Roadmap Views */}
          {viewMode === 'graph' ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between font-editorial-mono text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                    Interactive Competency Tree
                  </span>
                  <span className="text-[10px] opacity-60">
                    Pan & zoom supported · Click nodes to view gap matrix
                  </span>
                </div>
                <BranchingRoadmapGraph key={`${activeRoleId}-${activePathwayId || 'default'}`} graphData={graphData} />
              </div>

              {/* DEDICATED SKILL GAP ANALYSIS SECTION */}
              <SkillGapAnalysisSection gapData={gapData} />
            </div>
          ) : viewMode === 'gaps' ? (
            <div className="space-y-6">
              <SkillGapAnalysisSection gapData={gapData} />
            </div>
          ) : (
            /* Milestone Linear Fallback View */
            <div className="space-y-6">
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

              <SkillGapAnalysisSection gapData={gapData} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
