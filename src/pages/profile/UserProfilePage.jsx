import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { profileService } from '@/api/profileService';
import DashboardLayout from '@/components/layout/DashboardLayout';
import EditProfileModal from '@/pages/profile/modals/EditProfileModal';
import {
  User,
  Edit,
  ShieldCheck,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  School,
  AlertTriangle,
  Activity,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';

const UserProfilePage = () => {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');

  // Fetch detailed profile data
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['myProfile'],
    queryFn: () => profileService.getMyProfile(),
    retry: 2
  });

  // Fetch verification status
  const { data: verificationData } = useQuery({
    queryKey: ['myVerificationStatus'],
    queryFn: () => profileService.getVerificationStatus(),
    retry: 1
  });

  // Fetch user stats
  const { data: statsData } = useQuery({
    queryKey: ['myStats'],
    queryFn: () => profileService.getMyStats(),
    retry: 1
  });

  // Handle displaying the profile picture from API data or local data
  useEffect(() => {
    // Priority: API profile data > local user data
    const profilePicture = profileData?.profile_image || profileData?.avatar || user?.profilePicture;

    if (profilePicture) {
      if (typeof profilePicture === 'string') {
        // If it's already a URL (e.g., from a server)
        setProfilePictureUrl(profilePicture);
      } else {
        // If it's a File object from the setup flow
        const url = URL.createObjectURL(profilePicture);
        setProfilePictureUrl(url);
        // Clean up the object URL when the component unmounts
        return () => URL.revokeObjectURL(url);
      }
    }
  }, [profileData?.profile_image, profileData?.avatar, user?.profilePicture]);

  // Get verification status from API data or fallback to user data
  const verificationStatus = verificationData?.status || profileData?.verification_status || user?.verificationStatus || 'pending';

  const getVerificationBadge = () => {
    if (verificationStatus === 'verified' || verificationStatus === 'approved') {
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
    if (verificationStatus === 'rejected') {
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
          <AlertTriangle size={16} /> Verification Rejected
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-full">
        <User size={16} /> Unverified
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Combine data sources with priority: API data > user context data
  const displayData = {
    firstName: profileData?.first_name || user?.first_name || '',
    lastName: profileData?.last_name || user?.last_name || '',
    email: profileData?.email || user?.email || '',
    phone: profileData?.phone || user?.phone || '',
    dateOfBirth: profileData?.date_of_birth || user?.date_of_birth || '',
    address: profileData?.address || user?.address || '',
    bio: profileData?.bio || profileData?.about_me || user?.aboutMe || '',
    school: profileData?.campus_name || profileData?.school || user?.school || '',
    department: profileData?.department || user?.department || '',
    level: profileData?.level || user?.level || '',
    matricNumber: profileData?.matric_number || user?.matricNumber || '',
    personalities: profileData?.personalities || user?.personalities || [],
    joinedDate: profileData?.created_at || user?.createdAt || ''
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 bg-gray-50/50 min-h-full">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading profile...</p>
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
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-lg font-semibold text-red-700">Error Loading Profile</h3>
                  <p className="text-red-600">Unable to load profile data. Please try again later.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
                  <h1 className="text-2xl font-medium text-gray-900">
                    <span>{displayData.firstName} {displayData.lastName}</span>
                  </h1>
                  <p className="text-gray-500">{displayData.school}</p>
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
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Me */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">About Me</h2>
                  <p className="text-gray-600">{displayData.bio || "You haven't added a bio yet."}</p>
                </div>

                {/* Personality */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-3">Personality & Habits</h2>
                  {displayData.personalities?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {displayData.personalities.map(tag => (
                        <span key={tag} className="bg-purple-100 text-purple-800 font-medium text-sm px-3 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No personality tags selected yet.</p>
                  )}
                </div>

                {/* Academic Information */}
                {(displayData.department || displayData.level || displayData.matricNumber) && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayData.department && (
                        <div className="flex items-center gap-3">
                          <School className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Department</p>
                            <p className="font-medium">{displayData.department}</p>
                          </div>
                        </div>
                      )}
                      {displayData.level && (
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Level</p>
                            <p className="font-medium">{displayData.level}</p>
                          </div>
                        </div>
                      )}
                      {displayData.matricNumber && (
                        <div className="flex items-center gap-3 md:col-span-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Matric Number</p>
                            <p className="font-medium">{displayData.matricNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Activity Stats */}
                {statsData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Activity Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <ShoppingBag className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-purple-600">{statsData.total_listings || 0}</p>
                        <p className="text-sm text-gray-600">Total Listings</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-blue-600">{statsData.total_messages || 0}</p>
                        <p className="text-sm text-gray-600">Messages Sent</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-2xl font-bold text-green-600">{statsData.total_transactions || 0}</p>
                        <p className="text-sm text-gray-600">Transactions</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{displayData.email}</p>
                      </div>
                    </div>
                    {displayData.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{displayData.phone}</p>
                        </div>
                      </div>
                    )}
                    {displayData.address && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="font-medium">{displayData.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Account Information */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Account Information</h2>
                  <div className="space-y-4">
                    {displayData.dateOfBirth && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-medium">{formatDate(displayData.dateOfBirth)}</p>
                        </div>
                      </div>
                    )}
                    {displayData.joinedDate && (
                      <div className="flex items-center gap-3">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Member Since</p>
                          <p className="font-medium">{formatDate(displayData.joinedDate)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Verification Information */}
                {verificationData && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Verification Status</h2>
                    <div className="space-y-3">
                      <div>{getVerificationBadge()}</div>
                      {verificationData.submitted_at && (
                        <p className="text-sm text-gray-600">
                          Submitted: {formatDate(verificationData.submitted_at)}
                        </p>
                      )}
                      {verificationData.verified_at && (
                        <p className="text-sm text-gray-600">
                          Verified: {formatDate(verificationData.verified_at)}
                        </p>
                      )}
                      {verificationData.review_note && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm font-medium text-gray-700">Review Note:</p>
                          <p className="text-sm text-gray-600 mt-1">{verificationData.review_note}</p>
                        </div>
                      )}
                    </div>
                  </div>
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