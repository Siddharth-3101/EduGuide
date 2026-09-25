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
  Play
} from 'lucide-react';

export const InterviewsDashboardPage = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'mine' | 'shared'
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newSetData, setNewSetData] = useState({
    title: '',
    description: '',
    targetRole: 'Backend Developer',
    difficulty: 'Intermediate',
    skills: 'Python, SQL, REST API, Docker'
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [setsData, recData] = await Promise.all([
        interviewApi.getInterviewSets(),
        interviewApi.getRecommendedQuestions()
      ]);
      setSets(setsData);
      setRecommended(recData);
    } catch (err) {
      console.error(err);
      setError('Could not load interview sets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
              COLLABORATIVE INTERVIEW WORKSPACE
            </span>
          </div>
          <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold tracking-tight uppercase">
            Interview Preparation
          </h1>
          <p className="text-sm opacity-70 mt-1 max-w-2xl font-sans">
            Collaboratively curate, organize, and practice interview questions matched to your target role benchmarks and active skill gaps.
          </p>
        </div>

        <Button
          variant="primary"
          iconLeft={Plus}
          onClick={() => setCreateModalOpen(true)}
          className="self-start sm:self-auto"
        >
          New Interview Set
        </Button>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 font-editorial-mono text-xs">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded transition-all ${
            activeTab === 'all'
              ? 'bg-[var(--card-surface)] font-bold border border-current/25 shadow-2xs'
              : 'opacity-60 hover:opacity-100 hover:bg-current/5'
          }`}
        >
          All Sets ({sets.length})
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

      {/* Interview Sets Grid */}
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
                {/* Questions count */}
                <span className="font-bold opacity-80 flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 opacity-60" />
                  {set.questions?.length || 0} Questions
                </span>

                {/* Collaborators list */}
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
                  {rq.skills.map((s) => (
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
    </div>
  );
};
