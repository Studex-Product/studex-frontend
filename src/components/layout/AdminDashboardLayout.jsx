import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import AdminSidebar from './AdminSidebar';
import NotifIcon from '@/assets/icons/bell-ringing-icon.svg';
import DropDown from '@/assets/icons/dropdown-icon.svg';
import ProfileDropdown from '@components/ui/ProfileDropdown';

const AdminDashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <AdminSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white px-4 py-4 lg:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Welcome Text */}
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome Back, {user?.fullName?.split(' ')[0] || 'Michelle'}
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Export Data Button */}
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer flex items-center gap-2">
                Export Data
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 cursor-pointer hover:bg-gray-100 transition duration-300">
                <img src={NotifIcon} alt="Notifications" className="w-5 h-5" />
              </button>

              {/* User Avatar */}
              <div className="relative">
                <button
                  onClick={handleDropdown}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition duration-300"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'JO'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.fullName || 'Jessica Ofor'}
                  </span>
                  <img src={DropDown} alt="Dropdown" className="w-3 h-3 text-gray-400" />
                </button>

                <ProfileDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;