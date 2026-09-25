import { apiClient, USE_MOCK, delay } from './apiClient';

export const readinessApi = {
  async getReadiness() {
    if (USE_MOCK) {
      await delay(150);
      return {
        competencyCoveragePercentage: 67,
        targetRoleTitle: 'Backend Developer',
        skillGaps: [],
        nextBestAction: { title: 'Docker Fundamentals', actionType: 'ASSESSMENT' }
      };
    }
    const response = await apiClient.get('/api/readiness');
    return response.data?.data || response.data;
  },

  async getReadinessForRole(roleId) {
    if (USE_MOCK) {
      await delay(150);
      return { competencyCoveragePercentage: 70, targetRoleTitle: 'Software Engineer' };
    }
    const response = await apiClient.get(`/api/readiness/role/${roleId}`);
    return response.data?.data || response.data;
  },

  async getGaps() {
    const response = await apiClient.get('/api/readiness/gaps');
    return response.data?.data || response.data;
  },

  async getNextAction() {
    const response = await apiClient.get('/api/readiness/next-action');
    return response.data?.data || response.data;
  }
};
