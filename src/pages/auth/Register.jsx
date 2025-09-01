import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import RegisterImg from "@/assets/images/RegisterImg.jpg";
import { Link } from "react-router-dom";
import google from "../../assets/icons/icons8-google.svg";

// Components
import ProgressBar from "../../components/auth/ProgressBar";
import PersonalInfoForm from "../../components/auth/PersonalInfoForm";
import VerificationForm from "../../components/auth/VerificationForm";

// Hooks
import { useRegistrationForm } from "../../hooks/useRegistrationForm";

const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const navigate = useNavigate();

  const {
    formData,
    formErrors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    isFormValid,
  } = useRegistrationForm();

  const handlePersonalInfoSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    console.log('Personal data:', formData);
    // For now, simulate successful registration
    console.log('Registration successful!');
    setTimeout(() => {
      setCurrentStep(2);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleVerificationSubmit = async (verificationData) => {
    console.log('Verification form submitted', verificationData);
    
      // Navigate to dashboard on success
      navigate('/dashboard');
      
  };

  const handlePrevious = () => {
    setCurrentStep(1);
  };


  return (
    <AuthLayout
      image={RegisterImg}
      imageAlt="Student smiling at her phone"
      children={
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
              formErrors={formErrors}
              updateField={updateField}
              onSubmit={handlePersonalInfoSubmit}
              isSubmitting={isSubmitting}
              isFormValid={isFormValid}
            />
          )}

          {currentStep === 2 && (
            <VerificationForm
              onSubmit={handleVerificationSubmit}
              onPrevious={handlePrevious}
              personalData={formData}
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
            <Link to="/login" className="text-chart-4 cursor-pointer font-semibold">
              Log in
            </Link>
          </div>
        </div>
      }
    />
  );
};

export default Register;
