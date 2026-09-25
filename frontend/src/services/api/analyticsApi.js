import { apiClient, USE_MOCK, delay } from './apiClient';

export const analyticsApi = {
  async getDashboard() {
    if (USE_MOCK) {
      await delay(150);
      return {
        verifiedSkillsCount: 5,
        totalSkillsCount: 12,
        competencyCoveragePercentage: 67,
        activeSkillGapsCount: 3,
        recommendedJobsCount: 5
      };
    }
    const response = await apiClient.get('/api/analytics/dashboard');
    return response.data?.data || response.data;
  },

  async getActivityLogs() {
    const response = await apiClient.get('/api/analytics/activity');
    return response.data?.data || response.data;
  },

  async getSkillProgress() {
    const response = await apiClient.get('/api/analytics/skill-progress');
    return response.data?.data || response.data;
  },

  async getCareerProgress() {
    const response = await apiClient.get('/api/analytics/career-progress');
    return response.data?.data || response.data;
  }
};
