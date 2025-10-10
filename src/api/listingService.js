import apiClient from "./apiClient";

export const listingService = {
  // Create a new listing
  createListing: async (listingData) => {
    const response = await apiClient.post(
      "/api/listings",
      {
        item_name: listingData.itemName,
        category: listingData.category,
        price: parseFloat(listingData.price),
        description: listingData.description,
        condition: listingData.condition,
        colour: listingData.colour,
        material: listingData.material,
        state: listingData.state,
        local_government: listingData.localGovernment,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  },

  // Upload images for a listing
  uploadListingImages: async (listingId, files) => {
    const formData = new FormData();

    // Add all files to the FormData
    files.forEach((file) => {
      formData.append("files", file.file || file);
    });

    const response = await apiClient.post(
      `/api/listings/${listingId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Get user's listings
  getUserListings: async () => {
    const response = await apiClient.get("/api/listings/my");
    return response.data;
  },

  // Get a single listing by ID
  getListingById: async (listingId) => {
    const response = await apiClient.get(`/api/listings/${listingId}`);
    return response.data;
  },

  // Update a listing
  updateListing: async (listingId, listingData) => {
    const response = await apiClient.patch(`/api/listings/${listingId}`, {
      item_name: listingData.item_name,
      category: listingData.category,
      price: parseFloat(listingData.price),
      description: listingData.description,
      condition: listingData.condition,
      colour: listingData.colour,
      material: listingData.material,
      state: listingData.state,
      local_government: listingData.local_government,
    });
    return response.data;
  },

  // Delete a listing
  deleteListing: async (listingId) => {
    const response = await apiClient.delete(`/api/listings/${listingId}`);
    return response.data;
  },

  // Mark listing as sold
  markAsSold: async (listingId) => {
    const response = await apiClient.patch(
      `/api/listings/${listingId}/mark-sold`
    );
    return response.data;
  },

  // Get all listings (for browsing)
  getAllListings: async (params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.category) queryParams.append("category", params.category);
    if (params.state) queryParams.append("state", params.state);
    if (params.minPrice !== undefined && params.minPrice !== null) {
      queryParams.append("min_price", params.minPrice);
    }
    if (params.maxPrice !== undefined && params.maxPrice !== null) {
      queryParams.append("max_price", params.maxPrice);
    }
    if (params.condition) queryParams.append("condition", params.condition);
    if (params.search) queryParams.append("search", params.search);

    const url = queryParams.toString()
      ? `/api/listings?${queryParams.toString()}`
      : "/api/listings";
    console.log("API Request URL:", url);
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get campus listings
  getCampusListings: async (campusId, params = {}) => {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.search) queryParams.append("search", params.search);
    if (params.status) queryParams.append("status", params.status);
    if (params.category) queryParams.append("category", params.category);
    if (params.type) queryParams.append("type", params.type);

    const url = queryParams.toString()
      ? `/api/listings/campus/${campusId}?${queryParams.toString()}`
      : `/api/listings/campus/${campusId}`;
    const response = await apiClient.get(url);
    return response.data;
  },

  // Approve or reject listing
  reviewListing: async (listingId, status, review_note = "") => {
    const response = await apiClient.post(
      `/api/listings/${listingId}/approve`,
      {
        action: status === "approved" ? "approve" : "reject",
        reason: review_note || "",
      }
    );
    return response.data;
  },

  // Bulk review listings
  bulkReviewListings: async (listingIds, status, review_note = "") => {
    const response = await apiClient.post("/api/listings/bulk-approve", {
      listing_ids: listingIds,
      action: status === "approved" ? "approve" : "reject",
      reason: review_note || "",
    });
    return response.data;
  },
};
