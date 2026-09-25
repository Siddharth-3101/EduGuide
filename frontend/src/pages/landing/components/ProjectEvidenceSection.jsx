import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderGit2,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Code2,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const ProjectEvidenceSection = () => {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(true);

  const handleSimulateAnalysis = () => {
    setAnalyzing(true);
    setAnalyzed(false);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalyzed(true);
    }, 1200);
  };

  return (
    <section id="projects" className="py-20 sm:py-28 border-b border-[var(--border-line)] relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-[var(--card-surface)] px-3.5 py-1 text-xs font-editorial-mono tracking-wider opacity-85">
              <FolderGit2 className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
              <span>SECTION 07 // PRACTICAL EVIDENCE STACK</span>
            </div>

            <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
              GitHub repository analysis & technical evidence.
            </h2>

            <p className="text-base opacity-75 leading-relaxed font-sans">
              "Projects provide evidence, assessments verify competency." SkillSync connects to public GitHub repositories, parsing README documentation, dependency files, and code structures to identify demonstrable technologies.
            </p>

            <div className="p-4 rounded-xl border border-current/15 bg-current/5 space-y-2 text-xs font-editorial-mono opacity-85">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Zero Trust Architecture</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-75">
                We never claim a skill is verified merely because a repository was uploaded. Evidence points you directly to the relevant assessment to prove mastery.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => navigate('/projects')}
                iconRight={ArrowRight}
                className="text-xs font-bold"
              >
                Submit Project Evidence
              </Button>
            </div>
          </div>

          {/* Right Column: Interactive GitHub Analyzer Terminal */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] p-6 sm:p-8 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-current/10">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  <span className="text-xs font-editorial-mono font-bold opacity-60 ml-2">
                    github-parser-agent // v2.6
                  </span>
                </div>
                <button
                  onClick={handleSimulateAnalysis}
                  disabled={analyzing}
                  className="text-xs font-editorial-mono text-[var(--accent-terracotta)] hover:underline font-bold"
                >
                  {analyzing ? 'Scanning...' : 'Re-run Analysis'}
                </button>
              </div>

              {/* Simulated Terminal Feed */}
              <div className="p-4 rounded-lg bg-[var(--bg-page)] border border-current/10 font-mono text-xs space-y-2">
                <div className="text-slate-500 dark:text-slate-400 truncate">
                  $ git clone https://github.com/example/student-management-api
                </div>
                {analyzing ? (
                  <div className="text-[var(--accent-terracotta)] animate-pulse">
                    Analyzing repository AST and README markdown...
                  </div>
                ) : (
                  <div className="space-y-1.5 text-emerald-600 dark:text-emerald-400">
                    <div>✓ Repository found & indexed</div>
                    <div>✓ README retrieved (Markdown spec parsed)</div>
                    <div>✓ Project structure analyzed (FastAPI + SQLAlchemy)</div>
                    <div>✓ Technologies detected: Python, FastAPI, PostgreSQL, Docker</div>
                    <div>✓ Skills mapped: REST API, Database, Docker</div>
                  </div>
                )}
              </div>

              {/* Detected Evidence Card */}
              {analyzed && !analyzing && (
                <div className="p-4 rounded-lg border border-current/15 bg-current/5 space-y-3 font-editorial-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--text-primary)]">
                      Evidence: Student Management API
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                      🟡 Evidence Found
                    </span>
                  </div>

                  <p className="opacity-75 text-[11px] leading-relaxed">
                    Source: GitHub README & Multi-stage Dockerfile layer validation. 94% evidence confidence.
                  </p>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="opacity-60 text-[10px]">Action Recommended:</span>
                    <button
                      onClick={() => navigate('/assessments/docker')}
                      className="font-bold text-[var(--accent-terracotta)] hover:underline flex items-center gap-1"
                    >
                      Take Docker Assessment →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
