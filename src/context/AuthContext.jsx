import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import { getUserRole, isTokenExpired } from "@/utils/jwt";
import { authService } from "@/api/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ isProfileComplete: Boolean(false) });
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState('user');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  

  // Check for existing token on app load
  useEffect(() => {
    const storedToken =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    const storedUser =
      sessionStorage.getItem("user") || localStorage.getItem("user");
    const storedRole =
      sessionStorage.getItem("userRole") || localStorage.getItem("userRole");

    if (storedToken && storedUser) {
      try {
        // Check if token is expired
        if (isTokenExpired(storedToken)) {
            logout();
        } else {
          // Role hierarchy: cached role > JWT token > default
          let role = 'user';

          if (storedRole) {
            role = storedRole; // 1. Use cached role from localStorage
          } else {
            role = getUserRole(storedToken); // 2. Fallback to JWT token
          }

          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          setUserRole(role);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, authToken, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    // Priority hierarchy for role determination:
    // 1. Login response data (userData.role or userData.user_type)
    // 2. JWT token extraction
    // 3. Default to 'user'
    let role = 'user';

    if (userData.role) {
      role = userData.role;
    } else if (userData.user_type) {
      role = userData.user_type;
    } else if (userData.type) {
      role = userData.type;
    } else {
      // Fallback to JWT token extraction
      role = getUserRole(authToken);
    }

    // Store token and user data
    storage.setItem("token", authToken);
    storage.setItem("user", JSON.stringify(userData));
    storage.setItem("userRole", role); // Cache role separately

    // Update state
    setToken(authToken);
    setUser(userData);
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear storage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");

    // Reset state
    setToken(null);
    setUser(null);
    setUserRole('user');
    setIsAuthenticated(false);
  };

  const updateUser = (userData) => {
    const storage = localStorage.getItem("token")
      ? localStorage
      : sessionStorage;
    storage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Refresh user data from /me endpoint
  const refreshUserData = async () => {
    try {
      const freshUserData = await authService.getCurrentUser();

      // Update role from fresh data with same hierarchy
      let role = userRole; // Keep current role as fallback

      if (freshUserData.role) {
        role = freshUserData.role;
      } else if (freshUserData.user_type) {
        role = freshUserData.user_type;
      } else if (token) {
        // Fallback to JWT token extraction
        role = getUserRole(token);
      }

      // Update storage and state
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
      storage.setItem("user", JSON.stringify(freshUserData));
      storage.setItem("userRole", role);

      setUser(freshUserData);
      setUserRole(role);
      return freshUserData;
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // If /me fails and token is expired, logout
      if (token && isTokenExpired(token)) {
        logout();
      }
      throw error;
    }
  };

  const value = {
    user,
    token,
    userRole,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
