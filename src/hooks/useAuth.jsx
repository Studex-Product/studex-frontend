import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/authService";
import { toast } from "sonner";

export const useAuth = () => {
  const queryClient = useQueryClient();

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
      const message = error.response?.data?.message || "Registration failed";
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
      const message =
        error.response?.data?.message || "Account verification failed";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Verify Email mutation
  const verifyEmail = useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: (data) => {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Email verified successfully!
        </div>
      ));
      console.log("Email verification successful:", data);
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Email verification failed";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Login mutation
  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      // Store token in sessionStorage
      if (data.token) {
        sessionStorage.setItem("token", data.token);
      }

      // Invalidate user queries to refetch
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Login successful!
        </div>
      ));
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
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Password reset email sent! Check your inbox.
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

  return {
    // Registration flow
    register,
    verifyAccount,
    verifyEmail,

    // Authentication
    login,

    // Password management
    forgotPassword,
    resetPassword,

    // Loading states
    isRegistering: register.isPending,
    isVerifyingAccount: verifyAccount.isPending,
    isVerifyingEmail: verifyEmail.isPending,
    isLoggingIn: login.isPending,
    isSendingResetEmail: forgotPassword.isPending,
    isResettingPassword: resetPassword.isPending,

    // Error states
    registerError: register.error,
    verifyAccountError: verifyAccount.error,
    verifyEmailError: verifyEmail.error,
    loginError: login.error,
    forgotPasswordError: forgotPassword.error,
    resetPasswordError: resetPassword.error,

    // Success states
    isRegisterSuccess: register.isSuccess,
    isVerifyAccountSuccess: verifyAccount.isSuccess,
    isVerifyEmailSuccess: verifyEmail.isSuccess,
    isLoginSuccess: login.isSuccess,
    isForgotPasswordSuccess: forgotPassword.isSuccess,
    isResetPasswordSuccess: resetPassword.isSuccess,
  };
};
