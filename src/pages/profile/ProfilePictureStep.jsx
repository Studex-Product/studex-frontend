import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

const ProfilePictureStep = ({ profilePicture, onNext }) => {
  const [preview, setPreview] = useState(profilePicture ? URL.createObjectURL(profilePicture) : null);
  const [file, setFile] = useState(profilePicture);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit
        setError('File size exceeds 2MB. Please choose a smaller image.');
        setPreview(null);
        setFile(null);
        return;
      }
      if (!selectedFile.type.startsWith('image/')) {
        setError('Invalid file type. Please upload an image.');
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
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    multiple: false,
  });

  const handleRemoveImage = () => {
    setPreview(null);
    setFile(null);
    setError('');
  };

  const handleContinue = () => {
    if (!file) {
      setError('Please upload a profile picture to continue.');
      return;
    }
    onNext({ profilePicture: file });
  };

  return (
    <div>
      <h2 className="text-2xl font-medium text-gray-900">Upload Profile Picture</h2>
      <p className="text-gray-600 mt-2">Please upload a clear photo of yourself. A good picture helps build trust in the community.</p>

      {/* Dropzone Area */}
      <div 
        {...getRootProps()} 
        className={`mt-8 border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400 cursor-pointer'
        }`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
            <img src={preview} alt="Profile Preview" className="w-full h-full object-cover" />
            <button 
              type="button" 
              onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} 
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
            <p className="text-gray-700">Drag & drop your image here, or <span className="text-purple-600 font-semibold">click to browse</span></p>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG. Max file size: 1MB</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleContinue}
          className="px-8 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed cursor-pointer"
          disabled={!file}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default ProfilePictureStep;