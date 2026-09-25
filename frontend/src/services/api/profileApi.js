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
    const response = await apiClient.get('/profile');
    return response.data;
  },

  async updateProfile(updates) {
    if (USE_MOCK) {
      await delay(250);
      localProfileState = { ...localProfileState, ...updates };
      return { ...localProfileState };
    }
    const response = await apiClient.put('/profile', updates);
    return response.data;
  },

  async getActivities() {
    if (USE_MOCK) {
      await delay(120);
      return [...MOCK_ACTIVITIES];
    }
    const response = await apiClient.get('/profile/activities');
    return response.data;
  },

  async updateCareerPreferences(preferences) {
    if (USE_MOCK) {
      await delay(200);
      localProfileState = {
        ...localProfileState,
        targetRole: preferences.targetRole || localProfileState.targetRole,
        targetRoles: preferences.targetRoles || localProfileState.targetRoles
      };
      return { ...localProfileState };
    }
    const response = await apiClient.put('/profile/preferences', preferences);
    return response.data;
  }
};
