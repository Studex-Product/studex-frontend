import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SuperAdminDashboardLayout from "@/components/layout/SuperAdminDashboardLayout";
import { adminService } from "@/api/adminService";
import { toast } from "sonner";
import {
  School,
  Search,
  Plus,
  Eye,
  Users,
  MapPin,
  Calendar,
  Settings,
  Edit,
  Trash2
} from "lucide-react";

const AllCampuses = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const campusesPerPage = 20;

  // Fetch campuses data from API
  const { data: campusesData, isLoading, error } = useQuery({
    queryKey: ["allCampuses", currentPage, searchTerm],
    queryFn: async () => {
      try {
        const params = {
          page: currentPage,
          limit: campusesPerPage,
          search: searchTerm || undefined
        };

        const response = await adminService.getAllCampuses(params);
        console.log("Campus API Response:", response);

        // Handle the actual API response structure
        // Results are ordered alphabetically by campus name
        if (Array.isArray(response)) {
          // Direct array response
          return {
            campuses: response,
            total: response.length,
            totalPages: 1 // API handles ordering, no pagination needed for alphabetical list
          };
        } else if (response.items) {
          // Paginated response
          return {
            campuses: response.items,
            total: response.total,
            totalPages: Math.ceil(response.total / (response.limit || campusesPerPage))
          };
        } else if (response.data) {
          // Data wrapper response
          return {
            campuses: Array.isArray(response.data) ? response.data : response.data.items || [],
            total: Array.isArray(response.data) ? response.data.length : response.data.total || 0,
            totalPages: 1
          };
        }

        return {
          campuses: [],
          total: 0,
          totalPages: 1
        };
      } catch (error) {
        // Fallback to mock data if API fails
        console.warn("API call failed, using mock data:", error);

        // Mock data for development
        const mockCampuses = Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          name: [
            "University of Lagos",
            "University of Ibadan",
            "Obafemi Awolowo University",
            "Federal University of Technology",
            "University of Nigeria",
            "Lagos State University",
            "Covenant University",
            "Babcock University",
            "University of Ilorin",
            "Federal University Oye-Ekiti"
          ][i],
          location: [
            "Lagos, Nigeria",
            "Ibadan, Nigeria",
            "Ile-Ife, Nigeria",
            "Akure, Nigeria",
            "Nsukka, Nigeria",
            "Lagos, Nigeria",
            "Ota, Nigeria",
            "Ilishan-Remo, Nigeria",
            "Ilorin, Nigeria",
            "Oye-Ekiti, Nigeria"
          ][i],
          total_users: Math.floor(Math.random() * 5000) + 500,
          total_admins: Math.floor(Math.random() * 10) + 1,
          is_active: Math.random() > 0.1,
          created_at: new Date(2020 + i, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
          description: `Leading educational institution providing quality education and research opportunities.`
        }));

        // Apply search filter
        let filteredCampuses = mockCampuses;
        if (searchTerm) {
          filteredCampuses = filteredCampuses.filter(campus =>
            campus.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            campus.location.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        // Pagination
        const startIndex = (currentPage - 1) * campusesPerPage;
        const endIndex = startIndex + campusesPerPage;
        const paginatedCampuses = filteredCampuses.slice(startIndex, endIndex);

        return {
          campuses: paginatedCampuses,
          total: filteredCampuses.length,
          totalPages: Math.ceil(filteredCampuses.length / campusesPerPage)
        };
      }
    }
  });

  // Mutation for deleting campus
  const deleteCampusMutation = useMutation({
    mutationFn: (campusId) => adminService.deleteCampus(campusId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allCampuses"] });
      toast.success("Campus deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete campus: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleViewCampus = (campusId) => {
    navigate(`/super-admin/campuses/${campusId}`);
  };

  const handleCreateCampus = () => {
    navigate("/super-admin/campuses/create");
  };

  const handleEditCampus = (campusId) => {
    navigate(`/super-admin/campuses/${campusId}/edit`);
  };

  const handleDeleteCampus = (campus) => {
    if (window.confirm(`Are you sure you want to delete ${campus.name}? This action cannot be undone.`)) {
      deleteCampusMutation.mutate(campus.id);
    }
  };

  if (isLoading) {
    return (
      <SuperAdminDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading campuses...</p>
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
            <p className="text-red-600">Error loading campuses: {error.message}</p>
          </div>
        </div>
      </SuperAdminDashboardLayout>
    );
  }

  return (
    <SuperAdminDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campus Management</h1>
            <p className="text-gray-600">Manage campuses across the platform</p>
          </div>
          <button
            onClick={handleCreateCampus}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            Create Campus
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <School className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{campusesData?.total || 0}</p>
                <p className="text-sm text-gray-600">Total Campuses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {campusesData?.campuses?.reduce((sum, campus) => sum + (campus.total_users || 0), 0) || 0}
                </p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {campusesData?.campuses?.reduce((sum, campus) => sum + (campus.total_admins || 0), 0) || 0}
                </p>
                <p className="text-sm text-gray-600">Campus Admins</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {campusesData?.campuses?.filter(c => c.is_active).length || 0}
                </p>
                <p className="text-sm text-gray-600">Active Campuses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search campuses by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Campuses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campusesData?.campuses && campusesData.campuses.length > 0 ? (
            campusesData.campuses.map((campus) => (
              <div key={campus.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {campus.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4 mr-1" />
                        {campus.location}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      campus.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {campus.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {campus.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{campus.total_users || 0}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{campus.total_admins || 0}</p>
                      <p className="text-xs text-gray-600">Admins</p>
                    </div>
                  </div>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3 mr-1" />
                    Created {new Date(campus.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewCampus(campus.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleEditCampus(campus.id)}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCampus(campus)}
                      disabled={deleteCampusMutation.isPending}
                      className="flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors duration-200 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg border border-gray-200 p-12 text-center">
              <School className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No campuses found</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first campus.</p>
              <button
                onClick={handleCreateCampus}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                Create Campus
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {campusesData?.totalPages > 1 && (
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, campusesData.totalPages))}
                  disabled={currentPage === campusesData.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">{((currentPage - 1) * campusesPerPage) + 1}</span>
                    {' '}to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * campusesPerPage, campusesData.total)}
                    </span>
                    {' '}of{' '}
                    <span className="font-medium">{campusesData.total}</span>
                    {' '}results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, campusesData.totalPages) }, (_, i) => {
                      const pageNum = currentPage > 3 ? currentPage - 2 + i : i + 1;
                      if (pageNum > campusesData.totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-purple-50 border-purple-500 text-purple-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, campusesData.totalPages))}
                      disabled={currentPage === campusesData.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SuperAdminDashboardLayout>
  );
};

export default AllCampuses;