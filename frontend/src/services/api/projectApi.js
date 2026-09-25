import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_PROJECTS } from '../../data/mock/projects';

let localProjects = [...MOCK_PROJECTS];

export const projectApi = {
  async getProjects() {
    if (USE_MOCK) {
      await delay(120);
      return [...localProjects];
    }
    const response = await apiClient.get('/projects');
    return response.data;
  },

  async getProjectById(projectId) {
    if (USE_MOCK) {
      await delay(100);
      const project = localProjects.find((p) => p.id === projectId) || localProjects[0];
      return project;
    }
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  },

  /**
   * RAG / Document Analysis API Abstraction for GitHub Projects.
   * Frontend triggers this service which will later interface with the backend RAG pipeline.
   * Returns detected technologies, skills, competencies, and evidence confidence.
   */
  async analyzeProject(repositoryUrl) {
    if (USE_MOCK) {
      await delay(800);
      const isDockerRelated = repositoryUrl.toLowerCase().includes('docker') || repositoryUrl.toLowerCase().includes('student') || repositoryUrl.toLowerCase().includes('api');
      
      return {
        project: repositoryUrl.split('/').pop() || 'Repository Analysis',
        repositoryUrl,
        analysisTimestamp: new Date().toISOString(),
        confidence: 0.94,
        technologies: isDockerRelated 
          ? ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Alembic']
          : ['TypeScript', 'Node.js', 'Express', 'Redis'],
        skills: isDockerRelated
          ? ['REST API', 'Database', 'Backend Development', 'Docker']
          : ['REST API', 'Caching', 'Backend Development'],
        competencies: [
          'RESTful Resource Routing & OpenAPI Spec',
          'Database Migrations & Relational Schema Modeling',
          'Multi-stage Dockerfile Layer Optimization',
          'Environment Variable Isolation'
        ],
        evidence: [
          {
            skill: 'Docker',
            evidence: 'Containerized Deployment Spec',
            source: 'GitHub README & docker-compose.yml',
            status: 'Evidence Found',
            action: 'Take Docker Assessment',
            assessmentRoute: '/assessments/docker'
          },
          {
            skill: 'REST API',
            evidence: 'Endpoints with input validation',
            source: 'FastAPI Router',
            status: 'Evidence Found',
            action: 'Verify Competency',
            assessmentRoute: '/assessments/python'
          }
        ]
      };
    }
    const response = await apiClient.post('/projects/analyze', { repositoryUrl });
    return response.data;
  },

  async addProject(projectData) {
    if (USE_MOCK) {
      await delay(450);
      const newId = `proj-${Date.now()}`;
      
      const newProj = {
        id: newId,
        title: projectData.projectName,
        shortDescription: projectData.description,
        projectType: projectData.projectType || 'Backend API',
        skills: Array.isArray(projectData.skillsUsed) 
          ? projectData.skillsUsed 
          : (projectData.skillsUsed || 'Python, Docker, REST API').split(',').map(s => s.trim()),
        difficulty: projectData.difficulty || 'Intermediate',
        estimatedTime: '6–8 hours',
        progress: 80,
        evidenceStatus: 'Evidence Identified',
        skillGapBridged: projectData.skillGapBridged || 'Practical Portfolio Evidence',
        githubRepoUrl: projectData.githubRepoUrl,
        liveDemoUrl: projectData.liveDemoUrl || '',
        detectedTechnologies: projectData.detectedTechnologies || ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
        detectedSkills: projectData.detectedSkills || ['REST API', 'Database', 'Backend Development', 'Docker'],
        skillEvidence: [
          {
            skill: 'Docker',
            evidence: projectData.projectName,
            source: 'GitHub README & Repository Structure',
            status: 'Evidence Found',
            action: 'Take Docker Assessment',
            assessmentRoute: '/assessments/docker'
          }
        ],
        objective: projectData.description,
        requirements: [
          'Clean modular architecture with separated routing and business logic',
          'Automated tests and deployment documentation in README',
          'Production-ready environment configuration'
        ],
        architecture: `Client ──> [API Service: ${projectData.projectName}] ──> [Database / Persistence]`,
        evaluationCriteria: [
          { criterion: 'Architecture Quality', weight: '40%', detail: 'Modular code with clean abstractions' },
          { criterion: 'Documentation', weight: '30%', detail: 'Comprehensive setup instructions in README' },
          { criterion: 'Reliability & Tests', weight: '30%', detail: 'Working test suite with error handling' }
        ],
        submission: {
          githubRepoUrl: projectData.githubRepoUrl,
          branch: 'main',
          commitHash: 'e' + Math.random().toString(36).substring(2, 7),
          submittedAt: new Date().toISOString(),
          status: 'Evidence Identified',
          feedback: 'Repository successfully analyzed. Technical evidence extracted.'
        }
      };

      localProjects.unshift(newProj);
      return newProj;
    }
    const response = await apiClient.post('/projects', projectData);
    return response.data;
  },

  async submitProject(projectId, submissionData) {
    if (USE_MOCK) {
      await delay(450);
      const submission = {
        githubRepoUrl: submissionData.githubRepoUrl,
        branch: submissionData.branch || 'main',
        commitHash: 'c' + Math.random().toString(36).substring(2, 8),
        submittedAt: new Date().toISOString(),
        status: 'Under Review',
        feedback: 'Repository submitted successfully. Automated analysis checks queued.'
      };

      localProjects = localProjects.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            evidenceStatus: 'Under Review',
            progress: 90,
            submission
          };
        }
        return p;
      });

      return localProjects.find((p) => p.id === projectId);
    }
    const response = await apiClient.post(`/projects/${projectId}/submit`, submissionData);
    return response.data;
  }
};
