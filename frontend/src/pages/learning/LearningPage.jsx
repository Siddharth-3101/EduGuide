import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { learningApi } from '../../services/api/learningApi';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  BookOpen,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
  ExternalLink,
  GraduationCap,
  Filter,
  FileText,
  Video,
  Layers,
  Plus,
  Share2,
  HardDrive,
  Users,
  Check
} from 'lucide-react';

export const LearningPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const skillParam = searchParams.get('skillId');

  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'community'
  const [courses, setCourses] = useState([]);
  const [communityResources, setCommunityResources] = useState([]);
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState(skillParam || 'All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'YouTube Video',
    skill: 'Spring Boot',
    description: '',
    contributor: localStorage.getItem('skillsync_candidate_name') || 'Siddharth G (Student)'
  });
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    if (skillParam) {
      setSelectedSkill(skillParam);
    }
  }, [skillParam]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await learningApi.getRecommendedCourses();
        setCourses(data);
        const commRes = learningApi.getCommunityResources();
        setCommunityResources(commRes);
      } catch (err) {
        console.error(err);
        setError('Could not load learning reference materials.');
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;

    setFormSubmitting(true);
    const updated = learningApi.addCommunityResource(formData);
    setCommunityResources(updated);
    setFormSubmitting(false);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setAddModalOpen(false);
      setActiveTab('community');
      setFormData({
        title: '',
        url: '',
        type: 'YouTube Video',
        skill: 'Spring Boot',
        description: '',
        contributor: localStorage.getItem('skillsync_candidate_name') || 'Siddharth G (Student)'
      });
    }, 1200);
  };

  const filteredCourses = courses.filter((c) => {
    const matchType = selectedType === 'All' || c.type === selectedType;
    const matchSkill = selectedSkill === 'All' || (c.skillId && c.skillId.toLowerCase() === selectedSkill.toLowerCase());
    return matchType && matchSkill;
  });

  const filteredCommunity = communityResources.filter((r) => {
    const matchType = selectedType === 'All' || r.type === selectedType;
    const matchSkill = selectedSkill === 'All' || (r.skill && r.skill.toLowerCase().includes(selectedSkill.toLowerCase()));
    return matchType && matchSkill;
  });

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-current/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-current/5 text-[var(--accent-terracotta)]">
              <BookOpen className="h-3.5 w-3.5" />
            </span>
            <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-[0.2em] text-[var(--accent-terracotta)]">
              CURATED REFERENCE MATERIALS & PEER KNOWLEDGE
            </span>
          </div>
          <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase tracking-tight">
            Learning & Reference Library
          </h1>
          <p className="text-sm opacity-70 mt-1 max-w-2xl font-sans">
            Targeted micro-courses, official documentation, student-submitted YouTube tutorials, and Google Drive reference notes directly mapped to skill gaps.
          </p>
        </div>

        {/* CTA to Share Resource */}
        <div className="shrink-0 flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            iconLeft={Plus}
            onClick={() => setAddModalOpen(true)}
            className="font-editorial-mono text-xs shadow-xs"
          >
            Share Reference Link
          </Button>
        </div>
      </div>

      {/* Tab Switcher: Curated vs Community */}
      <div className="flex items-center gap-2 border-b border-current/10 pb-2">
        <button
          onClick={() => setActiveTab('curated')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-editorial-title text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'curated'
              ? 'bg-[var(--accent-terracotta)] text-white shadow-xs'
              : 'bg-current/5 hover:bg-current/10 opacity-70 hover:opacity-100'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Curated Courses & Labs ({courses.length})
        </button>

        <button
          onClick={() => setActiveTab('community')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-editorial-title text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'community'
              ? 'bg-[var(--accent-terracotta)] text-white shadow-xs'
              : 'bg-current/5 hover:bg-current/10 opacity-70 hover:opacity-100'
          }`}
        >
          <Users className="h-4 w-4" />
          Community References & Drive Notes ({communityResources.length})
        </button>
      </div>

      {/* Filter Bars */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded border border-current/15 bg-[var(--card-surface)] font-editorial-mono text-xs">
        {/* Filter by Material Type */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="opacity-50 text-[10px] uppercase mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Type:
          </span>
          {(activeTab === 'curated'
            ? ['All', 'Course', 'Documentation', 'Video Tutorial']
            : ['All', 'YouTube Video', 'Google Drive Document', 'Documentation']
          ).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-2.5 py-1 rounded transition-all ${
                selectedType === t
                  ? 'bg-current/15 font-bold border border-current/20'
                  : 'opacity-60 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Filter by Target Skill Gap */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="opacity-50 text-[10px] uppercase mr-1">Skill Gap:</span>
          {['All', 'python', 'sql', 'mysql', 'docker', 'spring-boot', 'react'].map((sk) => (
            <button
              key={sk}
              onClick={() => setSelectedSkill(sk)}
              className={`px-2.5 py-1 rounded uppercase tracking-wider transition-all ${
                selectedSkill === sk
                  ? 'bg-current/15 font-bold border border-current/20'
                  : 'opacity-60 hover:opacity-100 hover:bg-current/5'
              }`}
            >
              {sk}
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Content Feed */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : activeTab === 'curated' ? (
        /* Curated Course List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCourses.map((c) => (
            <Card
              key={c.id}
              className="p-5 flex flex-col justify-between border border-[var(--border-line)] bg-[var(--card-surface)] hover:border-[var(--accent-terracotta)] transition-all shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-[10px] font-editorial-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-current/5 border border-current/15">
                    {c.provider} • {c.type}
                  </span>
                  <span className="text-[10px] font-editorial-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {c.price}
                  </span>
                </div>

                <h3 className="font-editorial-title font-bold text-base leading-snug">
                  {c.title}
                </h3>
                <p className="text-xs opacity-75 mt-2 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                {c.whyRecommended && (
                  <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] font-editorial-mono text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>{c.whyRecommended}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-editorial-mono">
                <span className="opacity-70 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {c.duration}
                </span>

                <a
                  href={c.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[var(--accent-terracotta)] font-bold hover:underline"
                >
                  Start Resource <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Community Shared Resources List */
        <div className="space-y-4">
          {filteredCommunity.length === 0 ? (
            <div className="p-8 text-center rounded border border-[var(--border-line)] bg-[var(--card-surface)] space-y-3 font-editorial-mono">
              <Users className="h-8 w-8 mx-auto opacity-40 text-[var(--accent-terracotta)]" />
              <p className="text-xs opacity-75">No community references found for this filter.</p>
              <Button size="sm" variant="outline" onClick={() => setAddModalOpen(true)}>
                Share the first reference
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCommunity.map((r) => {
                const isYouTube = r.type?.toLowerCase().includes('youtube') || r.url?.includes('youtube') || r.url?.includes('youtu.be');
                const isDrive = r.type?.toLowerCase().includes('drive') || r.url?.includes('drive.google.com');

                return (
                  <Card
                    key={r.id}
                    className="p-5 flex flex-col justify-between border border-[var(--border-line)] bg-[var(--card-surface)] hover:border-[var(--accent-terracotta)] transition-all shadow-xs"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="flex items-center gap-1.5 text-[10px] font-editorial-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-current/5 border border-current/15">
                          {isYouTube ? (
                            <Video className="h-3 w-3 text-red-500" />
                          ) : isDrive ? (
                            <HardDrive className="h-3 w-3 text-blue-500" />
                          ) : (
                            <FileText className="h-3 w-3 text-emerald-500" />
                          )}
                          {r.type}
                        </span>

                        <span className="text-[10px] font-editorial-mono px-2 py-0.5 rounded bg-[var(--accent-terracotta)]/10 text-[var(--accent-terracotta)] font-bold">
                          {r.skill}
                        </span>
                      </div>

                      <h3 className="font-editorial-title font-bold text-base leading-snug">
                        {r.title}
                      </h3>

                      <p className="text-xs opacity-75 mt-2 line-clamp-3 leading-relaxed">
                        {r.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[11px] font-editorial-mono opacity-60">
                        <span>Shared by {r.contributor}</span>
                        <span>{r.date}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-editorial-mono">
                      <span className="text-[11px] opacity-70 truncate max-w-[200px]">
                        {r.url.replace(/^https?:\/\//, '')}
                      </span>

                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[var(--accent-terracotta)] text-white font-bold text-xs hover:opacity-90 transition-opacity"
                      >
                        Open Reference <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Share Resource Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Share Learning Reference Link"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs font-editorial-mono text-[var(--text-primary)]">
          <p className="opacity-80 leading-relaxed text-[11px]">
            Share high-yield YouTube lectures, Google Drive class notes, GitHub repositories, or official technical documentation to help fellow engineers bridge skill gaps.
          </p>

          <div className="space-y-1">
            <label className="font-bold text-[10px] uppercase opacity-75">Resource Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Complete Spring Data JPA & Microservices Lecture"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded border border-[var(--border-line)] bg-current/5 focus:outline-hidden focus:border-[var(--accent-terracotta)]"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[10px] uppercase opacity-75">Link / URL *</label>
            <input
              type="url"
              required
              placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 rounded border border-[var(--border-line)] bg-current/5 focus:outline-hidden focus:border-[var(--accent-terracotta)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-[10px] uppercase opacity-75">Resource Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 rounded border border-[var(--border-line)] bg-current/5 focus:outline-hidden focus:border-[var(--accent-terracotta)]"
              >
                <option value="YouTube Video">YouTube Video</option>
                <option value="Google Drive Document">Google Drive Document</option>
                <option value="Documentation">Official Documentation</option>
                <option value="Article / Tutorial">Article / Tutorial</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[10px] uppercase opacity-75">Target Skill Tag</label>
              <select
                value={formData.skill}
                onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                className="w-full px-3 py-2 rounded border border-[var(--border-line)] bg-current/5 focus:outline-hidden focus:border-[var(--accent-terracotta)]"
              >
                <option value="Spring Boot">Spring Boot</option>
                <option value="Java">Java</option>
                <option value="MySQL">MySQL / SQL</option>
                <option value="Docker">Docker & Containers</option>
                <option value="Python">Python</option>
                <option value="REST API">REST API</option>
                <option value="React">React</option>
                <option value="Linux">Linux / Operating Systems</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-[10px] uppercase opacity-75">Description / Why it helps</label>
            <textarea
              rows={2}
              placeholder="Short summary of what this reference covers..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded border border-[var(--border-line)] bg-current/5 focus:outline-hidden focus:border-[var(--accent-terracotta)]"
            />
          </div>

          {formSuccess && (
            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
              <Check className="h-4 w-4" /> Reference link published to community feed!
            </div>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" size="sm" type="button" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={formSubmitting}>
              Publish Reference
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
