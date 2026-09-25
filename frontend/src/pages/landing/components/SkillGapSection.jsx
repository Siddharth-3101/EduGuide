import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  ShieldAlert,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const SkillGapSection = () => {
  const navigate = useNavigate();

  const gapCards = [
    {
      skill: 'Docker & Containerization',
      status: 'missing',
      statusLabel: '🔴 Missing Competency',
      priority: 'High Priority',
      priorityBadge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      requiredLevel: 'Intermediate',
      currentLevel: 'None',
      why: 'Required by 72% of selected target Backend Developer postings. Critical blocker for containerized microservices.',
      learnRoute: '/learning?gap=Docker',
      assessmentRoute: '/assessments/docker'
    },
    {
      skill: 'AWS Cloud Services',
      status: 'missing',
      statusLabel: '🔴 Missing Competency',
      priority: 'High Priority',
      priorityBadge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      requiredLevel: 'Beginner / Intermediate',
      currentLevel: 'None',
      why: 'Required by 64% of cloud backend roles. Blocking candidate shortlisting in 3 active employer pipelines.',
      learnRoute: '/learning?gap=AWS',
      assessmentRoute: '/assessments/aws'
    },
    {
      skill: 'Redis Caching & Tasks',
      status: 'partial',
      statusLabel: '🟡 Partial Evidence',
      priority: 'Medium Priority',
      priorityBadge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      requiredLevel: 'Intermediate',
      currentLevel: 'Beginner (Evidence Found)',
      why: 'Identified in Celery worker project repository, but unverified by standardized assessment.',
      learnRoute: '/learning?gap=Redis',
      assessmentRoute: '/assessments/redis'
    }
  ];

  return (
    <section id="skill-gap" className="py-20 sm:py-28 border-b border-[var(--border-line)] relative z-10 bg-current/[0.015]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-[var(--card-surface)] px-3.5 py-1 text-xs font-editorial-mono tracking-wider opacity-85 mb-4">
            <TrendingUp className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
            <span>SECTION 04 // SKILL GAP ANALYSIS</span>
          </div>

          <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
            Target role vs. current competencies.
          </h2>

          <p className="mt-4 text-base opacity-75 max-w-2xl mx-auto leading-relaxed font-sans">
            Never waste another month guessing what to study. SkillSync audits your profile against real job descriptions to pinpoint high-leverage gaps with mathematical priority.
          </p>
        </div>

        {/* Coverage Overview Meter */}
        <div className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] max-w-4xl mx-auto mb-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
              Target Benchmark: Backend Developer (L3)
            </span>
            <h3 className="font-editorial-title text-xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
              Current Competency Coverage: 67%
            </h3>
            <p className="text-xs opacity-70 font-editorial-mono">
              8 Verified • 3 Partial • 4 Missing Gaps
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2">
            <div className="h-3 w-full rounded-full bg-current/10 overflow-hidden flex">
              <div className="h-full bg-emerald-500" style={{ width: '53%' }} title="Verified: 8" />
              <div className="h-full bg-amber-500" style={{ width: '20%' }} title="Partial: 3" />
              <div className="h-full bg-rose-500" style={{ width: '27%' }} title="Missing: 4" />
            </div>
            <div className="flex justify-between text-[10px] font-editorial-mono opacity-70">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">53% Verified</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">20% Partial</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">27% Missing</span>
            </div>
          </div>
        </div>

        {/* Prioritized Skill Gap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gapCards.map((card) => (
            <div
              key={card.skill}
              className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] shadow-md flex flex-col justify-between space-y-5 hover:border-[var(--accent-terracotta)] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-editorial-mono font-bold uppercase tracking-wider border ${card.priorityBadge}`}>
                    {card.priority}
                  </span>
                  <span className="text-xs font-editorial-mono opacity-80">{card.statusLabel}</span>
                </div>

                <h4 className="font-editorial-title text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
                  {card.skill}
                </h4>

                <div className="p-3 rounded-lg border border-current/10 bg-current/5 text-xs font-editorial-mono space-y-1">
                  <div className="flex justify-between">
                    <span className="opacity-60">Required:</span>
                    <span className="font-bold">{card.requiredLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Current:</span>
                    <span className="font-bold">{card.currentLevel}</span>
                  </div>
                </div>

                <p className="text-xs opacity-75 leading-relaxed font-sans">
                  {card.why}
                </p>
              </div>

              <div className="pt-3 border-t border-current/10 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(card.learnRoute)}
                  className="flex-1 text-xs font-editorial-mono"
                  iconLeft={BookOpen}
                >
                  Learn
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate(card.assessmentRoute)}
                  className="flex-1 text-xs font-bold"
                  iconRight={ArrowRight}
                >
                  Verify
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
