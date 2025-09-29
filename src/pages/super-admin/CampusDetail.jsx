import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import SuperAdminDashboardLayout from "@/components/layout/SuperAdminDashboardLayout";
import { adminService } from "@/api/adminService";
import { toast } from "sonner";
import {
  ArrowLeft,
  School,
  MapPin,
  Globe,
  Phone,
  Mail,
  Calendar,
  Users,
  Shield,
  Activity,
  Settings,
  Edit,
  ToggleLeft,
  ToggleRight,
  UserPlus,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";

const CampusDetail = () => {
  const { campusId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch campus data
  const { data: campus, isLoading, error } = useQuery({
    queryKey: ["campus", campusId],
    queryFn: async () => {
      try {
        const response = await adminService.getCampusById(campusId);
        return response;
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn("API call failed, using mock data:", error);

        return {
          id: parseInt(campusId),
          name: "University of Lagos",
          location: "Lagos, Nigeria",
          address: "University Road, Akoka, Yaba, Lagos State, Nigeria",
          description: "The University of Lagos (UNILAG) is a federal government research university located in Lagos, Nigeria. It is one of the first generation universities in Nigeria and is ranked among the top universities in the country.",
          website: "https://www.unilag.edu.ng",
          phone: "+234 1 271 1617",
          email: "info@unilag.edu.ng",
          established_year: 1962,
          campus_type: "federal",
          is_active: true,
          total_users: 15420,
          total_admins: 12,
          total_listings: 1250,
          created_at: "2020-01-15T10:30:00Z",
          updated_at: "2024-01-15T14:22:00Z",
          recent_activity: [
            {
              action: "admin_assigned",
              details: "New admin assigned: John Doe",
              timestamp: "2024-01-20T09:15:00Z"
            },
            {
              action: "user_registered",
              details: "New student registered",
              timestamp: "2024-01-19T16:45:00Z"
            }
          ]
        };
      }
    }
  });

  // Fetch campus admins separately
  const { data: campusAdmins, isLoading: adminsLoading } = useQuery({
    queryKey: ["campusAdmins", campusId],
    queryFn: async () => {
      try {
        const response = await adminService.getCampusAdmins(campusId);
        // Handle both array and paginated response formats
        if (Array.isArray(response)) {
          return response;
        } else if (response.items) {
          return response.items;
        } else if (response.data) {
          return Array.isArray(response.data) ? response.data : response.data.items || [];
        }
        return [];
      } catch (error) {
        console.warn("Failed to fetch campus admins, using empty array:", error);
        return [];
      }
    },
    enabled: !!campusId
  });

  // Mutation for toggling campus status
  const toggleStatusMutation = useMutation({
    mutationFn: (status) => adminService.updateCampusStatus(campusId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["campus", campusId] });
      queryClient.invalidateQueries({ queryKey: ["campusAdmins", campusId] });
      queryClient.invalidateQueries({ queryKey: ["allCampuses"] });
      toast.success(`Campus ${data.is_active ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error) => {
      toast.error(`Failed to update campus status: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleBack = () => {
    navigate("/super-admin/campuses");
  };

  const handleEdit = () => {
    navigate(`/super-admin/campuses/${campusId}/edit`);
  };

  const handleToggleStatus = () => {
    if (!campus) return;

    const newStatus = !campus.is_active;
    const action = newStatus ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${action} this campus?`)) {
      toggleStatusMutation.mutate(newStatus);
    }
  };

  const handleAssignAdmin = () => {
    navigate(`/super-admin/users?campus=${campusId}&action=assign-admin`);
  };

  const handleViewUsers = () => {
    navigate(`/super-admin/users?campus=${campusId}`);
  };

  if (isLoading) {
    return (
      <SuperAdminDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading campus details...</p>
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
            <p className="text-red-600">Error loading campus: {error.message}</p>
          </div>
        </div>
      </SuperAdminDashboardLayout>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: School },
    { id: "admins", label: "Admins", icon: Shield },
    { id: "users", label: "Users", icon: Users },
    { id: "activity", label: "Activity", icon: Activity }
  ];

  return (
    <SuperAdminDashboardLayout>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{campus.name}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{campus.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Edit className="w-4 h-4" />
              Edit Campus
            </button>
            <button
              onClick={handleToggleStatus}
              disabled={toggleStatusMutation.isPending}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                campus.is_active
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              } disabled:opacity-50`}
            >
              {toggleStatusMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : campus.is_active ? (
                <ToggleLeft className="w-4 h-4" />
              ) : (
                <ToggleRight className="w-4 h-4" />
              )}
              {campus.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${campus.is_active ? 'bg-green-100' : 'bg-red-100'}`}>
                {campus.is_active ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold ${campus.is_active ? 'text-green-600' : 'text-red-600'}`}>
                  {campus.is_active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="font-semibold text-blue-600">{campus.total_users?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Campus Admins</p>
                <p className="font-semibold text-purple-600">{campusAdmins?.length || campus.total_admins || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Listings</p>
                <p className="font-semibold text-orange-600">{campus.total_listings?.toLocaleString() || 0}</p>
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
                {/* Basic Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Campus Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{campus.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Type</p>
                        <p className="font-medium capitalize">{campus.campus_type?.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Established</p>
                        <p className="font-medium">{campus.established_year || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{campus.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                    <div className="space-y-3">
                      {campus.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <a href={`mailto:${campus.email}`} className="font-medium text-blue-600 hover:underline">
                              {campus.email}
                            </a>
                          </div>
                        </div>
                      )}
                      {campus.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <a href={`tel:${campus.phone}`} className="font-medium text-blue-600 hover:underline">
                              {campus.phone}
                            </a>
                          </div>
                        </div>
                      )}
                      {campus.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Website</p>
                            <a href={campus.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 hover:underline">
                              {campus.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Address</h3>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{campus.address}</p>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{campus.description}</p>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">{new Date(campus.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-medium">{new Date(campus.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "admins" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Campus Administrators</h3>
                  <button
                    onClick={handleAssignAdmin}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    Assign Admin
                  </button>
                </div>

                {adminsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600">Loading administrators...</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {campusAdmins && campusAdmins.length > 0 ? (
                      campusAdmins.map((admin) => (
                        <div key={admin.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-purple-600 font-medium text-sm">
                                {(admin.first_name || admin.name || 'A').charAt(0)}
                                {(admin.last_name || admin.name || 'A').charAt(1) || (admin.first_name || admin.name || 'A').charAt(1) || 'A'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {admin.first_name && admin.last_name
                                  ? `${admin.first_name} ${admin.last_name}`
                                  : admin.name || 'Unknown Admin'
                                }
                              </p>
                              <p className="text-sm text-gray-600">{admin.email}</p>
                              {admin.assigned_at && (
                                <p className="text-xs text-gray-500">
                                  Assigned on {new Date(admin.assigned_at).toLocaleDateString()}
                                </p>
                              )}
                              {admin.created_at && !admin.assigned_at && (
                                <p className="text-xs text-gray-500">
                                  Joined on {new Date(admin.created_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/super-admin/users/${admin.id}`)}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No administrators assigned to this campus yet.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Campus Users</h3>
                  <button
                    onClick={handleViewUsers}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    View All Users
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Click "View All Users" to see detailed user management for this campus.</p>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <div className="space-y-4">
                  {campus.recent_activity && campus.recent_activity.length > 0 ? (
                    campus.recent_activity.map((activity, index) => (
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
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No recent activity available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default CampusDetail;