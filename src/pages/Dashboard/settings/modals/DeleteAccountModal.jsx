import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';

const deleteReasons = [
  "I don't find the app useful anymore",
  "I created a duplicate account",
  "Too many notifications",
  "I'm not satisfied with the features",
  "I don't understand how to use the app",
  "I only needed it temporarily",
  "Other",
];

const DeleteAccountModal = ({ isOpen, onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-8 m-4 max-w-lg w-full text-center relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 cursor-pointer"><X size={20} /></button>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 size={32} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Delete Account</h2>
        <p className="text-gray-500 mb-6 text-left">
          This action is permanent. Deleting your account will remove your profile, all posts, and messages. Are you sure you want to continue?
        </p>
        <div className="text-left mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <select 
            value={reason} 
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="" disabled>Select reason</option>
            {deleteReasons.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <button onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all duration-200 cursor-pointer">Cancel</button>
          <button 
            onClick={handleConfirm} 
            disabled={!reason}
            className="px-6 py-3 bg-red-500 text-white text-sm rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          >
            Yes, Delete Permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;