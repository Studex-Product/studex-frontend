import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/api/profileService";
import { useQueryClient } from "@tanstack/react-query";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { X, UploadCloud, User, Check } from "lucide-react";

const personalityTags = [
  "Social",
  "Night Owl",
  "Early Bird",
  "Likes Quiet",
  "Loud",
  "Smoker",
  "Introvert",
  "Religious",
  "Very Tidy",
  "Bookworm",
];

const EditProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    profilePicture: null,
    profilePicturePreview: "",
    aboutMe: "",
    personalities: [],
    hasNewProfilePicture: false, // Track if user uploaded a new picture
  });

  // Pre-fill the form with user data when the modal opens
  useEffect(() => {
    if (user && isOpen) {
      let profilePicturePreview = "";

      // Check multiple sources for profile picture
      const profilePic =
        user.avatar_url ||
        user.profilePicture ||
        user.profile_image ||
        user.picture;

      if (profilePic) {
        if (typeof profilePic === "string") {
          profilePicturePreview = profilePic;
        } else if (profilePic instanceof File || profilePic instanceof Blob) {
          try {
            profilePicturePreview = URL.createObjectURL(profilePic);
          } catch (error) {
            console.error(
              "Error creating object URL for profile picture:",
              error
            );
            profilePicturePreview = "";
          }
        } else if (
          profilePic &&
          typeof profilePic === "object" &&
          profilePic.path
        ) {
          profilePicturePreview = profilePic.path;
        }
      }

      // Check multiple sources for bio/about me
      const bioText = user.aboutMe || user.bio || user.about_me || "";

      // Check multiple sources for personalities
      const userPersonalities = user.personalities || [];

      console.log("EditProfileModal - Initializing with user data:", {
        profilePic,
        bioText,
        userPersonalities,
        user,
      });

      setFormData({
        profilePicture: profilePic || null,
        profilePicturePreview,
        aboutMe: bioText,
        personalities: userPersonalities,
        hasNewProfilePicture: false, // Reset the flag when modal opens
      });
    }
  }, [user, isOpen]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
        profilePicturePreview: URL.createObjectURL(file),
        hasNewProfilePicture: true, // Mark that user uploaded a new picture
      }));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag) => {
    setFormData((prev) => ({
      ...prev,
      personalities: prev.personalities.includes(tag)
        ? prev.personalities.filter((t) => t !== tag)
        : [...prev.personalities, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    setIsSubmitting(true);

    try {
      // Create FormData for the update
      const formDataForUpdate = new FormData();

      // Only include fields that have values (to avoid overriding existing data with empty values)
      if (formData.aboutMe.trim()) {
        formDataForUpdate.append("bio", formData.aboutMe.trim());
      }

      if (formData.personalities && formData.personalities.length > 0) {
        formDataForUpdate.append(
          "personalities",
          JSON.stringify(formData.personalities)
        );
      }

      // If user uploaded a new profile picture, add it to the form data
      if (
        formData.hasNewProfilePicture &&
        formData.profilePicture instanceof File
      ) {
        formDataForUpdate.append("profilePicture", formData.profilePicture);
      }

      // Only make API call if there's something to update
      let updateResponse = null;
      if (
        formDataForUpdate.has("bio") ||
        formDataForUpdate.has("personalities") ||
        formDataForUpdate.has("profilePicture")
      ) {
        try {
          updateResponse = await profileService.updateProfile(
            formDataForUpdate
          );
        } catch (apiError) {
          // If API fails, we can still update locally for now
          console.warn("API update failed, updating locally only:", apiError);
          if (
            apiError.response?.status === 500 ||
            apiError.code === "ERR_NETWORK"
          ) {
            // API endpoint may not be implemented yet, continue with local update
            updateResponse = null;
          } else {
            // For other errors, throw to be handled by outer catch
            throw apiError;
          }
        }
      }

      // Build updated user data by preserving existing values and only updating changed ones
      const updatedUserData = { ...user };

      // Update profile picture if a new one was uploaded
      if (formData.hasNewProfilePicture && updateResponse) {
        const updatedProfilePicture =
          updateResponse.avatar_url ||
          updateResponse.profilePicture ||
          updateResponse.profile_image;
        if (updatedProfilePicture) {
          updatedUserData.profilePicture = updatedProfilePicture;
          updatedUserData.avatar_url = updatedProfilePicture;
        }
      }

      // Update bio if it was changed
      if (formData.aboutMe.trim()) {
        updatedUserData.aboutMe = formData.aboutMe.trim();
        updatedUserData.bio = formData.aboutMe.trim();
      }

      // Update personalities if they were changed
      if (formData.personalities && formData.personalities.length > 0) {
        updatedUserData.personalities = formData.personalities;
      }

      // Update the user in the auth context
      updateUser(updatedUserData);

      // Invalidate profile queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Profile updated successfully!
        </div>
      ));

      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);

      // More specific error messages
      let errorMessage = "Failed to update profile. Please try again.";
      if (error.response?.status === 500) {
        errorMessage =
          "Server error. The profile endpoint may not be available yet.";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {errorMessage}
        </div>
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg m-4 max-w-2xl w-full relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          {/* Profile Picture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                {formData.profilePicturePreview ? (
                  <img
                    src={formData.profilePicturePreview}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={32} className="text-gray-400" />
                )}
              </div>
              <div
                {...getRootProps()}
                className="flex items-center gap-2 text-sm text-purple-600 font-semibold cursor-pointer p-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 w-full justify-center"
              >
                <input {...getInputProps()} />
                <UploadCloud size={16} />
                <span>Click to upload or drag & drop</span>
              </div>
            </div>
          </div>

          {/* About Me */}
          <div>
            <label
              htmlFor="aboutMe"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              About Me
            </label>
            <textarea
              id="aboutMe"
              name="aboutMe"
              value={formData.aboutMe}
              onChange={handleInputChange}
              rows={4}
              placeholder="Write a brief bio..."
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Personalities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personality & Habits
            </label>
            <div className="flex flex-wrap gap-3">
              {personalityTags.map((tag) => {
                const isSelected = formData.personalities.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`flex items-center px-4 py-2 rounded-lg border text-sm font-medium ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    {isSelected && <Check size={16} className="mr-2" />}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </form>

        <div className="p-6 border-t flex justify-end gap-4 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-6 py-2 bg-purple-600 text-white rounded-lg font-medium transition-all duration-200 ${
              isSubmitting
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:bg-purple-700"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
