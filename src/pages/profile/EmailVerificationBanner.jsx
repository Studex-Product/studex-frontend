import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Mail } from "lucide-react";

const EmailVerificationBanner = () => {
  const { user, resendVerification } = useAuth();

  // If the email is verified or there's no user, show nothing.
  if (!user || user.email_verified) {
    return null;
  }

  const handleResendVerification = () => {
    resendVerification.mutate({ email: user.email });
  };

  return (
    <div
      className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 hover:bg-blue-200 p-4 mb-4 transition-all duration-200 rounded-r-lg cursor-pointer"
      onClick={handleResendVerification}
    >
      <div className="flex items-center">
        <Mail size={30} className="mr-3" />
        <div>
          <p className="font-medium">Verify Your Email</p>
          <p className="text-xs">
            You need to verify your email before you can list an item. Click
            here to resend verification email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
