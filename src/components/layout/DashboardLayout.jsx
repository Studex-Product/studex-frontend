import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Sidebar from './Sidebar';
import NotifIcon from '@/assets/icons/bell-ringing-icon.svg';
import DropDown from '@/assets/icons/dropdown-icon.svg';
import ProfileDropdown from '@components/ui/ProfileDropdown';
// import Footer from '../ui/Footer';

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // function to toggle dropdown
  const handleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  // Check for avatar/profile picture from various possible sources
  const avatarUrl = user?.picture || user?.avatar || user?.profile_image || user?.profile_picture || null;

  return (
    <div className="h-screen flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden" 
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white px-4 py-3 lg:px-6">
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

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="I'm looking for..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
                />
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
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
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={user?.first_name || 'User Avatar'}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      ) : (
                        <span className="text-white font-semibold text-sm">
                          {/* {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'JO'} */}
                          {user?.first_name && user?.last_name ? user.first_name.split(' ').map(n => n[0]).join('').toUpperCase() + user.last_name.split(' ').map(n => n[0]).join('').toUpperCase() : ''}
                        </span>
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {/* {user?.fullName || 'Jessica Ofor'} */}
                    {user?.first_name || user?.last_name ? `${user.first_name} ${user.last_name}` : 'Jessica Ofor'}
                  </span>
                  <img src={DropDown} alt="Dropdown" className="w-3 h-3 text-gray-400" />
                </button>

                {/* dropdown component */}
                <ProfileDropdown isOpen={isDropdownOpen} onClose={() => setIsDropdownOpen(false)} />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="">
            {children}
          </div>
        </main>

        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default DashboardLayout;