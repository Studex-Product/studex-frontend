import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductCard from "@/components/ui/ProductCard";
import ImageLightbox from "@/components/ui/ImageLightbox";
import products from "@/sample-data/products";
import { listingService } from "@/api/listingService";
import Avatar from "@/assets/images/AdminLoginImg.jpg";
import locationIcon from "@/assets/icons/Location-icon.svg";
import Verified from "@/assets/icons/check-verified.svg";
import MessageChat from "@/assets/icons/message-chat-square.svg";
import UserPlus from "@/assets/icons/user-plus.svg";
import { PhoneIcon } from "lucide-react";
import { MessageSquareTextIcon } from "lucide-react";
import { Flag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// Mock API service (fallback)
const fetchItemDetailsMock = async (itemId) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Find the actual item from your products data using the itemId
  const foundItem = products.find(
    (product) => product.id.toString() === itemId.toString()
  );

  if (!foundItem) {
    throw new Error("Item not found");
  }

  // Return the actual item with enhanced details
  return {
    ...foundItem, // This spreads all the real item properties (title, price, description, etc.)
    images: [
      foundItem.image,
      foundItem.image,
      foundItem.image,
      foundItem.image,
    ],
    condition: {
      status: foundItem.category === "New" ? "Brand New" : "Gently Used",
      size: "Standard size",
      color: "As shown in image",
      material: "High quality materials",
    },
    seller: {
      name: "Fatima Yusuf",
      number: "09123456789",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616c95a4ce9?w=100",
      responseTime: "Usually replies within 1 hour",
      joinDate: "Joined studEx 3yrs ago",
      isVerified: true,
    },
  };
};

// Real API service - fetches listing details from backend
const fetchItemDetails = async (itemId) => {
  try {
    const response = await listingService.getListingById(itemId);
    const listing = response.data || response;

    // Transform API response to match component expectations
    return {
      id: listing.id,
      title: listing.item_name,
      description: listing.description,
      price: new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(listing.price),
      location:
        listing.state && listing.local_government
          ? `${listing.local_government}, ${listing.state}`
          : listing.state || "Location not specified",
      category: listing.condition || listing.category || "Used",
      images:
        listing.image_urls && listing.image_urls.length > 0
          ? listing.image_urls
          : [listing.image_urls?.[0] || null],
      condition: {
        status: listing.condition || "Used",
        size: listing.size || "Standard size",
        color: listing.colour || "As shown in image",
        material: listing.material || "N/A",
      },
      seller: {
        id: listing.user_id,
        name:
          `${listing.seller_first_name || ""} ${
            listing.seller_last_name || ""
          }`.trim() || "Unknown Seller",
        number: listing.seller_phone || "Not provided",
        email: listing.seller_email,
        avatar: listing.seller_avatar_url || Avatar,
        responseTime: "Usually replies within 1 hour",
        joinDate: listing.seller_created_at
          ? new Date(listing.seller_created_at).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Recently",
        isVerified: listing.seller_is_verified || false,
        starRating: listing.seller_rating || 0,
        location:
          listing.state && listing.local_government
            ? `${listing.local_government}, ${listing.state}`
            : listing.state || "Location not specified",
        about:
          "This is a verified student seller on StudEx. Connect with them to explore their listings and make safe transactions on campus.",
      },
      // Keep original data
      rawData: listing,
    };
  } catch (error) {
    console.error(
      "Error fetching item details from API, falling back to mock data:",
      error
    );
    return fetchItemDetailsMock(itemId);
  }
};

// Mock similar items (fallback)
const fetchSimilarItemsMock = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  // Make sure we return products with all necessary fields including id
  const similarItems = products.slice(0, 3).map((product) => ({
    ...product,
    id: product.id, // Ensure id is explicitly included
  }));
  return similarItems;
};

// Real API service - fetches similar items
const fetchSimilarItems = async (itemId, category) => {
  try {
    // Fetch similar items based on category
    const params = {};
    if (category) {
      params.category = category;
    }

    const response = await listingService.getAllListings(params);
    let items = response.data || response || [];

    // Filter to only show approved items and exclude current item
    items = items.filter(
      (item) =>
        item.status === "approved" && item.id.toString() !== itemId.toString()
    );

    // Take only first 3 items
    items = items.slice(0, 3);

    // Transform to match ProductCard expectations
    return items.map((item) => ({
      id: item.id,
      image:
        item.image_urls && item.image_urls.length > 0
          ? item.image_urls[0]
          : null,
      title: item.item_name,
      description: item.description,
      price: new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(item.price),
      location:
        item.state && item.local_government
          ? `${item.local_government}, ${item.state}`
          : item.state || "Location not specified",
      category: item.condition || item.category || "Used",
    }));
  } catch (error) {
    console.error(
      "Error fetching similar items from API, falling back to mock data:",
      error
    );
    return fetchSimilarItemsMock();
  }
};

const ItemDetail = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { user } = useAuth();

  // Fetch item details
  const {
    data: item,
    isLoading: itemLoading,
    error: itemError,
  } = useQuery({
    queryKey: ["itemDetail", itemId],
    queryFn: () => fetchItemDetails(itemId),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  // Fetch similar items based on current item's category
  const { data: similarItems = [] } = useQuery({
    queryKey: ["similarItems", itemId, item?.rawData?.category],
    queryFn: () => fetchSimilarItems(itemId, item?.rawData?.category),
    staleTime: 1000 * 60 * 5,
    enabled: !!item, // Only fetch when item is loaded
    retry: 1,
  });

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleOpenLightbox = () => {
    setIsLightboxOpen(true);
  };

  const handleCloseLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleNavigateLightbox = (direction) => {
    const validImages = item?.images?.filter((img) => img) || [];
    if (validImages.length === 0) return;

    if (direction === "prev") {
      setSelectedImageIndex((prev) =>
        prev === 0 ? validImages.length - 1 : prev - 1
      );
    } else if (direction === "next") {
      setSelectedImageIndex((prev) =>
        prev === validImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleContact = () => {
    if (!user?.is_profile_complete) {
      toast.error(
        "Please complete your profile setup before contacting sellers."
      );
      navigate("/profile-setup");
      return;
    }
    window.location.href = `tel:${item?.seller?.number}`;
  };

  const handleSellerProfile = () => {
    console.log("Open seller profile");
    navigate(`/seller/${item?.seller?.id || item?.rawData?.user_id}`, {
      state: {
        fromItem: {
          id: item.id,
          title: item.title,
        },
        sellerData: item?.seller, // Pass complete seller data
      },
    });
  };

  const handleChatNow = () => {
    if (!user?.is_profile_complete) {
      toast.error(
        "Please complete your profile setup before chatting with sellers."
      );
      navigate("/profile-setup");
      return;
    }
    console.log("Open chat with seller");
  };

  const handleReportUser = () => {
    console.log("Open report user modal");
  };

  const handleBreadcrumbNavigation = (path) => {
    console.log(`Navigate to: ${path}`);
    navigate(path);
  };

  if (itemLoading) {
    return (
      <DashboardLayout>
        <div className="px-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-200 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-60 h-24 bg-gray-200 rounded"
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (itemError) {
    return (
      <DashboardLayout>
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">
            Error loading item details. Please try again later.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-purple-50">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8 pt-3">
          <button
            onClick={() => handleBreadcrumbNavigation("/dashboard")}
            className="hover:text-green-600 cursor-pointer transition duration-300"
          >
            Home
          </button>
          <span>›</span>
          <button
            onClick={() => handleBreadcrumbNavigation("/items")}
            className="hover:text-green-600 cursor-pointer transition duration-300"
          >
            Item Listing
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">{item?.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Section - Images and Item Details */}
          <div className="lg:col-span-3">
            {/* Image Gallery */}
            <div className="mb-8">
              {/* Main Image */}
              <div className="mb-4">
                {item?.images?.[selectedImageIndex] || item?.images?.[0] ? (
                  <div
                    className="relative group cursor-pointer overflow-hidden rounded-lg"
                    onClick={handleOpenLightbox}
                  >
                    <img
                      src={
                        item?.images?.[selectedImageIndex] || item?.images?.[0]
                      }
                      alt={item?.title}
                      className="w-full h-96 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg pointer-events-none"></div>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-2 py- rounded-lg">
                        Click to expand
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-lg">
                      No image available
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 w-full justify-between">
                {item?.images
                  ?.filter((img) => img)
                  .map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      className={`w-60 h-24 rounded-md overflow-hidden border-2 transition-colors cursor-pointer duration-300 ${
                        selectedImageIndex === index
                          ? "border-purple-400"
                          : "border-gray-200 hover:border-gray-300 opacity-75 hover:opacity-100 transition-opacity duration-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${item?.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* Item Condition */}
            <div className="bg-white rounded-lg p-6 mb-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Item Condition
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Condition: {item?.condition?.status}</li>
                <li>• Size: {item?.condition?.size}</li>
                <li>• Color: {item?.condition?.color}</li>
                <li>• Material: {item?.condition?.material}</li>
              </ul>

              <button
                onClick={handleReportUser}
                className="mt-6 flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              >
                <Flag className="w-4 h-4" />
                <span className="font-semibold">Report User</span>
              </button>
            </div>
          </div>

          {/* Right Section - Item Info and Seller */}
          <div className="space-y-5 lg:col-span-2">
            {/* Item Details */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h1 className="text-xl font-medium text-gray-900 mb-4">
                {item?.title}
              </h1>
              <p className="text-[#6B6B6B] mb-4 text-sm leading-relaxed">
                {item?.description}
              </p>

              <div className="text-2xl font-semibold text-gray-900 mb-4">
                {item?.price}
              </div>

              <div className="flex items-center text-[#6B6B6B]">
                <img
                  src={locationIcon}
                  alt="location"
                  className="w-4 h-4 mr-1"
                />
                <span>{item.location}</span>
              </div>
            </div>

            {/* Seller Profile */}
            <div className="pt-6 bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={item?.seller?.avatar || Avatar}
                  alt={item?.seller?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSellerProfile}
                      className="font-medium text-gray-900 cursor-pointer hover:text-green-600 transition duration-300"
                    >
                      {item?.seller?.name}
                    </button>
                    {item?.seller?.isVerified && (
                      <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                        <img
                          src={Verified}
                          alt="Verified"
                          className="w-4 h-4 text-white"
                        />
                      </span>
                    )}
                  </div>
                  <p className="flex items-center text-xs font-light text-gray-600">
                    <img
                      src={MessageChat}
                      alt="Response Time"
                      className="w-4 h-4 mr-2"
                    />
                    {item?.seller?.responseTime}
                  </p>
                  <p className="flex items-center text-xs font-light text-gray-600">
                    <img
                      src={UserPlus}
                      alt="Join Date"
                      className="w-4 h-4 mr-2"
                    />
                    Joined StudEx {item?.seller?.joinDate}
                  </p>
                </div>
              </div>

              {/* Contact Buttons */}
              <div className=" flex justify-center items-center gap-3 ">
                <button
                  onClick={handleContact}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <PhoneIcon className="w-4 h-4" />
                  <span>Call Now</span>
                </button>

                <button
                  onClick={handleChatNow}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-purple-100 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors cursor-pointer"
                >
                  <MessageSquareTextIcon className="w-4 h-4" />
                  <span>Chat Now</span>
                </button>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Safety Tips
              </h3>
              <ul className="space-y-4 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong className="font-semibold">Meet in public,</strong>{" "}
                    preferably on campus, cafés, or busy spots near campus.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong className="font-semibold">
                      Inspect item before paying.
                    </strong>{" "}
                    Check that the item matches the description and is in good
                    condition.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong className="font-semibold">
                      Use in-app chat first.
                    </strong>{" "}
                    Keep initial conversations within StudEx to verify
                    credibility.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong className="font-semibold">
                      Trust Your Instincts.
                    </strong>{" "}
                    If a deal feels suspicious or too good to be true, walk
                    away.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong className="font-semibold">
                      Report Suspicious Activity.
                    </strong>{" "}
                    Use the "Report" button to flag suspicious listings or
                    behavior.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Listings */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Similar Listing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarItems.map((item) => (
              <ProductCard
                key={item.id}
                id={item.id}
                image={item.image}
                title={item.title}
                description={item.description}
                price={item.price}
                location={item.location}
                category={item.category}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {isLightboxOpen && (
        <ImageLightbox
          images={item?.images}
          currentIndex={selectedImageIndex}
          onClose={handleCloseLightbox}
          onNavigate={handleNavigateLightbox}
        />
      )}
    </DashboardLayout>
  );
};

export default ItemDetail;
