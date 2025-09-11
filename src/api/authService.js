import apiClient from './apiClient';

export const authService = {
  // User registration
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response.data;
  },

  // Account verification (after registration)
  verifyAccount: async (verificationData) => {
    const response = await apiClient.post('/api/auth/verify-account', verificationData);
    return response.data;
  },

  // Email verification
  verifyEmail: async (emailData) => {
    const response = await apiClient.post('/api/auth/verify-email', emailData);
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await apiClient.post('/api/auth/login', credentials);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (emailData) => {
    const response = await apiClient.post('/api/auth/forgot-password', emailData);
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await apiClient.post('/api/auth/reset-password', resetData);
    return response.data;
  }
};