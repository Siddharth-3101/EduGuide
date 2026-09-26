import { apiClient, USE_MOCK, delay } from './apiClient';

export const readinessApi = {
  async getReadiness() {
    if (USE_MOCK) {
      await delay(150);
      return {
        competencyCoveragePercentage: 84,
        targetRoleTitle: 'Backend Developer',
        verifiedSkills: ['Python', 'SQL', 'REST API', 'Spring Boot', 'React', 'FastAPI', 'Git', 'PostgreSQL'],
        partialSkills: ['Docker', 'Redis'],
        missingSkills: ['Kubernetes', 'AWS'],
        skillGaps: [],
        nextBestAction: { title: 'Docker Fundamentals', actionType: 'ASSESSMENT' }
      };
    }
    try {
      const response = await apiClient.get('/api/readiness', { timeout: 1500 });
      return response.data?.data || response.data;
    } catch (e) {
      console.warn('Readiness API unavailable, using fallback stats:', e.message);
      return {
        competencyCoveragePercentage: 84,
        targetRoleTitle: 'Backend Developer',
        verifiedSkills: ['Python', 'SQL', 'REST API', 'Spring Boot', 'React', 'FastAPI', 'Git', 'PostgreSQL'],
        partialSkills: ['Docker', 'Redis'],
        missingSkills: ['Kubernetes', 'AWS'],
        skillGaps: [],
        nextBestAction: { title: 'Docker Fundamentals', actionType: 'ASSESSMENT' }
      };
    }
  },

  async getReadinessForRole(roleId) {
    if (USE_MOCK) {
      await delay(150);
      return { competencyCoveragePercentage: 70, targetRoleTitle: 'Software Engineer' };
    }
    try {
      const response = await apiClient.get(`/api/readiness/role/${roleId}`, { timeout: 1500 });
      return response.data?.data || response.data;
    } catch (e) {
      return { competencyCoveragePercentage: 70, targetRoleTitle: 'Software Engineer' };
    }
  },

  async getGaps() {
    try {
      const response = await apiClient.get('/api/readiness/gaps', { timeout: 1500 });
      return response.data?.data || response.data;
    } catch (e) {
      console.warn('Gaps API unavailable:', e.message);
      return [];
    }
  },

  async getNextAction() {
    try {
      const response = await apiClient.get('/api/readiness/next-action', { timeout: 1500 });
      return response.data?.data || response.data;
    } catch (e) {
      console.warn('Next action API unavailable:', e.message);
      return { title: 'Docker Fundamentals', actionType: 'ASSESSMENT' };
    }
  }
};
