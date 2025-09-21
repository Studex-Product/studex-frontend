import { useState } from 'react';

export const useFileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState(null);

  const validateFile = (file) => {
    if (!file) return { isValid: false, error: 'No file selected' };
    
    if (!file.type.match(/\/(jpg|jpeg|png|pdf)$/)) {
      return { isValid: false, error: 'Please select a valid file format (JPG, PNG, PDF)' };
    }
    
    if (file.size > 2 * 1024 * 1024) {
      return { isValid: false, error: 'File size must be less than 2MB' };
    }
    
    return { isValid: true, error: null };
  };

  const handleFileSelect = (file) => {
    const validation = validateFile(file);
    
    if (validation.isValid) {
      setSelectedFile(file);
      setFileError(null);
    } else {
      setSelectedFile(null);
      setFileError(validation.error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFileError(null);
  };

  return {
    selectedFile,
    isDragOver,
    fileError,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeFile,
  };
};