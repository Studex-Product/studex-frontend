import { useState } from "react";
import { toast } from "sonner";
import Header from "@/components/common/Header";
import Footer from "@/components/ui/Footer";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    message: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form and show success toast
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        message: ""
      });
      
      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible."
      });
      
    } catch (error) {
      console.error("Form submission error:", error);
      setErrors({ submit: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="flex flex-col justify-center items-center my-10 lg:my-16 px-2  ">
        <h1 className=" text-[#9046CF] font-semibold text-[32px] md:mb-6 lg:text-5xl">
          Get in Touch
        </h1>
        <p className=" text-gray-600 font-normal lg:text-[18px] lg:mx-0 lg:w-4xl px-6  mb-6 text-center">
          We’re here to help whether you have a question, feedback, or need
          support, we’ll listen and respond as quickly as we can.{" "}
        </p>
        
        
        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mt-4 w-full max-w-md">
            <p>{errors.submit}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col bg-white shadow-2xl rounded-lg gap-4 mt-6 py-6 w-full md:max-w-1/2 px-6 md:px-8 mb:py-8 mb-12 text-primary">
          <p className="mb-4 md:mb-0">We’d love to hear from you. Please fill out this form.</p>
          <div className="flex md:flex-row flex-col gap-4 w-full">
            <div className="w-full">
              <label className="mb-2 text-sm" htmlFor="firstName">
                First Name
              </label>
              <input
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="eg.Fatima"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div className="w-full">
              <label
                className=" mb-2 text-sm"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="eg.Yusuf"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>
          <div className="">
            <label
                className=" mb-2 text-sm"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g fatimayusuf@unilag.edu.ng"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div className="">
            <label
                className=" mb-2 text-sm"
              htmlFor="phoneNumber"
            >
              Phone Number
            </label>
            <input
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+234 56789022"
            />
            {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
          </div>
          <div className="">
            <label
                className=" mb-2 text-sm"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              className={`w-full px-3 py-3 border mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter a description..."
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs mt-1 mb-4">{errors.message}</p>}
          </div>
          <button
            className={`max-sm:w-full px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-medium text-lg transition-colors ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-purple-300 hover:bg-[#9046CF] cursor-pointer'
            } text-white flex items-center justify-center`}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default Contact;
