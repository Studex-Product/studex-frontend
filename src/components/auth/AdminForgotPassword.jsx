import { useState, useEffect } from "react";
import AuthLayout from "./AuthLayout";
import student from "../../assets/images/student.png";
import { Link } from "react-router-dom";

const AdminForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  // const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    return () => {
      setFormData({ email: "" });
    };
  }, []);

  const validate = () => {
    const newErrors = {};

    const adminEmailRegex = /^admin@[\w.-]+\.[A-Za-z]{2,}$/;
    if (!adminEmailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid admin email.";
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
    // setSuccessMessage("");

    try {
      // API call to send reset password email
      // await forgotPasswordAPI(formData.email);
      // setSuccessMessage("Password reset link sent to your email");
    } catch {
      setErrors({ email: "Failed to send reset link. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout image={student} imageAlt="Student with an open book">
      <div className="mt-12 max-w-md mx-auto items-center  ">
        <div className="flex flex-col items-center gap-5 min-w-full ">
          <div className="text-4xl md:text-center flex flex-col gap-4">
        <h1 className="text-4xl md:text-center">
          Forgot Password?
        </h1>
        <p className=" text-xl mt-1 mb-8 text-center">
            Enter your email and we’ll send you a reset link.
        </p>
          </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3" noValidate="noValidate">
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
              className="w-full border rounded-lg px-3 py-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`mt-6 w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors 
    ${
      formData.email
        ? "bg-purple-600 hover:bg-purple-700 text-white"
        : "bg-purple-200 text-white"
    }`}
          >
            <span>{isLoading ? "Sending..." : "← submit →"}</span>
          </button>
        </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default AdminForgotPassword;