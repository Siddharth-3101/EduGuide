import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewApi } from '../../services/api/interviewApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  MessagesSquare,
  Plus,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  BookOpen,
  Share2,
  CheckCircle2,
  HelpCircle,
  Play,
  Building,
  ChevronDown,
  ChevronUp,
  Award,
  Calendar,
  Send,
  X,
  MessageSquareQuote,
  Lightbulb,
  Briefcase
} from 'lucide-react';

export const InterviewsDashboardPage = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [expandedExpId, setExpandedExpId] = useState('exp-1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('experiences'); // Default to collaborative student experiences
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [shareExpModalOpen, setShareExpModalOpen] = useState(false);
  const [addQuestionModalOpen, setAddQuestionModalOpen] = useState(false);
  const [targetDriveId, setTargetDriveId] = useState(null);
  const [targetRoundNumber, setTargetRoundNumber] = useState(1);

  const [newSetData, setNewSetData] = useState({
    title: '',
    description: '',
    targetRole: 'Backend Developer',
    difficulty: 'Intermediate',
    skills: 'Python, SQL, REST API, Docker'
  });

  const [newExpData, setNewExpData] = useState({
    company: '',
    role: 'Backend Developer',
    status: 'Offered',
    overallDifficulty: 'Medium',
    summary: '',
    round1Title: 'Round 1: Online Coding OA',
    round1Questions: '',
    round1Tips: '',
    round2Title: 'Round 2: Technical & DSA',
    round2Questions: '',
    round2Tips: ''
  });

  const [newQuestionData, setNewQuestionData] = useState({
    contributorName: 'Siddharth G',
    college: 'Karpagam College of Engineering',
    title: '',
    prompt: '',
    difficulty: 'Medium',
    tags: 'DSA, Dynamic Programming, SQL',
    tips: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [setsData, recData, expData] = await Promise.all([
        interviewApi.getInterviewSets(),
        interviewApi.getRecommendedQuestions(),
        interviewApi.getInterviewExperiences ? interviewApi.getInterviewExperiences() : []
      ]);
      setSets(setsData || []);
      setRecommended(recData || []);
      setExperiences(expData || []);
    } catch (err) {
      console.error(err);
      setError('Could not load interview data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleShareExpSubmit = async (e) => {
    e.preventDefault();
    if (!newExpData.company || !newExpData.summary) return;

    const rounds = [
      {
        roundNumber: 1,
        title: newExpData.round1Title,
        duration: '60 mins',
        difficulty: 'Medium',
        description: 'Online coding and technical assessment.',
        questionsAsked: newExpData.round1Questions.split('\n').filter(Boolean),
        tips: newExpData.round1Tips || 'Review core fundamentals and edge cases.'
      }
    ];

    if (newExpData.round2Questions) {
      rounds.push({
        roundNumber: 2,
        title: newExpData.round2Title,
        duration: '60 mins',
        difficulty: 'Hard',
        description: 'Live coding and technical deep dive with senior engineer.',
        questionsAsked: newExpData.round2Questions.split('\n').filter(Boolean),
        tips: newExpData.round2Tips || 'Think aloud and discuss trade-offs.'
      });
    }

    try {
      const created = await interviewApi.addInterviewExperience({
        company: newExpData.company,
        role: newExpData.role,
        status: newExpData.status,
        overallDifficulty: newExpData.overallDifficulty,
        summary: newExpData.summary,
        rounds
      });
      setExperiences([created, ...experiences]);
      setExpandedExpId(created.id);
      setShareExpModalOpen(false);
      setNewExpData({
        company: '',
        role: 'Backend Developer',
        status: 'Offered',
        overallDifficulty: 'Medium',
        summary: '',
        round1Title: 'Round 1: Online Coding OA',
        round1Questions: '',
        round1Tips: '',
        round2Title: 'Round 2: Technical & DSA',
        round2Questions: '',
        round2Tips: ''
      });
    } catch (err) {
      console.error('Failed to submit experience:', err);
    }
  };

  const handleOpenAddQuestion = (driveId, roundNumber) => {
    setTargetDriveId(driveId);
    setTargetRoundNumber(roundNumber);
    setNewQuestionData({
      contributorName: 'Siddharth G',
      college: 'Karpagam College of Engineering',
      title: '',
      prompt: '',
      difficulty: 'Medium',
      tags: 'DSA, Problem Solving, Core CS',
      tips: ''
    });
    setAddQuestionModalOpen(true);
  };

  const handleSaveQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!newQuestionData.title || !newQuestionData.prompt) return;

    try {
      await interviewApi.addQuestionToRound(targetDriveId, targetRoundNumber, newQuestionData);
      const updated = await interviewApi.getCompanyDrives();
      setExperiences(updated);
      setExpandedExpId(targetDriveId);
      setAddQuestionModalOpen(false);
    } catch (err) {
      console.error('Failed to add question to round:', err);
    }
  };

  const handleCreateSet = async (e) => {
    e.preventDefault();
    if (!newSetData.title.trim()) return;

    try {
      const created = await interviewApi.createInterviewSet({
        title: newSetData.title,
        description: newSetData.description,
        targetRole: newSetData.targetRole,
        difficulty: newSetData.difficulty,
        skills: newSetData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      });
      setCreateModalOpen(false);
      navigate(`/interviews/${created.id}`);
    } catch (err) {
      console.error('Failed to create set:', err);
    }
  };

  const filteredSets = sets.filter((s) => {
    if (activeTab === 'mine') return !s.isSharedWithMe;
    if (activeTab === 'shared') return s.isSharedWithMe;
    return true;
  });

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-current/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-current/5 text-[var(--accent-terracotta)]">
              <MessagesSquare className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
              COLLABORATIVE INTERVIEW INTELLIGENCE
            </span>
          </div>
          <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold tracking-tight uppercase">
            Company Recruitment Drives & Questions
          </h1>
          <p className="text-sm opacity-70 mt-1 max-w-2xl font-sans">
            Collaborative single-record recruitment pools: students attending the same drive contribute questions, challenges, and tips round-by-round.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="primary"
            iconLeft={Send}
            onClick={() => setShareExpModalOpen(true)}
            className="text-xs"
          >
            Register Company Drive
          </Button>
          <Button
            variant="secondary"
            iconLeft={Plus}
            onClick={() => setCreateModalOpen(true)}
            className="text-xs"
          >
            New Practice Set
          </Button>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 font-editorial-mono text-xs">
        <button
          onClick={() => setActiveTab('experiences')}
          className={`px-3.5 py-1.5 rounded transition-all flex items-center gap-1.5 ${
            activeTab === 'experiences'
              ? 'bg-[var(--card-surface)] font-bold border border-current/25 shadow-2xs text-[var(--accent-terracotta)]'
              : 'opacity-60 hover:opacity-100 hover:bg-current/5'
          }`}
        >
          <MessageSquareQuote className="h-3.5 w-3.5" />
          <span>Student Experiences ({experiences.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded transition-all ${
            activeTab === 'all'
              ? 'bg-[var(--card-surface)] font-bold border border-current/25 shadow-2xs'
              : 'opacity-60 hover:opacity-100 hover:bg-current/5'
          }`}
        >
          All Practice Sets ({sets.length})
        </button>
        <button
          onClick={() => setActiveTab('mine')}
          className={`px-3 py-1.5 rounded transition-all ${
            activeTab === 'mine'
              ? 'bg-[var(--card-surface)] font-bold border border-current/25 shadow-2xs'
              : 'opacity-60 hover:opacity-100 hover:bg-current/5'
          }`}
        >
          My Sets ({sets.filter((s) => !s.isSharedWithMe).length})
        </button>
        <button
          onClick={() => setActiveTab('shared')}
          className={`px-3 py-1.5 rounded transition-all ${
            activeTab === 'shared'
              ? 'bg-[var(--card-surface)] font-bold border border-current/25 shadow-2xs'
              : 'opacity-60 hover:opacity-100 hover:bg-current/5'
          }`}
        >
          Shared With Me ({sets.filter((s) => s.isSharedWithMe).length})
        </button>
      </div>

      {/* 1. STUDENT EXPERIENCES TAB CONTENT */}
      {activeTab === 'experiences' ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-editorial-mono text-xs opacity-75">
            <span>Collaborative company recruitment drives — contributed round-by-round by attending students</span>
            <span>{experiences.length} Active Company Drives</span>
          </div>

          <div className="space-y-6">
            {experiences.map((exp) => {
              const isExpanded = expandedExpId === exp.id;
              const contributorsList = exp.contributors || [
                { name: exp.studentName || 'Siddharth G', college: 'KCE', date: exp.date || 'Recent' }
              ];
              const totalQuestionsCount = exp.rounds?.reduce((acc, r) => acc + (r.questions?.length || r.questionsAsked?.length || 0), 0) || 0;

              return (
                <Card key={exp.id} className="p-6 space-y-5 border border-current/15 bg-[var(--card-surface)] shadow-2xs">
                  {/* Company Drive Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 pb-4 border-b border-current/10">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-current/20 bg-current/5 font-bold font-editorial-title text-base text-[var(--accent-terracotta)]">
                        {exp.company?.slice(0, 2).toUpperCase() || 'CO'}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-editorial-title text-xl font-bold uppercase">{exp.company}</h3>
                          <span className="opacity-40">•</span>
                          <span className="font-editorial-mono text-xs font-semibold opacity-80">{exp.role}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-editorial-mono font-bold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                            {exp.driveDate || '2026 Batch Drive'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-editorial-mono text-xs opacity-70">
                          <span className="flex items-center gap-1 font-semibold text-[var(--accent-terracotta)]">
                            <Users className="h-3.5 w-3.5" /> {exp.studentContributorsCount || contributorsList.length} Students Contributed
                          </span>
                          <span>•</span>
                          <span>{exp.rounds?.length || 4} Interview Rounds</span>
                          <span>•</span>
                          <span>{totalQuestionsCount} Logged Questions</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end lg:self-auto font-editorial-mono text-xs">
                      <span className="px-2.5 py-1 rounded border border-current/15 bg-current/5 opacity-80 text-[10px] uppercase">
                        Difficulty: <strong className="text-amber-500">{exp.overallDifficulty || 'Medium-Hard'}</strong>
                      </span>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setExpandedExpId(isExpanded ? null : exp.id)}
                        className="text-xs"
                      >
                        {isExpanded ? (
                          <>
                            Collapse Drive <ChevronUp className="h-3.5 w-3.5 ml-1" />
                          </>
                        ) : (
                          <>
                            Explore {exp.rounds?.length || 0} Rounds ({totalQuestionsCount} Questions) <ChevronDown className="h-3.5 w-3.5 ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Summary & Attendees */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs font-sans">
                    <div className="md:col-span-8 p-3.5 rounded bg-current/5 border border-current/10 leading-relaxed">
                      <span className="text-[10px] font-editorial-mono uppercase font-bold text-[var(--accent-terracotta)] block mb-1">
                        Drive Overview & Collective Synthesis
                      </span>
                      <p className="opacity-90">{exp.summary}</p>
                    </div>

                    <div className="md:col-span-4 p-3.5 rounded bg-current/5 border border-current/10 font-editorial-mono space-y-1.5">
                      <span className="text-[10px] uppercase font-bold opacity-60 block">
                        Recent Contributors
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {contributorsList.slice(0, 3).map((c, i) => (
                          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[var(--bg-page)] border border-current/15 text-[10px]">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            <span>{c.name}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Round-by-Round Collaborative Breakdown */}
                  {isExpanded && (
                    <div className="space-y-6 pt-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between font-editorial-mono text-xs font-bold uppercase tracking-wider opacity-80 border-b border-current/10 pb-2">
                        <span>Round-by-Round Breakdown & Collaborative Questions</span>
                        <span className="text-[10px] opacity-60">Attendees can add questions to each round below</span>
                      </div>

                      <div className="space-y-6">
                        {exp.rounds?.map((round) => {
                          const roundQuestions = round.questions || (round.questionsAsked || []).map((q, idx) => ({
                            id: `legacy-${idx}`,
                            title: `Question ${idx + 1}`,
                            prompt: typeof q === 'string' ? q : q.prompt || '',
                            contributorName: exp.studentName || 'Student Attendee',
                            college: 'Verified Candidate',
                            difficulty: round.difficulty || 'Medium',
                            tags: ['Core Fundamentals'],
                            tips: round.tips || ''
                          }));

                          return (
                            <div
                              key={round.roundNumber}
                              className="p-5 rounded-lg border border-current/15 bg-[var(--bg-page)] space-y-4"
                            >
                              {/* Round Header with Action */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-current/10 pb-3">
                                <div className="flex items-center gap-3">
                                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--accent-terracotta)] text-white font-editorial-mono text-xs font-bold">
                                    {round.roundNumber}
                                  </span>
                                  <div>
                                    <h5 className="font-editorial-title text-base font-bold uppercase">{round.title}</h5>
                                    <span className="text-[10px] font-editorial-mono opacity-60">
                                      Focus: {round.focus || round.description || 'Technical Evaluation'} • {round.duration || '60 mins'}
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  size="sm"
                                  variant="primary"
                                  iconLeft={Plus}
                                  onClick={() => handleOpenAddQuestion(exp.id, round.roundNumber)}
                                  className="text-xs self-start sm:self-auto shrink-0"
                                >
                                  + Add Question to Round {round.roundNumber}
                                </Button>
                              </div>

                              {/* Question Cards Contributed by Students */}
                              <div className="space-y-3">
                                {roundQuestions.length === 0 ? (
                                  <div className="p-4 text-center rounded border border-dashed border-current/20 bg-current/5 text-xs font-editorial-mono opacity-60">
                                    No questions logged yet for Round {round.roundNumber}. Click "+ Add Question to Round {round.roundNumber}" to contribute what you were asked!
                                  </div>
                                ) : (
                                  roundQuestions.map((q) => (
                                    <div
                                      key={q.id}
                                      className="p-4 rounded border border-current/15 bg-[var(--card-surface)] space-y-2.5 shadow-2xs hover:border-[var(--accent-terracotta)]/40 transition-colors"
                                    >
                                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current/10 pb-2">
                                        <div className="flex items-center gap-2">
                                          <h6 className="font-bold text-sm font-editorial-title">{q.title}</h6>
                                          <span className={`px-2 py-0.5 rounded text-[9px] font-editorial-mono font-bold uppercase ${
                                            q.difficulty === 'Hard'
                                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                          }`}>
                                            {q.difficulty}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-1.5 font-editorial-mono text-[10px] opacity-70">
                                          <Users className="h-3 w-3" />
                                          <span>Contributed by <strong>{q.contributorName}</strong> ({q.college || 'Candidate'})</span>
                                        </div>
                                      </div>

                                      <p className="text-xs font-sans leading-relaxed opacity-90">{q.prompt}</p>

                                      {/* Tags */}
                                      {q.tags && q.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 pt-1">
                                          {q.tags.map((t, tidx) => (
                                            <span key={tidx} className="px-2 py-0.5 rounded bg-current/5 border border-current/10 text-[10px] font-editorial-mono opacity-80">
                                              #{t}
                                            </span>
                                          ))}
                                        </div>
                                      )}

                                      {/* Candidate Tips */}
                                      {q.tips && (
                                        <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 text-xs font-sans flex items-start gap-2 text-amber-900 dark:text-amber-200 mt-2">
                                          <Lightbulb className="h-3.5 w-3.5 shrink-0 text-amber-500 mt-0.5" />
                                          <div>
                                            <strong className="font-editorial-mono text-[9px] uppercase tracking-wider font-bold block">
                                              Interviewer Strategy & Tips:
                                            </strong>
                                            <span className="opacity-90 text-[11px]">{q.tips}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        /* 2. PRACTICE SETS GRID */
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredSets.length === 0 ? (
            <div className="p-8 text-center rounded border border-dashed border-current/20 bg-[var(--card-surface)] font-editorial-mono text-xs">
              <p className="opacity-70 mb-3">No interview sets found in this view.</p>
              <Button variant="secondary" size="sm" onClick={() => setCreateModalOpen(true)}>
                Create First Set
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSets.map((set) => (
                <Card
                  key={set.id}
                  className="flex flex-col justify-between hover:border-[var(--accent-terracotta)] transition-all cursor-pointer group"
                  onClick={() => navigate(`/interviews/${set.id}`)}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2 font-editorial-mono text-[10px]">
                      <span className="opacity-50 uppercase tracking-widest">{set.targetRole}</span>
                      {set.isSharedWithMe ? (
                        <span className="flex items-center gap-1 text-[var(--accent-terracotta)]">
                          <Share2 className="h-3 w-3" /> Shared
                        </span>
                      ) : (
                        <span className="opacity-50">Updated {set.updatedAt}</span>
                      )}
                    </div>

                    <h3 className="font-editorial-title text-base font-bold uppercase leading-snug group-hover:text-[var(--accent-terracotta)] transition-colors">
                      {set.title}
                    </h3>
                    <p className="text-xs opacity-70 mt-1 line-clamp-2 font-sans">
                      {set.description}
                    </p>

                    {/* Skills tags */}
                    <div className="mt-4 flex flex-wrap gap-1">
                      {set.skills?.map((sk) => (
                        <span
                          key={sk}
                          className="px-2 py-0.5 rounded border border-current/15 bg-current/5 text-[10px] font-editorial-mono"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-editorial-mono">
                    <span className="font-bold opacity-80 flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 opacity-60" />
                      {set.questions?.length || 0} Questions
                    </span>

                    <div className="flex items-center -space-x-1.5">
                      {set.collaborators?.map((c) => (
                        <div
                          key={c.id}
                          title={`${c.name} (${c.role}) - ${c.status}`}
                          className="relative flex h-6 w-6 items-center justify-center rounded-full border border-[var(--card-surface)] bg-current/15 text-[9px] font-bold"
                        >
                          {c.avatar}
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[var(--card-surface)] ${
                              c.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recommended Questions Section */}
      <div className="pt-4 border-t border-current/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--accent-terracotta)]" />
              <h2 className="font-editorial-title text-lg font-bold uppercase tracking-tight">
                Recommended Questions For Your Skill Gaps
              </h2>
            </div>
            <p className="text-xs opacity-70 mt-0.5">
              Targeted inquiries based on missing competencies (e.g. Docker, PostgreSQL internals).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommended.map((rq) => (
            <Card key={rq.id} className="flex flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between font-editorial-mono text-[9px] mb-1.5">
                  <span className="text-[var(--accent-terracotta)] uppercase font-semibold">
                    {rq.reason}
                  </span>
                  <span className="opacity-50 uppercase">{rq.difficulty}</span>
                </div>
                <h4 className="font-editorial-title text-sm font-bold uppercase leading-snug">
                  {rq.title}
                </h4>
                <p className="text-xs opacity-75 mt-2 line-clamp-3 font-sans leading-relaxed">
                  {rq.prompt}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-current/10 flex items-center justify-between font-editorial-mono text-[10px]">
                <div className="flex gap-1">
                  {rq.skills?.map((s) => (
                    <span key={s} className="opacity-60">#{s}</span>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/interviews/int-backend-dev')}
                  className="text-[var(--accent-terracotta)] hover:underline inline-flex items-center gap-0.5 font-bold"
                >
                  Practice <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Share Experience Modal */}
      {shareExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-xl animate-in fade-in duration-150 font-editorial-mono">
            <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
              <div>
                <h3 className="font-editorial-title text-lg font-bold uppercase">
                  Share Your Interview Experience
                </h3>
                <p className="text-xs opacity-70 font-sans">
                  Help fellow students prepare by detailing the rounds, questions, and insights from your interview.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShareExpModalOpen(false)}
                className="opacity-60 hover:opacity-100 p-1 rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleShareExpSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TechNova Systems"
                    value={newExpData.company}
                    onChange={(e) => setNewExpData({ ...newExpData, company: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit focus:outline-none focus:border-[var(--accent-terracotta)]"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Target Role *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Backend Developer"
                    value={newExpData.role}
                    onChange={(e) => setNewExpData({ ...newExpData, role: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Outcome Status</label>
                  <select
                    value={newExpData.status}
                    onChange={(e) => setNewExpData({ ...newExpData, status: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                  >
                    <option value="Offered">Offered</option>
                    <option value="Completed">Completed</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Overall Difficulty</label>
                  <select
                    value={newExpData.overallDifficulty}
                    onChange={(e) => setNewExpData({ ...newExpData, overallDifficulty: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Brutal">Brutal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Process Summary *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Overview of the interview timeline, recruiter interaction, and overall experience..."
                  value={newExpData.summary}
                  onChange={(e) => setNewExpData({ ...newExpData, summary: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit font-sans text-xs focus:outline-none focus:border-[var(--accent-terracotta)]"
                />
              </div>

              {/* Round 1 Details */}
              <div className="p-3.5 rounded border border-current/15 bg-current/5 space-y-3">
                <span className="text-[10px] font-bold uppercase text-[var(--accent-terracotta)] block">
                  Round 1 Details
                </span>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Round Title</label>
                  <input
                    type="text"
                    value={newExpData.round1Title}
                    onChange={(e) => setNewExpData({ ...newExpData, round1Title: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Questions Asked (one per line)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Implement LRU Cache in Python&#10;Write SQL query for highest paid employee"
                    value={newExpData.round1Questions}
                    onChange={(e) => setNewExpData({ ...newExpData, round1Questions: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit font-sans text-xs"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Tips & Advice for Round 1</label>
                  <input
                    type="text"
                    placeholder="Focus on edge cases and discuss space-time complexity."
                    value={newExpData.round1Tips}
                    onChange={(e) => setNewExpData({ ...newExpData, round1Tips: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit font-sans text-xs"
                  />
                </div>
              </div>

              {/* Round 2 Details */}
              <div className="p-3.5 rounded border border-current/15 bg-current/5 space-y-3">
                <span className="text-[10px] font-bold uppercase text-[var(--accent-terracotta)] block">
                  Round 2 Details (Optional)
                </span>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Round Title</label>
                  <input
                    type="text"
                    value={newExpData.round2Title}
                    onChange={(e) => setNewExpData({ ...newExpData, round2Title: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Questions Asked (one per line)</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Explain CPython GIL and asyncio event loop&#10;System design of rate limiter"
                    value={newExpData.round2Questions}
                    onChange={(e) => setNewExpData({ ...newExpData, round2Questions: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit font-sans text-xs"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Tips & Advice for Round 2</label>
                  <input
                    type="text"
                    placeholder="Think out loud and clarify system constraints upfront."
                    value={newExpData.round2Tips}
                    onChange={(e) => setNewExpData({ ...newExpData, round2Tips: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit font-sans text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-current/10 flex justify-end gap-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setShareExpModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Publish Experience
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Set Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-xl animate-in fade-in duration-150">
            <h3 className="font-editorial-title text-lg font-bold uppercase mb-1">
              Create New Interview Set
            </h3>
            <p className="text-xs opacity-70 mb-4 font-sans">
              Organize technical, behavioral, and system design questions with your peers.
            </p>

            <form onSubmit={handleCreateSet} className="space-y-4 text-xs font-editorial-mono">
              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Set Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Concurrency & SQL"
                  value={newSetData.title}
                  onChange={(e) => setNewSetData({ ...newSetData, title: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit focus:outline-none focus:border-[var(--accent-terracotta)]"
                />
              </div>

              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief context and preparation goals for this set..."
                  value={newSetData.description}
                  onChange={(e) => setNewSetData({ ...newSetData, description: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit font-sans text-xs focus:outline-none focus:border-[var(--accent-terracotta)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Target Role</label>
                  <input
                    type="text"
                    value={newSetData.targetRole}
                    onChange={(e) => setNewSetData({ ...newSetData, targetRole: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Difficulty</label>
                  <select
                    value={newSetData.difficulty}
                    onChange={(e) => setNewSetData({ ...newSetData, difficulty: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Mixed">Mixed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Skills Covered (comma separated)</label>
                <input
                  type="text"
                  placeholder="Python, SQL, Docker, REST API"
                  value={newSetData.skills}
                  onChange={(e) => setNewSetData({ ...newSetData, skills: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                />
              </div>

              <div className="pt-3 border-t border-current/10 flex justify-end gap-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Create Set
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Question to Round Modal */}
      {addQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-xl animate-in fade-in duration-150 text-[var(--text-primary)]">
            <div className="flex items-center justify-between pb-3 border-b border-current/10 mb-4">
              <div>
                <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
                  Collaborative Contribution
                </span>
                <h3 className="font-editorial-title text-lg font-bold uppercase">
                  Add Question to Round {targetRoundNumber}
                </h3>
              </div>
              <button
                onClick={() => setAddQuestionModalOpen(false)}
                className="p-1 rounded opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestionSubmit} className="space-y-4 text-xs font-editorial-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={newQuestionData.contributorName}
                    onChange={(e) => setNewQuestionData({ ...newQuestionData, contributorName: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit"
                  />
                </div>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">College / Institution</label>
                  <input
                    type="text"
                    value={newQuestionData.college}
                    onChange={(e) => setNewQuestionData({ ...newQuestionData, college: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Question Title / Topic *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement LRU Cache or Serialize N-ary Tree"
                  value={newQuestionData.title}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, title: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit"
                />
              </div>

              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Question Prompt / Problem Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the exact problem statement, constraints, or code challenge given by the interviewer..."
                  value={newQuestionData.prompt}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, prompt: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Difficulty</label>
                  <select
                    value={newQuestionData.difficulty}
                    onChange={(e) => setNewQuestionData({ ...newQuestionData, difficulty: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="DSA, Trees, Concurrency"
                    value={newQuestionData.tags}
                    onChange={(e) => setNewQuestionData({ ...newQuestionData, tags: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Interviewer Tips & Optimal Solution Strategy</label>
                <textarea
                  rows={2}
                  placeholder="Advice for future candidates: edge cases to watch out for, time/space constraints, trade-offs to discuss..."
                  value={newQuestionData.tips}
                  onChange={(e) => setNewQuestionData({ ...newQuestionData, tips: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-1.5 text-inherit font-sans text-xs"
                />
              </div>

              <div className="pt-3 border-t border-current/10 flex justify-end gap-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setAddQuestionModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Contribute Question
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
