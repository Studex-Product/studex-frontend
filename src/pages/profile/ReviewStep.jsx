import React from "react";
import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/api/adminService";
// import { Edit } from 'lucide-react';

const ReviewSection = ({ title, children }) => (
  // const ReviewSection = ({ title, children, onEdit }) => (
  <div className="py-4 border-b">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {/* The onEdit function is a placeholder for future functionality */}
      {/* <button onClick={onEdit} className="text-sm text-purple-600 font-semibold flex items-center gap-1 hover:underline">
        <Edit size={14} /> Edit
      </button> */}
    </div>
    {children}
  </div>
);

const ReviewStep = ({ profileData, onComplete, isSubmitting = false }) => {
  // Fetch campuses to display the actual campus name instead of ID
  const { data: campuses = [] } = useQuery({
    queryKey: ["activeCampuses"],
    queryFn: () => adminService.getCampuses(),
    select: (data) => {
      if (Array.isArray(data)) {
        return data;
      }
      return data.items || data.campuses || data.data || [];
    },
  });

  // Find the campus name by ID
  const getCampusName = (campusId) => {
    const campus = campuses.find(
      (c) => c.id === campusId || c.id === parseInt(campusId)
    );
    return campus ? campus.name : campusId; // Fallback to ID if not found
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Review and Confirm</h2>
      <p className="text-gray-600 mt-2">
        Please review your information before completing your profile setup.
      </p>

      <div className="mt-8 space-y-4">
        {/* Profile Picture Review */}
        {profileData.profilePicture && (
          <ReviewSection title="Profile Picture">
            <img
              src={URL.createObjectURL(profileData.profilePicture)}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
          </ReviewSection>
        )}

        {/* Personal Information Review */}
        {(profileData.dateOfBirth || profileData.gender) && (
          <ReviewSection title="Personal Information">
            <div className="text-sm text-gray-600 space-y-1">
              {profileData.dateOfBirth && (
                <p>
                  <strong className="font-medium text-gray-800">
                    Date of Birth:
                  </strong>{" "}
                  {new Date(profileData.dateOfBirth).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              )}
              {profileData.gender && (
                <p>
                  <strong className="font-medium text-gray-800">Gender:</strong>{" "}
                  {profileData.gender}
                </p>
              )}
            </div>
          </ReviewSection>
        )}

        {/* About Me Review */}
        <ReviewSection title="About Me">
          <p className="text-gray-600 text-sm">{profileData.aboutMe}</p>
        </ReviewSection>

        {/* Personalities Review */}
        <ReviewSection title="Personality & Habits">
          <div className="flex flex-wrap gap-2">
            {profileData.personalities.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </ReviewSection>

        {/* Verification Review */}
        <ReviewSection title="Verification">
          <div className="text-sm text-gray-600">
            <p>
              <strong className="font-medium text-gray-800">School:</strong>{" "}
              {getCampusName(profileData.school)}
            </p>
            {profileData.idType && (
              <p>
                <strong className="font-medium text-gray-800">ID Type:</strong>{" "}
                {profileData.idType}
              </p>
            )}
            {profileData.idFile && (
              <p>
                <strong className="font-medium text-gray-800">Document:</strong>{" "}
                {profileData.idFile.name}
              </p>
            )}
          </div>
        </ReviewSection>
      </div>

      {/* Confirmation Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={onComplete}
          disabled={isSubmitting}
          className={`px-8 py-2.5 bg-purple-600 text-white font-medium rounded-lg transition-all duration-200 ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-purple-700 cursor-pointer"
          }`}
        >
          {isSubmitting
            ? "Completing Profile..."
            : "Confirm & Complete Profile"}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
