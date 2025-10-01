import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EditProfileModal from '@/pages/profile/modals/EditProfileModal';
import { User, Edit, ShieldCheck, Clock } from 'lucide-react';

const UserProfilePage = () => {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  // Handle displaying the profile picture from a File object or a URL
  useEffect(() => {
    if (user?.profilePicture) {
      if (typeof user.profilePicture === 'string') {
        // If it's already a URL (e.g., from a server)
        setProfilePictureUrl(user.profilePicture);
      } else {
        // If it's a File object from the setup flow
        const url = URL.createObjectURL(user.profilePicture);
        setProfilePictureUrl(url);
        // Clean up the object URL when the component unmounts
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [user?.profilePicture]);

  const verificationStatus = user.verificationStatus || 'pending'; // 'verified', 'pending', 'unverified' - for testing purposes

  const getVerificationBadge = () => {
    if (verificationStatus === 'verified') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
          <ShieldCheck size={16} /> Verified
        </span>
      );
    }
    if (verificationStatus === 'pending') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
          <Clock size={16} /> Pending Verification
        </span>
      );
    }
    return null;
  };

  return (
    <>
      <DashboardLayout>
        <div className="p-6 bg-gray-50/50 min-h-full">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  {profilePictureUrl ? (
                    <img src={profilePictureUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User size={40} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-medium text-gray-900"><span>{user.first_name} {user.last_name}</span></h1>
                  <p className="text-gray-500">{user?.school}</p>
                  <div className="mt-2">
                    {getVerificationBadge()}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition duration-200 cursor-pointer"
              >
                <Edit size={16} /> Edit Profile
              </button>
            </div>

            {/* Main Content */}
            <div className="mt-6 grid grid-cols-1 gap-6">
              {/* About Me */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-3">About Me</h2>
                <p className="text-gray-600">{user?.aboutMe || "You haven't added a bio yet."}</p>
              </div>
              
              {/* Personality */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-3">Personality & Habits</h2>
                {user?.personalities?.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {user.personalities.map(tag => (
                      <span key={tag} className="bg-purple-100 text-purple-800 font-medium text-sm px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No personality tags selected yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};

export default UserProfilePage;