import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Award,
  FolderGit2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const SkillIntelligenceSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('certificate');

  const evidenceTypes = [
    {
      id: 'certificate',
      name: 'Certificate Ingestion',
      icon: Award,
      badge: 'OCR & Issuer Verification',
      source: 'AWS Certified Solutions Architect / DeepLearning.AI',
      extractedSkills: [
        { name: 'Cloud Architecture', level: 'Intermediate', confidence: '98%', status: 'Evidence Found' },
        { name: 'AWS Lambda / S3', level: 'Intermediate', confidence: '95%', status: 'Evidence Found' },
        { name: 'VPC & Networking', level: 'Beginner', confidence: '89%', status: 'Partial' }
      ]
    },
    {
      id: 'resume',
      name: 'Resume RAG Parsing',
      icon: FileText,
      badge: 'Semantic Experience Extraction',
      source: 'Alex_Chen_Software_Engineer_Resume.pdf',
      extractedSkills: [
        { name: 'Python & FastAPI', level: 'Advanced', confidence: '99%', status: 'Verified' },
        { name: 'PostgreSQL Relational DB', level: 'Intermediate', confidence: '94%', status: 'Verified' },
        { name: 'Docker Compose', level: 'Beginner', confidence: '82%', status: 'Evidence Found' }
      ]
    },
    {
      id: 'github',
      name: 'GitHub Repository Analysis',
      icon: FolderGit2,
      badge: 'Automated AST & Dockerfile Inspection',
      source: 'github.com/alexchen/student-management-api',
      extractedSkills: [
        { name: 'REST API & OpenAPI', level: 'Advanced', confidence: '96%', status: 'Verified' },
        { name: 'Multi-Stage Dockerfile', level: 'Intermediate', confidence: '91%', status: 'Evidence Found' },
        { name: 'Alembic Migrations', level: 'Intermediate', confidence: '88%', status: 'Evidence Found' }
      ]
    }
  ];

  const current = evidenceTypes.find((t) => t.id === activeTab);

  return (
    <section id="skill-intelligence" className="py-20 sm:py-28 border-b border-[var(--border-line)] relative z-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Descriptive Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-current/20 bg-[var(--card-surface)] px-3.5 py-1 text-xs font-editorial-mono tracking-wider opacity-85">
              <Cpu className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
              <span>SECTION 03 // SKILL INTELLIGENCE</span>
            </div>

            <h2 className="font-editorial-title text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] uppercase">
              Transform unstructured proof into structured competency.
            </h2>

            <p className="text-base opacity-75 leading-relaxed font-sans">
              Traditional platforms rely on keyword scraping. SkillSync uses a multi-modal RAG pipeline to ingest resumes, accredited certificates, and live GitHub repositories, transforming scattered claims into audited evidence.
            </p>

            <div className="space-y-3 font-editorial-mono text-xs opacity-85">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent-terracotta)] shrink-0" />
                <span>Extracts issuer, coursework, verified test scores, and code ASTs</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent-terracotta)] shrink-0" />
                <span>Upload certificates with confidence ratings without misleading claims</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[var(--accent-terracotta)] shrink-0" />
                <span>Privacy-first analysis: zero retention of unnecessary production secrets</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => navigate('/skills')}
                iconRight={ArrowRight}
                className="text-xs font-bold"
              >
                Try Document Ingestion
              </Button>
            </div>
          </div>

          {/* Right Column: Live Ingestion Simulation Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] p-6 sm:p-8 shadow-xl">
              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-current/10 pb-4 mb-6">
                {evidenceTypes.map((tab) => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-editorial-mono transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--accent-terracotta)] text-white font-bold'
                          : 'opacity-70 hover:opacity-100 bg-current/5'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{tab.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Ingestion Stream Details */}
              <div className="space-y-4">
                <div className="p-3 rounded-lg border border-current/10 bg-current/5 font-editorial-mono text-xs flex justify-between items-center">
                  <div>
                    <span className="opacity-60 text-[10px] uppercase block tracking-wider">Source Document</span>
                    <span className="font-bold truncate max-w-xs block">{current.source}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[var(--accent-terracotta)]/15 border border-[var(--accent-terracotta)]/30 text-[10px] font-bold text-[var(--accent-terracotta)]">
                    {current.badge}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider opacity-60 block mb-2">
                    Extracted Competency Vector
                  </span>
                  <div className="space-y-2">
                    {current.extractedSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="p-3 rounded-lg border border-current/10 bg-[var(--bg-page)] flex items-center justify-between text-xs font-editorial-mono"
                      >
                        <div>
                          <span className="font-bold block text-[var(--text-primary)]">{skill.name}</span>
                          <span className="opacity-60 text-[10px]">{skill.level}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                            {skill.confidence} Confidence
                          </span>
                          <span className="text-[9px] opacity-60">{skill.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[11px] font-editorial-mono opacity-60">
                  <span>Audit Status: RAG Vector Mapped</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Parsing Accuracy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
