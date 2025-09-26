import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PlusIcon from "@/assets/icons/plus-icon.svg";
import ShopIcon from "@/assets/icons/shop-icon.svg";
import UsersIcon from "@/assets/icons/users-icon.svg";

const MyPosts = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const { user } = useAuthContext();
  const { resendVerification } = useAuth();

  // Check if user email is verified
  const isEmailVerified = user?.emailVerified || user?.email_verified || user?.verified;

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
    if (type === 'item') {
      navigate('/create-item');
    } else if (type === 'roommate') {
      // Navigate to roommate post creation
      console.log('Navigate to roommate post creation');
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
            <h1 className="text-3xl font-semibold text-gray-900">My Posts</h1>
            <p className="text-gray-600 mt-1">
              Manage all the items you've listed for sale and roommate posts in one place.
            </p>
          </div>
          <button
            onClick={handleCreatePostClick}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
          >
            <img src={PlusIcon} alt="Plus" className="w-4 h-4" />
            Create New Post
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button className="border-b-2 border-purple-500 py-2 px-1 text-sm font-medium text-purple-600">
              Listings
            </button>
            <button className="border-transparent py-2 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
              Roommate Posts
            </button>
          </nav>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <img src={ShopIcon} alt="No posts" className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Post yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't listed any items yet. Start by posting an item you'd like to sell.
          </p>
          <button
            onClick={handleCreatePostClick}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 mx-auto"
          >
            <img src={PlusIcon} alt="Plus" className="w-4 h-4" />
            Create New Post
          </button>
        </div>

        {/* Create Post Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Create a Post</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 mb-6">
                Choose the type of post you want to create.
              </p>

              <div className="space-y-3">
                {/* Item Listing Option */}
                <button
                  onClick={() => handlePostTypeSelection('item')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <img src={ShopIcon} alt="Item" className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Item Listing</h3>
                      <p className="text-sm text-gray-500">
                        Sell something you own, gadgets, furniture, books, appliances etc.
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Find Roommate Option */}
                <button
                  onClick={() => handlePostTypeSelection('roommate')}
                  className="w-full p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors duration-200 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <img src={UsersIcon} alt="Roommate" className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">Find Roommate</h3>
                      <p className="text-sm text-gray-500">
                        Looking for a roommate? Share your details and find a match.
                      </p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Email Verification Required
                </h2>
                <p className="text-gray-600 mb-6">
                  Please verify your email address to create posts. Check your inbox for a verification email.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleResendVerification}
                    disabled={resendVerification.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    {resendVerification.isPending ? 'Sending...' : 'Resend Verification Email'}
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