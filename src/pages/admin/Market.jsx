import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { adminService } from "@/api/adminService";
import { listingService } from "@/api/listingService";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { toast } from "sonner";
import Loader from "@/assets/Loader.svg";
import { useAuth } from "@/hooks/useAuth";
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
  const { userRole, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    category: "",
    type: "",
  });
  const [selectedListings, setSelectedListings] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isBulkAction, setIsBulkAction] = useState(false);

  // Get campus ID from user object (no need for additional API call)
  const campusId = user?.campus_id;

  // Fetch listings
  const { data: listings, isLoading } = useQuery({
    queryKey: ["admin-listings", currentPage, filters, campusId],
    queryFn: () => {
      return listingService.getCampusListings(campusId, {
        page: currentPage,
        limit: 10,
        ...filters,
      });
    },
    enabled: Boolean(campusId) && userRole === "admin", // Only run when campus ID is available
    retry: false,
    onError: (error) => {
      console.warn("Listings API not available:", error.message);
    },
    // Transform API response to expected format
    select: (data) => {
      // If data is an array, wrap it in the expected format
      if (Array.isArray(data)) {
        return {
          items: data,
          total: data.length,
          offset: 0,
          limit: 10,
        };
      }
      // If data already has items property, use as is
      return data || { items: [], total: 0, offset: 0, limit: 10 };
    },
  });

  // Fetch listing stats
  const { data: stats } = useQuery({
    queryKey: ["listing-stats", campusId],
    queryFn: () =>
      adminService.getListingStats(
        userRole === "admin" && campusId ? { campus_id: campusId } : {}
      ),
    enabled:
      userRole === "super_admin" || (userRole === "admin" && Boolean(campusId)), // Wait for campus data for campus admin
    retry: false,
    onError: (error) => {
      console.warn("Listing stats API not available:", error.message);
    },
    // Provide fallback data when API fails
    select: (data) =>
      data || {
        pending: 0,
        approved: 0,
        rejected: 0,
        items: 0,
        rooms: 0,
        total: 0,
      },
  });

  // Review listing mutation
  const reviewMutation = useMutation({
    mutationFn: ({ listingId, status, review_note }) =>
      listingService.reviewListing(listingId, status, review_note),
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
      listingService.bulkReviewListings(listingIds, status, review_note),
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
    setCurrentListingId(listingId);
    setIsBulkAction(false);
    if (action === "approve") {
      setShowApproveModal(true);
    } else {
      setShowRejectModal(true);
    }
  };

  const handleBulkReview = (action) => {
    setIsBulkAction(true);
    if (action === "approve") {
      setShowApproveModal(true);
    } else {
      setShowRejectModal(true);
    }
  };

  const handleApproveConfirm = () => {
    if (isBulkAction) {
      bulkReviewMutation.mutate({
        listingIds: selectedListings,
        status: "approved",
        review_note: "",
      });
    } else {
      reviewMutation.mutate({
        listingId: currentListingId,
        status: "approved",
        review_note: "",
      });
    }
    setShowApproveModal(false);
    setCurrentListingId(null);
    setIsBulkAction(false);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    if (isBulkAction) {
      bulkReviewMutation.mutate({
        listingIds: selectedListings,
        status: "rejected",
        review_note: rejectReason,
      });
    } else {
      reviewMutation.mutate({
        listingId: currentListingId,
        status: "rejected",
        review_note: rejectReason,
      });
    }
    setShowRejectModal(false);
    setRejectReason("");
    setCurrentListingId(null);
    setIsBulkAction(false);
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
      sold: { color: "bg-blue-100 text-blue-800", icon: ShoppingBag },
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
              {userRole === "admin" && user?.campus_name
                ? `${user.campus_name} - Market Listings`
                : "Market Listings"}
            </h1>
            <p className="text-gray-600 mt-1">
              {userRole === "admin"
                ? "Review and approve marketplace listings from your campus"
                : "Review and approve user listing submissions"}
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

          <button
            onClick={() =>
              setFilters({
                status: "",
                search: "",
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
                          {listing.image_urls?.[0] ? (
                            <img
                              src={listing.image_urls[0]}
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
                        {/* <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs font-medium text-gray-600">
                              {listing.seller_first_name?.split(" ")[0]?.[0]}
                              {listing.seller_last_name?.split(" ")[1]?.[0]}
                            </span>
                          </div>
                        </div> */}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {listing.seller_first_name}{" "}
                            {listing.seller_last_name}
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

      {/* Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setCurrentListingId(null);
          setIsBulkAction(false);
        }}
        onConfirm={handleApproveConfirm}
        title={isBulkAction ? "Approve Selected Listings" : "Approve Listing"}
        message={
          isBulkAction
            ? `Are you sure you want to approve ${selectedListings.length} listing(s)?`
            : "Are you sure you want to approve this listing?"
        }
        confirmText="Approve"
        confirmButtonClass="bg-green-600 hover:bg-green-700"
        icon={Check}
        iconBgClass="bg-green-100"
        iconColorClass="text-green-600"
        isLoading={reviewMutation.isPending || bulkReviewMutation.isPending}
      />

      {/* Reject Modal with Reason */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isBulkAction ? "Reject Selected Listings" : "Reject Listing"}
              </h2>
              <p className="text-gray-600">
                {isBulkAction
                  ? `Please provide a reason for rejecting ${selectedListings.length} listing(s).`
                  : "Please provide a reason for rejecting this listing."}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setCurrentListingId(null);
                  setIsBulkAction(false);
                }}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                disabled={
                  reviewMutation.isPending || bulkReviewMutation.isPending
                }
              >
                Cancel
              </button>
              <button
                onClick={handleRejectConfirm}
                disabled={
                  !rejectReason.trim() ||
                  reviewMutation.isPending ||
                  bulkReviewMutation.isPending
                }
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reviewMutation.isPending || bulkReviewMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Rejecting...
                  </div>
                ) : (
                  "Reject"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default Market;
