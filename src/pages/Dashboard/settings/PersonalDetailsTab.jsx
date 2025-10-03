import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
// import { UploadCloud, UserRoundIcon } from 'lucide-react';

const PersonalDetailsTab = () => {
  const { user, updateUser } = useAuth();

  const schools = [
    "University of Lagos (UNILAG)",
    "University of Benin (UNIBEN)",
    "Lagos State University (LASU)",
    "University of Nigeria, Nsukka (UNN)",
    "Bayero University Kano (BUK)",
  ];

  // State for the form, initialized from the user context
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    school: "",
  });

  // Effect to update form when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: (user.first_name && user.first_name.split(" ")[0]) || "",
        last_name: (user.last_name && user.last_name.split(" ")[0]) || "",
        email: user.email || "",
        phone: user.phone || "", // Use real data or fallback to empty
        school: user.school || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUserData = {
      ...user,
      phone: formData.phone,
      school: formData.school,
    };
    updateUser(updatedUserData);
    alert("Changes saved!");
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-medium text-gray-900">Personal Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage and update your personal information. This helps us keep your
          account accurate and personalized.
        </p>

        <div className="max-w-2xl mx-auto">
          {/* 
      <div className="mt-8 flex flex-col items-center gap-2">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            <UserRoundIcon size={80} className="text-gray-400" />
          )}
        </div>
        <div>
          <button type="button" className="flex items-center gap-2 text-sm text-purple-600 font-semibold cursor-pointer">
            <UploadCloud size={16} /> Upload image
          </button>
          <p className="text-xs text-gray-400 mt-1 text-center">JPG, PNG. max file size: 1MB</p>
        </div> 
      </div>
        */}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={formData.first_name}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={formData.last_name}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                disabled
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender
              </label>
              <select
                id="gender"
                disabled
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="" disabled>
                   Your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label
                htmlFor="school"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                School/Institution
              </label>
              <select
                id="school"
                value={formData.school}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value={formData.school} disabled>
                  Select your school
                </option>
                {schools.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 cursor-pointer"
            >
              Save Changes
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            You can only update your phone number and institution. For changes
            to other details, please contact{" "}
            <a
              href="mailto:support@studex.com"
              className="font-semibold text-purple-600"
            >
              support@studex.com
            </a>
            .
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetailsTab;
