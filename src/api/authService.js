import apiClient from "./apiClient";
import { transformUserData } from "@/utils/userTransform";

export const authService = {
  // User registration
  register: async (userData) => {
    const response = await apiClient.post("/api/auth/signup", userData);
    return response.data;
  },

  // Account verification (after registration)
  verifyAccount: async (verificationData) => {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('email', verificationData.email);
    formData.append('campus_id', verificationData.campus_id);
    formData.append('document_type', verificationData.document_type);
    formData.append('file', verificationData.file);

    const response = await apiClient.post(
      "/api/auth/verify-student",
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
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
    // Transform camelCase to snake_case for backend
    const payload = {
      current_password: passwordData.currentPassword,
      new_password: passwordData.newPassword,
    };

    const response = await apiClient.post(
      "/api/auth/change-password",
      payload
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
    const response = await apiClient.get("/api/auth/me");
    return transformUserData(response.data);
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await apiClient.put("/api/auth/profile", profileData);
    return transformUserData(response.data);
  },

  // Complete profile setup
  completeProfileSetup: async (profileData) => {
    // Create FormData if there are files to upload
    const formData = new FormData();

    // Add all profile data to FormData
    Object.keys(profileData).forEach((key) => {
      const value = profileData[key];

      // Skip null, undefined, or empty values
      if (value === null || value === undefined || value === '') {
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
      } else if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });

    const response = await apiClient.post(
      "/api/auth/complete-profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 seconds for file uploads
      }
    );
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
