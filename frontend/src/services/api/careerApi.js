import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_ROLES } from '../../data/mock/roles';

export const careerApi = {
  async getRoles() {
    if (USE_MOCK) {
      await delay(120);
      return [...MOCK_ROLES];
    }
    const response = await apiClient.get('/api/careers');
    return response.data?.data || response.data;
  },

  async getRoleById(roleId) {
    if (USE_MOCK) {
      await delay(150);
      const role = MOCK_ROLES.find((r) => r.id === roleId) || MOCK_ROLES[0];
      return role;
    }
    const response = await apiClient.get(`/api/careers/${roleId}`);
    return response.data?.data || response.data;
  },

  async getRoleRoadmap(roleId = 'backend-developer') {
    if (USE_MOCK) {
      await delay(180);
      const role = MOCK_ROLES.find((r) => r.id === roleId) || MOCK_ROLES[0];
      return {
        roleId: role.id,
        roleTitle: role.title,
        stages: role.roadmapStages || MOCK_ROLES[0].roadmapStages,
        coverageStats: {
          coverage: 67,
          verified: 8,
          partial: 3,
          missing: 4,
          total: 15
        }
      };
    }
    const response = await apiClient.get(`/api/careers/${roleId}/roadmap`);
    return response.data?.data || response.data;
  },

  async selectTargetRole(roleId) {
    const response = await apiClient.post('/api/careers/target', { roleId });
    return response.data?.data || response.data;
  }
};
