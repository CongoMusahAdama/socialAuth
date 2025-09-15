import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for httpOnly cookies
});

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  provider: 'linkedin' | 'tiktok';
}

export const authAPI = {
  // Health check
  healthCheck: async (): Promise<{ status: string; message: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },

  // Get current user profile
  getMe: async (): Promise<User> => {
    const response = await api.get('/me');
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // Get OAuth URLs
  getLinkedInAuthUrl: () => `${API_BASE_URL}/auth/linkedin`,
  getTikTokAuthUrl: () => `${API_BASE_URL}/auth/tiktok`,
};
