export const MOCK_PROJECTS = [
  {
    id: 'proj-1',
    title: 'Containerized REST API with Docker & PostgreSQL',
    shortDescription: 'Build, dockerize, and orchestrate a multi-service REST backend with database migrations and container healthchecks.',
    skills: ['Docker', 'REST API', 'PostgreSQL', 'Python'],
    difficulty: 'Intermediate',
    estimatedTime: '6–8 hours',
    progress: 40,
    status: 'In Progress', // 'Not Started' | 'In Progress' | 'Submitted' | 'Verified'
    skillGapBridged: 'Docker & DevOps Infrastructure',
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
      status: 'Under Review',
      feedback: 'Initial automated checks passed: Dockerfile multi-stage layers validated. Manual mentor code review pending.'
    }
  },
  {
    id: 'proj-2',
    title: 'Distributed Asynchronous Task Queue with Redis',
    shortDescription: 'Implement worker queues, retries with exponential backoff, and dead-letter queues using Redis and Python Celery.',
    skills: ['Python', 'Redis', 'REST API'],
    difficulty: 'Intermediate',
    estimatedTime: '8–10 hours',
    progress: 0,
    status: 'Not Started',
    skillGapBridged: 'Redis & Asynchronous Background Jobs',
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
    submission: null
  },
  {
    id: 'proj-3',
    title: 'Event-Driven Microservices with Kafka & Spring Boot',
    shortDescription: 'Build an order processing pipeline with event streaming, transactional outbox pattern, and CQRS separation.',
    skills: ['Spring Boot', 'SQL', 'REST API'],
    difficulty: 'Advanced',
    estimatedTime: '12–14 hours',
    progress: 0,
    status: 'Not Started',
    skillGapBridged: 'Spring Boot Enterprise Architecture',
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
    submission: null
  }
];
