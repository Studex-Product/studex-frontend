import apiClient from "./apiClient";

export const adminService = {
  // Get all users (Super Admin only)
  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.campus_id) queryParams.append("campus_id", params.campus_id);
    if (params.status) queryParams.append("status", params.status);
    if (params.verified) queryParams.append("verified", params.verified);

    const response = await apiClient.get(
      `/api/admin/users?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single user details (Super Admin only)
  getUserById: async (userId) => {
    const response = await apiClient.get(
      `/api/admin/users/${userId}/comprehensive`
    );
    return response.data;
  },


  // Get user by ID for campus admin (campus-scoped)
  getCampusUserById: async (campusId, userId) => {
    const response = await apiClient.get(
      `/api/admin/campus/${campusId}/users/${userId}`
    );
    return response.data;
  },

 

  // Update user status (activate/deactivate) - Super Admin
  updateUserStatus: async (userId, status) => {
    const response = await apiClient.patch(
      `/api/admin/users/${userId}/status`,
      {
        is_active: status,
      }
    );
    return response.data;
  },

  // Update user status (activate/deactivate) - Campus Admin
  updateCampusUserStatus: async (campusId, userId, status) => {
    const response = await apiClient.patch(
      `/api/admin/campus/${campusId}/users/${userId}/status`,
      {
        is_active: status,
      }
    );
    return response.data;
  },

  // Verify/Unverify student - Super Admin
  updateStudentVerification: async (userId, verified) => {
    const response = await apiClient.patch(
      `/api/admin/users/${userId}/verify-student`,
      {
        student_verified: verified,
      }
    );
    return response.data;
  },

  // Verify/Unverify student - Campus Admin
  updateCampusStudentVerification: async (campusId, userId, verified) => {
    const response = await apiClient.patch(
      `/api/admin/campus/${campusId}/users/${userId}/verify-student`,
      {
        student_verified: verified,
      }
    );
    return response.data;
  },

  // Get user activity logs
  getUserActivity: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.type) queryParams.append("type", params.type);

    const response = await apiClient.get(
      `/api/admin/users/${userId}/activity?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get user listings
  getUserListings: async (userId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);

    const response = await apiClient.get(
      `/api/admin/users/${userId}/listings?${queryParams.toString()}`
    );
    return response.data;
  },

  // Export users data
  exportUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.format) queryParams.append("format", params.format); // csv, excel, pdf
    if (params.campus_id) queryParams.append("campus_id", params.campus_id);
    if (params.status) queryParams.append("status", params.status);
    if (params.verified) queryParams.append("verified", params.verified);
    if (params.date_from) queryParams.append("date_from", params.date_from);
    if (params.date_to) queryParams.append("date_to", params.date_to);

    const response = await apiClient.get(
      `/api/admin/users/export?${queryParams.toString()}`,
      {
        responseType: "blob", // Important for file downloads
      }
    );
    return response;
  },

  // Get user statistics
  getUserStats: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.period) queryParams.append("period", params.period); // daily, weekly, monthly
    if (params.campus_id) queryParams.append("campus_id", params.campus_id);

    const response = await apiClient.get(
      `/api/admin/users/stats?${queryParams.toString()}`
    );
    return response.data;
  },

  // Bulk actions on users
  bulkUpdateUsers: async (userIds, action, data = {}) => {
    const response = await apiClient.post("/api/admin/users/bulk-action", {
      user_ids: userIds,
      action, // 'activate', 'deactivate', 'verify', 'unverify', 'delete'
      ...data,
    });
    return response.data;
  },

  // Send notification to user
  sendUserNotification: async (userId, notification) => {
    const response = await apiClient.post(
      `/api/admin/users/${userId}/notify`,
      notification
    );
    return response.data;
  },

  // Get active campuses (for general use - ordered alphabetically)
  getCampuses: async () => {
    const response = await apiClient.get("/api/campus");
    return response.data;
  },

  // Get active campuses with search (for dropdowns, forms, etc.)
  getActiveCampuses: async (searchTerm = "") => {
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append("search", searchTerm);

    const response = await apiClient.get(
      `/api/campus?${queryParams.toString()}`
    );
    return response.data;
  },

  // Campus management endpoints
  // Create new campus
  createCampus: async (campusData) => {
    const response = await apiClient.post("/api/campus", campusData);
    return response.data;
  },

  // Assign user as campus admin
  assignCampusAdmin: async (campusId, userId) => {
    const response = await apiClient.post(
      `/api/campus/${campusId}/assign-admin`,
      {
        user_id: userId,
        campus_id: campusId,
      }
    );
    return response.data;
  },

  // Remove user from campus admin role
  removeCampusAdmin: async (campusId, userId) => {
    const response = await apiClient.delete(
      `/api/campus/${campusId}/admin/${userId}`
    );
    return response.data;
  },

  // Get campus details
  getCampusById: async (campusId) => {
    const response = await apiClient.get(`/api/campus/${campusId}`);
    return response.data;
  },

  // Get all campuses (for super admin) - includes inactive campuses
  getAllCampuses: async (params = {}) => {
    const queryParams = new URLSearchParams();

    // Always include inactive campuses for super admin
    queryParams.append("include_inactive", "true");

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);

    const response = await apiClient.get(
      `/api/campus?${queryParams.toString()}`
    );
    return response.data;
  },

  // Update campus status
  updateCampusStatus: async (campusId, isActive) => {
    const response = await apiClient.patch(`/api/campus/${campusId}/status`, {
      is_active: isActive,
    });
    return response.data;
  },

  // Update campus details
  updateCampus: async (campusId, campusData) => {
    const response = await apiClient.put(`/api/campus/${campusId}`, campusData);
    return response.data;
  },

  // Delete campus
  deleteCampus: async (campusId) => {
    const response = await apiClient.delete(`/api/campus/${campusId}`);
    return response.data;
  },

  // Get campus admins
  getCampusAdmins: async (campusId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const response = await apiClient.get(
      `/api/campus/${campusId}/admins?${queryParams.toString()}`
    );
    return response.data;
  },

  // Admin-specific endpoints
  // Get all admins
  getAllAdmins: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.campus_id) queryParams.append("campus_id", params.campus_id);

    const response = await apiClient.get(
      `/api/admin/admins?${queryParams.toString()}`
    );
    return response.data;
  },

  // Create new admin
  createAdmin: async (adminData) => {
    const response = await apiClient.post("/api/admin/admins", adminData);
    return response.data;
  },

  // Update admin permissions
  updateAdminPermissions: async (adminId, permissions) => {
    const response = await apiClient.patch(
      `/api/admin/admins/${adminId}/permissions`,
      permissions
    );
    return response.data;
  },

  // Content moderation endpoints
  // Get reported content
  getReportedContent: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.type) queryParams.append("type", params.type); // 'listing', 'message', 'profile'
    if (params.status) queryParams.append("status", params.status); // 'pending', 'resolved', 'dismissed'

    const response = await apiClient.get(
      `/api/admin/reports?${queryParams.toString()}`
    );
    return response.data;
  },

  // Moderate content
  moderateContent: async (reportId, action, reason = "") => {
    const response = await apiClient.post(
      `/api/admin/reports/${reportId}/moderate`,
      {
        action, // 'approve', 'remove', 'warn', 'ban'
        reason,
      }
    );
    return response.data;
  },

  // System analytics endpoints
  getSystemAnalytics: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.period) queryParams.append("period", params.period);
    if (params.metric) queryParams.append("metric", params.metric);

    const response = await apiClient.get(
      `/api/admin/analytics?${queryParams.toString()}`
    );
    return response.data;
  },

  // Platform health check
  getPlatformHealth: async () => {
    const response = await apiClient.get("/api/admin/health");
    return response.data;
  },

  // Campus Admin specific endpoints
  // Get users for campus admin (only users from their campus)
  getCampusUsers: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.verified) queryParams.append("verified", params.verified);

    // Use the correct endpoint: GET /api/admin/campus/{campus_id}/users
    if (!params.campus_id) {
      throw new Error("campus_id is required for getCampusUsers");
    }

    const response = await apiClient.get(
      `/api/admin/campus/${params.campus_id}/users?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get campus admin's own campus details
  getMyCampus: async () => {
    const response = await apiClient.get("/api/admin/campus/my-campus");
    return response.data;
  },

  // Get campus statistics for campus admin
  getCampusStats: async () => {
    const response = await apiClient.get("/api/admin/campus/stats");
    return response.data;
  },

  // Student Verification Management
  // Get pending student verifications for review
  getPendingVerifications: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.campus_id) queryParams.append("campus_id", params.campus_id);
    if (params.status) queryParams.append("status", params.status); // 'pending', 'approved', 'rejected'

    const response = await apiClient.get(
      `/api/admin/verifications?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get single verification details
  getVerificationById: async (verificationId) => {
    const response = await apiClient.get(
      `/api/admin/verifications/${verificationId}`
    );
    return response.data;
  },

  // Approve or reject student verification
  reviewVerification: async (verificationId, status, review_note = "") => {
    const response = await apiClient.post(
      `/api/admin/verifications/${verificationId}/review`,
      {
        status, // 'approved' or 'rejected'
        review_note, // Required for 'rejected', optional for 'approved'
      }
    );
    return response.data;
  },

  // Bulk review verifications
  bulkReviewVerifications: async (
    verificationIds,
    status,
    review_note = ""
  ) => {
    const response = await apiClient.post(
      "/api/admin/verifications/bulk-review",
      {
        verification_ids: verificationIds,
        status, // 'approved' or 'rejected'
        review_note, // Required for 'rejected', optional for 'approved'
      }
    );
    return response.data;
  },

  // Get verification statistics
  getVerificationStats: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.period) queryParams.append("period", params.period); // 'daily', 'weekly', 'monthly'
    if (params.campus_id) queryParams.append("campus_id", params.campus_id);

    const response = await apiClient.get(
      `/api/admin/verifications/stats?${queryParams.toString()}`
    );
    return response.data;
  },

  // Listing Management (Market)
  // Get all listings for admin review
  getAllListings: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status); // 'pending', 'approved', 'rejected'
    if (params.category) queryParams.append("category", params.category);
    if (params.campus_id) queryParams.append("campus_id", params.campus_id);
    if (params.type) queryParams.append("type", params.type); // 'item', 'room'

    try {
      const response = await apiClient.get(
        `/api/admin/listings?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      // If API endpoints don't exist yet, return mock/empty data
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.warn(
          "Listings API endpoint not available, using fallback data"
        );
        return {
          items: [],
          total: 0,
          offset: params.page ? (params.page - 1) * (params.limit || 10) : 0,
          limit: params.limit || 10,
        };
      }
      throw error;
    }
  },

  // Get single listing details for admin
  getListingById: async (listingId) => {
    try {
      const response = await apiClient.get(`/api/admin/listings/${listingId}`);
      return response.data;
    } catch (error) {
      // If API endpoints don't exist yet, return mock data or throw meaningful error
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.warn("Listing detail API endpoint not available");
        throw new Error("Listing not found or API not available");
      }
      throw error;
    }
  },

  // Approve or reject listing
  reviewListing: async (listingId, status, review_note = "") => {
    try {
      const response = await apiClient.post(
        `/api/admin/listings/${listingId}/review`,
        {
          status, // 'approved' or 'rejected'
          review_note, // Required for 'rejected', optional for 'approved'
        }
      );
      return response.data;
    } catch (error) {
      // If API endpoints don't exist yet, simulate response
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.warn("Review listing API endpoint not available");
        throw new Error(
          "Review functionality not yet implemented on the backend"
        );
      }
      throw error;
    }
  },

  // Bulk review listings
  bulkReviewListings: async (listingIds, status, review_note = "") => {
    try {
      const response = await apiClient.post("/api/admin/listings/bulk-review", {
        listing_ids: listingIds,
        status, // 'approved' or 'rejected'
        review_note, // Required for 'rejected', optional for 'approved'
      });
      return response.data;
    } catch (error) {
      // If API endpoints don't exist yet, simulate response
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.warn("Bulk review listing API endpoint not available");
        throw new Error(
          "Bulk review functionality not yet implemented on the backend"
        );
      }
      throw error;
    }
  },

  // Get listing statistics
  getListingStats: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.period) queryParams.append("period", params.period); // 'daily', 'weekly', 'monthly'
    if (params.campus_id) queryParams.append("campus_id", params.campus_id);
    if (params.type) queryParams.append("type", params.type); // 'item', 'room'

    try {
      const response = await apiClient.get(
        `/api/admin/listings/stats?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      // If API endpoints don't exist yet, return mock stats
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.warn(
          "Listing stats API endpoint not available, using fallback data"
        );
        return {
          pending: 0,
          approved: 0,
          rejected: 0,
          items: 0,
          rooms: 0,
          total: 0,
        };
      }
      throw error;
    }
  },

  // Get pending listings for review
  getPendingListings: async (params = {}) => {
    return this.getAllListings({ ...params, status: "pending" });
  },

  // Campus Admin Marketplace Management
  // Get listings for a specific campus (Campus Admin scoped)
  getCampusListings: async (campusId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status); // 'pending', 'approved', 'rejected'
    if (params.category) queryParams.append("category", params.category);
    if (params.type) queryParams.append("type", params.type); // 'item', 'room'

    try {
      const response = await apiClient.get(
        `/api/admin/campus/${campusId}/listings?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      // If API endpoints don't exist yet, return mock/empty data
      if (error.response?.status === 404 || error.response?.status === 405) {
        console.warn(
          "Campus listings API endpoint not available, using fallback data"
        );
        return {
          items: [],
          total: 0,
          offset: params.page ? (params.page - 1) * (params.limit || 10) : 0,
          limit: params.limit || 10,
        };
      }
      throw error;
    }
  },
};
