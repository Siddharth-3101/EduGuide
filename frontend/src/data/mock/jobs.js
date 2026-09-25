export const MOCK_JOBS = [
  {
    id: 'job-1',
    title: 'Junior Backend Developer',
    company: 'TechNova Solutions',
    logoUrl: 'TN',
    location: 'Bangalore, India',
    workplaceType: 'Hybrid',
    employmentType: 'Full-time',
    experienceLevel: 'Entry Level (0-2 yrs)',
    salaryRange: '₹8,50,000 - ₹12,000,000 / yr',
    postedDate: '2 days ago',
    competencyMatch: 78,
    roleCategory: 'Backend Developer',
    matchingSkills: ['Python', 'SQL', 'REST API'],
    partialSkills: ['Spring Boot'],
    missingSkills: ['Docker'],
    requiredCompetencies: [
      { name: 'Python', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'SQL', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'REST API', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'Spring Boot', level: 'Beginner', status: 'partial', matchText: 'Partial (In Progress)' },
      { name: 'Docker', level: 'Intermediate', status: 'missing', matchText: 'Gap (Requires Verification)' }
    ],
    description: 'TechNova is scaling its payments and core ledger engineering group. We are looking for an ambitious junior backend engineer who understands clean API contracts, relational modeling, and asynchronous event processing.',
    responsibilities: [
      'Write modular, well-tested Python endpoints for customer ledger transactions.',
      'Optimize relational database queries in PostgreSQL with appropriate indexing and connection pooling.',
      'Collaborate with DevOps engineers to containerize backend services and deploy to staging environments.',
      'Participate in peer code reviews and contribute to architecture design documentation.'
    ],
    benefits: [
      'Flexible hybrid working model (2 days office / 3 days remote)',
      'Comprehensive health insurance & wellness allowance',
      'Annual learning stipend for technical certifications and books',
      'Modern M3 MacBook Pro provided'
    ],
    applyUrl: 'https://careers.technova.example/jobs/backend-junior-091'
  },
  {
    id: 'job-2',
    title: 'Associate Cloud & Platform Engineer',
    company: 'NexaCloud Systems',
    logoUrl: 'NC',
    location: 'Bengaluru / Remote',
    workplaceType: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: 'Entry Level',
    salaryRange: '₹10,00,000 - ₹14,00,000 / yr',
    postedDate: '5 days ago',
    competencyMatch: 85,
    roleCategory: 'Cloud Engineer',
    matchingSkills: ['Python', 'REST API', 'Git'],
    partialSkills: ['Redis'],
    missingSkills: ['AWS', 'Docker'],
    requiredCompetencies: [
      { name: 'Python', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'REST API', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'Git', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'Docker', level: 'Intermediate', status: 'missing', matchText: 'Gap' },
      { name: 'AWS', level: 'Beginner', status: 'missing', matchText: 'Gap' }
    ],
    description: 'NexaCloud provides autonomous multi-cloud infrastructure orchestration for fintech enterprises. Looking for junior engineers enthusiastic about reliability engineering.',
    responsibilities: [
      'Build internal platform automation scripts using Python.',
      'Maintain continuous delivery pipelines and monitor infrastructure telemetry.',
      'Help standardize Docker container configurations across service repositories.'
    ],
    benefits: ['100% remote', 'Home office budget', 'Annual performance bonus'],
    applyUrl: 'https://nexacloud.example/careers/platform-assoc'
  },
  {
    id: 'job-3',
    title: 'Python Backend Software Engineer',
    company: 'ScaleOps Technologies',
    logoUrl: 'SO',
    location: 'Hyderabad, India',
    workplaceType: 'On-site',
    employmentType: 'Full-time',
    experienceLevel: 'Student / New Grad',
    salaryRange: '₹9,00,000 - ₹13,50,000 / yr',
    postedDate: '1 day ago',
    competencyMatch: 92,
    roleCategory: 'Backend Developer',
    matchingSkills: ['Python', 'SQL', 'REST API', 'Git'],
    partialSkills: [],
    missingSkills: ['Redis'],
    requiredCompetencies: [
      { name: 'Python', level: 'Advanced', status: 'verified', matchText: 'Strong Match' },
      { name: 'SQL', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'REST API', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'Git', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'Redis', level: 'Beginner', status: 'partial', matchText: 'Partial Match' }
    ],
    description: 'ScaleOps builds high-throughput observability agents. We love applicants with demonstrable GitHub projects and verified algorithmic fundamentals.',
    responsibilities: [
      'Develop high-throughput REST and WebSocket servers in Python.',
      'Implement indexing and partitioning on high-volume time-series SQL tables.'
    ],
    benefits: ['Competitive equity package', 'Free catered gourmet lunch', 'Relocation bonus'],
    applyUrl: 'https://scaleops.example/careers/python-engineer'
  },
  {
    id: 'job-4',
    title: 'API & Microservices Specialist',
    company: 'FinPulse Systems',
    logoUrl: 'FP',
    location: 'Mumbai, India',
    workplaceType: 'Hybrid',
    employmentType: 'Full-time',
    experienceLevel: 'Entry Level (1-2 yrs)',
    salaryRange: '₹11,00,000 - ₹15,00,000 / yr',
    postedDate: '3 days ago',
    competencyMatch: 70,
    roleCategory: 'Backend Developer',
    matchingSkills: ['REST API', 'SQL'],
    partialSkills: ['Spring Boot', 'Redis'],
    missingSkills: ['Docker', 'AWS'],
    requiredCompetencies: [
      { name: 'REST API', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'SQL', level: 'Intermediate', status: 'verified', matchText: 'Strong Match' },
      { name: 'Spring Boot', level: 'Intermediate', status: 'partial', matchText: 'Partial' },
      { name: 'Docker', level: 'Intermediate', status: 'missing', matchText: 'Gap' }
    ],
    description: 'Help build open banking APIs that power millions of real-time transactions daily.',
    responsibilities: [
      'Design idempotent banking APIs following ISO20022 schemas.',
      'Maintain rigorous unit and integration test coverage above 85%.'
    ],
    benefits: ['Medical coverage for family', 'Stock purchase plan', '401k match'],
    applyUrl: 'https://finpulse.example/jobs/api-specialist'
  }
];
