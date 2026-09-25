import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_SKILLS, SKILL_CATEGORIES } from '../../data/mock/skills';

let localSkills = [...MOCK_SKILLS];

export const skillsApi = {
  async getCategories() {
    return SKILL_CATEGORIES;
  },

  async getSkills(params = {}) {
    if (USE_MOCK) {
      await delay(150);
      let filtered = [...localSkills];

      if (params.category && params.category !== 'All') {
        filtered = filtered.filter((s) => s.category.toLowerCase() === params.category.toLowerCase());
      }

      if (params.status && params.status !== 'all') {
        filtered = filtered.filter((s) => s.status.toLowerCase() === params.status.toLowerCase());
      }

      if (params.search) {
        const query = params.search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.name.toLowerCase().includes(query) ||
            s.description.toLowerCase().includes(query) ||
            s.category.toLowerCase().includes(query)
        );
      }

      return filtered;
    }
    const response = await apiClient.get('/skills', { params });
    return response.data;
  },

  async getSkillById(skillId) {
    if (USE_MOCK) {
      await delay(120);
      const skill = localSkills.find((s) => s.id === skillId);
      if (!skill) {
        throw new Error(`Skill with ID ${skillId} not found`);
      }
      return skill;
    }
    const response = await apiClient.get(`/skills/${skillId}`);
    return response.data;
  },

  async verifySkill(skillId, newEvidence) {
    if (USE_MOCK) {
      await delay(200);
      localSkills = localSkills.map((s) => {
        if (s.id === skillId) {
          return {
            ...s,
            status: 'verified',
            score: Math.max(s.score || 0, 85),
            evidenceCount: s.evidenceCount + 1,
            evidenceList: [
              ...(s.evidenceList || []),
              {
                id: 'ev-' + Date.now(),
                type: newEvidence?.type || 'Assessment',
                name: newEvidence?.name || 'Verified via Assessment',
                verifiedAt: new Date().toISOString().split('T')[0],
                score: newEvidence?.score || '86%'
              }
            ]
          };
        }
        return s;
      });
      return localSkills.find((s) => s.id === skillId);
    }
    const response = await apiClient.post(`/skills/${skillId}/verify`, newEvidence);
    return response.data;
  }
};
