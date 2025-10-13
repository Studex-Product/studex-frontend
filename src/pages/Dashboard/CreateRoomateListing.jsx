import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChevronLeft from "@/assets/icons/chevron-left.svg";
import PlusIcon from "@/assets/icons/plus-icon.svg";
import { useListing } from "@/hooks/useListing";
import { toast } from "sonner";
import EmailVerificationBanner from "../profile/EmailVerificationBanner";

const CreateItemListing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the listing hook
  const {
    createListing,
    uploadListingImages,
    isCreatingListing,
    isUploadingImages,
    createListingError,
    uploadImagesError,
    isCreateListingSuccess,
    isUploadImagesSuccess,
  } = useListing();
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    firstName: "",
    lastName: "",
    budget: "",
    preferredLocation: "",
    apartmentType: "",

    // Step 2: Additional Details
    roommatePreference: "",
    interests: [],
    photos: [],
  });

  const [errors, setErrors] = useState({});
  const [createdListingId, setCreatedListingId] = useState(null);

  // Handle successful listing creation
  useEffect(() => {
    if (isCreateListingSuccess && createListing.data && !createdListingId) {
      const listingId = createListing.data.id;
      setCreatedListingId(listingId);

      // If there are photos to upload, upload them
      if (formData.photos.length > 0) {
        console.log("Uploading images for listing:", listingId);
        uploadListingImages.mutate({
          listingId: listingId,
          files: formData.photos,
        });
      } else {
        // No images to upload, redirect to my posts
        setIsSubmitting(false);
        navigate("/my-posts");
      }
    }
  }, [
    isCreateListingSuccess,
    createListing.data,
    formData.photos,
    navigate,
    createdListingId,
    uploadListingImages,
  ]);

  // Handle successful image upload
  useEffect(() => {
    if (isUploadImagesSuccess && createdListingId) {
      console.log(
        "Images uploaded successfully for listing:",
        createdListingId
      );
      setIsSubmitting(false);
      navigate("/my-posts");
    }
  }, [isUploadImagesSuccess, createdListingId, navigate]);

  // Handle errors
  useEffect(() => {
    if (createListingError) {
      setIsSubmitting(false);
    }
  }, [createListingError]);

  useEffect(() => {
    if (uploadImagesError) {
      // Even if image upload fails, the listing was created successfully
      // We'll still redirect but show that images failed to upload
      setIsSubmitting(false);
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-orange-500 shadow-lg max-w-sm w-full break-words">
          Listing created but image upload failed. Please try recreating the listing.
        </div>
      ));
      navigate("/my-posts");
    }
  }, [uploadImagesError, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.preferredLocation) {
      newErrors.preferredLocation = "Preferred location is required";
    }
    if (!formData.apartmentType) {
      newErrors.apartmentType = "Apartment type is required";
    }

    if (!formData.budget.trim()) {
      newErrors.budget = "Budget is required";
    } else if (isNaN(formData.budget) || parseFloat(formData.budget) <= 0) {
      newErrors.budget = "Budget must be a valid positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.interests || formData.interests.length === 0) {
      newErrors.interests = "At least one interest is required";
    }

    if (!formData.roommatePreference.trim()) {
      newErrors.roommatePreference = "Roommate prefernce is required";
    } else if (formData.roommatePreference.trim().length < 10) {
      newErrors.roommatePreference =
        " Description of roommate preference must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      if (validateStep2()) {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/my-posts");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      console.log("Submitting listing:", formData);

      // Step 1: Create the listing without images
      const listingData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        budget: formData.budget,
        apartmentType: formData.apartmentType,
        roommatePreference: formData.roommatePreference,
        interests: formData.interests,
      };

      createListing.mutate(listingData);
    } catch (error) {
      console.error("Error creating listing:", error);
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxPhotos = 4;
    const currentPhotos = formData.photos.length;
    const availableSlots = maxPhotos - currentPhotos;

    if (files.length > availableSlots) {
      alert(`You can only upload ${availableSlots} more photo(s)`);
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  const removePhoto = (photoId) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((photo) => photo.id !== photoId),
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          First Name
        </label>
        <input
          type="text"
          placeholder="Jessica"
          value={formData.firstName}
          onChange={(e) => handleInputChange("firstName", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.firstName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        />
        {errors.firstName && (
          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Last Name
        </label>
        <input
          type="text"
          placeholder="Ofor"
          value={formData.lastName}
          onChange={(e) => handleInputChange("lastName", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.lastName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        />
        {errors.lastName && (
          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
        )}
      </div>

      {/* Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget (₦/year)
        </label>
        <input
          type="text"
          placeholder="e.g., 50,000"
          value={formData.budget}
          onChange={(e) => handleInputChange("budget", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.budget
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        />
        {errors.budget && (
          <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
        )}
      </div>

      {/* Preferred Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Preferred Location
        </label>
        <select
          value={formData.preferredLocation}
          onChange={(e) =>
            handleInputChange("preferredLocation", e.target.value)
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.preferredLocation
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select location</option>
          <option value="Yaba">Yaba</option>
          <option value="Akoka">Akoka</option>
          <option value="Bariga">Bariga</option>
          <option value="Shomolu">Shomolu</option>
          <option value="Surulere">Surulere</option>
          <option value="Ojuelegba">Ojuelegba</option>
          <option value="Sabo">Sabo</option>
          <option value="Ilaje">Ilaje</option>
          <option value="Fadeyi">Fadeyi</option>
        </select>
        {errors.preferredLocation && (
          <p className="text-red-500 text-sm mt-1">
            {errors.preferredLocation}
          </p>
        )}
      </div>

      {/* Apartment Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Apartment Type
        </label>
        <select
          value={formData.apartmentType}
          onChange={(e) => handleInputChange("apartmentType", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.apartmentType
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select apartment</option>
          <option value="Self-contained">Self-contained</option>
          <option value="Shared-apartment">Shared Apartment</option>
          <option value="Mini-flat">Mini-flat</option>
          <option value="bunk/hostel-room">Bunk/Hostel Room</option>
          <option value="Duplex-Shared">Duplex-Shared</option>
          <option value="Studio-apartment">Studio Apartment</option>
        </select>
        {errors.apartmentType && (
          <p className="text-red-500 text-sm mt-1">{errors.apartmentType}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Roommate Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roommate Preference
        </label>
        <textarea
          placeholder="Prefer a tidy person, non-smoker, easy-going."
          rows={4}
          value={formData.roommatePreference}
          onChange={(e) =>
            handleInputChange("roommatePreference", e.target.value)
          }
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
            errors.roommatePreference
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        />
        {errors.roommatePreference && (
          <p className="text-red-500 text-sm mt-1">
            {errors.roommatePreference}
          </p>
        )}
      </div>

      {/* Interests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interests
        </label>
        <select
          onChange={(e) => {
            const selected = e.target.value;
            if (selected && !formData.interests.includes(selected)) {
              handleInputChange("interests", [...formData.interests, selected]);
            }
          }}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.interests
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select one or more interests</option>
          <option value="Reading">Reading</option>
          <option value="Watching-football">Watching Football</option>
          <option value="Music">Music</option>
          <option value="Gaming">Gaming</option>
          <option value="Cooking">Cooking</option>
          <option value="Fitness/Gym">Fitness/Gym</option>
          <option value="Tech_gadgets">Tech & Gadgets</option>
          <option value="Travelling">Travelling</option>
          <option value="Religious-activities">Religious Activities</option>
        </select>
        {errors.interests && (
          <p className="text-red-500 text-sm mt-1">{errors.interests}</p>
        )}

        {/* Selected interests as chips */}
        <div className="mt-3 flex flex-wrap gap-2">
          {formData.interests.map((interest, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-gray-700 text-sm  px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
            >
              {interest}
              <button
                type="button"
                onClick={() =>
                  handleInputChange(
                    "interests",
                    formData.interests.filter((i) => i !== interest)
                  )
                }
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Add Photo Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add your Photo
        </label>
        <p className="text-sm text-gray-500 mb-4">
          Upload a clear photo. Supported formats are *.jpg and *.png
        </p>

        <div className="flex gap-4 items-start">
          {/* Add Photo Button */}
          {formData.photos.length < 4 && (
            <label className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-200 transition-colors">
              <img src={PlusIcon} alt="Add photo" className="w-6 h-6" />
              <input
                type="file"
                accept="image/jpg,image/jpeg,image/png"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}

          {/* Photo Previews */}
          {formData.photos.map((photo) => (
            <div key={photo.id} className="relative w-16 h-16">
              <img
                src={photo.url}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removePhoto(photo.id)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {formData.photos.length === 4 && (
          <p className="text-sm text-green-600 mt-2">
            Maximum photos uploaded (4/4)
          </p>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className=" bg-purple-100 p-6">
        <EmailVerificationBanner />
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/my-posts">My posts</Link>
          <span>›</span>
          <span>Create a Post</span>
        </div>

        {/* Container */}
        <div className="w-full mx-auto py-4 bg-white rounded-2xl">
          <div className="max-w-2xl mx-auto p-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-meduim text-gray-900 mb-2">
                Find a Roommate
              </h1>
              <p className="text-gray-600">
                Share your details to find a compatible roommate and make
                housing easier.
              </p>
            </div>

            {/* Back Button (only show on step 2) */}
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
              >
                <img src={ChevronLeft} alt="Back" className="w-4 h-4" />
                Back
              </button>
            )}

            {/* Form Content */}
            <div className="bg-white">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
            </div>

            {/* API Error Display */}
            {createListingError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-sm">
                  {createListingError.response?.data?.message ||
                    "Failed to create listing. Please try again."}
                </p>
              </div>
            )}

            {uploadImagesError && (
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-md">
                <p className="text-orange-700 text-sm">
                  Listing created successfully, but image upload failed. You can
                  add images later.
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="mt-8">
              <button
                onClick={handleNext}
                disabled={
                  isSubmitting || isCreatingListing || isUploadingImages
                }
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                  isSubmitting || isCreatingListing || isUploadingImages
                    ? "bg-purple-300 text-white cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isSubmitting || isCreatingListing || isUploadingImages ? (
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
                    {isCreatingListing
                      ? "Creating listing..."
                      : isUploadingImages
                      ? "Uploading images..."
                      : "Processing..."}
                  </div>
                ) : currentStep === 2 ? (
                  "Post Item"
                ) : (
                  "Next"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateItemListing;
