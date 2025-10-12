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
    itemName: "",
    category: "",
    price: "",
    description: "",
    photos: [],

    // Step 2: Additional Details
    condition: "",
    colour: "",
    material: "",
    state: "",
    localGovernment: "",
  });

  const LGA = [
  "Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry",
  "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu",
  "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo",
  "Shomolu", "Surulere"
];

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
          Listing created but image upload failed. You can add images later.
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

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a valid positive number";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.condition) {
      newErrors.condition = "Condition is required";
    }

    if (!formData.colour) {
      newErrors.colour = "Colour is required";
    }

    if (!formData.material) {
      newErrors.material = "Material is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.localGovernment) {
      newErrors.localGovernment = "Local Government is required";
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
        itemName: formData.itemName,
        category: formData.category,
        price: formData.price,
        description: formData.description,
        condition: formData.condition,
        colour: formData.colour,
        material: formData.material,
        state: formData.state,
        localGovernment: formData.localGovernment,
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
      {/* Item Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item Name
        </label>
        <input
          type="text"
          placeholder="e.g., Reading Desk, HP Laptop"
          value={formData.itemName}
          onChange={(e) => handleInputChange("itemName", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.itemName
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        />
        {errors.itemName && (
          <p className="text-red-500 text-sm mt-1">{errors.itemName}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.category
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select item category</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="books">Books</option>
          <option value="appliances">Appliances</option>
          <option value="clothing">Clothing</option>
          <option value="sports">Sports & Recreation</option>
          <option value="beauty-personal-care">Beauty & Personal Care</option>
          <option value="other">Other</option>
        </select>
        {errors.category && (
          <p className="text-red-500 text-sm mt-1">{errors.category}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price (₦)
        </label>
        <input
          type="text"
          placeholder="e.g., 15,000"
          value={formData.price}
          onChange={(e) => handleInputChange("price", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.price
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Item Description
        </label>
        <textarea
          placeholder="Enter a description..."
          rows={4}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
            errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Add Photo Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Photo
        </label>
        <p className="text-sm text-gray-500 mb-4">
          You can upload up to 4 images. Clear pictures help you sell faster.
          Supported formats are *.jpg and *.png
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

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Condition
        </label>
        <select
          value={formData.condition}
          onChange={(e) => handleInputChange("condition", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.condition
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select item condition</option>
          <option value="new">New</option>
          <option value="like-new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
        {errors.condition && (
          <p className="text-red-500 text-sm mt-1">{errors.condition}</p>
        )}
      </div>

      {/* Color and Material Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Colour
          </label>
          <select
            value={formData.colour}
            onChange={(e) => handleInputChange("colour", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.colour
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          >
            <option value="">Select item colour</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="brown">Brown</option>
            <option value="grey">Grey</option>
            <option value="pink">Pink</option>
            <option value="purple">Purple</option>
            <option value="orange">Orange</option>
            <option value="other">Other - mention in description</option>
          </select>
          {errors.colour && (
            <p className="text-red-500 text-sm mt-1">{errors.colour}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material
          </label>
          <select
            value={formData.material}
            onChange={(e) => handleInputChange("material", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
              errors.material
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300"
            }`}
          >
            <option value="">Select item material</option>
            <option value="wood">Wood</option>
            <option value="metal">Metal</option>
            <option value="plastic">Plastic</option>
            <option value="glass">Glass</option>
            <option value="fabric">Fabric</option>
            <option value="ceramic">Ceramic</option>
            <option value="leather">Leather</option>
            <option value="stone">Foam</option>
            <option value="other">Other - mention in description</option>
          </select>
          {errors.material && (
            <p className="text-red-500 text-sm mt-1">{errors.material}</p>
          )}
        </div>
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          State
        </label>
        <select
          value={formData.state}
          onChange={(e) => handleInputChange("state", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.state
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select state</option>
          <option value="lagos">Lagos</option>
        </select>
        {errors.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
        )}
      </div>

      {/* Local Government */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Local Government
        </label>
        <select
          value={formData.localGovernment}
          onChange={(e) => handleInputChange("localGovernment", e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
            errors.localGovernment
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="">Select LGA</option> 
          {LGA.map((lga) => (
            <option key={lga} value={lga}>
              {lga}
            </option>
          ))}
          <option value="gbagada">Gbagada</option>
          <option value="other">Other</option>
        </select>
        {errors.localGovernment && (
          <p className="text-red-500 text-sm mt-1">{errors.localGovernment}</p>
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
                Post an Item for Sale
              </h1>
              <p className="text-gray-600">
                Fill in the details below to list your item and connect with
                buyers easily
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
