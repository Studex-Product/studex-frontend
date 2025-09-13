import apiClient from "../api/apiClient";

// Send forgot password request
export const forgotPassword = async (email) => {
  const response = await apiClient.post("/api/auth/forgot-password", { email });
  return response.data; // always return the data, not the full axios response
};

// Reset password with token and new password
export const resetPassword = async ({ token, password }) => {
  const response = await apiClient.post("/api/auth/reset-password", {
    token,
    password,
  });
  return response.data;
};
