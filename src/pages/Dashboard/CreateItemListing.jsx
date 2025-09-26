import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ChevronLeft from "@/assets/icons/chevron-left.svg";
import PlusIcon from "@/assets/icons/plus-icon.svg";

const CreateItemListing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    itemName: "",
    category: "",
    price: "",
    description: "",

    // Step 2: Photos
    photos: [],

    // Step 3: Additional Details
    condition: "",
    colour: "",
    material: "",
    state: "",
    localGovernment: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate("/my-posts");
    }
  };

  const handleSubmit = () => {
    console.log("Submitting item:", formData);
    // TODO: Implement API call to create item
    navigate("/my-posts");
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

    const newPhotos = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random()
    }));

    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
  };

  const removePhoto = (photoId) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(photo => photo.id !== photoId)
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleInputChange("category", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select item category</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="books">Books</option>
          <option value="appliances">Appliances</option>
          <option value="clothing">Clothing</option>
          <option value="sports">Sports & Recreation</option>
          <option value="other">Other</option>
        </select>
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Add Photo Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Photo
        </label>
        <p className="text-sm text-gray-500 mb-4">
          You can upload up to 4 images. Clear pictures help you sell faster. Supported formats are *.jpg and *.png
        </p>

        <div className="flex gap-4 items-start">
          {/* Add Photo Button */}
          {formData.photos.length < 4 && (
            <label className="w-20 h-20 bg-purple-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-purple-200 transition-colors">
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
            <div key={photo.id} className="relative w-20 h-20">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select item condition</option>
          <option value="new">New</option>
          <option value="like-new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select item condition</option>
            <option value="black">Black</option>
            <option value="white">White</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="blue">Blue</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Material
          </label>
          <select
            value={formData.material}
            onChange={(e) => handleInputChange("material", e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Select item condition</option>
            <option value="wood">Wood</option>
            <option value="metal">Metal</option>
            <option value="plastic">Plastic</option>
            <option value="glass">Glass</option>
            <option value="fabric">Fabric</option>
            <option value="leather">Leather</option>
            <option value="other">Other</option>
          </select>
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select location</option>
          <option value="lagos">Lagos</option>
          <option value="abuja">Abuja</option>
          <option value="rivers">Rivers</option>
          <option value="kano">Kano</option>
          <option value="oyo">Oyo</option>
          <option value="kaduna">Kaduna</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Local Government */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Local Government
        </label>
        <select
          value={formData.localGovernment}
          onChange={(e) => handleInputChange("localGovernment", e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="">Select location</option>
          <option value="ikeja">Ikeja</option>
          <option value="lekki">Lekki</option>
          <option value="victoria-island">Victoria Island</option>
          <option value="surulere">Surulere</option>
          <option value="yaba">Yaba</option>
          <option value="gbagada">Gbagada</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span>My posts</span>
          <span>›</span>
          <span>Create a Post</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Post an Item for Sale
          </h1>
          <p className="text-gray-600">
            Fill in the details below to list your item and connect with buyers easily
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

        {/* Action Button */}
        <div className="mt-8">
          <button
            onClick={handleNext}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200"
          >
            {currentStep === 2 ? "Post Item" : "Next"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateItemListing;