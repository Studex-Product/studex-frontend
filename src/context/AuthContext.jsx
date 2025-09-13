import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData, authToken, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    // Store token and user data
    storage.setItem("token", authToken);
    storage.setItem("user", JSON.stringify(userData));

    // Update state
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);

    console.log("User logged in successfully:", userData);
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
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
