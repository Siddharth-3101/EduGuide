import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Target,
  Sparkles,
  Layers,
  Award,
  FolderGit2,
  Briefcase,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Code2
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Footer } from '../../components/layout/Footer';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const journeySteps = [
    { title: 'Career Goal', icon: Target, desc: 'Target Backend, Cloud or AI roles', coord: '01 // GOAL' },
    { title: 'Skill Analysis', icon: Layers, desc: 'Benchmark against live requirements', coord: '02 // ANLZ' },
    { title: 'Verification', icon: ShieldCheck, desc: 'Objective technical assessments', coord: '03 // VRFY' },
    { title: 'Skill Gap', icon: TrendingUp, desc: 'Pinpoint precise missing competencies', coord: '04 // GAPS' },
    { title: 'Projects', icon: FolderGit2, desc: 'Verified code on GitHub', coord: '05 // PROJ' },
    { title: 'Job Match', icon: Briefcase, desc: 'Transparent competency matching', coord: '06 // MTCH' }
  ];

  const features = [
    {
      title: 'Targeted Skill Verification',
      description: 'Stop guessing what recruiters want. Take timed, standardized assessments in Docker, Python, SQL, and System Design to prove genuine competency.',
      icon: ShieldCheck,
      badge: 'RIGOROUS VERIFICATION',
      node: 'CRD-01'
    },
    {
      title: 'Dynamic Career Roadmaps',
      description: 'Interactive competency graphs outline what is Verified (🟢), Partial (🟡), and Missing (🔴) so you always know what to study next.',
      icon: Layers,
      badge: 'DATA-DRIVEN PATH',
      node: 'CRD-02'
    },
    {
      title: 'Gap-Bridging Projects',
      description: 'Build production-grade projects specifically recommended to bridge your identified missing skills, backed by automated repository verification.',
      icon: FolderGit2,
      badge: 'PRACTICAL EVIDENCE',
      node: 'CRD-03'
    },
    {
      title: 'Real Competency Matching',
      description: 'Jobs matched strictly by verified skills, not keyword-stuffed resumes. See exact overlapping competencies and remaining gaps upfront.',
      icon: Briefcase,
      badge: 'ZERO VANITY METRICS',
      node: 'CRD-04'
    }
  ];

  return (
    <div className="min-h-screen text-[var(--text-primary)] bg-[var(--bg-page)] flex flex-col font-sans relative transition-colors duration-300">
      {/* 12-Column Blueprint Architectural Grid Overlay */}
      <div className="blueprint-grid-overlay">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="blueprint-grid-col" />
        ))}
      </div>

      {/* Top Architectural Navigation */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-current/15 bg-[var(--bg-page)]/85 px-6 lg:px-12 backdrop-blur-md transition-colors duration-300">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-editorial-mono text-xs font-bold tracking-[0.2em] px-2 py-1 rounded border border-current/25">
            S / B
          </span>
          <span className="font-editorial-title text-lg font-bold tracking-tight uppercase">
            SkillBridge
          </span>
          <span className="hidden sm:inline-block font-editorial-mono text-[10px] opacity-40 tracking-wider">
            [SYS // 2026]
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs font-editorial-mono uppercase tracking-[0.16em] opacity-80">
          <a href="#how-it-works" className="hover:opacity-100 hover:text-[var(--accent-terracotta)] transition-colors">How It Works</a>
          <a href="#features" className="hover:opacity-100 hover:text-[var(--accent-terracotta)] transition-colors">Features</a>
          <a href="#passport" className="hover:opacity-100 hover:text-[var(--accent-terracotta)] transition-colors">Skill Passport</a>
          <Link to="/career" className="hover:opacity-100 hover:text-[var(--accent-terracotta)] transition-colors">Roadmaps</Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Crescent Moon ☾ Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={isDark ? "Switch to Warm Parchment Theme" : "Switch to Midnight Blueprint Theme"}
            className="h-8 w-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 border border-current/20 opacity-80 hover:opacity-100 mr-1"
          >
            {isDark ? (
              <svg className="h-4 w-4 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          <Link
            to="/login"
            className="text-xs font-editorial-mono font-medium opacity-80 hover:opacity-100 px-3 py-1.5 uppercase tracking-wider"
          >
            Log in
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-current/10">
        <div className="mx-auto max-w-5xl px-6 text-center">
          {/* Survey coordinate badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-[var(--card-surface)] px-3.5 py-1 text-xs font-editorial-mono tracking-wider opacity-85 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-terracotta)]"></span>
            <span>THE STUDENT CAREER-READINESS PLATFORM</span>
            <span className="opacity-40">|</span>
            <span className="opacity-60">[SYS // 2026]</span>
          </div>

          <h1 className="font-editorial-title text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--text-primary)] max-w-4xl mx-auto leading-[1.08] uppercase">
            Know what you need to become <span className="font-editorial-serif italic font-normal tracking-normal lowercase text-[var(--accent-terracotta)]">job-ready.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg opacity-75 max-w-2xl mx-auto leading-relaxed font-sans">
            SkillBridge maps your current skills to real job requirements, identifies your competency gaps, helps you build practical evidence, and connects you with verified opportunities.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/register')}
              iconRight={ArrowRight}
              className="w-full sm:w-auto"
            >
              Get Started
            </Button>
            <a href="#how-it-works">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore How It Works
              </Button>
            </a>
          </div>

          {/* Simplified Career Journey Visualizer */}
          <div className="mt-16 rounded-xl border border-current/15 bg-[var(--card-surface)] p-6 sm:p-8 shadow-xs text-left backdrop-blur-xs">
            <div className="flex items-center justify-between pb-4 border-b border-current/10 mb-6">
              <div>
                <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
                  The Continuous Career Pathway
                </span>
                <h3 className="font-editorial-title text-base font-bold text-[var(--text-primary)] mt-1">
                  From College Aspirations to Verified Offers
                </h3>
              </div>
              <span className="text-xs font-editorial-mono opacity-50 hidden sm:inline-block">
                END-TO-END SYSTEM
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {journeySteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="relative flex flex-col p-3.5 rounded-lg border border-current/10 bg-[var(--bg-page)]/60 hover:border-[var(--accent-terracotta)] transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded border border-current/20 bg-[var(--card-surface)] group-hover:border-[var(--accent-terracotta)] transition-colors">
                        <Icon className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
                      </div>
                      <span className="text-[9px] font-editorial-mono opacity-50 font-semibold">{step.coord}</span>
                    </div>
                    <span className="text-xs font-bold leading-tight uppercase font-editorial-title">{step.title}</span>
                    <span className="text-[11px] opacity-70 mt-1 leading-snug">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: How SkillBridge Works */}
      <section id="how-it-works" className="py-20 border-b border-current/10 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
              Architecture & Method
            </span>
            <h2 className="font-editorial-title text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-2 uppercase">
              How SkillBridge Works
            </h2>
            <p className="text-base opacity-75 mt-3 leading-relaxed">
              A systematic career engine that removes guesswork. We compare your profile against live role benchmarks and guide you step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-current/15 bg-[var(--card-surface)] shadow-xs transition-colors">
              <div className="h-10 w-10 rounded-lg border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] font-editorial-mono font-bold flex items-center justify-center mb-4">
                01
              </div>
              <h3 className="font-editorial-title text-lg font-bold text-[var(--text-primary)] mb-2 uppercase">
                Target & Gap Analysis
              </h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Choose up to 3 target roles. SkillBridge analyses requirements and breaks them down into verified, partial, and missing competencies.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-current/15 bg-[var(--card-surface)] shadow-xs transition-colors">
              <div className="h-10 w-10 rounded-lg border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] font-editorial-mono font-bold flex items-center justify-center mb-4">
                02
              </div>
              <h3 className="font-editorial-title text-lg font-bold text-[var(--text-primary)] mb-2 uppercase">
                Verify & Learn
              </h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Complete targeted skill assessments and recommended mini-courses to turn missing skills into verified badges backed by real assessment scores.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-current/15 bg-[var(--card-surface)] shadow-xs transition-colors">
              <div className="h-10 w-10 rounded-lg border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)] font-editorial-mono font-bold flex items-center justify-center mb-4">
                03
              </div>
              <h3 className="font-editorial-title text-lg font-bold text-[var(--text-primary)] mb-2 uppercase">
                Build & Match
              </h3>
              <p className="text-sm opacity-75 leading-relaxed">
                Build practical GitHub projects that validate your ability, export your verified Skill Passport, and apply for high competency-match jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Features Grid */}
      <section id="features" className="py-20 border-b border-current/10 relative z-10 bg-current/[0.02]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
              Core Capabilities
            </span>
            <h2 className="font-editorial-title text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-2 uppercase">
              Engineered for Real Career Outcomes
            </h2>
            <p className="text-base opacity-75 mt-3 leading-relaxed">
              Every screen answers: "What should the student do next?"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-7 rounded-xl border border-current/15 bg-[var(--card-surface)] shadow-xs hover:border-[var(--accent-terracotta)] transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-current/20 bg-[var(--bg-page)] text-[var(--text-primary)] shadow-xs">
                      <Icon className="h-5 w-5 text-[var(--accent-terracotta)]" />
                    </div>
                    <span className="text-[10px] font-editorial-mono font-semibold px-2.5 py-1 rounded border border-current/20">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-editorial-title text-lg font-bold text-[var(--text-primary)] mb-2 uppercase">
                    {feat.title}
                  </h3>
                  <p className="text-sm opacity-75 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Skill Passport Preview */}
      <section id="passport" className="py-20 border-b border-current/10 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
                Public Proof
              </span>
              <h2 className="font-editorial-title text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] mt-2 uppercase">
                Your Verified Skill Passport
              </h2>
              <p className="text-base opacity-75 mt-4 leading-relaxed font-sans">
                Resumes make claims; your Skill Passport provides verifiable evidence. Share your personalized link with hiring managers containing your assessment percentiles, verified GitHub repositories, and competency breakdown.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm opacity-85">
                  <CheckCircle2 className="h-4.5 w-4.5 text-[var(--accent-terracotta)] shrink-0" />
                  <span>Objective test scores evaluated under standardized constraints</span>
                </div>
                <div className="flex items-center gap-3 text-sm opacity-85">
                  <CheckCircle2 className="h-4.5 w-4.5 text-[var(--accent-terracotta)] shrink-0" />
                  <span>Verified commit history and multi-stage container repositories</span>
                </div>
                <div className="flex items-center gap-3 text-sm opacity-85">
                  <CheckCircle2 className="h-4.5 w-4.5 text-[var(--accent-terracotta)] shrink-0" />
                  <span>Shareable public profile with cryptographic credential tokens</span>
                </div>
              </div>

              <div className="mt-8">
                <Link to="/portfolio">
                  <Button variant="primary" iconRight={ChevronRight}>
                    View Sample Skill Passport
                  </Button>
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-current/20 bg-[var(--card-surface)] text-[var(--text-primary)] p-7 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-current/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border border-current/25 bg-current/10 flex items-center justify-center font-editorial-mono font-bold">
                    AC
                  </div>
                  <div>
                    <h4 className="font-editorial-title font-bold text-base uppercase">Alex Chen</h4>
                    <p className="text-xs font-editorial-mono opacity-60">Backend Developer Candidate</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded border border-current/25 text-[10px] font-editorial-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  VERIFIED CANDIDATE
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-current/15 bg-[var(--bg-page)]">
                  <span className="font-editorial-mono opacity-60 block text-[9px] uppercase tracking-wider">Python Score</span>
                  <span className="font-editorial-title text-xl font-bold mt-0.5 block">89%</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-editorial-mono">Advanced Verified</span>
                </div>
                <div className="p-3 rounded-lg border border-current/15 bg-[var(--bg-page)]">
                  <span className="font-editorial-mono opacity-60 block text-[9px] uppercase tracking-wider">REST API Score</span>
                  <span className="font-editorial-title text-xl font-bold mt-0.5 block">94%</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-editorial-mono">Intermediate Verified</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg border border-current/15 bg-[var(--bg-page)] text-xs">
                <p className="font-editorial-mono text-[10px] uppercase tracking-wider opacity-60 mb-1">Active Project:</p>
                <p className="opacity-80">Containerized REST API with Docker & PostgreSQL (40% complete)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Final CTA */}
      <section className="py-20 border-b border-current/15 relative z-10 text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold tracking-tight uppercase">
            Ready to bridge your skill gap?
          </h2>
          <p className="mt-4 text-base sm:text-lg opacity-75 max-w-xl mx-auto font-sans">
            Build your personalized career roadmap in under 3 minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/register')}
              iconRight={ArrowRight}
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Section 5: Footer */}
      <Footer />
    </div>
  );
};
