import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import ForgotPasswordImg from "../../assets/images/ForgotPasswordImg.jpg";
import googleIcon from "../../assets/icons/google-icon.svg";
import Eye from "../../assets/icons/eye.svg";
import EyeOff from "../../assets/icons/eye-off.svg";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        console.log("Form is valid, proceed with login", { email, password });
        setIsSubmitting(false);
        navigate("/dashboard");
      }, 1500);
    }
  };

  return (
    <AuthLayout image={ForgotPasswordImg} imageAlt="Login Image">
      <div className="flex flex-col justify-center mt-12 max-w-full">
        <div className="flex flex-col">
                  <h1 className="font-meduim text-3xl mb-4 text-gray-900 ">
Welcome back!</h1>
        <p className="text-gray-600 mb-8">
            Sign in to continue buying, selling, or finding your next roommate.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div >
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
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
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-purple-700"
                }`}
              disabled={
                !email ||
                !password ||
                errors.email ||
                errors.password ||
                isSubmitting
              }
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Google Login */}
          <Link
            to="/auth/google"
            className="w-full flex items-center justify-center gap-2 mb-6"
          >
            <img src={googleIcon} alt="Google" className="w-4 h-4" />
            <span>Log In with Google</span>
          </Link>

          {/* Signup Link */}
          <p className="text-center text-sm mt-4 text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
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
