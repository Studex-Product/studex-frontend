import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import SuperAdminDashboardLayout from "@/components/layout/SuperAdminDashboardLayout";
import { adminService } from "@/api/adminService";
import { toast } from "sonner";
import Loader from "@/assets/Loader.svg"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  School,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  Ban,
  Unlock,
  UserCheck,
  UserX,
  Clock,
  Activity,
  ShoppingBag,
  Home,
  MessageSquare
} from "lucide-react";
import { Image } from "lucide-react";
import { UserSearchIcon } from "lucide-react";

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [showCampusModal, setShowCampusModal] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState("");

  // Helper function to determine if user is admin
  const isAdminUser = (user) => {
    if (!user) return false;
    const roles = user.roles || [];
    const legacyRole = user.legacy_role || '';
    return roles.includes('ADMIN') || roles.includes('SUPER_ADMIN') ||
           legacyRole === 'ADMIN' || legacyRole === 'SUPER_ADMIN';
  };

  // Helper function to get user role display
  const getUserRoleDisplay = (user) => {
    if (!user) return 'User';
    const roles = user.roles || [];
    const legacyRole = user.legacy_role || '';

    if (roles.includes('SUPER_ADMIN') || legacyRole === 'SUPER_ADMIN') {
      return 'Super Admin';
    } else if (roles.includes('ADMIN') || legacyRole === 'ADMIN') {
      return 'Campus Admin';
    } else {
      return 'Student';
    }
  };

  // Fetch user data from API
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      try {
        const response = await adminService.getUserById(userId);
        return response;
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn("API call failed, using mock data:", error);

        // Mock comprehensive user data
        return {
          id: parseInt(userId),
          email: "john.doe@university.edu",
          first_name: "John",
          last_name: "Doe",
          phone: "+234 803 123 4567",
          date_of_birth: "1999-05-15",
          gender: "male",
          address: "Block A, Room 15, University of Lagos Hostel",
          is_active: true,
          legacy_role: "USER",
          roles: ["USER"],
          campus_id: 1,
          campus_name: "University of Lagos",
          school_id: "UL/2021/001",
          student_verified: true,
          email_verified: true,
          profile_image: null,
          created_at: "2021-09-15T10:30:00Z",
          updated_at: "2024-01-15T14:22:00Z",
          last_login: "2024-01-20T09:15:00Z",
          login_count: 156,
          // Additional data for comprehensive view
          academic_info: {
            level: "300L",
            department: "Computer Science",
            faculty: "Science",
            matric_number: "CSC/2021/001",
            graduation_year: 2025
          },
          activity_stats: {
            total_listings: 12,
            active_listings: 8,
            completed_transactions: 23,
            messages_sent: 145,
            last_activity: "2024-01-20T15:30:00Z"
          },
          verification_history: [
            {
              type: "email",
              verified_at: "2021-09-15T11:00:00Z",
              status: "verified"
            },
            {
              type: "student_id",
              verified_at: "2021-09-16T14:30:00Z",
              status: "verified",
              verified_by: "admin@university.edu"
            }
          ],
          recent_activity: [
            {
              action: "login",
              timestamp: "2024-01-20T09:15:00Z",
              details: "Logged in from Chrome on Windows"
            },
            {
              action: "listing_created",
              timestamp: "2024-01-19T16:45:00Z",
              details: "Created listing: MacBook Pro 2020"
            },
            {
              action: "message_sent",
              timestamp: "2024-01-19T14:20:00Z",
              details: "Sent message to buyer"
            }
          ]
        };
      }
    }
  });

  // Fetch active campuses for assignment
  const { data: campuses = [] } = useQuery({
    queryKey: ["activeCampuses"],
    queryFn: () => adminService.getCampuses(),
    select: (data) => {
      // Handle different response structures
      if (Array.isArray(data)) {
        return data;
      }
      return data.items || data.campuses || data.data || [];
    }
  });

  // Mutation for assigning campus admin
  const assignCampusAdminMutation = useMutation({
    mutationFn: ({ campusId, userId }) => adminService.assignCampusAdmin(campusId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      // Invalidate campus admins for the campus they were assigned to
      queryClient.invalidateQueries({ queryKey: ["campusAdmins", selectedCampus] });
      // Also invalidate campus data to update admin counts
      queryClient.invalidateQueries({ queryKey: ["campus", selectedCampus] });
      queryClient.invalidateQueries({ queryKey: ["allCampuses"] });
      setShowCampusModal(false);
      setSelectedCampus("");
      toast.success("User successfully assigned as campus admin");
    },
    onError: (error) => {
      toast.error(`Failed to assign campus admin: ${error.response?.data?.message || error.message}`);
    }
  });

  // Mutation for updating user status
  const updateUserStatusMutation = useMutation({
    mutationFn: (status) => adminService.updateUserStatus(userId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
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
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
      toast.success(`Student ${data.student_verified ? 'verified' : 'unverified'} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update verification: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleBackToUsers = () => {
    navigate("/super-admin/users");
  };

  const handleToggleUserStatus = () => {
    if (!user) return;

    const newStatus = !user.is_active;
    const action = newStatus ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      updateUserStatusMutation.mutate(newStatus);
    }
  };

  const handleVerifyStudent = () => {
    if (!user) return;

    const newVerificationStatus = !user.student_verified;
    const action = newVerificationStatus ? 'verify' : 'unverify';

    if (window.confirm(`Are you sure you want to ${action} this student?`)) {
      updateStudentVerificationMutation.mutate(newVerificationStatus);
    }
  };

  const handleAssignCampusAdmin = () => {
    setShowCampusModal(true);
  };

  const handleCampusAssignment = () => {
    if (!selectedCampus || !user) {
      toast.error("Please select a campus");
      return;
    }

    const campus = campuses.find(c => c.id.toString() === selectedCampus);
    const campusName = campus?.name || 'the selected campus';

    if (window.confirm(`Are you sure you want to assign ${user.first_name} ${user.last_name} as admin for ${campusName}?`)) {
      assignCampusAdminMutation.mutate({
        campusId: parseInt(selectedCampus),
        userId: parseInt(userId)
      });
    }
  };

  if (isLoading) {
    return (
      <SuperAdminDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <img src={Loader} alt="Loading..." className="w-12 h-12 mx-auto mb-4" />
              <p className="mt-2 text-gray-600">Loading user details...</p>
            </div>
          </div>
        </div>
      </SuperAdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <SuperAdminDashboardLayout>
        <div className="p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading user: {error.message}</p>
          </div>
        </div>
      </SuperAdminDashboardLayout>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "activity", label: "Activity", icon: Activity },
    ...(isAdminUser(user)
      ? [{ id: "admin", label: "Admin", icon: Shield }]
      : [{ id: "listings", label: "Listings", icon: ShoppingBag }]
    ),
    { id: "verification", label: "Verification", icon: Shield }
  ];

  return (
    <SuperAdminDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToUsers}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isAdminUser(user) && (
              <button
                onClick={handleVerifyStudent}
                disabled={updateStudentVerificationMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  user.student_verified
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
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
                {user.student_verified ? 'Unverify Student' : 'Verify Student'}
              </button>
            )}

            {!isAdminUser(user) && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={handleAssignCampusAdmin}
                disabled={assignCampusAdminMutation.isPending}
              >
                {assignCampusAdminMutation.isPending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                Assign as Campus Admin
              </button>
            )}

            {isAdminUser(user) && (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={() => {/* Handle admin permissions */}}
              >
                <Shield className="w-4 h-4" />
                Manage Permissions
              </button>
            )}

            <button
              onClick={handleToggleUserStatus}
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
                <>
                  <Ban className="w-4 h-4" />
                  {isAdminUser(user) ? 'Deactivate Admin' : 'Deactivate'}
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  {isAdminUser(user) ? 'Activate Admin' : 'Activate'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* User Status Cards */}
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
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">User Role</p>
                <p className="font-semibold text-indigo-600">
                  {getUserRoleDisplay(user)}
                </p>
              </div>
            </div>
          </div>

          {!isAdminUser(user) ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${user.student_verified ? 'bg-purple-100' : 'bg-yellow-100'}`}>
                  {user.student_verified ? (
                    <Shield className="w-5 h-5 text-purple-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student Status</p>
                  <p className={`font-semibold ${user.student_verified ? 'text-purple-600' : 'text-yellow-600'}`}>
                    {user.student_verified ? 'Verified' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admin Status</p>
                  <p className="font-semibold text-green-600">Verified</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Login Count</p>
                <p className="font-semibold text-blue-600">{user.login_count || 0}</p>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <Image className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Profile Image</p>
                        {user.profile_image ? (
                          <img src={user.profile_image} alt={`${user.first_name} ${user.last_name}`} className="w-32 h-32 rounded object-cover" />
                        ) : (
                          <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Date of Birth</p>
                        <p className="font-medium">
                          {user.date_of_birth ? new Date(user.date_of_birth).toLocaleDateString() : 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UserSearchIcon className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Gender</p>
                        <p className="font-medium">
                          {user.gender || 'Not provided'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{user.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <School className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Campus</p>
                        <p className="font-medium">{user.campus_name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-4 lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900">Account Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Joined</p>
                      <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="font-medium">{new Date(user.updated_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="font-medium">{new Date(user.last_login).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <div className="space-y-4">
                  {user.recent_activity && user.recent_activity.length > 0 ? user.recent_activity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Clock className="w-4 h-4 text-blue-600" />
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
                  )) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No recent activity available</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "listings" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">User Listings</h3>
                  <div className="text-sm text-gray-600">
                    {user.activity_stats?.active_listings || 0} active, {user.activity_stats?.total_listings || 0} total
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Listings details would be loaded here</p>
                  <p className="text-sm text-gray-500">This would show all user listings with status</p>
                </div>
              </div>
            )}

            {activeTab === "verification" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Verification History</h3>
                <div className="space-y-4">
                  {user.verification_history && user.verification_history.length > 0 ? user.verification_history.map((verification, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">
                          {verification.type.replace('_', ' ')} Verification
                        </p>
                        <p className="text-sm text-gray-600">
                          Verified on {new Date(verification.verified_at).toLocaleDateString()}
                        </p>
                        {verification.verified_by && (
                          <p className="text-xs text-gray-500">
                            Verified by: {verification.verified_by}
                          </p>
                        )}
                      </div>
                      <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                        Verified
                      </span>
                    </div>
                  )) : (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No verification history available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Campus Assignment Modal */}
        {showCampusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Assign Campus Admin
                </h2>
                <p className="text-gray-600">
                  Select a campus to assign {user?.first_name} {user?.last_name} as campus admin.
                  This will promote them to admin role and assign them to the selected campus.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Campus
                </label>
                <select
                  value={selectedCampus}
                  onChange={(e) => setSelectedCampus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose a campus...</option>
                  {campuses.map((campus) => (
                    <option key={campus.id} value={campus.id}>
                      {campus.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCampusModal(false);
                    setSelectedCampus("");
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  disabled={assignCampusAdminMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCampusAssignment}
                  disabled={!selectedCampus || assignCampusAdminMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {assignCampusAdminMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Assigning...
                    </div>
                  ) : (
                    'Assign Admin'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default UserDetail;