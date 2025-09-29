import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import DeactivateAccountModal from "@/pages/Dashboard/settings/modals/DeactivateAccountModal";
import DeleteAccountModal from "@/pages/Dashboard/settings/modals/DeleteAccountModal";

const AccountManagementTab = () => {
  const { logout } = useAuth();
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeactivate = () => {
    console.log("Deactivating account...");
    setIsDeactivateModalOpen(false);
    logout();
  };

  const handleDelete = (reason) => {
    console.log(`Deleting account permanently for reason: ${reason}`);
    setIsDeleteModalOpen(false);
    logout();
  };

  return (
    <>
      <div className="max-w-3xl">
        <h2 className="text-xl font-medium text-gray-900">Account Management</h2>
        <p className="text-sm text-gray-500 mt-1">Manage the status of your StudEx account.</p>

        <div className="mt-8 space-y-8">
          {/* Deactivate Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Deactivate Account</h3>
            <p className="text-sm text-gray-500 mt-1">Temporarily hide your profile and posts. You can reactivate anytime by logging back in.</p>
            <button onClick={() => setIsDeactivateModalOpen(true)} className="mt-3 px-4 py-2.5 bg-red-500 text-white font-semibold text-sm rounded-md hover:bg-red-600 transition-all duration-200 cursor-pointer">
              Deactivate
            </button>
          </div>
          
          {/* Delete Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Delete Account</h3>
            <p className="text-sm text-gray-500 mt-1">Permanently delete your account and all associated posts. This action cannot be undone.</p>
            <button onClick={() => setIsDeleteModalOpen(true)} className="mt-3 px-4 py-2.5 bg-red-500 text-white font-semibold text-sm rounded-md hover:bg-red-600 transition-all duration-200 cursor-pointer">
              Delete Permanently
            </button>
          </div>
        </div>
      </div>

      <DeactivateAccountModal 
        isOpen={isDeactivateModalOpen}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivate}
      />
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AccountManagementTab;