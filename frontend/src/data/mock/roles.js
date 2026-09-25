export const MOCK_ROLES = [
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    description: 'Design, build, and optimize scalable server-side applications, data pipelines, and microservice APIs.',
    popularity: 'Very High',
    avgSalary: '$95,000 - $130,000',
    marketDemand: 'High growth',
    requiredSkillsCount: 15,
    topCompanies: ['TechNova', 'Stripe', 'Twilio', 'Shopify', 'AWS'],
    roadmapStages: [
      {
        id: 'stage-1',
        title: 'Core Fundamentals',
        description: 'Language syntax, data structures, algorithms, and core design patterns.',
        competencies: [
          {
            id: 'python',
            name: 'Python',
            level: 'Advanced',
            currentLevel: 'Advanced',
            status: 'verified',
            importance: 'Essential',
            score: 89,
            evidenceType: 'Assessment + Project'
          },
          {
            id: 'sql',
            name: 'SQL & Relational Databases',
            level: 'Intermediate',
            currentLevel: 'Intermediate',
            status: 'verified',
            importance: 'Essential',
            score: 85,
            evidenceType: 'Assessment'
          },
          {
            id: 'git',
            name: 'Git & Version Control',
            level: 'Intermediate',
            currentLevel: 'Intermediate',
            status: 'verified',
            importance: 'Essential',
            score: 92,
            evidenceType: 'Project'
          }
        ]
      },
      {
        id: 'stage-2',
        title: 'API & Service Architecture',
        description: 'RESTful protocol conventions, JSON schemas, authentication, and web frameworks.',
        competencies: [
          {
            id: 'rest-api',
            name: 'REST API Design',
            level: 'Intermediate',
            currentLevel: 'Intermediate',
            status: 'verified',
            importance: 'Essential',
            score: 94,
            evidenceType: 'Assessment + Project'
          },
          {
            id: 'spring-boot',
            name: 'Spring Boot',
            level: 'Intermediate',
            currentLevel: 'Beginner',
            status: 'partial',
            importance: 'Recommended',
            score: 54,
            evidenceType: 'Course in progress'
          },
          {
            id: 'redis',
            name: 'Redis & Caching',
            level: 'Intermediate',
            currentLevel: 'Beginner',
            status: 'partial',
            importance: 'Recommended',
            score: 48,
            evidenceType: 'Practical Task'
          }
        ]
      },
      {
        id: 'stage-3',
        title: 'Containerization & Infrastructure',
        description: 'Packaging applications, deployment pipelines, container orchestration, and cloud primitives.',
        competencies: [
          {
            id: 'docker',
            name: 'Docker',
            level: 'Intermediate',
            currentLevel: 'None',
            status: 'missing',
            importance: 'High Priority',
            score: 0,
            evidenceType: 'None'
          },
          {
            id: 'aws',
            name: 'AWS Cloud Primitives',
            level: 'Beginner',
            currentLevel: 'None',
            status: 'missing',
            importance: 'Recommended',
            score: 0,
            evidenceType: 'None'
          },
          {
            id: 'ci-cd',
            name: 'CI/CD Pipelines (GitHub Actions)',
            level: 'Intermediate',
            currentLevel: 'None',
            status: 'missing',
            importance: 'Recommended',
            score: 0,
            evidenceType: 'None'
          }
        ]
      }
    ]
  },
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Generalist engineering spanning frontend, backend, system architecture, and reliable software delivery.',
    popularity: 'Extremely High',
    avgSalary: '$90,000 - $125,000',
    marketDemand: 'Steady demand',
    requiredSkillsCount: 16,
    topCompanies: ['Microsoft', 'Google', 'Meta', 'Amazon', 'Atlassian']
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Transform raw datasets into actionable commercial intelligence, interactive dashboards, and statistical insights.',
    popularity: 'High',
    avgSalary: '$75,000 - $105,000',
    marketDemand: 'Fast growing',
    requiredSkillsCount: 12,
    topCompanies: ['Snowflake', 'Palantir', 'Deloitte', 'Target', 'Uber']
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Apply machine learning algorithms, exploratory statistics, and predictive modeling to complex domain problems.',
    popularity: 'High',
    avgSalary: '$110,000 - $150,000',
    marketDemand: 'High growth',
    requiredSkillsCount: 18,
    topCompanies: ['OpenAI', 'Anthropic', 'Netflix', 'Airbnb', 'Spotify']
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    description: 'Architect, automate, and administer resilient, secure, and elastic multi-cloud environments.',
    popularity: 'High',
    avgSalary: '$105,000 - $140,000',
    marketDemand: 'Critical shortage',
    requiredSkillsCount: 14,
    topCompanies: ['Cloudflare', 'Datadog', 'HashiCorp', 'Red Hat', 'AWS']
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    description: 'Protect organizational digital assets, audit vulnerabilities, implement zero-trust access, and remediate threats.',
    popularity: 'High',
    avgSalary: '$90,000 - $130,000',
    marketDemand: 'Very High',
    requiredSkillsCount: 13,
    topCompanies: ['CrowdStrike', 'Palo Alto Networks', 'Fortinet', 'Cisco', 'Mandiant']
  }
];
