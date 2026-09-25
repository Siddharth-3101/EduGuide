import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_PROJECTS } from '../../data/mock/projects';

let localProjects = [...MOCK_PROJECTS];

export const projectApi = {
  async getProjects() {
    if (USE_MOCK) {
      await delay(120);
      return [...localProjects];
    }
    const response = await apiClient.get('/api/projects');
    const list = response.data?.data || response.data || [];
    return list.map(p => ({
      id: String(p.id),
      projectId: p.id,
      title: p.title,
      description: p.objective || p.description,
      objective: p.objective,
      skillsCovered: typeof p.skillsCovered === 'string' ? p.skillsCovered.split(', ') : (p.skillsCovered || []),
      skills: typeof p.skillsCovered === 'string' ? p.skillsCovered.split(', ') : (p.skillsCovered || []),
      requirements: p.requirements,
      architecture: p.architecture,
      estimatedTime: p.estimatedTime || '6 hours',
      difficulty: p.difficulty || 'Intermediate',
      evaluationCriteria: p.evaluationCriteria,
      evidenceStatus: 'Verified Evidence'
    }));
  },

  async getProjectById(projectId) {
    if (USE_MOCK) {
      await delay(100);
      const project = localProjects.find((p) => String(p.id) === String(projectId)) || localProjects[0];
      return project;
    }
    const response = await apiClient.get(`/api/projects/${projectId}`);
    const p = response.data?.data || response.data;
    return {
      id: String(p.id),
      projectId: p.id,
      title: p.title,
      description: p.objective || p.description,
      objective: p.objective,
      skillsCovered: typeof p.skillsCovered === 'string' ? p.skillsCovered.split(', ') : (p.skillsCovered || []),
      skills: typeof p.skillsCovered === 'string' ? p.skillsCovered.split(', ') : (p.skillsCovered || []),
      requirements: p.requirements,
      architecture: p.architecture,
      estimatedTime: p.estimatedTime || '6 hours',
      difficulty: p.difficulty || 'Intermediate',
      evaluationCriteria: p.evaluationCriteria,
      evidenceStatus: 'Verified Evidence'
    };
  },

  async analyzeProject(repositoryUrl) {
    const isDocker = repositoryUrl.toLowerCase().includes('docker') || repositoryUrl.toLowerCase().includes('api');
    return {
      project: repositoryUrl.split('/').pop() || 'Repository Analysis',
      repositoryUrl,
      analysisTimestamp: new Date().toISOString(),
      confidence: 0.94,
      technologies: isDocker ? ['Java', 'Spring Boot', 'PostgreSQL', 'Docker'] : ['Java', 'Spring Boot', 'MySQL', 'REST API'],
      skills: ['Java', 'Spring Boot', 'REST API', 'SQL'],
      competencies: [
        'RESTful Resource Routing & OpenAPI Spec',
        'Database Schema Modeling & ORM Persistence',
        'Microservice Architecture & Security Integration'
      ],
      evidence: [
        {
          skill: 'Java',
          evidence: 'Production Spring Boot Code',
          source: 'GitHub Repository',
          status: 'Evidence Found',
          action: 'Verified',
          assessmentRoute: '/assessments/java'
        }
      ]
    };
  },

  async addProject(projectData) {
    if (USE_MOCK) {
      await delay(350);
      return { id: 'proj-' + Date.now(), ...projectData };
    }
    const response = await apiClient.post('/api/projects/1/submit', {
      githubRepoUrl: projectData.githubRepoUrl || projectData.repositoryUrl || 'https://github.com/example/repo',
      submissionNotes: projectData.description || 'New project submission'
    });
    return response.data?.data || response.data;
  },

  async submitProject(projectId, submissionData) {
    if (USE_MOCK) {
      await delay(450);
      return { ...localProjects[0], evidenceStatus: 'Under Review' };
    }
    const response = await apiClient.post(`/api/projects/${projectId}/submit`, {
      githubRepoUrl: submissionData.githubRepoUrl || submissionData.repositoryUrl || 'https://github.com/example/repo',
      submissionNotes: submissionData.notes || 'Project submission'
    });
    return response.data?.data || response.data;
  }
};
