import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  Layers,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  FolderGit2,
  Briefcase,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const HowItWorksSection = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: '01',
      title: 'Career Goal',
      subtitle: 'Target Role Calibration',
      icon: Target,
      question: 'Where do I want to go?',
      description: 'Select your target engineering roles (e.g. Backend Developer, Cloud Architect, or AI Engineer). SkillSync pulls live market competency requirements from employer datasets.',
      previewHighlight: 'Requirements aggregated from 2,400+ active tech postings.',
      route: '/career'
    },
    {
      id: '02',
      title: 'Analyze Skills',
      subtitle: 'Multi-Modal Evidence Extraction',
      icon: Layers,
      question: 'What do I know today?',
      description: 'Upload resumes, course certificates, and GitHub repositories. Our RAG document analysis engine extracts concrete technical skills with verified confidence scores.',
      previewHighlight: 'Extracts languages, frameworks, SQL queries, and cloud stacks.',
      route: '/skills'
    },
    {
      id: '03',
      title: 'Verify Skills',
      subtitle: 'Standardized Assessments',
      icon: ShieldCheck,
      question: 'Can I prove my competence?',
      description: 'Replace subjective resume claims with objective proof. Take timed competency assessments in Python, SQL, and System Design to earn tamper-proof verified badges.',
      previewHighlight: 'Objective scores benchmarked against industry peer percentiles.',
      route: '/assessments'
    },
    {
      id: '04',
      title: 'Find Gaps',
      subtitle: 'Prioritized Competency Audit',
      icon: TrendingUp,
      question: 'What am I missing?',
      description: 'Instantly view a clear audit: Verified (🟢), Partial (🟡), and Missing (🔴). Know which missing skills unlock the largest percentage of target roles.',
      previewHighlight: 'High/Medium/Low priority gap ranking saves hundreds of study hours.',
      route: '/career'
    },
    {
      id: '05',
      title: 'Learn',
      subtitle: 'Prerequisite-Aware Roadmaps',
      icon: BookOpen,
      question: 'How do I bridge the gap?',
      description: 'Access curated, dependency-aware learning resources specifically tagged to your missing competencies without wasting time on what you already mastered.',
      previewHighlight: 'Documentation, interactive exercises, and guided architectural walkthroughs.',
      route: '/learning'
    },
    {
      id: '06',
      title: 'Build Projects',
      subtitle: 'Automated GitHub Evidence',
      icon: FolderGit2,
      question: 'How do I demonstrate practical mastery?',
      description: 'Submit real software repositories. Automated sandboxes inspect multi-stage Dockerfiles, database migrations, and test coverage to validate production readiness.',
      previewHighlight: 'Projects provide evidence; standardized tests verify competency.',
      route: '/projects'
    },
    {
      id: '07',
      title: 'Match Jobs',
      subtitle: 'Normalized Competency Matching',
      icon: Briefcase,
      question: 'Where do my skills fit?',
      description: 'Match with aggregated external opportunities (LinkedIn, Naukri, Direct). Transparently view verified skill overlap (e.g. 82% Competency Match) without keyword tricks.',
      previewHighlight: 'Strictly separated from vanity hiring or selection probabilities.',
      route: '/jobs'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-b border-[var(--border-line)] relative z-10 bg-current/[0.015]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-[var(--card-surface)] px-3.5 py-1 text-xs font-editorial-mono tracking-wider opacity-85 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
            <span>HOW SKILLSYNC OPERATES</span>
            <span className="opacity-40">•</span>
            <span>END-TO-END PIPELINE</span>
          </div>

          <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
            From "What do I know?" to "Where do I fit?"
          </h2>

          <p className="mt-4 text-base opacity-75 max-w-2xl mx-auto leading-relaxed font-sans">
            Career growth isn't a random collection of tutorials. SkillSync operates as a closed-loop intelligence system guiding every decision.
          </p>
        </div>

        {/* 7-Step Interactive Pipeline Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 border-b border-current/10 pb-6 mb-8 overflow-x-auto font-editorial-mono text-xs">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-[var(--accent-terracotta)] bg-[var(--card-surface)] shadow-md text-[var(--accent-terracotta)] font-bold scale-[1.02]'
                    : 'border-current/10 bg-current/5 hover:bg-current/10 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] opacity-60 font-semibold">{step.id}</span>
                  <Icon className="h-4 w-4 text-[var(--accent-terracotta)]" />
                </div>
                <span className="font-editorial-title text-xs uppercase block truncate text-[var(--text-primary)]">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Stage Detailed Spotlight Card */}
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8 sm:p-10 rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 font-editorial-mono text-xs font-bold text-[var(--accent-terracotta)] uppercase tracking-wider">
              <span>Stage {steps[activeStep].id} // 07</span>
              <span>•</span>
              <span>{steps[activeStep].subtitle}</span>
            </div>

            <h3 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[var(--text-primary)]">
              "{steps[activeStep].question}"
            </h3>

            <p className="text-sm opacity-80 leading-relaxed max-w-xl font-sans">
              {steps[activeStep].description}
            </p>

            <div className="p-3.5 rounded-lg border border-current/15 bg-current/5 font-editorial-mono text-xs opacity-90">
              <span className="font-bold text-[var(--accent-terracotta)] block mb-1">
                System Signal:
              </span>
              {steps[activeStep].previewHighlight}
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate(steps[activeStep].route)}
                className="inline-flex items-center gap-2 text-xs font-editorial-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)] hover:underline"
              >
                <span>Explore {steps[activeStep].title} Module</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-lg border border-current/15 bg-[var(--bg-page)] space-y-3 font-editorial-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-current/10">
              <span className="opacity-60 uppercase text-[10px] tracking-wider">Pipeline Flow Diagram</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="space-y-2">
              {steps.map((s, idx) => (
                <div
                  key={s.id}
                  className={`flex items-center justify-between p-2 rounded transition-all ${
                    activeStep === idx
                      ? 'bg-[var(--accent-terracotta)] text-white font-bold'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <span className="text-[11px]">{s.id}. {s.title}</span>
                  <span className="text-[10px]">{s.question}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
