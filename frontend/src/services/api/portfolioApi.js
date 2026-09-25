import { apiClient, USE_MOCK, delay } from './apiClient';

export const portfolioApi = {
  async getPortfolio() {
    if (USE_MOCK) {
      await delay(150);
      return { verifiedSkills: [], evidenceList: [] };
    }
    const response = await apiClient.get('/api/portfolio');
    return response.data?.data || response.data;
  },

  async getPublicPortfolio(username) {
    if (USE_MOCK) {
      await delay(150);
      return { verifiedSkills: [], evidenceList: [] };
    }
    const response = await apiClient.get(`/api/portfolio/public/${username}`);
    return response.data?.data || response.data;
  },

  async updatePortfolio(settings) {
    const response = await apiClient.put('/api/portfolio', settings);
    return response.data?.data || response.data;
  },

  async sharePortfolio() {
    const response = await apiClient.post('/api/portfolio/share');
    return response.data?.data || response.data;
  }
};
