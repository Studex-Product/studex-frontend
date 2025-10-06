import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Logo from "@/components/common/Logo";
import PlusIcon from "@/assets/icons/plus-icon.svg";
import HomeIcon from "@/assets/icons/home-icon.svg";
import ItemListingIcon from "@/assets/icons/shop-icon.svg";
import RoommatesIcon from "@/assets/icons/users-icon.svg";
import MessagesIcon from "@/assets/icons/messages-icon.svg";
import MyPostsIcon from "@/assets/icons/file-icon.svg";
import SupportIcon from "@/assets/icons/headphones-icon.svg";
import SettingsIcon from "@/assets/icons/settings-icon.svg";
import LogoutIcon from "@/assets/icons/logout-icon.svg";

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Home", path: "/dashboard", icon: HomeIcon },
    { name: "Item Listing", path: "/items", icon: ItemListingIcon },
    { name: "Roommates", path: "/roommates", icon: RoommatesIcon },
    { name: "Messages", path: "/messages", icon: MessagesIcon },
    { name: "My Posts", path: "/my-posts", icon: MyPostsIcon },
  ];

  const supportItems = [
    { name: "Support", path: "/contact", icon: SupportIcon },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

    const handlePostItemClick = () => {
    // Check if the user's profile is incomplete
    if (!user?.isProfileComplete) {
      toast.error("Please complete your profile setup before posting an item.");
      // Optionally, navigate them to the settings page
      // navigate('/settings'); 
      return; // Stop the function here
    }
    // If profile is complete, proceed with navigation
    navigate("/my-posts");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <Logo />
      </div>

      {/* Post Item Button */}
      <div className="p-4 border-gray-100">
        <button
          onClick={handlePostItemClick}
          className="w-full text-purple-600 py-3 px-4 rounded-sm font-medium hover:bg-purple-100 transition-colors cursor-pointer flex items-center justify-between duration-300"
        >
          <span>Post Item</span>
          <div className="w-6 h-6 bg-purple-600 bg-opacity-20 rounded-sm flex items-center justify-center">
            <img src={PlusIcon} alt="Plus Icon" className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 pt-4 pb-4 space-y-1">
        <div className="px-3 space-y-3">
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors cursor-pointer ${
                isActiveRoute(item.path)
                  ? "bg-purple-700 text-white"
                  : "text-gray-600 hover:bg-purple-100 hover:text-gray-900"
              }`}
            >
              <img
                src={item.icon}
                alt={item.name}
                className={`mr-3 w-5 h-5 ${
                  isActiveRoute(item.path)
                    ? "brightness-0 invert"
                    : ""
                }`}
              />
              {item.name}
            </button>
          ))}
        </div>

        {/* Support Section */}
        <div className="pt-6 mt-6 border-t border-gray-100">
          <div className="px-3 space-y-2">
            {supportItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-sm transition-colors cursor-pointer ${
                  isActiveRoute(item.path)
                    ? "bg-purple-700 text-white"
                    : "text-gray-600 hover:bg-purple-100 hover:text-gray-900"
                }`}
              >
                <img src={item.icon} alt={item.name} className="mr-3 w-5 h-5" />
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-sm transition-colors cursor-pointer"
        >
          <img src={LogoutIcon} alt="Logout" className="mr-3 w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
