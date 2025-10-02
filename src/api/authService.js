import apiClient from "./apiClient";

// Helper function to transform user data from snake_case to camelCase
const transformUserData = (userData) => {
  if (!userData) return userData;

  return {
    ...userData,
    isProfileComplete: userData.is_profile_complete,
    // Add other transformations as needed
  };
};

export const authService = {
  // User registration
  register: async (userData) => {
    const response = await apiClient.post("/api/auth/signup", userData);
    return response.data;
  },

  // Account verification (after registration)
  verifyAccount: async (verificationData) => {
    const response = await apiClient.post(
      "/api/auth/verify-account",
      verificationData
    );
    return response.data;
  },

  // Verify email with token (from email link)
  verifyEmail: async (token) => {
    const response = await apiClient.get(`/api/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerification: async (emailData) => {
    const response = await apiClient.post(
      "/api/auth/resend-verification",
      emailData
    );
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await apiClient.post("/api/auth/login", credentials);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (emailData) => {
    const response = await apiClient.post(
      "/api/auth/forgot-password",
      emailData
    );
    return response.data;
  },

  // Reset password
  resetPassword: async (resetData) => {
    const response = await apiClient.post(
      "/api/auth/reset-password",
      resetData
    );
    return response.data;
  },

  // Change password (for authenticated users)
  changePassword: async (passwordData) => {
    const response = await apiClient.post(
      "/api/auth/change-password",
      passwordData
    );
    return response.data;
  },

  // OAuth Google login - initiate OAuth flow
  initiateGoogleLogin: () => {
    const baseUrl = import.meta.env.VITE_STUDEX_BASE_URL;
    const googleAuthUrl = `${baseUrl}/api/auth/google/login`;

    // Store current location for redirect after auth, but don't store auth pages
    const currentPath = window.location.pathname;
    const isAuthPage =
      currentPath.includes("/login") ||
      currentPath.includes("/register") ||
      currentPath.includes("/forgot-password");

    if (!isAuthPage) {
      sessionStorage.setItem("preAuthLocation", currentPath);
    }

    // Redirect to backend OAuth endpoint
    window.location.href = googleAuthUrl;
  },

  // Get current user data
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return transformUserData(response.data);
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put('/api/auth/profile', profileData);
    return transformUserData(response.data);
  },

  // Complete profile setup
  completeProfileSetup: async (profileData) => {
    // Create FormData if there are files to upload
    const formData = new FormData();

    // Add all profile data to FormData
    Object.keys(profileData).forEach(key => {
      if (profileData[key] instanceof File) {
        formData.append(key, profileData[key]);
      } else if (typeof profileData[key] === 'object') {
        formData.append(key, JSON.stringify(profileData[key]));
      } else {
        formData.append(key, profileData[key]);
      }
    });

    const response = await apiClient.post('/api/auth/complete-profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return transformUserData(response.data);
  },

  // OAuth callback - get user data with the token
  handleOAuthCallback: async (token) => {
    // Call /api/auth/me to get user data (consistent with backend flow)
    const response = await apiClient.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { user: transformUserData(response.data), token };
  },
};
