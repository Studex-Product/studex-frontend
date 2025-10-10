import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { adminService } from "@/api/adminService";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
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
  FileText,
  Calendar,
  ExternalLink,
} from "lucide-react";

const Verifications = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    campus_id: "",
  });
  const [selectedVerifications, setSelectedVerifications] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentVerificationId, setCurrentVerificationId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [isBulkAction, setIsBulkAction] = useState(false);

  // Fetch verifications
  const { data: verifications, isLoading } = useQuery({
    queryKey: ["admin-verifications", currentPage, filters],
    queryFn: () =>
      adminService.getPendingVerifications({
        page: currentPage,
        limit: 10,
        ...filters,
      }),
  });

  // Fetch verification stats
  const { data: stats } = useQuery({
    queryKey: ["verification-stats"],
    queryFn: () => adminService.getVerificationStats(),
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

  // Review verification mutation
  const reviewMutation = useMutation({
    mutationFn: ({ verificationId, status, review_note }) =>
      adminService.reviewVerification(verificationId, status, review_note),
    onSuccess: (data, variables) => {
      const actionText =
        variables.status === "approved" ? "approved" : "rejected";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Verification {actionText} successfully!
        </div>
      ));
      queryClient.invalidateQueries(["admin-verifications"]);
      queryClient.invalidateQueries(["verification-stats"]);
    },
    onError: (error) => {
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          Failed to process verification:{" "}
          {error.response?.data?.message || error.message}
        </div>
      ));
    },
  });

  // Bulk review mutation
  const bulkReviewMutation = useMutation({
    mutationFn: ({ verificationIds, status, review_note }) =>
      adminService.bulkReviewVerifications(
        verificationIds,
        status,
        review_note
      ),
    onSuccess: (data, variables) => {
      const actionText =
        variables.status === "approved" ? "approved" : "rejected";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          {variables.verificationIds.length} verifications {actionText}{" "}
          successfully!
        </div>
      ));
      queryClient.invalidateQueries(["admin-verifications"]);
      queryClient.invalidateQueries(["verification-stats"]);
      setSelectedVerifications([]);
      setShowBulkActions(false);
    },
  });

  const handleSingleReview = (verificationId, action) => {
    setCurrentVerificationId(verificationId);
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
        verificationIds: selectedVerifications,
        status: "approved",
        review_note: "",
      });
    } else {
      reviewMutation.mutate({
        verificationId: currentVerificationId,
        status: "approved",
        review_note: "",
      });
    }
    setShowApproveModal(false);
    setCurrentVerificationId(null);
    setIsBulkAction(false);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    if (isBulkAction) {
      bulkReviewMutation.mutate({
        verificationIds: selectedVerifications,
        status: "rejected",
        review_note: rejectReason,
      });
    } else {
      reviewMutation.mutate({
        verificationId: currentVerificationId,
        status: "rejected",
        review_note: rejectReason,
      });
    }
    setShowRejectModal(false);
    setRejectReason("");
    setCurrentVerificationId(null);
    setIsBulkAction(false);
  };

  const handleViewDetails = (verificationId) => {
    navigate(`/admin/verifications/${verificationId}`);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = verifications?.items?.map((v) => v.id) || [];
      setSelectedVerifications(allIds);
    } else {
      setSelectedVerifications([]);
    }
  };

  const handleSelectVerification = (id, checked) => {
    if (checked) {
      setSelectedVerifications((prev) => [...prev, id]);
    } else {
      setSelectedVerifications((prev) => prev.filter((vId) => vId !== id));
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Student Verifications
            </h1>
            <p className="text-gray-600 mt-1">
              Review and approve student verification requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Download size={16} />
              Export
            </button>
            {selectedVerifications.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Bulk Actions ({selectedVerifications.length})
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total || 0}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText size={20} className="text-gray-600" />
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
              placeholder="Search by name or student ID..."
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
              setFilters({ status: "", search: "", campus_id: "" })
            }
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter size={16} />
            Reset
          </button>
        </div>
      </div>

      {/* Verifications Table */}
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
                      selectedVerifications.length ===
                        verifications?.items?.length &&
                      verifications?.items?.length > 0
                    }
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
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
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    <img
                      src={Loader}
                      alt="Loading..."
                      className="w-12 h-12 mx-auto mb-4"
                    />
                    Loading verifications...
                  </td>
                </tr>
              ) : verifications?.items?.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No verifications found
                  </td>
                </tr>
              ) : (
                verifications?.items?.map((verification) => (
                  <tr key={verification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedVerifications.includes(
                          verification.id
                        )}
                        onChange={(e) =>
                          handleSelectVerification(
                            verification.id,
                            e.target.checked
                          )
                        }
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {verification.user_name?.split(" ")[0]?.[0]}
                              {verification.user_name?.split(" ")[1]?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {verification.user_name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {verification.user_email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {verification.campus_name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {verification.document_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(verification.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {verification.submitted_at
                          ? formatDate(verification.submitted_at)
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(verification.id)}
                          className="cursor-pointer hover:scale-[1.5] transition-all duration-200 text-purple-600 hover:text-purple-800"
                          title="View Details"
                        >
                          <ExternalLink size={16} />
                        </button>
                        <button
                          onClick={() =>
                            window.open(verification.file_url, "_blank")
                          }
                          className="cursor-pointer hover:scale-[1.5] transition-all duration-200 text-blue-600 hover:text-blue-800"
                          title="View Document"
                        >
                          <Eye size={16} />
                        </button>
                        {verification.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleSingleReview(verification.id, "approve")
                              }
                              disabled={reviewMutation.isPending}
                              className="cursor-pointer hover:scale-[1.5] transition-all duration-200 text-green-600 hover:text-green-800 disabled:opacity-50"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleSingleReview(verification.id, "reject")
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
        {verifications?.total > 10 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(verifications.offset || 0) + 1} to{" "}
              {Math.min(
                (verifications.offset || 0) + (verifications.limit || 10),
                verifications.total
              )}{" "}
              of {verifications.total} results
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
                {Math.ceil(verifications.total / (verifications.limit || 10))}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(
                      Math.ceil(
                        verifications.total / (verifications.limit || 10)
                      ),
                      prev + 1
                    )
                  )
                }
                disabled={
                  currentPage ===
                  Math.ceil(verifications.total / (verifications.limit || 10))
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
          setCurrentVerificationId(null);
          setIsBulkAction(false);
        }}
        onConfirm={handleApproveConfirm}
        title={
          isBulkAction
            ? "Approve Selected Verifications"
            : "Approve Verification"
        }
        message={
          isBulkAction
            ? `Are you sure you want to approve ${selectedVerifications.length} verification(s)?`
            : "Are you sure you want to approve this verification?"
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
                {isBulkAction
                  ? "Reject Selected Verifications"
                  : "Reject Verification"}
              </h2>
              <p className="text-gray-600">
                {isBulkAction
                  ? `Please provide a reason for rejecting ${selectedVerifications.length} verification(s).`
                  : "Please provide a reason for rejecting this verification."}
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
                  setCurrentVerificationId(null);
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

export default Verifications;
