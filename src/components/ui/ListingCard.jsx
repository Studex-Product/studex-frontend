import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileSearch,
  Eye,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { listingService } from "@/api/listingService";
import { toast } from "sonner";
import ConfirmationModal from "@/components/ui/ConfirmationModal";

const ListingCard = ({ listing, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMarkAsSoldModal, setShowMarkAsSoldModal] = useState(false);
  const dropdownRef = useRef(null);

  // Mark as sold mutation
  const markAsSoldMutation = useMutation({
    mutationFn: (id) => listingService.markAsSold(id),
    onSuccess: () => {
      toast.success("Listing marked as sold!");
      queryClient.invalidateQueries(["user-listings"]);
      queryClient.invalidateQueries(["my-listing-detail", listing.id]);
    },
    onError: (error) => {
      toast.error(
        `Failed to mark as sold: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get the first image or use placeholder
  const getImageUrl = (listing) => {
    if (listing.image_urls && listing.image_urls.length > 0) {
      return listing.image_urls[0];
    }
    return null;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleCardClick = (e) => {
    // Don't navigate if clicking on the dropdown button or dropdown menu
    if (dropdownRef.current && dropdownRef.current.contains(e.target)) {
      return;
    }
    navigate(`/dashboard/my-posts/${listing.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (onEdit) {
      onEdit(listing.id);
    } else {
      navigate(`/listings/edit/${listing.id}`);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    if (onDelete) {
      onDelete(listing.id);
    }
  };

  const handleMarkAsSold = (e) => {
    e.stopPropagation();
    setShowDropdown(false);
    setShowMarkAsSoldModal(true);
  };

  const confirmMarkAsSold = () => {
    markAsSoldMutation.mutate(listing.id);
    setShowMarkAsSoldModal(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  // Get status badge info
  const getStatusBadge = () => {
    const status = listing.status?.toLowerCase();
    let badgeClasses = "";
    let statusText = "";

    switch (status) {
      case "approved":
        badgeClasses = "bg-green-500 text-white";
        statusText = "Active";
        break;
      case "pending":
        badgeClasses = "bg-yellow-500 text-white";
        statusText = "Pending";
        break;
      case "rejected":
        badgeClasses = "bg-red-500 text-white";
        statusText = "Rejected";
        break;
      case "sold":
        badgeClasses = "bg-blue-500 text-white";
        statusText = "Sold";
        break;
      default:
        badgeClasses = "bg-gray-500 text-white";
        statusText = "Unknown";
    }

    return { badgeClasses, statusText };
  };

  const { badgeClasses, statusText } = getStatusBadge();

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 sm:p-4">
        {/* Image */}
        <div className="relative w-full sm:w-32 sm:h-32 h-48 flex-shrink-0 overflow-hidden sm:rounded-lg">
          {getImageUrl(listing) ? (
            <img
              src={getImageUrl(listing)}
              alt={listing.item_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <FileSearch className="w-8 h-8 text-gray-400" />
            </div>
          )}
          {/* Status Badge on Image */}
          <span
            className={`absolute top-2 left-2 px-2.5 py-0.5 rounded-sm text-xs font-semibold ${badgeClasses}`}
          >
            {statusText}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 p-4 sm:p-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate mb-1">
                {listing.item_name}
              </h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {listing.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  {listing.view_count || 0} views
                </span>
                <span className="hidden sm:inline">
                  Posted {formatDate(listing.created_at)}
                </span>
                <span className="sm:hidden">
                  {formatDate(listing.created_at)}
                </span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div className="text-base sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
                {formatPrice(listing.price)}
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={handleEdit}
                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={handleMarkAsSold}
                        disabled={
                          markAsSoldMutation.isPending ||
                          listing.status?.toLowerCase() !== "approved"
                        }
                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title={
                          listing.status?.toLowerCase() !== "approved"
                            ? "Only active listings can be marked as sold"
                            : ""
                        }
                      >
                        {markAsSoldMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                            Marking...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Mark as Sold
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDelete}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default ListingCard;
