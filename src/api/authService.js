import apiClient from './apiClient';

export const authService = {
  // User registration
  register: async (userData) => {
    const response = await apiClient.post('/api/auth/signup', userData);
    return response.data;
  },

  // Account verification (after registration)
  verifyAccount: async (verificationData) => {
    const response = await apiClient.post('/api/auth/verify-account', verificationData);
    return response.data;
  },

  // Verify email with token (from email link)
  verifyEmail: async (token) => {
    const response = await apiClient.get(`/api/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (emailData) => {
    const response = await apiClient.post('/api/auth/resend-verification', emailData);
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