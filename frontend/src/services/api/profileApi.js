import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_USER_PROFILE } from '../../data/mock/userProfile';
import { MOCK_ACTIVITIES } from '../../data/mock/activities';

let localProfileState = { ...MOCK_USER_PROFILE };

export const profileApi = {
  async getProfile() {
    const storedName = localStorage.getItem('skillsync_candidate_name');
    const storedEmail = localStorage.getItem('skillsync_candidate_email');
    const storedPhone = localStorage.getItem('skillsync_candidate_phone');
    const storedEdu = localStorage.getItem('skillsync_candidate_education');
    const storedBio = localStorage.getItem('skillsync_candidate_bio');

    if (USE_MOCK) {
      await delay(150);
      return {
        ...localProfileState,
        fullName: storedName || localProfileState.fullName,
        email: storedEmail || localProfileState.email,
        phone: storedPhone || localProfileState.phone,
        education: storedEdu || localProfileState.education,
        bio: storedBio || localProfileState.bio
      };
    }
    try {
      const response = await apiClient.get('/api/profile', { timeout: 1500 });
      const p = response.data?.data || response.data;
      if (p) {
        return {
          fullName: storedName || p.fullName || 'Candidate Profile',
          email: storedEmail || p.email,
          phone: storedPhone || p.phone,
          headline: p.headline || 'Full Stack & Backend Systems Developer',
          bio: storedBio || p.bio,
          education: storedEdu || p.education || 'Higher Education / Engineering Degree',
          experienceLevel: p.experienceLevel || 'Student',
          targetRoleId: p.targetRoleId || 'backend-developer',
          targetRoleTitle: p.targetRoleTitle || 'Backend Developer',
          resumeUrl: p.resumeUrl
        };
      }
    } catch (e) {
      console.warn('Profile API unavailable, using fallback profile:', e.message);
    }
    return {
      ...localProfileState,
      fullName: storedName || localProfileState.fullName,
      email: storedEmail || localProfileState.email,
      phone: storedPhone || localProfileState.phone,
      education: storedEdu || localProfileState.education,
      bio: storedBio || localProfileState.bio
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
      const response = await apiClient.get('/api/analytics/activity', { timeout: 1500 });
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
