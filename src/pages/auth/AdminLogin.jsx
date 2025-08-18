import { useState, useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import student from "@/assets/images/AdminLoginImg.jpg";
import googleIcon from "@/assets/icons/googleIcon.svg";
import showPassword from "@/assets/icons/showPassword.svg";
import hidePassword from "@/assets/icons/hidePassword.svg";
import { Link, useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [viewPassword, setViewPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setFormData({ email: "", password: "" });
    };
  }, []);

  const validate = () => {
    const newErrors = {};

    const adminEmailRegex = /^admin@[\w.-]+\.[A-Za-z]{2,}$/;
    if (!adminEmailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid admin email.";
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    sessionStorage.setItem("admin-session", JSON.stringify({ role: "admin" }));
    navigate("/admin/dashboard");
  };

  return (
    <AuthLayout image={student} imageAlt="Student with an open book">
      <div className="mt-12 max-w-md mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 text-center">
          Welcome Back!
        </h1>
        <p className="text-gray-600 mt-1 mb-8 text-center">Log in to StudEx</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="mb-2">
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={viewPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
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
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-gray-500">
                Must be at least 8 characters
              </p>
              <Link className="text-xs text-green-600 underline cursor-pointer" to="/admin/forgot-password">
                Forgot password?
              </Link>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className={`mt-6 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors 
    ${
      formData.email || formData.password
        ? "bg-purple-600 hover:bg-purple-700 text-white"
        : "bg-purple-300 text-white"
    }`}
          >
            <span>← Log In →</span>
          </button>
        </form>

        <div className="flex items-center gap-2 my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="text-gray-400 text-sm">Or</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          type="button"
          className="w-full border border-gray-300 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <img className="h-5 w-5" src={googleIcon} alt="Google Icon" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;