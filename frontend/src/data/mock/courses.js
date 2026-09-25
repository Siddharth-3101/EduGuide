export const MOCK_COURSES = [
  // DOCKER (Critical Skill Gap)
  {
    id: 'res-docker-1',
    title: 'Docker Fundamentals for Modern Applications',
    provider: 'Coursera / Linux Foundation',
    type: 'Course',
    duration: '5 hours',
    difficulty: 'Beginner',
    price: 'Free Audit',
    isFree: true,
    rating: 4.8,
    skillId: 'docker',
    skillName: 'Docker',
    targetRole: 'Backend Developer',
    externalUrl: 'https://www.coursera.org/learn/docker-fundamentals',
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
    title: 'Official Docker CLI & Compose Documentation',
    provider: 'Docker Official',
    type: 'Documentation',
    duration: 'Reference / Self-paced',
    difficulty: 'All Levels',
    price: 'Free',
    isFree: true,
    rating: 4.9,
    skillId: 'docker',
    skillName: 'Docker',
    targetRole: 'Backend Developer',
    externalUrl: 'https://docs.docker.com/get-started/',
    whyRecommended: 'The authoritative reference for flags, compose network definitions, and daemon configs.',
    competenciesCovered: [
      'docker-compose.yml specifications',
      'Volume driver configs',
      'Network bridge driver mechanics',
      'Healthcheck directives'
    ]
  },
  {
    id: 'res-docker-3',
    title: 'Docker Practical Crash Course & Hands-on Lab',
    provider: 'YouTube / TechWorld',
    type: 'Video Tutorial',
    duration: '2 hours',
    difficulty: 'Beginner to Intermediate',
    price: 'Free',
    isFree: true,
    rating: 4.9,
    skillId: 'docker',
    skillName: 'Docker',
    targetRole: 'Backend Developer',
    externalUrl: 'https://youtube.com/watch?v=docker-crash-course',
    whyRecommended: 'Fast-paced, hands-on demonstration of containerizing a Python FastAPI + Postgres service.',
    competenciesCovered: [
      'Interactive terminal debugging with docker exec',
      'Multi-container compose linking',
      'Layer caching optimization'
    ]
  },

  // AWS CLOUD (High Priority Gap)
  {
    id: 'res-aws-1',
    title: 'AWS Cloud Primitives: Compute, VPC & S3',
    provider: 'Cloud Native Foundation',
    type: 'Course',
    duration: '6 hours',
    difficulty: 'Beginner',
    price: 'Free',
    isFree: true,
    rating: 4.9,
    skillId: 'aws',
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

  // SPRING BOOT (Medium Priority Gap)
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

  // REDIS CACHING (Low Priority / Partial)
  {
    id: 'res-redis-1',
    title: 'High-Throughput Caching & Rate Limiting with Redis',
    provider: 'Performance Academy',
    type: 'Practical Tutorial',
    duration: '3.5 hours',
    difficulty: 'Intermediate',
    price: 'Free',
    isFree: true,
    rating: 4.8,
    skillId: 'redis',
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
