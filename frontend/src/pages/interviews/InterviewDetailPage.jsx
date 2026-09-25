import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { interviewApi } from '../../services/api/interviewApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  MessagesSquare,
  ArrowLeft,
  Play,
  Plus,
  Share2,
  Users,
  Copy,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  ShieldAlert,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const InterviewDetailPage = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();

  const [set, setSet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');

  // Practice Mode state
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [revealedAnswer, setRevealedAnswer] = useState(false);
  const [personalNotes, setPersonalNotes] = useState({});
  const [masteredMap, setMasteredMap] = useState({});
  const [difficultMap, setDifficultMap] = useState({});

  const [questionForm, setQuestionForm] = useState({
    title: '',
    category: 'Technical',
    type: 'Technical',
    difficulty: 'Intermediate',
    skills: '',
    prompt: '',
    expectedAnswer: '',
    explanation: '',
    tips: '',
    evaluationCriteria: ''
  });

  const loadSet = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await interviewApi.getInterviewSetById(interviewId);
      setSet(data);
    } catch (err) {
      console.error(err);
      setError('Could not load interview set. It may have been deleted or moved.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSet();
  }, [interviewId]);

  const handleOpenAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionForm({
      title: '',
      category: 'Technical',
      type: 'Technical',
      difficulty: 'Intermediate',
      skills: 'Python, SQL',
      prompt: '',
      expectedAnswer: '',
      explanation: '',
      tips: '',
      evaluationCriteria: 'Understands core concept\nExplains trade-offs'
    });
    setQuestionModalOpen(true);
  };

  const handleOpenEditQuestion = (q) => {
    setEditingQuestion(q);
    setQuestionForm({
      title: q.title,
      category: q.category,
      type: q.type || q.category,
      difficulty: q.difficulty,
      skills: q.skills ? q.skills.join(', ') : '',
      prompt: q.prompt,
      expectedAnswer: q.expectedAnswer,
      explanation: q.explanation || '',
      tips: q.tips || '',
      evaluationCriteria: q.evaluationCriteria ? q.evaluationCriteria.join('\n') : ''
    });
    setQuestionModalOpen(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (!questionForm.title.trim() || !questionForm.prompt.trim()) return;

    const payload = {
      title: questionForm.title,
      category: questionForm.category,
      type: questionForm.type,
      difficulty: questionForm.difficulty,
      skills: questionForm.skills.split(',').map((s) => s.trim()).filter(Boolean),
      prompt: questionForm.prompt,
      expectedAnswer: questionForm.expectedAnswer,
      explanation: questionForm.explanation,
      tips: questionForm.tips,
      evaluationCriteria: questionForm.evaluationCriteria.split('\n').filter(Boolean)
    };

    if (editingQuestion) {
      await interviewApi.updateQuestion(set.id, editingQuestion.id, payload);
    } else {
      await interviewApi.addQuestion(set.id, payload);
    }

    setQuestionModalOpen(false);
    loadSet();
  };

  const handleDeleteQuestion = async (qId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await interviewApi.deleteQuestion(set.id, qId);
      loadSet();
    }
  };

  const handleDuplicateQuestion = async (qId) => {
    await interviewApi.duplicateQuestion(set.id, qId);
    loadSet();
  };

  const handleInviteCollaborator = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    await interviewApi.inviteCollaborator(set.id, { email: inviteEmail, role: inviteRole });
    setInviteEmail('');
    setShareModalOpen(false);
    loadSet();
  };

  if (error) {
    return <ErrorState message={error} onRetry={loadSet} />;
  }

  if (loading || !set) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const allQuestions = set.questions || [];
  const filteredQuestions = allQuestions.filter((q) => {
    const matchCat = selectedCategory === 'All' || q.category === selectedCategory;
    const matchQuery =
      searchQuery === '' ||
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  // Practice Mode Calculations
  const currentPracticeQ = allQuestions[practiceIndex] || null;
  const masteredCount = Object.values(masteredMap).filter(Boolean).length;
  const practicePercent = allQuestions.length > 0 ? Math.round(((practiceIndex + 1) / allQuestions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* PRACTICE MODE FULLSCREEN OVERLAY */}
      {practiceMode && currentPracticeQ ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-page)] p-4 sm:p-8 flex flex-col">
          {/* Header */}
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4 border-b border-current/10">
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                iconLeft={ArrowLeft}
                onClick={() => setPracticeMode(false)}
              >
                Exit Practice
              </Button>
              <div>
                <span className="text-[10px] font-editorial-mono opacity-50 uppercase tracking-widest block">
                  PRACTICE SESSION · {set.title}
                </span>
                <span className="font-editorial-title text-base font-bold uppercase">
                  Question {practiceIndex + 1} of {allQuestions.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 font-editorial-mono text-xs">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {masteredCount} Mastered
              </span>
              <div className="w-32 h-2 rounded-full bg-current/10 overflow-hidden">
                <div
                  className="h-full bg-[var(--accent-terracotta)] transition-all duration-300"
                  style={{ width: `${practicePercent}%` }}
                />
              </div>
              <span className="opacity-60">{practicePercent}%</span>
            </div>
          </div>

          {/* Practice Question Card */}
          <div className="max-w-4xl mx-auto w-full flex-1 py-8 space-y-6">
            <Card className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 font-editorial-mono text-xs pb-3 border-b border-current/10">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded border border-current/20 bg-current/5 uppercase text-[10px]">
                    {currentPracticeQ.category}
                  </span>
                  <span className="px-2 py-0.5 rounded border border-current/20 uppercase text-[10px]">
                    {currentPracticeQ.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setDifficultMap({ ...difficultMap, [currentPracticeQ.id]: !difficultMap[currentPracticeQ.id] })
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                      difficultMap[currentPracticeQ.id]
                        ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold'
                        : 'border-current/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {difficultMap[currentPracticeQ.id] ? 'Marked Difficult' : 'Mark Difficult'}
                  </button>
                  <button
                    onClick={() =>
                      setMasteredMap({ ...masteredMap, [currentPracticeQ.id]: !masteredMap[currentPracticeQ.id] })
                    }
                    className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-colors ${
                      masteredMap[currentPracticeQ.id]
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-current/20 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    {masteredMap[currentPracticeQ.id] ? 'Mastered ✓' : 'Mark Mastered'}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="font-editorial-title text-xl sm:text-2xl font-bold uppercase leading-tight">
                  {currentPracticeQ.title}
                </h2>
                <p className="mt-4 text-base opacity-85 leading-relaxed font-sans whitespace-pre-line">
                  {currentPracticeQ.prompt}
                </p>
              </div>

              {/* Personal Scratchpad / Answer notes */}
              <div className="pt-4 border-t border-current/10">
                <label className="block text-[10px] font-editorial-mono uppercase tracking-wider opacity-60 mb-1">
                  Your Answer Scratchpad / Bullet Points
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline your thoughts, key algorithms, or response points before checking answer..."
                  value={personalNotes[currentPracticeQ.id] || ''}
                  onChange={(e) =>
                    setPersonalNotes({ ...personalNotes, [currentPracticeQ.id]: e.target.value })
                  }
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] p-3 text-xs font-sans focus:outline-none focus:border-[var(--accent-terracotta)]"
                />
              </div>

              {/* Reveal Expected Answer Toggle */}
              <div className="pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  iconLeft={revealedAnswer ? EyeOff : Eye}
                  onClick={() => setRevealedAnswer(!revealedAnswer)}
                >
                  {revealedAnswer ? 'Hide Expected Answer' : 'Reveal Expected Answer & Key Criteria'}
                </Button>

                {revealedAnswer && (
                  <div className="mt-4 p-5 rounded border border-current/20 bg-current/5 space-y-4 animate-in fade-in duration-200">
                    <div>
                      <h4 className="font-editorial-mono text-[11px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)] mb-1">
                        Expected Answer Key
                      </h4>
                      <p className="text-xs font-sans opacity-90 leading-relaxed whitespace-pre-line">
                        {currentPracticeQ.expectedAnswer}
                      </p>
                    </div>

                    {currentPracticeQ.tips && (
                      <div className="flex items-start gap-2 text-xs font-sans bg-amber-500/10 border border-amber-500/20 p-3 rounded text-amber-900 dark:text-amber-200">
                        <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">Interview Tip: </span>
                          {currentPracticeQ.tips}
                        </div>
                      </div>
                    )}

                    {currentPracticeQ.evaluationCriteria?.length > 0 && (
                      <div>
                        <h5 className="font-editorial-mono text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1">
                          Evaluation Criteria
                        </h5>
                        <ul className="space-y-1 text-xs opacity-80 list-disc list-inside">
                          {currentPracticeQ.evaluationCriteria.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                disabled={practiceIndex === 0}
                iconLeft={ChevronLeft}
                onClick={() => {
                  setPracticeIndex((prev) => Math.max(0, prev - 1));
                  setRevealedAnswer(false);
                }}
              >
                Previous
              </Button>

              <div className="flex gap-1.5 font-editorial-mono text-xs">
                {allQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setPracticeIndex(idx);
                      setRevealedAnswer(false);
                    }}
                    className={`h-7 w-7 rounded border text-[10px] font-bold transition-all ${
                      idx === practiceIndex
                        ? 'border-[var(--accent-terracotta)] bg-[var(--accent-terracotta)] text-white'
                        : masteredMap[q.id]
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'border-current/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                disabled={practiceIndex === allQuestions.length - 1}
                iconRight={ChevronRight}
                onClick={() => {
                  setPracticeIndex((prev) => Math.min(allQuestions.length - 1, prev + 1));
                  setRevealedAnswer(false);
                }}
              >
                Next Question
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* REGULAR WORKSPACE / EDITOR VIEW */}
      {/* Top Breadcrumb & Metadata Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-current/10">
        <div>
          <Link
            to="/interviews"
            className="inline-flex items-center gap-1.5 font-editorial-mono text-xs opacity-60 hover:opacity-100 hover:text-[var(--accent-terracotta)] mb-2"
          >
            <ArrowLeft className="h-3 w-3" /> Back to All Sets
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase tracking-tight">
              {set.title}
            </h1>
            <span className="px-2 py-0.5 rounded border border-current/20 font-editorial-mono text-[10px] uppercase">
              {set.difficulty}
            </span>
          </div>
          <p className="text-xs opacity-70 mt-1 max-w-2xl font-sans">
            {set.description}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            iconLeft={Share2}
            onClick={() => setShareModalOpen(true)}
          >
            Share & Invite
          </Button>

          <Button
            variant="primary"
            iconLeft={Play}
            disabled={allQuestions.length === 0}
            onClick={() => {
              setPracticeIndex(0);
              setRevealedAnswer(false);
              setPracticeMode(true);
            }}
          >
            Start Practice
          </Button>
        </div>
      </div>

      {/* Set Details Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded border border-current/15 bg-[var(--card-surface)] font-editorial-mono text-xs">
        <div>
          <span className="opacity-50 text-[10px] uppercase tracking-wider block">Target Role</span>
          <span className="font-bold text-sm uppercase">{set.targetRole}</span>
        </div>
        <div>
          <span className="opacity-50 text-[10px] uppercase tracking-wider block">Questions</span>
          <span className="font-bold text-sm">{allQuestions.length} Total</span>
        </div>
        <div>
          <span className="opacity-50 text-[10px] uppercase tracking-wider block">Last Updated</span>
          <span className="font-bold text-sm">{set.updatedAt}</span>
        </div>
        <div>
          <span className="opacity-50 text-[10px] uppercase tracking-wider block">Collaborators</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            {set.collaborators?.map((c) => (
              <span
                key={c.id}
                title={`${c.name} (${c.role}) - ${c.status}`}
                className="flex items-center gap-1 text-[11px]"
              >
                <span
                  className={`h-2 w-2 rounded-full ${c.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}`}
                />
                <span className="font-semibold">{c.name.split(' ')[0]}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Question Management Actions & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-2 font-editorial-mono text-xs">
          {['All', 'Technical', 'System Design', 'Scenario-based', 'Behavioral'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded transition-all ${
                selectedCategory === cat
                  ? 'bg-current/15 font-bold border border-current/25'
                  : 'opacity-60 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded border border-current/20 bg-[var(--card-surface)] px-3 py-1.5 text-xs font-sans focus:outline-none focus:border-[var(--accent-terracotta)]"
          />

          <Button variant="primary" size="sm" iconLeft={Plus} onClick={handleOpenAddQuestion}>
            Add Question
          </Button>
        </div>
      </div>

      {/* Questions List */}
      {filteredQuestions.length === 0 ? (
        <div className="p-12 text-center rounded border border-dashed border-current/20 bg-[var(--card-surface)] font-editorial-mono text-xs">
          <p className="opacity-60 mb-3">No questions match your current filter.</p>
          <Button variant="secondary" size="sm" onClick={handleOpenAddQuestion}>
            Add First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => (
            <Card key={q.id} className="p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-current/10">
                <div className="flex items-center gap-2 font-editorial-mono text-[10px]">
                  <span className="font-bold opacity-50">#{idx + 1}</span>
                  <span className="px-2 py-0.5 rounded border border-current/20 bg-current/5 uppercase">
                    {q.category}
                  </span>
                  <span className="px-2 py-0.5 rounded border border-current/20 uppercase">
                    {q.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-1 font-editorial-mono text-xs">
                  <button
                    onClick={() => handleDuplicateQuestion(q.id)}
                    title="Duplicate Question"
                    className="p-1.5 rounded opacity-60 hover:opacity-100 hover:bg-current/10"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEditQuestion(q)}
                    title="Edit Question"
                    className="p-1.5 rounded opacity-60 hover:opacity-100 hover:bg-current/10"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(q.id)}
                    title="Delete Question"
                    className="p-1.5 rounded text-rose-600 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-editorial-title text-base font-bold uppercase leading-snug">
                  {q.title}
                </h3>
                <p className="text-xs opacity-80 mt-1 font-sans leading-relaxed whitespace-pre-line">
                  {q.prompt}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {q.skills?.map((sk) => (
                  <span
                    key={sk}
                    className="px-2 py-0.5 rounded border border-current/15 bg-current/5 text-[9px] font-editorial-mono opacity-80"
                  >
                    #{sk}
                  </span>
                ))}
              </div>

              {/* Expected answer accordion preview */}
              <details className="pt-2 text-xs font-sans group">
                <summary className="font-editorial-mono text-[10px] uppercase font-bold text-[var(--accent-terracotta)] cursor-pointer select-none">
                  View Expected Answer Key & Evaluation Criteria
                </summary>
                <div className="mt-2 p-3 rounded border border-current/15 bg-current/5 space-y-2">
                  <p className="whitespace-pre-line leading-relaxed opacity-90">{q.expectedAnswer}</p>
                  {q.tips && (
                    <p className="text-[11px] opacity-75 italic">
                      <span className="font-bold">Tip: </span>
                      {q.tips}
                    </p>
                  )}
                </div>
              </details>
            </Card>
          ))}
        </div>
      )}

      {/* ADD / EDIT QUESTION MODAL */}
      {questionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-xl animate-in fade-in duration-150">
            <h3 className="font-editorial-title text-lg font-bold uppercase mb-1">
              {editingQuestion ? 'Edit Question' : 'Add Question to Set'}
            </h3>
            <p className="text-xs opacity-70 mb-4 font-sans">
              Provide comprehensive evaluation criteria, expected answer, and interview tips.
            </p>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs font-editorial-mono">
              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Question Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Explaining PostgreSQL MVCC & Deadlocks"
                  value={questionForm.title}
                  onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Category / Type</label>
                  <select
                    value={questionForm.category}
                    onChange={(e) => setQuestionForm({ ...questionForm, category: e.target.value, type: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                  >
                    <option value="Technical">Technical</option>
                    <option value="System Design">System Design</option>
                    <option value="Scenario-based">Scenario-based</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Coding">Coding</option>
                    <option value="HR">HR</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Difficulty</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm({ ...questionForm, difficulty: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Docker, SQL, Python"
                    value={questionForm.skills}
                    onChange={(e) => setQuestionForm({ ...questionForm, skills: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Full Prompt / Problem Statement *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="The exact prompt the interviewer will pose to the candidate..."
                  value={questionForm.prompt}
                  onChange={(e) => setQuestionForm({ ...questionForm, prompt: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit font-sans text-xs"
                />
              </div>

              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Expected Answer / Key Talking Points</label>
                <textarea
                  rows={4}
                  placeholder="Model answer including architectural considerations, algorithms, or code patterns..."
                  value={questionForm.expectedAnswer}
                  onChange={(e) => setQuestionForm({ ...questionForm, expectedAnswer: e.target.value })}
                  className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit font-sans text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Interview Tips / Gotchas</label>
                  <input
                    type="text"
                    placeholder="Mention deadlock detection queries, VACUUM..."
                    value={questionForm.tips}
                    onChange={(e) => setQuestionForm({ ...questionForm, tips: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block uppercase text-[10px] opacity-60 mb-1">Evaluation Criteria (one per line)</label>
                  <textarea
                    rows={2}
                    placeholder="Addresses concurrency&#10;Considers failure states"
                    value={questionForm.evaluationCriteria}
                    onChange={(e) => setQuestionForm({ ...questionForm, evaluationCriteria: e.target.value })}
                    className="w-full rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit font-sans text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-current/10 flex justify-end gap-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setQuestionModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  {editingQuestion ? 'Update Question' : 'Save Question'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SHARE & COLLABORATE MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-xl animate-in fade-in duration-150">
            <h3 className="font-editorial-title text-lg font-bold uppercase mb-1 flex items-center gap-2">
              <Users className="h-4 w-4" /> Share & Invite Collaborators
            </h3>
            <p className="text-xs opacity-70 mb-4 font-sans">
              Collaboratively review and edit questions. Real-time presence and permissions are active.
            </p>

            <form onSubmit={handleInviteCollaborator} className="space-y-3 font-editorial-mono text-xs">
              <div>
                <label className="block uppercase text-[10px] opacity-60 mb-1">Invite Collaborator Email</label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="peer@university.edu"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="flex-1 rounded border border-current/20 bg-[var(--bg-page)] px-3 py-2 text-inherit"
                  />
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="rounded border border-current/20 bg-[var(--bg-page)] px-2 py-2 text-inherit"
                  >
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>

              <Button variant="primary" size="sm" type="submit" className="w-full">
                Send Invitation
              </Button>
            </form>

            <div className="mt-5 pt-3 border-t border-current/10">
              <span className="font-editorial-mono text-[10px] uppercase tracking-wider opacity-60 block mb-2">
                Active Collaborators
              </span>
              <div className="space-y-2 font-editorial-mono text-xs">
                {set.collaborators?.map((c) => (
                  <div key={c.id} className="flex items-center justify-between p-2 rounded bg-current/5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          c.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'
                        }`}
                      />
                      <div>
                        <p className="font-bold text-[11px] leading-tight">{c.name}</p>
                        <p className="text-[10px] opacity-60 font-sans">{c.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-current/20 uppercase opacity-80">
                      {c.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setShareModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
