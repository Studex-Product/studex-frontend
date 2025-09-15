import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "@components/auth/AuthLayout";
import ForgotPasswordImg from "@/assets/images/ForgotPasswordImg.jpg";
import Logo from "@/components/common/Logo";
import Eye from "@/assets/icons/eye.svg";
import EyeOff from "@/assets/icons/eye-off.svg";
import Loader from "@/assets/icons/loader.svg";
import Success from "@/assets/icons/success.svg";
import Mail from "@/assets/icons/mail.svg";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import { useResetPassword } from "../../hooks/useResetPassword";


const ForgotPassword = () => {
  // State management for different screens
  const [currentStep, setCurrentStep] = useState("email");

  const navigate = useNavigate();
  const { mutate: forgotPassword, isPending } = useForgotPassword({
      onSuccess: (data) => {
    console.log("Forgot password success:", data); // debugging log
    setCurrentStep("emailSent");
  },
  });
  const { mutate: resetPassword, isPending: isResetting } = useResetPassword({
  onSuccess: (data) => {
    console.log("Reset success:", data);
    setCurrentStep("success");
  },
  onError: (err) => {
    console.error("Reset error:", err);
  },
});


  // Email form state
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // Resend timer state
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Password reset form state
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // This is simply simulating an API call. TODO: Implement actual API
    forgotPassword(email);
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
    // This is simply simulating the resend API call. TODO: Implement actual API
    forgotPassword(email)
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

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(
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
      // This is simply simulating an API call. TODO: Implement actual API call
      resetPassword(
  {
    token: new URLSearchParams(window.location.search).get("token"),
    password: formData.newPassword,
  },
  {
    onSuccess: (data) => {
      console.log("Reset password success:", data); // debugging log
      setCurrentStep("success");
    },
    onError: (err) => {
      console.error("Reset password error:", err); // debugging log
    },
  }
);
    }
  };

  // Navigation handlers
  const handleBackToLogin = () => {
    navigate("/login");
  };

  const handleContinueToLogin = () => {
    navigate("/login");
  };

  const handleProceedToReset = () => {
    // This would normally come from email link, but for demo purposes we can move to reset directly
    // TODO: extract the token from the URL and validate it
    // For this demo, we assume the token is valid and skip the email step
    // example of email reset link: /reset-password?token=abc123
    setCurrentStep("resetPassword");
  };

  // Step 1: Email input form
  if (currentStep === "email") {
    return (
      <AuthLayout image={ForgotPasswordImg} imageAlt="Student with notebook">
        <div className="flex flex-col justify-center mt-12 max-w-full">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 mb-8">
            Don't worry, it happens! Enter your registered email address and
            we'll send you a link to create a new password.
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
                placeholder="e.g fatimayusuf@unilaq.edu.ng"
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  emailError
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />

              {emailError && (
                <p className="text-red-500 text-sm mt-1">{emailError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleEmailSubmit}
              disabled={isPending || !email}
              className="w-full bg-[#9046CF] text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center justify-center">
                  <img
                    src={Loader}
                    alt="Loading"
                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                  />
                  Sending Reset Link...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>

            {/* Back to Login Link */}
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

  // Step 2: Email sent confirmation
  if (currentStep === "emailSent") {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 relative">
        {/* Logo */}
        <div className="absolute top-10 left-10">
          <Logo />
        </div>
        <div className="flex flex-col justify-center items-center max-w-md px-6">
          {/* Email Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={Mail} alt="Email icon" className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            Check Your Email
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            We've sent you a link to reset your password. If you don't see it,
            check your spam folder.
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
          <button
            onClick={handleProceedToReset}
            className="text-sm text-blue-600 font-bold underline"
          >
            [Demo: Proceed to Password Reset]
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Password reset form
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
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.newPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
                >
                  {showPassword ? (
                    <img src={Eye} alt="Show Password" className="w-4 h-4" />
                  ) : (
                    <img src={EyeOff} alt="Hide Password" className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Show errors first, then password strength feedback */}
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword}
                </p>
              )}

              {/* Enhanced password strength indicator - only show when no errors */}
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

            {/* Confirm Password Field */}
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

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#9046CF] text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                !formData.newPassword ||
                !formData.confirmPassword ||
                isResetting
              }
            >
              {isResetting ? (
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

            {/* Back to Login Link */}
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

  // Step 4: Success state
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
};

export default ForgotPassword;
