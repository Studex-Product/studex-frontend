import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import { adminService } from "@/api/adminService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import Loader from "@/assets/Loader.svg";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Users = () => {
  const navigate = useNavigate();
  const { userRole, user } = useAuth();

  // Check if campus info is available in user context
  console.log("Current user:", user);
  console.log("User role:", userRole);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const limit = 10;

  // Fetch campus users with verification submissions
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "campusUsers",
      currentPage,
      searchTerm,
      statusFilter,
      verifiedFilter,
      user?.campus_id,
    ],
    queryFn: async () => {
      try {
        const params = {
          page: currentPage,
          limit,
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter && { status: statusFilter }),
          ...(verifiedFilter && { verified: verifiedFilter }),
        };

        let response;

        // Use different endpoints based on admin role
        if (userRole === "super_admin") {
          response = await adminService.getAllUsers(params);
        } else {
          // For campus admin, ensure campus_id is available
          if (!user?.campus_id) {
            console.error("Campus admin user missing campus_id:", user);
            throw new Error(
              "Campus information not available. Please contact support."
            );
          }
          params.campus_id = user.campus_id;
          response = await adminService.getCampusUsers(params);
        }

        console.log("Users API response:", response);

        // Handle different response formats
        if (Array.isArray(response)) {
          return { items: response, total: response.length, page: 1, pages: 1 };
        } else if (response.items || response.data) {
          // Handle paginated response
          const items = response.items || response.data;
          const total = response.total || response.count || items.length;
          const pages =
            response.pages || response.total_pages || Math.ceil(total / limit);

          return {
            items: Array.isArray(items) ? items : [],
            total,
            page: response.page || response.current_page || currentPage,
            pages,
          };
        }

        // Fallback for unexpected response format
        console.warn("Unexpected API response format:", response);
        return { items: [], total: 0, page: 1, pages: 1 };
      } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
      }
    },
    enabled: userRole === "super_admin" || !!user?.campus_id,
    retry: (failureCount, error) => {
      // Don't retry if it's a missing campus_id error
      if (error.message?.includes("Campus information not available")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  // Get campus info with fallback
  const { data: campus } = useQuery({
    queryKey: ["myCampus"],
    queryFn: () => adminService.getMyCampus(),
    retry: false,
    onError: (error) => {
      console.warn("Campus info not available:", error);
    },
  });

  // Use fallback if campus data is not available
  const campusInfo = campus || { name: user?.campus_name || "Admin Dashboard" };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    refetch();
  };

  const handleExport = () => {
    toast.info("Export functionality will be implemented soon");
  };

  const handleViewUser = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const users = usersData?.items || [];
  const totalUsers = usersData?.total || 0;
  const totalPages = usersData?.pages || 1;

  if (isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <img
                src={Loader}
                alt="Loading..."
                className="w-12 h-12 mx-auto mb-4"
              />
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 mb-2">⚠️ Error Loading Users</div>
            <p className="text-red-700 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Users</h1>
            <p className="text-gray-600">
              Manage users from {campusInfo?.name || "your campus"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="font-semibold text-blue-600">{totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified Students</p>
                <p className="font-semibold text-green-600">
                  {users.filter((u) => u.student_verified).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <UserX className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unverified Students</p>
                <p className="font-semibold text-orange-600">
                  {users.filter((u) => !u.student_verified).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                <p className="font-semibold text-red-600">
                  {users.filter((u) => !u.is_active).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name, email, or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Search
            </button>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <UsersIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
              {searchTerm && (
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search criteria
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Verification
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-medium text-sm">
                                {user.first_name?.charAt(0)}
                                {user.last_name?.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="font-medium text-gray-900">
                                {user.first_name} {user.last_name}
                              </p>
                              {user.location && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {user.location}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.student_id || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <Mail className="w-3 h-3 mr-1 text-gray-400" />
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              user.student_verified
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {user.student_verified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewUser(user.id)}
                              className="text-blue-600 hover:text-blue-800 hover:scale-[1.5] transition-all duration-200 cursor-pointer"
                              title="View user details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, totalUsers)} of {totalUsers}{" "}
                    users
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default Users;
