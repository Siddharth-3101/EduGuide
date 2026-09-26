import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { projectApi } from '../../services/api/projectApi';
import {
  X,
  FolderGit2,
  GitBranch,
  Search,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Code2,
  FileCheck2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AddProjectModal = ({ isOpen, onClose, onProjectAdded }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    githubRepoUrl: '',
    liveDemoUrl: '',
    skillsUsed: '',
    projectType: 'Backend API'
  });

  const [showOptionalFields, setShowOptionalFields] = useState(false);
  const [step, setStep] = useState('input'); // 'input' | 'analyzing' | 'readme_fallback' | 'result'
  const [analyzingProgress, setAnalyzingProgress] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [manualReadmeText, setManualReadmeText] = useState('');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAnalyzeAndSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.githubRepoUrl.trim()) {
      setError('Please provide a GitHub repository link.');
      return;
    }

    // Auto-derive project name if omitted
    let derivedName = formData.projectName.trim();
    if (!derivedName) {
      const clean = formData.githubRepoUrl.trim().replace(/\.git$/, '').replace(/\/$/, '');
      derivedName = clean.split('/').pop() || 'GitHub Project';
      setFormData((prev) => ({ ...prev, projectName: derivedName }));
    }

    setError(null);
    setStep('analyzing');
    setAnalyzingProgress([]);

    const stepsSequence = [
      'Locating GitHub repository...',
      'Retrieving raw README.md file...',
      'Parsing markdown & codebase manifests...',
      'Extracting skills & framework entities...'
    ];

    for (let i = 0; i < stepsSequence.length; i++) {
      await new Promise((r) => setTimeout(r, 280));
      setAnalyzingProgress((prev) => [...prev, stepsSequence[i]]);
    }

    try {
      const result = await projectApi.analyzeProject(formData.githubRepoUrl.trim(), manualReadmeText);

      // Check if README was missing from the repository
      if (result.readme_found === false && !manualReadmeText.trim()) {
        setStep('readme_fallback');
        return;
      }

      setAnalysisResult(result);

      // Save project
      const created = await projectApi.addProject({
        ...formData,
        projectName: derivedName,
        description: formData.description || 'Project evidence analyzed via GitHub repository.',
        detectedTechnologies: result.technologies || result.skills,
        detectedSkills: result.skills
      });

      if (onProjectAdded) {
        onProjectAdded(created);
      }
      setStep('result');
    } catch (err) {
      console.error(err);
      setError('Could not complete GitHub analysis. Please verify your repository link.');
      setStep('input');
    }
  };

  const handleManualReadmeSubmit = async (e) => {
    e.preventDefault();
    if (!manualReadmeText.trim()) {
      setError('Please paste your README or project description text.');
      return;
    }
    await handleAnalyzeAndSubmit();
  };

  const handlePrefillSample = () => {
    setFormData({
      projectName: 'AgriSmart Platform',
      description: 'Role-based smart agriculture administration platform using Java, Spring Boot, MySQL, REST APIs, and microservices.',
      githubRepoUrl: 'https://github.com/Siddharth-3101/AgriSmart',
      liveDemoUrl: '',
      skillsUsed: 'Java, Spring Boot, MySQL, REST APIs, React',
      projectType: 'Backend API'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-2xl text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-current/10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded border border-current/20 bg-[var(--bg-page)] text-[var(--accent-terracotta)]">
              <FolderGit2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-editorial-title text-xl font-bold uppercase tracking-tight">
                Analyze GitHub Repository
              </h2>
              <p className="text-xs opacity-70">
                Provide a GitHub repo link to automatically extract skills from your project's README.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-current/10 opacity-70 hover:opacity-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: INPUT FORM */}
        {step === 'input' && (
          <form onSubmit={handleAnalyzeAndSubmit} className="mt-5 space-y-4 font-editorial-mono text-xs">
            <div className="flex justify-between items-center bg-current/5 p-3 rounded border border-current/10 text-xs">
              <span className="opacity-75">Quick sample project link:</span>
              <button
                type="button"
                onClick={handlePrefillSample}
                className="font-editorial-mono font-bold text-[var(--accent-terracotta)] hover:underline"
              >
                Prefill "AgriSmart Platform"
              </button>
            </div>

            {error && (
              <div className="p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs flex items-center gap-2 font-sans">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* ONLY REQUIRED FIELD: GitHub Repository URL */}
            <div className="space-y-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
                GitHub Repository URL *
              </label>
              <input
                type="url"
                name="githubRepoUrl"
                required
                value={formData.githubRepoUrl}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repository"
                className="w-full px-3.5 py-2.5 text-xs rounded border border-current/25 bg-[var(--bg-page)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)] font-editorial-mono"
              />
              <p className="text-[11px] opacity-60 font-sans mt-0.5">
                Our AI will directly fetch and parse the repository's <strong className="font-semibold">README.md</strong> to extract skills and frameworks.
              </p>
            </div>

            {/* Optional Details Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="text-xs opacity-75 hover:opacity-100 flex items-center gap-1.5 font-bold"
              >
                {showOptionalFields ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                <span>{showOptionalFields ? 'Hide Optional Details' : '+ Add Optional Details (Name, Description)'}</span>
              </button>

              {showOptionalFields && (
                <div className="mt-3 p-4 rounded border border-current/15 bg-current/[0.02] space-y-3 animate-in fade-in">
                  <div>
                    <label className="block text-[10px] uppercase opacity-70 mb-1">Custom Project Name (Optional)</label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="Defaults to repository name"
                      className="w-full px-3 py-2 text-xs rounded border border-current/20 bg-[var(--bg-page)]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase opacity-70 mb-1">Project Description (Optional)</label>
                    <textarea
                      name="description"
                      rows={2}
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief overview of features, API endpoints, or architecture..."
                      className="w-full px-3 py-2 text-xs rounded border border-current/20 bg-[var(--bg-page)] font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase opacity-70 mb-1">Live Demo URL (Optional)</label>
                      <input
                        type="url"
                        name="liveDemoUrl"
                        value={formData.liveDemoUrl}
                        onChange={handleInputChange}
                        placeholder="https://my-app.vercel.app"
                        className="w-full px-3 py-2 text-xs rounded border border-current/20 bg-[var(--bg-page)]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase opacity-70 mb-1">Project Category</label>
                      <select
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 text-xs rounded border border-current/20 bg-[var(--bg-page)]"
                      >
                        <option value="Backend API">Backend API</option>
                        <option value="Full Stack App">Full Stack App</option>
                        <option value="Microservices">Microservices</option>
                        <option value="DevOps / Cloud">DevOps / Cloud</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-current/10 flex justify-end gap-2">
              <Button variant="secondary" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" iconRight={Search}>
                Analyze & Extract Skills
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: ANALYZING STATE */}
        {step === 'analyzing' && (
          <div className="py-10 text-center space-y-5 font-editorial-mono">
            <div className="h-10 w-10 rounded-full border-2 border-[var(--accent-terracotta)] border-t-transparent animate-spin mx-auto" />
            <div>
              <h3 className="font-editorial-title text-base font-bold uppercase">
                Analyzing GitHub Repository...
              </h3>
              <p className="text-xs opacity-70 font-sans mt-1">
                Reading documentation, requirements, and codebase structure.
              </p>
            </div>

            <div className="max-w-xs mx-auto space-y-2 text-left text-xs pt-2">
              {analyzingProgress.map((msg, idx) => (
                <div key={idx} className="flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold">{msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: FALLBACK PROMPT IF NO README WAS FOUND */}
        {step === 'readme_fallback' && (
          <div className="mt-5 space-y-4 font-editorial-mono text-xs animate-in fade-in">
            <div className="p-4 rounded border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 space-y-1 font-sans">
              <div className="flex items-center gap-2 font-editorial-mono font-bold text-xs uppercase text-amber-600 dark:text-amber-400">
                <FileText className="h-4 w-4" /> No README.md Found in Repository
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                We connected to <strong className="font-semibold">{formData.githubRepoUrl}</strong>, but no public <code className="px-1 rounded bg-black/10">README.md</code> was found on main/master branches.
              </p>
              <p className="text-xs opacity-80">
                Please paste your project's README or description below so our AI extractor can parse your skills:
              </p>
            </div>

            <form onSubmit={handleManualReadmeSubmit} className="space-y-3">
              <label className="block text-[10px] uppercase font-bold opacity-75">
                Paste Project README / Architecture Notes *
              </label>
              <textarea
                rows={5}
                required
                value={manualReadmeText}
                onChange={(e) => setManualReadmeText(e.target.value)}
                placeholder="# AgriSmart Platform&#10;Backend built with Java, Spring Boot, MySQL, REST APIs, and microservices architecture. Includes JWT security and Docker container deployment..."
                className="w-full px-3 py-2 text-xs rounded border border-current/25 bg-[var(--bg-page)] font-sans focus:outline-none focus:ring-1 focus:ring-[var(--accent-terracotta)]"
              />

              <div className="pt-2 flex justify-end gap-2">
                <Button variant="secondary" size="sm" type="button" onClick={() => setStep('input')}>
                  Back
                </Button>
                <Button variant="primary" size="sm" type="submit" iconRight={Sparkles}>
                  Analyze Pasted Content
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 4: RESULT SCREEN */}
        {step === 'result' && analysisResult && (
          <div className="mt-5 space-y-5 font-editorial-mono text-xs animate-in fade-in">
            <div className="p-4 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-editorial-title text-sm font-bold uppercase">
                  Project Analyzed & Skills Extracted Successfully
                </h4>
                <p className="text-xs opacity-80 font-sans mt-0.5">
                  Extracted {analysisResult.skills?.length || 0} skills from repository documentation. Skills have been elevated to Evidence-Backed in your passport.
                </p>
              </div>
            </div>

            {/* Detected Skills */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase opacity-70 block">
                Detected Competencies & Frameworks
              </span>
              <div className="flex flex-wrap gap-2">
                {analysisResult.skills?.map((sk) => (
                  <span
                    key={sk}
                    className="flex items-center gap-1.5 px-3 py-1 rounded border border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>{sk}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded border border-current/15 bg-current/5 space-y-1 text-[11px] font-sans opacity-80">
              <span className="font-editorial-mono font-bold uppercase text-[10px] text-[var(--accent-terracotta)] block">
                Next Best Step:
              </span>
              <p>
                Take the rapid standardized assessment for your extracted skills to elevate them from 🔷 Evidence-Backed to 🟢 Fully Verified.
              </p>
            </div>

            <div className="pt-3 border-t border-current/10 flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  onClose();
                  navigate('/projects');
                }}
              >
                View in Projects Stack
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
