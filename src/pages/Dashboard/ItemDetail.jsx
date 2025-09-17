import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductCard from "@/components/ui/ProductCard";
import products from "@/sample data/products";
import Avatar from "@/assets/images/AdminLoginImg.jpg";
import locationIcon from "@/assets/icons/Location-icon.svg";
import Verified from "@/assets/icons/check-verified.svg";
import MessageChat from "@/assets/icons/message-chat-square.svg";
import UserPlus from "@/assets/icons/user-plus.svg";
import { PhoneIcon } from "lucide-react";
import { MessageSquareTextIcon } from "lucide-react";
import { Flag } from "lucide-react";

// Mock API services
const fetchItemDetails = async (itemId) => {
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
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616c95a4ce9?w=100",
      responseTime: "Usually replies within 1 hour",
      joinDate: "Joined studEx 3yrs ago",
      isVerified: true,
    },
  };
};

const fetchSimilarItems = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  // Make sure we return products with all necessary fields including id
  const similarItems = products.slice(0, 3).map((product) => ({
    ...product,
    id: product.id, // Ensure id is explicitly included
  }));
  console.log("Similar items with IDs:", similarItems); // Debug log
  return similarItems;
};

const ItemDetail = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const navigate = useNavigate();
  const { itemId } = useParams();

  // Fetch item details
  const {
    data: item,
    isLoading: itemLoading,
    error: itemError,
  } = useQuery({
    queryKey: ["itemDetail", itemId],
    queryFn: () => fetchItemDetails(itemId),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch similar items
  const { data: similarItems = [] } = useQuery({
    queryKey: ["similarItems", itemId],
    queryFn: fetchSimilarItems,
    staleTime: 1000 * 60 * 5,
  });

  const handleImageSelect = (index) => {
    setSelectedImageIndex(index);
  };

  const handleContact = () => {
    console.log("Open contact modal or redirect to contact");
  };

  const handleChatNow = () => {
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
                <img
                  src={item?.images?.[selectedImageIndex] || item?.images?.[0]}
                  alt={item?.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 w-full justify-between">
                {item?.images?.map((image, index) => (
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
                <li>
                  • Condition: {item?.condition?.status}
                </li>
                <li>
                  • Size: {item?.condition?.size}
                </li>
                <li>
                  • Color: {item?.condition?.color}
                </li>
                <li>
                  • Material: {item?.condition?.material}
                </li>
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
                  src={Avatar}
                  // src={item?.seller?.avatar}
                  alt={item?.seller?.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-900">
                      {item?.seller?.name}
                    </h4>
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
                      alt="Response Time"
                      className="w-4 h-4 mr-2"
                    />
                    {item?.seller?.joinDate}
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
                  <span>Contact</span>
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
                    <strong className="font-semibold">Meet in public,</strong> preferably on campus,
                    cafés, or busy spots near campus.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong className="font-semibold">Inspect item before paying.</strong> Check that the
                    item matches the description and is in good condition.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong className="font-semibold">Use in-app chat first.</strong> Keep initial
                    conversations within StudEx to verify credibility.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong className="font-semibold">Trust Your Instincts.</strong> If a deal feels
                    suspicious or too good to be true, walk away.
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="w-2 h-2 bg-purple-800 rounded-full mt-2 flex-shrink-0"></span>
                  <span>
                    <strong className="font-semibold">Report Suspicious Activity.</strong> Use the
                    "Report" button to flag suspicious listings or behavior.
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
    </DashboardLayout>
  );
};

export default ItemDetail;
