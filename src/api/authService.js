import apiClient from "./apiClient";

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
    return response.data;
  },

  // OAuth callback - get user data with the token
  handleOAuthCallback: async (token) => {
    // Call /api/auth/me to get user data (consistent with backend flow)
    const response = await apiClient.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { user: response.data, token };
  },
};
