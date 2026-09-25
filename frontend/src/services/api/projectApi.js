import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_PROJECTS } from '../../data/mock/projects';

let localProjects = [...MOCK_PROJECTS];

export const projectApi = {
  async getProjects() {
    if (USE_MOCK) {
      await delay(130);
      return [...localProjects];
    }
    const response = await apiClient.get('/projects');
    return response.data;
  },

  async getProjectById(projectId) {
    if (USE_MOCK) {
      await delay(120);
      const project = localProjects.find((p) => p.id === projectId) || localProjects[0];
      return project;
    }
    const response = await apiClient.get(`/projects/${projectId}`);
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
            status: 'Submitted',
            progress: 85,
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
