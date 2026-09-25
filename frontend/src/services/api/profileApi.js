import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_USER_PROFILE } from '../../data/mock/userProfile';
import { MOCK_ACTIVITIES } from '../../data/mock/activities';

let localProfileState = { ...MOCK_USER_PROFILE };

export const profileApi = {
  async getProfile() {
    if (USE_MOCK) {
      await delay(150);
      return { ...localProfileState };
    }
    const response = await apiClient.get('/api/profile');
    const p = response.data?.data || response.data;
    return {
      fullName: p.fullName || 'Student',
      email: p.email,
      phone: p.phone,
      headline: p.headline || 'Student Developer',
      bio: p.bio,
      education: p.education || 'B.Tech Computer Science',
      experienceLevel: p.experienceLevel || 'Intermediate',
      targetRoleId: p.targetRoleId || 'backend-developer',
      targetRoleTitle: p.targetRoleTitle || 'Backend Developer',
      resumeUrl: p.resumeUrl
    };
  },

  async updateProfile(updates) {
    if (USE_MOCK) {
      await delay(250);
      localProfileState = { ...localProfileState, ...updates };
      return { ...localProfileState };
    }
    const response = await apiClient.put('/api/profile', updates);
    return response.data?.data || response.data;
  },

  async getActivities() {
    if (USE_MOCK) {
      await delay(120);
      return [...MOCK_ACTIVITIES];
    }
    try {
      const response = await apiClient.get('/api/analytics/activity');
      const list = response.data?.data || response.data || [];
      return list.map(a => ({
        id: String(a.id),
        type: a.activityType ? a.activityType.toLowerCase() : 'assessment',
        title: a.title,
        description: a.description,
        timestamp: a.createdAt || 'Recently'
      }));
    } catch (e) {
      return MOCK_ACTIVITIES;
    }
  },

  async addEvidence(evidenceData) {
    if (USE_MOCK) {
      await delay(200);
      return { id: 'ev-' + Date.now(), ...evidenceData };
    }
    const response = await apiClient.post('/api/evidence', {
      skillId: evidenceData.skillId || 'java',
      title: evidenceData.title || evidenceData.name || 'Certificate Evidence',
      name: evidenceData.name || evidenceData.title || 'Certificate Evidence',
      type: (evidenceData.type || 'CERTIFICATE').toUpperCase(),
      fileUrl: evidenceData.url || evidenceData.fileUrl || 'https://skillbridge.internal/evidence',
      score: evidenceData.score || 'Pass'
    });
    return response.data?.data || response.data;
  }
};
