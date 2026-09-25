import React from 'react';
import { LandingNavbar } from './components/LandingNavbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { SkillIntelligenceSection } from './components/SkillIntelligenceSection';
import { SkillGapSection } from './components/SkillGapSection';
import { AiRoadmapGraphSection } from './components/AiRoadmapGraphSection';
import { LearningSection } from './components/LearningSection';
import { ProjectEvidenceSection } from './components/ProjectEvidenceSection';
import { JobIntelligenceSection } from './components/JobIntelligenceSection';
import { InterviewPrepSection } from './components/InterviewPrepSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { LandingFooter } from './components/LandingFooter';

export const LandingPage = () => {
  return (
    <div className="min-h-screen text-[var(--text-primary)] bg-[var(--bg-page)] flex flex-col font-sans relative transition-colors duration-300">
      {/* Blueprint Architectural Grid Overlay */}
      <div className="blueprint-grid-overlay">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="blueprint-grid-col" />
        ))}
      </div>

      {/* Modern SaaS Navigation */}
      <LandingNavbar />

      <main className="flex-1">
        {/* Section 1: Hero */}
        <HeroSection />

        {/* Section 2: How It Works */}
        <HowItWorksSection />

        {/* Section 3: Skill Intelligence */}
        <SkillIntelligenceSection />

        {/* Section 4: Skill Gap */}
        <SkillGapSection />

        {/* Section 5: AI Career Roadmap */}
        <AiRoadmapGraphSection />

        {/* Section 6: Prerequisite-Aware Learning */}
        <LearningSection />

        {/* Section 7: Practical Project Evidence */}
        <ProjectEvidenceSection />

        {/* Section 8: Competency-Based Job Intelligence */}
        <JobIntelligenceSection />

        {/* Section 9: Collaborative Interview Preparation */}
        <InterviewPrepSection />

        {/* Section 10: Final CTA */}
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
};
