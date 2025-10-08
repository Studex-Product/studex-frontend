import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import RegisterImg from "@/assets/images/RegisterImg.jpg";
import google from "@/assets/icons/icons8-google.svg";
import Mail from "@/assets/icons/mail.svg";
import Success from "@/assets/icons/success.svg";

// Components
import Logo from "@/components/common/Logo";
import AuthLayout from "@/components/auth/AuthLayout";
import ProgressBar from "@/components/auth/ProgressBar";
import PersonalInfoForm from "@/components/auth/PersonalInfoForm";
import VerificationForm from "@/components/auth/VerificationForm";

// Hooks
import { useAuth } from "@/hooks/useAuth";
import { useRegistrationForm } from "@/hooks/useRegistrationForm";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Email verification states
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [hasTriggeredVerification, setHasTriggeredVerification] =
    useState(false);

  // API hooks
  const {
    register,
    verifyAccount,
    verifyEmail,
    resendVerification,
    initiateGoogleLogin,
    isRegistering,
    isVerifyingAccount,
    isResendingVerification,
    isRegisterSuccess,
    isVerifyAccountSuccess,
    isVerifyEmailSuccess,
    isResendVerificationSuccess,
    registerError,
    verifyAccountError,
  } = useAuth();

  const { formData, formErrors, updateField, isFormValid } =
    useRegistrationForm();

  // Handle personal info submission
  const handlePersonalInfoSubmit = async () => {
    // Call the API
    register.mutate({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
    });
  };

  // Handle verification submission
  const handleVerificationSubmit = async (verificationData) => {
    // Call the API with email, campus, documentType, and file
    verifyAccount.mutate({
      email: verificationData.email, // Email from the verification form
      campus_id: verificationData.campus,
      document_type: verificationData.documentType,
      file: verificationData.selectedFile,
    });
  };

  const handleSkip = () => {
    setCurrentStep("emailSent");
  };

  const handleGoogleSignup = () => {
    // Use the OAuth service for signup (same flow as login)
    initiateGoogleLogin();
  };

  // Check for verification token in URL on mount
  useEffect(() => {
    const token = searchParams.get("token");
    if (token && !hasTriggeredVerification) {
      setHasTriggeredVerification(true);
      // Call verification API with the token from email link
      verifyEmail.mutate(token);
    }
  }, [searchParams, hasTriggeredVerification, verifyEmail]);
  // Success handling - move to next step when API calls succeed
  useEffect(() => {
    if (isRegisterSuccess) {
      setCurrentStep(2);
    }
  }, [isRegisterSuccess]);

  useEffect(() => {
    if (isVerifyAccountSuccess) {
      setCurrentStep("emailSent");
    }
  }, [isVerifyAccountSuccess]);

  // Listen for email verification success (fallback for React Query state issues)
  useEffect(() => {
    const handleEmailVerificationSuccess = () => {
      setCurrentStep("success");
    };

    window.addEventListener(
      "emailVerificationSuccess",
      handleEmailVerificationSuccess
    );

    return () => {
      window.removeEventListener(
        "emailVerificationSuccess",
        handleEmailVerificationSuccess
      );
    };
  }, []);

  useEffect(() => {
    if (isVerifyEmailSuccess) {
      setCurrentStep("success");
    }
  }, [isVerifyEmailSuccess]);

  useEffect(() => {
    if (isResendVerificationSuccess) {
      // Reset timer when resend is successful
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

  // Handle resend verification email
  const handleResendVerification = () => {
    // Call the API to resend verification email
    resendVerification.mutate({ email: formData.email });
  };

  // Handle continue to login
  const handleContinueToLogin = () => {
    navigate("/login");
  };

  // Email verification screen
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
            Verify Email
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            We've sent a verification link to{" "}
            <strong>
              {formData.email.slice(0, 2)}*******{formData.email.slice(-10)}
            </strong>
            . Please check your inbox and click the link to verify your email.
          </p>

          <div className="text-center mb-6">
            <span className="text-gray-600 text-sm">
              Didn't receive the email?{" "}
            </span>
            <button
              onClick={handleResendVerification}
              disabled={!canResend || isResendingVerification}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResendingVerification
                ? "Sending..."
                : !canResend
                ? `Resend in ${resendTimer}s`
                : "Resend Link"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Email verification success screen
  if (currentStep === "success") {
    return (
      <div className="fixed w-full h-screen bg-white flex items-center justify-center">
        {/* Logo */}
        <div className="absolute top-10 left-10">
          <Logo />
        </div>
        <div className="flex flex-col justify-center h-full max-w-md px-6">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <img src={Success} alt="Success icon" className="w-8 h-8" />
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
            Email Verified Successfully!
          </h1>

          <p className="text-gray-600 mb-8 text-center">
            You're all set to log in and start using the platform.
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

  return (
    <AuthLayout image={RegisterImg} imageAlt="Student smiling at her phone">
      <div className="flex flex-col gap-4 max-w-full pt-4 p-1 overflow-hidden">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign up</h1>
        <p className="text-gray-600">
          Create your free StudEx account to start selling, buying or finding a
          roommate within your university community.
        </p>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {currentStep === 1 && (
          <PersonalInfoForm
            formData={formData}
            formErrors={{ ...formErrors, apiError: registerError?.message }}
            updateField={updateField}
            onSubmit={handlePersonalInfoSubmit}
            isSubmitting={isRegistering}
            isFormValid={isFormValid}
          />
        )}

        {currentStep === 2 && (
          <VerificationForm
            onSubmit={handleVerificationSubmit}
            onSkip={handleSkip}
            email={formData.email}
            isSubmitting={isVerifyingAccount}
            error={verifyAccountError?.message}
          />
        )}

        {/* OR */}
        <div className="flex items-center md:my-2">
          <div className="flex-2 border-t border-gray-300" />
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-2 border-t border-gray-300" />
        </div>

        {/* Sign up with google */}
        <div className="flex justify-center">
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-50 py-2 px-4 rounded-lg transition-colors"
          >
            <img src={google} alt="google" style={{ width: 30 }} />
            <span className="font-semibold text-muted-foreground">
              Sign up with Google
            </span>
          </button>
        </div>

        {/* Log In */}
        <div className="flex justify-center gap-1 mt-4 text-base">
          <p className="text-ring font-medium">Already have an account?</p>
          <Link
            to="/login"
            className="text-chart-4 cursor-pointer font-semibold"
          >
            Log in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
