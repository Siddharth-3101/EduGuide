import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_SKILLS, SKILL_CATEGORIES } from '../../data/mock/skills';

let localSkills = [...MOCK_SKILLS];

export const skillsApi = {
  async getCategories() {
    if (USE_MOCK) return SKILL_CATEGORIES;
    try {
      const response = await apiClient.get('/api/skills/categories');
      const cats = response.data?.data || response.data;
      return Array.isArray(cats) ? ['All', ...cats] : SKILL_CATEGORIES;
    } catch (e) {
      return SKILL_CATEGORIES;
    }
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

    const [masterRes, studentRes] = await Promise.all([
      apiClient.get('/api/skills', { params }),
      apiClient.get('/api/skills/student').catch(() => ({ data: { data: [] } }))
    ]);

    const masterList = masterRes.data?.data || masterRes.data || [];
    const studentList = studentRes.data?.data || studentRes.data || [];

    const studentMap = new Map();
    if (Array.isArray(studentList)) {
      studentList.forEach(ss => {
        studentMap.set(ss.skillId?.toLowerCase(), ss);
      });
    }

    let merged = masterList.map(skill => {
      const sId = (skill.skillId || skill.id || '').toLowerCase();
      const st = studentMap.get(sId);
      return {
        id: skill.skillId || String(skill.id),
        skillId: skill.skillId || String(skill.id),
        name: skill.name,
        category: skill.category,
        description: skill.description,
        status: st ? (st.status ? st.status.toLowerCase() : 'missing') : 'missing',
        level: st ? st.level : 'Beginner',
        score: st ? (st.score || 0) : 0,
        evidenceCount: st ? (st.evidenceCount || 0) : 0,
        requiredForRoles: ['Backend Developer', 'Software Engineer']
      };
    });

    if (params.status && params.status !== 'all') {
      merged = merged.filter((s) => s.status.toLowerCase() === params.status.toLowerCase());
    }

    return merged;
  },

  async getSkillById(skillId) {
    if (USE_MOCK) {
      await delay(120);
      const skill = localSkills.find((s) => s.id === skillId);
      if (!skill) throw new Error(`Skill with ID ${skillId} not found`);
      return skill;
    }

    const [masterRes, studentRes] = await Promise.all([
      apiClient.get(`/api/skills/${skillId}`),
      apiClient.get(`/api/skills/student/${skillId}`).catch(() => ({ data: { data: null } }))
    ]);

    const master = masterRes.data?.data || masterRes.data;
    const student = studentRes.data?.data || studentRes.data;

    return {
      id: master.skillId || String(master.id),
      skillId: master.skillId || String(master.id),
      name: master.name,
      category: master.category,
      description: master.description,
      status: student?.status ? student.status.toLowerCase() : 'missing',
      level: student?.level || 'Beginner',
      score: student?.score || 0,
      evidenceCount: student?.evidenceCount || 0,
      requiredForRoles: ['Backend Developer', 'Software Engineer'],
      evidenceList: []
    };
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
          };
        }
        return s;
      });
      return localSkills.find((s) => s.id === skillId);
    }

    const response = await apiClient.post(`/api/skills/${skillId}/verify`, newEvidence);
    const data = response.data?.data || response.data;
    return {
      id: data.skillId,
      skillId: data.skillId,
      name: data.name,
      status: data.status ? data.status.toLowerCase() : 'verified',
      score: data.score,
      evidenceCount: data.evidenceCount
    };
  }
};
