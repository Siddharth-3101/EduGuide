import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Play,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  ArrowRight,
  Code2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const InterviewPrepSection = () => {
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);

  return (
    <section id="interviews" className="py-20 sm:py-28 border-b border-[var(--border-line)] relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-[var(--card-surface)] px-3.5 py-1 text-xs font-editorial-mono tracking-wider opacity-85">
              <Users className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
              <span>SECTION 09 // COLLABORATIVE INTERVIEWS</span>
            </div>

            <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
              Collaborative interview workspaces.
            </h2>

            <p className="text-base opacity-75 leading-relaxed font-sans">
              Practice role-specific technical questions collaboratively with peers. Build shared question sets, test yourself in timed solo practice mode, and calibrate answers against real hiring evaluation criteria.
            </p>

            <div className="space-y-3 font-editorial-mono text-xs opacity-85">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Role-based sets: Backend, Distributed Systems, Cloud Architecture</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Presence indicators & granular Viewer / Editor permissions</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                <span>Interactive practice mode with question navigator and answer reveal</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => navigate('/interviews')}
                iconRight={ArrowRight}
                className="text-xs font-bold"
              >
                Launch Interview Workspace
              </Button>
            </div>
          </div>

          {/* Right Column: Live Interview Question Card Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div className="flex items-center gap-2 text-xs font-editorial-mono">
                  <span className="font-bold text-[var(--accent-terracotta)]">Q04 // 15</span>
                  <span className="opacity-40">•</span>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                    System Design
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                    Advanced
                  </span>
                </div>

                {/* Collaborators presence */}
                <div className="flex items-center gap-1.5 text-[11px] font-editorial-mono opacity-75">
                  <span>Collaborators:</span>
                  <span title="User A">🟢</span>
                  <span title="User B">🟢</span>
                  <span title="User C">🟡</span>
                </div>
              </div>

              <div>
                <h4 className="font-editorial-title text-lg font-bold text-[var(--text-primary)] leading-snug">
                  "How would you design a scalable REST API to handle sudden 10x traffic spikes?"
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-2.5 font-editorial-mono text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-current/5 border border-current/10">REST API</span>
                  <span className="px-2 py-0.5 rounded bg-current/5 border border-current/10">System Design</span>
                  <span className="px-2 py-0.5 rounded bg-current/5 border border-current/10">Redis</span>
                </div>
              </div>

              {/* Reveal Expected Answer Toggle */}
              <div className="pt-2">
                <button
                  onClick={() => setRevealed(!revealed)}
                  className="inline-flex items-center gap-2 text-xs font-editorial-mono font-bold text-[var(--accent-terracotta)] hover:underline mb-2"
                >
                  {revealed ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  <span>{revealed ? 'Hide Expected Answer' : 'Reveal Expected Answer & Evaluation Criteria'}</span>
                </button>

                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3.5 rounded-lg border border-current/10 bg-[var(--bg-page)] text-xs font-editorial-mono space-y-2 opacity-90"
                  >
                    <p className="leading-relaxed">
                      <strong>Expected Answer:</strong> Employ rate-limiting gateways (Redis token-bucket algorithm), horizontal auto-scaling with stateless container workers, and asynchronous job offloading for high-latency workloads.
                    </p>
                    <p className="text-[11px] opacity-75 leading-relaxed">
                      <strong>Evaluation Criteria:</strong> Explains idempotency, caching tiers (HTTP ETag / CDN), and graceful circuit breaking.
                    </p>
                  </motion.div>
                )}
              </div>

              <div className="pt-3 border-t border-current/10 flex items-center justify-between">
                <span className="text-xs font-editorial-mono opacity-60">Practice Progress: 4 / 15 Completed</span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => navigate('/interviews/int-backend-dev')}
                  iconRight={Play}
                  className="text-xs font-bold"
                >
                  Start Practice Mode
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
