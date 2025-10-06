import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/authService";
import { toast } from "sonner";
import { useAuthContext } from "./useAuthContext";
import { getUserRole } from "@/utils/jwt";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const authContext = useAuthContext();
  const navigate = useNavigate();

  // Role-based redirect function
  const redirectByRole = (userData, token) => {
    // Get role from login response first, fallback to JWT token
    let role = "user";

    if (userData?.role) {
      role = userData.role;
    } else if (userData?.user_type) {
      role = userData.user_type;
    } else if (userData?.type) {
      role = userData.type;
    } else {
      role = getUserRole(token);
    }

    if (role === "super_admin") {
      navigate("/super-admin/dashboard");
    } else if (role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  // Register mutation
  const register = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Registration successful! Please verify your account.
        </div>
      ));
      console.log("Registration successful:", data);
    },
    onError: (error) => {
      let message = "Registration failed";

      // Check if server provided a specific message
      if (error.response?.data?.message) {
        message = `Registration failed: ${error.response.data.message}`;
      } else {
        // Provide user-friendly messages based on status code
        switch (error.response?.status) {
          case 400:
            message = "Registration failed: Invalid data provided";
            break;
          case 409:
            message = "Registration failed: Email already exists";
            break;
          case 422:
            message = "Registration failed: Please check your information";
            break;
          case 429:
            message =
              "Registration failed: Too many attempts. Please try again later";
            break;
          case 500:
            message =
              "Registration failed: Server error. Please try again later";
            break;
          default:
            if (!error.response) {
              message =
                "Registration failed: Network error. Please check your connection";
            } else {
              message = "Registration failed: Please try again";
            }
        }
      }

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Verify Account mutation
  const verifyAccount = useMutation({
    mutationFn: authService.verifyAccount,
    onSuccess: (data) => {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Account verified successfully!
        </div>
      ));
      console.log("Account verification successful:", data);
    },
    onError: (error) => {
      let message = error.response?.data?.message;

      if (!message) {
        // Provide more descriptive default message based on error status
        if (error.response?.status === 400 || error.response?.status === 401) {
          message =
            "Verification failed: Invalid or expired token. Please login to verify your email.";
        } else {
          message =
            "Account verification failed. Please try again or contact support.";
        }
      }

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Verify Email mutation (token from URL)
  const verifyEmail = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: (data) => {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Email verified successfully!
        </div>
      ));

      // Trigger custom event for success since React Query state might not update properly
      window.dispatchEvent(
        new CustomEvent("emailVerificationSuccess", { detail: data })
      );
    },
    onError: (error) => {
      let message = error.response?.data?.message;

      if (!message) {
        // Provide more descriptive default message based on error status
        if (error.response?.status === 400 || error.response?.status === 401) {
          message =
            "Verification failed: Invalid or expired token. Please login to verify your email.";
        } else {
          message =
            "Email verification failed. Please try again or contact support.";
        }
      }

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Resend Verification Email mutation
  const resendVerification = useMutation({
    mutationFn: authService.resendVerification,
    onSuccess: () => {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Verification email sent successfully!
        </div>
      ));
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to resend verification email";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Login mutation with context integration and role-based redirect
  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      let token, user;

      // Store authentication data using context
      if (data.data && data.data.token && data.data.user) {
        token = data.data.token;
        user = data.data.user;
        authContext.login(user, token);
      } else if (data.token && data.user) {
        // Alternative response structure
        token = data.token;
        user = data.user;
        authContext.login(user, token);
      } else {
        // Fallback: just store token
        if (data.token) {
          token = data.token;
          sessionStorage.setItem("token", token);
        }
      }

      // Invalidate user queries to refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Login successful!
        </div>
      ));

      // Redirect based on user role using the dedicated function
      if (token) {
        const userData = data.data?.user || data.user || user;
        redirectByRole(userData, token);
      }
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Login failed";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Forgot Password mutation
  const forgotPassword = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: (data) => {
      const message = data.message;
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          {message || "Password reset email sent successfully!"}
        </div>
      ));
      console.log("Forgot password successful:", data);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to send reset email";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Reset Password mutation
  const resetPassword = useMutation({
    mutationFn: authService.resetPassword,
    onSuccess: (data) => {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Password reset successful! You can now login.
        </div>
      ));
      console.log("Password reset successful:", data);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Password reset failed";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Change Password mutation
  const changePassword = useMutation({
    mutationFn: authService.changePassword,
    onSuccess: (data) => {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Password changed successfully! You will be logged out for security.
        </div>
      ));
      console.log("Password change successful:", data);
      // Log out user after successful password change for security
      setTimeout(() => {
        logout();
      }, 2000);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Password change failed";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Complete Profile Setup mutation
  const completeProfileSetup = useMutation({
    mutationFn: authService.completeProfileSetup,
    onSuccess: (data) => {
      // Update the user with the returned data from backend
      // Ensure backend data takes priority over existing user data
      const updatedUser = {
        ...authContext.user,
        ...(data.data || data), // Handle both response formats
        isProfileComplete: true,
      };

      authContext.updateUser(updatedUser);

      // Invalidate user queries to refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Profile setup completed successfully!
        </div>
      ));
      console.log("Profile setup successful:", data);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Profile setup failed. Please try again.";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // OAuth Google login
  const initiateGoogleLogin = () => {
    try {
      authService.initiateGoogleLogin();
    } catch (error) {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {error}:Failed to initiate Google login. Please try again.
        </div>
      ));
    }
  };

  // OAuth callback validation
  const validateOAuthToken = useMutation({
    mutationFn: authService.handleOAuthCallback,
    onSuccess: (data) => {
      // Update auth context with user data and token from /api/auth/me
      authContext.login(data.user, data.token);
      console.log("OAuth login successful:", data.user);

      // Invalidate user queries to refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Login successful!
        </div>
      ));
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "OAuth authentication failed";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Logout function
  const logout = () => {
    authContext.logout();
    queryClient.clear(); // Clear all cached queries
    toast.custom(() => (
      <div className="bg-white rounded-lg p-3 text-sm border-2 border-blue-500 shadow-lg max-w-sm w-full break-words">
        Logged out successfully
      </div>
    ));
  };

  return {
    // Registration flow
    register,
    verifyAccount,
    verifyEmail,
    resendVerification,

    // Authentication
    login,
    logout,
    initiateGoogleLogin,
    validateOAuthToken,

    // Password management
    forgotPassword,
    resetPassword,
    changePassword,

    // Profile management
    completeProfileSetup,

    // Auth context data
    user: authContext.user,
    token: authContext.token,
    userRole: authContext.userRole,
    isAuthenticated: authContext.isAuthenticated,
    isAuthLoading: authContext.isLoading,
    refreshUserData: authContext.refreshUserData,
    updateUser: authContext.updateUser,

    // Loading states
    isRegistering: register.isPending,
    isVerifyingAccount: verifyAccount.isPending,
    isVerifyingEmail: verifyEmail.isPending,
    isResendingVerification: resendVerification.isPending,
    isLoggingIn: login.isPending,
    isSendingResetEmail: forgotPassword.isPending,
    isResettingPassword: resetPassword.isPending,
    isChangingPassword: changePassword.isPending,
    isCompletingProfile: completeProfileSetup.isPending,

    // Error states
    registerError: register.error,
    verifyAccountError: verifyAccount.error,
    verifyEmailError: verifyEmail.error,
    resendVerificationError: resendVerification.error,
    loginError: login.error,
    forgotPasswordError: forgotPassword.error,
    resetPasswordError: resetPassword.error,
    changePasswordError: changePassword.error,
    completeProfileError: completeProfileSetup.error,

    // Success states
    isRegisterSuccess: register.isSuccess,
    isVerifyAccountSuccess: verifyAccount.isSuccess,
    isVerifyEmailSuccess: verifyEmail.isSuccess,
    isResendVerificationSuccess: resendVerification.isSuccess,
    isLoginSuccess: login.isSuccess,
    isForgotPasswordSuccess: forgotPassword.isSuccess,
    isResetPasswordSuccess: resetPassword.isSuccess,
    isChangePasswordSuccess: changePassword.isSuccess,
    isCompleteProfileSuccess: completeProfileSetup.isSuccess,
  };
};
