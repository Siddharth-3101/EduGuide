import { MarkerType } from '@xyflow/react';

const makeEdge = (id, source, target, isAnimated = false, isVerified = true) => ({
  id,
  source,
  target,
  type: 'smoothstep',
  animated: isAnimated,
  style: {
    stroke: isAnimated ? '#3b82f6' : isVerified ? '#10b981' : 'rgba(150, 150, 150, 0.4)',
    strokeWidth: isAnimated ? 2.5 : 2,
    strokeDasharray: isVerified && !isAnimated ? undefined : isAnimated ? undefined : '4 4'
  },
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: isAnimated ? '#3b82f6' : isVerified ? '#10b981' : 'rgba(150, 150, 150, 0.5)',
    width: 14,
    height: 14
  }
});

export const PATHWAY_ROADMAPS = {
  // ==========================================
  // BACKEND DEVELOPER PATHWAYS
  // ==========================================
  'PATH-BACKEND-JAVA': {
    pathwayId: 'PATH-BACKEND-JAVA',
    roleId: 'backend-developer',
    roleTitle: 'Java / Spring Boot Backend Developer',
    targetSalary: '₹10,00,000 – ₹18,00,000 / yr',
    stats: { verifiedCount: 6, partialCount: 2, missingCount: 1, totalSkills: 9, coverage: 78 },
    recommendedNextId: 'node-microservices-java',
    nodes: [
      {
        id: 'node-java-core',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'java',
          name: 'Core Java & OOP',
          category: 'Core Language',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 94,
          prerequisites: ['Programming Fundamentals'],
          evidence: ['Verified Assessment (94%)', 'Karpagam B.E. Coursework'],
          whyNeeded: 'Mastery of Java memory model, generics, collections, multithreading, and OOP design patterns.',
          resources: [{ title: 'Effective Java', provider: "Addison-Wesley", duration: '12 hours' }]
        }
      },
      {
        id: 'node-sql-java',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'sql',
          name: 'SQL & PostgreSQL',
          category: 'Data Persistence',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          prerequisites: ['Core Java & OOP'],
          evidence: ['PostgreSQL Assessment (92%)', 'AgriSmart Schema Design'],
          whyNeeded: 'Relational query optimization, indexing, transactions, and ACID guarantees.',
          resources: [{ title: 'High-Performance Java Persistence', provider: 'Vlad Mihalcea', duration: '8 hours' }]
        }
      },
      {
        id: 'node-spring-boot',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 160 },
        data: {
          skillId: 'spring-boot',
          name: 'Spring Boot & REST APIs',
          category: 'Enterprise Framework',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 90,
          prerequisites: ['Core Java & OOP', 'SQL & PostgreSQL'],
          evidence: ['AgriSmart Production Backend', 'Spring Boot Assessment'],
          whyNeeded: 'Spring MVC, Dependency Injection, JPA / Hibernate ORM, and RESTful web services.',
          resources: [{ title: 'Spring Boot in Action', provider: 'Manning', duration: '10 hours' }]
        }
      },
      {
        id: 'node-spring-security',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 360 },
        data: {
          skillId: 'spring-security',
          name: 'Spring Security & JWT',
          category: 'Authentication',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['Spring Boot & REST APIs'],
          evidence: ['JWT Auth Implementation in AgriSmart'],
          whyNeeded: 'Role-based access control (RBAC), OAuth2, JWT token generation and validation.',
          resources: [{ title: 'Spring Security Deep Dive', provider: 'Baeldung', duration: '6 hours' }]
        }
      },
      {
        id: 'node-microservices-java',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 160 },
        data: {
          skillId: 'microservices',
          name: 'Microservices & Redis',
          category: 'Distributed Systems',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 74,
          prerequisites: ['Spring Boot & REST APIs'],
          evidence: ['AgriSmart Multi-module Services'],
          whyNeeded: 'Service discovery, API gateway routing, circuit breakers, and Redis caching layers.',
          resources: [{ title: 'Building Microservices with Spring Cloud', provider: 'O\'Reilly', duration: '10 hours' }]
        }
      },
      {
        id: 'node-kafka-java',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 360 },
        data: {
          skillId: 'kafka',
          name: 'Apache Kafka & Events',
          category: 'Event Streaming',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Microservices & Redis'],
          evidence: [],
          whyNeeded: 'Asynchronous event decoupling, message queues, and pub/sub architecture.',
          resources: [{ title: 'Kafka The Definitive Guide', provider: 'Confluent', duration: '8 hours' }]
        }
      },
      {
        id: 'node-docker-java',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 160 },
        data: {
          skillId: 'docker',
          name: 'Docker & Containerization',
          category: 'DevOps & Containers',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 89,
          prerequisites: ['Microservices & Redis'],
          evidence: ['Dockerfile multi-stage builds', 'LFD102 Verified'],
          whyNeeded: 'Multi-stage JRE container builds, Docker Compose local staging, and container health checks.',
          resources: [{ title: 'Docker for Java Developers', provider: 'Docker', duration: '5 hours' }]
        }
      },
      {
        id: 'node-k8s-java',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 360 },
        data: {
          skillId: 'kubernetes',
          name: 'Kubernetes & AWS Deploy',
          category: 'Cloud Infrastructure',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 65,
          prerequisites: ['Docker & Containerization'],
          evidence: ['AWS EC2 deployment'],
          whyNeeded: 'Pod deployments, Service load balancing, ConfigMaps, and AWS cloud management.',
          resources: [{ title: 'Kubernetes Up & Running', provider: 'O\'Reilly', duration: '8 hours' }]
        }
      },
      {
        id: 'node-target-java',
        type: 'targetCareerNode',
        position: { x: 1540, y: 260 },
        data: {
          roleTitle: 'Java / Spring Boot Backend Developer',
          targetSalary: '₹10,00,000 – ₹18,00,000 / yr',
          coveragePercentage: 78,
          readyToApply: true,
          topMatchCompanies: ['Stripe', 'Amazon', 'PayPal', 'Swiggy', 'Infosys']
        }
      }
    ],
    edges: [
      makeEdge('e-java-sql', 'node-java-core', 'node-sql-java', false, true),
      makeEdge('e-sql-spring', 'node-sql-java', 'node-spring-boot', false, true),
      makeEdge('e-spring-sec', 'node-spring-boot', 'node-spring-security', false, true),
      makeEdge('e-spring-micro', 'node-spring-boot', 'node-microservices-java', true, false),
      makeEdge('e-micro-kafka', 'node-microservices-java', 'node-kafka-java', false, false),
      makeEdge('e-micro-docker', 'node-microservices-java', 'node-docker-java', false, true),
      makeEdge('e-docker-k8s', 'node-docker-java', 'node-k8s-java', false, false),
      makeEdge('e-docker-target', 'node-docker-java', 'node-target-java', false, true),
      makeEdge('e-k8s-target', 'node-k8s-java', 'node-target-java', false, false)
    ]
  },

  'PATH-BACKEND-PYTHON': {
    pathwayId: 'PATH-BACKEND-PYTHON',
    roleId: 'backend-developer',
    roleTitle: 'Python / FastAPI Backend Developer',
    targetSalary: '₹10,50,000 – ₹17,50,000 / yr',
    stats: { verifiedCount: 6, partialCount: 2, missingCount: 1, totalSkills: 9, coverage: 80 },
    recommendedNextId: 'node-celery-python',
    nodes: [
      {
        id: 'node-python-core',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'python',
          name: 'Python 3 & AsyncIO',
          category: 'Core Language',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 95,
          prerequisites: ['Programming Fundamentals'],
          evidence: ['Python Assessment (95%)', 'GitHub FastAPI Repositories'],
          whyNeeded: 'Asynchronous event loops, type hints, decorators, generators, and clean Python architecture.',
          resources: [{ title: 'Fluent Python', provider: "O'Reilly", duration: '10 hours' }]
        }
      },
      {
        id: 'node-fastapi-core',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'fastapi',
          name: 'FastAPI & Pydantic',
          category: 'Modern Web Framework',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          prerequisites: ['Python 3 & AsyncIO'],
          evidence: ['FastAPI Microservices Portfolio'],
          whyNeeded: 'High-throughput async endpoints, automatic OpenAPI docs, and strict schema validation.',
          resources: [{ title: 'FastAPI Official Documentation & Tutorial', provider: 'FastAPI', duration: '6 hours' }]
        }
      },
      {
        id: 'node-postgres-python',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 160 },
        data: {
          skillId: 'postgresql',
          name: 'PostgreSQL & SQLAlchemy',
          category: 'Relational Database',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['FastAPI & Pydantic'],
          evidence: ['SQLAlchemy 2.0 Async Session Code'],
          whyNeeded: 'Async database drivers (asyncpg), Alembic migrations, connection pooling, and indexing.',
          resources: [{ title: 'SQLAlchemy 2.0 Mastery', provider: 'Talk Python', duration: '6 hours' }]
        }
      },
      {
        id: 'node-redis-python',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 360 },
        data: {
          skillId: 'redis',
          name: 'Redis In-Memory Caching',
          category: 'Caching & State',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 86,
          prerequisites: ['FastAPI & Pydantic'],
          evidence: ['Redis rate-limiting implementation'],
          whyNeeded: 'Distributed caching, session storage, rate limiting, and Pub/Sub communication.',
          resources: [{ title: 'Redis University: Fast In-Memory Storage', provider: 'Redis', duration: '4 hours' }]
        }
      },
      {
        id: 'node-celery-python',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 160 },
        data: {
          skillId: 'celery',
          name: 'Celery & Background Tasks',
          category: 'Task Queues',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 72,
          prerequisites: ['FastAPI & Pydantic', 'Redis In-Memory Caching'],
          evidence: ['Async task dispatcher project'],
          whyNeeded: 'Decoupling heavy compute tasks, scheduled cron jobs, and worker concurrency.',
          resources: [{ title: 'Celery Distributed Task Queue', provider: 'Celery Project', duration: '6 hours' }]
        }
      },
      {
        id: 'node-system-design-py',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 360 },
        data: {
          skillId: 'system-design',
          name: 'System Design & APIs',
          category: 'Architecture',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 85,
          prerequisites: ['PostgreSQL & SQLAlchemy'],
          evidence: ['Microservices architecture blueprints'],
          whyNeeded: 'Designing idempotent APIs, distributed transaction sagas, and horizontal scaling.',
          resources: [{ title: 'Designing Data-Intensive Applications', provider: "O'Reilly", duration: '14 hours' }]
        }
      },
      {
        id: 'node-docker-python',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 160 },
        data: {
          skillId: 'docker',
          name: 'Docker & Containerization',
          category: 'DevOps & Containers',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 90,
          prerequisites: ['System Design & APIs'],
          evidence: ['Dockerfile for Uvicorn async worker', 'LFD102 Verified'],
          whyNeeded: 'Slim container images, multi-stage Python wheels, and docker-compose testing environments.',
          resources: [{ title: 'FastAPI in Containers', provider: 'FastAPI Docs', duration: '3 hours' }]
        }
      },
      {
        id: 'node-cicd-python',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 360 },
        data: {
          skillId: 'ci-cd',
          name: 'CI/CD & Cloud Deploy',
          category: 'Automated Deployment',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 70,
          prerequisites: ['Docker & Containerization'],
          evidence: ['GitHub Actions CI for PyTest'],
          whyNeeded: 'Automated linting (Ruff/Black), unit tests with Pytest, and deployment to AWS / GCP.',
          resources: [{ title: 'GitHub Actions Continuous Integration', provider: 'GitHub', duration: '4 hours' }]
        }
      },
      {
        id: 'node-target-python',
        type: 'targetCareerNode',
        position: { x: 1540, y: 260 },
        data: {
          roleTitle: 'Python / FastAPI Microservices Developer',
          targetSalary: '₹10,50,000 – ₹17,50,000 / yr',
          coveragePercentage: 80,
          readyToApply: true,
          topMatchCompanies: ['Uber', 'Dropbox', 'Twilio', 'Cred', 'Razorpay']
        }
      }
    ],
    edges: [
      makeEdge('e-py-fast', 'node-python-core', 'node-fastapi-core', false, true),
      makeEdge('e-fast-pg', 'node-fastapi-core', 'node-postgres-python', false, true),
      makeEdge('e-fast-redis', 'node-fastapi-core', 'node-redis-python', false, true),
      makeEdge('e-redis-celery', 'node-redis-python', 'node-celery-python', true, false),
      makeEdge('e-pg-sys', 'node-postgres-python', 'node-system-design-py', false, true),
      makeEdge('e-celery-docker', 'node-celery-python', 'node-docker-python', false, true),
      makeEdge('e-sys-cicd', 'node-system-design-py', 'node-cicd-python', false, false),
      makeEdge('e-docker-target-py', 'node-docker-python', 'node-target-python', false, true),
      makeEdge('e-cicd-target-py', 'node-cicd-python', 'node-target-python', false, false)
    ]
  },

  'PATH-BACKEND-NODE': {
    pathwayId: 'PATH-BACKEND-NODE',
    roleId: 'backend-developer',
    roleTitle: 'Node.js / TypeScript Backend Developer',
    targetSalary: '₹10,00,000 – ₹17,00,000 / yr',
    stats: { verifiedCount: 6, partialCount: 2, missingCount: 1, totalSkills: 9, coverage: 78 },
    recommendedNextId: 'node-graphql-ts',
    nodes: [
      {
        id: 'node-ts-core',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'typescript',
          name: 'TypeScript & ES6+ Core',
          category: 'Core Language',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 93,
          prerequisites: ['JavaScript Fundamentals'],
          evidence: ['TypeScript Verified Score: 93%'],
          whyNeeded: 'Strict type safety, interfaces, generics, async/await, and event-loop non-blocking I/O.',
          resources: [{ title: 'Programming TypeScript', provider: "O'Reilly", duration: '8 hours' }]
        }
      },
      {
        id: 'node-express-core',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'node-express',
          name: 'Node.js & Express / NestJS',
          category: 'Runtime & Framework',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 90,
          prerequisites: ['TypeScript & ES6+ Core'],
          evidence: ['E-Commerce tivaa.in Node Backend'],
          whyNeeded: 'Middleware pipeline, routing, request validation, error handling, and streams.',
          resources: [{ title: 'Node.js Design Patterns', provider: 'Packt', duration: '10 hours' }]
        }
      },
      {
        id: 'node-prisma-pg',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 160 },
        data: {
          skillId: 'prisma-postgresql',
          name: 'PostgreSQL & Prisma ORM',
          category: 'Relational Database',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['Node.js & Express / NestJS'],
          evidence: ['Prisma schema migration in production'],
          whyNeeded: 'Type-safe queries, relational schema migrations, connection pooling, and foreign keys.',
          resources: [{ title: 'Prisma Getting Started & Architecture', provider: 'Prisma', duration: '4 hours' }]
        }
      },
      {
        id: 'node-mongo-ts',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 360 },
        data: {
          skillId: 'mongodb',
          name: 'MongoDB & Mongoose',
          category: 'NoSQL Database',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 87,
          prerequisites: ['Node.js & Express / NestJS'],
          evidence: ['Document Store Schema Project'],
          whyNeeded: 'Flexible JSON document schemas, aggregation pipelines, and sharding.',
          resources: [{ title: 'MongoDB for Javascript Developers', provider: 'MongoDB University', duration: '6 hours' }]
        }
      },
      {
        id: 'node-graphql-ts',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 160 },
        data: {
          skillId: 'graphql',
          name: 'GraphQL & Apollo Server',
          category: 'API Paradigms',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 68,
          prerequisites: ['PostgreSQL & Prisma ORM'],
          evidence: ['Apollo GraphQL Schema POC'],
          whyNeeded: 'Declarative data fetching, schema stitching, resolvers, and avoiding over-fetching.',
          resources: [{ title: 'Fullstack GraphQL with TypeScript', provider: 'Apollo Odyssey', duration: '5 hours' }]
        }
      },
      {
        id: 'node-redis-ts',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 360 },
        data: {
          skillId: 'redis',
          name: 'Redis Caching & BullMQ',
          category: 'Distributed Caching',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 85,
          prerequisites: ['Node.js & Express / NestJS'],
          evidence: ['BullMQ worker for order processing'],
          whyNeeded: 'Job queues, rate limiters, session caches, and real-time pub/sub.',
          resources: [{ title: 'BullMQ Job Queues in Node.js', provider: 'Taskforce.sh', duration: '4 hours' }]
        }
      },
      {
        id: 'node-docker-ts',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 260 },
        data: {
          skillId: 'docker',
          name: 'Docker & Cloud Deployment',
          category: 'DevOps & Cloud',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 89,
          prerequisites: ['GraphQL & Apollo Server', 'Redis Caching & BullMQ'],
          evidence: ['Docker container deployment on AWS EC2'],
          whyNeeded: 'Container packaging, environment isolation, and production deployments.',
          resources: [{ title: 'Deploying Node.js Microservices', provider: 'AWS Architecture', duration: '6 hours' }]
        }
      },
      {
        id: 'node-target-node',
        type: 'targetCareerNode',
        position: { x: 1540, y: 260 },
        data: {
          roleTitle: 'Node.js / TypeScript Systems Developer',
          targetSalary: '₹10,00,000 – ₹17,00,000 / yr',
          coveragePercentage: 78,
          readyToApply: true,
          topMatchCompanies: ['Shopify', 'Coinbase', 'Postman', 'Zomato', 'CRED']
        }
      }
    ],
    edges: [
      makeEdge('e-ts-node', 'node-ts-core', 'node-express-core', false, true),
      makeEdge('e-node-prisma', 'node-express-core', 'node-prisma-pg', false, true),
      makeEdge('e-node-mongo', 'node-express-core', 'node-mongo-ts', false, true),
      makeEdge('e-prisma-gql', 'node-prisma-pg', 'node-graphql-ts', true, false),
      makeEdge('e-mongo-redis', 'node-mongo-ts', 'node-redis-ts', false, true),
      makeEdge('e-gql-docker', 'node-graphql-ts', 'node-docker-ts', false, false),
      makeEdge('e-redis-docker', 'node-redis-ts', 'node-docker-ts', false, true),
      makeEdge('e-docker-target-node', 'node-docker-ts', 'node-target-node', false, true)
    ]
  },

  // ==========================================
  // AI ENGINEER PATHWAYS
  // ==========================================
  'PATH-AI-APP': {
    pathwayId: 'PATH-AI-APP',
    roleId: 'ai-engineer',
    roleTitle: 'AI Application Engineer (LLMs & RAG)',
    targetSalary: '₹12,00,000 – ₹20,00,000 / yr',
    stats: { verifiedCount: 5, partialCount: 2, missingCount: 1, totalSkills: 8, coverage: 75 },
    recommendedNextId: 'node-rag-arch',
    nodes: [
      {
        id: 'node-py-ai-found',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'python',
          name: 'Python & Data Wrangling',
          category: 'Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 95,
          prerequisites: ['Programming Fundamentals'],
          evidence: ['Python Assessment (95%)'],
          whyNeeded: 'NumPy arrays, Pandas DataFrames, JSON structuring, and asynchronous HTTP calls.',
          resources: [{ title: 'Python Data Science Handbook', provider: "O'Reilly", duration: '8 hours' }]
        }
      },
      {
        id: 'node-prompt-eng',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'prompt-engineering',
          name: 'Prompt Engineering & APIs',
          category: 'LLM Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 90,
          prerequisites: ['Python & Data Wrangling'],
          evidence: ['Ollama & OpenAI API projects'],
          whyNeeded: 'Few-shot prompting, structured output parsing (JSON schema), and reasoning chains.',
          resources: [{ title: 'Prompt Engineering for Developers', provider: 'DeepLearning.AI', duration: '4 hours' }]
        }
      },
      {
        id: 'node-vector-dbs',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 160 },
        data: {
          skillId: 'vector-databases',
          name: 'Vector DBs (Chroma / Pinecone)',
          category: 'Semantic Retrieval',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 75,
          prerequisites: ['Prompt Engineering & APIs'],
          evidence: ['Embeddings indexing project'],
          whyNeeded: 'Dense vector representations, cosine distance search, HNSW indexing, and metadata filters.',
          resources: [{ title: 'Vector Search Mastery', provider: 'Pinecone Academy', duration: '5 hours' }]
        }
      },
      {
        id: 'node-langchain-orch',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 360 },
        data: {
          skillId: 'langchain',
          name: 'LangChain & LlamaIndex',
          category: 'Orchestration',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 86,
          prerequisites: ['Prompt Engineering & APIs'],
          evidence: ['Document question-answering app'],
          whyNeeded: 'Document loaders, chunking strategies, vector stores, and custom pipeline chains.',
          resources: [{ title: 'LangChain for LLM Application Development', provider: 'DeepLearning.AI', duration: '6 hours' }]
        }
      },
      {
        id: 'node-rag-arch',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 160 },
        data: {
          skillId: 'rag',
          name: 'Production RAG Architecture',
          category: 'Information Retrieval',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 70,
          prerequisites: ['Vector DBs (Chroma / Pinecone)', 'LangChain & LlamaIndex'],
          evidence: ['Context injection prototypes'],
          whyNeeded: 'Hybrid keyword + dense search, re-ranking models, context window management, and hallucination reduction.',
          resources: [{ title: 'Advanced RAG Techniques', provider: 'LlamaIndex', duration: '6 hours' }]
        }
      },
      {
        id: 'node-ai-agents',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 360 },
        data: {
          skillId: 'ai-agents',
          name: 'Autonomous AI Agents',
          category: 'Agentic Workflows',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['LangChain & LlamaIndex'],
          evidence: [],
          whyNeeded: 'ReAct agent loops, tool calling, execution planning, and multi-agent coordination.',
          resources: [{ title: 'Building Systems with the ChatGPT API', provider: 'DeepLearning.AI', duration: '5 hours' }]
        }
      },
      {
        id: 'node-fastapi-ai',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 260 },
        data: {
          skillId: 'fastapi-deployment',
          name: 'FastAPI AI Serving & Docker',
          category: 'Production Serving',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          prerequisites: ['Production RAG Architecture'],
          evidence: ['Streaming SSE FastAPI endpoint'],
          whyNeeded: 'Server-sent events (SSE) token streaming, async batching, Docker deployment, and telemetry.',
          resources: [{ title: 'Serving ML with FastAPI', provider: 'FastAPI Docs', duration: '4 hours' }]
        }
      },
      {
        id: 'node-target-ai-app',
        type: 'targetCareerNode',
        position: { x: 1540, y: 260 },
        data: {
          roleTitle: 'AI Application Engineer (LLMs & RAG)',
          targetSalary: '₹12,00,000 – ₹20,00,000 / yr',
          coveragePercentage: 75,
          readyToApply: true,
          topMatchCompanies: ['OpenAI', 'Anthropic', 'Google Cloud', 'Perplexity', 'Scribe']
        }
      }
    ],
    edges: [
      makeEdge('e-py-pe', 'node-py-ai-found', 'node-prompt-eng', false, true),
      makeEdge('e-pe-vdb', 'node-prompt-eng', 'node-vector-dbs', false, true),
      makeEdge('e-pe-lc', 'node-prompt-eng', 'node-langchain-orch', false, true),
      makeEdge('e-vdb-rag', 'node-vector-dbs', 'node-rag-arch', true, false),
      makeEdge('e-lc-rag', 'node-langchain-orch', 'node-rag-arch', true, false),
      makeEdge('e-lc-agent', 'node-langchain-orch', 'node-ai-agents', false, false),
      makeEdge('e-rag-fast', 'node-rag-arch', 'node-fastapi-ai', false, true),
      makeEdge('e-agent-fast', 'node-ai-agents', 'node-fastapi-ai', false, false),
      makeEdge('e-fast-target-ai', 'node-fastapi-ai', 'node-target-ai-app', false, true)
    ]
  },

  'PATH-ML-ENG': {
    pathwayId: 'PATH-ML-ENG',
    roleId: 'ai-engineer',
    roleTitle: 'Machine Learning Core Engineer',
    targetSalary: '₹13,00,000 – ₹22,00,000 / yr',
    stats: { verifiedCount: 5, partialCount: 2, missingCount: 1, totalSkills: 8, coverage: 72 },
    recommendedNextId: 'node-pytorch-core',
    nodes: [
      {
        id: 'node-math-py',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'math-python',
          name: 'Linear Algebra & Calculus',
          category: 'Mathematical Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          prerequisites: ['None (Foundational)'],
          evidence: ['Math Assessment (92%)'],
          whyNeeded: 'Eigenvalues, singular value decomposition (SVD), gradients, and multivariable chain rule.',
          resources: [{ title: 'Mathematics for Machine Learning', provider: 'Imperial College', duration: '12 hours' }]
        }
      },
      {
        id: 'node-scikit-core',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'scikit-learn',
          name: 'Classical ML & Scikit-Learn',
          category: 'Statistical Modeling',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 90,
          prerequisites: ['Linear Algebra & Calculus'],
          evidence: ['Model evaluation benchmarks'],
          whyNeeded: 'Decision trees, Random Forests, Gradient Boosted Trees (XGBoost), and cross-validation.',
          resources: [{ title: 'Hands-On Machine Learning', provider: "O'Reilly", duration: '14 hours' }]
        }
      },
      {
        id: 'node-pytorch-core',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 160 },
        data: {
          skillId: 'pytorch',
          name: 'PyTorch & Deep Neural Nets',
          category: 'Deep Learning',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 72,
          prerequisites: ['Classical ML & Scikit-Learn'],
          evidence: ['PyTorch CNN classifier'],
          whyNeeded: 'Tensors, autograd backpropagation, custom loss functions, and CUDA GPU acceleration.',
          resources: [{ title: 'Deep Learning with PyTorch', provider: 'PyTorch', duration: '10 hours' }]
        }
      },
      {
        id: 'node-transformers-core',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 360 },
        data: {
          skillId: 'transformers',
          name: 'Transformers & Self-Attention',
          category: 'Sequence Architectures',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 68,
          prerequisites: ['Classical ML & Scikit-Learn'],
          evidence: ['HuggingFace pipeline fine-tuning'],
          whyNeeded: 'Multi-head self-attention, positional encoding, and Hugging Face model checkpoints.',
          resources: [{ title: 'Transformers for Natural Language Processing', provider: 'Hugging Face', duration: '8 hours' }]
        }
      },
      {
        id: 'node-ml-optimization',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 260 },
        data: {
          skillId: 'model-optimization',
          name: 'Model Optimization & ONNX',
          category: 'Inference Acceleration',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['PyTorch & Deep Neural Nets'],
          evidence: [],
          whyNeeded: 'Quantization (INT8/FP16), pruning, ONNX runtime export, and TensorRT optimization.',
          resources: [{ title: 'Efficient Deep Learning Systems', provider: 'Stanford CS229', duration: '8 hours' }]
        }
      },
      {
        id: 'node-ml-serving',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 260 },
        data: {
          skillId: 'model-serving',
          name: 'Dockerized Model Serving',
          category: 'Production Inference',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['Model Optimization & ONNX'],
          evidence: ['FastAPI model inference container'],
          whyNeeded: 'Low-latency REST / gRPC microservices, batch prediction, and container health monitors.',
          resources: [{ title: 'Deploying Machine Learning Models', provider: 'Coursera', duration: '6 hours' }]
        }
      },
      {
        id: 'node-target-ml',
        type: 'targetCareerNode',
        position: { x: 1540, y: 260 },
        data: {
          roleTitle: 'Machine Learning Core Engineer',
          targetSalary: '₹13,00,000 – ₹22,00,000 / yr',
          coveragePercentage: 72,
          readyToApply: true,
          topMatchCompanies: ['NVIDIA', 'Google', 'Meta', 'Amazon', 'Microsoft']
        }
      }
    ],
    edges: [
      makeEdge('e-math-scikit', 'node-math-py', 'node-scikit-core', false, true),
      makeEdge('e-scikit-torch', 'node-scikit-core', 'node-pytorch-core', true, false),
      makeEdge('e-scikit-trans', 'node-scikit-core', 'node-transformers-core', false, false),
      makeEdge('e-torch-opt', 'node-pytorch-core', 'node-ml-optimization', false, false),
      makeEdge('e-trans-opt', 'node-transformers-core', 'node-ml-optimization', false, false),
      makeEdge('e-opt-serving', 'node-ml-optimization', 'node-ml-serving', false, true),
      makeEdge('e-serving-target-ml', 'node-ml-serving', 'node-target-ml', false, true)
    ]
  },

  'PATH-MLOPS-ENG': {
    pathwayId: 'PATH-MLOPS-ENG',
    roleId: 'ai-engineer',
    roleTitle: 'AI / MLOps Production Engineer',
    targetSalary: '₹12,50,000 – ₹21,00,000 / yr',
    stats: { verifiedCount: 5, partialCount: 2, missingCount: 1, totalSkills: 8, coverage: 74 },
    recommendedNextId: 'node-mlflow-tracking',
    nodes: [
      {
        id: 'node-docker-git-ml',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'docker-git',
          name: 'Docker & Git Version Control',
          category: 'Software Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 94,
          prerequisites: ['None (Foundational)'],
          evidence: ['The Linux Foundation LFD102 Verified'],
          whyNeeded: 'Deterministic environment reproducibility, image builds, and multi-stage container artifacts.',
          resources: [{ title: 'Docker Deep Dive', provider: 'Nigel Poulton', duration: '6 hours' }]
        }
      },
      {
        id: 'node-ml-packaging',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'ml-packaging',
          name: 'Python ML Model Packaging',
          category: 'Packaging',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['Docker & Git Version Control'],
          evidence: ['PyTest and Poetry model packages'],
          whyNeeded: 'Dependency isolation, serialized model artifacts (.pt, .onnx), and schema checks.',
          resources: [{ title: 'Packaging Python Applications', provider: 'Python Org', duration: '4 hours' }]
        }
      },
      {
        id: 'node-mlflow-tracking',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 160 },
        data: {
          skillId: 'mlflow',
          name: 'MLflow Experiment Tracking',
          category: 'Experiment Management',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 72,
          prerequisites: ['Python ML Model Packaging'],
          evidence: ['Local MLflow tracking server'],
          whyNeeded: 'Parameter tracking, metric logging, model lineage, and model registry lifecycle.',
          resources: [{ title: 'MLflow Documentation & Quickstart', provider: 'Databricks', duration: '5 hours' }]
        }
      },
      {
        id: 'node-pipelines-airflow',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 360 },
        data: {
          skillId: 'airflow-kubeflow',
          name: 'Airflow & Kubeflow Pipelines',
          category: 'Orchestration',
          status: 'partial',
          isRecommendedNext: false,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 66,
          prerequisites: ['Python ML Model Packaging'],
          evidence: ['DAG pipeline definitions'],
          whyNeeded: 'Automated continuous training (CT), pipeline DAGs, and data transformation workers.',
          resources: [{ title: 'Data Pipelines with Apache Airflow', provider: 'Manning', duration: '8 hours' }]
        }
      },
      {
        id: 'node-drift-monitoring',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 260 },
        data: {
          skillId: 'model-monitoring',
          name: 'Model Drift & Prometheus',
          category: 'Observability',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['MLflow Experiment Tracking'],
          evidence: [],
          whyNeeded: 'Detecting data distribution drift, concept drift, latency degradation, and alerting.',
          resources: [{ title: 'Evidently AI Model Monitoring', provider: 'Evidently AI', duration: '5 hours' }]
        }
      },
      {
        id: 'node-k8s-ml',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 260 },
        data: {
          skillId: 'kubernetes',
          name: 'Kubernetes & Cloud Scale',
          category: 'Cloud Infrastructure',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 85,
          prerequisites: ['Model Drift & Prometheus'],
          evidence: ['K8s pod configurations'],
          whyNeeded: 'Horizontal pod autoscaling (HPA), GPU node scheduling, and rolling deployments.',
          resources: [{ title: 'Kubernetes for Machine Learning', provider: 'O\'Reilly', duration: '8 hours' }]
        }
      },
      {
        id: 'node-target-mlops',
        type: 'targetCareerNode',
        position: { x: 1540, y: 260 },
        data: {
          roleTitle: 'AI / MLOps Production Engineer',
          targetSalary: '₹12,50,000 – ₹21,00,000 / yr',
          coveragePercentage: 74,
          readyToApply: true,
          topMatchCompanies: ['Databricks', 'Snowflake', 'Uber', 'Scale AI', 'Red Hat']
        }
      }
    ],
    edges: [
      makeEdge('e-dock-pkg', 'node-docker-git-ml', 'node-ml-packaging', false, true),
      makeEdge('e-pkg-mlflow', 'node-ml-packaging', 'node-mlflow-tracking', true, false),
      makeEdge('e-pkg-airflow', 'node-ml-packaging', 'node-pipelines-airflow', false, false),
      makeEdge('e-mlflow-drift', 'node-mlflow-tracking', 'node-drift-monitoring', false, false),
      makeEdge('e-airflow-drift', 'node-pipelines-airflow', 'node-drift-monitoring', false, false),
      makeEdge('e-drift-k8s', 'node-drift-monitoring', 'node-k8s-ml', false, true),
      makeEdge('e-k8s-target-mlops', 'node-k8s-ml', 'node-target-mlops', false, true)
    ]
  },

  'PATH-AI-GENAI': {
    pathwayId: 'PATH-AI-GENAI',
    roleId: 'ai-engineer',
    roleTitle: 'Generative AI & Agent Architect',
    targetSalary: '₹14,00,000 – ₹24,00,000 / yr',
    stats: { verifiedCount: 5, partialCount: 2, missingCount: 1, totalSkills: 8, coverage: 76 },
    recommendedNextId: 'node-lora-finetuning',
    nodes: [
      {
        id: 'node-transformer-genai',
        type: 'horizontalSkillNode',
        position: { x: 50, y: 260 },
        data: {
          skillId: 'transformer-foundations',
          name: 'Transformer Architectures',
          category: 'Foundations',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 92,
          prerequisites: ['Python & PyTorch'],
          evidence: ['Verified Transformer coursework'],
          whyNeeded: 'Encoder-decoder models, decoder-only LLMs (Llama/GPT), and context window limits.',
          resources: [{ title: 'Attention Is All You Need Paper Walkthrough', provider: 'Hugging Face', duration: '6 hours' }]
        }
      },
      {
        id: 'node-lora-finetuning',
        type: 'horizontalSkillNode',
        position: { x: 340, y: 260 },
        data: {
          skillId: 'peft-lora',
          name: 'Fine-Tuning (PEFT & LoRA)',
          category: 'Model Adaptation',
          status: 'partial',
          isRecommendedNext: true,
          currentLevel: 'Intermediate',
          requiredLevel: 'Advanced',
          score: 72,
          prerequisites: ['Transformer Architectures'],
          evidence: ['Local LoRA adapter script'],
          whyNeeded: 'Low-rank adaptation, parameter-efficient fine-tuning (PEFT), and quantized QLoRA.',
          resources: [{ title: 'Fine-Tuning LLMs with Hugging Face & TRL', provider: 'DeepLearning.AI', duration: '6 hours' }]
        }
      },
      {
        id: 'node-rag-hybrid',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 160 },
        data: {
          skillId: 'hybrid-search-rag',
          name: 'Hybrid Search & Multi-Query RAG',
          category: 'Advanced RAG',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 88,
          prerequisites: ['Fine-Tuning (PEFT & LoRA)'],
          evidence: ['Chroma + BM25 reciprocal rank fusion'],
          whyNeeded: 'Reciprocal Rank Fusion (RRF), cross-encoder re-ranking, and chunk optimization.',
          resources: [{ title: 'Advanced Retrieval for AI', provider: 'Cohere', duration: '4 hours' }]
        }
      },
      {
        id: 'node-agent-systems',
        type: 'horizontalSkillNode',
        position: { x: 640, y: 360 },
        data: {
          skillId: 'agentic-architectures',
          name: 'Multi-Agent Frameworks',
          category: 'Agent Orchestration',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 86,
          prerequisites: ['Fine-Tuning (PEFT & LoRA)'],
          evidence: ['CrewAI multi-agent project'],
          whyNeeded: 'Role-playing agents, tool utilization, reflection steps, and deterministic execution.',
          resources: [{ title: 'Multi AI Agent Systems with crewAI', provider: 'DeepLearning.AI', duration: '5 hours' }]
        }
      },
      {
        id: 'node-guardrails-eval',
        type: 'horizontalSkillNode',
        position: { x: 940, y: 260 },
        data: {
          skillId: 'ai-guardrails',
          name: 'LLM Evaluation & Guardrails',
          category: 'Safety & Quality',
          status: 'missing',
          isRecommendedNext: false,
          currentLevel: 'None',
          requiredLevel: 'Intermediate',
          score: 0,
          prerequisites: ['Hybrid Search & Multi-Query RAG'],
          evidence: [],
          whyNeeded: 'Ragas evaluation framework, NeMo Guardrails, PII redaction, and prompt injection defense.',
          resources: [{ title: 'LLM Evaluation and Safety', provider: 'DeepLearning.AI', duration: '6 hours' }]
        }
      },
      {
        id: 'node-vllm-serving',
        type: 'horizontalSkillNode',
        position: { x: 1240, y: 260 },
        data: {
          skillId: 'vllm-serving',
          name: 'vLLM & High-Throughput Serving',
          category: 'Inference Engines',
          status: 'verified',
          isRecommendedNext: false,
          currentLevel: 'Advanced',
          requiredLevel: 'Advanced',
          score: 89,
          prerequisites: ['LLM Evaluation & Guardrails'],
          evidence: ['vLLM inference benchmarking'],
          whyNeeded: 'PagedAttention, continuous batching, tensor parallelism, and low TTFT token generation.',
          resources: [{ title: 'vLLM High-Throughput Engine', provider: 'vLLM Team', duration: '4 hours' }]
        }
      },
      {
        id: 'node-target-genai',
        type: 'targetCareerNode',
        position: { x: 1540, y: 260 },
        data: {
          roleTitle: 'Generative AI & Agent Architect',
          targetSalary: '₹14,00,000 – ₹24,00,000 / yr',
          coveragePercentage: 76,
          readyToApply: true,
          topMatchCompanies: ['Anthropic', 'OpenAI', 'Together AI', 'Microsoft AI', 'Mistral AI']
        }
      }
    ],
    edges: [
      makeEdge('e-trans-lora', 'node-transformer-genai', 'node-lora-finetuning', true, false),
      makeEdge('e-lora-rag', 'node-lora-finetuning', 'node-rag-hybrid', false, true),
      makeEdge('e-lora-agent', 'node-lora-finetuning', 'node-agent-systems', false, true),
      makeEdge('e-rag-guard', 'node-rag-hybrid', 'node-guardrails-eval', false, false),
      makeEdge('e-agent-guard', 'node-agent-systems', 'node-guardrails-eval', false, false),
      makeEdge('e-guard-vllm', 'node-guardrails-eval', 'node-vllm-serving', false, true),
      makeEdge('e-vllm-target-genai', 'node-vllm-serving', 'node-target-genai', false, true)
    ]
  }
};
