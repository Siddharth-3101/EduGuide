export const MOCK_USER_PROFILE = {
  id: 'usr-001',
  fullName: 'Alex Chen',
  email: 'alex.chen@university.edu',
  headline: 'Aspiring Backend Systems Engineer | Computer Science senior',
  location: 'Bangalore, India',
  targetRole: 'Backend Developer',
  targetRoles: ['Backend Developer', 'Cloud Engineer'],
  experienceLevel: 'Student',
  avatarUrl: null, // Will use initials AC
  bio: 'Computer Science senior focused on distributed systems, relational databases, and high-performance REST microservices. Actively verifying competencies for production readiness.',
  education: [
    {
      institution: 'National Institute of Technology',
      degree: 'B.Tech in Computer Science and Engineering',
      period: '2022 - 2026',
      grade: '8.8 / 10 CGPA'
    }
  ],
  experience: [
    {
      role: 'Backend Engineering Intern',
      company: 'DataStream Labs',
      period: 'May 2025 - Jul 2025',
      description: 'Built data ingestion worker scripts with Python and SQL, reducing payload transformation lag by 22%.'
    }
  ],
  stats: {
    targetRoleTitle: 'Backend Developer',
    competencyCoverage: 67, // percent
    verifiedCount: 8,
    partialCount: 3,
    missingCount: 4,
    assessmentsCompleted: 3,
    projectsSubmitted: 1,
    certificatesCount: 2,
    passportPublicUrl: 'https://skillbridge.dev/p/alexchen'
  },
  nextBestAction: {
    id: 'nba-docker',
    icon: '🎯',
    title: 'Complete Docker Verification',
    description: 'Verifying Docker could improve your match with 4 out of 5 backend roles by +14% overall coverage.',
    buttonText: 'Start Assessment',
    assessmentId: 'asm-docker',
    route: '/assessments/asm-docker'
  },
  certificates: [
    {
      id: 'cert-1',
      title: 'PostgreSQL Relational Schema Design & Indexing',
      issuer: 'Database Engineering Institute',
      issueDate: 'Jan 2026',
      credentialUrl: 'https://credentials.example/cert-8891'
    },
    {
      id: 'cert-2',
      title: 'Python for High-Performance Distributed Systems',
      issuer: 'Open Source Software Guild',
      issueDate: 'Nov 2025',
      credentialUrl: 'https://credentials.example/cert-4421'
    }
  ],
  socials: {
    github: 'https://github.com/alexchen',
    linkedin: 'https://linkedin.com/in/alexchen-dev',
    portfolio: 'https://alexchen.dev'
  }
};
