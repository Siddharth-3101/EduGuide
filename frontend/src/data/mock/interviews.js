export const mockInterviewSets = [
  {
    id: 'int-backend-dev',
    title: 'Backend Developer Core Interview',
    description: 'Comprehensive technical and architectural questions for mid-to-senior backend engineering interviews focusing on concurrency, databases, and microservices.',
    targetRole: 'Backend Developer',
    targetRoleId: 'backend-developer',
    difficulty: 'Intermediate to Advanced',
    skills: ['Python', 'SQL', 'REST API', 'Docker', 'System Design', 'FastAPI'],
    updatedAt: '2 hours ago',
    createdAt: '2026-03-10',
    ownerId: 'u-alex-chen',
    isSharedWithMe: false,
    collaborators: [
      { id: 'u-1', name: 'Alex Chen', email: 'alex.chen@university.edu', role: 'Owner', status: 'online', avatar: 'AC' },
      { id: 'u-2', name: 'Elena Rostova', email: 'elena.r@techlab.io', role: 'Editor', status: 'online', avatar: 'ER' },
      { id: 'u-3', name: 'Marcus Brody', email: 'marcus@clouddev.org', role: 'Viewer', status: 'away', avatar: 'MB' }
    ],
    questions: [
      {
        id: 'q-1',
        title: 'Designing a Scalable REST API with Rate Limiting',
        category: 'System Design',
        type: 'System Design',
        difficulty: 'Advanced',
        skills: ['REST API', 'System Design', 'Redis'],
        prompt: 'How would you design a high-throughput REST API that prevents abuse using token bucket rate limiting while maintaining sub-50ms p99 latency?',
        expectedAnswer: '1. Architecture: API Gateway (Kong/Envoy) or application middleware with distributed state.\n2. Rate Limiting Algorithm: Redis-backed Token Bucket or Leaky Bucket with Lua script for atomicity to avoid race conditions.\n3. Headers: Return X-RateLimit-Limit, X-RateLimit-Remaining, and Retry-After on HTTP 429.\n4. Scalability: Cluster Redis instances using consistent hashing with Redis Sentinel or Redis Cluster.',
        explanation: 'Interviewers look for understanding of race conditions between concurrent requests and separation of concerns between gateway and persistence layers.',
        tips: 'Mention Lua scripting inside Redis to prevent double-spending tokens without distributed locks.',
        evaluationCriteria: [
          'Understands Token Bucket vs Sliding Window log',
          'Addresses distributed concurrency with atomic operations',
          'Specifies appropriate HTTP status codes (429 Too Many Requests)',
          'Considers fallback behavior if Redis is unavailable'
        ]
      },
      {
        id: 'q-2',
        title: 'Explain PostgreSQL MVCC and Isolation Levels',
        category: 'Technical',
        type: 'Technical',
        difficulty: 'Intermediate',
        skills: ['SQL', 'PostgreSQL'],
        prompt: 'How does Multi-Version Concurrency Control (MVCC) work in PostgreSQL, and what are the tradeoffs of Read Committed vs Repeatable Read?',
        expectedAnswer: 'PostgreSQL implements MVCC by creating snapshot rows (tuples) tagged with xmin and xmax transaction IDs instead of acquiring read locks. Readers never block writers, and writers never block readers.\n- Read Committed: Each SQL statement sees a snapshot taken at the start of that statement.\n- Repeatable Read: The transaction sees a snapshot taken at the start of the first non-transaction-control statement, preventing Non-Repeatable Reads and Phantom Reads.',
        explanation: 'Demonstrates deep database internals knowledge beyond simple query syntax.',
        tips: 'Highlight the VACUUM process required to clean dead tuples left by MVCC updates and deletes.',
        evaluationCriteria: [
          'Explains xmin/xmax transaction visibility',
          'Contrasts statement snapshot vs transaction snapshot',
          'Mentions VACUUM and dead tuple overhead'
        ]
      },
      {
        id: 'q-3',
        title: 'Multi-stage Docker Builds for Production Python Services',
        category: 'Scenario-based',
        type: 'Scenario-based',
        difficulty: 'Intermediate',
        skills: ['Docker', 'Python', 'DevOps'],
        prompt: 'Why should you use multi-stage Docker builds for a FastAPI service, and what security benefits do non-root users provide in containers?',
        expectedAnswer: 'Multi-stage builds separate the build environment (compilers, build-essential, header files, poetry/pip cache) from the minimal runtime image (e.g. python:3.11-slim or distroless). This reduces image size from ~1GB to <150MB and minimizes CVE attack surfaces.\nRunning as non-root (USER nonroot) ensures that container escapes cannot exploit host root privileges if the process is compromised.',
        explanation: 'Directly maps to the critical Docker skill gap identified on the student profile.',
        tips: 'Mention .dockerignore and pinning dependency hashes for deterministic builds.',
        evaluationCriteria: [
          'Understands build-stage vs runtime-stage separation',
          'Articulates image size & vulnerability reduction',
          'Explains non-root container isolation'
        ]
      },
      {
        id: 'q-4',
        title: 'Diagnosing Production Database Deadlocks',
        category: 'Scenario-based',
        type: 'Scenario-based',
        difficulty: 'Advanced',
        skills: ['SQL', 'Debugging', 'Backend Architecture'],
        prompt: 'Your application logs show intermittent DeadlockDetected errors during checkout transactions. How do you reproduce, diagnose, and permanently eliminate the deadlocks?',
        expectedAnswer: '1. Diagnosis: Inspect pg_stat_activity and postgres log files to view the conflicting queries and lock types.\n2. Root Cause: Deadlocks occur when concurrent transactions acquire locks on multiple resources in differing order (e.g. Tx1 locks row A then B; Tx2 locks row B then A).\n3. Prevention: Enforce deterministic lock acquisition ordering across all queries, batch updates sorted by primary key, keep transaction scopes as narrow as possible, and use SELECT ... FOR UPDATE NOWAIT or SKIP LOCKED where appropriate.',
        explanation: 'Tests practical production troubleshooting under pressure.',
        tips: 'Mention that retrying on deadlock in middleware with exponential backoff is a good defense-in-depth tactic.',
        evaluationCriteria: [
          'Knows lock ordering is the primary fix',
          'Keeps transactions short and eliminates external I/O inside DB transactions',
          'Suggests automated deadlock logging/alerting'
        ]
      },
      {
        id: 'q-5',
        title: 'Conflict Resolution in Distributed Systems',
        category: 'Behavioral',
        type: 'Behavioral',
        difficulty: 'Intermediate',
        skills: ['Leadership', 'Communication'],
        prompt: 'Tell me about a time when your team disagreed on architectural technical direction (e.g. GraphQL vs REST, or SQL vs NoSQL). How did you reach consensus?',
        expectedAnswer: 'STAR response highlighting:\n- Situation: Architectural ambiguity between two valid technologies.\n- Task: Define objective decision framework.\n- Action: Built a lightweight proof of concept (POC) benchmarking throughput, team ergonomics, and observability against clear criteria rather than subjective opinions.\n- Result: Team aligned on data-backed choice with buy-in from all engineers.',
        explanation: 'Hiring managers use this to see if the candidate collaborates constructively without dogmatism.',
        tips: 'Focus on objective decision matrices and lightweight prototypes to de-risk decisions.',
        evaluationCriteria: [
          'Structured STAR format',
          'Emphasis on objective benchmarking over emotion',
          'Respect for peer perspectives'
        ]
      }
    ]
  },
  {
    id: 'int-system-design',
    title: 'Microservices & Distributed Systems',
    description: 'Senior architectural scenarios: event sourcing, idempotent payments, idempotency keys, and circuit breakers.',
    targetRole: 'Full Stack Engineer',
    targetRoleId: 'full-stack-developer',
    difficulty: 'Advanced',
    skills: ['System Design', 'Docker', 'REST API', 'Redis'],
    updatedAt: '1 day ago',
    createdAt: '2026-03-08',
    ownerId: 'u-alex-chen',
    isSharedWithMe: false,
    collaborators: [
      { id: 'u-1', name: 'Alex Chen', email: 'alex.chen@university.edu', role: 'Owner', status: 'online', avatar: 'AC' }
    ],
    questions: [
      {
        id: 'q-sd-1',
        title: 'Implementing Idempotency in Payment Gateways',
        category: 'System Design',
        type: 'System Design',
        difficulty: 'Advanced',
        skills: ['REST API', 'System Design', 'SQL'],
        prompt: 'How would you guarantee that a user is never double-charged if network latency causes their checkout request to time out and retry?',
        expectedAnswer: '1. Client generates UUID idempotency key.\n2. Gateway checks key in distributed store (Redis/DB) with short TTL lock.\n3. If in-progress, return HTTP 409 or wait.\n4. If completed, return cached response directly.\n5. Database constraint on (idempotency_key) guarantees single execution.',
        explanation: 'Crucial for real-world fintech and e-commerce reliability.',
        tips: 'Always explain the states: pending, succeeded, failed.',
        evaluationCriteria: ['Client-generated idempotency keys', 'Atomic locking mechanism', 'Cached response return']
      }
    ]
  },
  {
    id: 'int-shared-peer',
    title: 'Cloud DevOps & CI/CD Pipeline Questions',
    description: 'Shared by Elena from University Tech Club — container orchestration, Kubernetes ingress, and GitHub Actions automation.',
    targetRole: 'DevOps / Cloud Engineer',
    targetRoleId: 'cloud-devops',
    difficulty: 'Intermediate',
    skills: ['Docker', 'AWS', 'CI/CD'],
    updatedAt: '3 hours ago',
    createdAt: '2026-03-12',
    ownerId: 'u-elena-r',
    isSharedWithMe: true,
    collaborators: [
      { id: 'u-2', name: 'Elena Rostova', email: 'elena.r@techlab.io', role: 'Owner', status: 'online', avatar: 'ER' },
      { id: 'u-1', name: 'Alex Chen', email: 'alex.chen@university.edu', role: 'Editor', status: 'online', avatar: 'AC' }
    ],
    questions: [
      {
        id: 'q-devops-1',
        title: 'Zero-Downtime Rolling Deployments in Container Environments',
        category: 'Technical',
        type: 'Technical',
        difficulty: 'Intermediate',
        skills: ['Docker', 'CI/CD'],
        prompt: 'Explain the mechanics of a rolling deployment and why readiness probes are vital.',
        expectedAnswer: 'A rolling deployment replaces instances of the previous version with new ones incrementally. Readiness probes ensure traffic is only routed after the container has initialized caches and connections.',
        explanation: 'Standard DevOps competency question.',
        tips: 'Mention liveness vs readiness probes distinction.',
        evaluationCriteria: ['Liveness vs Readiness probe distinction', 'Graceful shutdown handling (SIGTERM)']
      }
    ]
  }
];

export const mockRecommendedQuestions = [
  {
    id: 'rq-1',
    title: 'How does Docker container networking bridge driver work under the hood?',
    category: 'Technical',
    difficulty: 'Intermediate',
    skills: ['Docker', 'Networking'],
    targetRole: 'Backend Developer',
    reason: 'Addresses your #1 missing competency: Docker',
    prompt: 'Explain how the Docker bridge network uses Linux veth pairs, iptables NAT rules, and IP forwarding to route packets between containers and external networks.'
  },
  {
    id: 'rq-2',
    title: 'Explain indexing data structures: B-Tree vs Hash vs GiST in PostgreSQL',
    category: 'Technical',
    difficulty: 'Advanced',
    skills: ['SQL', 'Databases'],
    targetRole: 'Backend Developer',
    reason: 'Matches verified Python & SQL candidate profile benchmark',
    prompt: 'When should you choose a B-Tree index over a Hash index, and how do composite indexes behave when queries omit the leading column?'
  },
  {
    id: 'rq-3',
    title: 'Designing authentication: JWT vs Stateful Session Cookies with Redis',
    category: 'System Design',
    difficulty: 'Intermediate',
    skills: ['REST API', 'Security'],
    targetRole: 'Backend Developer',
    reason: 'Frequent question in 78% of your matched job postings',
    prompt: 'Compare stateless JWTs with short expiry + refresh tokens versus server-side session stores. How do you handle instantaneous token revocation?'
  }
];
