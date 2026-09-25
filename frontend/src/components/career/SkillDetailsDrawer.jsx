import React, { useEffect, useRef } from 'react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import {
  X,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FolderGit2,
  ArrowRight,
  TrendingUp,
  Target,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';

export const SkillDetailsDrawer = ({ skillNode, onClose, onVerifySkill }) => {
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Click outside drawer listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Delay adding to avoid capturing the initial node click event
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  if (!skillNode) return null;

  const data = skillNode.data || {};
  const isVerified = data.status === 'verified';
  const isPartial = data.status === 'partial';
  const isNotVerified = data.status === 'missing' || data.status === 'not-verified';
  const isRecommendedNext = !!data.isRecommendedNext;

  const getStatusBadge = () => {
    if (isVerified) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-editorial-mono">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          🟢 VERIFIED
        </span>
      );
    }
    if (isPartial) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs font-editorial-mono">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          🟡 PARTIAL EVIDENCE
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs font-editorial-mono">
        <span className="h-2 w-2 rounded-full bg-rose-500" />
        🔴 NOT VERIFIED
      </span>
    );
  };

  const handleStartAssessment = () => {
    onClose();
    if (data.assessmentId) {
      navigate(`/assessments/${data.assessmentId}`);
    } else {
      navigate(`/assessments/${data.skillId || 'general'}`);
    }
  };

  const handleViewResources = () => {
    onClose();
    navigate(`/learning?gap=${encodeURIComponent(data.name || '')}`);
  };

  return (
    <>
      {/* Semi-transparent Backdrop Overlay that closes drawer on click */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in duration-200 cursor-pointer"
        onClick={onClose}
        aria-label="Click outside to close detail panel"
        title="Click outside to close"
      />

      {/* Slide-out Drawer Panel */}
      <div
        ref={drawerRef}
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-[var(--card-surface)] border-l border-[var(--border-line)] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between font-editorial-mono animate-in slide-in-from-right duration-200 text-[var(--text-primary)]"
      >
        <div className="space-y-6">
          {/* Header with High-Visibility Close Button */}
          <div className="flex items-start justify-between pb-3 border-b border-current/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider text-[var(--accent-terracotta)] font-bold">
                  Competency Node Inspection
                </span>
                {isRecommendedNext && (
                  <span className="bg-blue-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">
                    Recommended Next
                  </span>
                )}
              </div>
              <h2 className="font-editorial-title text-2xl font-bold uppercase leading-tight">
                {data.name}
              </h2>
              <span className="text-[11px] opacity-60 uppercase">{data.category}</span>
            </div>

            <button
              onClick={onClose}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-current/20 bg-current/5 hover:bg-current/15 text-[var(--text-primary)] transition-all cursor-pointer shadow-xs"
              aria-label="Close detail panel"
              title="Close panel (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Status & Level Breakdown */}
          <div className="flex items-center justify-between p-3.5 rounded-lg border border-current/15 bg-current/5">
            <div className="space-y-1">
              <span className="opacity-60 text-[10px] uppercase block">Competency Status</span>
              {getStatusBadge()}
            </div>
            <div className="text-right space-y-0.5">
              <span className="opacity-60 text-[10px] uppercase block">Assessment Benchmark</span>
              <span className="font-bold text-sm text-[var(--accent-terracotta)]">
                {isVerified ? `${data.score || 90}% Pass` : isPartial ? 'Partial Match' : 'Pending Test'}
              </span>
            </div>
          </div>

          {/* Current Level vs Required Level */}
          <div className="p-4 rounded-lg border border-current/15 bg-[var(--bg-page)] text-xs font-sans space-y-2">
            <div className="flex justify-between py-1 border-b border-current/10">
              <span className="opacity-60 font-editorial-mono text-[10px] uppercase">Current Level:</span>
              <span className={`font-semibold ${isVerified ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                {data.currentLevel || 'None'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-current/10">
              <span className="opacity-60 font-editorial-mono text-[10px] uppercase">Required Level:</span>
              <span className="font-semibold text-[var(--text-primary)]">
                {data.requiredLevel || 'Intermediate'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="opacity-60 font-editorial-mono text-[10px] uppercase">Assessment Status:</span>
              <span className="font-bold text-[var(--accent-terracotta)]">
                {isVerified ? 'Competency Verified ✓' : 'Verification Required'}
              </span>
            </div>
          </div>

          {/* Why this skill is needed */}
          <div className="p-4 rounded-lg border border-current/15 bg-current/5 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)] flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" /> Why This Skill is Needed
            </span>
            <p className="text-xs font-sans opacity-85 leading-relaxed">
              {data.whyNeeded || 'Essential technical competency for scalable backend services, high-throughput microservices, and continuous deployments.'}
            </p>
          </div>

          {/* Prerequisites */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 block">
              Prerequisites & Dependencies
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              {(data.prerequisites || ['None']).map((prereq) => (
                <span
                  key={prereq}
                  className="px-2.5 py-1 rounded bg-[var(--bg-page)] border border-current/15 text-[11px] font-semibold"
                >
                  {prereq}
                </span>
              ))}
            </div>
          </div>

          {/* Evidence */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 block">
              Candidate Evidence
            </span>
            <div className="space-y-1.5 text-xs font-sans">
              {(data.evidence || ['No evidence on file']).map((ev, i) => (
                <div key={i} className="p-2 rounded bg-current/5 border border-current/10 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  <span>{ev}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Learning Resources */}
          {data.resources && data.resources.length > 0 && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 block">
                Recommended Learning Resources
              </span>
              <div className="space-y-1.5">
                {data.resources.map((res, i) => (
                  <div key={i} className="p-2.5 rounded border border-current/10 bg-[var(--bg-page)] text-xs flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-[11px] font-editorial-title">{res.title}</h5>
                      <span className="text-[10px] opacity-60 font-editorial-mono">{res.provider} • {res.duration}</span>
                    </div>
                    <BookOpen className="h-4 w-4 opacity-50" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Buttons & Dismissal */}
        <div className="pt-5 border-t border-current/10 space-y-2.5">
          <div className="flex items-center gap-2">
            <Button
              size="md"
              variant="outline"
              onClick={handleViewResources}
              className="flex-1 text-xs font-bold"
              iconLeft={BookOpen}
            >
              View Resources
            </Button>

            <Button
              size="md"
              variant="primary"
              onClick={handleStartAssessment}
              className="flex-1 text-xs font-bold"
              iconRight={ArrowRight}
            >
              Start Assessment
            </Button>
          </div>

          {/* Simulation Button to verify progress and watch graph animate */}
          {!isVerified && onVerifySkill && (
            <button
              onClick={() => onVerifySkill(skillNode.id)}
              className="w-full py-2 px-3 rounded border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-editorial-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Simulate Skill Verification & Animate Path</span>
            </button>
          )}

          {/* Close Panel Button */}
          <button
            onClick={onClose}
            className="w-full py-1.5 rounded border border-current/15 bg-current/5 hover:bg-current/10 text-xs font-editorial-mono opacity-80 hover:opacity-100 transition-colors cursor-pointer"
          >
            Close Panel (or click outside / press Esc)
          </button>
        </div>
      </div>
    </>
  );
};
