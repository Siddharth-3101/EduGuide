import { MOCK_ROLES } from '../../data/mock/roles';
import { MOCK_SKILLS } from '../../data/mock/skills';
import { BACKEND_DEVELOPER_ROADMAP } from '../../data/mock/horizontalRoadmapData';

// Mock graph nodes & edges data for interactive competency tree
const roleGraphs = {
  'backend-developer': {
    roleTitle: 'Backend Developer',
    coverageStats: {
      coverage: 67,
      verified: 8,
      partial: 3,
      missing: 4
    },
    nodes: [
      // Root Node
      {
        id: 'node-root',
        type: 'roadmapNode',
        position: { x: 380, y: 20 },
        data: {
          label: 'Backend Developer',
          skillId: 'root',
          status: 'target',
          currentLevel: 'Goal',
          requiredLevel: 'L3 / Mid-Senior',
          category: 'Target Role',
          isRoot: true
        }
      },

      // Tier 1: Core Fundamentals
      {
        id: 'node-python',
        type: 'roadmapNode',
        position: { x: 80, y: 150 },
        data: {
          label: 'Python',
          skillId: 'python',
          status: 'verified',
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 89,
          category: 'Core Language'
        }
      },
      {
        id: 'node-sql',
        type: 'roadmapNode',
        position: { x: 380, y: 150 },
        data: {
          label: 'SQL & Relational DBs',
          skillId: 'sql',
          status: 'verified',
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          category: 'Database'
        }
      },
      {
        id: 'node-rest-api',
        type: 'roadmapNode',
        position: { x: 680, y: 150 },
        data: {
          label: 'REST API & HTTP',
          skillId: 'rest-api',
          status: 'verified',
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 94,
          category: 'Architecture'
        }
      },

      // Tier 2: Frameworks & Deep Competencies
      {
        id: 'node-fastapi',
        type: 'roadmapNode',
        position: { x: 20, y: 300 },
        data: {
          label: 'FastAPI / Async',
          skillId: 'fastapi',
          status: 'verified',
          currentLevel: 'Intermediate',
          requiredLevel: 'Intermediate',
          score: 85,
          category: 'Framework'
        }
      },
      {
        id: 'node-testing',
        type: 'roadmapNode',
        position: { x: 190, y: 300 },
        data: {
          label: 'Automated Testing',
          skillId: 'testing',
          status: 'verified',
          currentLevel: 'Intermediate',
          requiredLevel: 'Intermediate',
          score: 82,
          category: 'Reliability'
        }
      },
      {
        id: 'node-postgresql',
        type: 'roadmapNode',
        position: { x: 380, y: 300 },
        data: {
          label: 'PostgreSQL Internals',
          skillId: 'postgresql',
          status: 'partial',
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          category: 'Database'
        }
      },
      {
        id: 'node-auth',
        type: 'roadmapNode',
        position: { x: 570, y: 300 },
        data: {
          label: 'Auth & OAuth2',
          skillId: 'auth',
          status: 'partial',
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          category: 'Security'
        }
      },
      {
        id: 'node-microservices',
        type: 'roadmapNode',
        position: { x: 760, y: 300 },
        data: {
          label: 'Microservices & Queues',
          skillId: 'microservices',
          status: 'partial',
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          category: 'Architecture'
        }
      },

      // Tier 3: Critical Gaps (Recommended Next)
      {
        id: 'node-docker',
        type: 'roadmapNode',
        position: { x: 280, y: 450 },
        data: {
          label: 'Docker & Containers',
          skillId: 'docker',
          status: 'recommended-next', // 🔵 Recommended Next
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          category: 'Containers & DevOps',
          isRecommendedNext: true
        }
      },
      {
        id: 'node-spring-boot',
        type: 'roadmapNode',
        position: { x: 490, y: 450 },
        data: {
          label: 'Spring Boot',
          skillId: 'spring-boot',
          status: 'missing', // 🔴 Not Verified
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          category: 'Framework'
        }
      },

      // Tier 4: Cloud & Deployment
      {
        id: 'node-aws',
        type: 'roadmapNode',
        position: { x: 280, y: 600 },
        data: {
          label: 'AWS Cloud Architecture',
          skillId: 'aws',
          status: 'missing', // 🔴 Not Verified
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          category: 'Cloud'
        }
      },
      {
        id: 'node-cicd',
        type: 'roadmapNode',
        position: { x: 490, y: 600 },
        data: {
          label: 'CI/CD Pipelines',
          skillId: 'cicd',
          status: 'partial',
          currentLevel: 'Beginner',
          requiredLevel: 'Intermediate',
          category: 'DevOps'
        }
      }
    ],
    edges: [
      { id: 'e-root-py', source: 'node-root', target: 'node-python', animated: false },
      { id: 'e-root-sql', source: 'node-root', target: 'node-sql', animated: false },
      { id: 'e-root-api', source: 'node-root', target: 'node-rest-api', animated: false },

      { id: 'e-py-fastapi', source: 'node-python', target: 'node-fastapi' },
      { id: 'e-py-test', source: 'node-python', target: 'node-testing' },
      { id: 'e-sql-pg', source: 'node-sql', target: 'node-postgresql' },
      { id: 'e-api-auth', source: 'node-rest-api', target: 'node-auth' },
      { id: 'e-api-ms', source: 'node-rest-api', target: 'node-microservices' },

      { id: 'e-fastapi-docker', source: 'node-fastapi', target: 'node-docker', animated: true },
      { id: 'e-pg-docker', source: 'node-postgresql', target: 'node-docker', animated: true },
      { id: 'e-ms-spring', source: 'node-microservices', target: 'node-spring-boot' },

      { id: 'e-docker-aws', source: 'node-docker', target: 'node-aws', animated: true },
      { id: 'e-docker-cicd', source: 'node-docker', target: 'node-cicd' }
    ]
  }
};

export const roadmapService = {
  // Fetch interactive horizontal career skill graph
  getRoleGraph: async (roleId = 'backend-developer') => {
    await new Promise((r) => setTimeout(r, 120));
    if (roleId === 'backend-developer') {
      return BACKEND_DEVELOPER_ROADMAP;
    }
    return roleGraphs[roleId] || BACKEND_DEVELOPER_ROADMAP;
  },

  // Skill Gap Analysis summary and cards with Priority logic
  getSkillGapAnalysis: async (roleId = 'backend-developer') => {
    await new Promise((r) => setTimeout(r, 150));
    return {
      targetRole: 'Backend Developer',
      competencyCoverage: 67,
      verifiedCount: 8,
      partialCount: 3,
      missingCount: 4,
      gapCards: [
        {
          id: 'gap-docker',
          skillId: 'docker',
          skillName: 'Docker & Containers',
          status: 'missing',
          priority: 'High Priority',
          requiredLevel: 'Intermediate',
          currentLevel: 'None',
          importance: 'Critical',
          why: 'Required by 78% of your matched Backend Developer job roles. Resolving this advances overall competency coverage by +9%.',
          actions: [
            { label: 'Learn Fundamentals', route: '/learning?skillId=docker', type: 'learn' },
            { label: 'Take Assessment', route: '/assessments/asm-docker', type: 'assess' },
            { label: 'Build Project', route: '/projects/proj-docker-api', type: 'project' }
          ]
        },
        {
          id: 'gap-aws',
          skillId: 'aws',
          skillName: 'AWS Cloud Services',
          status: 'missing',
          priority: 'High Priority',
          requiredLevel: 'Intermediate',
          currentLevel: 'None',
          importance: 'High',
          why: 'Appears in 65% of job postings at TechNova, FinEdge, and CloudScale. Required for container deployment.',
          actions: [
            { label: 'Learn AWS Architecture', route: '/learning?skillId=aws', type: 'learn' },
            { label: 'Take Assessment', route: '/assessments/asm-docker', type: 'assess' }
          ]
        },
        {
          id: 'gap-spring-boot',
          skillId: 'spring-boot',
          skillName: 'Spring Boot & Java Enterprise',
          status: 'missing',
          priority: 'Medium Priority',
          requiredLevel: 'Intermediate',
          currentLevel: 'None',
          importance: 'Medium',
          why: 'Valuable secondary enterprise stack for fintech and banking backend opportunities.',
          actions: [
            { label: 'View Resources', route: '/learning?skillId=spring-boot', type: 'learn' },
            { label: 'Take Assessment', route: '/assessments', type: 'assess' }
          ]
        },
        {
          id: 'gap-redis',
          skillId: 'redis',
          skillName: 'Redis Caching & Concurrency',
          status: 'partial',
          priority: 'Low Priority',
          requiredLevel: 'Intermediate',
          currentLevel: 'Beginner',
          importance: 'Low',
          why: 'Partial evidence exists from your caching project. Verify to turn into full verified badge.',
          actions: [
            { label: 'Complete Verification', route: '/assessments/asm-docker', type: 'assess' }
          ]
        }
      ]
    };
  },

  // Skill Details Drawer content
  getSkillNodeDetails: async (skillId) => {
    await new Promise((r) => setTimeout(r, 100));

    const detailsMap = {
      docker: {
        id: 'docker',
        name: 'Docker & Containerization',
        category: 'DevOps & Containers',
        status: 'missing',
        whyItMatters: 'Required by 78% of active Backend Developer job postings. Employers require containerization for deterministic CI/CD and deployment parity.',
        currentLevel: 'None',
        requiredLevel: 'Intermediate',
        gapSummary: 'Required: Intermediate · Current: None',
        coverageImpact: '+9% to Competency Benchmark',
        recommendedActions: [
          {
            title: 'Learn Docker Fundamentals',
            desc: '5-hour interactive course on container lifecycle, multi-stage builds, and non-root security.',
            route: '/learning?skillId=docker',
            actionText: 'Start Learning'
          },
          {
            title: 'Complete Docker Assessment',
            desc: '15-question standardized technical test evaluating CLI, Dockerfiles, and compose networks.',
            route: '/assessments/asm-docker',
            actionText: 'Take Assessment'
          },
          {
            title: 'Build Containerized API Project',
            desc: 'Create production-grade FastAPI with PostgreSQL and submit GitHub repository for automated analysis.',
            route: '/projects/proj-docker-api',
            actionText: 'View Project Spec'
          }
        ]
      },
      python: {
        id: 'python',
        name: 'Python Programming',
        category: 'Core Language',
        status: 'verified',
        whyItMatters: 'Foundational language for your target role. Demonstrates mastery of memory management, typing, and concurrency.',
        currentLevel: 'Advanced',
        requiredLevel: 'Advanced',
        gapSummary: 'Fully Met (89% score on standardized test)',
        coverageImpact: 'Verified Competency Added to Passport',
        recommendedActions: [
          {
            title: 'View Verified Evidence',
            desc: 'Assessment token and verified code repositories on public Skill Passport.',
            route: '/portfolio',
            actionText: 'View Passport'
          }
        ]
      },
      sql: {
        id: 'sql',
        name: 'SQL & Relational Databases',
        category: 'Database Architecture',
        status: 'verified',
        whyItMatters: 'Essential for high-scale backend persistence, ACID transactions, and query optimization.',
        currentLevel: 'Advanced',
        requiredLevel: 'Advanced',
        gapSummary: 'Fully Met (92% score on standardized test)',
        coverageImpact: 'Verified Competency Added to Passport',
        recommendedActions: [
          {
            title: 'Practice Advanced Queries',
            desc: 'Review interview questions on MVCC and transaction isolation.',
            route: '/interviews/int-backend-dev',
            actionText: 'Practice Questions'
          }
        ]
      },
      'rest-api': {
        id: 'rest-api',
        name: 'REST API & HTTP Architecture',
        category: 'API Design',
        status: 'verified',
        whyItMatters: 'Required by 95% of web service and backend opportunities.',
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
        gapSummary: 'Met at Intermediate (94% score)',
        coverageImpact: 'Verified Competency',
        recommendedActions: [
          {
            title: 'Practice System Design Scenarios',
            desc: 'Idempotency, rate limiting, and REST API interview questions.',
            route: '/interviews/int-backend-dev',
            actionText: 'Practice Scenarios'
          }
        ]
      },
      aws: {
        id: 'aws',
        name: 'AWS Cloud Services',
        category: 'Cloud Infrastructure',
        status: 'missing',
        whyItMatters: 'Required by 65% of selected jobs for production deployment on ECS and RDS.',
        currentLevel: 'None',
        requiredLevel: 'Intermediate',
        gapSummary: 'Required: Intermediate · Current: None',
        coverageImpact: '+8% to Competency Benchmark',
        recommendedActions: [
          {
            title: 'Learn AWS Core Services',
            desc: 'EC2, ECS, IAM, and VPC fundamentals for developers.',
            route: '/learning?skillId=aws',
            actionText: 'View Materials'
          },
          {
            title: 'Verify via Cloud Assessment',
            desc: 'Benchmark your cloud architecture knowledge.',
            route: '/assessments',
            actionText: 'Browse Assessments'
          }
        ]
      }
    };

    return (
      detailsMap[skillId] || {
        id: skillId,
        name: skillId.toUpperCase(),
        category: 'Technical Competency',
        status: 'partial',
        whyItMatters: 'Required by your target career roadmap benchmark.',
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        gapSummary: 'Required: Intermediate · Current: Beginner',
        coverageImpact: '+5% to Competency Benchmark',
        recommendedActions: [
          {
            title: 'Review Reference Materials',
            desc: 'Targeted tutorials and documentation.',
            route: `/learning?skillId=${skillId}`,
            actionText: 'Explore Resources'
          },
          {
            title: 'Take Verification Assessment',
            desc: 'Demonstrate competency under timed constraints.',
            route: '/assessments',
            actionText: 'Start Assessment'
          }
        ]
      }
    );
  }
};
