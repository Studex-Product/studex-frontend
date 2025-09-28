import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthLayout from "@components/auth/AuthLayout";
import ForgotPasswordImg from "@/assets/images/ForgotPasswordImg.jpg";
import Logo from "@/components/common/Logo";
import Eye from "@/assets/icons/eye.svg";
import EyeOff from "@/assets/icons/eye-off.svg";
import Loader from "@/assets/icons/loader.svg";
import Success from "@/assets/icons/success.svg";
import { useAuth } from "@/hooks/useAuth";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState("loading");
  const [token, setToken] = useState(null);

  // Password form state
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    resetPassword,
    isResettingPassword,
    resetPasswordError,
    isResetPasswordSuccess
  } = useAuth();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 8) return "weak";
    if (
      password.length >= 8 &&
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])/.test(password)
    ) {
      return "strong";
    }
    return "medium";
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Check password strength
    if (name === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*.?&])/.test(
        formData.newPassword
      )
    ) {
      newErrors.newPassword =
        "Password must include uppercase, lowercase, number, and special character";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      resetPassword.mutate({
        token: token,
        new_password: formData.newPassword
      });
    }
  };

  // Check for reset token in URL on mount
  useEffect(() => {
    const resetToken = searchParams.get('token');
    if (resetToken) {
      setToken(resetToken);
      setCurrentStep("resetPassword");
    } else {
      // No token, redirect to forgot password page
      navigate("/forgot-password");
    }
  }, [searchParams, navigate]);

  // Handle successful password reset
  useEffect(() => {
    if (isResetPasswordSuccess) {
      setCurrentStep("success");
    }
  }, [isResetPasswordSuccess]);

  // Handle password reset errors (like invalid/expired token)
  useEffect(() => {
    if (resetPasswordError) {
      // Check if error indicates invalid token
      if (resetPasswordError.response?.status === 400 ||
          resetPasswordError.response?.status === 401 ||
          resetPasswordError.response?.data?.message?.includes('token') ||
          resetPasswordError.response?.data?.message?.includes('expired')) {
        setCurrentStep("invalidToken");
      }
    }
  }, [resetPasswordError]);

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleContinueToLogin = () => {
    navigate("/login");
  };

  // Loading state while validating token
  if (currentStep === "loading") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  // Password reset form
  if (currentStep === "resetPassword") {
    return (
      <AuthLayout image={ForgotPasswordImg} imageAlt="Student with notebook">
        <div className="flex flex-col justify-center mt-12 max-w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Create a New Password
          </h1>
          <p className="text-gray-600 mb-8">
            Your new password must be different from previous passwords.
          </p>

          <div className="space-y-6">
            {resetPasswordError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">
                  {resetPasswordError.response?.data?.message || resetPasswordError.message}
                </p>
              </div>
            )}

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={isResettingPassword}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
                    errors.newPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isResettingPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer disabled:cursor-not-allowed"
                >
                  {showPassword ? (
                    <img src={Eye} alt="Show Password" className="w-4 h-4" />
                  ) : (
                    <img src={EyeOff} alt="Hide Password" className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}

              {!errors.newPassword &&
                formData.newPassword &&
                passwordStrength && (
                  <p
                    className={`text-xs mt-1 ${
                      passwordStrength === "strong"
                        ? "text-green-600"
                        : passwordStrength === "medium"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {passwordStrength === "strong"
                      ? "Strong password"
                      : passwordStrength === "medium"
                      ? "Medium password - add special characters for stronger security"
                      : "Weak password - must be at least 8 characters with uppercase, lowercase, number, and special character"}
                  </p>
                )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Re-enter new password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  disabled={isResettingPassword}
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isResettingPassword}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? (
                    <img src={Eye} alt="Show Password" className="w-4 h-4" />
                  ) : (
                    <img src={EyeOff} alt="Hide Password" className="w-4 h-4" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#9046CF] text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !formData.newPassword ||
                !formData.confirmPassword ||
                isResettingPassword
              }
            >
              {isResettingPassword ? (
                <div className="flex items-center justify-center">
                  <img
                    src={Loader}
                    alt="Loading"
                    className="w-5 h-5 mr-2 animate-spin"
                  />
                  Resetting Password...
                </div>
              ) : (
                "Reset Password"
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToLogin}
                className="text-purple-500 hover:text-purple-700 font-medium text-sm cursor-pointer"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Success screen
  if (currentStep === "success") {
    return (
      <div className="w-full h-screen flex items-center justify-center relative">
        <div className="absolute top-10 left-10">
          <Logo />
        </div>
        <div className="flex flex-col justify-center h-full max-w-md">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={Success} alt="Success icon" className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            Password Reset Successful!
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            Your password has been updated. You can now log in with your new
            password.
          </p>

          <button
            onClick={handleContinueToLogin}
            className="w-full bg-[#9046CF] text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer focus:outline-none transition-colors"
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  // Invalid token screen
  if (currentStep === "invalidToken") {
    return (
      <AuthLayout image={ForgotPasswordImg} imageAlt="Student with notebook">
        <div className="flex flex-col justify-center mt-12 max-w-full text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="text-purple-600 hover:text-purple-700 underline cursor-pointer"
          >
            Request a new reset link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return null;
};

export default ResetPassword;