import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_USER_PROFILE } from '../../data/mock/userProfile';

export const authApi = {
  async login(credentials) {
    if (USE_MOCK) {
      await delay(300);
      const token = 'mock_jwt_token_' + Math.random().toString(36).substring(7);
      localStorage.setItem('skillbridge_auth_token', token);
      return {
        user: MOCK_USER_PROFILE,
        token
      };
    }
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data?.token) {
      localStorage.setItem('skillbridge_auth_token', response.data.token);
    }
    return response.data;
  },

  async register(data) {
    if (USE_MOCK) {
      await delay(350);
      const token = 'mock_jwt_token_' + Math.random().toString(36).substring(7);
      localStorage.setItem('skillbridge_auth_token', token);
      const newUser = {
        ...MOCK_USER_PROFILE,
        fullName: data.fullName || 'Student',
        email: data.email
      };
      return {
        user: newUser,
        token
      };
    }
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  async logout() {
    if (USE_MOCK) {
      await delay(100);
      localStorage.removeItem('skillbridge_auth_token');
      return { success: true };
    }
    const response = await apiClient.post('/auth/logout');
    localStorage.removeItem('skillbridge_auth_token');
    return response.data;
  },

  async getCurrentUser() {
    const token = localStorage.getItem('skillbridge_auth_token');
    if (!token && USE_MOCK) {
      // Default initial mock logged-in state for instant preview
      return MOCK_USER_PROFILE;
    }
    if (USE_MOCK) {
      await delay(120);
      return MOCK_USER_PROFILE;
    }
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};
