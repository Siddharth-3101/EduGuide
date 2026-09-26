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
      { id: 'u-1', name: 'Siddharth G', email: 'siddharth.g@kce.ac.in', role: 'Owner', status: 'online', avatar: 'SG' },
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
      { id: 'u-1', name: 'Siddharth G', email: 'siddharth.g@kce.ac.in', role: 'Owner', status: 'online', avatar: 'SG' }
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
      { id: 'u-1', name: 'Siddharth G', email: 'siddharth.g@kce.ac.in', role: 'Editor', status: 'online', avatar: 'SG' }
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

export const mockCompanyDrives = [
  {
    id: 'drive-amazon-sde-2026',
    company: 'Amazon',
    role: 'Software Development Engineer (SDE-1)',
    driveDate: '2026 Batch Drive',
    status: 'Active Collaborative Pool',
    overallDifficulty: 'Hard',
    studentContributorsCount: 8,
    targetRole: 'Backend Developer',
    summary: 'Single collaborative interview question bank for Amazon SDE-1 2026 drive. Students who attended contribute questions, coding challenges, and interviewer tips round-by-round.',
    contributors: [
      { name: 'Siddharth G', college: 'Karpagam College of Engineering', date: 'Yesterday' },
      { name: 'Priya Sundaram', college: 'KCE', date: '3 days ago' },
      { name: 'Karthik Raja', college: 'PSG Tech', date: '1 week ago' },
      { name: 'Ananya Sharma', college: 'NIT', date: '2 weeks ago' }
    ],
    rounds: [
      {
        roundNumber: 1,
        title: 'Round 1: Online Assessment (OA) on HackerRank',
        duration: '90 mins',
        difficulty: 'Medium',
        focus: 'DSA + System Aptitude',
        questions: [
          {
            id: 'q-amz-1',
            contributorName: 'Siddharth G',
            college: 'Karpagam College of Engineering',
            title: 'Minimum Total Cost to Connect All Warehouse Nodes (MST)',
            prompt: 'Given N warehouse nodes and bidirectional paths with weights, find the minimum cost to connect all nodes. Implemented using Kruskal’s with Disjoint Set Union (DSU) or Prim’s algorithm.',
            difficulty: 'Medium',
            tags: ['Graphs', 'MST', 'DSU', 'Greedy'],
            tips: 'Make sure to compress paths in find() and rank union to pass strict 10^5 constraints.'
          },
          {
            id: 'q-amz-2',
            contributorName: 'Priya Sundaram',
            college: 'KCE',
            title: 'Optimizing Delivery Trucks (Two-Pointer / Knapsack Variant)',
            prompt: 'Given an array of package weights and truck capacity limit, determine minimum trucks needed where each truck carries at most 2 packages.',
            difficulty: 'Easy-Medium',
            tags: ['Two Pointers', 'Greedy', 'Sorting'],
            tips: 'Sort array first. Pair lightest with heaviest that fits within the capacity.'
          }
        ]
      },
      {
        roundNumber: 2,
        title: 'Round 2: Technical Interview 1 (DSA & Core CS)',
        duration: '60 mins',
        difficulty: 'Medium-Hard',
        focus: 'Data Structures & Algorithms with Amazon Chime live code',
        questions: [
          {
            id: 'q-amz-3',
            contributorName: 'Karthik Raja',
            college: 'PSG Tech',
            title: 'Word Search II / Boggle Solver using Trie & Backtracking',
            prompt: 'Find all words on an MxN grid of letters that exist in a dictionary list. Optimized with prefix Trie pruning.',
            difficulty: 'Hard',
            tags: ['Trie', 'Backtracking', 'DFS'],
            tips: 'Interviewer will drill down on what happens to memory if the dictionary has 10 million words.'
          },
          {
            id: 'q-amz-4',
            contributorName: 'Siddharth G',
            college: 'Karpagam College of Engineering',
            title: 'Course Schedule II (Topological Sort / Cycle Detection)',
            prompt: 'Given total courses and dependency pairs, return the exact ordering of courses to finish all courses using Kahn’s BFS algorithm with in-degree array.',
            difficulty: 'Medium',
            tags: ['Topological Sort', 'BFS', 'Cycle Detection'],
            tips: 'Explicitly explain cycle detection when the visited count does not equal numCourses.'
          }
        ]
      },
      {
        roundNumber: 3,
        title: 'Round 3: Technical Interview 2 (Low-Level System Design & Concurrency)',
        duration: '60 mins',
        difficulty: 'Hard',
        focus: 'Object Oriented Design, Concurrency & Database Consistency',
        questions: [
          {
            id: 'q-amz-5',
            contributorName: 'Ananya Sharma',
            college: 'NIT',
            title: 'Design an In-Memory Key-Value Store with TTL & Thread Safety',
            prompt: 'Design Redis-like key-value cache supporting GET, SET, SET_WITH_EXPIRY, and active/passive TTL eviction with concurrent read/write locks.',
            difficulty: 'Hard',
            tags: ['System Design', 'Concurrency', 'Mutex Locks', 'Caching'],
            tips: 'Talk about ReadWriteLock so multiple reads proceed without blocking each other.'
          },
          {
            id: 'q-amz-6',
            contributorName: 'Siddharth G',
            college: 'Karpagam College of Engineering',
            title: 'Design a High-Throughput Notification Throttle (Token Bucket)',
            prompt: 'Prevent spamming SMS/Email notifications by throttling users to 5 notifications per minute using Redis Lua scripts.',
            difficulty: 'Medium-Hard',
            tags: ['Rate Limiting', 'Redis', 'Distributed Systems'],
            tips: 'Highlight atomic execution in Redis via Lua scripts to avoid distributed race conditions.'
          }
        ]
      },
      {
        roundNumber: 4,
        title: 'Round 4: Bar Raiser & Amazon Leadership Principles (LP)',
        duration: '60 mins',
        difficulty: 'Hard',
        focus: 'Customer Obsession, Ownership, Dive Deep (STAR Format)',
        questions: [
          {
            id: 'q-amz-7',
            contributorName: 'Priya Sundaram',
            college: 'KCE',
            title: 'Customer Obsession & Resolving Architectural Disagreements',
            prompt: 'Tell me about a time when you had to push back on a feature requirement or technology choice because it sacrificed customer security or latency.',
            difficulty: 'Medium',
            tags: ['Leadership Principles', 'STAR', 'Customer Obsession'],
            tips: 'Keep Situation & Task brief (20%). Spend 60% on your specific Action and measurable Result metrics.'
          }
        ]
      }
    ]
  },
  {
    id: 'drive-technova-backend-2026',
    company: 'TechNova Systems',
    role: 'Backend Systems Engineer',
    driveDate: '2026 Campus Drive',
    status: 'Active Collaborative Pool',
    overallDifficulty: 'Medium',
    studentContributorsCount: 6,
    targetRole: 'Backend Developer',
    summary: 'Single collaborative interview question bank for TechNova Systems backend drive. Heavy focus on Python asynchronous internals, PostgreSQL MVCC, and containerization.',
    contributors: [
      { name: 'Siddharth G', college: 'Karpagam College of Engineering', date: '2 days ago' },
      { name: 'Priya Sundaram', college: 'KCE', date: '3 days ago' },
      { name: 'Rahul Verma', college: 'NIT', date: '5 days ago' }
    ],
    rounds: [
      {
        roundNumber: 1,
        title: 'Round 1: Online Coding & Algorithmic OA (HackerRank)',
        duration: '90 mins',
        difficulty: 'Medium',
        focus: '2 Coding Problems + 10 CS MCQs',
        questions: [
          {
            id: 'q-tn-1',
            contributorName: 'Priya Sundaram',
            college: 'KCE',
            title: 'LRU Cache Implementation with O(1) Operations',
            prompt: 'Design data structure with get(key) and put(key, value) in O(1) average time complexity using a doubly-linked list with hash map.',
            difficulty: 'Medium',
            tags: ['Doubly Linked List', 'Hash Map', 'LRU'],
            tips: 'Include capacity boundary checks and dummy head/tail nodes to simplify pointer operations.'
          },
          {
            id: 'q-tn-2',
            contributorName: 'Siddharth G',
            college: 'Karpagam College of Engineering',
            title: 'Top N Highest Salaries per Department using SQL Window Functions',
            prompt: 'Write an ANSI SQL query to rank and extract the top 3 earners within each engineering department using DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC).',
            difficulty: 'Medium',
            tags: ['SQL', 'Window Functions', 'DENSE_RANK'],
            tips: 'Clarify whether ties should skip ranks (RANK vs DENSE_RANK).'
          }
        ]
      },
      {
        roundNumber: 2,
        title: 'Round 2: Technical Interview 1 (Python Internals & DSA)',
        duration: '60 mins',
        difficulty: 'Medium-Hard',
        focus: 'CPython execution, GIL, Asyncio, and live coding',
        questions: [
          {
            id: 'q-tn-3',
            contributorName: 'Rahul Verma',
            college: 'NIT',
            title: 'Asyncio Event Loop vs Multi-threading under CPython GIL',
            prompt: 'Explain why CPU-bound threads do not scale in Python due to the Global Interpreter Lock, and live code an asyncio producer-consumer queue.',
            difficulty: 'Hard',
            tags: ['Python', 'Asyncio', 'GIL', 'Concurrency'],
            tips: 'Emphasize that asyncio is single-threaded cooperative multitasking while multiprocessing uses separate OS processes.'
          }
        ]
      },
      {
        roundNumber: 3,
        title: 'Round 3: Technical Interview 2 (System Design & Databases)',
        duration: '60 mins',
        difficulty: 'Hard',
        focus: 'PostgreSQL MVCC, Idempotency, and Docker Deployment',
        questions: [
          {
            id: 'q-tn-4',
            contributorName: 'Siddharth G',
            college: 'Karpagam College of Engineering',
            title: 'Designing an Idempotent Webhook Notification Receiver',
            prompt: 'Handle payment gateway webhooks where duplicate requests arrive simultaneously. Implement unique deduplication keys, database row-level locking (SELECT FOR UPDATE), and idempotency tokens.',
            difficulty: 'Hard',
            tags: ['Idempotency', 'PostgreSQL', 'Transactions', 'Webhooks'],
            tips: 'Draw the transactional lifecycle and handle network timeout edge cases.'
          }
        ]
      },
      {
        roundNumber: 4,
        title: 'Round 4: Techno-Managerial & Fit',
        duration: '30 mins',
        difficulty: 'Easy',
        focus: 'Culture, Architectural disputes, and Career Goals',
        questions: [
          {
            id: 'q-tn-5',
            contributorName: 'Priya Sundaram',
            college: 'KCE',
            title: 'Conflict Resolution on Technology Choices',
            prompt: 'Tell me about a time you and a teammate disagreed on a software architecture decision (e.g. REST vs GraphQL, PostgreSQL vs MongoDB). How did you resolve it?',
            difficulty: 'Medium',
            tags: ['Behavioral', 'STAR', 'Teamwork'],
            tips: 'Frame it around building a prototype benchmark rather than arguing opinions.'
          }
        ]
      }
    ]
  },
  {
    id: 'drive-google-swe-2026',
    company: 'Google',
    role: 'Software Engineer (L3 / New Grad)',
    driveDate: '2026 Campus Drive',
    status: 'Active Collaborative Pool',
    overallDifficulty: 'Hard',
    studentContributorsCount: 11,
    targetRole: 'Backend Developer',
    summary: 'Single collaborative interview question bank for Google SWE 2026 drive. Rigorous focus on clean algorithm derivation, graph traversal, and time/space invariant analysis.',
    contributors: [
      { name: 'Siddharth G', college: 'Karpagam College of Engineering', date: '4 days ago' },
      { name: 'Ananya Sharma', college: 'NIT', date: '1 week ago' },
      { name: 'Arun Kumar', college: 'IIT Madras', date: '2 weeks ago' }
    ],
    rounds: [
      {
        roundNumber: 1,
        title: 'Round 1: Google Online Challenge (GOC)',
        duration: '60 mins',
        difficulty: 'Hard',
        focus: '2 Advanced algorithmic problems',
        questions: [
          {
            id: 'q-goog-1',
            contributorName: 'Arun Kumar',
            college: 'IIT Madras',
            title: 'Shortest Path with K Obstacle Eliminators',
            prompt: 'Given a grid where 0 is empty and 1 is an obstacle, find shortest steps from top-left to bottom-right using 3D BFS state (row, col, remaining_k).',
            difficulty: 'Hard',
            tags: ['BFS', '3D State', 'Shortest Path'],
            tips: 'Track visited state as visited[row][col][remaining_k] to prevent redundant queue entries.'
          }
        ]
      },
      {
        roundNumber: 2,
        title: 'Round 2: Technical Interview 1 (Algorithms & Data Structures)',
        duration: '45 mins',
        difficulty: 'Hard',
        focus: 'Live Google Docs coding with Staff Engineer',
        questions: [
          {
            id: 'q-goog-2',
            contributorName: 'Siddharth G',
            college: 'Karpagam College of Engineering',
            title: 'Serialize and Deserialize N-ary Tree',
            prompt: 'Design an efficient algorithm to serialize an N-ary tree into a compact string representation and deserialize it back without losing child order.',
            difficulty: 'Hard',
            tags: ['Trees', 'Serialization', 'DFS', 'Recursion'],
            tips: 'Use child count delimiters or parenthesis nesting like val[child1 child2].'
          }
        ]
      },
      {
        roundNumber: 3,
        title: 'Round 3: Technical Interview 2 (Distributed Concepts & Scalability)',
        duration: '45 mins',
        difficulty: 'Hard',
        focus: 'Practical coding with corner cases and invariant proofs',
        questions: [
          {
            id: 'q-goog-3',
            contributorName: 'Ananya Sharma',
            college: 'NIT',
            title: 'Median from Data Stream using Min/Max Heaps',
            prompt: 'Continuously insert numbers into a stream and return the median in O(1) time using balanced two-heap structure.',
            difficulty: 'Medium-Hard',
            tags: ['Heaps', 'Priority Queue', 'Streaming Data'],
            tips: 'Keep max-heap size equal to or one greater than min-heap size.'
          }
        ]
      }
    ]
  }
];

export const mockInterviewExperiences = mockCompanyDrives;


