import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_SKILLS, SKILL_CATEGORIES } from '../../data/mock/skills';

let localSkills = [...MOCK_SKILLS];

function applyLocalEvidence(skills) {
  let storedSkills = [];
  try {
    const raw = localStorage.getItem('skillsync_local_skills');
    if (raw) storedSkills = JSON.parse(raw);
  } catch (e) {}

  if (!Array.isArray(storedSkills) || storedSkills.length === 0) {
    return skills;
  }

  const result = [...skills];
  storedSkills.forEach((stored) => {
    const sName = stored.name?.toLowerCase();
    const sId = (stored.id || stored.skillId || '').toLowerCase();
    const matchIdx = result.findIndex(
      (s) =>
        (s.id && s.id.toLowerCase() === sId) ||
        (s.skillId && s.skillId.toLowerCase() === sId) ||
        (s.name && s.name.toLowerCase() === sName)
    );

    if (matchIdx !== -1) {
      result[matchIdx] = {
        ...result[matchIdx],
        status: 'verified',
        level: result[matchIdx].level === 'Beginner' ? 'Proficient' : result[matchIdx].level,
        score: Math.max(result[matchIdx].score || 0, stored.score || 88),
        evidenceCount: Math.max(result[matchIdx].evidenceCount || 0, 1),
        evidenceSource: stored.evidenceSource || result[matchIdx].evidenceSource
      };
    } else {
      result.push({
        id: stored.id || stored.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        skillId: stored.skillId || 'SKL-9999',
        name: stored.name,
        category: stored.category || 'Technical Competency',
        description: `Verified competency extracted from candidate uploaded documents.`,
        status: 'verified',
        level: 'Proficient',
        score: stored.score || 88,
        evidenceCount: 1,
        evidenceSource: stored.evidenceSource || 'Verified Document Evidence',
        requiredForRoles: ['Backend Developer', 'Software Engineer']
      });
    }
  });

  return result;
}

export const skillsApi = {
  async getCategories() {
    if (USE_MOCK) return SKILL_CATEGORIES;
    try {
      const response = await apiClient.get('/api/skills/categories', { timeout: 1500 });
      const cats = response.data?.data || response.data;
      return Array.isArray(cats) ? ['All', ...cats] : SKILL_CATEGORIES;
    } catch (e) {
      return SKILL_CATEGORIES;
    }
  },

  async getSkills(params = {}) {
    let baseSkills = [];

    if (USE_MOCK) {
      await delay(150);
      baseSkills = [...localSkills];
    } else {
      try {
        const [masterRes, studentRes] = await Promise.all([
          apiClient.get('/api/skills', { params, timeout: 1500 }),
          apiClient.get('/api/skills/student', { timeout: 1500 }).catch(() => ({ data: { data: [] } }))
        ]);

        const masterList = masterRes.data?.data || masterRes.data || [];
        const studentList = studentRes.data?.data || studentRes.data || [];

        if (Array.isArray(masterList) && masterList.length > 0) {
          const studentMap = new Map();
          if (Array.isArray(studentList)) {
            studentList.forEach((ss) => {
              studentMap.set(ss.skillId?.toLowerCase(), ss);
            });
          }

          baseSkills = masterList.map((skill) => {
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
              score: st ? st.score || 0 : 0,
              evidenceCount: st ? st.evidenceCount || 0 : 0,
              requiredForRoles: ['Backend Developer', 'Software Engineer']
            };
          });
        }
      } catch (e) {
        console.warn('Skills API unavailable, using fallback catalog:', e.message);
      }

      if (baseSkills.length === 0) {
        baseSkills = [...localSkills];
      }
    }

    // Always merge evidence-backed skills from candidate uploads!
    let merged = applyLocalEvidence(baseSkills);

    if (params.category && params.category !== 'All') {
      merged = merged.filter((s) => s.category?.toLowerCase() === params.category.toLowerCase());
    }
    if (params.status && params.status !== 'all') {
      merged = merged.filter((s) => s.status?.toLowerCase() === params.status.toLowerCase());
    }
    if (params.search) {
      const query = params.search.toLowerCase();
      merged = merged.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.description?.toLowerCase().includes(query) ||
          s.category?.toLowerCase().includes(query)
      );
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

    try {
      const [masterRes, studentRes] = await Promise.all([
        apiClient.get(`/api/skills/${skillId}`),
        apiClient.get(`/api/skills/student/${skillId}`).catch(() => ({ data: { data: null } }))
      ]);

      const master = masterRes.data?.data || masterRes.data;
      const student = studentRes.data?.data || studentRes.data;

      if (master) {
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
      }
    } catch (e) {
      console.warn(`Skill API for ${skillId} unavailable, using fallback:`, e.message);
    }

    return localSkills.find((s) => s.id === skillId || s.skillId === skillId) || localSkills[0];
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
