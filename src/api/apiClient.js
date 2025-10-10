import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_STUDEX_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Check if the error is due to email verification
      const errorMessage =
        error.response?.data?.detail || error.response?.data?.message || "";
      const isEmailVerificationError =
        errorMessage.toLowerCase().includes("email") &&
        (errorMessage.toLowerCase().includes("verif") ||
          errorMessage.toLowerCase().includes("unverified"));

      // Don't log out for email verification errors
      if (isEmailVerificationError) {
        return Promise.reject(error);
      }

      // Only redirect if we're not already on login/auth pages
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes("/login") ||
        currentPath.includes("/register") ||
        currentPath.includes("/forgot-password");

      if (!isAuthPage) {
        sessionStorage.removeItem("token");
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

/**
 API CLIENT USAGE GUIDE
   
 CREATE SERVICES 
  // eg. services/loginService.js
 import apiClient from '../api/apiClient';

 export const loginService = {
     // Login user
    login: async (credentials) => {
     const response = await apiClient.post('/auth/login', credentials);
     return response.data;  // Return only business data
    },
  
    };
  
  CREATE HOOKS (TanStack Query)
  
  // hooks/uselogin.js
  import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
  import { authService } from '../services/authService';
  import { toast } from 'sonner';
  
  export const useLogin = () => {
    const queryClient = useQueryClient();
  
    // Login mutation
    const login = useMutation({
      mutationFn: authService.login,
      onSuccess: (data) => {
        
        sessionStorage.setItem('token', data.token);
        
        // Invalidate user queries to refetch
        queryClient.invalidateQueries({ queryKey: ['user'] });
        toast.success('Login successful!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Login failed';
        toast.error(message);
      }
    });
  
    return {
      login
     };
  };

   THEN USE IN COMPONENTS 
  // components/LoginForm.jsx
  import React, { useState } from 'react';
  import { useAuth } from '../hooks/useAuth';
  
  const LoginForm = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const { login } = useAuth();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      login.mutate(credentials);
    };

    Do not forget to add the mock api url in your .env(Please do not commit your .env file to version control)
    VITE_STUDEX_BASE_URL= URLL
**/
