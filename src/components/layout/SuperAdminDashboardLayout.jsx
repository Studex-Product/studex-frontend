import React from "react";
import SuperAdminSidebar from "./SuperAdminSidebar";
import { useAuthContext } from "@/hooks/useAuthContext";
import { Bell, Download, Search, Globe } from "lucide-react";

const SuperAdminDashboardLayout = ({ children }) => {
  const { user } = useAuthContext();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SuperAdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Welcome message */}
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome Back, {user?.name?.split(' ')[0] || 'Super Admin'}!
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage the entire StudEx platform from here
              </p>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search platform..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>

              {/* Platform Status */}
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">Platform Online</span>
              </div>

              {/* System Export */}
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200">
                <Download className="w-4 h-4" />
                <span className="text-sm font-medium">Export System Data</span>
              </button>

              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Global Settings */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Globe className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboardLayout;