import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useAuth } from "@/hooks/useAuth";
import { useListing } from "@/hooks/useListing";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Loader from '@/assets/Loader.svg';
import { Plus, FileSearch, Users, List, Eye, MoreHorizontal } from "lucide-react";

// ListingCard component to display individual listings
const ListingCard = ({ listing }) => {
  // const navigate = useNavigate();

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get the first image or use placeholder
  const getImageUrl = (listing) => {
    if (listing.images && listing.images.length > 0) {
      return listing.images[0].url || listing.images[0];
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 flex-shrink-0">
          {getImageUrl(listing) ? (
            <img
              src={getImageUrl(listing)}
              alt={listing.item_name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <FileSearch className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {listing.item_name}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {listing.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {listing.view_count || 0} views
                </span>
                <span>Posted {formatDate(listing.created_at)}</span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end gap-2 ml-4">
              <div className="text-lg font-semibold text-gray-900">
                {formatPrice(listing.price)}
              </div>
              <button className="p-1 hover:bg-gray-100 rounded">
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyPosts = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [activeTab, setActiveTab] = useState("listings");

  const { user } = useAuthContext();
  const { resendVerification } = useAuth();
  const { userListings, isLoadingUserListings, userListingsError, refetchUserListings } = useListing();

  // Check if user email is verified
  const isEmailVerified =
    user?.emailVerified || user?.email_verified || user?.verified;

  const handleCreatePostClick = () => {
    if (!isEmailVerified) {
      setShowVerificationModal(true);
    } else {
      setShowCreateModal(true);
    }
  };

  const handlePostTypeSelection = (type) => {
    setShowCreateModal(false);
    // Navigate to appropriate creation flow
    if (type === "item") {
      navigate("/create-item");
    } else if (type === "roommate") {
      // Navigate to roommate post creation
      navigate("/create-roommate");
    }
  };

  const handleResendVerification = () => {
    if (user?.email) {
      resendVerification.mutate({ email: user.email });
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-medium text-gray-900">My Posts</h1>
            <p className="text-gray-600 mt-1">
              Manage all the items you've listed for sale and roommate posts in
              one place.
            </p>
          </div>
          <button
            onClick={handleCreatePostClick}
            className="text-purple-700 hover:text-purple-800 border-1 border-purple-700 hover:border-purple-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Post
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              className={`py-2 px-1 text-sm font-medium ${
                activeTab === "listings"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("listings")}
            >
              Listings
            </button>
            <button
              className={`py-2 px-1 text-sm font-medium ${
                activeTab === "roommates"
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("roommates")}
            >
              Roommate Posts
            </button>
          </nav>
        </div>

        {/* Listings Content */}
        {activeTab === "listings" ? (
          <div>
            {/* Loading State */}
            {isLoadingUserListings ? (
              <div className="text-center py-12">
                <img src={Loader} alt="Loading..." className="w-12 h-12 mx-auto mb-4" />
                <p className="text-gray-600">Loading your listings...</p>
              </div>
            ) : userListingsError ? (
              /* Error State */
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load listings</h3>
                <p className="text-gray-600 mb-6">There was an error loading your listings. Please try again.</p>
                <button
                  onClick={() => refetchUserListings()}
                  className="text-purple-700 hover:text-purple-800 font-medium text-sm"
                >
                  Try Again
                </button>
              </div>
            ) : userListings && userListings.length > 0 ? (
              /* Listings Grid */
              <div className="space-y-4">
                {userListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-22">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <FileSearch className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Post yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't listed any items yet. Start by posting an item you'd
                  like to sell.
                </p>
                <button
                  onClick={handleCreatePostClick}
                  className="text-purple-700 hover:text-purple-800 font-medium text-sm flex items-center gap-1 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create New Post
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-22">
            <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
              <FileSearch className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Roommate Post yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't created any roommate posts yet. Start by sharing your
              details to find a match.
            </p>
            <button
              onClick={handleCreatePostClick}
              className="text-purple-700 hover:text-purple-800 font-medium text-sm flex items-center gap-1 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create New Post
            </button>
          </div>
        )}

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold">Create a Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-500 mb-6">
                Choose the type of post you want to create.
              </p>

              <div className="space-y-3">
                {/* Item Listing Option */}
                <button
                  onClick={() => handlePostTypeSelection("item")}
                  className="w-full p-4 border bg-neutral-100 rounded-lg hover:bg-purple-50 transition-colors duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-purple-700 rounded-lg flex items-center justify-center">
                      <List alt="Item" className="w-5 h-5 text-purple-700" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-gray-900">Item Listing</h3>
                      <p className="text-xs text-gray-500">
                        Sell something you own, gadgets, furniture, books,
                        appliances etc.
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Find Roommate Option */}
                <button
                  onClick={() => handlePostTypeSelection("roommate")}
                  className="w-full p-4 border bg-neutral-100 rounded-lg hover:bg-purple-50 transition-colors duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white border border-purple-700 rounded-lg flex items-center justify-center">
                      <Users
                        alt="Roommate"
                        className="w-5 h-5 text-purple-700"
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="text-gray-900">Find Roommate</h3>
                      <p className="text-xs text-gray-500">
                        Looking for a roommate? Share your details and find a
                        match.
                      </p>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Verification Modal */}
        {showVerificationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 15.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Email Verification Required
                </h2>
                <p className="text-gray-600 mb-6">
                  Please verify your email address to create posts. Check your
                  inbox for a verification email.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={resendVerification.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    {resendVerification.isPending
                      ? "Sending..."
                      : "Resend Verification Email"}
                  </button>
                  <button
                    onClick={() => setShowVerificationModal(false)}
                    className="w-full text-gray-600 hover:text-gray-800 py-2 px-4 font-medium transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyPosts;
