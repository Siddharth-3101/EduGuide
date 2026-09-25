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
    const response = await apiClient.post('/api/auth/login', credentials);
    const data = response.data?.data || response.data;
    if (data?.token) {
      localStorage.setItem('skillbridge_auth_token', data.token);
    }
    const userObj = {
      id: data.userId,
      userId: data.userId,
      fullName: data.fullName || data.name,
      email: data.email,
      role: data.role || 'ROLE_STUDENT'
    };
    return {
      user: userObj,
      token: data.token
    };
  },

  async register(data) {
    if (USE_MOCK) {
      await delay(350);
      const token = 'mock_jwt_token_' + Math.random().toString(36).substring(7);
      localStorage.setItem('skillbridge_auth_token', token);
      const newUser = {
        ...MOCK_USER_PROFILE,
        fullName: data.fullName || data.name || 'Student',
        email: data.email
      };
      return {
        user: newUser,
        token
      };
    }
    const payload = {
      fullName: data.fullName || data.name,
      name: data.name || data.fullName,
      email: data.email,
      password: data.password
    };
    const response = await apiClient.post('/api/auth/register', payload);
    const respData = response.data?.data || response.data;
    if (respData?.token) {
      localStorage.setItem('skillbridge_auth_token', respData.token);
    }
    const userObj = {
      id: respData.userId,
      userId: respData.userId,
      fullName: respData.fullName || respData.name,
      email: respData.email,
      role: respData.role || 'ROLE_STUDENT'
    };
    return {
      user: userObj,
      token: respData.token
    };
  },

  async logout() {
    if (USE_MOCK) {
      await delay(100);
      localStorage.removeItem('skillbridge_auth_token');
      return { success: true };
    }
    try {
      await apiClient.post('/api/auth/logout');
    } catch (ignored) {}
    localStorage.removeItem('skillbridge_auth_token');
    return { success: true };
  },

  async getCurrentUser() {
    const token = localStorage.getItem('skillbridge_auth_token');
    if (!token) {
      return null;
    }
    if (USE_MOCK) {
      await delay(120);
      return MOCK_USER_PROFILE;
    }
    try {
      const response = await apiClient.get('/api/auth/me');
      const data = response.data?.data || response.data;
      return {
        id: data.userId || data.id,
        userId: data.userId || data.id,
        fullName: data.fullName || data.name,
        email: data.email,
        role: data.role || 'ROLE_STUDENT'
      };
    } catch (err) {
      localStorage.removeItem('skillbridge_auth_token');
      return null;
    }
  }
};
