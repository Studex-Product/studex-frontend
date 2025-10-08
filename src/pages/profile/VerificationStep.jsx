import React, { useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDropzone } from 'react-dropzone';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/api/adminService';
import { ShieldCheck, Clock, UploadCloud, FileText, X } from 'lucide-react';
import { DOCUMENT_TYPES } from '@/utils/documentTypes';

const VerificationStep = ({ school, idType, idFile, onNext }) => {
  const { user } = useAuth();

  // Fetch active campuses for assignment
  const { data: campuses = [], isLoading: campusesLoading, error: campusesError } = useQuery({
    queryKey: ["activeCampuses"],
    queryFn: () => adminService.getCampuses(),
    select: (data) => {
      // Handle different response structures
      if (Array.isArray(data)) {
        return data;
      }
      return data.items || data.campuses || data.data || [];
    }
  });

  const [selectedSchool, setSelectedSchool] = useState(school || '');
  const [selectedIdType, setSelectedIdType] = useState(idType || '');
  const [file, setFile] = useState(idFile);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles) => {
    setError('');
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) { // 2MB limit
        setError('File size exceeds 2MB.');
        return;
      }
      setFile(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg'],
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const handleContinue = () => {
    if (!selectedSchool || !selectedIdType || !file) {
      setError('Please select your school, ID type, and upload a valid ID document.');
      return;
    }
    onNext({
      school: selectedSchool,
      idType: selectedIdType,
      idFile: file
    });
  };
  
  // If user has already submitted and is verified
  if (user.verification_status === 'verified') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldCheck size={32} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-medium text-gray-900">You are Verified!</h2>
        <p className="text-gray-600 mt-2">Your student status has already been successfully verified. You can proceed to the next step.</p>
        <div className="mt-8 flex justify-end">
          <button onClick={() => onNext({})} className="px-8 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors cursor-pointer duration-200">
            Continue
          </button>
        </div>
      </div>
    );
  }

  // If user has submitted and is pending review
  if (user.verification_status === 'pending') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="text-yellow-600" />
        </div>
        <h2 className="text-2xl font-medium text-gray-900">Verification Pending</h2>
        <p className="text-gray-600 mt-2">Your documents have been submitted and are currently under review. You can proceed for now.</p>
        <div className="mt-8 flex justify-end">
          <button onClick={() => onNext({})} className="px-8 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors cursor-pointer duration-200">
            Continue
          </button>
        </div>
      </div>
    );
  }

  // If user skipped on sign up and needs to submit documents
  return (
    <div>
      <h2 className="text-2xl font-medium text-gray-900">Verification</h2>
      <p className="text-gray-600 mt-2">Please select your school, ID type, and upload a valid student ID document to get verified.</p>
      
      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">School/Institution</label>
          {campusesLoading ? (
            <div className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50">
              Loading campuses...
            </div>
          ) : campusesError ? (
            <div className="w-full p-2 border border-red-300 rounded-lg bg-red-50 text-red-600">
              Error loading campuses. Please refresh the page.
            </div>
          ) : (
            <select
              id="school"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="" disabled>Select your school</option>
              {campuses.map(campus => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* ID Type Selection */}
        <div>
          <label htmlFor="idType" className="block text-sm font-medium text-gray-700 mb-1">ID Document Type</label>
          <select
            id="idType"
            value={selectedIdType}
            onChange={(e) => setSelectedIdType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="" disabled>Select ID document type</option>
            {DOCUMENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload ID Document</label>
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
              isDragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400 cursor-pointer'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-center gap-3 text-gray-700">
                <FileText size={24} />
                <span className="font-medium">{file.name}</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-red-500 hover:text-red-700"><X size={16}/></button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <UploadCloud size={28} className="text-gray-400 mb-2" />
                <p className="text-gray-700">Drag & drop file here, or <span className="text-purple-600 font-semibold">click to browse</span></p>
                <p className="text-sm text-gray-500 mt-1">PDF, JPG, PNG. Max file size: 2MB</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleContinue}
          className="px-8 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
          disabled={!selectedSchool || !selectedIdType || !file}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default VerificationStep;