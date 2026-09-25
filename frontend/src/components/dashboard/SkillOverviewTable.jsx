import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowUpRight } from 'lucide-react';

export const SkillOverviewTable = ({ skills = [] }) => {
  const navigate = useNavigate();

  // Highlight key backend roadmap skills as requested:
  // Python, SQL, REST API, Spring Boot, Docker, AWS
  const priorityOrder = ['python', 'sql', 'rest-api', 'spring-boot', 'docker', 'aws'];
  
  const displaySkills = skills
    .slice()
    .sort((a, b) => {
      const idxA = priorityOrder.indexOf(a.id);
      const idxB = priorityOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    })
    .slice(0, 6);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return <Badge variant="verified">Verified</Badge>;
      case 'partial':
        return <Badge variant="partial">Partial</Badge>;
      case 'missing':
        return <Badge variant="missing">Missing</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getActionForSkill = (skill) => {
    if (skill.status === 'verified') {
      return { text: 'View Evidence', route: `/skills/${skill.id}` };
    }
    if (skill.status === 'partial') {
      return { text: 'Practice & Assess', route: `/assessments` };
    }
    return { text: 'Verify Skill', route: `/assessments/${skill.relatedAssessmentId || 'asm-docker'}` };
  };

  return (
    <Card className="bg-white border border-slate-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight">Skill Competency Overview</h3>
          <p className="text-xs text-slate-500 mt-0.5">Verification status mapped to your Backend Developer roadmap</p>
        </div>
        <Link
          to="/skills"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-0.5"
        >
          All Skills <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-3 divide-y divide-slate-100">
        {displaySkills.map((skill) => {
          const action = getActionForSkill(skill);
          return (
            <div
              key={skill.id}
              onClick={() => navigate(`/skills/${skill.id}`)}
              className="group flex items-center justify-between py-3 px-1.5 rounded-lg hover:bg-slate-50/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    skill.status === 'verified'
                      ? 'bg-emerald-500 ring-2 ring-emerald-100'
                      : skill.status === 'partial'
                      ? 'bg-amber-500 ring-2 ring-amber-100'
                      : 'bg-rose-500 ring-2 ring-rose-100'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {skill.name}
                    </p>
                    <span className="text-[11px] text-slate-400">· {skill.level}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{skill.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(skill.status)}
                <span className="text-xs text-slate-400 group-hover:text-slate-700 hidden sm:inline-flex items-center gap-0.5">
                  {action.text} <ArrowUpRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
