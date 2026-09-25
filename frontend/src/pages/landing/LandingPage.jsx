import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

  const journeySteps = [
    { title: 'Career Goal', icon: Target, desc: 'Target Backend, Cloud or AI roles' },
    { title: 'Skill Analysis', icon: Layers, desc: 'Benchmark against live requirements' },
    { title: 'Verification', icon: ShieldCheck, desc: 'Objective technical assessments' },
    { title: 'Skill Gap', icon: TrendingUp, desc: 'Pinpoint precise missing competencies' },
    { title: 'Projects', icon: FolderGit2, desc: 'Verified code on GitHub' },
    { title: 'Job Match', icon: Briefcase, desc: 'Transparent competency matching' }
  ];

  const features = [
    {
      title: 'Targeted Skill Verification',
      description: 'Stop guessing what recruiters want. Take timed, standardized assessments in Docker, Python, SQL, and System Design to prove genuine competency.',
      icon: ShieldCheck,
      badge: 'Rigorous Verification'
    },
    {
      title: 'Dynamic Career Roadmaps',
      description: 'Interactive competency graphs outline what is Verified (🟢), Partial (🟡), and Missing (🔴) so you always know what to study next.',
      icon: Layers,
      badge: 'Data-Driven Path'
    },
    {
      title: 'Gap-Bridging Projects',
      description: 'Build production-grade projects specifically recommended to bridge your identified missing skills, backed by automated repository verification.',
      icon: FolderGit2,
      badge: 'Practical Evidence'
    },
    {
      title: 'Real Competency Matching',
      description: 'Jobs matched strictly by verified skills, not keyword-stuffed resumes. See exact overlapping competencies and remaining gaps upfront.',
      icon: Briefcase,
      badge: 'Zero Vanity Metrics'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 lg:px-12 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-xs">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <span className="font-heading text-lg font-bold tracking-tight text-slate-900">
            SkillBridge
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#passport" className="hover:text-slate-900 transition-colors">Skill Passport</a>
          <Link to="/career" className="hover:text-slate-900 transition-colors">Roadmaps</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5"
          >
            Log in
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/register')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28 border-b border-slate-100 bg-gradient-to-b from-slate-50/60 to-white">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1 text-xs font-semibold text-blue-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            <span>The Student Career-Readiness Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.12]">
            Know what you need to become <span className="text-blue-600">job-ready.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            SkillBridge maps your current skills to real job requirements, identifies your competency gaps, helps you build practical evidence, and connects you with relevant opportunities.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/register')}
              iconRight={ArrowRight}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 shadow-sm"
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
          <div className="mt-16 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">The Continuous Career Journey</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">From College Aspirations to Verified Offers</h3>
              </div>
              <span className="text-xs font-medium text-slate-400 hidden sm:inline-block">End-to-End Pathway</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {journeySteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="relative flex flex-col p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white border border-slate-200 text-blue-600 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 font-semibold">0{idx + 1}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight">{step.title}</span>
                    <span className="text-[11px] text-slate-500 mt-1 leading-snug">{step.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: How SkillBridge Works */}
      <section id="how-it-works" className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Architecture</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              How SkillBridge Works
            </h2>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              A systematic career engine that removes guesswork. We compare your profile against live role benchmarks and guide you step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Target & Gap Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Choose up to 3 target roles. SkillBridge analyses requirements and breaks them down into verified, partial, and missing competencies.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Verify & Learn</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Complete targeted skill assessments and recommended mini-courses to turn missing skills into verified badges backed by real assessment scores.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Build & Match</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Build practical GitHub projects that validate your ability, export your verified Skill Passport, and apply for high competency-match jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Features Grid */}
      <section id="features" className="py-20 bg-slate-50/60 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Core Capabilities</span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Engineered for Real Career Outcomes
            </h2>
            <p className="text-base text-slate-600 mt-3 leading-relaxed">
              Every screen answers: "What should the student do next?"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-7 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6: Skill Passport Preview */}
      <section id="passport" className="py-20 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Public Proof</span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
                Your Verified Skill Passport
              </h2>
              <p className="text-base text-slate-600 mt-4 leading-relaxed">
                Resumes make claims; your Skill Passport provides verifiable evidence. Share your personalized link with hiring managers containing your assessment percentiles, verified GitHub repositories, and competency breakdown.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>Objective test scores evaluated under standardized constraints</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
                  <span>Verified commit history and multi-stage container repositories</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
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

            <div className="rounded-2xl border border-slate-200 bg-slate-900 text-white p-7 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                    AC
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">Alex Chen</h4>
                    <p className="text-xs text-slate-400">Backend Developer Candidate</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                  Verified Candidate
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">Python Score</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">89%</span>
                  <span className="text-[10px] text-emerald-400">Advanced Verified</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                  <span className="text-slate-400 block text-[10px] uppercase">REST API Score</span>
                  <span className="text-lg font-bold text-white mt-0.5 block">94%</span>
                  <span className="text-[10px] text-emerald-400">Intermediate Verified</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-lg bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300">
                <p className="font-semibold text-white mb-1">Active Project:</p>
                <p className="text-slate-400">Containerized REST API with Docker & PostgreSQL (40% complete)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Final CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to bridge your skill gap?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            Build your personalized career roadmap in under 3 minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/register')}
              iconRight={ArrowRight}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
            >
              Get Started for Free
            </Button>
          </div>
        </div>
      </section>

      {/* Section 8: Footer */}
      <Footer />
    </div>
  );
};
