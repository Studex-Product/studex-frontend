import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ui/ProductCard";
import products from "@/sample-data/products";
import { listingService } from "@/api/listingService";
import DashBannerImg from "@/assets/images/DashBannerImg.png";
import ProfileCompletionBanner from "../profile/ProfileCompletionBanner";
import EmailVerificationBanner from "../profile/EmailVerificationBanner";
import ChevronRightPurple from "@/assets/icons/chevron-right-purple.svg";

// Mock API service (fallback)
const fetchRecentItemsMock = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Return sample data
  return products.slice(0, 6);
};

// Real API service - fetches recent items
const fetchRecentItems = async () => {
  try {
    const response = await listingService.getAllListings({});
    let items = response.data || response || [];

    // Filter to only show approved items
    items = items.filter((item) => item.status === "approved");

    // Sort by creation date (newest first)
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Take only first 6 items
    items = items.slice(0, 6);

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
      "Error fetching recent items from API, falling back to mock data:",
      error
    );
    return fetchRecentItemsMock();
  }
};

// Mock roommate data (fallback)
const fetchRoommateMatchesMock = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Mock roommate data
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

// Real API service - fetches roommate matches
const fetchRoommateMatches = async () => {
  try {
    // Fetch from dedicated roommates endpoint
    const response = await listingService.getRoommates();
    let items = response.data || response || [];

    // Filter to only show approved roommate/room listings
    items = items.filter((item) => item.status === "approved");

    // Sort by creation date (newest first)
    items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Take only first 6 items
    items = items.slice(0, 6);

    // If no room listings found, use mock data
    if (items.length === 0) {
      console.log("No room listings found, using mock data");
      return fetchRoommateMatchesMock();
    }

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
      category: item.category || "Apartment",
    }));
  } catch (error) {
    console.error(
      "Error fetching roommate matches from API, falling back to mock data:",
      error
    );
    return fetchRoommateMatchesMock();
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAdBanner, setShowAdBanner] = React.useState(true);

  // Auto-hide ad banner after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowAdBanner(false);
    }, 3000); // 3 seconds

    return () => clearTimeout(timer);
  }, []);

  // Fetch recent items
  const {
    data: recentItems = [],
    isLoading: itemsLoading,
    error: itemsError,
  } = useQuery({
    queryKey: ["recentItems"],
    queryFn: fetchRecentItems,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
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
    retry: 1,
  });

  const handleViewAll = (section) => {
    console.log(`Navigate to ${section} page`);
    navigate(`/${section}`);
  };

  return (
    <DashboardLayout>
      <div className="px-6">
        <EmailVerificationBanner />
        <ProfileCompletionBanner />

        {/* Ad Banner or Hero Banner */}
        {showAdBanner ? (
          /* Ad Banner - Shows for 3 seconds */
          <div className="bg-gradient-to-r from-green-500 via-pink-400 to-purple-600 rounded-2xl p-8 mb-8 relative overflow-hidden animate-pulse">
            <div className="relative z-10 flex items-center justify-center min-h-[200px]">
              <div className="text-center text-white">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  Place Your Ad Here!
                </h2>
                <p className="text-lg md:text-xl font-medium opacity-90">
                  Reach thousands of students on campus
                </p>
                <p className="text-sm md:text-base mt-2 opacity-75">
                  Contact us for advertising opportunities
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Hero Banner */
          <div className="bg-[url('@/assets/images/DashBannerBg.png')] bg-cover bg-no-repeat rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div className="text-white max-w-lg">
                <p className="text-sm font-medium text-purple-100 mb-2">
                  BEST CHOICE FOR STUDENTS
                </p>
                <h1 className="text-xl md:text-3xl font-semibold mb-4">
                  ONE PLATFORM, EVERY NEED
                </h1>
                <p className="text-purple-100 max-sm:text-sm mb-6 leading-relaxed">
                  Buy, sell, and find roommates around you in one place, built
                  to make campus life easier, and affordable.
                </p>
                <button
                  onClick={() => handleViewAll("items")}
                  className="bg-white text-purple-800 max-sm:text-sm px-3 py-1 md:px-6 md:py-3 rounded-md font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  View Listings
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
          </div>
        )}

        {/* Recently Listed Items Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-2xl font-semibold text-gray-900">
              Recently listed items
            </h2>
            <button
              onClick={() => handleViewAll("items")}
              className="max-sm:text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-3 cursor-pointer"
            >
              View all
              <img src={ChevronRightPurple} alt="icon" />
            </button>
          </div>

          {/* Items Grid */}
          {itemsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <h2 className="md:text-2xl font-semibold text-gray-900">
              Roommate & Apartment Matches
            </h2>
            <button
              onClick={() => handleViewAll("roommates")}
              className="max-sm:text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-3 cursor-pointer"
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
