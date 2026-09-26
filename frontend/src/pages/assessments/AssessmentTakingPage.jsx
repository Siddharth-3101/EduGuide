import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentApi } from '../../services/api/assessmentApi';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { CardSkeleton } from '../../components/ui/Skeleton';
import {
  Clock,
  Flag,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Play,
  FileCheck2,
  Layers,
  Sparkles,
  Maximize2,
  Minimize2,
  Video,
  VideoOff,
  AlertTriangle,
  Eye,
  Camera,
  XCircle,
  Ban,
  AlertOctagon
} from 'lucide-react';

const MAX_ATTEMPTS = 3;
const COOLDOWN_DAYS = 5;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

export const AssessmentTakingPage = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60); // 15 mins
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Proctored Environment & Strict Integrity States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // Attempt Limit & 5-Day Cooldown States
  const [attemptsCount, setAttemptsCount] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  // Disqualification States
  const [isDisqualified, setIsDisqualified] = useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState('');
  const [disqualificationTime, setDisqualificationTime] = useState('');

  // AI Camera Face Tracking States
  const [facesDetected, setFacesDetected] = useState(1);
  const [lookingAwaySeconds, setLookingAwaySeconds] = useState(0);
  const [multipleFacesCounter, setMultipleFacesCounter] = useState(0);
  const [proctorStatus, setProctorStatus] = useState('Active • Initializing');

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const visionIntervalRef = useRef(null);

  // Load Attempt & Cooldown Data on Mount
  useEffect(() => {
    const asmtKey = `skillsync_asmt_attempt_${assessmentId || 'asmt-docker'}`;
    try {
      const raw = localStorage.getItem(asmtKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const count = parsed.attempts || 0;
        const cooldown = parsed.cooldownUntil || null;
        setAttemptsCount(count);
        setCooldownUntil(cooldown);

        if (count >= MAX_ATTEMPTS && cooldown) {
          if (Date.now() < cooldown) {
            setIsCooldownActive(true);
          } else {
            // Cooldown expired: reset attempts
            localStorage.removeItem(asmtKey);
            setAttemptsCount(0);
            setCooldownUntil(null);
            setIsCooldownActive(false);
          }
        }
      }
    } catch (e) {}
  }, [assessmentId]);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const data = await assessmentApi.getAssessmentById(assessmentId || 'asmt-docker');
        setAssessment(data);
        if (data.durationMinutes) {
          setSecondsRemaining(data.durationMinutes * 60);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [assessmentId]);

  // Live Timer countdown
  useEffect(() => {
    if (!hasStarted || isDisqualified || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [hasStarted, isDisqualified, secondsRemaining]);

  // Disqualification Trigger
  const handleDisqualify = (reason) => {
    setIsDisqualified(true);
    setDisqualificationReason(reason);
    setDisqualificationTime(new Date().toLocaleTimeString());
    stopCamera();

    if (document.fullscreenElement) {
      try {
        document.exitFullscreen().catch(() => {});
      } catch (e) {}
    }

    // Record used attempt & apply cooldown if exhausted
    const asmtKey = `skillsync_asmt_attempt_${assessmentId || 'asmt-docker'}`;
    try {
      const raw = localStorage.getItem(asmtKey);
      let parsed = raw ? JSON.parse(raw) : { attempts: 0, cooldownUntil: null };
      parsed.attempts = Math.min(MAX_ATTEMPTS, (parsed.attempts || 0) + 1);
      if (parsed.attempts >= MAX_ATTEMPTS) {
        parsed.cooldownUntil = Date.now() + COOLDOWN_MS;
        setCooldownUntil(parsed.cooldownUntil);
        setIsCooldownActive(true);
      }
      localStorage.setItem(asmtKey, JSON.stringify(parsed));
      setAttemptsCount(parsed.attempts);
    } catch (e) {}
  };

  // Fullscreen & Tab Switch Listeners (Strict Auto-Disqualification)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const active = Boolean(document.fullscreenElement);
      setIsFullscreen(active);
      if (!active && hasStarted && !isDisqualified) {
        handleDisqualify('Integrity Violation: Exited Fullscreen Mode. Proctored exams must be taken strictly in fullscreen.');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && hasStarted && !isDisqualified) {
        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          if (nextCount > 2) {
            handleDisqualify('Integrity Violation: Tab switched more than 2 times (Maximum allowed: 2 switches).');
          }
          return nextCount;
        });
      }
    };

    const handleWindowBlur = () => {
      if (hasStarted && !isDisqualified) {
        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          if (nextCount > 2) {
            handleDisqualify('Integrity Violation: Focus lost to external application window (>2 window switches).');
          }
          return nextCount;
        });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      stopCamera();
    };
  }, [hasStarted, isDisqualified]);

  // Advanced Multi-Person & Head Orientation (Yaw/Pitch) Computer Vision Tracker
  useEffect(() => {
    if (!hasStarted || isDisqualified || !isCameraActive) {
      if (visionIntervalRef.current) clearInterval(visionIntervalRef.current);
      return;
    }

    visionIntervalRef.current = setInterval(async () => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;

      try {
        const visionResult = analyzeCanvasFrame(video);
        const { facesCount, lookingAway } = visionResult;

        setFacesDetected(facesCount);

        // 1. Multiple Persons Violation Rule:
        if (facesCount > 1) {
          setProctorStatus('MULTIPLE PERSONS DETECTED');
          setMultipleFacesCounter((prev) => {
            const next = prev + 1;
            if (next >= 3) {
              handleDisqualify('Integrity Violation: Multiple people detected in front of the camera.');
            }
            return next;
          });
        } else {
          setMultipleFacesCounter(0);
        }

        // 2. Looking Away / Candidate Absent Violation Rule:
        if (facesCount === 0 || lookingAway) {
          setLookingAwaySeconds((prev) => {
            const next = +(prev + 0.4).toFixed(1);
            setProctorStatus(`WARNING: Candidate looking away (${next}s / 4s)`);
            if (next >= 4.0) {
              handleDisqualify('Integrity Violation: Candidate looked away or was absent from the camera view for more than 4 consecutive seconds.');
            }
            return next;
          });
        } else if (facesCount === 1 && !lookingAway) {
          setLookingAwaySeconds(0);
          setProctorStatus('1 Face Detected • In Frame (Normal)');
        }
      } catch (err) {
        console.warn('Vision detection cycle err:', err);
      }
    }, 400);

    return () => {
      if (visionIntervalRef.current) clearInterval(visionIntervalRef.current);
    };
  }, [hasStarted, isDisqualified, isCameraActive]);

  // High-performance canvas frame spatial blob & head orientation estimator
  const analyzeCanvasFrame = (video) => {
    try {
      const canvas = document.createElement('canvas');
      const W = 160;
      const H = 120;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return { facesCount: 1, lookingAway: false, label: 'Normal' };
      ctx.drawImage(video, 0, 0, W, H);
      const imgData = ctx.getImageData(0, 0, W, H);
      const data = imgData.data;

      // 1. Grid-based spatial sampling: 16 cols x 12 rows (each 10x10 px)
      const cols = 16;
      const rows = 12;
      const cellW = W / cols;
      const cellH = H / rows;
      const grid = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

      let totalSkinPixels = 0;
      let sumX = 0;
      let sumY = 0;
      let minX = W, maxX = 0, minY = H, maxY = 0;

      for (let y = 0; y < H; y += 4) {
        for (let x = 0; x < W; x += 4) {
          const idx = (y * W + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Robust human skin chrominance cluster
          if (r > 60 && g > 35 && b > 20 && r > g && r > b && (r - g) >= 12 && (r - b) >= 10) {
            totalSkinPixels++;
            sumX += x;
            sumY += y;
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;

            const c = Math.floor(x / cellW);
            const ro = Math.floor(y / cellH);
            if (ro < rows && c < cols) {
              grid[ro][c]++;
            }
          }
        }
      }

      // If virtually no skin detected -> candidate left camera
      if (totalSkinPixels < 25) {
        return { facesCount: 0, lookingAway: true, label: 'Candidate Absent' };
      }

      // 2. Connected component analysis across active cells (>4 skin samples)
      const active = new Array(rows).fill(0).map((_, r) =>
        new Array(cols).fill(0).map((__, c) => grid[r][c] >= 3 ? 1 : 0)
      );

      const visited = new Array(rows).fill(0).map(() => new Array(cols).fill(false));
      const components = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (active[r][c] === 1 && !visited[r][c]) {
            let size = 0;
            let blobSumX = 0;
            let blobSumY = 0;
            const queue = [[r, c]];
            visited[r][c] = true;

            while (queue.length > 0) {
              const [currR, currC] = queue.shift();
              size++;
              blobSumX += currC;
              blobSumY += currR;

              const neighbors = [
                [currR - 1, currC],
                [currR + 1, currC],
                [currR, currC - 1],
                [currR, currC + 1]
              ];
              for (const [nr, nc] of neighbors) {
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && active[nr][nc] === 1 && !visited[nr][nc]) {
                  visited[nr][nc] = true;
                  queue.push([nr, nc]);
                }
              }
            }

            if (size >= 5) {
              components.push({
                size,
                centerX: (blobSumX / size) * cellW,
                centerY: (blobSumY / size) * cellH
              });
            }
          }
        }
      }

      // Multi-person test: If 2 distinct face-sized blobs separated by at least 35px
      if (components.length >= 2) {
        components.sort((a, b) => b.size - a.size);
        const dist = Math.hypot(components[0].centerX - components[1].centerX, components[0].centerY - components[1].centerY);
        if (dist > 35 && components[1].size >= 5) {
          return { facesCount: 2, lookingAway: false, label: 'Multiple People Detected' };
        }
      }

      // 3. Head Pose & Looking-Away Orientation Analysis:
      const faceWidth = Math.max(1, maxX - minX);
      const faceHeight = Math.max(1, maxY - minY);
      const centroidX = sumX / totalSkinPixels;
      const centroidY = sumY / totalSkinPixels;
      const bboxCenterX = (minX + maxX) / 2;

      // Check horizontal yaw / looking left or right:
      const horizontalAsymmetry = Math.abs(centroidX - bboxCenterX) / faceWidth;
      const aspectRatio = faceWidth / faceHeight;

      // Check vertical pitch / looking down at desk or notes:
      const isLookingDown = centroidY > (0.72 * H) || (maxY >= H - 2 && minY > H * 0.45);
      const isTurnedSideways = horizontalAsymmetry > 0.19 || aspectRatio < 0.46;

      if (isTurnedSideways || isLookingDown) {
        return { facesCount: 1, lookingAway: true, label: 'Candidate Looking Away' };
      }

      return { facesCount: 1, lookingAway: false, label: '1 Face Detected • In Frame (Normal)' };
    } catch (e) {
      return { facesCount: 1, lookingAway: false, label: 'Normal' };
    }
  };

  // Attach stream when video element becomes available in DOM
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraActive, hasStarted]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 320 }, height: { ideal: 240 } },
          audio: false
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        setCameraError(null);
      }
    } catch (err) {
      console.warn('Camera permission denied or device not found:', err);
      setCameraError('Camera access required for proctored mode.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (visionIntervalRef.current) {
      clearInterval(visionIntervalRef.current);
    }
    setIsCameraActive(false);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const handleStartAssessment = async () => {
    if (isCooldownActive) return;

    setHasStarted(true);
    // Request fullscreen and initialize camera stream
    try {
      if (!document.documentElement.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      }
    } catch (err) {
      console.warn('Fullscreen request ignored:', err);
    }
    await startCamera();
  };

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionId) => {
    const qId = assessment?.questions?.[currentQuestionIndex]?.id;
    if (qId) {
      setSelectedAnswers((prev) => ({ ...prev, [qId]: optionId }));
    }
  };

  const handleToggleReview = () => {
    const qId = assessment?.questions?.[currentQuestionIndex]?.id;
    if (qId) {
      setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    stopCamera();
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (e) {}
    }
    try {
      const result = await assessmentApi.submitAssessment(assessment?.id || 'asmt-docker', selectedAnswers);
      navigate(`/assessments/${assessment?.id || 'asmt-docker'}/result`, {
        state: { result }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !assessment) {
    return (
      <div className="max-w-4xl mx-auto py-10">
        <CardSkeleton />
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentQuestionIndex] || questions[0];
  const qId = currentQ?.id;
  const isMarked = Boolean(markedForReview[qId]);
  const isSelected = selectedAnswers[qId];

  // 1. DISQUALIFIED SCREEN
  if (isDisqualified) {
    const formattedCooldown = cooldownUntil ? new Date(cooldownUntil).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : null;

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 font-editorial-mono">
        <div className="rounded-xl border-2 border-rose-600 bg-[var(--card-surface)] p-8 shadow-2xl space-y-6 text-[var(--text-primary)]">
          {/* Header */}
          <div className="flex items-start gap-4 pb-6 border-b border-rose-500/30">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg">
              <Ban className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-rose-600/20 text-rose-600 dark:text-rose-400 text-[10px] font-bold uppercase tracking-widest border border-rose-600/30">
                  Integrity Audit Failure
                </span>
                <span className="text-xs opacity-50">{disqualificationTime}</span>
              </div>
              <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase tracking-tight text-rose-600 dark:text-rose-400 mt-1">
                Candidate Disqualified
              </h1>
              <p className="text-xs opacity-70 mt-0.5">
                Session was automatically terminated due to a proctored examination policy violation.
              </p>
            </div>
          </div>

          {/* Violation Details */}
          <div className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
              Logged Integrity Infraction:
            </span>
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 leading-relaxed">
              "{disqualificationReason}"
            </p>
          </div>

          {/* Attempt & Cooldown Audit Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg border border-current/15 bg-current/5 space-y-1">
              <span className="opacity-60 text-[10px] uppercase block font-bold">Attempts Consumed</span>
              <div className="text-xl font-bold font-editorial-title">
                {attemptsCount} of {MAX_ATTEMPTS} Max Tries
              </div>
              <p className="text-[11px] opacity-70">
                {MAX_ATTEMPTS - attemptsCount > 0
                  ? `${MAX_ATTEMPTS - attemptsCount} attempt(s) remaining for this competency assessment.`
                  : 'All 3 attempts have been exhausted.'}
              </p>
            </div>

            <div className={`p-4 rounded-lg border space-y-1 ${
              isCooldownActive
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200'
                : 'border-current/15 bg-current/5'
            }`}>
              <span className="opacity-60 text-[10px] uppercase block font-bold">Cooldown Status</span>
              <div className="text-xl font-bold font-editorial-title">
                {isCooldownActive ? '5-Day Lock Active' : 'Eligible for Re-attempt'}
              </div>
              <p className="text-[11px] opacity-80">
                {isCooldownActive
                  ? `Next attempt unlocked on: ${formattedCooldown}`
                  : 'You may prepare and attempt another test or review your skill gaps.'}
              </p>
            </div>
          </div>

          {/* Remediation Next Steps */}
          <div className="p-4 rounded-lg border border-current/15 bg-current/5 space-y-2 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
              Recommended Remediation Steps:
            </h4>
            <ul className="list-disc list-inside space-y-1 opacity-80 text-[11px] leading-relaxed">
              <li>Ensure your webcam is positioned directly at eye level in a well-lit, isolated room.</li>
              <li>Remain strictly within full-screen mode without opening inspector tools or alt-tabbing.</li>
              <li>Study recommended reference materials in the Learning Library before your next attempt.</li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Button
              variant="outline"
              size="md"
              iconLeft={ArrowLeft}
              onClick={() => navigate('/assessments')}
              className="w-full sm:w-auto text-xs"
            >
              Assessments Dashboard
            </Button>
            <Button
              variant="primary"
              size="md"
              iconRight={ArrowRight}
              onClick={() => navigate('/learning')}
              className="w-full sm:w-auto text-xs"
            >
              Review Learning Library
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. ASSESSMENT INTRODUCTION SCREEN
  if (!hasStarted) {
    const formattedCooldown = cooldownUntil ? new Date(cooldownUntil).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) : null;

    return (
      <div className="max-w-3xl mx-auto py-8 space-y-6 font-editorial-mono">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 mb-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>

        <Card className="p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-current/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
                  PROCTORED SKILL VERIFICATION
                </span>
              </div>
              <h1 className="font-editorial-title text-2xl sm:text-3xl font-bold uppercase leading-tight">
                {assessment.title}
              </h1>
              <p className="text-xs opacity-75 mt-1 font-sans leading-relaxed">
                {assessment.description || 'Evaluate your practical and architectural competency to earn a verified credential badge.'}
              </p>
            </div>

            <div className="shrink-0 p-3 rounded border border-current/20 bg-current/5 text-center">
              <span className="text-[9px] uppercase opacity-50 block">Passing Benchmark</span>
              <span className="font-editorial-title text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {assessment.passingScore || assessment.passScore || 75}% PASS
              </span>
            </div>
          </div>

          {/* Cooldown Lock Alert Banner if 3 attempts reached */}
          {isCooldownActive && (
            <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-200 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 text-[11px]">
                <Ban className="h-4 w-4" /> 5-Day Re-assessment Cooldown Active
              </div>
              <p className="leading-relaxed opacity-90 text-[11px]">
                You have reached the maximum limit of <strong>3 attempts</strong> for this test. To maintain testing validity and ensure genuine learning, this assessment is locked for 5 days until <strong>{formattedCooldown}</strong>.
              </p>
              <div className="pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/learning')}
                  className="text-[10px]"
                >
                  Explore Recommended Preparation Courses
                </Button>
              </div>
            </div>
          )}

          {/* Assessment Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded border border-current/10 bg-[var(--bg-page)]">
              <span className="opacity-50 text-[9px] uppercase block">Skill</span>
              <span className="font-bold">{assessment.skillName || assessment.skillId}</span>
            </div>
            <div className="p-3 rounded border border-current/10 bg-[var(--bg-page)]">
              <span className="opacity-50 text-[9px] uppercase block">Difficulty</span>
              <span className="font-bold">{assessment.difficulty || 'Intermediate'}</span>
            </div>
            <div className="p-3 rounded border border-current/10 bg-[var(--bg-page)]">
              <span className="opacity-50 text-[9px] uppercase block">Questions</span>
              <span className="font-bold">{questions.length} Items</span>
            </div>
            <div className="p-3 rounded border border-current/10 bg-[var(--bg-page)]">
              <span className="opacity-50 text-[9px] uppercase block">Duration</span>
              <span className="font-bold">{assessment.durationMinutes || 15} Mins</span>
            </div>
            <div className="p-3 rounded border border-current/10 bg-[var(--bg-page)]">
              <span className="opacity-50 text-[9px] uppercase block">Attempts Used</span>
              <span className={`font-bold ${attemptsCount >= 2 ? 'text-amber-500' : ''}`}>
                {attemptsCount} / {MAX_ATTEMPTS}
              </span>
            </div>
          </div>

          {/* Competencies Evaluated */}
          {assessment.competencyFocus && (
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 block">
                Key Competencies Tested
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                {assessment.competencyFocus.map((c) => (
                  <div key={c} className="flex items-center gap-2 p-2 rounded bg-current/5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Proctored Integrity Notice */}
          <div className="p-4 rounded border border-amber-500/30 bg-amber-500/5 text-xs font-sans space-y-2">
            <div className="flex items-center gap-2 font-editorial-mono text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <Eye className="h-4 w-4" /> Strict Examination Integrity Protocols
            </div>
            <ul className="space-y-1.5 list-disc list-inside opacity-85 text-xs">
              <li><strong className="font-semibold">Automatic Fullscreen:</strong> Exiting fullscreen mode triggers immediate disqualification.</li>
              <li><strong className="font-semibold">Tab Switch Limit:</strong> A maximum of 2 tab switches are tolerated. Switching tabs a 3rd time disqualifies the participant.</li>
              <li><strong className="font-semibold">AI Camera Proctoring:</strong> The camera stream continuously checks for single-person presence. Looking away or leaving the frame for &gt;4s or having &gt;1 person in frame will disqualify the session.</li>
              <li><strong className="font-semibold">Attempt Policy:</strong> Maximum 3 attempts per test. Once 3 attempts are consumed, a mandatory 5-day cooldown is enforced.</li>
            </ul>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="primary"
              size="lg"
              iconRight={Play}
              disabled={isCooldownActive}
              onClick={handleStartAssessment}
              className={`w-full sm:w-auto text-xs px-6 py-2.5 ${
                isCooldownActive ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isCooldownActive ? 'Assessment Locked (Cooldown Active)' : 'Enter Fullscreen & Start Proctored Exam'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // 2. ACTIVE PROCTORED ASSESSMENT SCREEN
  return (
    <div className="min-h-screen bg-inherit -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8 flex flex-col font-sans">
      {/* Fullscreen Warning Alert */}
      {!isFullscreen && hasStarted && (
        <div className="mb-4 flex items-center justify-between p-3.5 rounded border border-amber-500/50 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-xs font-editorial-mono animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            <span>
              <strong>Integrity Alert:</strong> Fullscreen mode was exited. Tab switches recorded: {tabSwitchCount}.
            </span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleFullscreen}
            className="text-[10px] py-1 px-2.5"
          >
            Re-enter Fullscreen
          </Button>
        </div>
      )}

      {/* Top Assessment Control Bar */}
      <div className="sticky top-0 z-30 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-4 shadow-sm font-editorial-mono">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-current/25 bg-current/10 text-[var(--accent-terracotta)] font-bold">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial-title text-base font-bold uppercase">{assessment.title}</h1>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                PROCTORED
              </span>
            </div>
            <p className="text-xs opacity-60">
              Question <span className="font-bold">{currentQuestionIndex + 1}</span> of{' '}
              <span className="font-bold">{questions.length}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
          {/* Fullscreen Toggle Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-current/20 hover:bg-current/10 text-xs font-editorial-mono"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>

          {/* Timer Display */}
          <div
            className={`flex items-center gap-2 rounded px-3 py-1.5 font-editorial-mono text-sm font-bold border ${
              secondsRemaining < 180
                ? 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 animate-pulse'
                : 'border-current/20 bg-[var(--bg-page)]'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>{formatTimer(secondsRemaining)}</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            loading={submitting}
            className="text-xs font-editorial-mono"
          >
            Finish & Submit
          </Button>
        </div>
      </div>

      {/* Main Assessment Testing Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Left: Question Area & Answer Options */}
        <div className="lg:col-span-8 flex flex-col justify-between rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 sm:p-8 shadow-2xs">
          <div>
            {/* Question Header & Review Flag */}
            <div className="flex items-center justify-between pb-4 border-b border-current/10 mb-6 font-editorial-mono">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-terracotta)]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <button
                type="button"
                onClick={handleToggleReview}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs border transition-colors ${
                  isMarked
                    ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-current/20 opacity-70 hover:opacity-100'
                }`}
              >
                <Flag className="h-3 w-3" />
                <span>{isMarked ? 'Marked for Review' : 'Mark for Review'}</span>
              </button>
            </div>

            {/* Prompt */}
            <h2 className="text-base sm:text-lg font-semibold leading-relaxed mb-6 font-editorial-title uppercase text-left">
              {currentQ?.prompt}
            </h2>

            {/* Answer Options */}
            <div className="space-y-3 font-editorial-mono">
              {currentQ?.options?.map((opt) => {
                const checked = isSelected === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex items-center gap-3.5 p-4 rounded border text-xs transition-all cursor-pointer ${
                      checked
                        ? 'border-[var(--accent-terracotta)] bg-current/10 font-bold shadow-2xs'
                        : 'border-current/20 hover:border-current/40 hover:bg-current/5'
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold border transition-colors ${
                        checked
                          ? 'border-[var(--accent-terracotta)] bg-[var(--accent-terracotta)] text-white'
                          : 'border-current/25 bg-[var(--bg-page)]'
                      }`}
                    >
                      {opt.id}
                    </div>
                    <span className="leading-relaxed font-sans">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls: Previous, Next */}
          <div className="mt-8 pt-6 border-t border-current/10 flex items-center justify-between font-editorial-mono">
            <Button
              variant="secondary"
              size="sm"
              iconLeft={ArrowLeft}
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
            >
              Previous
            </Button>

            {currentQuestionIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                iconRight={ArrowRight}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
              >
                Next Question
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleSubmit}
                loading={submitting}
              >
                Submit Assessment
              </Button>
            )}
          </div>
        </div>

        {/* Right: Proctor Camera Feed & Navigator */}
        <div className="lg:col-span-4 space-y-4 font-editorial-mono">
          {/* Proctor Live Camera HUD Card */}
          <div className="rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  LIVE PROCTOR CAMERA HUD
                </span>
              </div>
              <button
                type="button"
                onClick={isCameraActive ? stopCamera : startCamera}
                className="opacity-70 hover:opacity-100 text-[10px] flex items-center gap-1"
                title={isCameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
              >
                {isCameraActive ? <Video className="h-3 w-3 text-emerald-500" /> : <VideoOff className="h-3 w-3 text-rose-500" />}
                <span>{isCameraActive ? 'Live' : 'Paused'}</span>
              </button>
            </div>

            {/* Video Preview Box */}
            <div className="relative aspect-4/3 w-full rounded overflow-hidden border border-current/20 bg-black flex items-center justify-center">
              {isCameraActive ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="text-center p-4 space-y-2 text-zinc-400">
                  <Camera className="h-8 w-8 mx-auto opacity-50" />
                  <p className="text-[10px]">Camera stream paused</p>
                  <Button size="sm" variant="secondary" onClick={startCamera} className="text-[10px] py-1 px-2">
                    Enable Camera
                  </Button>
                </div>
              )}

              {/* HUD Overlay details */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/75 backdrop-blur-xs text-[9px] text-white flex items-center gap-1.5 font-mono">
                <span className={`h-2 w-2 rounded-full ${
                  facesDetected === 1 && lookingAwaySeconds === 0
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-rose-500 animate-ping'
                }`} />
                <span className={facesDetected === 1 && lookingAwaySeconds === 0 ? 'text-emerald-300' : 'text-rose-300 font-bold'}>
                  {proctorStatus}
                </span>
              </div>
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] text-zinc-300 font-mono">
                VISION: {facesDetected} FACE(S)
              </div>
            </div>

            {/* Candidate Integrity Stats */}
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded bg-current/5 border border-current/10">
                <span className="opacity-50 uppercase block">Screen Mode</span>
                <span className={`font-bold ${isFullscreen ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                  {isFullscreen ? 'Full Screen (Mandatory)' : 'Windowed (Violation)'}
                </span>
              </div>
              <div className="p-2 rounded bg-current/5 border border-current/10">
                <span className="opacity-50 uppercase block">Tab Switches</span>
                <span className={`font-bold ${tabSwitchCount === 0 ? 'text-emerald-600 dark:text-emerald-400' : tabSwitchCount === 1 ? 'text-amber-500' : 'text-rose-500'}`}>
                  {tabSwitchCount} / 2 Used {tabSwitchCount >= 2 ? '(Next = Disqualify)' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="rounded-md border border-[var(--border-line)] bg-[var(--card-surface)] p-6 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-1">Question Navigator</h3>
            <p className="text-[10px] opacity-60 mb-4 font-sans">Click any question number to navigate directly.</p>

            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const answered = Boolean(selectedAnswers[q.id]);
                const marked = Boolean(markedForReview[q.id]);
                const isCurrent = idx === currentQuestionIndex;

                let btnStyles = 'border-current/20 bg-current/5 opacity-70 hover:opacity-100';
                if (answered) {
                  btnStyles = 'border-emerald-600/40 bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold';
                }
                if (marked) {
                  btnStyles = 'border-amber-400 bg-amber-400/20 text-amber-700 dark:text-amber-300 font-bold';
                }
                if (isCurrent) {
                  btnStyles += ' ring-2 ring-[var(--accent-terracotta)]';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded border text-xs font-semibold flex items-center justify-center transition-all ${btnStyles}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-current/10 space-y-2 text-[10px] opacity-70">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded bg-emerald-500" />
                <span>Answered ({Object.keys(selectedAnswers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded bg-amber-400" />
                <span>Marked for review ({Object.values(markedForReview).filter(Boolean).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded bg-current/20" />
                <span>Unanswered ({questions.length - Object.keys(selectedAnswers).length})</span>
              </div>
            </div>
          </div>

          {/* Integrity Note */}
          <div className="p-4 rounded border border-current/15 bg-current/5 text-[11px] opacity-60 flex items-start gap-2.5 font-sans">
            <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-[var(--accent-terracotta)]" />
            <p>
              Proctored evaluation environment. Passing this session promotes your skill to 🟢 Verified on your profile passport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
