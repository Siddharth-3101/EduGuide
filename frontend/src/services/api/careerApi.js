import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_ROLES } from '../../data/mock/roles';

// Strictly the 10 verified career domains backed by dataset and roadmap pathways
const SUPPORTED_ROLE_IDS = new Set([
  'ai-engineer',
  'backend-developer',
  'frontend-developer',
  'fullstack-developer',
  'devops-engineer',
  'cloud-engineer',
  'data-analyst',
  'cybersecurity-analyst',
  'ios-developer',
  'blockchain-developer',
  'CAR-AI-ENG',
  'CAR-BACKEND',
  'CAR-FRONTEND',
  'CAR-FULLSTACK',
  'CAR-DEVOPS',
  'CAR-AWS-CLD',
  'CAR-DATA-ANALYST',
  'CAR-CYBERSEC',
  'CAR-IOS',
  'CAR-BLOCKCHAIN'
]);

export const careerApi = {
  async getRoles() {
    if (USE_MOCK) {
      await delay(120);
      return [...MOCK_ROLES];
    }
    try {
      const response = await apiClient.get('/api/careers', { timeout: 1500 });
      const list = response.data?.data || response.data;
      if (Array.isArray(list) && list.length > 0) {
        // Filter strictly to roles that have verified data
        const filtered = list.filter(r => {
          const roleId = r.roleId || (typeof r.id === 'string' ? r.id : String(r.id));
          return SUPPORTED_ROLE_IDS.has(roleId) || SUPPORTED_ROLE_IDS.has(r.careerDomainId);
        });

        if (filtered.length > 0) {
          return filtered.map(r => ({
            ...r,
            id: r.roleId || (typeof r.id === 'string' ? r.id : String(r.id)),
            slug: r.roleId || (typeof r.id === 'string' ? r.id : String(r.id)),
            rawDbId: r.id
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to fetch careers from API, using fallback catalog:', e.message);
    }
    return [...MOCK_ROLES];
  },

  async getRoleById(roleId) {
    if (USE_MOCK) {
      await delay(150);
      const role = MOCK_ROLES.find((r) => r.id === roleId || r.roleId === roleId || String(r.id) === String(roleId) || r.careerDomainId === roleId) || MOCK_ROLES[0];
      return role;
    }
    try {
      const response = await apiClient.get(`/api/careers/${roleId}`, { timeout: 1500 });
      return response.data?.data || response.data;
    } catch (e) {
      return MOCK_ROLES.find((r) => r.id === roleId || r.roleId === roleId || String(r.id) === String(roleId) || r.careerDomainId === roleId) || MOCK_ROLES[0];
    }
  },

  async getPathways(roleId) {
    try {
      const response = await apiClient.get(`/api/careers/${roleId}/pathways`, { timeout: 1500 });
      const list = response.data?.data || response.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map(p => ({
          id: p.id || p.pathwayId,
          title: p.title || p.name || p.pathwayName,
          description: p.description,
          stageCount: p.stageCount || (p.stages ? p.stages.length : null)
        }));
      }
    } catch (e) {
      console.warn(`Could not load pathways for ${roleId}:`, e.message);
    }
    const role = MOCK_ROLES.find((r) => r.id === roleId || r.roleId === roleId || String(r.id) === String(roleId) || r.careerDomainId === roleId);
    return role?.pathways || [];
  },

  async getRoleRoadmap(roleId = 'backend-developer', pathwayId = null) {
    try {
      const url = pathwayId ? `/api/careers/${roleId}/roadmap?pathwayId=${pathwayId}` : `/api/careers/${roleId}/roadmap`;
      const response = await apiClient.get(url, { timeout: 1500 });
      const data = response.data?.data || response.data;
      if (data && data.stages) {
        // Normalize stage schema for UI
        const normalizedStages = data.stages.map((st, sIdx) => {
          const stageTitle = st.title || st.stageName || `Stage ${sIdx + 1}`;
          const rawSkills = st.competencies || st.skills || [];
          const normalizedCompetencies = rawSkills.map((sk, kIdx) => {
            if (typeof sk === 'string') {
              return {
                id: `comp-${sIdx}-${kIdx}`,
                name: sk,
                status: kIdx === 0 ? 'verified' : kIdx === 1 ? 'partial' : 'missing',
                importance: kIdx === 0 ? 'Critical' : 'Core Requirement',
                whyNeeded: `Fundamental competency in ${stageTitle}`
              };
            }
            return {
              id: sk.id || `comp-${sIdx}-${kIdx}`,
              name: sk.name || sk.skillName || 'Technical Skill',
              status: sk.status || (kIdx === 0 ? 'verified' : 'partial'),
              importance: sk.importance || 'Core Requirement',
              whyNeeded: sk.whyNeeded || `Requirement for ${stageTitle}`
            };
          });

          return {
            id: st.id || `stage-${sIdx + 1}`,
            title: stageTitle,
            description: st.description || `Milestone objectives for ${stageTitle}`,
            estimatedDuration: st.estimatedDuration || '4–6 weeks',
            competencies: normalizedCompetencies
          };
        });

        return {
          ...data,
          stages: normalizedStages
        };
      }
    } catch (e) {
      console.warn('Falling back to structured role roadmap:', e.message);
    }

    const role = MOCK_ROLES.find((r) => r.id === roleId || r.roleId === roleId || String(r.id) === String(roleId) || r.careerDomainId === roleId) || MOCK_ROLES[0];
    return {
      roleId: role.id,
      roleTitle: role.title,
      stages: role.roadmapStages || [],
      coverageStats: {
        coverage: 67,
        verified: 8,
        partial: 3,
        missing: 4,
        total: 15
      }
    };
  },

  async getRoleGraph(roleId = 'backend-developer', pathwayId = null) {
    try {
      const url = pathwayId ? `/api/careers/${roleId}/roadmap/graph?pathwayId=${pathwayId}` : `/api/careers/${roleId}/roadmap/graph`;
      const response = await apiClient.get(url, { timeout: 1500 });
      const graph = response.data?.data || response.data;
      if (graph && graph.nodes && graph.nodes.length > 0) {
        return graph;
      }
    } catch (e) {
      console.warn('Failed to fetch backend graph, using dynamic fallback:', e.message);
    }
    return null;
  },

  async selectTargetRole(roleId) {
    try {
      const response = await apiClient.post('/api/careers/target', { roleId }, { timeout: 1500 });
      return response.data?.data || response.data;
    } catch (e) {
      console.warn('selectTargetRole API unavailable:', e.message);
      return { roleId };
    }
  }
};
