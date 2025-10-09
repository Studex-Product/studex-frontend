import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/hooks/useAuthContext";
import Logo from "@/components/common/Logo";
import LogoutConfirmationModal from "@/components/ui/LogoutConfirmationModal";
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
  Plus,
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
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from the super admin panel?"
      />
    </>
  );
};

export default SuperAdminSidebar;
