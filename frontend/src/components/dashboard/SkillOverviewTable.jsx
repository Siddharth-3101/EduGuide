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
    <Card>
      <div className="flex items-center justify-between pb-3 border-b border-current/10">
        <div>
          <h3 className="font-editorial-title text-base font-bold uppercase tracking-tight">Skill Competency Overview</h3>
          <p className="text-xs font-editorial-serif italic opacity-70 mt-0.5">Verification status mapped to your Backend Developer roadmap</p>
        </div>
        <Link
          to="/skills"
          className="text-xs font-editorial-mono font-medium hover:text-[var(--accent-terracotta)] hover:underline flex items-center gap-0.5"
        >
          All Skills <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="mt-3 divide-y divide-current/10">
        {displaySkills.map((skill) => {
          const action = getActionForSkill(skill);
          return (
            <div
              key={skill.id}
              onClick={() => navigate(`/skills/${skill.id}`)}
              className="group flex items-center justify-between py-3 px-1.5 rounded hover:bg-current/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`h-2 w-2 rounded-full ${
                    skill.status === 'verified'
                      ? 'bg-emerald-500'
                      : skill.status === 'partial'
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold uppercase font-editorial-title group-hover:text-[var(--accent-terracotta)] transition-colors">
                      {skill.name}
                    </p>
                    <span className="text-[10px] font-editorial-mono opacity-50">· {skill.level}</span>
                  </div>
                  <p className="text-[11px] opacity-60 line-clamp-1">{skill.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(skill.status)}
                <span className="text-xs font-editorial-mono opacity-50 group-hover:opacity-100 hidden sm:inline-flex items-center gap-0.5">
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
