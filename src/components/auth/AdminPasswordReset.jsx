import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import student from "../../assets/images/student.png";
import showPassword from "../../assets/icons/showPassword.svg";
import hidePassword from "../../assets/icons/hidePassword.svg";

const AdminPasswordReset = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [viewPassword, setViewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    return () => {
      setFormData({ password: "", confirmPassword: "" });
    };
  }, []);

  const validate = () => {
    const newErrors = {};

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      // API call to reset password
      // await resetPasswordAPI({ token, password: formData.password });
      setSuccessMessage("Password reset successfully");
      setTimeout(() => {
        navigate("/admin/login");
      }, 2000);
    } catch {
      setErrors({ error: "Failed to reset password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout image={student} imageAlt="Student with an open book">
        <div className="mt-12 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Invalid Reset Link
          </h1>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link 
            to="/admin/forgot-password" 
            className="text-green-600 underline cursor-pointer"
          >
            Request a new reset link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout image={student} imageAlt="Student with an open book">
      <div className="mt-12 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Reset Password
        </h1>
        <p className="text-gray-600 mt-1 mb-8 text-center">
          Enter your new admin password
        </p>

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={viewPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your new password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => setViewPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                <img
                  className="w-5 h-5"
                  src={viewPassword ? showPassword : hidePassword}
                  alt="Password visibility toggle icon"
                />
              </button>
            </div>
            <div className="mt-1">
              <p className="text-xs text-gray-500">
                Must be at least 8 characters
              </p>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-2">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="confirmPassword"
            >
              Confirm New Password
            </label>
            <input
              type={viewPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors 
    ${
      formData.password && formData.confirmPassword
        ? "bg-purple-600 hover:bg-purple-700 text-white"
        : "bg-purple-300 text-white"
    }`}
          >
            <span>{isLoading ? "Resetting..." : "← Reset Password →"}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/admin/login" 
            className="text-green-600 underline text-sm cursor-pointer"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AdminPasswordReset;