import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listingService } from "@/api/listingService";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { toast } from "sonner";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ArrowLeft,
  Package,
  Home,
  Tag,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Clock,
  Check,
  X,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import Loader from "@/assets/Loader.svg";

const MyPostDetail = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMarkAsSoldModal, setShowMarkAsSoldModal] = useState(false);

  // Fetch listing details
  const {
    data: listing,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["my-listing-detail", listingId],
    queryFn: () => listingService.getListingById(listingId),
    retry: false,
  });

  // Delete listing mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => listingService.deleteListing(id),
    onSuccess: () => {
      toast.success("Listing deleted successfully!");
      queryClient.invalidateQueries(["user-listings"]);
      navigate("/my-posts");
    },
    onError: (error) => {
      toast.error(
        `Failed to delete listing: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Mark as sold mutation
  const markAsSoldMutation = useMutation({
    mutationFn: (id) => listingService.markAsSold(id),
    onSuccess: () => {
      toast.success("Listing marked as sold!");
      queryClient.invalidateQueries(["my-listing-detail", listingId]);
      queryClient.invalidateQueries(["user-listings"]);
    },
    onError: (error) => {
      toast.error(
        `Failed to mark as sold: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  const handleBack = () => {
    navigate("/my-posts");
  };

  const handleEdit = () => {
    navigate(`/listings/edit/${listingId}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(listingId);
    setShowDeleteModal(false);
  };

  const handleMarkAsSold = () => {
    setShowMarkAsSoldModal(true);
  };

  const confirmMarkAsSold = () => {
    markAsSoldMutation.mutate(listingId);
    setShowMarkAsSoldModal(false);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      approved: { color: "bg-green-100 text-green-800", icon: Check },
      sold: { color: "bg-blue-100 text-blue-800", icon: Check },
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
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <img src={Loader} alt="Loading..." className="w-12 h-12" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Failed to load listing</p>
            <p className="text-sm">
              {error.response?.data?.message || error.message}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="text-purple-700 hover:text-purple-800 font-medium"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Listing Details
              </h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">
                View your listing information
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200 text-sm sm:text-base cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden xs:inline">Edit</span>
            </button>
            <button
              onClick={handleMarkAsSold}
              disabled={
                markAsSoldMutation.isPending ||
                listing?.status?.toLowerCase() !== "approved"
              }
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base cursor-pointer flex-1 sm:flex-initial justify-center"
              title={
                listing?.status?.toLowerCase() !== "approved"
                  ? "Only active listings can be marked as sold"
                  : ""
              }
            >
              {markAsSoldMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span className="whitespace-nowrap">Mark as Sold</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base cursor-pointer"
            >
              {deleteMutation.isPending ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span className="hidden xs:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                {getTypeIcon(listing?.type)}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Listing Status
                </h2>
                <p className="text-gray-600">Current status of your listing</p>
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

              <div>
                <p className="text-sm text-gray-600">Views</p>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">
                    {listing?.view_count || 0} views
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Images Preview */}
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
                  className="w-full h-80 object-contain rounded-lg border border-gray-200 bg-gray-50 cursor-pointer"
                  onClick={() =>
                    window.open(
                      listing.image_urls[selectedImageIndex],
                      "_blank"
                    )
                  }
                />
              </div>

              {/* Thumbnail Grid */}
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
                <Info className="w-4 h-4" />
                <span>Click on main image to view full size</span>
              </div>
            </div>
          )}
        </div>

        {/* Additional Information */}
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

        {/* Mark as Sold Confirmation Modal */}
        <ConfirmationModal
          isOpen={showMarkAsSoldModal}
          onClose={() => setShowMarkAsSoldModal(false)}
          onConfirm={confirmMarkAsSold}
          title="Mark as Sold"
          message="Are you sure you want to mark this listing as sold? This will remove it from active listings."
          confirmText="Mark as Sold"
          confirmButtonClass="bg-green-600 hover:bg-green-700"
          icon={CheckCircle}
          iconBgClass="bg-green-100"
          iconColorClass="text-green-600"
          isLoading={markAsSoldMutation.isPending}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Listing"
          message="Are you sure you want to delete this listing? This action cannot be undone."
          confirmText="Delete"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          icon={Trash2}
          iconBgClass="bg-red-100"
          iconColorClass="text-red-600"
          isLoading={deleteMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
};

export default MyPostDetail;
