import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.skillbridge.internal/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('skillbridge_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized / token expired
      console.warn('Unauthorized request. Session may be expired.');
    }
    return Promise.reject(error);
  }
);

export const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

// Helper to simulate network latency for realistic UX feel
export const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));
