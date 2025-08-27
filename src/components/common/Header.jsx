import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@components/common/Logo";
import CloseIcon from "@/assets/icons/close-icon.svg";
import HamburgerMenuIcon from "@/assets/icons/hamburger-menu-icon.svg";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  return (
    <header className="bg-white relative z-50 mt-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => handleNavigation("/")}
              className={`font-medium transition-colors relative group cursor-pointer ${
                isActive("/") ? "text-[#9046CF]" : "text-gray-700"
              } hover:text-[#9046CF]`}
            >
              Home
              <span
                className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#9046CF] transform transition-transform ${
                  isActive("/")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </button>
            <button
              onClick={() => handleNavigation("/about")}
              className={`font-medium transition-colors relative group cursor-pointer ${
                isActive("/about") ? "text-[#9046CF]" : "text-gray-700"
              } hover:text-[#9046CF]`}
            >
              About Us
              <span
                className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#9046CF] transform transition-transform ${
                  isActive("/about")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </button>
            <button
              onClick={() => handleNavigation("/contact")}
              className={`font-medium transition-colors relative group cursor-pointer ${
                isActive("/contact") ? "text-[#9046CF]" : "text-gray-700"
              } hover:text-[#9046CF]`}
            >
              Contact
              <span
                className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#9046CF] transform transition-transform ${
                  isActive("/contact")
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                }`}
              ></span>
            </button>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleNavigation("/register")}
              className="bg-[#9046CF] text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Sign Up
            </button>
            <button
              onClick={() => handleNavigation("/login")}
              className="bg-[#F6EBFF] text-purple-500 px-6 py-2 rounded-md font-medium hover:bg-purple-200 transition-colors cursor-pointer"
            >
              Log In
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img src={HamburgerMenuIcon} alt="Menu" className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Mobile Menu Slide-out */}
      <div
        className={`fixed inset-0 bg-white transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-6">
            <div className="flex justify-center items-center">
              <Logo />
            </div>
            <button onClick={toggleMobileMenu} className="p-2">
              <img src={CloseIcon} alt="Close Menu" className="w-4 h-4" />
            </button>
          </div>

          {/* Centered Navigation Content */}
          <div className="flex-1 flex flex-col items-center px-6">
            {/* Navigation Links */}
            {/* Navigation Links in Mobile Menu */}
            <nav className="space-y-8 mt-8 mb-12 flex flex-col items-center">
              <button
                onClick={() => handleNavigation("/")}
                className={`block text-xl transition-colors cursor-pointer ${
                  isActive("/")
                    ? "text-[#9046CF]"
                    : "text-gray-700 hover:text-[#9046CF]"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation("/listing")}
                className={`block text-xl transition-colors cursor-pointer ${
                  isActive("/listing")
                    ? "text-[#9046CF]"
                    : "text-gray-700 hover:text-[#9046CF]"
                }`}
              >
                Listing
              </button>
              <button
                onClick={() => handleNavigation("/about")}
                className={`block text-xl transition-colors cursor-pointer ${
                  isActive("/about")
                    ? "text-[#9046CF]"
                    : "text-gray-700 hover:text-[#9046CF]"
                }`}
              >
                About Us
              </button>
              <button
                onClick={() => handleNavigation("/contact")}
                className={`block text-xl transition-colors cursor-pointer ${
                  isActive("/contact")
                    ? "text-[#9046CF]"
                    : "text-gray-700 hover:text-[#9046CF]"
                }`}
              >
                Contact
              </button>
            </nav>

            {/* Auth Buttons */}
            <div className="space-y-4 w-full max-w-sm">
              <button
                onClick={() => handleNavigation("/register")}
                className="w-full bg-[#9046CF] text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer"
              >
                Sign Up
              </button>
              <button
                onClick={() => handleNavigation("/login")}
                className="w-full bg-[#F6EBFF] text-purple-500 py-3 px-6 rounded-lg font-medium hover:bg-purple-200 transition-colors cursor-pointer"
              >
                Log In
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
