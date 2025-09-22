import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/assets/icons/loader.svg";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const { validateOAuthToken } = useAuth();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get("token");
        const error = searchParams.get("error");
        const errorDescription = searchParams.get("error_description");

        // Handle error cases
        if (error) {
          let errorMessage = "OAuth authentication failed";

          if (error === "access_denied") {
            errorMessage = "Authentication was cancelled. Please try again.";
          } else if (error === "invalid_request") {
            errorMessage = "Invalid authentication request. Please try again.";
          } else if (errorDescription) {
            errorMessage = errorDescription;
          }

          setStatus("error");
          toast.custom(() => (
            <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
              {errorMessage}
            </div>
          ));

          // Redirect to login after showing error
          setTimeout(() => {
            navigate("/login");
          }, 3000);
          return;
        }

        // Handle success case
        if (token) {
          // Use the OAuth validation to get user data and update auth context
          validateOAuthToken.mutate(token, {
            onSuccess: (data) => {
              setStatus("success");

              // Get the pre-auth location or default to dashboard
              const preAuthLocation = sessionStorage.getItem('preAuthLocation') || '/dashboard';
              sessionStorage.removeItem('preAuthLocation');
              sessionStorage.removeItem('rememberMe');

              // Navigate after auth context is updated
              setTimeout(() => {
                navigate(preAuthLocation);
              }, 1500);
            },
            onError: (error) => {
              setStatus("error");

              // Clean up any stored tokens
              sessionStorage.removeItem("token");
              localStorage.removeItem("token");

              setTimeout(() => {
                navigate("/login");
              }, 3000);
            }
          });
          return;
        }

        // No token and no error - invalid callback
        setStatus("error");
        toast.custom(() => (
          <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
            Invalid authentication response. Please try again.
          </div>
        ));

        setTimeout(() => {
          navigate("/login");
        }, 3000);

      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        toast.custom(() => (
          <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
            An unexpected error occurred. Please try again.
          </div>
        ));

        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md px-6">
        {status === "processing" && (
          <>
            <div className="flex justify-center mb-6">
              <img
                src={Loader}
                alt="Loading"
                className="w-8 h-8 animate-spin"
              />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Completing your login...
            </h1>
            <p className="text-gray-600">
              Please wait while we finish setting up your account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Login Successful!
            </h1>
            <p className="text-gray-600">
              You've been successfully logged in. Redirecting to your dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
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
              There was an issue with your login. You'll be redirected to the login page shortly.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm underline"
            >
              Go to Login Now
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;