import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const OAuthError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const message = searchParams.get("message");
    const error = searchParams.get("error");

    // Show error message
    let errorMessage = "Authentication failed. Please try again.";

    if (message === "oauth_failed") {
      errorMessage = "OAuth authentication failed. Please try again.";
    } else if (error === "access_denied") {
      errorMessage = "Authentication was cancelled. Please try again.";
    } else if (error === "invalid_request") {
      errorMessage = "Invalid authentication request. Please try again.";
    } else if (message) {
      errorMessage = decodeURIComponent(message);
    }

    toast.custom(() => (
      <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
        {errorMessage}
      </div>
    ));

    // Redirect to login page after showing error
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  }, [searchParams, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Authentication Failed
        </h1>
        <p className="text-gray-600 mb-4">
          There was an issue with your authentication. You'll be redirected to the login page shortly.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="text-purple-600 hover:text-purple-700 font-medium text-sm underline"
        >
          Go to Login Now
        </button>
      </div>
    </div>
  );
};

export default OAuthError;