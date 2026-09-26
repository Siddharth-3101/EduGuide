export const MOCK_USER_PROFILE = {
  id: 'usr-001',
  fullName: 'Siddharth G',
  email: 'siddharth.g@kce.ac.in',
  headline: 'Full Stack & Backend Systems Developer | B.E. Computer Science Senior',
  location: 'Coimbatore, Tamil Nadu, India',
  targetRole: 'Backend Developer',
  targetRoles: ['Backend Developer', 'Full Stack Developer', 'Cloud / DevOps Engineer'],
  experienceLevel: 'Student',
  avatarUrl: null, // Will use initials SG
  bio: 'Computer Science senior at Karpagam College of Engineering focused on distributed systems, relational databases, Docker microservices, and AI-assisted agriculture platforms.',
  education: [
    {
      institution: 'Karpagam College of Engineering',
      degree: 'B.E. in Computer Science and Engineering',
      period: '2022 - 2026',
      grade: '8.19 / 10 CGPA'
    }
  ],
  experience: [
    {
      role: 'Backend Engineering Intern',
      company: 'Tech Innovations Labs',
      period: 'May 2025 - Jul 2025',
      description: 'Engineered high-throughput REST APIs and containerized microservices, optimizing query latency by 35%.'
    }
  ],
  stats: {
    targetRoleTitle: 'Backend Developer',
    competencyCoverage: 84, // percent
    verifiedCount: 8,
    partialCount: 2,
    missingCount: 2,
    assessmentsCompleted: 4,
    projectsSubmitted: 3,
    certificatesCount: 2,
    passportPublicUrl: 'https://skillsync.dev/p/siddharth-g'
  },
  nextBestAction: {
    id: 'nba-docker',
    icon: '🎯',
    title: 'Complete Docker Verification',
    description: 'Verifying Docker boosts your alignment with top backend & DevOps roles to 92% benchmark coverage.',
    buttonText: 'Start Assessment',
    assessmentId: 'asmt-docker',
    route: '/assessments/asmt-docker'
  },
  certificates: [
    {
      id: 'cert-1',
      title: 'Spring Boot Microservices & Cloud Native Systems',
      issuer: 'Oracle / Coursera Certified',
      issueDate: 'Jan 2026',
      credentialUrl: 'https://credentials.example/cert-8891'
    },
    {
      id: 'cert-2',
      title: 'Docker & Kubernetes Containerization Specialist',
      issuer: 'Linux Foundation / CNCF',
      issueDate: 'Nov 2025',
      credentialUrl: 'https://credentials.example/cert-4421'
    }
  ],
  socials: {
    github: 'https://github.com/siddharth-g',
    linkedin: 'https://linkedin.com/in/siddharth-g-dev',
    portfolio: 'https://siddharth-g.dev'
  }
};
