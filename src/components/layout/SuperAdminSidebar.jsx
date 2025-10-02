import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import Logo from "@/components/common/Logo";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  Users,
  Shield,
  Globe,
  Home,
  School,
  Plus
} from "lucide-react";

const SuperAdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const menuItems = [
    // System Overview
    {
      section: "System Overview",
      items: [
        {
          name: "Dashboard",
          icon: LayoutDashboard,
          path: "/super-admin/dashboard",
        },
        {
          name: "System Analytics",
          icon: BarChart3,
          path: "/super-admin/analytics",
        },
        {
          name: "Platform Health",
          icon: Shield,
          path: "/super-admin/health",
        },
      ],
    },
    // User Management
    {
      section: "User Management",
      items: [
        {
          name: "All Users",
          icon: Users,
          path: "/super-admin/users",
        },
        {
          name: "Admins",
          icon: Shield,
          path: "/super-admin/admins",
        },
        {
          name: "User Verification",
          icon: User,
          path: "/super-admin/verification",
        },
      ],
    },
    // Campus Management
    {
      section: "Campus Management",
      items: [
        {
          name: "All Campuses",
          icon: School,
          path: "/super-admin/campuses",
        },
        {
          name: "Create Campus",
          icon: Plus,
          path: "/super-admin/campuses/create",
        },
      ],
    },
    // Content Management
    {
      section: "Content Management",
      items: [
        {
          name: "All Listings",
          icon: ShoppingBag,
          path: "/super-admin/listings",
        },
        {
          name: "Roommate Posts",
          icon: Home,
          path: "/super-admin/roommates",
        },
        {
          name: "Content Moderation",
          icon: Shield,
          path: "/super-admin/moderation",
        },
      ],
    },
    // System Administration
    {
      section: "System Administration",
      items: [
        {
          name: "System Settings",
          icon: Settings,
          path: "/super-admin/settings",
        },
        {
          name: "Platform Configuration",
          icon: Globe,
          path: "/super-admin/configuration",
        },
        {
          name: "System Notifications",
          icon: Bell,
          path: "/super-admin/notifications",
        },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="bg-white w-64 min-h-screen border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-200">
          <div className="w-8 h-8">
            <Logo />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">StudEx</h1>
            <p className="text-xs text-purple-600 font-medium">Super Admin</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
                {section.section}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive(item.path)
                          ? "bg-purple-50 text-purple-700 border-r-2 border-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="px-4 py-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase() || "S"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "Super Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "super@studex.com"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Confirm Logout
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout from the super admin panel?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SuperAdminSidebar;