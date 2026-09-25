import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import {
  UploadCloud,
  FileCheck2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  FileText,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CertificateUploadModule = ({ onSkillsUpdated }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [result, setResult] = useState(null);

  const steps = [
    'Parsing document layout...',
    'Extracting Certificate Name & Issuer...',
    'Extracting Course & Date...',
    'Mapping credentialed skills & competencies...'
  ];

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleSelectedFile(e.target.files[0]);
    }
  };

  const handleSelectedFile = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    startAnalysis(selectedFile);
  };

  const startAnalysis = (selectedFile) => {
    setAnalyzing(true);
    setProgressStep(0);

    const stepInterval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setAnalyzing(false);
          setResult({
            certificateName: 'Production Cloud Architecture & Containerization',
            issuer: 'Linux Foundation / Cloud Academy',
            course: 'Container Orchestration with Docker & Kubernetes',
            issuedDate: 'January 2026',
            credentialId: 'LF-78942-DOCKER',
            evidenceState: 'Evidence Found',
            detectedSkills: ['Docker', 'Linux', 'Microservices', 'Kubernetes'],
            potentiallyRelevantSkills: [
              { name: 'Docker', status: 'Evidence Found', note: 'Maps to your critical skill gap. Assessment required to verify.' },
              { name: 'Microservices', status: 'Evidence Found', note: 'Supported by module completion.' }
            ]
          });
          return prev;
        }
      });
    }, 600);
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-current/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded border border-current/20 bg-current/5 text-[var(--accent-terracotta)]">
              <FileCheck2 className="h-3.5 w-3.5" />
            </span>
            <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight">
              Certificate Upload & Evidence Analysis
            </h3>
          </div>
          <p className="text-xs opacity-70 mt-0.5 font-sans">
            Submit credentials to register objective evidence. Assessments independently verify competencies.
          </p>
        </div>

        {/* Evidence Lifecycle Status Indicator */}
        <div className="flex items-center gap-1 font-editorial-mono text-[9px] uppercase tracking-wider">
          <span className="px-1.5 py-0.5 rounded border border-current/15 opacity-60">Uploaded</span>
          <span className="opacity-40">→</span>
          <span className="px-1.5 py-0.5 rounded border border-current/15 opacity-60">Analyzed</span>
          <span className="opacity-40">→</span>
          <span className="px-1.5 py-0.5 rounded border border-current/30 text-[var(--accent-terracotta)] font-bold">Evidence Found</span>
          <span className="opacity-40">→</span>
          <span className="px-1.5 py-0.5 rounded border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold">Verified</span>
        </div>
      </div>

      {/* Upload Drop Zone */}
      {!analyzing && !result && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleFileDrop}
          className={`border-2 border-dashed rounded-md p-8 text-center transition-all ${
            dragActive
              ? 'border-[var(--accent-terracotta)] bg-current/5 scale-[0.99]'
              : 'border-current/20 hover:border-current/40 bg-[var(--bg-page)]/40'
          }`}
        >
          <UploadCloud className="h-10 w-10 mx-auto opacity-50 mb-3 text-[var(--accent-terracotta)]" />
          <p className="font-editorial-title text-sm font-bold uppercase">
            Drag & drop your certificate here
          </p>
          <p className="text-xs opacity-60 font-editorial-mono mt-1">
            Supports PDF, PNG, JPG / JPEG (Max 10MB)
          </p>

          <div className="mt-4">
            <label className="cursor-pointer inline-flex items-center justify-center font-editorial-mono text-xs font-semibold px-4 py-2 rounded border border-current/25 hover:bg-current/10 transition-colors">
              <span>Browse Files</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Processing Analysis State */}
      {analyzing && (
        <div className="p-8 rounded border border-current/20 bg-current/5 text-center space-y-4 font-editorial-mono">
          <div className="h-9 w-9 rounded-full border-2 border-[var(--accent-terracotta)] border-t-transparent animate-spin mx-auto" />
          <div>
            <h4 className="font-editorial-title text-base font-bold uppercase">
              Analyzing Certificate with Document AI...
            </h4>
            <p className="text-xs opacity-70 mt-1 font-sans">
              Extracting metadata, issuer authenticity signatures, and skill competencies.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left pt-2 text-xs">
            {steps.map((st, idx) => (
              <div
                key={st}
                className={`flex items-center gap-2 transition-opacity ${
                  idx <= progressStep ? 'opacity-100 font-semibold' : 'opacity-30'
                }`}
              >
                {idx < progressStep ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : idx === progressStep ? (
                  <div className="h-2 w-2 rounded-full bg-[var(--accent-terracotta)] animate-ping" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-current/20" />
                )}
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis Result Card */}
      {result && (
        <div className="rounded border border-current/20 bg-[var(--bg-page)] p-5 space-y-4 font-editorial-mono animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-current/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
                Certificate Analysis Result · {result.evidenceState}
              </span>
              <h4 className="font-editorial-title text-base font-bold uppercase mt-0.5">
                {result.certificateName}
              </h4>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
              className="text-xs opacity-60 hover:opacity-100 hover:underline self-start sm:self-auto"
            >
              Upload Another
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="opacity-50 text-[10px] uppercase block">Issuer</span>
              <span className="font-bold">{result.issuer}</span>
            </div>
            <div>
              <span className="opacity-50 text-[10px] uppercase block">Course</span>
              <span className="font-bold">{result.course}</span>
            </div>
            <div>
              <span className="opacity-50 text-[10px] uppercase block">Issued Date</span>
              <span className="font-bold">{result.issuedDate}</span>
            </div>
            <div>
              <span className="opacity-50 text-[10px] uppercase block">Credential ID</span>
              <span className="font-bold">{result.credentialId}</span>
            </div>
          </div>

          {/* Detected Skills */}
          <div className="pt-2 border-t border-current/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
              Detected Skills & Impact on Profile
            </span>
            <div className="space-y-2">
              {result.potentiallyRelevantSkills.map((sk) => (
                <div
                  key={sk.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded border border-current/15 bg-[var(--card-surface)] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    <span className="font-bold uppercase font-editorial-title">{sk.name}</span>
                    <span className="text-[10px] opacity-60 font-sans">({sk.note})</span>
                  </div>

                  <Link
                    to="/assessments/asm-docker"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--accent-terracotta)] hover:underline self-start sm:self-auto"
                  >
                    Take {sk.name} Assessment to Verify <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Clarification banner */}
          <div className="flex items-start gap-2 p-3 rounded border border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200 text-xs font-sans">
            <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <p>
              <strong>Important:</strong> Uploading certificates records recognized evidence in your Skill Passport. Full competency verification requires taking the standardized SkillBridge assessment.
            </p>
          </div>
        </div>
      )}

      {/* Security notice */}
      <p className="text-[11px] opacity-50 font-sans text-center">
        Your documents are used solely to analyze your career profile. Do not upload documents containing unnecessary sensitive information.
      </p>
    </Card>
  );
};
