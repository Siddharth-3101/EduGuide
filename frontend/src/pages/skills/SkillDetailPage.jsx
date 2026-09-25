import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { skillsApi } from '../../services/api/skillsApi';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  FileCheck2,
  BookOpen,
  FolderGit2,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const SkillDetailPage = () => {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [skill, setSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evidenceModalOpen, setEvidenceModalOpen] = useState(false);

  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true);
        const data = await skillsApi.getSkillById(skillId || 'python');
        setSkill(data);
      } catch (err) {
        console.error(err);
        setError('Skill not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchSkill();
  }, [skillId]);

  if (loading) {
    return <CardSkeleton />;
  }

  if (error || !skill) {
    return (
      <ErrorState
        message={error || 'Skill details could not be found.'}
        onRetry={() => navigate('/skills')}
      />
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="verified">Verified Competency</Badge>;
      case 'partial':
        return <Badge variant="partial">Partial Verification</Badge>;
      default:
        return <Badge variant="missing">Missing Gap</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/skills"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Skill Library
        </Link>
      </div>

      {/* Hero Skill Header Card */}
      <Card className="bg-white border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {skill.category}
              </span>
              <span>•</span>
              {getStatusBadge(skill.status)}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {skill.name}
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
              {skill.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Level:</span>
                <span className="font-bold text-slate-800">{skill.level}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">Verified Evidence:</span>
                <span className="font-bold text-slate-800">{skill.evidenceList?.length || 0} items</span>
              </div>
              {skill.score > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Mastery Score:</span>
                    <span className="font-extrabold text-emerald-600">{skill.score}%</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons as specified in Prompt */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            {skill.relatedAssessmentId && (
              <Button
                variant="primary"
                size="sm"
                icon={RotateCcw}
                onClick={() => navigate(`/assessments/${skill.relatedAssessmentId}`)}
              >
                Retake Assessment
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              icon={FileCheck2}
              onClick={() => setEvidenceModalOpen(true)}
            >
              View Evidence ({skill.evidenceList?.length || 0})
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={BookOpen}
              onClick={() => navigate(`/learning?skillId=${skill.id}`)}
            >
              Practice
            </Button>

            <Button
              variant="ghost"
              size="sm"
              icon={FolderGit2}
              onClick={() => navigate('/projects')}
            >
              View Related Projects
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Competency Breakdown */}
        <div className="lg:col-span-7">
          <Card className="bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Competency Breakdown</h3>
            <p className="text-xs text-slate-500 mb-5">
              Granular evaluation across fundamental, theoretical, and practical testing modules.
            </p>

            <div className="space-y-4">
              {skill.breakdown?.map((item) => (
                <div key={item.area}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">{item.area}</span>
                    <span className="text-slate-900 font-bold">{item.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.score >= 85
                          ? 'bg-emerald-500'
                          : item.score >= 70
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Evidence Portfolio & Next Recommended Action */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="bg-white border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900">Verified Evidence Items</h3>
              <span className="text-xs text-slate-400">Public Proof</span>
            </div>

            <div className="space-y-2.5">
              {skill.evidenceList?.length > 0 ? (
                skill.evidenceList.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                        {ev.type}
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">{ev.name}</p>
                      <span className="text-[10px] text-slate-400">Verified on {ev.verifiedAt}</span>
                    </div>
                    <span className="font-bold text-emerald-600 text-xs">{ev.score}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No verified evidence recorded yet.</p>
              )}
            </div>
          </Card>

          {/* Next Action Box */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Recommended Next Action
            </span>
            <p className="text-xs text-slate-700 mt-1 font-medium leading-relaxed">
              {skill.recommendedNextStep}
            </p>
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      <Modal
        isOpen={evidenceModalOpen}
        onClose={() => setEvidenceModalOpen(false)}
        title={`${skill.name} Verification Evidence`}
      >
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Below is the authenticated evidence stack associated with this competency.
          </p>
          {skill.evidenceList?.map((ev) => (
            <div key={ev.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-900">{ev.name}</span>
                <span className="text-emerald-600">{ev.score}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Type: {ev.type} • Verification Date: {ev.verifiedAt}
              </p>
            </div>
          ))}
          <div className="pt-3">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setEvidenceModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
