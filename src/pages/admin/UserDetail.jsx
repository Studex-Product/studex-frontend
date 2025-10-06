import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import { adminService } from "@/api/adminService";
import { toast } from "sonner";
import Loader from "@/assets/Loader.svg";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Activity,
  School,
  ToggleLeft,
  ToggleRight,
  UserCheck,
  UserX
} from "lucide-react";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user data
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        const response = await adminService.getUserById(userId);
        return response;
      } catch (error) {
        console.warn("API call failed, using mock data:", error);

        // Fallback mock data
        return {
          id: parseInt(userId),
          first_name: "Adelakun",
          last_name: "Taiwo",
          email: "adelakun.taiwo@unilag.edu.ng",
          phone: "+234 801 234 5678",
          student_id: "UNILAG/24/2861",
          location: "Ikeja, Lagos",
          is_active: true,
          student_verified: true,
          email_verified: true,
          created_at: "2024-04-12T10:30:00Z",
          updated_at: "2024-12-01T14:22:00Z",
          campus_id: 1,
          campus_name: "University of Lagos",
          role: "user",
          profile_picture: null,
          date_of_birth: "2000-05-15",
          gender: "male",
          department: "Computer Science",
          level: "300",
          activity_stats: {
            total_listings: 5,
            active_listings: 3,
            total_purchases: 12,
            total_sales: 8,
            last_login: "2024-12-01T09:15:00Z"
          },
          recent_activity: [
            {
              action: "listing_created",
              details: "Created new listing: MacBook Pro 2022",
              timestamp: "2024-12-01T14:30:00Z"
            },
            {
              action: "purchase_completed",
              details: "Purchased: Study Table",
              timestamp: "2024-11-30T16:45:00Z"
            }
          ]
        };
      }
    }
  });

  // Mutation for updating user status
  const updateUserStatusMutation = useMutation({
    mutationFn: (status) => adminService.updateUserStatus(userId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["campusUsers"] });
      toast.success(`User ${data.is_active ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update user status: ${error.response?.data?.message || error.message}`);
    }
  });

  // Mutation for updating student verification
  const updateStudentVerificationMutation = useMutation({
    mutationFn: (verified) => adminService.updateStudentVerification(userId, verified),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["campusUsers"] });
      toast.success(`Student ${data.student_verified ? 'verified' : 'unverified'} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update verification: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleBack = () => {
    navigate("/admin/users");
  };

  const handleToggleStatus = () => {
    if (!user) return;

    const newStatus = !user.is_active;
    const action = newStatus ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      updateUserStatusMutation.mutate(newStatus);
    }
  };

  const handleToggleVerification = () => {
    if (!user) return;

    const newVerification = !user.student_verified;
    const action = newVerification ? 'verify' : 'unverify';

    if (window.confirm(`Are you sure you want to ${action} this student?`)) {
      updateStudentVerificationMutation.mutate(newVerification);
    }
  };

  if (isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <img src={Loader} alt="Loading..." className="w-12 h-12 mx-auto mb-4" />
              <p className="mt-2 text-gray-600">Loading user details...</p>
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading user: {error.message}</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "activity", label: "Activity", icon: Activity },
    { id: "listings", label: "Listings", icon: Settings }
  ];

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-medium text-lg">
                  {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <School className="w-4 h-4" />
                    {user.student_id}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleVerification}
              disabled={updateStudentVerificationMutation.isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                user.student_verified
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } disabled:opacity-50`}
            >
              {updateStudentVerificationMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : user.student_verified ? (
                <UserX className="w-4 h-4" />
              ) : (
                <UserCheck className="w-4 h-4" />
              )}
              {user.student_verified ? 'Unverify' : 'Verify'} Student
            </button>
            <button
              onClick={handleToggleStatus}
              disabled={updateUserStatusMutation.isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                user.is_active
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } disabled:opacity-50`}
            >
              {updateUserStatusMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : user.is_active ? (
                <ToggleLeft className="w-4 h-4" />
              ) : (
                <ToggleRight className="w-4 h-4" />
              )}
              {user.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${user.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                {user.is_active ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className={`font-semibold ${user.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${user.student_verified ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {user.student_verified ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Student Verification</p>
                <p className={`font-semibold ${user.student_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.student_verified ? 'Verified' : 'Pending'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="font-semibold text-blue-600">{user.activity_stats?.total_listings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-semibold text-purple-600">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                      </div>
                      {/* <div>
                        <p className="text-sm text-gray-600">Student ID</p>
                        <p className="font-medium">{user.student_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Department</p>
                        <p className="font-medium">{user.department || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Level</p>
                        <p className="font-medium">{user.level || 'Not specified'}</p>
                      </div> */}
                      <div>
                        <p className="text-sm text-gray-600">Campus</p>
                        <p className="font-medium">{user.campus_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium">{user.email}</p>
                        </div>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium">{user.phone}</p>
                          </div>
                        </div>
                      )}
                      {user.location && (
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-medium">{user.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Account Created</p>
                    <p className="font-medium">{new Date(user.created_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{new Date(user.updated_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <div className="space-y-4">
                  {user.recent_activity && user.recent_activity.length > 0 ? (
                    user.recent_activity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Activity className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 capitalize">
                            {activity.action.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-600">{activity.details}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-600">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "listings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">User Listings</h3>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Listings management will be implemented here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Total Listings: {user.activity_stats?.total_listings || 0} |
                    Active: {user.activity_stats?.active_listings || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default UserDetail;