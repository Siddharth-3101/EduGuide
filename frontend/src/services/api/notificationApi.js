import { apiClient, USE_MOCK, delay } from './apiClient';

export const notificationApi = {
  async getNotifications() {
    if (USE_MOCK) {
      await delay(100);
      return [];
    }
    const response = await apiClient.get('/api/notifications');
    return response.data?.data || response.data || [];
  },

  async markAsRead(id) {
    const response = await apiClient.put(`/api/notifications/${id}/read`);
    return response.data?.data || response.data;
  },

  async markAllAsRead() {
    const response = await apiClient.put('/api/notifications/read-all');
    return response.data?.data || response.data;
  }
};
