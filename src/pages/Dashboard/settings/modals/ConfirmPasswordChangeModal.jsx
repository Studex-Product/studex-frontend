import React from 'react';
import { X, Lock } from 'lucide-react';

const ConfirmPasswordChangeModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-lg p-8 m-4 max-w-md w-full text-center relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <X size={20} />
        </button>
        
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock size={32} className="text-purple-600" />
        </div>
        
        <h2 className="text-2xl font-medium mb-3">Confirm Password Change</h2>
        <p className="text-gray-500 text-sm mb-8">
          You're about to change your password. For security reasons, you will be logged out of all devices and will need to log in again with your new password.
        </p>

        <div className="flex w-full gap-4">
          <button 
            onClick={onClose} 
            className="w-full px-6 py-2 text-sm border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm} 
            className="w-full px-4 py-2 text-sm bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 cursor-pointer"
          >
            Confirm and Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPasswordChangeModal;