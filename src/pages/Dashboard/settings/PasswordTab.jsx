import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import ConfirmPasswordChangeModal from "@/pages/Dashboard/settings/modals/ConfirmPasswordChangeModal";
import { Link } from "react-router-dom";
import Loader from "@/assets/icons/loader.svg";
import Eye from "@/assets/icons/eye.svg";
import EyeOff from "@/assets/icons/eye-off.svg";

const PasswordTab = () => {
  const {
    changePassword,
    isChangingPassword,
    changePasswordError,
    isChangePasswordSuccess,
  } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  // Password strength validation
  const getPasswordStrength = (password) => {
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    const criteriaCount = [
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasSpecialChar,
      hasMinLength,
    ].filter(Boolean).length;

    if (criteriaCount >= 4 && hasMinLength) return "strong";
    if (criteriaCount >= 2 && hasMinLength) return "medium";
    return "weak";
  };

  const passwordStrength = getPasswordStrength(passwords.newPassword);

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle successful password change
  useEffect(() => {
    if (isChangePasswordSuccess) {
      // Reset form
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setPasswordErrors({});
      setShowPasswords({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false,
      });
    }
  }, [isChangePasswordSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));

    // Clear specific field errors when user starts typing
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate passwords
  const validatePasswords = () => {
    const errors = {};

    if (!passwords.currentPassword) {
      errors.currentPassword = "Current password is required";
    }

    if (!passwords.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwords.newPassword.length < 8) {
      errors.newPassword = "New password must be at least 8 characters long";
    }

    if (!passwords.confirmNewPassword) {
      errors.confirmNewPassword = "Please confirm your new password";
    } else if (passwords.newPassword !== passwords.confirmNewPassword) {
      errors.confirmNewPassword = "Passwords do not match";
    }

    return errors;
  };

  const isFormValid = useMemo(() => {
    return (
      passwords.currentPassword.length > 0 &&
      passwords.newPassword.length >= 8 &&
      passwords.newPassword === passwords.confirmNewPassword
    );
  }, [passwords]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const errors = validatePasswords();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    if (!isFormValid) return;
    setIsModalOpen(true); // Open the confirmation modal instead of submitting directly
  };

  const handleConfirmPasswordChange = () => {
    const passwordData = {
      currentPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    };

    changePassword.mutate(passwordData);
    setIsModalOpen(false);

    // Clear form after submission
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setPasswordErrors({});
    setShowPasswords({
      currentPassword: false,
      newPassword: false,
      confirmNewPassword: false,
    });
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-medium text-gray-900">Change Password</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage your login credentials and keep your account secure.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleInputChange}
                placeholder="Enter current password"
                disabled={isChangingPassword}
                className={`w-full p-2 pr-10 border rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 ${
                  passwordErrors.currentPassword
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("currentPassword")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              >
                <img
                  src={showPasswords.currentPassword ? EyeOff : Eye}
                  alt={
                    showPasswords.currentPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="w-5 h-5 text-gray-400"
                />
              </button>
            </div>
            {passwordErrors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleInputChange}
                placeholder="Enter new password"
                disabled={isChangingPassword}
                className={`w-full p-2 pr-10 border rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 ${
                  passwordErrors.newPassword
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("newPassword")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              >
                <img
                  src={showPasswords.newPassword ? EyeOff : Eye}
                  alt={
                    showPasswords.newPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="w-5 h-5 text-gray-400"
                />
              </button>
            </div>
            {passwordErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.newPassword}
              </p>
            )}
            {passwordStrength && (
              <p
                className={`text-xs mt-1 ${
                  passwordStrength === "strong"
                    ? "text-green-600"
                    : passwordStrength === "medium"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {passwordStrength === "strong"
                  ? "Strong password"
                  : passwordStrength === "medium"
                  ? "Medium password - add special characters for stronger security"
                  : "Weak password - must be at least 8 characters with uppercase, lowercase, number, and special character"}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handleInputChange}
                placeholder="Re-enter new password"
                disabled={isChangingPassword}
                className={`w-full p-2 pr-10 border rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50 ${
                  passwordErrors.confirmNewPassword
                    ? "border-red-300"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmNewPassword")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              >
                <img
                  src={showPasswords.confirmNewPassword ? EyeOff : Eye}
                  alt={
                    showPasswords.confirmNewPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="w-5 h-5 text-gray-400"
                />
              </button>
            </div>
            {passwordErrors.confirmNewPassword && (
              <p className="text-red-500 text-sm mt-1">
                {passwordErrors.confirmNewPassword}
              </p>
            )}
          </div>

          {/* Display API errors */}
          {changePasswordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                {changePasswordError.response?.data?.message ||
                  changePasswordError.message}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 w-full">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid || isChangingPassword}
            className="w-full px-8 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            {isChangingPassword ? (
              <div className="flex items-center justify-center">
                <img
                  src={Loader}
                  alt="Loading"
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                />
                Changing Password...
              </div>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
        <div className="mt-4 w-full text-center">
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-green-600 hover:text-green-700 cursor-pointer"
          >
            Forgot Password?
          </Link>
        </div>
      </form>

      <ConfirmPasswordChangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmPasswordChange}
      />
    </>
  );
};

export default PasswordTab;
