import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
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

  const [formData, setFormData] = useState({
    profilePicture: null,
    profilePicturePreview: "",
    aboutMe: "",
    personalities: [],
  });

  // Pre-fill the form with user data when the modal opens
  useEffect(() => {
    if (user) {
      setFormData({
        profilePicture: user.profilePicture || null,
        profilePicturePreview: user.profilePicture
          ? typeof user.profilePicture === "string"
            ? user.profilePicture
            : URL.createObjectURL(user.profilePicture)
          : "",
        aboutMe: user.aboutMe || "",
        personalities: user.personalities || [],
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the user in the auth context
    updateUser({
      ...user,
      profilePicture: formData.profilePicture,
      aboutMe: formData.aboutMe,
      personalities: formData.personalities,
    });
    toast.custom(() => (
      <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
        {"Profile updated successfully!"}
      </div>
    ));
    onClose();
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
            className="px-6 py-2 border border-gray-300 rounded-lg font-medium cursor-pointer hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium cursor-pointer hover:bg-purple-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
