import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import { adminService } from "@/api/adminService";
import { toast } from "sonner";
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
  MapPin
} from "lucide-react";

const Users = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [verifiedFilter, setVerifiedFilter] = useState("");
  const limit = 10;

  // Fetch campus users
  const { data: usersData, isLoading, error, refetch } = useQuery({
    queryKey: ["campusUsers", currentPage, searchTerm, statusFilter, verifiedFilter],
    queryFn: async () => {
      try {
        const params = {
          page: currentPage,
          limit,
          ...(searchTerm && { search: searchTerm }),
          ...(statusFilter && { status: statusFilter }),
          ...(verifiedFilter && { verified: verifiedFilter })
        };

        const response = await adminService.getCampusUsers(params);

        // Handle different response formats
        if (Array.isArray(response)) {
          return { items: response, total: response.length, page: 1, pages: 1 };
        } else if (response.items) {
          return response;
        } else if (response.data) {
          return Array.isArray(response.data)
            ? { items: response.data, total: response.data.length, page: 1, pages: 1 }
            : response.data;
        }
        return { items: [], total: 0, page: 1, pages: 1 };
      } catch (error) {
        console.warn("Failed to fetch campus users, using mock data:", error);
        // Fallback mock data for development
        const mockUsers = [
          {
            id: 1,
            first_name: "Adelakun",
            last_name: "Taiwo",
            email: "adelakun.taiwo@unilag.edu.ng",
            student_id: "UNILAG/24/2861",
            location: "Ikeja, Lagos",
            is_active: true,
            student_verified: true,
            created_at: "2024-04-12T00:00:00Z",
            campus_name: "University of Lagos"
          },
          {
            id: 2,
            first_name: "James",
            last_name: "Charles",
            email: "james.charles@unilag.edu.ng",
            student_id: "UNILAG/21/6651",
            location: "VI, Lagos",
            is_active: true,
            student_verified: false,
            created_at: "2024-06-12T00:00:00Z",
            campus_name: "University of Lagos"
          },
          {
            id: 3,
            first_name: "Kathryn",
            last_name: "Bernado",
            email: "kathryn.bernado@unilag.edu.ng",
            student_id: "UNILAG/23/1281",
            location: "Ife, Osun",
            is_active: false,
            student_verified: true,
            created_at: "2024-07-12T00:00:00Z",
            campus_name: "University of Lagos"
          }
        ];

        const filteredUsers = mockUsers.filter(user => {
          const matchesSearch = !searchTerm ||
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.student_id.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus = !statusFilter ||
            (statusFilter === 'active' && user.is_active) ||
            (statusFilter === 'inactive' && !user.is_active);

          const matchesVerified = !verifiedFilter ||
            (verifiedFilter === 'verified' && user.student_verified) ||
            (verifiedFilter === 'unverified' && !user.student_verified);

          return matchesSearch && matchesStatus && matchesVerified;
        });

        return {
          items: filteredUsers,
          total: filteredUsers.length,
          page: currentPage,
          pages: Math.ceil(filteredUsers.length / limit)
        };
      }
    }
  });

  // Get campus info
  const { data: campus } = useQuery({
    queryKey: ["myCampus"],
    queryFn: async () => {
      try {
        const response = await adminService.getMyCampus();
        return response;
      } catch (error) {
        console.warn("Failed to fetch campus info:", error);
        return {
          id: 1,
          name: "University of Lagos",
          location: "Lagos, Nigeria",
          total_users: usersData?.total || 0
        };
      }
    }
  });

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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
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
              Manage users from {campus?.name || "your campus"}
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
                  {users.filter(u => u.student_verified).length}
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
                  {users.filter(u => !u.student_verified).length}
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
                  {users.filter(u => !u.is_active).length}
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
                                {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
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
                          {user.student_id || 'N/A'}
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
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            user.student_verified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.student_verified ? 'Verified' : 'Pending'}
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
                              className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
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
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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