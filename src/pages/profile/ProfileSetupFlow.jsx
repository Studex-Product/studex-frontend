import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfilePictureStep from "@/pages/profile/ProfilePictureStep";
import ProfileDetailsStep from "@/pages/profile/ProfileDetailsStep";
import VerificationStep from "@/pages/profile/VerificationStep";
import ReviewStep from "@/pages/profile/ReviewStep";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const ProfileSetupFlow = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    profilePicture: null,
    aboutMe: "",
    personalities: [],
    school: "",
    idFile: null,
  });

  const totalSteps = 4;

  const steps = [
    { number: 1, title: "Personal", subtitle: "Profile Picture" },
    { number: 2, title: "Preference", subtitle: "About & Interests" },
    { number: 3, title: "Verify", subtitle: "School Verification" },
    { number: 4, title: "Review &", subtitle: "Confirmation" },
  ];

  const handleNext = (data) => {
    setProfileData((prev) => ({ ...prev, ...data }));
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCompleteSetup = () => {
    console.log("Profile setup complete with data:", profileData);
    // send data to backend then update the user's isProfileComplete status in AuthContext.
    updateUser({ ...user, isProfileComplete: true, ...profileData });
    toast.custom(() => (
      <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
        {"Profile setup complete!"}
      </div>
    ));
    navigate("/profile");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProfilePictureStep
            profilePicture={profileData.profilePicture}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <ProfileDetailsStep
            aboutMe={profileData.aboutMe}
            personalities={profileData.personalities}
            onNext={handleNext}
          />
        );
      case 3:
        return (
          <VerificationStep
            school={profileData.school}
            idFile={profileData.idFile}
            onNext={handleNext}
          />
        );
      case 4:
        return (
          <ReviewStep
            profileData={profileData}
            onComplete={handleCompleteSetup}
          />
        );
      default:
        return <ProfilePictureStep onNext={handleNext} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50/50 min-h-full">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
          {/* Beautiful Step Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-between relative">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col items-center relative z-10"
                >
                  {/* Step Circle */}
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                      currentStep > step.number
                        ? "bg-green-500 text-white shadow-lg" // Completed
                        : currentStep === step.number
                        ? "bg-purple-600 text-white shadow-lg ring-4 ring-purple-200" // Current
                        : "bg-gray-200 text-gray-500" // Upcoming
                    }`}
                  >
                    {currentStep > step.number ? (
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Step Labels */}
                  <div className="mt-3 text-center">
                    <div
                      className={`font-medium text-sm transition-colors duration-300 ${
                        currentStep >= step.number
                          ? "text-gray-900"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div
                      className={`text-xs mt-1 transition-colors duration-300 ${
                        currentStep >= step.number
                          ? "text-gray-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.subtitle}
                    </div>
                  </div>
                </div>
              ))}

              {/* Connecting Lines */}
              <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-0">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-purple-600 transition-all duration-500 ease-out"
                  style={{
                    width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              className={`flex items-center text-sm font-semibold cursor-pointer transition-colors duration-200 ${
                currentStep === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:text-purple-600"
              }`}
              disabled={currentStep === 1}
            >
              {currentStep > 1 ? (
                <>
                  <ArrowLeft size={16} className="mr-2" />
                  Back to {steps[currentStep - 2].title}
                </>
              ) : (
                "Profile Setup"
              )}
            </button>
            {/* <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-500">
                Step {currentStep} of {totalSteps}
              </span>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div> */}
          </div>

          <div>{renderStep()}</div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSetupFlow;
