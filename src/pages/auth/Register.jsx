import React, { useState, useEffect } from 'react'
import AuthLayout from "../../components/auth/AuthLayout";
import google from '../../assets/icons/icons8-google.svg'
import showIcon from '../../assets/icons/eye.svg'
import hideIcon from '../../assets/icons/eye-off.svg'

  const Register = () => {

    // for the password input fields
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    // form validation
    const [formErrors, setFormErrors] = useState({})
    const [isSubmit, setIsSubmit] = useState(false)

    // the progress bar
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    // To calculate progress
    const [progress, setProgress] = useState(0)
    useEffect(() => {
        const fields = Object.values(formData);
        const filledFields = fields.filter(field => field.trim() !== "").length;
        const progressPercentage = (filledFields / fields.length) * 100;
        setProgress(progressPercentage)
    }, [formData])

    // form validation
    const handleInputChange = (name, value) => {
       
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Update errors in real-time
        const updatedFormData = { ...formData, [name]: value };
        setFormErrors(validate(updatedFormData));
    }

     

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formData))
        setIsSubmit(true)
    }
    useEffect(() => {
        console.log(formErrors)
        if(Object.keys(formErrors).length === 0 && isSubmit) {
            console.log(formData)
        }
    }, [formErrors, setIsSubmit, formData, isSubmit])

    const validate = (values) =>{
        const errors = {};
        const nameRegex =  /^[a-zA-Z\s]+$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        // First name
        if(!values.firstName){
            errors.firstName = "First Name is required";
        } else if(values.firstName.length < 3) {
            errors.firstName = "First Name must be more than 3 characters"
        } else if(!nameRegex.test(values.firstName)) {
            errors.firstName = "First Name can only contain characters"
        }

        // Last name
        if(!values.lastName){
            errors.lastName = "Last Name is required";
        } else if(values.lastName.length < 3) {
            errors.lastName = "Last Name must be more than 3 characters"
        } else if(!nameRegex.test(values.lastName)) {
            errors.lastName = "Last Name can only contain characters"
        }

        // Email
        if(!values.email) {
            errors.email = "Email is required";
        } else if(!emailRegex.test(values.email)) {
            errors.email = "Please enter a valid email"
        }

        // Password
        if(!values.password){
            errors.password = "Password is required"
        } else if(values.password.length < 8) {
            errors.password = "Password must be at least 8 characters"
        } else if (!passwordRegex.test(values.password)) {
            errors.password = "Password must contain special characters"
        }

        // Confirm password
        if(!values.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        }
        else if(values.confirmPassword !== values.password){
            errors.confirmPassword = "Password does not match"
        }

        return errors
    }

    // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let emailBorderClass = 'border-border';
        
        // if (formData.email) {
          if (emailRegex.test(formData.email)) {
            emailBorderClass = "border-chart-2 bg-white";
          } else {
            emailBorderClass = "border-destructive bg-white";
          }
        // }
        

        // Password Regex
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        let passwordBorderClass = 'border-border';
        
        if (formData.email) {
          if (passwordRegex.test(formData.password)) {
            passwordBorderClass = "border-chart-2 bg-white";
          } else {
            passwordBorderClass = "border-destructive bg-white";
          }
        }

        // Confirm Password Regex
        const confirmPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        let confirmPasswordBorderClass = 'border-border';
        
        if (formData.email) {
          if (confirmPasswordRegex.test(formData.confirmPassword)) {
            confirmPasswordBorderClass = "border-chart-2 bg-white";
          } else {
            confirmPasswordBorderClass = "border-destructive bg-white";
          }
        }

     return (
    <AuthLayout
      children={
        <div className="w-140 leading-6">

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step 1 of 2</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-chart-4 h-2 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}></div>
            </div>
          </div>

            
          {/* From inputs */}
          <form action="" onSubmit={handleSubmit} noValidate>
            <h1 className="text-shadow-black text-3xl font-semibold pb-2.5">
              Sign up
            </h1>
            <p className="pb-7 text-accent-foreground">
              Create your free StudEx account to start selling, buying or
              finding a roommate within your university community.
            </p>

            {/* Personal Information  */}
            <h3 className="font-medium text-lg pb-4 text-[var(--primary)]">
              Personal Information
            </h3>

            {/* Names Input */}
            <div className="flex gap-2 mb-4">

                {/* First name */}
              <div className="first-name">
                    <label
                        htmlFor="first-name"
                        className="text-sm text-accent-foreground font-medium ">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Fatima"
                        id='input'
                        className = {
                            `border-2 rounded-md p-2.5 block mt-1 w-68  px-4 py-2.5 border-border  ${
                                formData.firstName.length < 3 ? 'border-destructive' 
                                :formData.firstName.length >= 3 ? 'border-chart-2'
                                : 'bg-chart-2'
                            }`
                        }
                    />
                        <p className="text-destructive text-xs">{formErrors.firstName}</p>
              </div>

              {/* Last Name */}
              <div className="last-name">
                <label
                  htmlFor="last-name"
                  className="text-sm text-accent-foreground font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Yusuf"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  id='input'
                  className= {
                    `border-2 rounded-md p-2.5 block mt-1 w-68 py-2.5 border-border ${
                        formData.lastName.length < 3 ? 'border-destructive'
                                :formData.lastName.length >= 3 ? 'border-chart-2'
                                : 'bg-chart-2'
                    }`
                }
                />
                <p className="text-destructive text-xs">{formErrors.lastName}</p>
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-4 relative">
              <label
                    htmlFor="email"
                    className="text-sm text-accent-foreground font-medium ">
                    Email
              </label>
              <input
                    type="email"
                    placeholder="e.g fatimayusuf@unilag.edu.ng"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={
                        `border-2 rounded-md p-2.5 block mt-1 w-140 py-2.5 border-border  ${emailBorderClass}`}
              />
              {!formData.email && (
                <span className="absolute right-3 top-13 transform -translate-y-1/2 text-gray-400 text-lg font-semibold"> ? </span>
              )}
              <p className="text-destructive text-xs ">{formErrors.email}</p>
            </div>

            {/* Password Input */}
            <div className="password">

              {/* Create Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="text-sm text-accent-foreground font-medium ">
                  Create Password
                </label>
                <div className="relative">
                  <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`border-2 rounded-md p-2.5 block mt-1 w-140 py-2.5 border-border ${passwordBorderClass}`}
                        placeholder='********'
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer">
                    <img src={showPassword ? showIcon : hideIcon} alt="eyes" />
                  </button>
                  <p className="text-destructive text-xs ">{formErrors.password}</p>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-4">
                <label
                    htmlFor="confirm-password"
                    className="text-sm text-accent-foreground font-medium ">
                    Confirm Password
                </label>
                <div className="relative">
                  <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`border-2 rounded-md p-2.5 block mt-1 w-140 py-2.5 border-border ${confirmPasswordBorderClass}`}
                        placeholder='********'
                  />
                  <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-6 transform -translate-y-1/2 cursor-pointer">
                        <img
                            src={showConfirmPassword ? showIcon : hideIcon}
                            alt="eyes"
                        />
                  </button>
                  <p className="text-destructive text-xs ">{formErrors.confirmPassword}</p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              type="submit"
              className="bg-chart-4 border-2 rounded-md p-1.5 block  w-140 py-2.5 border-border mb-4 text-accent cursor-pointer mt-9">
              Continue
            </button>

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
          </form>
        </div>
      }
    />
  );
   

};

export default Register