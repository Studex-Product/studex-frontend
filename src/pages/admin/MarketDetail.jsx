import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
// import { adminService } from "@/api/adminService";
import { listingService } from "@/api/listingService";
import AdminDashboardLayout from "@/components/layout/AdminDashboardLayout";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  X,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  School,
  Calendar,
  FileText,
  Clock,
  AlertTriangle,
  ShoppingBag,
  DollarSign,
  Tag,
  Package,
  Home,
  Eye,
  Star,
  Info,
} from "lucide-react";

const MarketDetail = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch listing details
  const {
    data: listing,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listing-detail", listingId],
    queryFn: () => listingService.getListingById(listingId),
    retry: false,
  });

  // Review listing mutation
  const reviewMutation = useMutation({
    mutationFn: ({ status, review_note }) =>
      listingService.reviewListing(listingId, status, review_note),
    onSuccess: (data, variables) => {
      const actionText =
        variables.status === "approved" ? "approved" : "rejected";
      toast.success(`Listing ${actionText} successfully!`);
      queryClient.invalidateQueries(["admin-listing", listingId]);
      queryClient.invalidateQueries(["admin-listings"]);
      queryClient.invalidateQueries(["listing-stats"]);

      if (variables.status === "rejected") {
        setShowRejectModal(false);
        setRejectReason("");
      }

      // Navigate back to market list after a delay
      setTimeout(() => {
        navigate("/admin/market");
      }, 2000);
    },
    onError: (error) => {
      toast.error(
        `Failed to process listing: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const handleApprove = () => {
    setShowApproveModal(true);
  };

  const handleApproveConfirm = () => {
    reviewMutation.mutate({
      status: "approved",
      review_note: "", // Optional for approved status
    });
    setShowApproveModal(false);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    reviewMutation.mutate({
      status: "rejected",
      review_note: rejectReason, // Required for rejected status
    });
  };

  const handleBackToMarket = () => {
    navigate("/admin/market");
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
        className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${config.color}`}
      >
        <Icon size={16} className="mr-2" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    return type === "room" ? (
      <Home size={20} className="text-blue-600" />
    ) : (
      <Package size={20} className="text-green-600" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
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

  if (isLoading) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading listing details...</p>
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
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">
              Error Loading Listing
            </h3>
            <p className="text-red-600 mb-4">{error.message}</p>
            <button
              onClick={handleBackToMarket}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Back to Market
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
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToMarket}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Listing Details
              </h1>
              <p className="text-gray-600">
                Review marketplace listing submission
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {listing?.status === "pending" && (
              <>
                <button
                  onClick={handleReject}
                  disabled={reviewMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {reviewMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  Reject
                </button>
                <button
                  onClick={handleApprove}
                  disabled={reviewMutation.isPending}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {reviewMutation.isPending ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Approve
                </button>
              </>
            )}
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <ShoppingBag className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Listing Status
                </h2>
                <p className="text-gray-600">
                  Current status of this listing submission
                </p>
              </div>
            </div>
            {getStatusBadge(listing?.status)}
          </div>
          {listing?.review_note && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Review Note:</p>
              <p className="text-sm text-gray-600 mt-1">
                {listing.review_note}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Listing Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              {getTypeIcon(listing?.type)}
              <h3 className="text-lg font-semibold text-gray-900">
                Listing Information
              </h3>
            </div>

            <div className="space-y-4">
              {/* Images */}
              {/* {listing?.image_urls && listing.image_urls.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Images</p>
                  <div className="grid grid-cols-2 gap-4">
                    {listing.image_urls.map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`${listing.item_name} - Image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )} */}

              <div>
                <p className="text-sm text-gray-600">Title</p>
                <p className="font-medium text-gray-900 text-lg">
                  {listing?.item_name || listing?.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(listing?.type)}
                    <p className="font-medium capitalize">
                      {listing?.type || "Item"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <p className="font-medium capitalize">
                      {listing?.category}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-lg text-green-600">
                      {formatPrice(listing?.price)}
                    </p>
                  </div>
                </div>

                {listing?.condition && (
                  <div>
                    <p className="text-sm text-gray-600">Condition</p>
                    <p className="font-medium capitalize">
                      {listing.condition}
                    </p>
                  </div>
                )}
              </div>

              {listing?.description && (
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="text-gray-900 mt-1">{listing.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {listing?.colour && (
                  <div>
                    <p className="text-sm text-gray-600">Color</p>
                    <p className="font-medium capitalize">{listing.colour}</p>
                  </div>
                )}

                {listing?.material && (
                  <div>
                    <p className="text-sm text-gray-600">Material</p>
                    <p className="font-medium capitalize">{listing.material}</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {listing?.state && (
                  <div>
                    <p className="text-sm text-gray-600">State</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="font-medium">{listing.state}</p>
                    </div>
                  </div>
                )}

                {listing?.local_government && (
                  <div>
                    <p className="text-sm text-gray-600">Local Government</p>
                    <p className="font-medium">{listing.local_government}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-600">Posted Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">
                    {formatDate(listing?.created_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Seller Information
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-medium">
                    {listing?.seller_avatar_url ? (
                      <img
                        src={listing.seller_avatar_url}
                        alt={`${listing.seller_first_name} ${listing.seller_last_name}`}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <>
                        {listing?.seller_first_name?.split(" ")[0]?.[0]}
                        {listing?.seller_last_name?.split(" ")[1]?.[0]}
                      </>
                    )}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {listing?.seller_first_name} {listing?.seller_last_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Seller ID: {listing?.user_id || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{listing?.seller_email}</p>
                  </div>
                </div>

                {listing?.seller_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{listing.seller_phone}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <School className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Campus</p>
                    <p className="font-medium">{listing?.state}</p>
                  </div>
                </div>

                {listing?.seller_rating && (
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <div>
                      <p className="text-sm text-gray-600">Seller Rating</p>
                      <p className="font-medium">{listing.seller_rating}/5.0</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        {listing?.image_urls && listing.image_urls.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Listing Images
            </h3>

            {/* Main Image */}
            <div className="mb-4">
              <img
                src={listing.image_urls[selectedImageIndex]}
                alt={`${listing.item_name} - Image ${selectedImageIndex + 1}`}
                className="w-full h-96 object-contain rounded-lg border border-gray-200 bg-gray-50 cursor-pointer"
                onClick={() =>
                  window.open(listing.image_urls[selectedImageIndex], "_blank")
                }
              />
            </div>

            {/* Thumbnail Gallery */}
            {listing.image_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {listing.image_urls.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "border-purple-500 ring-2 ring-purple-200"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>Click on main image to view full size</span>
            </div>
          </div>
        )}

        {/* Additional Details */}
        {(listing?.additional_details || listing?.safety_guidelines) && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Additional Information
              </h3>
            </div>

            <div className="space-y-4">
              {listing?.additional_details && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Additional Details:
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {listing.additional_details}
                  </p>
                </div>
              )}

              {listing?.safety_guidelines && (
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Safety Guidelines:
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {listing.safety_guidelines}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Reject Listing
                </h2>
                <p className="text-gray-600">
                  Please provide a reason for rejecting this listing submission.
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
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  disabled={reviewMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={!rejectReason.trim() || reviewMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {reviewMutation.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Rejecting...
                    </div>
                  ) : (
                    "Reject Listing"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Approve Confirmation Modal */}
        <ConfirmationModal
          isOpen={showApproveModal}
          onClose={() => setShowApproveModal(false)}
          onConfirm={handleApproveConfirm}
          title="Approve Listing"
          message="Are you sure you want to approve this listing?"
          confirmText="Approve"
          confirmButtonClass="bg-green-600 hover:bg-green-700"
          icon={Check}
          iconBgClass="bg-green-100"
          iconColorClass="text-green-600"
          isLoading={reviewMutation.isPending}
        />
      </div>
    </AdminDashboardLayout>
  );
};

export default MarketDetail;
