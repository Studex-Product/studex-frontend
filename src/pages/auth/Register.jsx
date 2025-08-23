import React, { useState, useEffect } from "react";
import AuthLayout from "../../components/auth/AuthLayout";
import google from "../../assets/icons/icons8-google.svg";
import RegisterImg from "@/assets/images/RegisterImg.jpg";
import Eye from "../../assets/icons/eye.svg";
import EyeOff from "../../assets/icons/eye-off.svg";

const Register = () => {
  // for the password input fields
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // form validation
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Individual form field states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // To calculate progress
  
  // const [progress, setProgress] = useState(0);
  // useEffect(() => {
  //   const fields = [firstName, lastName, email, password, confirmPassword];
  //   const filledFields = fields.filter((field) => field.trim() !== "").length;
  //   const progressPercentage = (filledFields / fields.length) * 100;
  //   setProgress(progressPercentage);
  // }, [firstName, lastName, email, password, confirmPassword]);
  
  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 50;

  // Individual field handlers
  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    const currentData = {
      firstName: value,
      lastName,
      email,
      password,
      confirmPassword,
    };
    setFormErrors(validate(currentData));
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    const currentData = {
      firstName,
      lastName: value,
      email,
      password,
      confirmPassword,
    };
    setFormErrors(validate(currentData));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    const currentData = {
      firstName,
      lastName,
      email: value,
      password,
      confirmPassword,
    };
    setFormErrors(validate(currentData));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    const currentData = {
      firstName,
      lastName,
      email,
      password: value,
      confirmPassword,
    };
    setFormErrors(validate(currentData));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    const currentData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword: value,
    };
    setFormErrors(validate(currentData));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentData = {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    };
    setFormErrors(validate(currentData));
    setIsSubmit(true);
  };
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const formData = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      };
      console.log(formData);
    }
  }, [formErrors, firstName, lastName, email, password, confirmPassword, isSubmit]);

  const validate = (values) => {
    const errors = {};
    const nameRegex = /^[a-zA-Z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // First name
    if (!values.firstName) {
      errors.firstName = "First Name is required";
    } else if (values.firstName.length < 3) {
      errors.firstName = "First Name must be more than 3 characters";
    } else if (!nameRegex.test(values.firstName)) {
      errors.firstName = "First Name can only contain characters";
    }

    // Last name
    if (!values.lastName) {
      errors.lastName = "Last Name is required";
    } else if (values.lastName.length < 3) {
      errors.lastName = "Last Name must be more than 3 characters";
    } else if (!nameRegex.test(values.lastName)) {
      errors.lastName = "Last Name can only contain characters";
    }

    // Email
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Please enter a valid email";
    }

    // Password
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])/.test(values.password)) {
      errors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(values.password)) {
      errors.password = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(values.password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/(?=.*[@$!%*?&])/.test(values.password)) {
      errors.password = "Password must contain at least one special character (@$!%*?&)";
    }

    // Confirm password
    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = "Password does not match";
    }

    return errors;
  };


  return (
    
    <AuthLayout
      image={RegisterImg}
      imageAlt={"Student smiling at her phone"}
      children={
        <div className="flex flex-col gap-4 max-w-full p-1 overflow-hidden">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Sign up</h1>
          <p className=" text-gray-600">
            Create your free StudEx account to start selling, buying or finding
            a roommate within your university community.
          </p>

          {/* Progress Bar */}
          <div className="">
            <div className="flex justify-between text-gray-600 ">
              <span>Step {currentStep} of {totalSteps}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full">
              <div
                className="bg-chart-4 h-1 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>


          {/* Form Inputs */}
          <form action="" onSubmit={handleSubmit} noValidate>
            <>
            {currentStep === 1 && (
            <div className="space-y-4">
          {/* Personal Information  */}
          <h3 className=" text-[var(--primary)]">Personal Information</h3>
            {/* Names Input */}
            <div className="flex flex-col md:flex-row w-full gap-2">
              {/* First name */}
              <div className="flex w-full flex-col">
                <label
                  htmlFor="first-name"
                  className="text-sm text-accent-foreground font-medium "
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="input"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  placeholder="Fatima"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    firstName.length < 3 && firstName.length > 0
                      ? "border-destructive"
                      : firstName.length >= 3
                      ? "border-chart-2"
                      : "border-border"
                  }`}
                />
                {formErrors.firstName && (
                  <p className="text-destructive text-xs">
                    {formErrors.firstName}
                  </p>
                )}{" "}
              </div>

              {/* Last Name */}
              <div className="flex w-full flex-col">
                <label
                  htmlFor="last-name"
                  className="text-sm text-accent-foreground font-medium"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Yusuf"
                  value={lastName}
                  onChange={handleLastNameChange}
                  id="input"
                  className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    lastName.length < 3 && lastName.length > 0
                      ? "border-destructive"
                      : lastName.length >= 3
                      ? "border-chart-2"
                      : "border-border"
                  }`}
                />
                {formErrors.lastName && (
                  <p className="text-destructive text-xs">
                    {formErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-4 relative">
              <label
                htmlFor="email"
                className="text-sm text-accent-foreground font-medium "
              >
                Email
              </label>
              <input
                type="email"
                placeholder="e.g fatimayusuf@unilag.edu.ng"
                value={email}
                onChange={handleEmailChange}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {formErrors.email && (
                <p className="text-destructive text-xs ">{formErrors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div className="password">
              {/* Create Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="text-sm text-accent-foreground font-medium "
                >
                  Create Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer"
                  >
                  {showPassword ? (
                    <img src={Eye} alt="Show Password" className="w-4 h-4" />
                  ) : (
                    <img src={EyeOff} alt="Hide Password" className="w-4 h-4" />
                  )}
                  </button>
                  {formErrors.password && (
                    <p className="text-destructive text-xs ">
                      {formErrors.password}
                    </p>
                  )}
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label
                  htmlFor="confirm-password"
                  className="text-sm text-accent-foreground font-medium "
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="********"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer"
                  >
                  {showConfirmPassword ? (
                    <img src={Eye} alt="Show Password" className="w-4 h-4" />
                  ) : (
                    <img src={EyeOff} alt="Hide Password" className="w-4 h-4" />
                  )}
                  </button>
                  {formErrors.confirmPassword && (
                    <p className="text-destructive text-xs ">
                      {formErrors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="button"
              onClick={() => {
                if (Object.keys(formErrors).length === 0) {
                  setCurrentStep(2);
                }
              }}
              className="w-full bg-[#9046CF] text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 cursor-pointer focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
            </div>
            )}

            {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className=" text-[var(--primary)] font-semibold text-lg">Student Verification</h3>
              <p className="font-medium text-ring text-base mb-0">
                Upload a valid document that confirms you're a student. We accept:
              </p>
              <ul className="text-muted-foreground"> 
                <li>- Your current student ID card </li>
                <li> - Your admission letter </li>
              </ul>
              <div className="flex flex-col gap-2 ">
                <label className="text-secondary-foreground text-sm font-medium">Document Type</label>
                <select 
                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-muted-foreground mb-5 " > 
                  <option value="" disabled selected >select document type</option> 
                  <option value="student-id">Student ID</option>
                  <option value="admission-letter">Admission Letter</option>
                </select>
                  </div>

                {/* File Upload Input */ }
                <label className="">
                  Upload Document
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png, .pdf"
                    className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 "
                    onChange={() => {/* Handle file upload */}}
                  />
                </label>

            
            <div className="flex gap-4 flex-col md:flex-row justify-between mt-12">
              <button 
                type="button"
                onClick={() => setCurrentStep(1)}
                className="md:w-[30%] px-5 py-3  rounded-lg w-full font-semibold text-base text-chart-4 bg-purple-200 cursor-pointer hover:opacity-60"
              >
                Previous
              </button>
              <button 
                type="submit"
                className="px-5 py-3 bg-purple-600 text-white rounded-lg w-full font-semibold text-base cursor-pointer hover:opacity-60"
              >
                Continue
              </button>
            </div>
            </div>
            )}
            </>
          </form>
          
            {/* OR */}
            <div className="flex items-center my-6">
              <div className="flex-2 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">OR</span>
              <div className="flex-2 border-t border-gray-300"></div>
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
            <div className="flex justify-center gap-1 mt-10 text-base">
              <p className="text-ring font-medium">Already have an account?</p>
              <span className="text-chart-4 cursor-pointer font-semibold">
                Log in
              </span>
            </div>
        </div>
      }
    />
  );
};

export default Register;
