import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Clock,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FileCode,
  Video,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const LearningSection = () => {
  const navigate = useNavigate();

  const resources = [
    {
      title: 'Docker Fundamentals & Containerization',
      provider: 'Coursera / Docker Official',
      type: 'Course',
      duration: '5 hours',
      level: 'Beginner → Intermediate',
      isFree: true,
      gapBridged: 'Docker & DevOps Infrastructure',
      competencies: ['Multi-stage Builds', 'Docker Compose', 'Volume Mounts']
    },
    {
      title: 'Docker & Container Architecture Documentation',
      provider: 'Official Docker Docs',
      type: 'Documentation',
      duration: '2 hours',
      level: 'Reference',
      isFree: true,
      gapBridged: 'DevOps Standards',
      competencies: ['Networking Isolation', 'Healthchecks', 'Security']
    },
    {
      title: 'Asynchronous Task Processing with Redis & Celery',
      provider: 'YouTube / TechWithTim',
      type: 'Practical Tutorial',
      duration: '2.5 hours',
      level: 'Intermediate',
      isFree: true,
      gapBridged: 'Redis & Asynchronous Background Jobs',
      competencies: ['Broker Queues', 'Dead Letter Queues', 'TTL Policies']
    }
  ];

  return (
    <section id="learning" className="py-20 sm:py-28 border-b border-[var(--border-line)] relative z-10 bg-current/[0.015]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-[var(--card-surface)] px-3.5 py-1 text-xs font-editorial-mono tracking-wider opacity-85 mb-4">
            <BookOpen className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
            <span>SECTION 06 // PREREQUISITE-AWARE LEARNING</span>
          </div>

          <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
            Curated materials for verified gaps only.
          </h2>

          <p className="mt-4 text-base opacity-75 max-w-2xl mx-auto leading-relaxed font-sans">
            No endless 80-hour generic bootcamps. SkillSync filters documentation, labs, and interactive tutorials tailored strictly to your verified missing competencies.
          </p>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resources.map((res, i) => (
            <div
              key={i}
              className="p-6 rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] shadow-md flex flex-col justify-between space-y-4 hover:border-[var(--accent-terracotta)] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between font-editorial-mono text-xs">
                  <span className="px-2 py-0.5 rounded bg-current/5 border border-current/10 font-bold opacity-75">
                    {res.type}
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {res.isFree ? '100% Free' : 'Paid'}
                  </span>
                </div>

                <h4 className="font-editorial-title text-lg font-bold uppercase tracking-tight text-[var(--text-primary)] leading-snug">
                  {res.title}
                </h4>

                <div className="flex items-center gap-2 text-xs font-editorial-mono opacity-70">
                  <span>{res.provider}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {res.duration}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-current/5 border border-current/10 text-[11px] font-editorial-mono">
                  <span className="opacity-60 block uppercase text-[9px] mb-0.5 font-bold">Bridges Gap:</span>
                  <span className="font-bold text-[var(--accent-terracotta)]">{res.gapBridged}</span>
                </div>

                <div>
                  <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider opacity-60 block mb-1.5">
                    Competencies Evaluated
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-editorial-mono text-[11px]">
                    {res.competencies.map((comp) => (
                      <span key={comp} className="px-2 py-0.5 rounded bg-[var(--bg-page)] border border-current/15">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-current/10">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/learning')}
                  className="w-full text-xs font-bold"
                  iconRight={ArrowRight}
                >
                  Start Prerequisite Lab
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
