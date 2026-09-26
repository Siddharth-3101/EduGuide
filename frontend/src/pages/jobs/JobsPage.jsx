import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/api/jobService';
import { JobCard } from '../../components/jobs/JobCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  X,
  ExternalLink,
  ShieldAlert,
  Link as LinkIcon,
  CheckCircle2,
  RefreshCw,
  KeyRound,
  FileCode2,
  Landmark,
  BookOpen,
  GraduationCap,
  Award,
  Layers,
  FileText
} from 'lucide-react';

export const JobsPage = () => {
  const [activeTrack, setActiveTrack] = useState('corporate'); // 'corporate' | 'government'
  const [jobs, setJobs] = useState([]);
  const [govExams, setGovExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [workMode, setWorkMode] = useState('All');
  const [minMatch, setMinMatch] = useState(0);
  const [selectedGovCategory, setSelectedGovCategory] = useState('All');

  // Naukri Integration Modal & Live State
  const [naukriModalOpen, setNaukriModalOpen] = useState(false);
  const [naukriGuide, setNaukriGuide] = useState(null);
  const [liveNaukriLoading, setLiveNaukriLoading] = useState(false);
  const [liveNaukriActive, setLiveNaukriActive] = useState(false);

  // Government Exam Detail Modal State
  const [selectedGovExam, setSelectedGovExam] = useState(null);
  const [govModalOpen, setGovModalOpen] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getJobs({
        search: searchQuery,
        source: selectedSource,
        workMode,
        minMatch
      });
      setJobs(data);
    } catch (err) {
      console.error(err);
      setError('Could not load matched jobs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchGovExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobService.getGovernmentExams({
        category: selectedGovCategory,
        search: searchQuery
      });
      setGovExams(data);
    } catch (err) {
      console.error(err);
      setError('Could not load government examinations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTrack === 'corporate') {
      fetchJobs();
    } else {
      fetchGovExams();
    }
  }, [activeTrack, searchQuery, selectedSource, workMode, minMatch, selectedGovCategory]);

  const handleOpenNaukriGuide = async () => {
    setNaukriModalOpen(true);
    if (!naukriGuide) {
      const guide = await jobService.getNaukriGuide();
      setNaukriGuide(guide);
    }
  };

  const handleFetchLiveNaukri = async () => {
    try {
      setLiveNaukriLoading(true);
      const liveResults = await jobService.searchNaukriLive(searchQuery || 'Backend Developer', 'Bengaluru', 0);
      if (Array.isArray(liveResults) && liveResults.length > 0) {
        setJobs((prev) => {
          const nonNaukri = prev.filter((p) => !p.isLiveNaukriVerified);
          return [...liveResults, ...nonNaukri];
        });
        setLiveNaukriActive(true);
      }
    } catch (e) {
      console.error('Failed to query live Naukri jobs:', e);
    } finally {
      setLiveNaukriLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSource('All');
    setWorkMode('All');
    setMinMatch(0);
    setSelectedGovCategory('All');
    setLiveNaukriActive(false);
    if (activeTrack === 'corporate') fetchJobs();
    else fetchGovExams();
  };

  const openGovExamDetail = (exam) => {
    setSelectedGovExam(exam);
    setGovModalOpen(true);
  };

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-line)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)]">
              <Briefcase className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-editorial-mono font-bold text-[var(--accent-terracotta)] uppercase tracking-[0.2em]">
              Section 09 // Verified Opportunities & Public Service
            </span>
          </div>
          <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold tracking-tight uppercase">
            Career & Job Intelligence
          </h1>
          <p className="text-xs font-editorial-mono opacity-70 mt-1 max-w-2xl leading-relaxed">
            Personalized recommendations across industry tech companies, Maharatna PSUs, and prestigious Indian Government technical examinations.
          </p>
        </div>

        {/* Action Buttons for Naukri / Live Sync */}
        <div className="flex items-center gap-2 shrink-0">
          {activeTrack === 'corporate' && (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={KeyRound}
                onClick={handleOpenNaukriGuide}
                className="font-editorial-mono text-xs border-[var(--border-line)] hover:border-[var(--accent-terracotta)]"
              >
                Naukri API Setup
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={RefreshCw}
                loading={liveNaukriLoading}
                onClick={handleFetchLiveNaukri}
                className="font-editorial-mono text-xs shadow-xs"
              >
                Live Naukri Sync
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Track Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-current/10 pb-2">
        <button
          onClick={() => setActiveTrack('corporate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-editorial-title text-xs font-bold uppercase tracking-wider transition-all ${
            activeTrack === 'corporate'
              ? 'bg-[var(--accent-terracotta)] text-white shadow-xs'
              : 'bg-current/5 hover:bg-current/10 opacity-70 hover:opacity-100'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          Industry & Corporate Roles ({jobs.length})
        </button>

        <button
          onClick={() => setActiveTrack('government')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-editorial-title text-xs font-bold uppercase tracking-wider transition-all ${
            activeTrack === 'government'
              ? 'bg-[var(--accent-terracotta)] text-white shadow-xs'
              : 'bg-current/5 hover:bg-current/10 opacity-70 hover:opacity-100'
          }`}
        >
          <Landmark className="h-4 w-4" />
          Government Exams & PSUs ({govExams.length})
        </button>
      </div>

      {liveNaukriActive && activeTrack === 'corporate' && (
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-editorial-mono flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <strong>Live Naukri Feed Active:</strong> Real-time verified postings synced with direct one-click application links.
          </div>
          <button
            onClick={() => {
              setLiveNaukriActive(false);
              fetchJobs();
            }}
            className="text-[11px] font-bold text-[var(--accent-terracotta)] hover:underline"
          >
            Clear Live Feed
          </button>
        </div>
      )}

      {/* Main Grid: Left Filters Sidebar + Right Content Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="bg-[var(--card-surface)] p-5 rounded-md border border-[var(--border-line)] shadow-2xs space-y-5 text-[var(--text-primary)]">
            <div className="flex items-center justify-between pb-3 border-b border-current/10">
              <span className="text-xs font-editorial-mono font-bold uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" /> Filters
              </span>
              <button
                onClick={resetFilters}
                className="text-xs font-editorial-mono text-[var(--accent-terracotta)] hover:underline font-bold"
              >
                Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-editorial-mono uppercase font-bold tracking-wider opacity-70">
                Search Opportunities
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 opacity-40" />
                <input
                  type="text"
                  placeholder={activeTrack === 'corporate' ? "Role, skill, company..." : "Exam, agency (ISRO, DRDO, GATE)..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded border border-[var(--border-line)] bg-current/5 focus:outline-hidden focus:border-[var(--accent-terracotta)] font-editorial-mono"
                />
              </div>
            </div>

            {/* Corporate Filters */}
            {activeTrack === 'corporate' ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-editorial-mono uppercase font-bold tracking-wider opacity-70">
                    Platform Source
                  </label>
                  <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded border border-[var(--border-line)] bg-current/5 focus:outline-hidden focus:border-[var(--accent-terracotta)] font-editorial-mono"
                  >
                    <option value="All">All Sources</option>
                    <option value="Naukri">Naukri Partner Feed</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Direct">Employer Direct</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-editorial-mono uppercase font-bold tracking-wider opacity-70">
                    Work Mode
                  </label>
                  <div className="grid grid-cols-3 gap-1 text-xs font-editorial-mono">
                    {['All', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setWorkMode(mode)}
                        className={`py-1 rounded border text-center transition-colors ${
                          workMode === mode
                            ? 'bg-[var(--accent-terracotta)] text-white border-[var(--accent-terracotta)] font-bold'
                            : 'border-[var(--border-line)] hover:bg-current/5'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-editorial-mono uppercase font-bold tracking-wider opacity-70">
                      Minimum Match
                    </label>
                    <span className="text-xs font-editorial-mono font-bold text-[var(--accent-terracotta)]">
                      {minMatch}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="10"
                    value={minMatch}
                    onChange={(e) => setMinMatch(Number(e.target.value))}
                    className="w-full accent-[var(--accent-terracotta)] cursor-pointer"
                  />
                </div>
              </>
            ) : (
              /* Government Categories */
              <div className="space-y-2">
                <label className="text-[10px] font-editorial-mono uppercase font-bold tracking-wider opacity-70">
                  Government Sector / Agency
                </label>
                <div className="space-y-1 text-xs font-editorial-mono">
                  {[
                    'All',
                    'Scientific & Space Research',
                    'Defence & Security Engineering',
                    'Public Sector Undertakings (PSUs)',
                    'National e-Governance & IT Infrastructure',
                    'Railways & Transport Infrastructure',
                    'Banking, Fintech & Payments Infrastructure',
                    'Civil & Engineering Services (Group A)'
                  ].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedGovCategory(cat)}
                      className={`w-full text-left px-2.5 py-1.5 rounded transition-colors text-[11px] ${
                        selectedGovCategory === cat
                          ? 'bg-[var(--accent-terracotta)] text-white font-bold'
                          : 'hover:bg-current/5 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Callout Notice */}
          <div className="p-4 rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] text-xs opacity-75 leading-relaxed font-editorial-mono">
            <span className="font-bold block mb-1 text-[var(--accent-terracotta)] flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Skill-Aligned Evaluation
            </span>
            Opportunities are cross-referenced with your verified and evidence-backed competencies in Java, Spring Boot, MySQL, REST APIs, and core CS fundamentals.
          </div>
        </aside>

        {/* Right Feed */}
        <main className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-editorial-mono opacity-70 px-1">
            <span>
              Showing <strong>{activeTrack === 'corporate' ? jobs.length : govExams.length}</strong> {activeTrack === 'corporate' ? 'corporate positions' : 'government examinations'}
            </span>
            <span>Sorted by Technical Alignment</span>
          </div>

          {error ? (
            <ErrorState message={error} onRetry={activeTrack === 'corporate' ? fetchJobs : fetchGovExams} />
          ) : loading ? (
            <div className="space-y-4">
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : activeTrack === 'corporate' ? (
            /* Corporate Jobs Feed */
            jobs.length === 0 ? (
              <EmptyState
                title="No matching roles found"
                description="Lower your minimum competency match or broaden your filters to discover more opportunities."
                actionText="Reset Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )
          ) : (
            /* Government Exams & PSU Feed */
            govExams.length === 0 ? (
              <EmptyState
                title="No government examinations found"
                description="Try clearing your category filter or search query."
                actionText="Reset Filters"
                onAction={resetFilters}
              />
            ) : (
              <div className="space-y-4">
                {govExams.map((exam) => (
                  <div
                    key={exam.exam_id}
                    className="p-5 rounded-xl border border-[var(--border-line)] bg-[var(--card-surface)] shadow-xs hover:border-[var(--accent-terracotta)] transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] font-editorial-mono uppercase border border-emerald-500/20">
                            {exam.conducting_body}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-current/5 border border-current/15 text-[10px] font-editorial-mono opacity-80">
                            {exam.category}
                          </span>
                        </div>
                        <h3 className="font-editorial-title text-base sm:text-lg font-bold">
                          {exam.exam_name}
                        </h3>
                        <p className="text-xs font-editorial-mono text-[var(--accent-terracotta)] font-semibold mt-0.5">
                          {exam.role_title} • {exam.pay_scale}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-editorial-mono font-bold text-xs">
                          <Award className="h-3 w-3" /> 88% Match
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-editorial-mono opacity-80 leading-relaxed">
                      {exam.description}
                    </p>

                    {/* Key Tested Skills */}
                    <div className="pt-2 border-t border-current/10 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-editorial-mono uppercase opacity-60 mr-1">
                        Syllabus Competencies:
                      </span>
                      {(exam.key_skills_tested || []).map((sk) => (
                        <span
                          key={sk.skill_name}
                          className="px-2 py-0.5 rounded bg-current/5 border border-current/15 text-[11px] font-editorial-mono"
                        >
                          {sk.skill_name}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-current/10 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[11px] font-editorial-mono opacity-70">
                        Selection: {exam.selection_process ? exam.selection_process.split('•')[0] : 'Written Test + Interview'}
                      </span>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={BookOpen}
                          onClick={() => openGovExamDetail(exam)}
                          className="font-editorial-mono text-xs border-[var(--border-line)] hover:border-[var(--accent-terracotta)]"
                        >
                          Syllabus & Study Materials
                        </Button>

                        <a
                          href={exam.official_portal_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-terracotta)] text-white font-editorial-mono text-xs font-bold hover:opacity-90 transition-opacity"
                        >
                          Official Portal <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </main>
      </div>

      {/* Government Exam Details Modal */}
      {selectedGovExam && (
        <Modal
          isOpen={govModalOpen}
          onClose={() => setGovModalOpen(false)}
          title={selectedGovExam.exam_name}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5 text-xs font-editorial-mono text-[var(--text-primary)] max-h-[75vh] overflow-y-auto pr-1">
            {/* Header Summary */}
            <div className="p-3.5 rounded-lg bg-current/5 border border-current/10 space-y-1.5">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-sm block font-editorial-title">{selectedGovExam.role_title}</span>
                  <span className="text-[11px] opacity-75">{selectedGovExam.conducting_body} • {selectedGovExam.department}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                  {selectedGovExam.pay_scale}
                </span>
              </div>
              <p className="text-[11px] opacity-85 leading-relaxed pt-1">
                {selectedGovExam.description}
              </p>
            </div>

            {/* Eligibility & Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-[var(--border-line)] bg-current/5 space-y-1">
                <span className="font-bold uppercase tracking-wider text-[var(--accent-terracotta)] block text-[10px]">
                  Eligibility Criteria
                </span>
                <p className="text-[11px] opacity-85">
                  <strong>Degrees:</strong> {selectedGovExam.eligible_degrees?.join(', ') || 'B.E. / B.Tech CSE/IT'}
                </p>
                <p className="text-[11px] opacity-85">
                  <strong>Minimum Score:</strong> {selectedGovExam.min_qualification_score || 'First Class'}
                </p>
                <p className="text-[11px] opacity-85">
                  <strong>Age Limit:</strong> {selectedGovExam.age_limit || '28 years'}
                </p>
              </div>

              <div className="p-3 rounded-lg border border-[var(--border-line)] bg-current/5 space-y-1">
                <span className="font-bold uppercase tracking-wider text-[var(--accent-terracotta)] block text-[10px]">
                  Selection Architecture
                </span>
                <p className="text-[11px] opacity-85 leading-relaxed">
                  {selectedGovExam.selection_process}
                </p>
              </div>
            </div>

            {/* Technical Syllabus Breakdown */}
            <div className="space-y-2">
              <h4 className="font-editorial-title font-bold text-sm uppercase text-[var(--accent-terracotta)] flex items-center gap-1.5">
                <Layers className="h-4 w-4" /> Technical Examination Syllabus
              </h4>
              <div className="space-y-2">
                {(selectedGovExam.syllabus_sections || []).map((sec, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-current/10 bg-current/5">
                    <span className="font-bold block text-xs mb-1 text-[var(--text-primary)]">
                      {sec.module}
                    </span>
                    <p className="text-[11px] opacity-80 leading-relaxed font-sans">
                      {sec.topics}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Study Materials & References */}
            <div className="space-y-2">
              <h4 className="font-editorial-title font-bold text-sm uppercase text-[var(--accent-terracotta)] flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" /> Recommended Official Study Materials
              </h4>
              <div className="space-y-2">
                {(selectedGovExam.study_materials || []).map((mat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-current/10 flex items-center justify-between gap-3 bg-[var(--bg-page)]"
                  >
                    <div>
                      <span className="font-bold block text-xs">{mat.title}</span>
                      <span className="text-[10px] opacity-60">{mat.type} • {mat.free ? 'Free / Open Access' : 'Standard Reference'}</span>
                    </div>
                    <a
                      href={mat.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--accent-terracotta)] hover:underline font-bold text-xs shrink-0"
                    >
                      Open Link <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Application Procedure */}
            <div className="space-y-2">
              <h4 className="font-editorial-title font-bold text-sm uppercase text-[var(--accent-terracotta)] flex items-center gap-1.5">
                <FileText className="h-4 w-4" /> Step-by-Step Application Procedure
              </h4>
              <ol className="list-decimal pl-4 space-y-1.5 opacity-90 leading-relaxed text-[11px]">
                {(selectedGovExam.application_procedure || []).map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-current/10 flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setGovModalOpen(false)}>
                Close
              </Button>
              <a
                href={selectedGovExam.official_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--accent-terracotta)] text-white font-editorial-mono text-xs font-bold hover:opacity-90 transition-opacity"
              >
                Go to Official Application Portal <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* Naukri API Setup Guide Modal */}
      <Modal
        isOpen={naukriModalOpen}
        onClose={() => setNaukriModalOpen(false)}
        title="Official Naukri (Info Edge) API Setup"
      >
        <div className="space-y-4 text-xs font-editorial-mono text-[var(--text-primary)]">
          <p className="leading-relaxed opacity-85">
            Naukri is operated by Info Edge India Ltd and protects their candidate ecosystem via partner credentials. SkillSync includes native support for both official enterprise API connections and real-time parameterized deep-link queries.
          </p>

          {/* Credentials Required Card */}
          <div className="p-3 rounded-lg border border-[var(--border-line)] bg-current/5 space-y-2">
            <span className="font-bold uppercase tracking-wider text-[var(--accent-terracotta)] block">
              Required Environment Variables
            </span>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between items-center bg-[var(--bg-page)] p-1.5 rounded border border-current/10">
                <span className="font-bold">NAUKRI_APP_ID</span>
                <span className="opacity-60 text-[10px]">Partner Application ID</span>
              </div>
              <div className="flex justify-between items-center bg-[var(--bg-page)] p-1.5 rounded border border-current/10">
                <span className="font-bold">NAUKRI_SYSTEM_KEY</span>
                <span className="opacity-60 text-[10px]">Enterprise Header Key</span>
              </div>
              <div className="flex justify-between items-center bg-[var(--bg-page)] p-1.5 rounded border border-current/10">
                <span className="font-bold">NAUKRI_CLIENT_SECRET</span>
                <span className="opacity-60 text-[10px]">OAuth 2.0 Client Secret</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-current/10 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setNaukriModalOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={RefreshCw}
              onClick={() => {
                setNaukriModalOpen(false);
                handleFetchLiveNaukri();
              }}
            >
              Sync Live Naukri Jobs
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
