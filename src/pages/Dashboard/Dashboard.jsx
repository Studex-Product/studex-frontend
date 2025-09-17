import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ui/ProductCard";
import products from "@/sample data/products";
import DashBannerImg from "@/assets/images/DashBannerImg.png";
import ChevronRightPurple from "@/assets/icons/chevron-right-purple.svg";

// Mock API services
const fetchRecentItems = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // For now, return sample data - replace with actual API call
  return products.slice(0, 6);
};

const fetchRoommateMatches = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Mock roommate data - replace with actual API call
  return [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
      title: "2-Bedroom Apartment, Furnished",
      description: "Yaba, Lagos State",
      price: "₦250,000 / year",
      location: "Yaba, Lagos State",
      category: "Apartment",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400",
      title: "2-Bedroom Apartment, Furnished",
      description: "Yaba, Lagos State",
      price: "₦250,000 / year",
      location: "Yaba, Lagos State",
      category: "Apartment",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400",
      title: "2-Bedroom Apartment, Furnished",
      description: "Yaba, Lagos State",
      price: "₦250,000 / year",
      location: "Yaba, Lagos State",
      category: "Apartment",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
      title: "2-Bedroom Apartment, Furnished",
      description: "Yaba, Lagos State",
      price: "₦250,000 / year",
      location: "Yaba, Lagos State",
      category: "Apartment",
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400",
        title: "2-Bedroom Apartment, Furnished",
        description: "Yaba, Lagos State",
        price: "₦250,000 / year",
        location: "Yaba, Lagos State",
        category: "Apartment",
      },
      {
        id: 6,
        image:
        "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400",
      title: "2-Bedroom Apartment, Furnished",
      description: "Yaba, Lagos State",
      price: "₦250,000 / year",
      location: "Yaba, Lagos State",
      category: "Apartment",
    },
  ];
};

const Dashboard = () => {

  const navigate = useNavigate();

  // Fetch recent items
  const {
    data: recentItems = [],
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["recentItems"],
    queryFn: fetchRecentItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch roommate matches
  const {
    data: roommateMatches = [],
    isLoading: roommatesLoading,
    error: roommatesError,
  } = useQuery({
    queryKey: ["roommateMatches"],
    queryFn: fetchRoommateMatches,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleViewAll = (section) => {
    console.log(`Navigate to ${section} page`);
    navigate(`/${section}`);
  };

  return (
    <DashboardLayout>
      <div className="px-6">
        {/* Hero Banner */}
        <div className="bg-[url('@/assets/images/DashBannerBg.png')] bg-cover bg-no-repeat rounded-2xl p-8 mb-8 relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="text-white max-w-lg">
              <p className="text-sm font-medium text-purple-100 mb-2">
                BEST CHOICE FOR STUDENTS
              </p>
              <h1 className="text-3xl font-semibold mb-4">
                ONE PLATFORM, EVERY NEED
              </h1>
              <p className="text-purple-100 mb-6 leading-relaxed">
                Buy, sell, and find roommates around you in one place, built to
                make campus life easier, and affordable.
              </p>
              <button
                onClick={() => handleViewAll("items")}
                className="bg-white text-purple-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
              >
                View Listing
              </button>
            </div>

            {/* Hero Image */}
            <div className="hidden md:block">
              <img
                src={DashBannerImg}
                alt="Students studying together"
                className="w-80 h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full opacity-10 transform translate-x-32 -translate-y-32"></div>
        </div>

        {/* Recently Listed Items Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Recently listed items
            </h2>
            <button
              onClick={() => handleViewAll("items")}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-3 cursor-pointer"
            >
              View all
              <img src={ChevronRightPurple} alt="icon" />
            </button>
          </div>

          {/* Items Grid */}
          {itemsLoading ? (
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
          ) : itemsError ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Error loading items. Please try again later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentItems.map((item) => (
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
          )}
        </section>

        {/* Roommate & Apartment Matches Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Roommate & Apartment Matches
            </h2>
            <button
              onClick={() => handleViewAll("roommates")}
              className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-3 cursor-pointer"
            >
              View all
              <img src={ChevronRightPurple} alt="icon" />
            </button>
          </div>

          {/* Roommate Grid */}
          {roommatesLoading ? (
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
          ) : roommatesError ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                Error loading roommate matches. Please try again later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roommateMatches.map((match) => (
                <ProductCard
                  key={match.id}
                  image={match.image}
                  title={match.title}
                  description={match.description}
                  price={match.price}
                  location={match.location}
                  category={match.category}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
