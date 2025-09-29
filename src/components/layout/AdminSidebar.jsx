import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/common/Logo";
import HomeIcon from "@/assets/icons/home-icon.svg";
import UsersIcon from "@/assets/icons/users-icon.svg";
import ShopIcon from "@/assets/icons/shop-icon.svg";
import FileIcon from "@/assets/icons/file-icon.svg";
import SettingsIcon from "@/assets/icons/settings-icon.svg";
import LogoutIcon from "@/assets/icons/logout-icon.svg";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: HomeIcon },
    { name: "Users", path: "/admin/users", icon: UsersIcon },
    { name: "Profile", path: "/admin/profile", icon: UsersIcon },
    { name: "Roommate", path: "/admin/roommate", icon: UsersIcon },
    { name: "Market", path: "/admin/market", icon: ShopIcon },
    { name: "Analytics", path: "/admin/analytics", icon: FileIcon },
    { name: "Notifications", path: "/admin/notifications", icon: FileIcon },
    { name: "Settings", path: "/admin/settings", icon: SettingsIcon },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100">
        <Logo />
        <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Admin Dashboard (Home)</p>
      </div>

      {/* General Section */}
      <div className="px-4 py-4">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">General</h3>
        <div className="space-y-1">
          {navigationItems.slice(0, 5).map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isActiveRoute(item.path)
                  ? "bg-purple-700 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
      </div>

      {/* Analytics & Settings Section */}
      <div className="px-4 py-4">
        <div className="space-y-1">
          {navigationItems.slice(5).map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                isActiveRoute(item.path)
                  ? "bg-purple-700 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
      </div>

      {/* Logout Section */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
        >
          <img src={LogoutIcon} alt="Logout" className="mr-3 w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;