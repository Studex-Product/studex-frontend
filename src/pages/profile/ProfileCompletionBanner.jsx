import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';

const ProfileCompletionBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // If the profile is complete or there's no user, show nothing.
  if (!user || user.is_profile_complete) {
    return null;
  }

  return (
    <div 
      className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 hover:bg-yellow-200 p-4 mb-4 transition-all duration-200 rounded-r-lg cursor-pointer"
      onClick={() => navigate('/profile-setup')}
    >
      <div className="flex items-center">
        <Info size={30} className="mr-3" />
        <div>
          <p className="font-medium">Complete Your Profile</p>
          <p className="text-xs">Click here to update your profile before posting an item.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionBanner;