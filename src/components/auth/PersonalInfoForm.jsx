import { useState } from 'react';
import Eye from '../../assets/icons/eye.svg';
import EyeOff from '../../assets/icons/eye-off.svg';

const PersonalInfoForm = ({ 
  formData, 
  formErrors, 
  updateField, 
  onSubmit, 
  isSubmitting,
  isFormValid 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid()) {
      await onSubmit();
    }

  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <h3 className="text-[var(--primary)]">Personal Information</h3>
      <div className="space-y-4 md:space-y-6">
        
        {/* Names Input */}
        <div className="flex flex-col md:flex-row w-full gap-2">
          {/* First name */}
          <div className="flex w-full flex-col">
            <label
              htmlFor="first-name"
              className="text-sm text-accent-foreground font-medium"
            >
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              value={formData.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              placeholder="Fatima"
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formData.firstName.length < 3 && formData.firstName.length > 0
                  ? 'border-destructive'
                  : formData.firstName.length >= 3
                  ? 'border-chart-2'
                  : 'border-border'
              }`}
            />
            {formErrors.firstName && (
              <p className="text-destructive text-xs">
                {formErrors.firstName}
              </p>
            )}
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
              id="last-name"
              placeholder="Yusuf"
              value={formData.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formData.lastName.length < 3 && formData.lastName.length > 0
                  ? 'border-destructive'
                  : formData.lastName.length >= 3
                  ? 'border-chart-2'
                  : 'border-border'
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
            className="text-sm text-accent-foreground font-medium"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="e.g fatimayusuf@unilag.edu.ng"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {formErrors.email && (
            <p className="text-destructive text-xs">{formErrors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="password">
          {/* Create Password */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="text-sm text-accent-foreground font-medium"
            >
              Create Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => updateField('password', e.target.value)}
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
                <p className="text-destructive text-xs">
                  {formErrors.password}
                </p>
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="text-sm text-accent-foreground font-medium"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirm-password"
                value={formData.confirmPassword}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
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
                <p className="text-destructive text-xs">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button
          type="submit"
          className={`w-full bg-[#9046CF] md:mt-4 text-white py-3 px-4 rounded-lg font-medium focus:outline-none transition-colors ${
            !isFormValid() || isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-purple-700 cursor-pointer'
          }`}
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;