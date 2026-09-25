import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Target, Cpu, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const FinalCtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 sm:py-32 relative z-10 text-center overflow-hidden border-b border-[var(--border-line)]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[var(--accent-terracotta)]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-4xl px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-terracotta)]/40 bg-[var(--card-surface)] px-4 py-1.5 text-xs font-editorial-mono tracking-wider shadow-xs mb-6">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
          <span>YOUR AUTONOMOUS CAREER ROADMAP AWAITS</span>
        </div>

        <h2 className="font-editorial-title text-4xl sm:text-6xl font-extrabold tracking-tight uppercase leading-[1.08] text-[var(--text-primary)]">
          Your next career step <br className="hidden sm:inline" />
          <span className="font-editorial-serif italic font-normal tracking-normal lowercase text-[var(--accent-terracotta)]">
            shouldn't be a guess.
          </span>
        </h2>

        <p className="mt-6 text-base sm:text-lg opacity-80 max-w-xl mx-auto font-sans leading-relaxed">
          Audit your verified skills, bridge critical gaps with production evidence, and unlock high-match opportunities today.
        </p>

        {/* Big Action CTA Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/career')}
            iconRight={ArrowRight}
            className="w-full sm:w-auto font-bold text-sm px-10 py-3.5 ai-glow-terracotta shadow-md"
          >
            Build My Career Path →
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto text-sm font-editorial-mono"
          >
            Open Dashboard
          </Button>
        </div>

        {/* Ecosystem Guarantee summary */}
        <div className="mt-14 pt-8 border-t border-current/10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-editorial-mono opacity-70">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Objective Proof Over Claims
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Interactive Dependency Graphs
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Verified Competency Matching
          </span>
        </div>
      </div>
    </section>
  );
};
