export const MOCK_COURSES = [
  // PYTHON CORE & CONCURRENCY (SKL-0012)
  {
    id: 'res-python-1',
    title: 'Python Internals, CPython GIL & Asyncio Masterclass',
    provider: 'Real Python / Python Software Foundation',
    type: 'Course',
    duration: '6 hours',
    difficulty: 'Intermediate',
    price: 'Free Reference',
    isFree: true,
    rating: 4.9,
    skillId: 'python',
    canonicalId: 'SKL-0012',
    skillName: 'Python',
    targetRole: 'Backend Developer',
    externalUrl: 'https://docs.python.org/3/library/asyncio.html',
    assessmentId: 'asmt-python',
    whyRecommended: 'Core backend requirement for 95% of software engineering roles; reinforces concurrency & memory models.',
    competenciesCovered: [
      'CPython GIL & reference counting garbage collection',
      'Asyncio coroutines & task scheduling event loop',
      'Generator functions & lazy memory evaluation',
      'Context managers & class decorators'
    ]
  },
  {
    id: 'res-python-2',
    title: 'Effective Python: 90 Specific Ways to Write Better Python',
    provider: 'Python Guild / Brett Slatkin',
    type: 'Documentation',
    duration: 'Self-paced',
    difficulty: 'Advanced',
    price: 'Free',
    isFree: true,
    rating: 4.9,
    skillId: 'python',
    canonicalId: 'SKL-0012',
    skillName: 'Python',
    targetRole: 'Backend Developer',
    externalUrl: 'https://effectivepython.com/',
    assessmentId: 'asmt-python',
    whyRecommended: 'Industry-standard guidelines for idiomatic Python 3 concurrency and clean software architecture.',
    competenciesCovered: [
      'Metaclasses and attributes',
      'Concurrency with multiprocessing vs asyncio',
      'Profiling and memory optimization',
      'Robust error handling & typing'
    ]
  },

  // SQL & POSTGRESQL (SKL-0047)
  {
    id: 'res-sql-1',
    title: 'PostgreSQL Internals: B-Tree Indexing & Query Optimization',
    provider: 'PostgreSQL Official Documentation',
    type: 'Documentation',
    duration: '4 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    isFree: true,
    rating: 4.9,
    skillId: 'sql',
    canonicalId: 'SKL-0047',
    skillName: 'SQL',
    targetRole: 'Backend Developer',
    externalUrl: 'https://www.postgresql.org/docs/current/using-explain.html',
    assessmentId: 'asmt-sql',
    whyRecommended: 'Essential for passing backend database rounds and diagnosing production transaction deadlocks.',
    competenciesCovered: [
      'EXPLAIN ANALYZE cost calculations',
      'Composite B-Tree leftmost prefix rule',
      'MVCC transaction isolation (Read Committed vs Repeatable Read)',
      'Partial & covering indexes'
    ]
  },
  {
    id: 'res-sql-2',
    title: 'Advanced SQL Window Functions & Relational Modeling',
    provider: 'Database Masterclass',
    type: 'Course',
    duration: '5 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    isFree: true,
    rating: 4.8,
    skillId: 'sql',
    canonicalId: 'SKL-0047',
    skillName: 'SQL',
    targetRole: 'Backend Developer',
    externalUrl: 'https://mode.com/sql-tutorial/',
    assessmentId: 'asmt-sql',
    whyRecommended: 'Covers complex analytic queries frequently tested in top-tier tech screening rounds.',
    competenciesCovered: [
      'DENSE_RANK(), ROW_NUMBER() and LAG/LEAD functions',
      'Common Table Expressions (CTEs) and recursive queries',
      'Locking semantics: SELECT FOR UPDATE and SKIP LOCKED'
    ]
  },

  // REST API & HTTP (SKL-0041)
  {
    id: 'res-rest-1',
    title: 'RESTful API Architecture & RFC 9110 HTTP Standards',
    provider: 'MDN Web Docs / IETF',
    type: 'Documentation',
    duration: '3 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    isFree: true,
    rating: 4.9,
    skillId: 'rest',
    canonicalId: 'SKL-0041',
    skillName: 'REST API',
    targetRole: 'Backend Developer',
    externalUrl: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods',
    assessmentId: 'asmt-rest',
    whyRecommended: 'Standard protocol fundamentals across all microservices and API gateways.',
    competenciesCovered: [
      'Idempotent vs safe HTTP method specifications',
      'HTTP 4xx vs 5xx semantic error codes (409 Conflict, 422 Unprocessable)',
      'ETag conditional requests and Cache-Control headers',
      'Token bucket rate limiting and Retry-After headers'
    ]
  },

  // DOCKER (Critical Skill Gap - SKL-0114)
  {
    id: 'res-docker-1',
    title: 'Docker Fundamentals for Modern Microservices',
    provider: 'Coursera / Linux Foundation',
    type: 'Course',
    duration: '5 hours',
    difficulty: 'Beginner',
    price: 'Free Audit',
    isFree: true,
    rating: 4.8,
    skillId: 'docker',
    canonicalId: 'SKL-0114',
    skillName: 'Docker',
    targetRole: 'Backend Developer',
    externalUrl: 'https://www.coursera.org/learn/docker-fundamentals',
    assessmentId: 'asmt-docker',
    whyRecommended: 'Essential primer directly addressing your #1 missing competency gap.',
    competenciesCovered: [
      'Container isolation & Linux cgroups',
      'Multi-stage Dockerfile architecture',
      'Port binding and environment variables',
      'Zero-downtime restarts'
    ]
  },
  {
    id: 'res-docker-2',
    title: 'Official Docker CLI & Multi-Stage Image Best Practices',
    provider: 'Docker Official',
    type: 'Documentation',
    duration: 'Reference / Self-paced',
    difficulty: 'All Levels',
    price: 'Free',
    isFree: true,
    rating: 4.9,
    skillId: 'docker',
    canonicalId: 'SKL-0114',
    skillName: 'Docker',
    targetRole: 'Backend Developer',
    externalUrl: 'https://docs.docker.com/build/building/multi-stage/',
    assessmentId: 'asmt-docker',
    whyRecommended: 'The authoritative reference for minimal image sizes, non-root users, and caching.',
    competenciesCovered: [
      'docker-compose.yml specifications',
      'Volume driver configs & persistence',
      'Network bridge driver mechanics',
      'Container security: USER nonroot'
    ]
  },

  // AWS CLOUD (High Priority Gap - SKL-0130)
  {
    id: 'res-aws-1',
    title: 'AWS Cloud Primitives: Compute, VPC & S3 Architecture',
    provider: 'Cloud Native Foundation',
    type: 'Course',
    duration: '6 hours',
    difficulty: 'Beginner',
    price: 'Free',
    isFree: true,
    rating: 4.9,
    skillId: 'aws',
    canonicalId: 'SKL-0130',
    skillName: 'AWS Cloud Services',
    targetRole: 'Backend Developer',
    externalUrl: 'https://aws.amazon.com/training/intro/',
    whyRecommended: 'AWS primitives are required by 82% of current Backend Developer listings matching your profile.',
    competenciesCovered: [
      'VPC subnet isolation & security groups',
      'EC2 compute deployment',
      'S3 bucket access policies',
      'IAM least privilege roles'
    ]
  },
  {
    id: 'res-aws-2',
    title: 'Deploying Containers with AWS ECS & Fargate Guide',
    provider: 'AWS Architecture Center',
    type: 'Documentation',
    duration: '1.5 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    isFree: true,
    rating: 4.7,
    skillId: 'aws',
    canonicalId: 'SKL-0130',
    skillName: 'AWS Cloud Services',
    targetRole: 'Backend Developer',
    externalUrl: 'https://docs.aws.amazon.com/ecs/',
    whyRecommended: 'Serverless container execution patterns standard in modern cloud backend engineering.',
    competenciesCovered: [
      'Task definition JSON structures',
      'Fargate CPU/Memory allocation',
      'ALB target group routing'
    ]
  },

  // SPRING BOOT (Medium Priority Gap - SKL-0033)
  {
    id: 'res-spring-1',
    title: 'Building Enterprise Microservices with Spring Boot 3',
    provider: 'Enterprise Java Lab',
    type: 'Course',
    duration: '8 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    isFree: true,
    rating: 4.7,
    skillId: 'spring-boot',
    canonicalId: 'SKL-0033',
    skillName: 'Spring Boot',
    targetRole: 'Backend Developer',
    externalUrl: 'https://spring.io/guides/tutorials/rest/',
    whyRecommended: 'You currently have a partial competency score in Spring Boot. Completing this elevates readiness.',
    competenciesCovered: [
      'Spring Data JPA query tuning',
      'REST controller validation with Jakarta',
      'Spring Security OAuth2 JWT integration',
      'Async event handling'
    ]
  },

  // REDIS CACHING (Low Priority / Partial - SKL-0056)
  {
    id: 'res-redis-1',
    title: 'High-Throughput Caching & Rate Limiting with Redis',
    provider: 'Performance Academy',
    type: 'Course',
    duration: '3.5 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    isFree: true,
    rating: 4.8,
    skillId: 'redis',
    canonicalId: 'SKL-0056',
    skillName: 'Redis',
    targetRole: 'Backend Developer',
    externalUrl: 'https://redis.io/university/',
    whyRecommended: 'Solidifying your partial Redis competency will unlock senior high-concurrency roles.',
    competenciesCovered: [
      'Cache-aside & write-through patterns',
      'Sliding window rate limiters with Lua scripts',
      'Redis Pub/Sub vs Streams',
      'Memory eviction policies under load'
    ]
  }
];
