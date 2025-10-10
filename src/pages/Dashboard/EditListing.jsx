import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listingService } from "@/api/listingService";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { ArrowLeft, Save } from "lucide-react";

const CATEGORIES = [
  "electronics",
  "books-stationery",
  "clothing",
  "furniture",
  "sports-fitness",
  "home-kitchen",
  "beauty-personal-care",
  "others"
];

const CONDITIONS = [
  "brand-new",
  "like-new",
  "good",
  "fair",
  "poor"
];

const COLORS = [
  "black", "white", "gray", "silver", "red", "blue", "green", "yellow",
  "orange", "purple", "pink", "brown", "gold", "multi-color", "other"
];

const MATERIALS = [
  "plastic", "metal", "wood", "glass", "fabric", "leather", "paper",
  "ceramic", "rubber", "silicon", "cotton", "polyester", "other"
];

const STATES = ["lagos"];

const LGA = [
  "agege", "ajeromi-ifelodun", "alimosho", "amuwo-odofin", "apapa", "badagry",
  "epe", "eti-osa", "ibeju-lekki", "ifako-ijaiye", "ikeja", "ikorodu",
  "kosofe", "lagos-island", "lagos-mainland", "mushin", "ojo", "oshodi-isolo",
  "shomolu", "surulere", "yaba"
];

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
    price: "",
    description: "",
    condition: "",
    colour: "",
    material: "",
    state: "",
    local_government: "",
  });

  // Fetch listing data
  const {
    data: listing,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingService.getListingById(id),
    enabled: !!id,
  });

  // Pre-fill form when listing data is loaded
  useEffect(() => {
    if (listing) {
      console.log("Listing data for editing:", listing); // Debug log
      setFormData({
        item_name: listing.item_name || "",
        category: listing.category || "",
        price: listing.price?.toString() || "", // Convert to string for input
        description: listing.description || "",
        condition: listing.condition || "",
        colour: listing.colour || listing.color || "",
        material: listing.material || "",
        state: listing.state || "",
        local_government: listing.local_government || listing.lga || "",
      });
    }
  }, [listing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update listing mutation
  const updateListingMutation = useMutation({
    mutationFn: (data) => listingService.updateListing(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing", id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Listing updated successfully!
        </div>
      ));

      navigate(`/dashboard/my-posts/${id}`);
    },
    onError: (error) => {
      console.error("Error updating listing:", error);

      const errorMessage = error.response?.data?.message || "Failed to update listing. Please try again.";

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {errorMessage}
        </div>
      ));
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    // Basic validation
    if (!formData.item_name.trim() || !formData.category || !formData.price) {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          Please fill in all required fields (Item Name, Category, Price)
        </div>
      ));
      return;
    }

    setIsSubmitting(true);

    try {
      updateListingMutation.mutate(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-gray-50/50 min-h-full">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="mt-2 text-gray-600">Loading listing...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-gray-50/50 min-h-full">
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-red-700">
                    Error Loading Listing
                  </h3>
                  <p className="text-red-600">
                    Unable to load listing data. Please try again later.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50/50 min-h-full">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/dashboard/my-posts/${id}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Listing</h1>
                <p className="text-gray-600">Update your listing details</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Item Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="item_name"
                    value={formData.item_name}
                    onChange={handleInputChange}
                    placeholder="Enter item name"
                    disabled={isSubmitting}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="Enter price"
                    disabled={isSubmitting}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                    required
                    min="0"
                  />
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                  >
                    <option value="">Select condition</option>
                    {CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <select
                    name="colour"
                    value={formData.colour}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                  >
                    <option value="">Select color</option>
                    {COLORS.map((color) => (
                      <option key={color} value={color}>
                        {color}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                  >
                    <option value="">Select material</option>
                    {MATERIALS.map((material) => (
                      <option key={material} value={material}>
                        {material}
                      </option>
                    ))}
                  </select>
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                  >
                    <option value="">Select state</option>
                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Local Government */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Local Government Area
                  </label>
                  <select
                    name="local_government"
                    value={formData.local_government}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                  >
                    <option value="">Select LGA</option>
                    {LGA.map((lga) => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your item..."
                    disabled={isSubmitting}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/my-posts/${id}`)}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                    isSubmitting
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  <Save size={16} />
                  {isSubmitting ? "Updating..." : "Update Listing"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EditListing;