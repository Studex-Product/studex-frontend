import React from "react";
import { useNavigate } from "react-router-dom";
import SuperAdminDashboardLayout from "@/components/layout/SuperAdminDashboardLayout";
import {
  Users,
  ShoppingBag,
  Home,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe
} from "lucide-react";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();

  // Mock data - in real app, this would come from API
  const systemStats = [
    {
      title: "Total Users",
      value: "12,547",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Admins",
      value: "23",
      change: "+2",
      trend: "up",
      icon: Shield,
      color: "purple",
    },
    {
      title: "Total Listings",
      value: "3,891",
      change: "+12.5%",
      trend: "up",
      icon: ShoppingBag,
      color: "green",
    },
    {
      title: "Revenue (Monthly)",
      value: "₦2.4M",
      change: "-3.1%",
      trend: "down",
      icon: DollarSign,
      color: "orange",
    },
    {
      title: "Platform Uptime",
      value: "99.9%",
      change: "Excellent",
      trend: "up",
      icon: Activity,
      color: "emerald",
    },
    {
      title: "Global Reach",
      value: "156",
      change: "Countries",
      trend: "up",
      icon: Globe,
      color: "indigo",
    },
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "warning",
      title: "High Server Load",
      message: "Server load is at 85% - consider scaling",
      time: "2 minutes ago",
    },
    {
      id: 2,
      type: "info",
      title: "New Admin Added",
      message: "John Doe has been granted admin privileges",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "success",
      title: "System Backup Complete",
      message: "Daily backup completed successfully",
      time: "3 hours ago",
    },
    {
      id: 4,
      type: "error",
      title: "Failed Login Attempts",
      message: "Multiple failed login attempts from IP 192.168.1.100",
      time: "6 hours ago",
    },
  ];

  const platformMetrics = [
    { label: "Daily Active Users", value: "8,547", change: "+5.2%" },
    { label: "New Registrations", value: "234", change: "+12.8%" },
    { label: "Completed Transactions", value: "1,287", change: "+8.9%" },
    { label: "Support Tickets", value: "45", change: "-15.2%" },
    { label: "Content Reports", value: "12", change: "+2.1%" },
    { label: "System Errors", value: "3", change: "-67.8%" },
  ];

  const topUniversities = [
    { name: "University of Lagos", users: 2847, growth: "+12.5%" },
    { name: "University of Ibadan", users: 2156, growth: "+8.9%" },
    { name: "Obafemi Awolowo University", users: 1998, growth: "+15.2%" },
    { name: "Federal University of Technology", users: 1654, growth: "+6.7%" },
    { name: "University of Nigeria", users: 1432, growth: "+11.3%" },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "info":
      default:
        return <Clock className="w-4 h-4 text-blue-600" />;
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "success":
        return "bg-green-50 border-green-200";
      case "info":
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <SuperAdminDashboardLayout>
      <div className="p-6 space-y-6">
        {/* System Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {systemStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                    <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-xs mt-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* System Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${getAlertBgColor(alert.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Metrics */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Platform Metrics</h3>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Details
              </button>
            </div>
            <div className="space-y-4">
              {platformMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{metric.label}</p>
                    <p className="text-xs text-gray-600">{metric.change}</p>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Universities */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Universities</h3>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {topUniversities.map((university, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                        {university.name}
                      </p>
                      <p className="text-xs text-green-600">{university.growth}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {university.users.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "Manage Users", path: "/super-admin/users", color: "blue" },
              { name: "Manage Campuses", path: "/super-admin/campuses", color: "green" },
              { name: "System Settings", path: "/super-admin/settings", color: "purple" },
              { name: "Platform Health", path: "/super-admin/health", color: "orange" },
              { name: "Content Review", path: "/super-admin/moderation", color: "red" },
              { name: "Analytics", path: "/super-admin/analytics", color: "indigo" },
            ].map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`p-4 rounded-lg border-2 border-${action.color}-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-colors duration-200 text-center group`}
              >
                <p className={`text-sm font-medium text-${action.color}-700 group-hover:text-${action.color}-800`}>
                  {action.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default SuperAdminDashboard;