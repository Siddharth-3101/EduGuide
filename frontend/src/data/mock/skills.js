export const SKILL_CATEGORIES = [
  'All',
  'Programming',
  'Backend',
  'Frontend',
  'Database',
  'Cloud',
  'DevOps',
  'Data',
  'AI/ML',
  'Cybersecurity'
];

export const MOCK_SKILLS = [
  {
    id: 'python',
    name: 'Python',
    category: 'Programming',
    level: 'Advanced',
    status: 'verified',
    score: 89,
    evidenceCount: 3,
    evidenceList: [
      { id: 'ev-1', type: 'Assessment', name: 'Python Core & Concurrency Assessment', verifiedAt: '2026-02-14', score: '91%' },
      { id: 'ev-2', type: 'Project', name: 'High-Throughput Web Scraper & Parser', verifiedAt: '2026-01-20', score: 'Verified' },
      { id: 'ev-3', type: 'Certificate', name: 'University Python Data Structures Honors', verifiedAt: '2025-11-12', score: 'Verified' }
    ],
    breakdown: [
      { area: 'Fundamentals & Syntax', score: 92 },
      { area: 'Problem Solving & Algorithms', score: 86 },
      { area: 'Practical / System Integration', score: 89 }
    ],
    description: 'Python syntax, OOP, generators, decorators, asynchronous I/O (asyncio), and clean code idioms.',
    relatedRoles: ['Backend Developer', 'Data Scientist', 'Software Engineer'],
    recommendedNextStep: 'Build a containerized microservice to apply asynchronous workers in Docker.',
    relatedProjectIds: ['proj-1', 'proj-2'],
    relatedAssessmentId: 'asm-python'
  },
  {
    id: 'sql',
    name: 'SQL & Relational Databases',
    category: 'Database',
    level: 'Intermediate',
    status: 'verified',
    score: 85,
    evidenceCount: 2,
    evidenceList: [
      { id: 'ev-4', type: 'Assessment', name: 'SQL Query Optimization & Normalization', verifiedAt: '2026-02-18', score: '85%' },
      { id: 'ev-5', type: 'Project', name: 'E-Commerce Relational Schema Migration', verifiedAt: '2026-01-05', score: 'Verified' }
    ],
    breakdown: [
      { area: 'Fundamentals & DDL/DML', score: 94 },
      { area: 'Complex Joins & Subqueries', score: 88 },
      { area: 'Indexing & Query Plans', score: 74 }
    ],
    description: 'PostgreSQL & MySQL querying, indexing strategies, ACID guarantees, transaction isolation, and schema design.',
    relatedRoles: ['Backend Developer', 'Data Analyst', 'Software Engineer'],
    recommendedNextStep: 'Learn connection pooling and read replica failover configurations.',
    relatedProjectIds: ['proj-1'],
    relatedAssessmentId: 'asm-sql'
  },
  {
    id: 'rest-api',
    name: 'REST API Design',
    category: 'Backend',
    level: 'Intermediate',
    status: 'verified',
    score: 94,
    evidenceCount: 2,
    evidenceList: [
      { id: 'ev-6', type: 'Assessment', name: 'RESTful Principles, HTTP Verbs & Status Codes', verifiedAt: '2026-02-22', score: '96%' },
      { id: 'ev-7', type: 'Project', name: 'Public REST Gateway for Telemetry Data', verifiedAt: '2026-02-10', score: 'Verified' }
    ],
    breakdown: [
      { area: 'Protocol & Status Codes', score: 98 },
      { area: 'Authentication (JWT/OAuth)', score: 92 },
      { area: 'Versioning & Idempotency', score: 91 }
    ],
    description: 'Stateless HTTP design, REST constraints, payload pagination, rate limiting, and OpenAPI/Swagger documentation.',
    relatedRoles: ['Backend Developer', 'Software Engineer'],
    recommendedNextStep: 'Integrate automated contract tests using Postman or Newman in a CI pipeline.',
    relatedProjectIds: ['proj-1'],
    relatedAssessmentId: 'asm-rest'
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    category: 'Backend',
    level: 'Beginner',
    status: 'partial',
    score: 54,
    evidenceCount: 1,
    evidenceList: [
      { id: 'ev-8', type: 'Practical Task', name: 'Simple Spring MVC Greeting Controller', verifiedAt: '2026-02-28', score: 'Completed' }
    ],
    breakdown: [
      { area: 'Dependency Injection & Inversion of Control', score: 65 },
      { area: 'Spring Data JPA & Hibernate', score: 50 },
      { area: 'Spring Security Configuration', score: 46 }
    ],
    description: 'Java enterprise microframework for production-grade standalone services, JPA persistence, and security.',
    relatedRoles: ['Backend Developer', 'Enterprise Software Engineer'],
    recommendedNextStep: 'Complete the Spring Data JPA module and verify your competency through the Spring assessment.',
    relatedProjectIds: [],
    relatedAssessmentId: 'asm-spring'
  },
  {
    id: 'redis',
    name: 'Redis & In-Memory Caching',
    category: 'Database',
    level: 'Beginner',
    status: 'partial',
    score: 48,
    evidenceCount: 1,
    evidenceList: [
      { id: 'ev-9', type: 'Practical Task', name: 'Session Token Caching in Redis', verifiedAt: '2026-03-01', score: 'Completed' }
    ],
    breakdown: [
      { area: 'Key-Value Primitives & TTL', score: 62 },
      { area: 'Pub/Sub & Event Streams', score: 42 },
      { area: 'Cache Invalidation Strategies', score: 40 }
    ],
    description: 'In-memory data structures, caching layers, write-through vs write-behind, and message broker streams.',
    relatedRoles: ['Backend Developer', 'Cloud Engineer'],
    recommendedNextStep: 'Build a distributed rate-limiting middleware using Redis token buckets.',
    relatedProjectIds: ['proj-2'],
    relatedAssessmentId: null
  },
  {
    id: 'docker',
    name: 'Docker & Containers',
    category: 'DevOps',
    level: 'Intermediate',
    status: 'missing',
    score: 0,
    evidenceCount: 0,
    evidenceList: [],
    breakdown: [
      { area: 'Dockerfiles & Image Layering', score: 0 },
      { area: 'Docker Compose & Multi-Container Networking', score: 0 },
      { area: 'Volumes, Storage & Security Primitives', score: 0 }
    ],
    description: 'Containerizing applications, multi-stage builds, container isolation, volume mounting, and docker-compose stacks.',
    relatedRoles: ['Backend Developer', 'Cloud Engineer', 'DevOps Engineer'],
    recommendedNextStep: 'Take the Docker Fundamentals Assessment to verify your basic knowledge, then containerize your REST API.',
    relatedProjectIds: ['proj-1'],
    relatedAssessmentId: 'asm-docker'
  },
  {
    id: 'aws',
    name: 'AWS Cloud Primitives',
    category: 'Cloud',
    level: 'Beginner',
    status: 'missing',
    score: 0,
    evidenceCount: 0,
    evidenceList: [],
    breakdown: [
      { area: 'EC2, VPC & Security Groups', score: 0 },
      { area: 'S3 Object Storage & IAM Roles', score: 0 },
      { area: 'CloudWatch Logs & Metrics', score: 0 }
    ],
    description: 'Amazon Web Services core services: compute (EC2/ECS), storage (S3), network (VPC), and access control (IAM).',
    relatedRoles: ['Backend Developer', 'Cloud Engineer'],
    recommendedNextStep: 'Complete the AWS Cloud Fundamentals course to understand IAM and VPC configurations.',
    relatedProjectIds: ['proj-4'],
    relatedAssessmentId: 'asm-aws'
  },
  {
    id: 'git',
    name: 'Git & Version Control',
    category: 'DevOps',
    level: 'Intermediate',
    status: 'verified',
    score: 92,
    evidenceCount: 2,
    evidenceList: [
      { id: 'ev-10', type: 'Assessment', name: 'Git Branching, Rebase & Merge Resolution', verifiedAt: '2026-01-10', score: '92%' },
      { id: 'ev-11', type: 'Project', name: 'Multi-Contributor GitHub Repository Flow', verifiedAt: '2026-01-15', score: 'Verified' }
    ],
    breakdown: [
      { area: 'Git CLI & Commit Hygiene', score: 96 },
      { area: 'Branching Strategies & Pull Requests', score: 92 },
      { area: 'Conflict Resolution & Interactive Rebase', score: 88 }
    ],
    description: 'Distributed version control, merge versus rebase, semantic tagging, branch protection, and collaborative workflow.',
    relatedRoles: ['Software Engineer', 'Backend Developer', 'Frontend Developer'],
    recommendedNextStep: 'Set up automated branch protection and GitHub Actions checks in your personal repo.',
    relatedProjectIds: ['proj-1'],
    relatedAssessmentId: null
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend',
    level: 'Intermediate',
    status: 'verified',
    score: 87,
    evidenceCount: 2,
    evidenceList: [
      { id: 'ev-12', type: 'Assessment', name: 'React Hooks & State Management', verifiedAt: '2026-02-10', score: '88%' }
    ],
    breakdown: [
      { area: 'Components & Hooks', score: 92 },
      { area: 'State Management & Context', score: 84 },
      { area: 'Performance Optimization & Memoization', score: 85 }
    ],
    description: 'Declarative component architecture, functional hooks, custom hook design, virtual DOM reconciliation, and routing.',
    relatedRoles: ['Frontend Developer', 'Full Stack Developer', 'Software Engineer'],
    recommendedNextStep: 'Experiment with server-side rendering or static generation using Next.js.',
    relatedProjectIds: [],
    relatedAssessmentId: null
  },
  {
    id: 'ci-cd',
    name: 'CI/CD Pipelines (GitHub Actions)',
    category: 'DevOps',
    level: 'Intermediate',
    status: 'missing',
    score: 0,
    evidenceCount: 0,
    evidenceList: [],
    breakdown: [
      { area: 'Workflow Triggers & Jobs', score: 0 },
      { area: 'Automated Testing & Linters', score: 0 },
      { area: 'Secrets & Deployment Targets', score: 0 }
    ],
    description: 'Automating build, test, and release workflows with GitHub Actions YAML workflows and matrix runs.',
    relatedRoles: ['Backend Developer', 'DevOps Engineer'],
    recommendedNextStep: 'Add a GitHub Actions lint and unit-test workflow to your active project.',
    relatedProjectIds: ['proj-1'],
    relatedAssessmentId: null
  }
];
