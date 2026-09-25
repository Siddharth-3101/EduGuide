import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FolderGit2,
  Briefcase,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Code2
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export const HeroSection = () => {
  const navigate = useNavigate();

  // Interactive node graph state
  const [selectedNode, setSelectedNode] = useState({
    id: 'docker',
    name: 'Docker & Containers',
    status: 'missing',
    category: 'DevOps / Cloud',
    requiredLevel: 'Intermediate',
    currentLevel: 'None',
    gapImportance: 'High (Required by 72% of target roles)',
    recommendedAction: 'Take Docker Assessment or Build Containerized Project'
  });

  const nodes = [
    { id: 'python', name: 'Python', status: 'verified', level: 'Advanced (89%)', x: 20, y: 35 },
    { id: 'sql', name: 'SQL & Relational DB', status: 'verified', level: 'Advanced (91%)', x: 38, y: 15 },
    { id: 'rest', name: 'REST API & OpenAPI', status: 'verified', level: 'Advanced (94%)', x: 50, y: 40 },
    { id: 'spring', name: 'Spring Boot', status: 'partial', level: 'Beginner (In Progress)', x: 72, y: 22 },
    { id: 'redis', name: 'Redis Caching', status: 'partial', level: 'Beginner (Evidence Found)', x: 30, y: 72 },
    { id: 'docker', name: 'Docker & Containers', status: 'missing', level: 'Missing Competency', x: 65, y: 68 },
    { id: 'aws', name: 'AWS Cloud Services', status: 'recommended', level: 'Recommended Next Step', x: 86, y: 55 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return {
          badge: '🟢 Verified',
          dot: 'bg-emerald-500',
          border: 'border-emerald-500/40',
          bg: 'bg-emerald-500/10',
          text: 'text-emerald-700 dark:text-emerald-400'
        };
      case 'partial':
        return {
          badge: '🟡 Partial',
          dot: 'bg-amber-500',
          border: 'border-amber-500/40',
          bg: 'bg-amber-500/10',
          text: 'text-amber-700 dark:text-amber-400'
        };
      case 'missing':
        return {
          badge: '🔴 Missing Gap',
          dot: 'bg-rose-500',
          border: 'border-rose-500/40',
          bg: 'bg-rose-500/10',
          text: 'text-rose-700 dark:text-rose-400'
        };
      case 'recommended':
        return {
          badge: '🔵 Recommended Next',
          dot: 'bg-blue-500',
          border: 'border-blue-500/40',
          bg: 'bg-blue-500/10',
          text: 'text-blue-700 dark:text-blue-400'
        };
      default:
        return {
          badge: '⚪ Pending',
          dot: 'bg-slate-400',
          border: 'border-slate-400/40',
          bg: 'bg-slate-500/10',
          text: 'text-slate-500'
        };
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[var(--border-line)] cyber-grid">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[var(--accent-terracotta)]/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Top Tagline pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[var(--accent-terracotta)]/40 bg-[var(--card-surface)]/90 px-4 py-1.5 text-xs font-editorial-mono tracking-wider shadow-xs backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[var(--accent-terracotta)] animate-pulse"></span>
            <span className="font-bold text-[var(--accent-terracotta)]">AI CAREER OPERATING SYSTEM</span>
            <span className="opacity-40">•</span>
            <span className="opacity-75">Autonomous Competency Engine</span>
          </div>
        </motion.div>

        {/* Hero Title & One-sentence Value Proposition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 text-center max-w-4xl mx-auto"
        >
          <h1 className="font-editorial-title text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.08] uppercase">
            Turn your skills into a <span className="font-editorial-serif italic font-normal tracking-normal lowercase text-[var(--accent-terracotta)]">career path.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed font-sans">
            SkillSync AI continuously audits your verified competencies, pinpoints precise skill gaps against live employer benchmarks, and orchestrates an interactive branching pathway straight into high-match opportunities.
          </p>

          {/* Primary CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/career')}
              iconRight={ArrowRight}
              className="w-full sm:w-auto font-bold text-sm px-8 shadow-sm ai-glow-terracotta"
            >
              Build My Career Path
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/skills')}
              className="w-full sm:w-auto text-sm font-editorial-mono"
            >
              Audit My Verified Skills
            </Button>
          </div>
        </motion.div>

        {/* Central Visual Identity: Interactive Competency Graph Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 max-w-5xl mx-auto rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)]/95 shadow-xl backdrop-blur-md overflow-hidden"
        >
          {/* Graph Cockpit Header */}
          <div className="px-5 py-3.5 border-b border-current/10 flex flex-wrap items-center justify-between gap-3 bg-current/[0.02]">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="font-editorial-mono text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                Live Interactive Competency Graph // Target: Backend Developer
              </span>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-editorial-mono">
              <span className="flex items-center gap-1.5 opacity-90">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Verified (8)
              </span>
              <span className="flex items-center gap-1.5 opacity-90">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span> Partial (3)
              </span>
              <span className="flex items-center gap-1.5 opacity-90">
                <span className="h-2 w-2 rounded-full bg-rose-500"></span> Missing (4)
              </span>
              <span className="flex items-center gap-1.5 opacity-90">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span> Next Step
              </span>
            </div>
          </div>

          {/* Interactive Graph Canvas */}
          <div className="p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Graph Visualization Area */}
            <div className="lg:col-span-8 relative h-[360px] sm:h-[400px] rounded-lg border border-current/10 bg-[var(--bg-page)]/80 cyber-grid overflow-hidden flex items-center justify-center">
              {/* Connecting SVG SVG Branches */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-current opacity-20">
                <line x1="25%" y1="35%" x2="50%" y2="40%" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="38%" y1="15%" x2="50%" y2="40%" strokeWidth="2" />
                <line x1="50%" y1="40%" x2="72%" y2="22%" strokeWidth="2" />
                <line x1="50%" y1="40%" x2="65%" y2="68%" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="25%" y1="35%" x2="30%" y2="72%" strokeWidth="2" strokeDasharray="3 3" />
                <line x1="65%" y1="68%" x2="86%" y2="55%" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* Render Graph Nodes */}
              {nodes.map((node) => {
                const colors = getStatusColor(node.status);
                const isSelected = selectedNode?.id === node.id;

                return (
                  <button
                    key={node.id}
                    onClick={() =>
                      setSelectedNode({
                        id: node.id,
                        name: node.name,
                        status: node.status,
                        category: node.id === 'docker' ? 'DevOps / Cloud' : 'Backend Stack',
                        requiredLevel: 'Intermediate',
                        currentLevel: node.status === 'verified' ? 'Advanced' : node.status === 'partial' ? 'Beginner' : 'None',
                        gapImportance: node.status === 'missing' ? 'High Priority' : 'Standard',
                        recommendedAction: node.status === 'missing' ? 'Take Assessment to bridge gap' : 'View Verified Proof'
                      })
                    }
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[var(--accent-terracotta)] bg-[var(--card-surface)] scale-110 shadow-lg z-20'
                        : `${colors.border} ${colors.bg} hover:scale-105 z-10`
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`h-2 w-2 rounded-full ${colors.dot}`}></span>
                      <span className="font-editorial-mono text-[9px] uppercase font-bold opacity-75">
                        {colors.badge}
                      </span>
                    </div>
                    <span className="font-editorial-title font-bold text-xs block text-[var(--text-primary)]">
                      {node.name}
                    </span>
                    <span className="text-[10px] opacity-70 block font-editorial-mono">
                      {node.level}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Node Detail Inspection Drawer Card */}
            <div className="lg:col-span-4 p-5 rounded-lg border border-current/15 bg-[var(--bg-page)] space-y-4">
              <div className="pb-3 border-b border-current/10">
                <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)] block">
                  Node Inspector [Interactive]
                </span>
                <h3 className="font-editorial-title text-lg font-bold uppercase tracking-tight mt-1 text-[var(--text-primary)]">
                  {selectedNode.name}
                </h3>
                <span className="inline-block mt-1 font-editorial-mono text-[11px] font-bold">
                  Status: {getStatusColor(selectedNode.status).badge}
                </span>
              </div>

              <div className="space-y-2.5 text-xs font-editorial-mono">
                <div className="flex justify-between p-2 rounded bg-current/5">
                  <span className="opacity-60">Required Level:</span>
                  <span className="font-bold">{selectedNode.requiredLevel}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-current/5">
                  <span className="opacity-60">Current Status:</span>
                  <span className="font-bold">{selectedNode.currentLevel}</span>
                </div>
                <div className="p-2.5 rounded border border-current/10 bg-current/5 text-[11px] opacity-80 leading-relaxed">
                  <strong>Recommendation:</strong> {selectedNode.recommendedAction}
                </div>
              </div>

              <Button
                size="sm"
                variant="primary"
                onClick={() =>
                  selectedNode.status === 'missing'
                    ? navigate('/assessments/docker')
                    : navigate('/career')
                }
                className="w-full text-xs font-bold"
                iconRight={ArrowRight}
              >
                {selectedNode.status === 'missing' ? 'Take Docker Assessment' : 'View Full Roadmap Graph'}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
