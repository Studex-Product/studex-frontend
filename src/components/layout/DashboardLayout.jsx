import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "./Sidebar";
import NotifIcon from "@/assets/icons/bell-ringing-icon.svg";
import DropDown from "@/assets/icons/dropdown-icon.svg";
import ProfileDropdown from "@components/ui/ProfileDropdown";
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
    setIsDropdownOpen((prev) => !prev);
  };

  // Check for avatar/profile picture from various possible sources
  const avatarUrl =
    user?.profilePicture ||
    user?.avatar_url ||
    user?.picture ||
    user?.avatar ||
    user?.profile_image ||
    user?.profile_picture ||
    null;

  // Handle different avatar URL formats
  const getAvatarUrl = () => {
    if (!avatarUrl) return null;

    if (typeof avatarUrl === "string") {
      return avatarUrl;
    } else if (avatarUrl && typeof avatarUrl === "object" && avatarUrl.path) {
      // Handle objects with path property
      return avatarUrl.path;
    }

    return null;
  };

  const finalAvatarUrl = getAvatarUrl();

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
      <div
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="bg-white px-4 py-3 lg:px-6 border-b border-gray-200">
          <div className="flex items-center">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Greeting */}
            <h1 className="text-lg md:text-2xl font-medium text-gray-900 ">
              {(() => {
                const currentHour = new Date().getHours();
                if (currentHour < 12) {
                  return "Good morning";
                } else if (currentHour < 18) {
                  return "Good afternoon";
                } else {
                  return "Good evening";
                }
              })()}
              , {user?.first_name || "User"}!
            </h1>

            {/* User Menu */}
            <div className="flex items-center space-x-4 ml-auto">
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
                  <div className="w-8 h-8 bg-purple-300 rounded-full flex items-center justify-center">
                    {finalAvatarUrl ? (
                      <>
                        <img
                          src={finalAvatarUrl}
                          alt={user?.first_name || "User Avatar"}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            e.target.style.display = "none";
                            const fallback = e.target.nextElementSibling;
                            if (fallback) {
                              fallback.style.display = "flex";
                            }
                          }}
                        />
                        <span
                          className="text-white font-semibold text-sm w-full h-full items-center justify-center"
                          style={{ display: "none" }}
                        >
                          {user?.first_name && user?.last_name
                            ? user.first_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() +
                              user.last_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : ""}
                        </span>
                      </>
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {/* {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'JO'} */}
                        {user?.first_name && user?.last_name
                          ? user.first_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase() +
                            user.last_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : ""}
                      </span>
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {/* {user?.fullName || 'Jessica Ofor'} */}
                    {user?.first_name || user?.last_name
                      ? `${user.first_name} ${user.last_name}`
                      : "Jessica Ofor"}
                  </span>
                  <img
                    src={DropDown}
                    alt="Dropdown"
                    className="w-3 h-3 text-gray-400"
                  />
                </button>

                {/* dropdown component */}
                <ProfileDropdown
                  isOpen={isDropdownOpen}
                  onClose={() => setIsDropdownOpen(false)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="">{children}</div>
        </main>

        {/* Footer */}
        {/* <Footer /> */}
      </div>
    </div>
  );
};

export default DashboardLayout;
