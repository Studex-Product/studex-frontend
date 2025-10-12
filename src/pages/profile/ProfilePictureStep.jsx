import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Camera, Image as ImageIcon, X } from "lucide-react";

const ProfilePictureStep = ({ profilePicture, onNext }) => {
  const [preview, setPreview] = useState(
    profilePicture ? URL.createObjectURL(profilePicture) : null
  );
  const [file, setFile] = useState(profilePicture);
  const [error, setError] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    setError("");
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        // 2MB limit
        setError("File size exceeds 2MB. Please choose a smaller image.");
        setPreview(null);
        setFile(null);
        return;
      }
      if (!selectedFile.type.startsWith("image/")) {
        setError("Invalid file type. Please upload an image.");
        setPreview(null);
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg"],
    },
    multiple: false,
  });

  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
    setError("");
  };

  const handleContinue = () => {
    // Reset error state
    setError("");

    // Validation
    if (!dateOfBirth) {
      setError("Please select your date of birth.");
      return;
    }

    if (!gender) {
      setError("Please select your gender.");
      return;
    }

    if (!phoneNumber) {
      setError("Please enter your phone number.");
      return;
    }

    // Phone number validation (basic format check)
    const phoneRegex = /^[+]?[\d\s()-]{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    if (!file) {
      setError("Please upload a profile picture to continue.");
      return;
    }

    // Age validation (must be at least 13 years old)
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      age < 13 ||
      (age === 13 && monthDiff < 0) ||
      (age === 13 && monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      setError("You must be at least 13 years old to use this platform.");
      return;
    }

    onNext({
      profilePicture: file,
      dateOfBirth,
      gender,
      phoneNumber,
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-medium text-gray-900">
        Personal Info and Profile Picture
      </h2>
      <p className="text-gray-600 mt-2">
        Please upload a clear photo of yourself. A good picture helps build
        trust in the community.
      </p>

      {/* Personal Information Form */}
      {/* Dropzone Area */}
      <div
        {...getRootProps()}
        className={`mt-8 border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDragActive
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 hover:border-gray-400 cursor-pointer"
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
            <img
              src={preview}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
              <Camera size={28} className="text-purple-600" />
            </div>
            <p className="text-gray-700">
              Drag & drop your image here, or{" "}
              <span className="text-purple-600 font-semibold">
                click to browse
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              JPG, PNG. Max file size: 1MB
            </p>
          </div>
        )}
      </div>
      <div className="mt-6 space-y-6">
        {/* Date of Birth */}
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            max={new Date().toISOString().split("T")[0]} // Prevent future dates
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="space-y-2">
            {["Male", "Female"].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={gender === option}
                  onChange={(e) => setGender(e.target.value)}
                  className="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g +234 803 123 4567"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            Include country code (e.g., +234 for Nigeria)
          </p>
        </div>
      </div>

      {error && (
        <p className="w-full mt-3 flex justify-center">
          <span className="text-red-500 border border-red-300 p-1 rounded-md text-xs text-center">
            {error}
          </span>
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          className="px-8 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed cursor-pointer"
          disabled={!file || !dateOfBirth || !gender || !phoneNumber}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProfilePictureStep;
