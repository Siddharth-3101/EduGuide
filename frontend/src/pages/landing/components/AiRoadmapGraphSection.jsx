import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  ChevronRight,
  ArrowRight,
  GitBranch,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const AiRoadmapGraphSection = () => {
  const navigate = useNavigate();

  // Branching node sequence: Python -> REST API -> Spring Boot -> Docker -> AWS
  const [activeNode, setActiveNode] = useState('docker');

  const roadmapNodes = [
    {
      id: 'python',
      title: 'Python Core',
      status: 'verified',
      badge: '🟢 Verified',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      description: 'OOP, data structures, generators, async programming, and algorithmic design.',
      score: '89% (Advanced)',
      prereq: 'None (Root Node)',
      unlocks: 'REST API, Asynchronous Queues, Data Modeling'
    },
    {
      id: 'rest',
      title: 'REST API & OpenAPI',
      status: 'verified',
      badge: '🟢 Verified',
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      description: 'HTTP verb semantics, idempotency, JSON schemas, authentication tokens, and routing.',
      score: '94% (Intermediate)',
      prereq: 'Python Core',
      unlocks: 'Spring Boot, Fast API, Microservices'
    },
    {
      id: 'spring',
      title: 'Spring Boot & Java',
      status: 'partial',
      badge: '🟡 Partial',
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400',
      description: 'Dependency injection, Spring Data JPA, Hibernate ORM, and enterprise controller endpoints.',
      score: 'Course Completed (Test Pending)',
      prereq: 'REST API & SQL Relational Modeling',
      unlocks: 'Enterprise Microservices & Kafka'
    },
    {
      id: 'docker',
      title: 'Docker & Containers',
      status: 'missing',
      badge: '🔴 Missing Gap',
      color: 'border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400',
      description: 'Multi-stage Dockerfile builds, Compose orchestration, volume persistence, and isolation networks.',
      score: '0% (Unverified)',
      prereq: 'REST API & Linux Fundamentals',
      unlocks: 'Kubernetes Orchestration, AWS ECS/EKS'
    },
    {
      id: 'aws',
      title: 'AWS Cloud Infra',
      status: 'recommended',
      badge: '🔵 Recommended Next',
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400',
      description: 'EC2 instances, VPC subnets, IAM role least-privilege policies, S3, and RDS Aurora.',
      score: 'Target Competency',
      prereq: 'Docker & Containerization',
      unlocks: 'Senior Platform Engineer Readiness'
    }
  ];

  const selected = roadmapNodes.find((n) => n.id === activeNode);

  return (
    <section id="roadmap" className="py-20 sm:py-28 border-b border-[var(--border-line)] relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-[var(--card-surface)] px-3.5 py-1 text-xs font-editorial-mono tracking-wider opacity-85 mb-4">
            <GitBranch className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
            <span>SECTION 05 // AI CAREER ROADMAP</span>
          </div>

          <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
            Interactive branching dependency graph.
          </h2>

          <p className="mt-4 text-base opacity-75 max-w-2xl mx-auto leading-relaxed font-sans">
            Skills are not isolated checkmarks—they form a living dependency tree. See how mastering core fundamentals systematically unlocks cloud infrastructure and enterprise roles.
          </p>
        </div>

        {/* Branching Dependency Tree Visualizer */}
        <div className="rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] p-6 sm:p-10 shadow-xl">
          {/* Node Pathway Ribbon */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-8 border-b border-current/10">
            {roadmapNodes.map((node, i) => (
              <React.Fragment key={node.id}>
                <button
                  onClick={() => setActiveNode(node.id)}
                  className={`w-full lg:w-auto p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    activeNode === node.id
                      ? 'border-[var(--accent-terracotta)] bg-[var(--bg-page)] shadow-lg scale-105 ring-2 ring-[var(--accent-terracotta)]/20'
                      : 'border-current/15 bg-current/[0.02] hover:bg-current/5 opacity-80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-editorial-mono opacity-50 uppercase font-bold">
                      0{i + 1} // Step
                    </span>
                    <span className="text-[10px] font-editorial-mono font-bold">
                      {node.badge}
                    </span>
                  </div>
                  <h4 className="font-editorial-title text-sm font-bold uppercase tracking-tight block text-[var(--text-primary)]">
                    {node.title}
                  </h4>
                  <span className="text-[11px] font-editorial-mono opacity-65 block mt-0.5">
                    {node.score}
                  </span>
                </button>

                {i < roadmapNodes.length - 1 && (
                  <div className="hidden lg:flex items-center text-current/30">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Active Node Branch Inspection */}
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded text-xs font-editorial-mono font-bold uppercase tracking-wider border ${selected.color}`}>
                  {selected.badge}
                </span>
                <span className="text-xs font-editorial-mono opacity-60">Status: {selected.score}</span>
              </div>

              <h3 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
                {selected.title}
              </h3>

              <p className="text-sm opacity-80 leading-relaxed font-sans max-w-2xl">
                {selected.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-editorial-mono text-xs pt-2">
                <div className="p-3 rounded-lg border border-current/10 bg-current/5">
                  <span className="opacity-60 text-[10px] uppercase block mb-0.5 font-bold">Prerequisite Dependencies:</span>
                  <span className="font-semibold text-[var(--text-primary)]">{selected.prereq}</span>
                </div>
                <div className="p-3 rounded-lg border border-current/10 bg-current/5">
                  <span className="opacity-60 text-[10px] uppercase block mb-0.5 font-bold">Unlocks Competency Branches:</span>
                  <span className="font-semibold text-[var(--accent-terracotta)]">{selected.unlocks}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-lg border border-current/15 bg-[var(--bg-page)] space-y-4">
              <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)] block">
                Graph Action Directives
              </span>

              <p className="text-xs opacity-75 font-sans leading-relaxed">
                {selected.status === 'verified'
                  ? 'Competency confirmed. Evidence verified through automated test suites and standardized assessment.'
                  : selected.status === 'missing'
                  ? 'Critical path blocker. Take the assessment or complete the recommended Docker mini-project to unlock the AWS branch.'
                  : 'Candidate has preliminary evidence. Needs formal assessment verification.'}
              </p>

              <Button
                variant="primary"
                onClick={() =>
                  selected.status === 'missing'
                    ? navigate('/assessments/docker')
                    : navigate('/career')
                }
                className="w-full text-xs font-bold"
                iconRight={ArrowRight}
              >
                {selected.status === 'missing' ? 'Verify Docker Competency' : 'Inspect in Career Roadmap'}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
