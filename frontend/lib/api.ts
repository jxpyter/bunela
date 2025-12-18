import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    apiClient.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  getMe: () => apiClient.get('/auth/me'),
  updateSettings: (settings: any) => apiClient.put('/auth/settings', settings),
};

// Words API
export const wordsAPI = {
  getAll: (params?: { level?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get('/words', { params }),
  getById: (id: string) => apiClient.get(`/words/${id}`),
  create: (data: any) => apiClient.post('/words', data),
  update: (id: string, data: any) => apiClient.put(`/words/${id}`, data),
  delete: (id: string) => apiClient.delete(`/words/${id}`),
  bulkImport: (words: any[]) => apiClient.post('/words/bulk-import', { words }),
  export: () => apiClient.get('/words/export'),
};

// Progress API
export const progressAPI = {
  getDue: () => apiClient.get('/progress/due'),
  getNew: (params?: { level?: string }) => apiClient.get('/progress/new', { params }),
  getPractice: (params?: { level?: string }) => apiClient.get('/progress/practice', { params }),
  submitReview: (data: { word_id: string; quality: number }) =>
    apiClient.post('/progress/review', data),
  getStats: () => apiClient.get('/progress/stats'),
  reset: () => apiClient.post('/progress/reset', {}),
};


