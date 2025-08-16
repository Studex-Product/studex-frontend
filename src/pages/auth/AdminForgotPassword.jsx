import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import student from "@/assets/images/student.png";
import showPassword from "@/assets/icons/showPassword.svg";
import hidePassword from "@/assets/icons/hidePassword.svg";
import Loader from "@/assets/icons/loader.svg";
import Success from "@/assets/icons/check-circle.svg";
import Mail from "@/assets/icons/mail-01.svg";

const AdminForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [currentStep, setCurrentStep] = useState(token ? "resetPassword" : "email");

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  
  const validateAdminEmail = (email) => {
    const adminEmailRegex = /^[\w.-]+@studex\.com$/;
    return adminEmailRegex.test(email);
  };

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

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)) {
      newErrors.newPassword = "Password must include uppercase, lowercase, number, and special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
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

    setTimeout(() => {
      setCurrentStep("emailSent");
      setIsEmailSubmitting(false);
    }, 2000);
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePasswordForm()) {
      setIsSubmitting(true);
      

      setTimeout(() => {
        setCurrentStep("success");
        setIsSubmitting(false);
      }, 3000);
    }
  };

  const handleContinueToLogin = () => {
    navigate("/admin/login");
  };

  const handleProceedToReset = () => {
    setCurrentStep("resetPassword");
  };
  
  // Resend timer effect
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

  // RENDER FUNCTIONS
  
  const renderEmailStep = () => (
    <AuthLayout image={student} imageAlt="Student with an open book">
      <div className="flex flex-col justify-center mt-12 max-w-full">
        <h1 className="md:text-4xl text-2xl md:text-center text-gray-900 md:mb-4">
          Forgot Password?
        </h1>
        <p className="text-gray-600 md:text-center mb-8">
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
              placeholder="Enter your email"
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
            className={`w-full py-3 px-4 mt-6 rounded-lg font-medium focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
    </AuthLayout>
  );

  const renderEmailSentModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setCurrentStep("email")}>
      <div className="bg-white p-8 max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
        {/* Email Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16">
            <img src={Mail} alt="Email icon" className="w-full h-full" />
          </div>
        </div>

        <p className="text-gray-600 mb-6 text-center text-sm">
          Check your inbox! We've sent a password reset link.
        </p>

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
  );

  const renderPasswordResetStep = () => (
    <AuthLayout image={student} imageAlt="Student with an open book">
      <div className="flex flex-col justify-center mt-12 max-w-full">
        <h1 className="md:text-4xl text-2xl md:text-center text-gray-900 md:mb-4">
          Reset your password
        </h1>
        <p className="text-gray-600 md:text-center mb-8">
          Create a new password to access your account
        </p>

        <form onSubmit={handlePasswordSubmit} className="space-y-10">
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
              Must be at least 8 characters.
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
                Saving...
              </div>
            ) : (
              "← Change Password →"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );

  const renderSuccessStep = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={handleContinueToLogin}>
      <div className="bg-white p-8 max-w-md mx-4 relative" onClick={(e) => e.stopPropagation()}>
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16">
            <img src={Success} alt="Success icon" className="w-full h-full" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Password Reset Successful!
        </h2>

        <p className="text-gray-600 mb-6 text-center text-sm">
          Your password has been updated successfully. You can now log in with your new password.
        </p>

        <button
          onClick={handleContinueToLogin}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer focus:outline-none transition-colors"
        >
         Back to Login 
        </button>
      </div>
    </div>
  );

  // Uncomment if you want to handle invalid token case

  // const renderInvalidTokenStep = () => (
  //   <AuthLayout image={student} imageAlt="Student with an open book">
  //     <div className="flex flex-col justify-center mt-12 max-w-full text-center">
  //       <h1 className="text-2xl font-semibold text-gray-900 mb-4">
  //         Invalid Reset Link
  //       </h1>
  //       <p className="text-gray-600 mb-6">
  //         This admin password reset link is invalid or has expired.
  //       </p>
  //       <Link 
  //         to="/admin/forgot-password" 
  //         className="text-green-600 hover:text-green-700 underline cursor-pointer"
  //       >
  //         Request a new reset link
  //       </Link>
  //     </div>
  //   </AuthLayout>
  // );

  if (currentStep === "email" || currentStep === "emailSent") {
    return (
      <>
        {renderEmailStep()}
        {currentStep === "emailSent" && renderEmailSentModal()}
      </>
    );
  }

  // Password reset and success steps
  if (currentStep === "resetPassword" || currentStep === "success") {
    // Token validation (commented out for demo)
    // if (!token && currentStep === "resetPassword") {
    //   return renderInvalidTokenStep();
    // }

    return (
      <>
        {renderPasswordResetStep()}
        {currentStep === "success" && renderSuccessStep()}
      </>
    );
  }

  return null;
};

export default AdminForgotPassword;