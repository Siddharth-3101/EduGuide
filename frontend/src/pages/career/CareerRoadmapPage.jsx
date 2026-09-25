import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCareer } from '../../context/CareerContext';
import { careerApi } from '../../services/api/careerApi';
import { RoadmapNode } from '../../components/career/RoadmapNode';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { Map, Sparkles, Filter, ChevronRight, CheckCircle2 } from 'lucide-react';

export const CareerRoadmapPage = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  const { targetRoleId, selectTargetRole } = useCareer();

  const activeRoleId = roleId || targetRoleId || 'backend-developer';

  const [roles, setRoles] = useState([]);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'verified' | 'partial' | 'missing'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rolesList, roadmap] = await Promise.all([
          careerApi.getRoles(),
          careerApi.getRoleRoadmap(activeRoleId)
        ]);
        setRoles(rolesList);
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
    <div className="space-y-6">
      {/* Top Banner & Role Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
              <Map className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Competency Roadmap
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            {roadmapData?.roleTitle || 'Backend Developer'} Roadmap
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Milestones and competencies required for production-level readiness.
          </p>
        </div>

        {/* Role Selector Pill Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                r.id === activeRoleId
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Roadmap Timeline Stages */}
          <div className="lg:col-span-8 space-y-8">
            {/* Status Filter Bar */}
            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-slate-400" /> Filter Nodes:
              </span>
              <div className="flex items-center gap-1.5">
                {['all', 'verified', 'partial', 'missing'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`capitalize px-2.5 py-1 rounded-md font-medium transition-colors ${
                      filterStatus === st
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {stages.map((stage) => {
              const filteredCompetencies = stage.competencies.filter((c) => {
                if (filterStatus === 'all') return true;
                return c.status === filterStatus;
              });

              if (filteredCompetencies.length === 0) return null;

              return (
                <div key={stage.id} className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{stage.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{stage.description}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {filteredCompetencies.length} Competencies
                    </span>
                  </div>

                  <div className="pt-2">
                    {filteredCompetencies.map((comp) => (
                      <RoadmapNode key={comp.id} competency={comp} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sidebar: Coverage Summary & Recommended Action */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-white border border-slate-200">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
                Roadmap Coverage Benchmark
              </h3>
              <div className="flex items-center justify-between my-2">
                <div>
                  <span className="text-2xl font-bold text-slate-900">
                    {roadmapData?.coverageStats?.coverage || 67}%
                  </span>
                  <p className="text-xs text-slate-500">Toward Verified Readiness</p>
                </div>
                <CircularProgress
                  value={roadmapData?.coverageStats?.coverage || 67}
                  size={75}
                  strokeWidth={7}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Verified
                  </span>
                  <span className="font-semibold text-slate-800">
                    {roadmapData?.coverageStats?.verified || 8}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span> Partial Gaps
                  </span>
                  <span className="font-semibold text-slate-800">
                    {roadmapData?.coverageStats?.partial || 3}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span> Missing Nodes
                  </span>
                  <span className="font-semibold text-slate-800">
                    {roadmapData?.coverageStats?.missing || 4}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-b from-blue-50/70 to-white border border-blue-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                  Critical Gap
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                Docker & Containers missing
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Take the Docker assessment to advance your coverage from 67% to 76% instantly.
              </p>
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="primary"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate('/assessments/asm-docker')}
                >
                  Verify Docker Competency
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
