import { MOCK_ROLES } from '../../data/mock/roles';
import { MOCK_SKILLS } from '../../data/mock/skills';
import { BACKEND_DEVELOPER_ROADMAP } from '../../data/mock/horizontalRoadmapData';
import { ROLE_ROADMAPS } from '../../data/mock/roleRoadmaps';
import { PATHWAY_ROADMAPS } from '../../data/mock/pathwayRoadmaps';
import { careerApi } from './careerApi';
import { apiClient } from './apiClient';

const ROLE_SPECIFIC_GAPS = {
  'data-analyst': {
    targetRole: 'Data Analyst',
    competencyCoverage: 68,
    verifiedCount: 5,
    partialCount: 2,
    missingCount: 2,
    gapCards: [
      {
        id: 'gap-bi-tools',
        skillId: 'tableau-powerbi',
        skillName: 'Tableau & Power BI Dashboards',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'Beginner',
        importance: 'Critical',
        why: 'Required by 82% of active Data Analyst job listings for executive reporting and KPI tracking.',
        actions: [
          { label: 'Learn Power BI & DAX', route: '/learning?skillId=powerbi', type: 'learn' },
          { label: 'Take Assessment', route: '/assessments', type: 'assess' },
          { label: 'Build Dashboard Project', route: '/projects', type: 'project' }
        ]
      },
      {
        id: 'gap-bigquery',
        skillId: 'bigquery-snowflake',
        skillName: 'BigQuery & Snowflake Warehousing',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'High',
        why: 'Crucial for querying terabyte-scale analytical databases and cloud lakehouses.',
        actions: [
          { label: 'Learn Cloud SQL & Warehouses', route: '/learning?skillId=sql', type: 'learn' },
          { label: 'Take Assessment', route: '/assessments', type: 'assess' }
        ]
      },
      {
        id: 'gap-ab-testing',
        skillId: 'ab-testing',
        skillName: 'A/B Testing & Experimentation',
        status: 'missing',
        priority: 'Medium Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'Medium',
        why: 'Essential for evaluating product features and statistical hypothesis testing in enterprise tech.',
        actions: [
          { label: 'Learn Experimentation Design', route: '/learning?skillId=statistics', type: 'learn' }
        ]
      },
      {
        id: 'gap-sql-verified',
        skillId: 'sql',
        skillName: 'Advanced SQL & Data Extraction',
        status: 'verified',
        priority: 'Verified Competency',
        requiredLevel: 'Advanced',
        currentLevel: 'Advanced',
        importance: 'Critical',
        why: 'Verified via 92% assessment benchmark and complex relational schema analysis.',
        actions: [
          { label: 'View Verified Evidence', route: '/portfolio', type: 'project' }
        ]
      }
    ]
  },
  'ai-engineer': {
    targetRole: 'AI & Machine Learning Engineer',
    competencyCoverage: 58,
    verifiedCount: 4,
    partialCount: 2,
    missingCount: 3,
    gapCards: [
      {
        id: 'gap-pytorch',
        skillId: 'pytorch',
        skillName: 'PyTorch & Deep Neural Networks',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Standard framework for training neural networks, backpropagation, and GPU tensor acceleration.',
        actions: [
          { label: 'Deep Learning with PyTorch', route: '/learning?skillId=pytorch', type: 'learn' },
          { label: 'Take Assessment', route: '/assessments', type: 'assess' }
        ]
      },
      {
        id: 'gap-rag-llm',
        skillId: 'rag-llm',
        skillName: 'RAG, LangChain & Vector Databases',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'Critical',
        why: 'Highest demand competency in Generative AI engineering for building enterprise document assistants.',
        actions: [
          { label: 'Learn RAG & Vector DBs', route: '/learning?skillId=rag', type: 'learn' },
          { label: 'Build Agent Project', route: '/projects', type: 'project' }
        ]
      },
      {
        id: 'gap-mlops',
        skillId: 'mlops',
        skillName: 'MLOps & Model Serving (FastAPI/Docker)',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'High',
        why: 'Production deployment and latency optimization for AI endpoints.',
        actions: [
          { label: 'Explore MLOps Pipelines', route: '/learning?skillId=mlops', type: 'learn' }
        ]
      }
    ]
  },
  'frontend-developer': {
    targetRole: 'Frontend Developer',
    competencyCoverage: 72,
    verifiedCount: 6,
    partialCount: 2,
    missingCount: 2,
    gapCards: [
      {
        id: 'gap-nextjs',
        skillId: 'nextjs',
        skillName: 'Next.js App Router & Server Components',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Required by 80% of modern frontend listings for fast SSR, SEO, and streaming architecture.',
        actions: [
          { label: 'Learn Next.js 15', route: '/learning?skillId=nextjs', type: 'learn' },
          { label: 'Take Assessment', route: '/assessments', type: 'assess' }
        ]
      },
      {
        id: 'gap-web-perf',
        skillId: 'web-perf',
        skillName: 'Web Performance & Core Vitals',
        status: 'partial',
        priority: 'Medium Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'Beginner',
        importance: 'High',
        why: 'Optimizing LCP, INP, and bundle size for enterprise scale web applications.',
        actions: [
          { label: 'Study Core Web Vitals', route: '/learning?skillId=perf', type: 'learn' }
        ]
      }
    ]
  },
  'devops-engineer': {
    targetRole: 'DevOps & Cloud Engineer',
    competencyCoverage: 52,
    verifiedCount: 4,
    partialCount: 2,
    missingCount: 3,
    gapCards: [
      {
        id: 'gap-docker-devops',
        skillId: 'docker',
        skillName: 'Docker & Containerization',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Essential container packaging and multi-stage build optimization.',
        actions: [
          { label: 'Learn Docker Mastery', route: '/learning?skillId=docker', type: 'learn' },
          { label: 'Take Assessment', route: '/assessments/asmt-docker', type: 'assess' }
        ]
      },
      {
        id: 'gap-k8s',
        skillId: 'kubernetes',
        skillName: 'Kubernetes & Helm Orchestration',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'Critical',
        why: 'Managing microservice clusters, auto-scaling, and rolling updates.',
        actions: [
          { label: 'Explore Kubernetes Architecture', route: '/learning?skillId=k8s', type: 'learn' }
        ]
      }
    ]
  },
  'cloud-engineer': {
    targetRole: 'AWS Cloud Engineer',
    competencyCoverage: 48,
    verifiedCount: 4,
    partialCount: 2,
    missingCount: 3,
    gapCards: [
      {
        id: 'gap-aws-iam',
        skillId: 'aws-iam',
        skillName: 'AWS IAM & Core Compute (EC2)',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Cloud security boundaries, role assumption, and auto-scaling architecture.',
        actions: [
          { label: 'Learn AWS Architecture', route: '/learning?skillId=aws', type: 'learn' }
        ]
      },
      {
        id: 'gap-aws-vpc',
        skillId: 'aws-vpc',
        skillName: 'AWS VPC & Cloud Networking',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'Critical',
        why: 'Isolated subnets, NAT gateways, and secure VPC peering.',
        actions: [
          { label: 'Study AWS Networking', route: '/learning?skillId=aws', type: 'learn' }
        ]
      }
    ]
  },
  'cybersecurity-analyst': {
    targetRole: 'Cyber Security Analyst',
    competencyCoverage: 50,
    verifiedCount: 4,
    partialCount: 2,
    missingCount: 3,
    gapCards: [
      {
        id: 'gap-siem',
        skillId: 'siem',
        skillName: 'SIEM & SOC Log Analysis (Splunk)',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Real-time security log correlation and threat detection.',
        actions: [
          { label: 'Study SIEM Tools', route: '/learning?skillId=security', type: 'learn' }
        ]
      },
      {
        id: 'gap-vuln-scan',
        skillId: 'vuln-scan',
        skillName: 'Vulnerability Assessment (Nmap/Nessus)',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'High',
        why: 'System vulnerability scanning and remediation roadmap planning.',
        actions: [
          { label: 'Learn Vulnerability Scanning', route: '/learning?skillId=security', type: 'learn' }
        ]
      }
    ]
  },
  'ios-developer': {
    targetRole: 'iOS Developer',
    competencyCoverage: 52,
    verifiedCount: 4,
    partialCount: 2,
    missingCount: 3,
    gapCards: [
      {
        id: 'gap-swiftui',
        skillId: 'swiftui',
        skillName: 'SwiftUI & Declarative Architecture',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Native Apple UI construction using modern reactive state patterns.',
        actions: [
          { label: 'Learn SwiftUI & State', route: '/learning?skillId=swift', type: 'learn' }
        ]
      },
      {
        id: 'gap-swift-async',
        skillId: 'swift-async',
        skillName: 'Swift Concurrency (async/await)',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'High',
        why: 'Structured concurrency, Actors, and background thread execution.',
        actions: [
          { label: 'Study Swift Concurrency', route: '/learning?skillId=swift', type: 'learn' }
        ]
      }
    ]
  },
  'blockchain-developer': {
    targetRole: 'Blockchain Developer',
    competencyCoverage: 46,
    verifiedCount: 3,
    partialCount: 2,
    missingCount: 4,
    gapCards: [
      {
        id: 'gap-solidity',
        skillId: 'solidity',
        skillName: 'Solidity & EVM Smart Contracts',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Smart contract development, reentrancy guards, and gas optimization.',
        actions: [
          { label: 'Learn Solidity & Foundry', route: '/learning?skillId=blockchain', type: 'learn' }
        ]
      },
      {
        id: 'gap-foundry',
        skillId: 'foundry',
        skillName: 'Foundry & Smart Contract Testing',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'High',
        why: 'Fuzz testing and automated security verification for deployed contracts.',
        actions: [
          { label: 'Study Contract Testing', route: '/learning?skillId=blockchain', type: 'learn' }
        ]
      }
    ]
  }
};

const ROLE_ALIASES = {
  '1': 'ai-engineer',
  '2': 'backend-developer',
  '3': 'frontend-developer',
  '4': 'fullstack-developer',
  '5': 'devops-engineer',
  '6': 'cloud-engineer',
  '7': 'data-analyst',
  '8': 'cybersecurity-analyst',
  '9': 'ios-developer',
  '10': 'blockchain-developer',
  'CAR-AI-ENG': 'ai-engineer',
  'CAR-BACKEND': 'backend-developer',
  'CAR-FRONTEND': 'frontend-developer',
  'CAR-FULLSTACK': 'fullstack-developer',
  'CAR-DEVOPS': 'devops-engineer',
  'CAR-AWS-CLD': 'cloud-engineer',
  'CAR-DATA-ANALYST': 'data-analyst',
  'CAR-CYBERSEC': 'cybersecurity-analyst',
  'CAR-IOS': 'ios-developer',
  'CAR-BLOCKCHAIN': 'blockchain-developer'
};

const resolveRoleId = (roleId) => {
  if (!roleId) return 'backend-developer';
  const str = String(roleId).toLowerCase().trim();
  if (ROLE_ROADMAPS[str]) return str;
  if (ROLE_ALIASES[str]) return ROLE_ALIASES[str];
  if (ROLE_ALIASES[roleId]) return ROLE_ALIASES[roleId];
  const found = MOCK_ROLES.find(r => r.id === str || r.roleId === str || String(r.id) === str || r.careerDomainId === roleId);
  return found?.id || 'backend-developer';
};

const PATHWAY_GAPS = {
  'PATH-BACKEND-PYTHON': {
    targetRole: 'Python / FastAPI Microservices Developer',
    competencyCoverage: 80,
    verifiedCount: 6,
    partialCount: 2,
    missingCount: 1,
    gapCards: [
      {
        id: 'gap-celery',
        skillId: 'celery',
        skillName: 'Celery & Asynchronous Task Queues',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Required for background batch processing, email triggers, and scheduled jobs in FastAPI backends.',
        actions: [
          { label: 'Learn Celery & Redis Workers', route: '/learning?skillId=celery', type: 'learn' },
          { label: 'Take Assessment', route: '/assessments', type: 'assess' }
        ]
      },
      {
        id: 'gap-alembic',
        skillId: 'alembic',
        skillName: 'Alembic Database Migrations',
        status: 'missing',
        priority: 'Medium Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'High',
        why: 'Deterministic version-controlled schema migrations for SQLAlchemy models in production.',
        actions: [
          { label: 'Explore Alembic Migrations', route: '/learning?skillId=sql', type: 'learn' }
        ]
      },
      {
        id: 'gap-fastapi-verified',
        skillId: 'fastapi',
        skillName: 'FastAPI & Pydantic Validation',
        status: 'verified',
        priority: 'Verified Competency',
        requiredLevel: 'Advanced',
        currentLevel: 'Advanced',
        importance: 'Critical',
        why: 'Verified via 92% benchmark assessment and repository code evidence.',
        actions: [
          { label: 'View Verified Credentials', route: '/portfolio', type: 'project' }
        ]
      }
    ]
  },
  'PATH-BACKEND-NODE': {
    targetRole: 'Node.js / TypeScript Systems Developer',
    competencyCoverage: 78,
    verifiedCount: 6,
    partialCount: 2,
    missingCount: 1,
    gapCards: [
      {
        id: 'gap-graphql',
        skillId: 'graphql',
        skillName: 'GraphQL & Apollo Federation',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Declarative data fetching and microservice graph federation across Node services.',
        actions: [
          { label: 'Learn GraphQL Schema Design', route: '/learning?skillId=graphql', type: 'learn' },
          { label: 'Take Assessment', route: '/assessments', type: 'assess' }
        ]
      },
      {
        id: 'gap-bullmq',
        skillId: 'bullmq',
        skillName: 'BullMQ & Redis Job Processing',
        status: 'partial',
        priority: 'Medium Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'Beginner',
        importance: 'High',
        why: 'Enterprise background job scheduling and rate-limited queue processing.',
        actions: [
          { label: 'Explore BullMQ Queues', route: '/learning?skillId=redis', type: 'learn' }
        ]
      },
      {
        id: 'gap-ts-verified',
        skillId: 'typescript',
        skillName: 'TypeScript & Express.js Core',
        status: 'verified',
        priority: 'Verified Competency',
        requiredLevel: 'Advanced',
        currentLevel: 'Advanced',
        importance: 'Critical',
        why: 'Verified via full-stack e-commerce project and 93% benchmark score.',
        actions: [
          { label: 'View Verified Project', route: '/portfolio', type: 'project' }
        ]
      }
    ]
  },
  'PATH-AI-APP': {
    targetRole: 'AI Application Engineer (LLMs & RAG)',
    competencyCoverage: 75,
    verifiedCount: 5,
    partialCount: 2,
    missingCount: 1,
    gapCards: [
      {
        id: 'gap-rag',
        skillId: 'rag',
        skillName: 'Hybrid Retrieval & Context RAG',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Required by 88% of LLM engineer listings for grounding models on private enterprise data.',
        actions: [
          { label: 'Study RAG Architecture', route: '/learning?skillId=rag', type: 'learn' },
          { label: 'Take Assessment', route: '/assessments', type: 'assess' }
        ]
      },
      {
        id: 'gap-ai-agents',
        skillId: 'ai-agents',
        skillName: 'Autonomous Agent Tool Execution',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'High',
        why: 'Enabling LLMs to execute external APIs, SQL queries, and multi-step tool loops.',
        actions: [
          { label: 'Explore Agentic Workflows', route: '/learning?skillId=llm', type: 'learn' }
        ]
      },
      {
        id: 'gap-prompt-verified',
        skillId: 'prompt-engineering',
        skillName: 'Prompt Engineering & JSON Schemas',
        status: 'verified',
        priority: 'Verified Competency',
        requiredLevel: 'Advanced',
        currentLevel: 'Advanced',
        importance: 'Critical',
        why: 'Verified via Ollama and structured JSON extraction pipeline implementations.',
        actions: [
          { label: 'View Evidence', route: '/portfolio', type: 'project' }
        ]
      }
    ]
  },
  'PATH-AI-GENAI': {
    targetRole: 'Generative AI & Agent Architect',
    competencyCoverage: 76,
    verifiedCount: 5,
    partialCount: 2,
    missingCount: 1,
    gapCards: [
      {
        id: 'gap-lora',
        skillId: 'peft-lora',
        skillName: 'Fine-Tuning (PEFT, LoRA & QLoRA)',
        status: 'partial',
        priority: 'High Priority',
        requiredLevel: 'Advanced',
        currentLevel: 'Intermediate',
        importance: 'Critical',
        why: 'Adapting open-source foundational models to specialized domain tasks efficiently.',
        actions: [
          { label: 'Learn LoRA Fine-Tuning', route: '/learning?skillId=llm', type: 'learn' },
          { label: 'Take Assessment', route: '/assessments', type: 'assess' }
        ]
      },
      {
        id: 'gap-guardrails',
        skillId: 'ai-guardrails',
        skillName: 'Safety, Guardrails & Hallucination Checks',
        status: 'missing',
        priority: 'High Priority',
        requiredLevel: 'Intermediate',
        currentLevel: 'None',
        importance: 'High',
        why: 'Critical for enterprise compliance, preventing prompt injections, and verifying factuality.',
        actions: [
          { label: 'Learn LLM Guardrails', route: '/learning?skillId=security', type: 'learn' }
        ]
      }
    ]
  }
};

export const roadmapService = {
  // Fetch interactive horizontal career skill graph
  getRoleGraph: async (rawRoleId = 'backend-developer', pathwayId = null) => {
    // 1. If explicit pathwayId is provided and exists in PATHWAY_ROADMAPS, use it
    if (pathwayId && PATHWAY_ROADMAPS[pathwayId]) {
      return JSON.parse(JSON.stringify(PATHWAY_ROADMAPS[pathwayId]));
    }

    const roleId = resolveRoleId(rawRoleId);
    const roleObj = MOCK_ROLES.find(r => r.id === roleId || r.roleId === roleId || r.careerDomainId === roleId) || MOCK_ROLES[0];
    const roleTitle = roleObj.title;

    // 2. Check if role has default pathway in PATHWAY_ROADMAPS
    if (roleId === 'backend-developer' && PATHWAY_ROADMAPS['PATH-BACKEND-JAVA']) {
      return JSON.parse(JSON.stringify(PATHWAY_ROADMAPS['PATH-BACKEND-JAVA']));
    }
    if (roleId === 'ai-engineer' && PATHWAY_ROADMAPS['PATH-AI-APP']) {
      return JSON.parse(JSON.stringify(PATHWAY_ROADMAPS['PATH-AI-APP']));
    }

    // 3. If pre-configured roadmap exists in ROLE_ROADMAPS, use it
    if (ROLE_ROADMAPS[roleId]) {
      const graph = JSON.parse(JSON.stringify(ROLE_ROADMAPS[roleId]));
      graph.roleTitle = roleTitle;
      return graph;
    }

    // 4. Otherwise clone backend roadmap with customized title
    const defaultGraph = JSON.parse(JSON.stringify(BACKEND_DEVELOPER_ROADMAP));
    defaultGraph.roleId = roleId;
    defaultGraph.roleTitle = roleTitle;
    return defaultGraph;
  },

  // Skill Gap Analysis summary and cards with Priority logic
  getSkillGapAnalysis: async (rawRoleId = 'backend-developer', pathwayId = null) => {
    if (pathwayId && PATHWAY_GAPS[pathwayId]) {
      return PATHWAY_GAPS[pathwayId];
    }

    const roleId = resolveRoleId(rawRoleId);
    // Check if we have role-specific gap definitions
    if (ROLE_SPECIFIC_GAPS[roleId]) {
      return ROLE_SPECIFIC_GAPS[roleId];
    }

    try {
      const response = await apiClient.get('/api/readiness', { timeout: 1500 });
      const data = response.data?.data || response.data;
      if (data && data.skillGaps && data.skillGaps.length > 0) {
        return {
          targetRole: data.targetRoleTitle || 'Backend Developer',
          competencyCoverage: data.competencyCoveragePercentage || 84,
          verifiedCount: data.verifiedSkills ? data.verifiedSkills.length : 8,
          partialCount: data.partialSkills ? data.partialSkills.length : 3,
          missingCount: data.missingSkills ? data.missingSkills.length : 4,
          gapCards: data.skillGaps.map(g => ({
            id: 'gap-' + g.skillId,
            skillId: g.skillId,
            skillName: g.skillName,
            status: g.currentStatus ? g.currentStatus.toLowerCase() : 'missing',
            priority: (g.gapPriority || 'HIGH') + ' Priority',
            requiredLevel: g.requiredLevel || 'Intermediate',
            currentLevel: g.currentStatus === 'EVIDENCE_BACKED' || g.currentStatus === 'PARTIAL' ? 'Intermediate' : 'None',
            importance: g.importanceWeight >= 1.0 ? 'Critical' : 'High',
            why: g.recommendationReason || `Identified competency gap for ${data.targetRoleTitle}.`,
            actions: [
              { label: 'Learn Fundamentals', route: `/learning?skillId=${g.skillId}`, type: 'learn' },
              { label: 'Take Assessment', route: `/assessments`, type: 'assess' }
            ]
          }))
        };
      }
    } catch (e) {}

    const roleObj = MOCK_ROLES.find(r => r.id === roleId || r.careerDomainId === roleId) || MOCK_ROLES[0];
    const roleTitle = roleObj.title;

    await new Promise((r) => setTimeout(r, 100));
    return {
      targetRole: roleTitle,
      competencyCoverage: roleId === 'backend-developer' ? 84 : 70,
      verifiedCount: 8,
      partialCount: 3,
      missingCount: 3,
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
          why: `Required by 78% of active ${roleTitle} job opportunities. Resolving this advances overall competency coverage by +9%.`,
          actions: [
            { label: 'Learn Fundamentals', route: '/learning?skillId=docker', type: 'learn' },
            { label: 'Take Assessment', route: '/assessments/asmt-docker', type: 'assess' },
            { label: 'Build Project', route: '/projects/proj-1', type: 'project' }
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
          why: `Essential for cloud deployment in ${roleTitle} roles at TechNova, Amazon, and CloudScale.`,
          actions: [
            { label: 'Learn AWS Architecture', route: '/learning?skillId=aws', type: 'learn' },
            { label: 'Take Assessment', route: '/assessments/asmt-docker', type: 'assess' }
          ]
        },
        {
          id: 'gap-spring-boot',
          skillId: 'spring-boot',
          skillName: 'Spring Boot & Microservices',
          status: 'verified',
          priority: 'Verified Competency',
          requiredLevel: 'Advanced',
          currentLevel: 'Advanced',
          importance: 'High',
          why: 'Verified from AgriSmart project repository code evidence and Spring Boot assessment pass.',
          actions: [
            { label: 'View Verified Evidence', route: '/portfolio', type: 'project' }
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
