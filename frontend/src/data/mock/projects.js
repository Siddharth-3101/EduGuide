export const MOCK_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Containerized REST API with Docker & PostgreSQL',
    shortDescription: 'Build, dockerize, and orchestrate a multi-service REST backend with database migrations and container healthchecks.',
    skills: ['Docker', 'REST API', 'PostgreSQL', 'Python'],
    difficulty: 'Intermediate',
    projectType: 'Backend API & Infrastructure',
    estimatedTime: '6–8 hours',
    progress: 100,
    evidenceStatus: 'Evidence Identified', // 'Submitted' | 'Analyzing' | 'Analyzed' | 'Evidence Identified' | 'Under Review' | 'Verified'
    skillGapBridged: 'Docker & DevOps Infrastructure',
    githubRepoUrl: 'https://github.com/alexchen/docker-fastapi-service',
    liveDemoUrl: 'https://docker-fastapi.demo.dev',
    detectedTechnologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Alembic'],
    detectedSkills: ['REST API', 'Database', 'Backend Development', 'Docker'],
    skillEvidence: [
      {
        skill: 'Docker',
        evidence: 'Containerized REST API with Docker & PostgreSQL',
        source: 'GitHub README & multi-stage Dockerfile',
        status: 'Evidence Found',
        action: 'Take Docker Assessment',
        assessmentRoute: '/assessments/docker'
      },
      {
        skill: 'REST API',
        evidence: 'CRUD endpoints with OpenAPI schemas',
        source: 'FastAPI Router Inspection',
        status: 'Verified',
        action: 'View Verified Credential',
        assessmentRoute: null
      }
    ],
    objective: 'Demonstrate end-to-end production readiness by packaging a stateless Python/FastAPI service alongside a containerized PostgreSQL database using Docker Compose, volume persistence, and isolated networks.',
    requirements: [
      'Write a multi-stage Dockerfile that produces a production image under 150MB using python:3.11-slim or alpine.',
      'Configure docker-compose.yml with two services: "api" and "db", ensuring the API waits for db readiness via healthcheck.',
      'Mount a persistent named volume for Postgres data directory so data survives container restarts.',
      'Store sensitive environment variables (POSTGRES_PASSWORD, SECRET_KEY) in an ignored .env file with an .env.example provided in the repo.',
      'Implement at least 4 CRUD endpoints with schema validation, HTTP 201 Created and HTTP 404 Not Found status codes.'
    ],
    architecture: `Client (HTTP / OpenAPI)
       │
       ▼
[ Docker Network: backend-bridge ]
       │
       ├── Container 1: Web API (FastAPI / Gunicorn on port 8000)
       │       └── Multi-stage build with non-root user
       │
       └── Container 2: PostgreSQL 16 (internal port 5432)
               └── Named Volume: pgdata -> /var/lib/postgresql/data`,
    evaluationCriteria: [
      { criterion: 'Image Layer Optimization', weight: '25%', detail: 'Clean multi-stage build, minimal footprint, proper .dockerignore usage.' },
      { criterion: 'Resilience & Volumes', weight: '25%', detail: 'Database volume persistence verified across down/up lifecycle.' },
      { criterion: 'API Quality & Standards', weight: '25%', detail: 'Strict REST conventions, HTTP status accuracy, input validation.' },
      { criterion: 'Security Hygiene', weight: '25%', detail: 'Non-root execution and zero hardcoded credentials.' }
    ],
    submission: {
      githubRepoUrl: 'https://github.com/alexchen/docker-fastapi-service',
      branch: 'main',
      commitHash: '7b2f90a',
      submittedAt: '2026-03-02T14:30:00Z',
      status: 'Evidence Identified',
      feedback: 'README and Dockerfile analyzed. 4 technologies identified. Ready for assessment verification.'
    }
  },
  {
    id: 'proj-2',
    title: 'Student Management API',
    shortDescription: 'Production RESTful service with FastAPI, PostgreSQL relational modeling, Dockerized container deployment, and JWT authentication.',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    difficulty: 'Intermediate',
    projectType: 'Backend API',
    estimatedTime: '8–10 hours',
    progress: 90,
    evidenceStatus: 'Evidence Identified',
    skillGapBridged: 'Docker & Backend Integration',
    githubRepoUrl: 'https://github.com/alexchen/student-management-api',
    liveDemoUrl: 'https://api.students-portal.example',
    detectedTechnologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    detectedSkills: ['REST API', 'Database', 'Backend Development', 'Docker'],
    skillEvidence: [
      {
        skill: 'Docker',
        evidence: 'Student Management API',
        source: 'GitHub README',
        status: 'Evidence Found',
        action: 'Take Docker Assessment',
        assessmentRoute: '/assessments/docker'
      },
      {
        skill: 'Python',
        evidence: 'Student Management API',
        source: 'Codebase Analysis (98% Python)',
        status: 'Verified',
        action: 'View Skill',
        assessmentRoute: null
      }
    ],
    objective: 'Build a production-grade student records API handling secure enrollment, course prerequisites, and grade audit logs with automated schema migrations.',
    requirements: [
      'Define SQLAlchemy / SQLModel models with relational foreign key integrity.',
      'Implement OAuth2 Bearer token authentication and role-based permissions.',
      'Package in a multi-stage Docker container with healthcheck endpoints.'
    ],
    architecture: `Client ──(JWT)──> [FastAPI App] ──> [PostgreSQL DB]
                            │
                      [Docker Container]`,
    evaluationCriteria: [
      { criterion: 'Relational Integrity', weight: '35%', detail: 'Foreign key cascades and indexes on search queries.' },
      { criterion: 'Containerization', weight: '35%', detail: 'Functional Docker build with slim alpine base.' },
      { criterion: 'API Documentation', weight: '30%', detail: 'Clean OpenAPI / Swagger docs.' }
    ],
    submission: {
      githubRepoUrl: 'https://github.com/alexchen/student-management-api',
      branch: 'main',
      commitHash: '9a3b11c',
      submittedAt: '2026-03-10T11:15:00Z',
      status: 'Evidence Identified',
      feedback: 'GitHub repository analyzed successfully. High confidence technical evidence discovered for Docker.'
    }
  },
  {
    id: 'proj-3',
    title: 'Distributed Asynchronous Task Queue with Redis',
    shortDescription: 'Implement worker queues, retries with exponential backoff, and dead-letter queues using Redis and Python Celery.',
    skills: ['Python', 'Redis', 'REST API'],
    difficulty: 'Intermediate',
    projectType: 'Distributed Systems',
    estimatedTime: '8–10 hours',
    progress: 75,
    evidenceStatus: 'Under Review',
    skillGapBridged: 'Redis & Asynchronous Background Jobs',
    githubRepoUrl: 'https://github.com/alexchen/async-celery-worker',
    liveDemoUrl: '',
    detectedTechnologies: ['Python', 'Redis', 'Celery', 'FastAPI'],
    detectedSkills: ['Distributed Queues', 'Caching', 'REST API', 'Redis'],
    skillEvidence: [
      {
        skill: 'Redis',
        evidence: 'Distributed Task Queue',
        source: 'Repository Inspection',
        status: 'Evidence Found',
        action: 'Take Redis Assessment',
        assessmentRoute: '/assessments/redis'
      }
    ],
    objective: 'Architect a decoupled background processing system where web servers offload high-latency tasks (report generation, email sending) to worker nodes via Redis broker.',
    requirements: [
      'Build an API endpoint that enqueues work and returns a 202 Accepted response with a task ID.',
      'Implement a status polling endpoint GET /tasks/{task_id} with states: PENDING, PROCESSING, SUCCESS, FAILED.',
      'Configure Redis as message broker and result backend.',
      'Handle worker failure with 3 retries and exponential backoff.'
    ],
    architecture: `Client -> POST /reports -> [API Web Server]
                                    │
                                    ├──> [Redis Broker Queue]
                                                │
                                                ▼
                                         [Worker Service] -> [Result Storage]`,
    evaluationCriteria: [
      { criterion: 'Idempotency & Retries', weight: '30%', detail: 'Graceful handling of failed tasks.' },
      { criterion: 'Redis Memory Usage', weight: '30%', detail: 'Proper key expiration and TTLs.' },
      { criterion: 'Code Structure', weight: '40%', detail: 'Separation of API triggers and worker logic.' }
    ],
    submission: {
      githubRepoUrl: 'https://github.com/alexchen/async-celery-worker',
      branch: 'main',
      commitHash: '3f78a01',
      submittedAt: '2026-03-14T09:20:00Z',
      status: 'Under Review',
      feedback: 'Peer and automated test harness execution in progress.'
    }
  },
  {
    id: 'proj-4',
    title: 'Event-Driven Microservices with Kafka & Spring Boot',
    shortDescription: 'Build an order processing pipeline with event streaming, transactional outbox pattern, and CQRS separation.',
    skills: ['Spring Boot', 'SQL', 'REST API'],
    difficulty: 'Advanced',
    projectType: 'Microservices Architecture',
    estimatedTime: '12–14 hours',
    progress: 100,
    evidenceStatus: 'Verified',
    skillGapBridged: 'Spring Boot Enterprise Architecture',
    githubRepoUrl: 'https://github.com/alexchen/spring-kafka-microservices',
    liveDemoUrl: 'https://kafka-orders.demo.dev',
    detectedTechnologies: ['Java 21', 'Spring Boot 3', 'Apache Kafka', 'PostgreSQL'],
    detectedSkills: ['Microservices', 'Event Streaming', 'Spring Boot', 'SQL'],
    skillEvidence: [
      {
        skill: 'Spring Boot',
        evidence: 'Event-Driven Microservices',
        source: 'Testcontainers automated test pass',
        status: 'Verified',
        action: 'View Credential',
        assessmentRoute: null
      }
    ],
    objective: 'Demonstrate enterprise Java architecture with decoupled microservices communicating asynchronously over Kafka topics.',
    requirements: [
      'Implement Order Service and Inventory Service in Spring Boot 3.',
      'Publish OrderCreated events to Kafka upon checkout.',
      'Implement consumer in Inventory Service that reserves stock.',
      'Include integration tests using Testcontainers.'
    ],
    architecture: `[Order Service] ──(Produce)──> [Kafka: order-events] ──(Consume)──> [Inventory Service]`,
    evaluationCriteria: [
      { criterion: 'Event Consistency', weight: '40%', detail: 'No duplicate orders on consumer retry.' },
      { criterion: 'Spring Design', weight: '30%', detail: 'Use of Spring Data JPA and modular architecture.' },
      { criterion: 'Testcontainers Suite', weight: '30%', detail: 'Automated integration tests running against containerized Kafka.' }
    ],
    submission: {
      githubRepoUrl: 'https://github.com/alexchen/spring-kafka-microservices',
      branch: 'main',
      commitHash: '1a2b3c4',
      submittedAt: '2026-02-18T16:00:00Z',
      status: 'Verified',
      feedback: 'Mentors approved code architecture. Automated Testcontainers passed.'
    }
  }
];
