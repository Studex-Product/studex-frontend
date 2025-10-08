// Helper function to transform user data from snake_case to camelCase
export const transformUserData = (userData) => {
  if (!userData) return userData;

  return {
    ...userData,
    isProfileComplete: userData.is_profile_complete,
    // Add other transformations as needed
  };
};