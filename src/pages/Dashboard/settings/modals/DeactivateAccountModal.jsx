import React from 'react';
import { X, UserMinus } from 'lucide-react';

const DeactivateAccountModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-8 m-4 max-w-lg w-full text-center relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 cursor-pointer"><X size={20} /></button>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserMinus size={32} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Deactivate Account</h2>
        <p className="text-gray-500 mb-8">
          Are you sure you want to deactivate your account? Your posts and profile will be hidden until you log back in.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={onClose} className="px-6 py-3 text-sm border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all duration-200 cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="px-6 py-3 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all duration-200 cursor-pointer">Yes, Deactivate</button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateAccountModal;