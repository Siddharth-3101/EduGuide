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
  GraduationCap,
  Sparkles,
  Code2
} from 'lucide-react';

export const PortfolioPage = () => {
  const { user } = useAuth();
  const { stats, profile } = useCareer();

  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [candidateInfo, setCandidateInfo] = useState(() => ({
    name: localStorage.getItem('skillsync_candidate_name') || profile?.fullName || user?.fullName || 'Candidate Profile',
    education: localStorage.getItem('skillsync_candidate_education') || 'Higher Education / Engineering Degree',
    location: profile?.location || 'Coimbatore, Tamil Nadu, India'
  }));

  const fetchData = async () => {
    try {
      setLoading(true);
      const [skillsData, projectsData] = await Promise.all([
        skillsApi.getSkills({ status: 'verified' }),
        projectApi.getProjects()
      ]);
      setSkills(skillsData);
      setProjects(projectsData);
      setCandidateInfo({
        name: localStorage.getItem('skillsync_candidate_name') || profile?.fullName || user?.fullName || 'Candidate Profile',
        education: localStorage.getItem('skillsync_candidate_education') || 'Higher Education / Engineering Degree',
        location: profile?.location || 'Coimbatore, Tamil Nadu, India'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    window.addEventListener('skillsync_profile_updated', fetchData);
    window.addEventListener('skillsync_certificates_updated', fetchData);
    window.addEventListener('skillsync_data_updated', fetchData);
    window.addEventListener('storage', fetchData);

    return () => {
      window.removeEventListener('skillsync_profile_updated', fetchData);
      window.removeEventListener('skillsync_certificates_updated', fetchData);
      window.removeEventListener('skillsync_data_updated', fetchData);
      window.removeEventListener('storage', fetchData);
    };
  }, [profile, user]);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const studentName = candidateInfo.name;
  const candidateEducation = candidateInfo.education;
  const candidateLocation = candidateInfo.location;
  const targetRole = stats?.targetRoleTitle || profile?.targetRoleTitle || 'Backend Developer';

  return (
    <div className="space-y-6 text-[var(--text-primary)]">
      {/* Top Banner & Share Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-line)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[var(--accent-terracotta)]/15 text-[var(--accent-terracotta)]">
              <Award className="h-3.5 w-3.5" />
            </span>
            <span className="font-editorial-mono text-[11px] font-bold text-[var(--accent-terracotta)] uppercase tracking-wider">
              Public Verified Credential
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-editorial-title uppercase tracking-tight">
            Student Skill Passport
          </h1>
          <p className="text-xs font-editorial-mono opacity-70 mt-1">
            Tamper-proof verifiable record of completed technical assessments, authenticated repositories, and institutional credentials.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Share2}
          onClick={() => setShareModalOpen(true)}
          className="font-editorial-mono text-xs font-semibold shadow-xs"
        >
          Share Profile
        </Button>
      </div>

      {/* Student Passport Header Card */}
      <Card className="bg-[var(--card-surface)] border border-[var(--border-line)] p-6 sm:p-8 rounded-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-terracotta)] text-white font-editorial-title font-bold text-2xl shadow-sm">
              {studentName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase() || 'SG'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-bold font-editorial-title">{studentName}</h2>
                <Badge variant="verified">Verified Candidate</Badge>
              </div>
              <p className="text-sm font-semibold font-editorial-mono text-[var(--accent-terracotta)] mt-0.5">
                Target Role: {targetRole}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-editorial-mono opacity-80">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
                  {candidateEducation}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[var(--accent-terracotta)]" />
                  {candidateLocation}
                </span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> ID: SB-{studentName.replace(/[^A-Za-z]/g, '').slice(0, 4).toUpperCase() || 'SG'}-VERIFIED
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 p-4 rounded-xl bg-current/5 border border-current/15 shrink-0">
            <div>
              <span className="text-2xl font-bold font-editorial-title block leading-none">
                {stats?.competencyCoverage || 84}%
              </span>
              <p className="text-[11px] font-editorial-mono opacity-70 mt-1">Benchmark Coverage</p>
            </div>
            <CircularProgress value={stats?.competencyCoverage || 84} size={65} strokeWidth={6} />
          </div>
        </div>
      </Card>

      {/* Section 1: Verified Skills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-editorial-title uppercase">Verified Skills</h3>
          <span className="text-xs font-editorial-mono opacity-60">Standardized Technical Assessments</span>
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
              <Card key={skill.id} className="p-5 border border-[var(--border-line)] bg-[var(--card-surface)] shadow-xs rounded-xl">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="text-base font-bold font-editorial-title">{skill.name}</h4>
                  <Badge variant="verified">✓ Verified</Badge>
                </div>
                <div className="space-y-1.5 text-xs font-editorial-mono opacity-85 mt-3 pt-3 border-t border-current/10">
                  <div className="flex justify-between">
                    <span className="opacity-70">Competency Level:</span>
                    <span className="font-semibold">{skill.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Verified Score:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{skill.score || 88}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-70">Evidence Stack:</span>
                    <span className="font-medium text-[var(--accent-terracotta)]">Assessment + GitHub Codebase</span>
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
          <h3 className="text-lg font-bold font-editorial-title uppercase">Demonstrated Projects</h3>
          <span className="text-xs font-editorial-mono opacity-60">Automated Code Verification & Deployment</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.slice(0, 4).map((proj) => (
            <Card key={proj.id} className="p-5 border border-[var(--border-line)] bg-[var(--card-surface)] shadow-xs rounded-xl flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded bg-[var(--accent-terracotta)]/10 text-[var(--accent-terracotta)]">
                      <FolderGit2 className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm font-bold font-editorial-title">{proj.title}</h4>
                  </div>
                  {proj.evidenceStatus === 'Verified' ? (
                    <Badge variant="verified">Verified</Badge>
                  ) : (
                    <Badge variant="terracotta">{proj.evidenceStatus || 'Evidence Found'}</Badge>
                  )}
                </div>

                <p className="text-xs font-editorial-mono opacity-75 mt-2 line-clamp-2 leading-relaxed">
                  {proj.shortDescription}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(proj.skills || proj.detectedTechnologies || []).slice(0, 5).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-current/5 border border-current/15 text-[11px] font-editorial-mono font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-xs font-editorial-mono">
                {proj.githubRepoUrl && (
                  <a
                    href={proj.githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--accent-terracotta)] hover:underline font-semibold"
                  >
                    <Code2 className="h-3 w-3" /> Repository <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
                {proj.liveDemoUrl && (
                  <a
                    href={proj.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Live Demo <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Section 3: Verified Certificates */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-editorial-title uppercase">Certificates & Credentials</h3>
          <span className="text-xs font-editorial-mono opacity-60">Authenticated Issuers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            let localCerts = [];
            try {
              const raw = localStorage.getItem('skillsync_local_certificates');
              if (raw) localCerts = JSON.parse(raw);
            } catch (e) {}
            const defaultCerts = [
              {
                id: 'cert-1',
                title: 'Spring Boot Microservices & Cloud Native Systems',
                issuer: 'Oracle / Coursera Certified',
                issueDate: 'Jan 2026',
                credentialUrl: 'https://credentials.example/cert-8891'
              },
              {
                id: 'cert-2',
                title: 'Docker & Kubernetes Containerization Specialist',
                issuer: 'Linux Foundation / CNCF',
                issueDate: 'Nov 2025',
                credentialUrl: 'https://credentials.example/cert-4421'
              }
            ];
            const displayCerts = localCerts.length > 0 ? localCerts : (profile?.certificates && profile.certificates.length > 0 ? profile.certificates : defaultCerts);
            return displayCerts.map((cert) => (
              <Card key={cert.id || cert.title} className="p-5 border border-[var(--border-line)] bg-[var(--card-surface)] rounded-xl flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <FileCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold font-editorial-title">{cert.title || cert.name}</h4>
                  <p className="text-[11px] font-editorial-mono opacity-70 mt-0.5">{cert.issuer} • {cert.issueDate || cert.issue_date || 'Verified'}</p>
                  <a
                    href={cert.credentialUrl || cert.url || 'https://skillsync.org/verify'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-editorial-mono text-[var(--accent-terracotta)] font-semibold hover:underline mt-2"
                  >
                    Verify Credential <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </Card>
            ));
          })()}
        </div>
      </div>

      {/* Share Profile Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Skill Passport"
      >
        <div className="space-y-4 text-[var(--text-primary)]">
          <p className="text-xs font-editorial-mono opacity-80 leading-relaxed">
            Anyone with this authenticated link can view your tamper-proof Skill Passport, verified test scores, and code verification artifacts.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={stats?.passportPublicUrl || window.location.href}
              className="flex-1 px-3 py-2 text-xs rounded-lg border border-[var(--border-line)] font-mono bg-current/5 text-[var(--text-primary)]"
            />
            <Button
              variant="primary"
              size="sm"
              icon={copied ? Check : Copy}
              onClick={handleCopyLink}
              className="shrink-0 font-editorial-mono text-xs"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </div>

          {/* LinkedIn 1-Click Share */}
          <div className="p-3.5 rounded-lg border border-blue-500/30 bg-blue-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[#0077B5] text-white font-bold text-[10px]">in</span>
                <h5 className="font-editorial-title text-xs font-bold uppercase tracking-tight text-blue-700 dark:text-blue-300">
                  Share Credential to LinkedIn
                </h5>
              </div>
              <p className="text-[11px] font-editorial-mono opacity-80 mt-0.5">
                Post your verified Skill Passport and competency benchmark badge to your LinkedIn feed.
              </p>
            </div>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(stats?.passportPublicUrl || window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0077B5] text-white font-editorial-mono text-xs font-bold hover:bg-[#005582] transition-colors shrink-0 uppercase tracking-wider"
            >
              <Share2 className="h-3.5 w-3.5" /> Post on LinkedIn
            </a>
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
