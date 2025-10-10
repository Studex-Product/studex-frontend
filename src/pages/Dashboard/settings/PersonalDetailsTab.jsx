import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/api/profileService";
import { toast } from "sonner";
// import { UploadCloud, UserRoundIcon } from 'lucide-react';

const SCHOOLS = [
  "University of Lagos (UNILAG)",
  "University of Benin (UNIBEN)",
  "Lagos State University (LASU)",
  "University of Nigeria, Nsukka (UNN)",
  "Bayero University Kano (BUK)",
];

const STATES = ["Lagos"];

const LGA = [
  "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry",
  "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu",
  "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo",
  "Shomolu", "Surulere"
];

const PersonalDetailsTab = () => {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for the form, initialized from the user context
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    school: "",
    dob: "",
    gender: "",
    state: "",
    lga: "",
  });

  // Effect to update form when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: (user.first_name && user.first_name.split(" ")[0]) || "",
        last_name: (user.last_name && user.last_name.split(" ")[0]) || "",
        dob: user.dob || "",
        gender: user.gender || "",
        email: user.email || "",
        phone: user.phone || user.phoneNumber || user.phone_number || "",
        school: user.campus_name || "",
        state: user.state || "",
        lga: user.lga || "",
      });
    }
  }, [user]);

  console.log("User data in PersonalDetailsTab:", user);

  // Create schools list that includes user's current campus if not already present
  const availableSchools = React.useMemo(() => {
    const schoolsList = [...SCHOOLS];
    if (user?.campus_name && !schoolsList.includes(user.campus_name)) {
      schoolsList.unshift(user.campus_name);
    }
    return schoolsList;
  }, [user?.campus_name]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Prepare data for API call (only editable fields)
      const personalData = {
        phone: formData.phone,
        state: formData.state,
        lga: formData.lga,
      };

      // Call the API
      const response = await profileService.updatePersonalDetails(personalData);

      // Update local user context with the response
      const updatedUserData = {
        ...user,
        ...response,
      };
      updateUser(updatedUserData);

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Personal details updated successfully!
        </div>
      ));

    } catch (error) {
      console.error("Error updating personal details:", error);

      const errorMessage = error.response?.data?.message || "Failed to update personal details. Please try again.";

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {errorMessage}
        </div>
      ));
    } finally {
      setIsSubmitting(false);
    }
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
                // onChange={handleInputChange}
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
                // onChange={handleInputChange}
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
                // onChange={handleInputChange}
                disabled
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select your school</option>
                {availableSchools.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                State
              </label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select your state</option>
                {STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="lga"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Local Government Area (LGA)
              </label>
              <select
                id="lga"
                name="lga"
                value={formData.lga}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select your LGA</option>
                {LGA.map((lga) => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-8 py-2.5 text-white font-semibold rounded-lg transition-all duration-200 ${
                isSubmitting
                  ? "bg-purple-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 cursor-pointer"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-600">
            You can only update your phone number, state, and LGA. For changes
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
