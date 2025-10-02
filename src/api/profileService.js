import apiClient from './apiClient';

export const profileService = {
  // Get current user's detailed profile
  getMyProfile: async () => {
    const response = await apiClient.get('/api/profile/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/api/profile/me', profileData);
    return response.data;
  },

  // Upload profile picture
  uploadProfilePicture: async (formData) => {
    const response = await apiClient.post('/api/profile/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete profile picture
  deleteProfilePicture: async () => {
    const response = await apiClient.delete('/api/profile/me/avatar');
    return response.data;
  },

  // // Get user's verification status
  // getVerificationStatus: async () => {
  //   const response = await apiClient.get('/api/profile/me/verification-status');
  //   return response.data;
  // },

  // Submit verification documents
  submitVerification: async (verificationData) => {
    const response = await apiClient.post('/api/profile/me/verify', verificationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // // Get user's activity/stats
  // getMyStats: async () => {
  //   const response = await apiClient.get('/api/profile/me/stats');
  //   return response.data;
  // },

  // Update user preferences
  updatePreferences: async (preferences) => {
    const response = await apiClient.put('/api/profile/me/preferences', preferences);
    return response.data;
  },

  // Get user's listings
  getMyListings: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.type) queryParams.append('type', params.type); // 'items', 'roommates'
    if (params.status) queryParams.append('status', params.status); // 'active', 'sold', 'expired'
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const response = await apiClient.get(`/api/profile/me/listings?${queryParams.toString()}`);
    return response.data;
  },

  // Get user's messages/conversations
  getMyMessages: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);

    const response = await apiClient.get(`/api/profile/me/messages?${queryParams.toString()}`);
    return response.data;
  }
};