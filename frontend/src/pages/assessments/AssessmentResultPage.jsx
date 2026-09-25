import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Award,
  FolderGit2,
  RotateCcw,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { MOCK_DEFAULT_RESULT } from '../../data/mock/assessments';

export const AssessmentResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Use passed result from test submission or default mock result for direct link
  const result = location.state?.result || MOCK_DEFAULT_RESULT;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6 font-sans">
      {/* Result Hero Header */}
      <div className="text-center py-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4 shadow-xs">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          Evaluation Complete
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Assessment Complete 🎉
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {result.title || 'Docker Fundamentals & Containers'}
        </p>
      </div>

      {/* Main Scorecard Card */}
      <Card className="bg-white border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Verified Performance
            </span>
            <div className="flex items-baseline gap-3 mt-1 justify-center sm:justify-start">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {result.score}%
              </span>
              <span className="text-sm font-semibold text-emerald-600">Passed (Benchmark 70%)</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Evaluated under standardized conditions and recorded to your verified record.
            </p>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <div className="mb-2">
              <Badge variant="verified" className="text-sm px-3 py-1">
                🟢 Skill Verified
              </Badge>
            </div>
            <p className="text-xs text-slate-600 font-medium">
              Competency Level: <strong className="text-slate-900">{result.competencyLevel}</strong>
            </p>
          </div>
        </div>

        {/* Breakdown as specified in prompt: Fundamentals, Application, Problem Solving */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Competency Breakdown</h3>
          <div className="space-y-3.5">
            {result.breakdown?.map((item) => (
              <div key={item.area}>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-700">{item.area}</span>
                  <span className="text-slate-900 font-bold">{item.score}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* "What's Next?" section as explicitly required */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-indigo-50/40 to-slate-50 p-6 sm:p-7 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
            What's Next?
          </span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Build a Docker project to strengthen your practical evidence.
        </h3>
        <p className="text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
          Now that your theoretical knowledge is verified, deploy a real multi-service backend with Docker Compose to satisfy employer portfolio requirements.
        </p>

        {/* Required buttons: View Project, View Skill Passport */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="primary"
            icon={FolderGit2}
            iconRight={ArrowRight}
            onClick={() => navigate('/projects/proj-1')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            View Project
          </Button>

          <Button
            variant="secondary"
            icon={Award}
            onClick={() => navigate('/portfolio')}
            className="w-full sm:w-auto bg-white font-semibold"
          >
            View Skill Passport
          </Button>
        </div>
      </div>
    </div>
  );
};
