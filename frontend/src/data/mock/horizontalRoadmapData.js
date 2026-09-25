import { MarkerType } from '@xyflow/react';

/**
 * Structured Horizontal Career Skill Graph Data
 * Supports Left -> Right visual travel, parallel branches,
 * prerequisite connections, and dynamic progress verification.
 */

export const BACKEND_DEVELOPER_ROADMAP = {
  roleId: 'backend-developer',
  roleTitle: 'Backend Developer',
  targetSalary: '₹9,50,000 – ₹16,00,000 / yr',
  stats: {
    verifiedCount: 5,
    partialCount: 3,
    missingCount: 3,
    totalSkills: 11,
    coverage: 45
  },
  recommendedNextId: 'node-spring-boot',

  // 12 Nodes (11 Skills + 1 Milestone Target Career)
  // X spacing: Left (50) -> Right (1800)
  nodes: [
    // Column 1: Basics (x: 50)
    {
      id: 'node-programming-basics',
      type: 'horizontalSkillNode',
      position: { x: 50, y: 260 },
      data: {
        skillId: 'programming-basics',
        name: 'Programming Basics',
        category: 'Fundamentals',
        status: 'verified', // 'verified' | 'partial' | 'missing'
        isRecommendedNext: false,
        currentLevel: 'Advanced',
        requiredLevel: 'Advanced',
        score: 95,
        prerequisites: ['None (Foundational)'],
        evidence: ['CS101 University Transcript', 'Algorithmic Test Pass'],
        whyNeeded: 'Essential foundation for procedural control flow, data structures, and algorithmic complexity.',
        resources: [
          { title: 'CS50 Introduction to Computer Science', provider: 'edX / Harvard', duration: '12 hours' }
        ],
        assessmentId: 'asm-prog-basics'
      }
    },

    // Column 2: Python (x: 340)
    {
      id: 'node-python',
      type: 'horizontalSkillNode',
      position: { x: 340, y: 260 },
      data: {
        skillId: 'python',
        name: 'Python',
        category: 'Core Language',
        status: 'verified',
        isRecommendedNext: false,
        currentLevel: 'Advanced',
        requiredLevel: 'Advanced',
        score: 89,
        prerequisites: ['Programming Basics'],
        evidence: ['SkillBridge Python Assessment (89%)', 'GitHub FastAPI Repository'],
        whyNeeded: 'Primary backend language for high-velocity API development, scripting, and data pipelines.',
        resources: [
          { title: 'Fluent Python: Clear, Concise, and Effective', provider: "O'Reilly", duration: '8 hours' }
        ],
        assessmentId: 'asm-python'
      }
    },

    // Column 3: Parallel Branches (x: 640)
    // Branch Top: SQL
    {
      id: 'node-sql',
      type: 'horizontalSkillNode',
      position: { x: 640, y: 80 },
      data: {
        skillId: 'sql',
        name: 'SQL',
        category: 'Data Persistence',
        status: 'verified',
        isRecommendedNext: false,
        currentLevel: 'Advanced',
        requiredLevel: 'Advanced',
        score: 92,
        prerequisites: ['Python'],
        evidence: ['PostgreSQL Assessment Score: 92%', 'Complex Joins Evidence'],
        whyNeeded: 'Relational data retrieval, indexing, ACID transactions, and query optimization.',
        resources: [
          { title: 'High Performance PostgreSQL Indexing', provider: 'PostgreSQL Docs', duration: '4 hours' }
        ],
        assessmentId: 'asm-sql'
      }
    },
    // Branch Middle: REST APIs
    {
      id: 'node-rest-apis',
      type: 'horizontalSkillNode',
      position: { x: 640, y: 260 },
      data: {
        skillId: 'rest-apis',
        name: 'REST APIs',
        category: 'API Standards',
        status: 'verified',
        isRecommendedNext: false,
        currentLevel: 'Advanced',
        requiredLevel: 'Advanced',
        score: 94,
        prerequisites: ['Python'],
        evidence: ['OpenAPI 3.1 Specification Project', 'HTTP Method Auditing'],
        whyNeeded: 'Standardized client-server contract design, HTTP status codes, and idempotency guarantees.',
        resources: [
          { title: 'RESTful API Architecture Patterns', provider: 'API Academy', duration: '3 hours' }
        ],
        assessmentId: 'asm-rest'
      }
    },
    // Branch Bottom: Git
    {
      id: 'node-git',
      type: 'horizontalSkillNode',
      position: { x: 640, y: 440 },
      data: {
        skillId: 'git',
        name: 'Git',
        category: 'Version Control',
        status: 'verified',
        isRecommendedNext: false,
        currentLevel: 'Intermediate',
        requiredLevel: 'Intermediate',
        score: 88,
        prerequisites: ['Python'],
        evidence: ['GitHub Continuous Commit History', 'Pull Request Review Workflow'],
        whyNeeded: 'Distributed version control, merge conflict resolution, branch protection, and collaboration.',
        resources: [
          { title: 'Pro Git Documentation', provider: 'Git-SCM', duration: '2 hours' }
        ],
        assessmentId: 'asm-git'
      }
    },

    // Column 4: Intermediate Systems (x: 940)
    // Branch Top: Database Design
    {
      id: 'node-database-design',
      type: 'horizontalSkillNode',
      position: { x: 940, y: 80 },
      data: {
        skillId: 'database-design',
        name: 'Database Design',
        category: 'Database Architecture',
        status: 'partial',
        isRecommendedNext: false,
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
        score: 65,
        prerequisites: ['SQL'],
        evidence: ['Schema Entity-Relationship Diagram in Student Management API'],
        whyNeeded: 'Normalization (3NF), foreign key integrity constraints, and query query execution plans.',
        resources: [
          { title: 'Database Internals & Schema Normalization', provider: 'Coursera', duration: '6 hours' }
        ],
        assessmentId: 'asm-db-design'
      }
    },
    // Branch Middle: Backend Architecture
    {
      id: 'node-backend-architecture',
      type: 'horizontalSkillNode',
      position: { x: 940, y: 260 },
      data: {
        skillId: 'backend-architecture',
        name: 'Backend Architecture',
        category: 'System Design',
        status: 'partial',
        isRecommendedNext: false,
        currentLevel: 'Intermediate',
        requiredLevel: 'Advanced',
        score: 60,
        prerequisites: ['REST APIs', 'SQL'],
        evidence: ['FastAPI Service Layer Decoupling'],
        whyNeeded: 'Layered architecture (controller, service, repository), dependency injection, and clean separation.',
        resources: [
          { title: 'Clean Architecture in Modern Web Backends', provider: 'System Design Course', duration: '5 hours' }
        ],
        assessmentId: 'asm-backend-arch'
      }
    },
    // Branch Bottom: CI/CD
    {
      id: 'node-cicd',
      type: 'horizontalSkillNode',
      position: { x: 940, y: 440 },
      data: {
        skillId: 'cicd',
        name: 'CI/CD',
        category: 'Automation',
        status: 'partial',
        isRecommendedNext: false,
        currentLevel: 'Beginner',
        requiredLevel: 'Intermediate',
        score: 55,
        prerequisites: ['Git'],
        evidence: ['GitHub Actions workflow file in repository'],
        whyNeeded: 'Automated test execution, linting pipelines, and automated artifact build triggers on push.',
        resources: [
          { title: 'Automating Deployments with GitHub Actions', provider: 'GitHub Learning Lab', duration: '3 hours' }
        ],
        assessmentId: 'asm-cicd'
      }
    },

    // Column 5: Advanced Frameworks & Containers (x: 1240)
    // Spring Boot (Recommended Next)
    {
      id: 'node-spring-boot',
      type: 'horizontalSkillNode',
      position: { x: 1240, y: 140 },
      data: {
        skillId: 'spring-boot',
        name: 'Spring Boot',
        category: 'Enterprise Framework',
        status: 'missing',
        isRecommendedNext: true, // 🔵 RECOMMENDED NEXT
        currentLevel: 'None',
        requiredLevel: 'Intermediate',
        score: 0,
        prerequisites: ['Backend Architecture', 'Database Design'],
        evidence: ['None - Verification Required'],
        whyNeeded: 'Enterprise Java standard for scalable corporate backends. Required by 68% of enterprise job postings.',
        resources: [
          { title: 'Building REST Services with Spring Boot 3', provider: 'Spring Official Guides', duration: '6 hours' },
          { title: 'Spring Data JPA & Hibernate Fundamentals', provider: 'Udemy', duration: '8 hours' }
        ],
        assessmentId: 'asm-spring-boot'
      }
    },
    // Docker
    {
      id: 'node-docker',
      type: 'horizontalSkillNode',
      position: { x: 1240, y: 350 },
      data: {
        skillId: 'docker',
        name: 'Docker',
        category: 'DevOps & Containers',
        status: 'missing',
        isRecommendedNext: false,
        currentLevel: 'None',
        requiredLevel: 'Intermediate',
        score: 0,
        prerequisites: ['Backend Architecture', 'CI/CD'],
        evidence: ['Dockerfile present in Student Management API (Needs Assessment)'],
        whyNeeded: 'Container packaging, reproducible development environments, and isolated microservices.',
        resources: [
          { title: 'Docker Deep Dive: Container Mastery', provider: 'Pluralsight', duration: '5 hours' },
          { title: 'Multi-stage Dockerfile Optimization', provider: 'Docker Docs', duration: '2 hours' }
        ],
        assessmentId: 'docker'
      }
    },

    // Column 6: Cloud Architecture (x: 1540)
    {
      id: 'node-cloud-architecture',
      type: 'horizontalSkillNode',
      position: { x: 1540, y: 260 },
      data: {
        skillId: 'cloud-architecture',
        name: 'Cloud Architecture',
        category: 'Cloud Infrastructure',
        status: 'missing',
        isRecommendedNext: false,
        currentLevel: 'None',
        requiredLevel: 'Intermediate',
        score: 0,
        prerequisites: ['Docker', 'Spring Boot'],
        evidence: ['None'],
        whyNeeded: 'Serverless functions, container orchestration, managed databases, and cloud resilience.',
        resources: [
          { title: 'AWS Cloud Solutions Architecture Basics', provider: 'AWS Skill Builder', duration: '7 hours' }
        ],
        assessmentId: 'asm-cloud-arch'
      }
    },

    // Column 7: Target Career Milestone Node (x: 1840)
    {
      id: 'node-target-career',
      type: 'targetCareerNode',
      position: { x: 1840, y: 220 },
      data: {
        skillId: 'target-career',
        title: 'Backend Developer',
        subtitle: 'Target Career Goal',
        verifiedSkillsCount: 5,
        totalSkillsCount: 11,
        coveragePercentage: 45,
        isCompleted: false
      }
    }
  ],

  // Prerequisite Edges (Left -> Right)
  edges: [
    // Programming Basics -> Python
    {
      id: 'e-basics-python',
      source: 'node-programming-basics',
      target: 'node-python',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981', width: 16, height: 16 }
    },

    // Python -> SQL (Branch Up)
    {
      id: 'e-python-sql',
      source: 'node-python',
      target: 'node-sql',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981', width: 16, height: 16 }
    },
    // Python -> REST APIs (Center)
    {
      id: 'e-python-rest',
      source: 'node-python',
      target: 'node-rest-apis',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981', width: 16, height: 16 }
    },
    // Python -> Git (Branch Down)
    {
      id: 'e-python-git',
      source: 'node-python',
      target: 'node-git',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#10b981', strokeWidth: 2.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981', width: 16, height: 16 }
    },

    // SQL -> Database Design
    {
      id: 'e-sql-dbdesign',
      source: 'node-sql',
      target: 'node-database-design',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 }
    },
    // REST APIs -> Backend Architecture
    {
      id: 'e-rest-backendarch',
      source: 'node-rest-apis',
      target: 'node-backend-architecture',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 }
    },
    // SQL -> Backend Architecture (Convergence)
    {
      id: 'e-sql-backendarch',
      source: 'node-sql',
      target: 'node-backend-architecture',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#f59e0b', strokeWidth: 1.5, strokeDasharray: '4 4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 14, height: 14 }
    },
    // Git -> CI/CD
    {
      id: 'e-git-cicd',
      source: 'node-git',
      target: 'node-cicd',
      type: 'smoothstep',
      animated: false,
      style: { stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b', width: 16, height: 16 }
    },

    // Backend Architecture -> Spring Boot
    {
      id: 'e-backendarch-springboot',
      source: 'node-backend-architecture',
      target: 'node-spring-boot',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', width: 16, height: 16 }
    },
    // Database Design -> Spring Boot
    {
      id: 'e-dbdesign-springboot',
      source: 'node-database-design',
      target: 'node-spring-boot',
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#3b82f6', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6', width: 16, height: 16 }
    },

    // Backend Architecture -> Docker
    {
      id: 'e-backendarch-docker',
      source: 'node-backend-architecture',
      target: 'node-docker',
      type: 'smoothstep',
      animated: false,
      style: { stroke: 'rgba(150, 150, 150, 0.4)', strokeWidth: 1.5, strokeDasharray: '3 3' },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(150, 150, 150, 0.5)', width: 14, height: 14 }
    },
    // CI/CD -> Docker
    {
      id: 'e-cicd-docker',
      source: 'node-cicd',
      target: 'node-docker',
      type: 'smoothstep',
      animated: false,
      style: { stroke: 'rgba(150, 150, 150, 0.4)', strokeWidth: 1.5, strokeDasharray: '3 3' },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(150, 150, 150, 0.5)', width: 14, height: 14 }
    },

    // Docker -> Cloud Architecture
    {
      id: 'e-docker-cloud',
      source: 'node-docker',
      target: 'node-cloud-architecture',
      type: 'smoothstep',
      animated: false,
      style: { stroke: 'rgba(150, 150, 150, 0.4)', strokeWidth: 1.5, strokeDasharray: '3 3' },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(150, 150, 150, 0.5)', width: 14, height: 14 }
    },
    // Spring Boot -> Cloud Architecture
    {
      id: 'e-springboot-cloud',
      source: 'node-spring-boot',
      target: 'node-cloud-architecture',
      type: 'smoothstep',
      animated: false,
      style: { stroke: 'rgba(150, 150, 150, 0.4)', strokeWidth: 1.5, strokeDasharray: '3 3' },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(150, 150, 150, 0.5)', width: 14, height: 14 }
    },

    // Cloud Architecture -> Target Career
    {
      id: 'e-cloud-target',
      source: 'node-cloud-architecture',
      target: 'node-target-career',
      type: 'smoothstep',
      animated: false,
      style: { stroke: 'rgba(150, 150, 150, 0.4)', strokeWidth: 2, strokeDasharray: '4 4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(150, 150, 150, 0.5)', width: 16, height: 16 }
    },
    // Spring Boot -> Target Career (Direct enterprise branch)
    {
      id: 'e-springboot-target',
      source: 'node-spring-boot',
      target: 'node-target-career',
      type: 'smoothstep',
      animated: false,
      style: { stroke: 'rgba(150, 150, 150, 0.3)', strokeWidth: 1.5, strokeDasharray: '4 4' },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(150, 150, 150, 0.4)', width: 14, height: 14 }
    }
  ]
};
