// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import { Link } from "react-router-dom";
// import RegisterImg from "@/assets/images/RegisterImg.jpg";
// import google from "@/assets/icons/icons8-google.svg";
// import Mail from "@/assets/icons/mail.svg";
// import Success from "@/assets/icons/success.svg";

// // Components
// import Logo from "@/components/common/Logo";
// import AuthLayout from "@/components/auth/AuthLayout";
// import ProgressBar from "@/components/auth/ProgressBar";
// import PersonalInfoForm from "@/components/auth/PersonalInfoForm";
// import VerificationForm from "@/components/auth/VerificationForm";

// // Hooks
// import { useAuth } from "@/hooks/useAuth";
// import { useRegistrationForm } from "@/hooks/useRegistrationForm";

// const Register = () => {
//   const [currentStep, setCurrentStep] = useState(1);
//   const totalSteps = 2;
//   const navigate = useNavigate();

//   // Email verification states
//   const [resendTimer, setResendTimer] = useState(0);
//   const [canResend, setCanResend] = useState(true);

//   // API hooks
//   const { 
//     register, 
//     verifyAccount, 
//     verifyEmail,
//     isRegistering, 
//     isVerifyingAccount, 
//     isVerifyingEmail,
//     isRegisterSuccess,
//     isVerifyAccountSuccess,
//     registerError,
//     verifyAccountError
//   } = useAuth();


//   const {
//     formData,
//     formErrors,
//     isSubmitting,
//     setIsSubmitting,
//     updateField,
//     isFormValid,
//   } = useRegistrationForm();

//   const handlePersonalInfoSubmit = async () => {
//     setIsSubmitting(true);
//     // API call
//     register.mutate({
//       fullName: formData.fullName,
//       email: formData.email,
//       password: formData.password
//     });
//     console.log("Personal data:", formData);
//     console.log("Registration successful!");

//     setTimeout(() => {
//       setCurrentStep(2);
//       setIsSubmitting(false);
//     }, 1000);
//   };

//   const handleVerificationSubmit = async (verificationData) => {

//     verifyAccount.mutate({
//       email: formData.email,
//       verificationCode: verificationData.code
//     });

//     console.log("Verification form submitted", verificationData);
//     console.log("Sending verification email to:", formData.email);

//     // Move to email verification step
//     setCurrentStep("emailSent");
//   };

//   const handleSkip = () => {
//     setCurrentStep("emailSent");
//   };

//   // Resend timer effect
//   useEffect(() => {
//     let interval;
//     if (resendTimer > 0) {
//       interval = setInterval(() => {
//         setResendTimer((prev) => prev - 1);
//       }, 1000);
//     } else if (resendTimer === 0 && !canResend) {
//       setCanResend(true);
//     }

//     return () => clearInterval(interval);
//   }, [resendTimer, canResend]);

//     // Success handling
//     useEffect(() => {
//     if (isRegisterSuccess) {
//       setCurrentStep(2);
//     }
//   }, [isRegisterSuccess]);

//   useEffect(() => {
//     if (isVerifyAccountSuccess) {
//       setCurrentStep("emailSent");
//     }
//   }, [isVerifyAccountSuccess]);

//   // Handle resend verification email
//   const handleResendVerification = () => {
//     setCanResend(false);
//     setResendTimer(30);
//     verifyEmail.mutate({ email: formData.email });

//     setTimeout(() => {
//       toast.custom(() => (
//         <span className="rounded-lg p-3 text-sm border border-green-500 shadow-lg max-w-full">
//           Verification email resent successfully!
//         </span>
//       ));
//     }, 1500);
//   };

//   // Demo function to proceed to success
//   const handleProceedToSuccess = () => {
//     setCurrentStep("success");
//     setTimeout(() => {
//       toast.custom(() => (
//         <span className="rounded-lg p-3 text-sm border border-green-500 shadow-lg max-w-full">
//           Verified email successfully!
//         </span>
//       ));
//     }, 1500);
//   };

//   // Handle continue to dashboard
//   const handleContinueToLogin = () => {
//     navigate("/login");
//   };

//   // Email verification screen
//   if (currentStep === "emailSent") {
//     return (
//       <div className="w-full h-screen flex items-center justify-center bg-gray-50 relative">
//         {/* Logo */}
//         <div className="absolute top-10 left-10">
//           <Logo />
//         </div>
//         <div className="flex flex-col justify-center items-center max-w-md px-6">
//           {/* Email Icon */}
//           <div className="flex justify-center mb-8">
//             <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
//               <img src={Mail} alt="Email icon" className="w-8 h-8" />
//             </div>
//           </div>

//           <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
//             Verify Email
//           </h1>

//           <p className="text-gray-600 mb-8 text-center">
//             We've sent a verification link to{" "}
//             <strong>
//               {formData.email.slice(0, 2)}*******{formData.email.slice(-10)}
//             </strong>
//             . Please check your inbox and click the link to verify your email.
//           </p>

//           <div className="text-center mb-6">
//             <span className="text-gray-600 text-sm">
//               Didn't receive the email?{" "}
//             </span>
//             <button
//               onClick={handleResendVerification}
//               disabled={!canResend}
//               className="text-purple-600 hover:text-purple-800 font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {!canResend ? `Resend in ${resendTimer}s` : "Resend Link"}
//             </button>
//           </div>

//           {/* Demo button to proceed to success */}
//           <button
//             onClick={handleProceedToSuccess}
//             className="text-sm text-blue-600 font-bold underline"
//           >
//             [Demo: Mark as Verified]
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Email verification success screen
//   if (currentStep === "success") {
//     return (
//       <div className="fixed w-full h-screen bg-white flex items-center justify-center ">
//         {/* Logo */}
//         <div className="absolute top-10 left-10">
//           <Logo />
//         </div>
//         <div className="flex flex-col justify-center h-full max-w-md px-6">
//           {/* Success Icon */}
//           <div className="flex justify-center mb-8">
//             <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
//               <img src={Success} alt="Success icon" className="w-8 h-8" />
//             </div>
//           </div>

//           <h1 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
//             Email Verified Successfully!
//           </h1>

//           <p className="text-gray-600 mb-8 text-center">
//             You’re all set to log in and start using the platform.{" "}
//           </p>

//           <button
//             onClick={handleContinueToLogin}
//             className="w-full bg-[#9046CF] text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer focus:outline-none transition-colors"
//           >
//             Continue to Loging
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <AuthLayout
//       image={RegisterImg}
//       imageAlt="Student smiling at her phone"
//       children={
//         <div className="flex flex-col gap-4 max-w-full pt-4 p-1 overflow-hidden">
//           <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign up</h1>
//           <p className="text-gray-600">
//             Create your free StudEx account to start selling, buying or finding
//             a roommate within your university community.
//           </p>

//           <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

//           {currentStep === 1 && (
//                 <PersonalInfoForm
//       formData={formData}
//       formErrors={formErrors}
//       updateField={updateField}
//       onSubmit={handlePersonalInfoSubmit}
//       isSubmitting={isRegistering}
//       isFormValid={isFormValid}
//     />
//           )}

//           {currentStep === 2 && (
//             <VerificationForm
//               onSubmit={handleVerificationSubmit}
//               onSkip={handleSkip}
//               personalData={formData}
//             />
//           )}

//           {/* OR */}
//           <div className="flex items-center md:my-2">
//             <div className="flex-2 border-t border-gray-300" />
//             <span className="px-4 text-gray-500 text-sm">OR</span>
//             <div className="flex-2 border-t border-gray-300" />
//           </div>

//           {/* Sign up with google */}
//           <div className="flex justify-center">
//             <button className="flex items-center justify-center gap-3 cursor-pointer">
//               <img src={google} alt="google" style={{ width: 30 }} />
//               <span className="font-semibold text-muted-foreground">
//                 Sign up with Google
//               </span>
//             </button>
//           </div>

//           {/* Log In */}
//           <div className="flex justify-center gap-1 mt-4 text-base">
//             <p className="text-ring font-medium">Already have an account?</p>
//             <Link
//               to="/login"
//               className="text-chart-4 cursor-pointer font-semibold"
//             >
//               Log in
//             </Link>
//           </div>
//         </div>
//       }
//     />
//   );
// };

// export default Register;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Email verification states
  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // API hooks
  const { 
    register, 
    verifyAccount, 
    verifyEmail,
    isRegistering, 
    isVerifyingAccount, 
    isVerifyingEmail,
    isRegisterSuccess,
    isVerifyAccountSuccess,
    isVerifyEmailSuccess,
    registerError,
    verifyAccountError
  } = useAuth();

  const {
    formData,
    formErrors,
    updateField,
    isFormValid,
  } = useRegistrationForm();

  // Handle personal info submission
  const handlePersonalInfoSubmit = async () => {
    console.log("Submitting personal data:", formData);
    
    // Call the API
    register.mutate({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password
    });
  };

  // Handle verification submission
  const handleVerificationSubmit = async (verificationData) => {
    console.log("Verification form submitted", verificationData);
    
    // Call the API
    verifyAccount.mutate({
      email: formData.email,
      verificationCode: verificationData.code
    });
  };

  const handleSkip = () => {
    setCurrentStep("emailSent");
  };

  // Success handling - move to next step when API calls succeed
  useEffect(() => {
    if (isRegisterSuccess) {
      console.log("Registration successful, moving to step 2");
      setCurrentStep(2);
    }
  }, [isRegisterSuccess]);

  useEffect(() => {
    if (isVerifyAccountSuccess) {
      console.log("Account verification successful, moving to email sent");
      setCurrentStep("emailSent");
    }
  }, [isVerifyAccountSuccess]);

  useEffect(() => {
    if (isVerifyEmailSuccess) {
      console.log("Email verification successful, moving to success");
      setCurrentStep("success");
    }
  }, [isVerifyEmailSuccess]);

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
    setCanResend(false);
    setResendTimer(30);
    
    // Call the API to resend verification email
    verifyEmail.mutate({ email: formData.email });
  };

  // Demo function to proceed to success (for testing purposes)
  const handleProceedToSuccess = () => {
    // In real app, this would be triggered by clicking email link
    // For demo, we'll simulate the email verification API call
    verifyEmail.mutate({
      token: "demo_verification_token"
    });
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
              disabled={!canResend || isVerifyingEmail}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifyingEmail ? "Sending..." : !canResend ? `Resend in ${resendTimer}s` : "Resend Link"}
            </button>
          </div>

          {/* Demo button to proceed to success */}
          <button
            onClick={handleProceedToSuccess}
            disabled={isVerifyingEmail}
            className="text-sm text-blue-600 font-bold underline disabled:opacity-50"
          >
            [Demo: Mark as Verified]
          </button>
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
    <AuthLayout
      image={RegisterImg}
      imageAlt="Student smiling at her phone"
    >
      <div className="flex flex-col gap-4 max-w-full pt-4 p-1 overflow-hidden">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign up</h1>
        <p className="text-gray-600">
          Create your free StudEx account to start selling, buying or finding
          a roommate within your university community.
        </p>

        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {currentStep === 1 && (
          <PersonalInfoForm
            formData={formData}
            formErrors={{...formErrors, apiError: registerError?.message}}
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
            personalData={formData}
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
          <button className="flex items-center justify-center gap-3 cursor-pointer">
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