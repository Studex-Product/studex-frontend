import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";
import { getUserRole, isTokenExpired } from "@/utils/jwt";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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

    // console.log("AuthContext Debug:", {
    //   storedToken: !!storedToken,
    //   storedUser: !!storedUser,
    // });

    if (storedToken && storedUser) {
      try {
        // Check if token is expired
        if (isTokenExpired(storedToken)) {
          console.log("Stored token is expired, clearing auth data");
          logout();
        } else {
          const role = getUserRole(storedToken);
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

    // Extract role from token
    const role = getUserRole(authToken);

    // Store token and user data
    storage.setItem("token", authToken);
    storage.setItem("user", JSON.stringify(userData));

    // Update state
    setToken(authToken);
    setUser(userData);
    setUserRole(role);
    setIsAuthenticated(true);

    console.log("User logged in successfully:", userData, "with role:", role);
  };

  const logout = () => {
    // Clear storage
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Reset state
    setToken(null);
    setUser(null);
    setUserRole('user');
    setIsAuthenticated(false);

    console.log("User logged out");
  };

  const updateUser = (userData) => {
    const storage = localStorage.getItem("token")
      ? localStorage
      : sessionStorage;
    storage.setItem("user", JSON.stringify(userData));
    setUser(userData);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
