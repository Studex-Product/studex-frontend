import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export const useForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState("email");
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  const {
    forgotPassword,
    resetPassword,
    isSendingResetEmail,
    isResettingPassword,
    isForgotPasswordSuccess,
    isResetPasswordSuccess,
    forgotPasswordError,
    resetPasswordError
  } = useAuth();

  // Handle success states
  useEffect(() => {
    if (isForgotPasswordSuccess) {
      setCurrentStep("emailSent");
    }
  }, [isForgotPasswordSuccess]);

  useEffect(() => {
    if (isResetPasswordSuccess) {
      setCurrentStep("success");
    }
  }, [isResetPasswordSuccess]);

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

  const handleEmailSubmit = (emailValue) => {
    setEmail(emailValue);
    forgotPassword.mutate({ email: emailValue });
  };

  const handleResendLink = (emailValue) => {
    setCanResend(false);
    setResendTimer(30);
    forgotPassword.mutate({ email: emailValue });
  };

  const handlePasswordReset = ({ token, new_password }) => {
    resetPassword.mutate({ token, new_password });
  };

  const validateToken = async (token) => {
    try {
      // TODO: Replace with actual API call to validate token
      setCurrentStep("resetPassword");
    } catch (error) {
      console.error("Token validation failed:", error);
      setCurrentStep("invalidToken");
    }
  };

  return {
    currentStep,
    setCurrentStep,
    email,
    resendTimer,
    canResend,
    isSendingResetEmail,
    isResettingPassword,
    forgotPasswordError,
    resetPasswordError,
    handleEmailSubmit,
    handleResendLink,
    handlePasswordReset,
    validateToken
  };
};