import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "@components/auth/AuthLayout";
import Logo from "@/components/common/Logo";
import ForgotPasswordImg from "@/assets/images/ForgotPasswordImg.jpg";
import Loader from "@/assets/icons/loader.svg";
import Mail from "@/assets/icons/mail.svg";
import { useAuth } from "@/hooks/useAuth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const {
    forgotPassword,
    resendVerification,
    isSendingResetEmail,
    isForgotPasswordSuccess,
    isResendVerificationSuccess,
    forgotPasswordError
  } = useAuth();

  // Check for reset token in URL - redirect to reset-password page
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      navigate(`/reset-password?token=${token}`);
    }
  }, [searchParams, navigate]);

  // Handle successful forgot password
  useEffect(() => {
    if (isForgotPasswordSuccess) {
      setIsEmailSent(true);
    }
  }, [isForgotPasswordSuccess]);

  // Handle successful resend
  useEffect(() => {
    if (isResendVerificationSuccess) {
      setResendTimer(30);
      setCanResend(false);
    }
  }, [isResendVerificationSuccess]);

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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    forgotPassword.mutate({ email: email });
  };

  const handleResendLink = () => {
    resendVerification.mutate({ email: email });
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  // Email Sent View
  if (isEmailSent) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50 relative">
        <div className="absolute top-10 left-10">
          <Logo />
        </div>
        <div className="flex flex-col justify-center items-center max-w-md px-6">
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
              disabled={!canResend || isSendingResetEmail}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSendingResetEmail
                ? "Sending..."
                : !canResend
                ? `Resend in ${resendTimer}s`
                : "Resend link"
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Email Form View
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
              disabled={isSendingResetEmail}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 ${
                emailError
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />

            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}

            {forgotPasswordError && (
              <p className="text-red-500 text-sm mt-1">
                {forgotPasswordError.response?.data?.message || forgotPasswordError.message}
              </p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSendingResetEmail || !email}
            className="w-full bg-[#9046CF] text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingResetEmail ? (
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
};

export default ForgotPassword;