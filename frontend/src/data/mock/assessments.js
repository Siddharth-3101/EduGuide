export const MOCK_ASSESSMENTS = [
  {
    id: 'asm-docker',
    title: 'Docker Fundamentals & Containers',
    skillId: 'docker',
    category: 'Recommended',
    status: 'Not Started', // 'Not Started' | 'In Progress' | 'Completed'
    questionCount: 10,
    durationMinutes: 15,
    difficulty: 'Intermediate',
    targetRole: 'Backend Developer',
    description: 'Evaluate your practical understanding of containerization, Dockerfile syntax, multi-stage builds, networking, and volumes.',
    competencyFocus: ['Container Lifecycle', 'Dockerfile Best Practices', 'Volumes & Bind Mounts', 'Compose Multi-Service Stacks'],
    questions: [
      {
        id: 1,
        prompt: 'Which Dockerfile instruction creates a temporary container, executes commands, and commits the result to a new image layer?',
        options: [
          { id: 'A', text: 'CMD ["executable", "param1"]' },
          { id: 'B', text: 'RUN <command>' },
          { id: 'C', text: 'ENTRYPOINT ["executable"]' },
          { id: 'D', text: 'EXPOSE <port>' }
        ],
        correctAnswer: 'B',
        explanation: 'RUN executes commands during the build phase and commits new image layers. CMD and ENTRYPOINT define the runtime execution behavior.'
      },
      {
        id: 2,
        prompt: 'In a multi-stage Docker build, what is the primary benefit of using "COPY --from=builder /app/dist ./dist"?',
        options: [
          { id: 'A', text: 'It speeds up DNS resolution in the container' },
          { id: 'B', text: 'It discards build tools, compilers, and dependencies from the final production runtime image' },
          { id: 'C', text: 'It creates a shared volume across different host machines' },
          { id: 'D', text: 'It automatically grants root privileges to the container' }
        ],
        correctAnswer: 'B',
        explanation: 'Multi-stage builds allow compiling in an environment with full toolchains, then selectively copying only production binaries to a minimal scratch or alpine image.'
      },
      {
        id: 3,
        prompt: 'What happens when a container stops if data was written inside the writable container layer without using volumes or bind mounts?',
        options: [
          { id: 'A', text: 'The data is instantly duplicated to host storage' },
          { id: 'B', text: 'The data persists while the container exists, but is permanently lost if the container is removed' },
          { id: 'C', text: 'The data is pushed to Docker Hub automatically' },
          { id: 'D', text: 'The operating system prevents the container from stopping' }
        ],
        correctAnswer: 'B',
        explanation: 'The writable layer belongs to the container instance lifecycle; removing the container destroys all ephemeral writes.'
      },
      {
        id: 4,
        prompt: 'Which command will inspect the resource consumption (CPU %, memory usage, network I/O) of all running containers in real time?',
        options: [
          { id: 'A', text: 'docker inspect --all' },
          { id: 'B', text: 'docker stats' },
          { id: 'C', text: 'docker top' },
          { id: 'D', text: 'docker system df' }
        ],
        correctAnswer: 'B',
        explanation: 'docker stats displays a live streaming statistical feed of container compute and network consumption.'
      },
      {
        id: 5,
        prompt: 'Why should you generally avoid running a production service inside a container as the "root" user?',
        options: [
          { id: 'A', text: 'Root users consume double the memory in Linux cgroups' },
          { id: 'B', text: 'To adhere to the principle of least privilege and prevent container breakout escalation on the host kernel' },
          { id: 'C', text: 'Docker will refuse to expose network ports for root users' },
          { id: 'D', text: 'Linux kernel cannot schedule threads spawned by root' }
        ],
        correctAnswer: 'B',
        explanation: 'If a vulnerability is exploited in a process running as root inside a container, the attacker may gain root-level access to host resources.'
      },
      {
        id: 6,
        prompt: 'In Docker Compose, how can two separate services defined in the same file resolve each other over the network?',
        options: [
          { id: 'A', text: 'They must map to static public IP addresses' },
          { id: 'B', text: 'By using the service name as the hostname via Docker\'s internal DNS resolver' },
          { id: 'C', text: 'Through SSH tunnels configured in the docker daemon' },
          { id: 'D', text: 'By sharing the same process ID namespace' }
        ],
        correctAnswer: 'B',
        explanation: 'Docker Compose creates a default bridge network where service names are automatically registered into internal DNS.'
      },
      {
        id: 7,
        prompt: 'What is the purpose of a .dockerignore file?',
        options: [
          { id: 'A', text: 'Prevents Git from committing Dockerfiles' },
          { id: 'B', text: 'Excludes unnecessary local files (node_modules, .env, build artifacts) from being sent in the build context to the Docker daemon' },
          { id: 'C', text: 'Stops untrusted clients from pulling images' },
          { id: 'D', text: 'Forces the container engine to ignore kernel signals' }
        ],
        correctAnswer: 'B',
        explanation: 'A .dockerignore file shrinks the build context size, drastically accelerating build time and preventing sensitive files from leaking into image layers.'
      },
      {
        id: 8,
        prompt: 'Which signal does "docker stop <container>" send first to allow graceful termination before escalating to SIGKILL?',
        options: [
          { id: 'A', text: 'SIGHUP' },
          { id: 'B', text: 'SIGINT' },
          { id: 'C', text: 'SIGTERM' },
          { id: 'D', text: 'SIGQUIT' }
        ],
        correctAnswer: 'C',
        explanation: 'Docker sends SIGTERM, waits a grace period (default 10 seconds), and then sends SIGKILL if the process hasn\'t exited.'
      },
      {
        id: 9,
        prompt: 'What is the difference between a bind mount and a named Docker volume?',
        options: [
          { id: 'A', text: 'Named volumes are managed completely by Docker in a dedicated storage area, whereas bind mounts map to an exact host filesystem path' },
          { id: 'B', text: 'Bind mounts are read-only; volumes are always read-write' },
          { id: 'C', text: 'Named volumes only work on Windows, not Linux' },
          { id: 'D', text: 'Bind mounts require Kubernetes to function' }
        ],
        correctAnswer: 'A',
        explanation: 'Named volumes are isolated within Docker\'s storage directory (/var/lib/docker/volumes on Linux) and managed safely by Docker CLI.'
      },
      {
        id: 10,
        prompt: 'What does the "HEALTHCHECK" instruction in a Dockerfile do?',
        options: [
          { id: 'A', text: 'Scans the container filesystem for known CVE vulnerabilities' },
          { id: 'B', text: 'Tells Docker how to test if the container application is still healthy and operational at periodic intervals' },
          { id: 'C', text: 'Checks if the physical server has sufficient RAM' },
          { id: 'D', text: 'Verifies the cryptographic signature of parent base image' }
        ],
        correctAnswer: 'B',
        explanation: 'HEALTHCHECK executes a command (such as curl to a health endpoint) periodically to monitor service availability.'
      }
    ]
  },
  {
    id: 'asm-python',
    title: 'Python Core & Concurrency Assessment',
    skillId: 'python',
    category: 'Completed',
    status: 'Completed',
    questionCount: 15,
    durationMinutes: 20,
    difficulty: 'Advanced',
    targetRole: 'Backend Developer',
    description: 'Advanced assessment covering generators, memory management, GIL, async/await event loops, and typing.',
    score: 89,
    completedAt: '2026-02-14'
  },
  {
    id: 'asm-sql',
    title: 'SQL Performance & Schema Design',
    skillId: 'sql',
    category: 'Completed',
    status: 'Completed',
    questionCount: 12,
    durationMinutes: 20,
    difficulty: 'Intermediate',
    targetRole: 'Backend Developer',
    description: 'Covers indexing, EXPLAIN ANALYZE, complex window functions, and transaction isolation.',
    score: 85,
    completedAt: '2026-02-18'
  },
  {
    id: 'asm-rest',
    title: 'REST API Architecture & HTTP Standards',
    skillId: 'rest-api',
    category: 'Completed',
    status: 'Completed',
    questionCount: 10,
    durationMinutes: 15,
    difficulty: 'Intermediate',
    targetRole: 'Backend Developer',
    description: 'Covers idempotent verbs, JWT token rotation, CORS headers, rate limiting, and OpenAPI.',
    score: 94,
    completedAt: '2026-02-22'
  },
  {
    id: 'asm-spring',
    title: 'Spring Boot Microservices & Data JPA',
    skillId: 'spring-boot',
    category: 'In Progress',
    status: 'In Progress',
    questionCount: 12,
    durationMinutes: 20,
    difficulty: 'Intermediate',
    targetRole: 'Backend Developer',
    description: 'Evaluate dependency injection, Spring MVC controllers, Repository patterns, and Hibernate transactions.'
  },
  {
    id: 'asm-aws',
    title: 'AWS Cloud Primitives & IAM',
    skillId: 'aws',
    category: 'Recommended',
    status: 'Not Started',
    questionCount: 12,
    durationMinutes: 18,
    difficulty: 'Beginner',
    targetRole: 'Backend Developer',
    description: 'Core concepts of VPC networking, EC2 security groups, S3 access policies, and basic CloudWatch telemetry.'
  }
];

export const MOCK_DEFAULT_RESULT = {
  assessmentId: 'asm-docker',
  title: 'Docker Fundamentals & Containers',
  skillId: 'docker',
  score: 86,
  passed: true,
  passingScore: 70,
  competencyLevel: 'Intermediate',
  status: 'Skill Verified',
  breakdown: [
    { area: 'Fundamentals & Layering', score: 91 },
    { area: 'Application & Networking', score: 84 },
    { area: 'Problem Solving & Security', score: 82 }
  ],
  whatsNext: {
    message: 'Build a Docker project to strengthen your practical evidence and showcase on your Skill Passport.',
    recommendedProjectId: 'proj-1',
    projectTitle: 'Containerized REST API'
  }
};
