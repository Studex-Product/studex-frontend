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

const ListingCard = ({ listing, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDropdown, setShowDropdown] = useState(false);
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
    markAsSoldMutation.mutate(listing.id);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 flex-shrink-0">
          {getImageUrl(listing) ? (
            <img
              src={getImageUrl(listing)}
              alt={listing.item_name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
              <FileSearch className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {listing.item_name}
                </h3>
                {(() => {
                  const status = listing.status?.toLowerCase();
                  let badgeClasses = "";
                  let statusText = "";

                  switch (status) {
                    case "approved":
                      badgeClasses = "bg-green-100 text-green-800";
                      statusText = "Active";
                      break;
                    case "pending":
                      badgeClasses = "bg-yellow-100 text-yellow-800";
                      statusText = "Pending";
                      break;
                    case "rejected":
                      badgeClasses = "bg-red-100 text-red-800";
                      statusText = "Rejected";
                      break;
                    case "sold":
                      badgeClasses = "bg-blue-100 text-blue-800";
                      statusText = "Sold";
                      break;
                    default:
                      badgeClasses = "bg-gray-100 text-gray-800";
                      statusText = "Unknown";
                  }

                  return (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClasses}`}
                    >
                      {statusText}
                    </span>
                  );
                })()}
              </div>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                {listing.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {listing.view_count || 0} views
                </span>
                <span>Posted {formatDate(listing.created_at)}</span>
              </div>
            </div>

            {/* Price and Actions */}
            <div className="flex flex-col items-end gap-2 ml-4">
              <div className="text-lg font-semibold text-gray-900">
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
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
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
                        disabled={markAsSoldMutation.isPending}
                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default ListingCard;
