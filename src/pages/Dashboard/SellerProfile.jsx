import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductCard from "@/components/ui/ProductCard";
import products from "@/sample data/products";
import Avatar from "@/assets/images/AdminLoginImg.jpg";
import Verified from "@/assets/icons/check-verified.svg";
import UserPlus from "@/assets/icons/user-plus.svg";
import Star from "@/assets/icons/star-outline.svg";
import locationMarker from "@/assets/icons/location-marker.svg";
import Package from "@/assets/icons/package-icon.svg";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Mock API services (assuming these are correct and unchanged)
const fetchSellerProfile = async (sellerId) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return {
    id: sellerId,
    name: "Fatima Yusuf",
    avatar: Avatar,
    isVerified: true,
    joinDate: "Jan 2025",
    starRating: 4.5,
    totalListings: 56,
    location: "Uniben",
    about:
      "I'm Fatima a verified student seller. I use StudEx to give my unused items a second life and help fellow students find affordable deals. Everything listed is fairly priced and well-maintained. Available for safe meet-ups on campus or nearby locations.",
  };
};

const fetchSellerItems = async (sellerId, page = 1) => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const itemsPerPage = 6;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sellerProducts = [...products, ...products];
  const paginatedItems = sellerProducts.slice(startIndex, endIndex);
  return {
    items: paginatedItems,
    totalItems: sellerProducts.length,
    totalPages: Math.ceil(sellerProducts.length / itemsPerPage),
    currentPage: page,
  };
};

const SellerProfile = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { sellerId } = useParams();

  const {
    data: seller,
    isLoading: sellerLoading,
    error: sellerError,
  } = useQuery({
    queryKey: ["sellerProfile", sellerId],
    queryFn: () => fetchSellerProfile(sellerId),
  });

  const {
    data: sellerItemsData,
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["sellerItems", sellerId, currentPage],
    queryFn: () => fetchSellerItems(sellerId, currentPage),
  });

  const sellerItems = sellerItemsData?.items || [];
  const totalPages = sellerItemsData?.totalPages || 1;

  const handlePageChange = (page) => setCurrentPage(page);
  const handleBreadcrumbNavigation = (path) => navigate(path);

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) pages.push(i);
    return pages;
  };

  if (sellerLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-purple-50 min-h-screen">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gray-200 rounded-lg p-6 h-48"></div>
              <div className="bg-gray-200 rounded-lg p-6 h-48"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (sellerError) {
    return (
      <DashboardLayout>
        <div className="px-6 py-12 text-center">
          <p className="text-gray-500">Error loading seller profile.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-purple-50 min-h-screen">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <button
            onClick={() => handleBreadcrumbNavigation("/items")}
            className="hover:text-green-600 cursor-pointer"
          >
            Item Listing
          </button>
          <span>›</span>
          <button
            onClick={() => handleBreadcrumbNavigation("/items/2")}
            className="hover:text-green-600 cursor-pointer"
          >
            Hostel Mattress (3ft)
          </button>
          <span>›</span>
          <span className="text-gray-900 font-medium">{seller?.name}</span>
        </nav>

        {/* Seller Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-4">
              <img
                src={seller?.avatar}
                alt={seller?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {seller?.name}
                </h1>
                {seller?.isVerified && (
                  <div className="flex items-center gap-1 w-fit bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-md mt-1">
                    <img src={Verified} alt="Verified" className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 text-sm">
              <div className="flex flex-col items-start px-2">
                <div>
                  <p className="text-gray-500">Joined</p>
                  <p className="flex gap-2 font-medium text-gray-900 mt-1">
                    <img src={UserPlus} alt="icon" className="w-4 h-4" />
                    <span>{seller?.joinDate}</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center px-2">
                <div>
                  <p className="text-gray-500">Star rating</p>
                  <p className="flex gap-2 font-medium text-gray-900 mt-1">
                    <img src={Star} alt="icon" className="w-4 h-4" />
                    {seller?.starRating}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center px-2">
                <div>
                  <p className="text-gray-500">Total listing</p>
                  <p className="flex gap-2 font-medium text-gray-900 mt-1">
                    <img src={Package} alt="icon" className="w-4 h-4" />
                    {seller?.totalListings}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end px-2">
                <div>
                  <p className="text-gray-500">Location</p>
                  <p className="flex gap-2 font-medium text-gray-900 mt-1">
                    <img src={locationMarker} alt="icon" className="w-4 h-4" />
                    {seller?.location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: About Seller */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">About Seller</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {seller?.about}
            </p>
          </div>
        </div>

        {/* Listed Items Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-medium text-gray-900 mb-6">
            Listed Items
          </h2>
          {itemsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                >
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-5 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}
          {itemsError && (
            <div className="text-center py-12">
              <p className="text-gray-500">Error loading seller items.</p>
            </div>
          )}
          {!itemsLoading && !itemsError && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {sellerItems.map((item) => (
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
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
                        currentPage === page
                          ? "bg-green-600 text-white"
                          : "text-gray-700 hover:bg-green-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SellerProfile;
