import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { adminService } from "@/api/adminService";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import { toast } from "sonner";
import Loader from "@/assets/Loader.svg";
import {
  Eye,
  Check,
  X,
  Clock,
  Filter,
  Download,
  Search,
  ChevronDown,
  ShoppingBag,
  Calendar,
  ExternalLink,
  Package,
  Home,
  DollarSign,
  Tag,
} from "lucide-react";

const Market = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    campus_id: "",
    category: "",
    type: "",
  });
  const [selectedListings, setSelectedListings] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Fetch listings
  const { data: listings, isLoading } = useQuery({
    queryKey: ["admin-listings", currentPage, filters],
    queryFn: () =>
      adminService.getAllListings({
        page: currentPage,
        limit: 10,
        ...filters,
      }),
  });

  // Fetch listing stats
  const { data: stats } = useQuery({
    queryKey: ["listing-stats"],
    queryFn: () => adminService.getListingStats(),
  });

  // Fetch campuses for filter
  const { data: campusesData } = useQuery({
    queryKey: ["campuses"],
    queryFn: () => adminService.getCampuses(),
  });

  // Ensure campuses is always an array
  const campuses = Array.isArray(campusesData)
    ? campusesData
    : campusesData?.data && Array.isArray(campusesData.data)
    ? campusesData.data
    : campusesData?.items && Array.isArray(campusesData.items)
    ? campusesData.items
    : [];

  // Review listing mutation
  const reviewMutation = useMutation({
    mutationFn: ({ listingId, status, review_note }) =>
      adminService.reviewListing(listingId, status, review_note),
    onSuccess: (data, variables) => {
      const actionText =
        variables.status === "approved" ? "approved" : "rejected";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Listing {actionText} successfully!
        </div>
      ));
      queryClient.invalidateQueries(["admin-listings"]);
      queryClient.invalidateQueries(["listing-stats"]);
    },
    onError: (error) => {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          Failed to process listing:{" "}
          {error.response?.data?.message || error.message}
        </div>
      ));
    },
  });

  // Bulk review mutation
  const bulkReviewMutation = useMutation({
    mutationFn: ({ listingIds, status, review_note }) =>
      adminService.bulkReviewListings(listingIds, status, review_note),
    onSuccess: (data, variables) => {
      const actionText =
        variables.status === "approved" ? "approved" : "rejected";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          {variables.listingIds.length} listings {actionText} successfully!
        </div>
      ));
      queryClient.invalidateQueries(["admin-listings"]);
      queryClient.invalidateQueries(["listing-stats"]);
      setSelectedListings([]);
      setShowBulkActions(false);
    },
  });

  const handleSingleReview = (listingId, action) => {
    const review_note =
      action === "reject"
        ? prompt("Please provide a reason for rejection:")
        : "";
    if (action === "reject" && !review_note) return;

    const status = action === "approve" ? "approved" : "rejected";
    reviewMutation.mutate({ listingId, status, review_note });
  };

  const handleBulkReview = (action) => {
    const review_note =
      action === "reject"
        ? prompt("Please provide a reason for rejection:")
        : "";
    if (action === "reject" && !review_note) return;

    const status = action === "approve" ? "approved" : "rejected";
    bulkReviewMutation.mutate({
      listingIds: selectedListings,
      status,
      review_note,
    });
  };

  const handleViewDetails = (listingId) => {
    navigate(`/admin/market/${listingId}`);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = listings?.items?.map((l) => l.id) || [];
      setSelectedListings(allIds);
    } else {
      setSelectedListings([]);
    }
  };

  const handleSelectListing = (id, checked) => {
    if (checked) {
      setSelectedListings((prev) => [...prev, id]);
    } else {
      setSelectedListings((prev) => prev.filter((lId) => lId !== id));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { color: "bg-green-100 text-green-800", icon: Check },
      rejected: { color: "bg-red-100 text-red-800", icon: X },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.color}`}
      >
        <Icon size={12} className="mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === "room" ? (
      <Home size={14} className="text-blue-600" />
    ) : (
      <Package size={14} className="text-green-600" />
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Market Listings
            </h1>
            <p className="text-gray-600 mt-1">
              Review and approve user listing submissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={16} />
              Export
            </button>
            {selectedListings.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Bulk Actions ({selectedListings.length})
                  <ChevronDown size={16} />
                </button>
                {showBulkActions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <button
                      onClick={() => handleBulkReview("approve")}
                      className="w-full px-4 py-2 text-left text-green-600 hover:bg-green-50 flex items-center gap-2"
                    >
                      <Check size={16} />
                      Approve All
                    </button>
                    <button
                      onClick={() => handleBulkReview("reject")}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <X size={16} />
                      Reject All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending || 0}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock size={20} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.approved || 0}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Check size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.rejected || 0}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <X size={20} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Items</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.items || 0}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rooms</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.rooms || 0}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Home size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by item name or description..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Types</option>
            <option value="item">Items</option>
            <option value="room">Rooms</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, category: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="books">Books</option>
            <option value="clothing">Clothing</option>
            <option value="furniture">Furniture</option>
            <option value="sports">Sports</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filters.campus_id}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, campus_id: e.target.value }))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">All Campuses</option>
            {campuses.map((campus) => (
              <option key={campus.id} value={campus.id}>
                {campus.name}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              setFilters({
                status: "",
                search: "",
                campus_id: "",
                category: "",
                type: "",
              })
            }
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    checked={
                      selectedListings.length === listings?.items?.length &&
                      listings?.items?.length > 0
                    }
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Listing
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <img
                      src={Loader}
                      alt="Loading..."
                      className="w-12 h-12 mx-auto mb-4"
                    />
                    Loading listings...
                  </td>
                </tr>
              ) : listings?.items?.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No listings found
                  </td>
                </tr>
              ) : (
                listings?.items?.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedListings.includes(listing.id)}
                        onChange={(e) =>
                          handleSelectListing(listing.id, e.target.checked)
                        }
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {listing.images?.[0] ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.item_name || listing.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <ShoppingBag
                                size={20}
                                className="text-gray-400"
                              />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {listing.item_name || listing.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Tag size={12} />
                              {listing.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {listing.seller_name?.split(" ")[0]?.[0]}
                              {listing.seller_name?.split(" ")[1]?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {listing.seller_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {listing.seller_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(listing.type)}
                        <span className="text-sm text-gray-900 capitalize">
                          {listing.type || "Item"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <DollarSign size={14} />
                        {formatPrice(listing.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(listing.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {listing.created_at
                          ? formatDate(listing.created_at)
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(listing.id)}
                          className="cursor-pointer hover:scale-[1.5] transition-all duration-200 text-purple-600 hover:text-purple-800"
                          title="View Details"
                        >
                          <ExternalLink size={16} />
                        </button>
                        {listing.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleSingleReview(listing.id, "approve")
                              }
                              disabled={reviewMutation.isPending}
                              className="cursor-pointer hover:scale-[1.5] transition-all duration-200 text-green-600 hover:text-green-800 disabled:opacity-50"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleSingleReview(listing.id, "reject")
                              }
                              disabled={reviewMutation.isPending}
                              className="cursor-pointer hover:scale-[1.5] transition-all duration-200 text-red-600 hover:text-red-800 disabled:opacity-50"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {listings?.total > 10 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(listings.offset || 0) + 1} to{" "}
              {Math.min(
                (listings.offset || 0) + (listings.limit || 10),
                listings.total
              )}{" "}
              of {listings.total} results
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {currentPage} of{" "}
                {Math.ceil(listings.total / (listings.limit || 10))}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      Math.ceil(listings.total / (listings.limit || 10)),
                      prev + 1
                    )
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(listings.total / (listings.limit || 10))
                }
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default Market;
