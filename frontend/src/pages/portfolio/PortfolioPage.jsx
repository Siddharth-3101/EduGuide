import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';
import { skillsApi } from '../../services/api/skillsApi';
import { projectApi } from '../../services/api/projectApi';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { CircularProgress } from '../../components/ui/CircularProgress';
import { CardSkeleton } from '../../components/ui/Skeleton';
import {
  Award,
  Share2,
  CheckCircle2,
  Copy,
  ExternalLink,
  FolderGit2,
  FileCheck,
  ShieldCheck,
  Check,
  MapPin,
  GraduationCap
} from 'lucide-react';

export const PortfolioPage = () => {
  const { user } = useAuth();
  const { stats, profile } = useCareer();

  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [skillsData, projectsData] = await Promise.all([
          skillsApi.getSkills({ status: 'verified' }),
          projectApi.getProjects()
        ]);
        setSkills(skillsData);
        setProjects(projectsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const studentName = profile?.fullName || user?.fullName || 'Alex Chen';
  const targetRole = stats?.targetRoleTitle || 'Backend Developer';

  return (
    <div className="space-y-6">
      {/* Top Banner & Share Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
              <Award className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Public Verified Credential
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Student Skill Passport
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tamper-proof verifiable record of completed technical assessments and repository submissions.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Share2}
          onClick={() => setShareModalOpen(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs"
        >
          Share Profile
        </Button>
      </div>

      {/* Student Passport Header Card */}
      <Card className="bg-white border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white font-bold text-2xl shadow-sm">
              {studentName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-extrabold text-slate-900">{studentName}</h2>
                <Badge variant="verified">Verified Candidate</Badge>
              </div>
              <p className="text-sm font-semibold text-blue-600 mt-0.5">Target: {targetRole}</p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" /> NIT · B.Tech CS (2026)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" /> Bangalore, India
                </span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> ID: SB-992-VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
            <div>
              <span className="text-2xl font-bold text-slate-900">{stats?.competencyCoverage || 67}%</span>
              <p className="text-xs text-slate-500">Benchmark Coverage</p>
            </div>
            <CircularProgress value={stats?.competencyCoverage || 67} size={65} strokeWidth={6} />
          </div>
        </div>
      </Card>

      {/* Section 1: Verified Skills (Required cards) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Verified Skills</h3>
          <span className="text-xs text-slate-400">Standardized Technical Assessments</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <Card key={skill.id} className="p-5 border border-slate-200 bg-white shadow-xs">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-base font-bold text-slate-900">{skill.name}</h4>
                  <Badge variant="verified">✓ Verified</Badge>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Competency Level:</span>
                    <span className="font-semibold text-slate-800">{skill.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verified Score:</span>
                    <span className="font-bold text-emerald-600">{skill.score}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Evidence Stack:</span>
                    <span className="font-medium text-slate-700">Assessment + Project</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Projects */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Demonstrated Projects</h3>
          <span className="text-xs text-slate-400">Automated Code Verification</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.slice(0, 2).map((proj) => (
            <Card key={proj.id} className="p-5 border border-slate-200 bg-white shadow-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5 text-indigo-600" />
                  <h4 className="text-sm font-bold text-slate-900">{proj.title}</h4>
                </div>
                {proj.status === 'Submitted' ? (
                  <Badge variant="verified">Submitted</Badge>
                ) : (
                  <Badge variant="blue">{proj.progress}% Done</Badge>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-2 line-clamp-2">{proj.shortDescription}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {proj.skills?.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3: Verified Certificates */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Certificates & Credentials</h3>
          <span className="text-xs text-slate-400">Authenticated Issuers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile?.certificates?.map((cert) => (
            <Card key={cert.id} className="p-5 border border-slate-200 bg-white flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                <FileCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">{cert.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{cert.issuer} • {cert.issueDate}</p>
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 font-medium hover:underline mt-2"
                >
                  Verify Credential <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Share Profile Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Skill Passport"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Anyone with this link can view your authenticated Skill Passport, verified test scores, and code artifacts.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={stats?.passportPublicUrl || window.location.href}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono bg-slate-50 text-slate-700"
            />
            <Button
              variant="primary"
              size="sm"
              icon={copied ? Check : Copy}
              onClick={handleCopyLink}
              className="bg-slate-900 hover:bg-slate-800 text-white shrink-0"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setShareModalOpen(false)}>
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
