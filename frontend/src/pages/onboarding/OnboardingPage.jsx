import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareer } from '../../context/CareerContext';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  UploadCloud,
  FileText,
  Sparkles,
  Check,
  Target,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const { selectTargetRole } = useCareer();
  const [step, setStep] = useState(1);

  // Form State
  const [selectedRoles, setSelectedRoles] = useState(['backend-developer']);
  const [experienceLevel, setExperienceLevel] = useState('Student');
  const [selectedSkills, setSelectedSkills] = useState(['python', 'sql', 'rest-api', 'git']);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [uploadedCerts, setUploadedCerts] = useState([]);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const availableRoles = [
    { id: 'backend-developer', title: 'Backend Developer', desc: 'APIs, relational databases, microservices' },
    { id: 'software-engineer', title: 'Software Engineer', desc: 'Full-stack software engineering and delivery' },
    { id: 'data-analyst', title: 'Data Analyst', desc: 'SQL, BI dashboards, metric analysis' },
    { id: 'data-scientist', title: 'Data Scientist', desc: 'Machine learning, statistics, Python' },
    { id: 'cloud-engineer', title: 'Cloud Engineer', desc: 'AWS, containers, resilient infrastructure' },
    { id: 'cybersecurity-analyst', title: 'Cybersecurity Analyst', desc: 'Threat defense, network security, audit' }
  ];

  const experienceOptions = [
    { id: 'Beginner', title: 'Beginner', desc: 'Just starting programming journey' },
    { id: 'Student', title: 'Student', desc: 'Currently enrolled in University / College' },
    { id: 'Internship Experience', title: 'Internship Experience', desc: 'Have completed 1 or more tech internships' },
    { id: 'Entry Level', title: 'Entry Level', desc: '0–2 years of professional work experience' },
    { id: 'Experienced', title: 'Experienced', desc: '3+ years of professional engineering' }
  ];

  const commonSkills = [
    'Python', 'Java', 'JavaScript', 'SQL', 'REST API', 'Git', 'Docker',
    'Spring Boot', 'React', 'Redis', 'AWS', 'Linux', 'Node.js', 'PostgreSQL'
  ];

  const handleRoleToggle = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      if (selectedRoles.length > 1) {
        setSelectedRoles(selectedRoles.filter((r) => r !== roleId));
      }
    } else {
      if (selectedRoles.length < 3) {
        setSelectedRoles([...selectedRoles, roleId]);
      }
    }
  };

  const handleSkillToggle = (skillName) => {
    const key = skillName.toLowerCase().replace(/\s+/g, '-');
    if (selectedSkills.includes(key)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== key));
    } else {
      setSelectedSkills([...selectedSkills, key]);
    }
  };

  const handleMockFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setTimeout(() => {
      if (type === 'resume') {
        setUploadedResume({
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          status: 'Parsed & Indexed'
        });
      } else {
        setUploadedCerts((prev) => [
          ...prev,
          {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' KB',
            status: 'Verified'
          }
        ]);
      }
      setIsProcessingFile(false);
    }, 900);
  };

  const handleFinishOnboarding = () => {
    if (selectedRoles[0]) {
      selectTargetRole(selectedRoles[0]);
    }
    navigate('/career');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Simple Header */}
      <header className="flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <span className="font-heading text-lg font-bold text-slate-900">SkillBridge</span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span>Step {step} of 6</span>
          <div className="flex items-center gap-1 ml-2">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-blue-600' : s < step ? 'w-3 bg-emerald-500' : 'w-3 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Form Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm transition-all">
          
          {/* STEP 1: Welcome */}
          {step === 1 && (
            <div className="text-center py-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 mb-5">
                <Sparkles className="h-7 w-7" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Let's build your career roadmap.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                SkillBridge will benchmark your current skills against live hiring requirements, identify your missing competencies, and guide you to job readiness.
              </p>

              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  variant="primary"
                  iconRight={ArrowRight}
                  onClick={() => setStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Career Goal */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Step 2 · Career Goal</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  What role are you targeting?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select up to 3 roles. We will build your competency roadmap based on your primary selection.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableRoles.map((role) => {
                  const isSelected = selectedRoles.includes(role.id);
                  return (
                    <div
                      key={role.id}
                      onClick={() => handleRoleToggle(role.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-slate-900">{role.title}</h4>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-blue-600" />}
                        </div>
                        <p className="text-xs text-slate-500">{role.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  iconRight={ArrowRight}
                  onClick={() => setStep(3)}
                  disabled={selectedRoles.length === 0}
                >
                  Continue ({selectedRoles.length}/3 selected)
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Experience */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Step 3 · Background</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  What is your current experience level?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Helps calibrate your benchmark thresholds for entry-level vs junior positions.
                </p>
              </div>

              <div className="space-y-3">
                {experienceOptions.map((opt) => {
                  const isSelected = experienceLevel === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setExperienceLevel(opt.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{opt.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                      </div>
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white"></span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button variant="primary" iconRight={ArrowRight} onClick={() => setStep(4)}>
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Existing Skills */}
          {step === 4 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Step 4 · Skills</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Select your existing skills
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose the technologies you have written code in. You can verify them via assessment later.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {commonSkills.map((skill) => {
                  const key = skill.toLowerCase().replace(/\s+/g, '-');
                  const isSelected = selectedSkills.includes(key);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleSkillToggle(skill)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white font-semibold shadow-2xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? <Check className="h-3.5 w-3.5" /> : null}
                      {skill}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep(3)}>
                  Back
                </Button>
                <Button variant="primary" iconRight={ArrowRight} onClick={() => setStep(5)}>
                  Continue ({selectedSkills.length} selected)
                </Button>
              </div>
            </div>
          )}

          {/* STEP 5: Evidence Upload (Drag and Drop UI) */}
          {step === 5 && (
            <div>
              <div className="mb-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">Step 5 · Evidence</span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Upload your Resume and Certificates
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  SkillBridge parses your project history and course credentials to pre-verify competency evidence.
                </p>
              </div>

              <div className="space-y-4">
                {/* Resume Dropzone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Resume (PDF, DOCX)</label>
                  <div className="relative border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      onChange={(e) => handleMockFileUpload(e, 'resume')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-medium text-slate-700">
                      Drag and drop your resume here, or <span className="text-blue-600 font-semibold">browse</span>
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Supports PDF or DOCX up to 10MB</p>
                  </div>

                  {isProcessingFile && (
                    <div className="mt-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100 flex items-center gap-2 text-xs text-blue-700 animate-pulse">
                      <Sparkles className="h-4 w-4" />
                      <span>Parsing skills, certifications, and project links...</span>
                    </div>
                  )}

                  {uploadedResume && !isProcessingFile && (
                    <div className="mt-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-600" />
                        <span className="font-semibold">{uploadedResume.name}</span>
                        <span className="text-slate-400">({uploadedResume.size})</span>
                      </div>
                      <span className="font-semibold text-emerald-600">✓ Parsed</span>
                    </div>
                  )}
                </div>

                {/* Certificates Dropzone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Certificates (Optional)</label>
                  <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center transition-colors bg-white">
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg"
                      onChange={(e) => handleMockFileUpload(e, 'certificate')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-xs text-slate-600">
                      + Add certificate (Coursera, Udemy, AWS, University honors)
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="secondary" icon={ArrowLeft} onClick={() => setStep(4)}>
                  Back
                </Button>
                <Button variant="primary" iconRight={ArrowRight} onClick={() => setStep(6)}>
                  Complete Profile
                </Button>
              </div>
            </div>
          )}

          {/* STEP 6: Finished / Ready */}
          {step === 6 && (
            <div className="text-center py-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-5">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Your career profile is ready.
              </h2>
              <p className="mt-3 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                We've synthesized your background against our live <strong className="text-slate-900">Backend Developer</strong> competency model. Your initial coverage is calibrated at <strong className="text-emerald-600 font-bold">67%</strong>.
              </p>

              <div className="mt-6 max-w-md mx-auto p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Role:</span>
                  <span className="font-semibold text-slate-900">Backend Developer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Verified Competencies:</span>
                  <span className="font-semibold text-emerald-600">8 Skills Verified</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Immediate Action:</span>
                  <span className="font-semibold text-blue-600">Complete Docker Verification</span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  variant="primary"
                  iconRight={ArrowRight}
                  onClick={handleFinishOnboarding}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 shadow-sm"
                >
                  View My Roadmap
                </Button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};
