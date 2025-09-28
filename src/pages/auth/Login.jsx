import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthLayout from "@/components/auth/AuthLayout";
import ForgotPasswordImg from "@/assets/images/ForgotPasswordImg.jpg";
import googleIcon from "@/assets/icons/google-icon.svg";
import Eye from "@/assets/icons/eye.svg";
import EyeOff from "@/assets/icons/eye-off.svg";
import { useAuth } from "@/hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // API hooks
  const {
    login,
    isLoggingIn,
    isLoginSuccess,
    loginError,
    initiateGoogleLogin
  } = useAuth();

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Submitting login with:", { email, password });

      // Call the API through our hook
      login.mutate({
        email,
        password
      });
    }
  };

  const handleGoogleLogin = () => {
    // Store remember me preference if needed (you can add a checkbox later)
    // const rememberMe = document.querySelector('input[name="remember"]')?.checked;
    // if (rememberMe) {
    //   sessionStorage.setItem("rememberMe", "true");
    // }

    // Use the OAuth service
    initiateGoogleLogin();
  };

  // Note: Redirect is now handled automatically by the useAuth hook based on user role

  return (
    <AuthLayout image={ForgotPasswordImg} imageAlt="Login Image">
      <div className="flex flex-col justify-center mt-12 max-w-full">
        <div className="flex flex-col">
          <h1 className="font-medium text-3xl mb-4 text-gray-900">
            Welcome back!
          </h1>
          <p className="text-gray-600 mb-8">
            Sign in to continue buying, selling, or finding your next roommate.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                placeholder="e.g fatimahyusuf@unilag.edu.ng"
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2
                  ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-purple-500"
                  }`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (!/^\S+@\S+\.\S+$/.test(e.target.value)) {
                    setErrors((prev) => ({
                      ...prev,
                      email: "Invalid email format",
                    }));
                  } else {
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }
                }}
                disabled={isLoggingIn}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="**********"
                  className={`w-full px-3 py-2 pr-12 rounded-md border focus:outline-none focus:ring-2
                    ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-purple-500"
                    }`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!e.target.value) {
                      setErrors((prev) => ({
                        ...prev,
                        password: "Password is required",
                      }));
                    } else if (e.target.value.length < 6) {
                      setErrors((prev) => ({
                        ...prev,
                        password: "Password must be at least 6 characters",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, password: "" }));
                    }
                  }}
                  disabled={isLoggingIn}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer disabled:cursor-not-allowed"
                  disabled={isLoggingIn}
                >
                  <img
                    className="w-5 h-5"
                    src={showPassword ? Eye : EyeOff}
                    alt="Password visibility toggle icon"
                  />
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}

            {/* API Error Display */}
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">
                  {loginError.response?.data?.message ||
                   (loginError.response?.status === 401 || loginError.response?.status === 422)
                     ? "Invalid email or password"
                     : loginError.response?.status === 404
                     ? "Account not found"
                     : loginError.response?.status === 429
                     ? "Too many login attempts. Please try again later"
                     : loginError.response?.status === 500
                     ? "Server error. Please try again later"
                     : "Login failed. Please check your credentials"}
                </p>
                {console.log("Login error details:", loginError)}
              </div>
            )}

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-purple-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className={`w-full bg-purple-600 text-white py-2 rounded-md transition
                ${
                  !email ||
                  !password ||
                  errors.email ||
                  errors.password ||
                  isLoggingIn
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-purple-700 cursor-pointer"
                }`}
              disabled={
                !email ||
                !password ||
                errors.email ||
                errors.password ||
                isLoggingIn
              }
            >
              {isLoggingIn ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </div>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <img src={googleIcon} alt="Google" className="w-4 h-4" />
            <span>Log In with Google</span>
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm mt-4 text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-purple-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export default Login;