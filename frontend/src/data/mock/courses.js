export const MOCK_COURSES = [
  {
    id: 'course-docker-101',
    title: 'Docker for Backend Engineers & Microservices',
    provider: 'SkillBridge Academy',
    duration: '4.5 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    rating: 4.8,
    enrolledCount: 1420,
    skillId: 'docker',
    targetRole: 'Backend Developer',
    whyRecommended: 'This course directly covers the competencies currently missing from your Backend Developer roadmap (Containerization & Deployment).',
    competenciesCovered: [
      'Multi-stage Dockerfile architecture',
      'Docker Compose for multi-container apps',
      'Production container security best practices',
      'Healthchecks and zero-downtime restarts'
    ],
    modules: [
      { id: 'm1', title: 'Why Containers Matter for Production Backend', duration: '35 mins' },
      { id: 'm2', title: 'Building Minimal Images with Alpine & Multi-Stage', duration: '55 mins' },
      { id: 'm3', title: 'Managing Persistent Volumes & PostgreSQL Containers', duration: '60 mins' },
      { id: 'm4', title: 'Local Orchestration with Docker Compose', duration: '70 mins' },
      { id: 'm5', title: 'Deploying to ECS / Cloud Containers', duration: '50 mins' }
    ]
  },
  {
    id: 'course-spring-micro',
    title: 'Building Enterprise Microservices with Spring Boot 3',
    provider: 'Enterprise Java Lab',
    duration: '8 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    rating: 4.7,
    enrolledCount: 980,
    skillId: 'spring-boot',
    targetRole: 'Backend Developer',
    whyRecommended: 'You currently have a partial competency score (54%) in Spring Boot. Completing this will elevate your level to Intermediate.',
    competenciesCovered: [
      'Spring Data JPA and Hibernate query tuning',
      'REST controller validation with Jakarta Beans',
      'Spring Security OAuth2 JWT integration',
      'Service discovery with Eureka / Consul'
    ],
    modules: [
      { id: 'sm1', title: 'Architecture of Modern Spring 3 Apps', duration: '45 mins' },
      { id: 'sm2', title: 'Repository Patterns & SQL Join Optimization', duration: '90 mins' },
      { id: 'sm3', title: 'Securing Endpoints with JWT Roles', duration: '75 mins' },
      { id: 'sm4', title: 'Handling Async Events with Kafka', duration: '80 mins' }
    ]
  },
  {
    id: 'course-aws-essentials',
    title: 'AWS Cloud Primitives: Compute, VPC & S3',
    provider: 'Cloud Native Foundation',
    duration: '6 hours',
    difficulty: 'Beginner',
    price: 'Free',
    rating: 4.9,
    enrolledCount: 3200,
    skillId: 'aws',
    targetRole: 'Backend Developer',
    whyRecommended: 'AWS primitives are required by 82% of current Backend Developer listings matching your profile.',
    competenciesCovered: [
      'Virtual Private Cloud (VPC) subnet isolation',
      'EC2, Security Groups and Key Pairs',
      'S3 bucket access policies and presigned URLs',
      'IAM least privilege roles for backend services'
    ],
    modules: [
      { id: 'am1', title: 'AWS Global Infrastructure & Console', duration: '30 mins' },
      { id: 'am2', title: 'Designing Secure VPC Topologies', duration: '85 mins' },
      { id: 'am3', title: 'Deploying Scalable EC2 & Auto Scaling', duration: '75 mins' },
      { id: 'am4', title: 'IAM Roles vs User Credentials', duration: '60 mins' }
    ]
  },
  {
    id: 'course-redis-caching',
    title: 'High-Throughput Caching & Rate Limiting with Redis',
    provider: 'Performance Academy',
    duration: '3.5 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    rating: 4.8,
    enrolledCount: 840,
    skillId: 'redis',
    targetRole: 'Backend Developer',
    whyRecommended: 'Solidifying your partial Redis competency will help you unlock high-concurrency projects and senior backend requirements.',
    competenciesCovered: [
      'Cache-aside, write-through and write-behind patterns',
      'Sliding window rate limiters with Lua scripts',
      'Redis Pub/Sub vs Redis Streams',
      'Memory eviction policies under load'
    ],
    modules: [
      { id: 'rm1', title: 'Redis Memory Architecture & Data Types', duration: '40 mins' },
      { id: 'rm2', title: 'Implementing Distributed Caching in APIs', duration: '65 mins' },
      { id: 'rm3', title: 'Atomic Operations with Redis Transactions & Lua', duration: '50 mins' }
    ]
  }
];
