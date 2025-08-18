import { useState, useEffect } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import student from "@/assets/images/AdminLoginImg.jpg";
import googleIcon from "@/assets/icons/googleIcon.svg";
import showPassword from "@/assets/icons/showPassword.svg";
import hidePassword from "@/assets/icons/hidePassword.svg";
import Loader from "@/assets/icons/loader.svg";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [viewPassword, setViewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState("");


  useEffect(() => {
    return () => {
      setFormData({ email: "", password: "" });
    };
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else {
      const adminEmailRegex = /^[\w.-]+@studex\.com$/;
      if (!adminEmailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid admin email (admin@studex.com)";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (loginError) {
      setLoginError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setLoginError("");

      // TODO: Replace with actual API endpoint
    
  };

  return (
    <AuthLayout image={student} imageAlt="Student with an open book">
      <div className="flex flex-col justify-center max-w-full">
        <div className="flex flex-col gap-2 justify-center mb-8">
        <h1 className="md:text-4xl text-2xl md:text-center text-gray-900 md:mb-4">
          Welcome Back!
        </h1>
        <p className="text-gray-600 md:text-center md:mb-4">
          Log in to StudEx</p>
          </div>

        <form onSubmit={handleSubmit} className=" space-y-8 md:space-y-10" noValidate>
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                errors.email
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
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
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.password
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setViewPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <img
                  className="w-5 h-5"
                  src={viewPassword ? showPassword : hidePassword}
                  alt="Password visibility toggle icon"
                />
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
            {loginError && (
              <p className="text-red-600 text-sm mt-1">{loginError}</p>
            )}
            <div className="flex items-center justify-end mt-4">
              <Link className="text-xs text-green-600 underline cursor-pointer" to="/admin/forgot-password">
                Forgot password?
              </Link>
            </div>
          </div>


          <button
            type="submit"
            disabled={isSubmitting || !formData.email || !formData.password}
            className={` w-full py-3 px-4 rounded-lg font-medium cursor-pointer focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              formData.email && formData.password && !isSubmitting
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-purple-300 text-white"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <img
                  src={Loader}
                  alt="Loading"
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                />
                Logging In...
              </div>
            ) : (
              "Log In"
            )}
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