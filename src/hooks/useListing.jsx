import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listingService } from "@/api/listingService";
import { toast } from "sonner";

export const useListing = () => {
  const queryClient = useQueryClient();

  // Create listing mutation
  const createListing = useMutation({
    mutationFn: listingService.createListing,
    onSuccess: (data) => {
      // Invalidate listings queries to refetch
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Listing created successfully!
        </div>
      ));
      console.log("Listing created successfully:", data);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to create listing";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
      console.error("Create listing error:", error);
    },
  });

  // Upload listing images mutation
  const uploadListingImages = useMutation({
    mutationFn: ({ listingId, files }) => listingService.uploadListingImages(listingId, files),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Images uploaded successfully!
        </div>
      ));
      console.log("Images uploaded successfully:", data);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to upload images";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
      console.error("Upload images error:", error);
    },
  });

  // Get user listings query
  const {
    data: userListings = [],
    isLoading: isLoadingUserListings,
    error: userListingsError,
    refetch: refetchUserListings
  } = useQuery({
    queryKey: ['userListings'],
    queryFn: listingService.getUserListings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get all listings query
  const useAllListings = (params = {}) => {
    return useQuery({
      queryKey: ['listings', params],
      queryFn: () => listingService.getAllListings(params),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Get single listing query
  const useSingleListing = (listingId) => {
    return useQuery({
      queryKey: ['listing', listingId],
      queryFn: () => listingService.getListingById(listingId),
      enabled: !!listingId,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Update listing mutation
  const updateListing = useMutation({
    mutationFn: ({ listingId, listingData }) => listingService.updateListing(listingId, listingData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', data.id] });

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-green-500 shadow-lg max-w-sm w-full break-words">
          Listing updated successfully!
        </div>
      ));
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update listing";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  // Delete listing mutation
  const deleteListing = useMutation({
    mutationFn: listingService.deleteListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['userListings'] });

      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-blue-500 shadow-lg max-w-sm w-full break-words">
          Listing deleted successfully!
        </div>
      ));
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to delete listing";
      toast.custom(() => (
        <div className="bg-white rounded-lg p-3 text-sm border-2 border-red-500 shadow-lg max-w-sm w-full break-words">
          {message}
        </div>
      ));
    },
  });

  return {
    // Mutations
    createListing,
    uploadListingImages,
    updateListing,
    deleteListing,

    // Queries
    userListings,
    isLoadingUserListings,
    userListingsError,
    refetchUserListings,

    // Query hooks
    useAllListings,
    useSingleListing,

    // Loading states
    isCreatingListing: createListing.isPending,
    isUploadingImages: uploadListingImages.isPending,
    isUpdatingListing: updateListing.isPending,
    isDeletingListing: deleteListing.isPending,

    // Error states
    createListingError: createListing.error,
    uploadImagesError: uploadListingImages.error,
    updateListingError: updateListing.error,
    deleteListingError: deleteListing.error,

    // Success states
    isCreateListingSuccess: createListing.isSuccess,
    isUploadImagesSuccess: uploadListingImages.isSuccess,
    isUpdateListingSuccess: updateListing.isSuccess,
    isDeleteListingSuccess: deleteListing.isSuccess,
  };
};