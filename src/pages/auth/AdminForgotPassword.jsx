import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import student from "@/assets/images/student.png";
import Logo from "@/components/common/Logo";
import showPassword from "@/assets/icons/showPassword.svg";
import hidePassword from "@/assets/icons/hidePassword.svg";
import Loader from "@/assets/icons/loader.svg";
import Success from "@/assets/icons/success.svg";
import Mail from "@/assets/icons/mail-01.svg";

const AdminForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  
  // State management for different screens
  const [currentStep, setCurrentStep] = useState(token ? "resetPassword" : "email");

  // Email form state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  // Resend timer state
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Password reset form state
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Admin email validation
  const validateAdminEmail = (email) => {
    const adminEmailRegex = /^admin@[\w.-]+\.[A-Za-z]{2,}$/;
    return adminEmailRegex.test(email);
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 8) return "weak";
    if (
      password.length >= 8 &&
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)
    ) {
      return "strong";
    }
    return "medium";
  };

  // Email form handlers
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Admin email is required");
      return;
    }

    if (!validateAdminEmail(email)) {
      setEmailError("Please enter a valid admin email (admin@domain.com)");
      return;
    }

    setIsEmailSubmitting(true);

    // Simulate API call for admin password reset
    setTimeout(() => {
      setCurrentStep("emailSent");
      setIsEmailSubmitting(false);
    }, 2000);
  };

  // Resend link handler
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0 && !canResend) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [resendTimer, canResend]);

  const handleResendLink = () => {
    setCanResend(false);
    setResendTimer(30);
    
    setTimeout(() => {
      toast.custom(
        () => (
          <span className="rounded-lg p-3 text-sm border border-green-500 shadow-lg max-w-full">
            Admin reset link resent successfully!
          </span>
        )
      );
    }, 1500);
  };

  // Password form handlers
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

  const validatePasswordForm = () => {
    const newErrors = {};

    // Admin password validation (stronger requirements)
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must include uppercase, lowercase, number, and special character";
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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      setIsSubmitting(true);
      
      // Simulate API call for admin password reset
      setTimeout(() => {
        setCurrentStep("success");
        setIsSubmitting(false);
      }, 3000);
    }
  };

  // Navigation handlers

  const handleContinueToLogin = () => {
    navigate("/admin/login");
  };

  const handleProceedToReset = () => {
    setCurrentStep("resetPassword");
  };

  // Step 1: Email input form and email sent confirmation
  if (currentStep === "email" || currentStep === "emailSent") {
    return (
      <AuthLayout image={student} imageAlt="Student with an open book">
        <div className="flex flex-col justify-center mt-12 max-w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 mb-8">
            Enter your email and we'll send you a reset link.
          </p>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="admin@studex.edu.ng"
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  emailError
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                disabled={currentStep === "emailSent"}
              />

              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleEmailSubmit}
              disabled={isEmailSubmitting || !email || currentStep === "emailSent"}
              className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                email && currentStep === "email"
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-300 text-white"
              }`}
            >
              {isEmailSubmitting ? (
                <div className="flex items-center justify-center">
                  <img
                    src={Loader}
                    alt="Loading"
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                  />
                  Sending Reset Link...
                </div>
              ) : (
                "← Submit →"
              )}
            </button>
          </div>
        </div>

        {/* Modal Overlay for Email Sent */}
        {currentStep === "emailSent" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" >
            <div className="bg-white p-8 max-w-md mx-4 relative" >
              {/* Email Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 ">
                  <img src={Mail} alt="Email icon" className="w-full h-full" />
                </div>
              </div>

              <p className="text-gray-600 mb-6 text-center text-sm">
Check your inbox! We’ve sent a password reset link.              </p>

              <div className="text-center mb-6">
                <span className="text-gray-600 text-sm">
                  Didn't receive the email?{" "}
                </span>
                <button
                  onClick={handleResendLink}
                  disabled={!canResend}
                  className="text-purple-600 hover:text-purple-800 font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!canResend ? `Resend in ${resendTimer}s` : "Resend link"}
                </button>
              </div>

              {/* Demo button to proceed to password reset */}
              <div className="text-center">
                <button
                  onClick={handleProceedToReset}
                  className="text-sm text-blue-600 font-bold underline"
                >
                  [Demo: Proceed to Password Reset]
                </button>
              </div>
            </div>
          </div>
        )}
      </AuthLayout>
    );
  }

  // Step 3: Password reset form and success state
  if (currentStep === "resetPassword" || currentStep === "success") {
    // Token validation for reset password (commented out for demo)
    // if (!token && currentStep === "resetPassword") {
    //   return (
    //     <AuthLayout image={student} imageAlt="Student with an open book">
    //       <div className="flex flex-col justify-center mt-12 max-w-full text-center">
    //         <h1 className="text-2xl font-semibold text-gray-900 mb-4">
    //           Invalid Reset Link
    //         </h1>
    //         <p className="text-gray-600 mb-6">
    //           This admin password reset link is invalid or has expired.
    //         </p>
    //         <Link 
    //           to="/admin/forgot-password" 
    //           className="text-green-600 hover:text-green-700 underline cursor-pointer"
    //         >
    //           Request a new reset link
    //         </Link>
    //       </div>
    //     </AuthLayout>
    //   );
    // }

    // Success state
    if (currentStep === "success") {
      return (
        <div className="w-full h-screen flex items-center justify-center relative">
          {/* Logo */}
          <div className="absolute top-10 left-10">
            <Logo />
          </div>
          <div className="flex flex-col justify-center h-full max-w-md">
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <img src={Success} alt="Success icon" className="w-8 h-8" />
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              Admin Password Reset Successful!
            </h1>

            <p className="text-gray-600 mb-8 text-center">
              Your admin password has been updated successfully. You can now log in with your new password.
            </p>

            <button
              onClick={handleContinueToLogin}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer focus:outline-none transition-colors"
            >
              Continue to Admin Login
            </button>
          </div>
        </div>
      );
    }

    // Password reset form
    return (
      <AuthLayout image={student} imageAlt="Student with an open book">
        <div className="flex flex-col justify-center mt-12 max-w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
Reset your password          </h1>
          <p className="text-gray-600 mb-8">
Create a new password to access your account          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.newPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
                >
                  <img
                    className="w-5 h-5"
                    src={showNewPassword ? showPassword : hidePassword}
                    alt="Password visibility toggle icon"
                  />
                </button>
              </div>

              {/* Password requirements */}
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters .
              </p>

              {/* Password strength indicator */}
              {passwordStrength && formData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-medium ${
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
                        ? "Medium password"
                        : "Weak password"}
                    </span>
                  </div>
                </div>
              )}

              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
                >
                  <img
                    className="w-5 h-5"
                    src={showConfirmPassword ? showPassword : hidePassword}
                    alt="Password visibility toggle icon"
                  />
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-lg font-medium focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.newPassword && formData.confirmPassword
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-purple-300 text-white"
              }`}
              disabled={
                !formData.newPassword ||
                !formData.confirmPassword ||
                isSubmitting
              }
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <img
                    src={Loader}
                    alt="Loading"
                    className="w-5 h-5 mr-2 animate-spin"
                  />
                  Resetting Password...
                </div>
              ) : (
                "← Reset Admin Password →"
              )}
            </button>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link
                to="/admin/login"
                className="text-green-600 hover:text-green-700 underline font-medium text-sm cursor-pointer"
              >
                Back to Admin Login
              </Link>
            </div>
          </form>
        </div>
      </AuthLayout>
    );
  }
};

export default AdminForgotPassword;