import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductCard from "@/components/ui/ProductCard";
import products from "@/sample-data/products";
import { listingService } from "@/api/listingService";
import { List } from "lucide-react";
import { LayoutGridIcon } from "lucide-react";
import { ListFilterIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import FilterModal from "@/components/ui/FilterModal";

// Helper function to parse price string like "₦25,000" into a number
const parsePrice = (priceStr) => {
  if (typeof priceStr !== "string") return 0;
  return Number(priceStr.replace(/[^0-9.-]+/g, ""));
};

// Mock API service (fallback) - handles filters, sorting, and search
const fetchItemsMock = async ({
  page = 1,
  sortBy = "newest",
  filters = {},
  searchQuery = "",
}) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let allProducts = [...products, ...products, ...products];

  // --- Search Logic ---
  if (searchQuery && searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase().trim();
    allProducts = allProducts.filter((p) => {
      return (
        p.title?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.location?.toLowerCase().includes(query)
      );
    });
  }

  // --- Filtering Logic ---
  if (filters.category && filters.category !== "All") {
    allProducts = allProducts.filter((p) => p.category === filters.category);
  }
  if (filters.condition && filters.condition !== "All") {
    allProducts = allProducts.filter((p) => p.condition === filters.condition);
  }
  if (filters.location && filters.location !== "All") {
    allProducts = allProducts.filter((p) =>
      p.location.toLowerCase().includes(filters.location.toLowerCase())
    );
  }
  if (filters.priceRange) {
    const { from, to } = filters.priceRange;
    const fromPrice = from ? Number(from) : 0;
    const toPrice = to ? Number(to) : Infinity;
    allProducts = allProducts.filter((p) => {
      const itemPrice = parsePrice(p.price);
      return itemPrice >= fromPrice && itemPrice <= toPrice;
    });
  }

  // --- Sorting Logic ---
  allProducts.sort((a, b) => {
    if (sortBy === "price-low")
      return parsePrice(a.price) - parsePrice(b.price);
    if (sortBy === "price-high")
      return parsePrice(b.price) - parsePrice(a.price);
    return 0; // Other sorting would be handled by a real backend
  });

  const itemsPerPage = 9;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = allProducts.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalItems: allProducts.length,
    totalPages: Math.ceil(allProducts.length / itemsPerPage),
    currentPage: page,
  };
};

// Real API service - fetches from backend
const fetchItems = async ({
  page = 1,
  sortBy = "newest",
  filters = {},
  searchQuery = "",
}) => {
  try {
    // Build API params
    const params = {};

    if (searchQuery && searchQuery.trim() !== "") {
      params.search = searchQuery.trim();
    }

    if (filters.category && filters.category !== "All") {
      params.category = filters.category;
    }

    if (filters.condition && filters.condition !== "All") {
      params.condition = filters.condition;
    }

    if (filters.location && filters.location !== "All") {
      params.state = filters.location; // Use the state name directly
    }

    if (filters.priceRange) {
      const { from, to } = filters.priceRange;
      if (from !== "" && from !== undefined && from !== null) {
        params.minPrice = Number(from);
      }
      if (to !== "" && to !== undefined && to !== null) {
        params.maxPrice = Number(to);
      }
    }

    // Fetch from API
    console.log("Fetching listings with params:", params);
    const response = await listingService.getAllListings(params);
    console.log("API response:", response);

    // Transform API response to match expected format
    let items = response.data || response || [];

    // Filter to only show approved items
    items = items.filter((item) => item.status === "approved");

    // Client-side filtering (backup since backend doesn't filter properly)
    if (params.category) {
      items = items.filter((item) => item.category === params.category);
      console.log("After category filter:", items.length);
    }

    if (params.condition) {
      items = items.filter((item) => item.condition === params.condition);
      console.log("After condition filter:", items.length);
    }

    if (params.minPrice !== undefined && params.minPrice !== null) {
      items = items.filter((item) => item.price >= params.minPrice);
      console.log("After minPrice filter:", items.length);
    }

    if (params.maxPrice !== undefined && params.maxPrice !== null) {
      items = items.filter((item) => item.price <= params.maxPrice);
      console.log("After maxPrice filter:", items.length);
    }

    if (params.state) {
      items = items.filter((item) => item.state === params.state);
      console.log("After state filter:", items.length);
    }

    if (params.search) {
      const searchLower = params.search.toLowerCase();
      items = items.filter(
        (item) =>
          item.item_name?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower)
      );
      console.log("After search filter:", items.length);
    }

    // Client-side sorting (before transformation, using raw price values)
    items.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      // Default: newest first
      return new Date(b.created_at) - new Date(a.created_at);
    });

    // Transform API data to match ProductCard props (after sorting)
    items = items.map((item) => ({
      id: item.id,
      image:
        item.image_urls && item.image_urls.length > 0
          ? item.image_urls[0]
          : null,
      title: item.item_name,
      description: item.description,
      price: new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        minimumFractionDigits: 2,
      }).format(item.price),
      location:
        item.state && item.local_government
          ? `${item.local_government}, ${item.state}`
          : item.state || "Location not specified",
      category: item.condition || item.category || "Used",
      // Keep original data for reference
      rawPrice: item.price, // Keep the raw price for any future use
      created_at: item.created_at,
    }));

    // Pagination
    const itemsPerPage = 9;
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      totalItems,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    console.error(
      "Error fetching items from API, falling back to mock data:",
      error
    );
    // Fallback to mock data
    return fetchItemsMock({ page, sortBy, filters, searchQuery });
  }
};

const ItemListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setCurrentPage(1); // Reset to first page on search
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Updated useQuery to be aware of filters and search
  const { data, isLoading, error } = useQuery({
    queryKey: ["items", currentPage, sortBy, activeFilters, searchQuery],
    queryFn: () =>
      fetchItems({
        page: currentPage,
        sortBy,
        filters: activeFilters,
        searchQuery,
      }),
    staleTime: 1000 * 60 * 2,
  });

  const items = data?.items || [];
  const totalPages = data?.totalPages || 1;

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Added handler for applying filters from the modal
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1); // Go back to page 1 when filters change
    setIsFilterOpen(false); // Close modal
  };

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Item Listing</h1>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center justify-between mb-6 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2 max-sm:mb-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "border border-green-800 text-green-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <LayoutGridIcon />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "border border-green-800 text-green-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <List />
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Search by name, description, category..."
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition duration-300"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Sort and Filter */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* Filter Button */}
            <button
              onClick={handleFilterToggle}
              className="flex items-center space-x-2 px-4 py-2 border border-purple-800 rounded-md text-purple-800 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ListFilterIcon />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-4 animate-pulse"
              >
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-3/4 mb-2"></div>
                <div className="bg-gray-200 h-5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              Error loading items. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Items Grid & List / Empty State */}
        {!isLoading && !error && (
          <>
            {items.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                      : "space-y-4 mb-8"
                  }
                >
                  {items.map((item) => (
                    <ProductCard key={item.id} {...item} view={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mb-8">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronLeft />
                    </button>
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                          currentPage === page
                            ? "bg-green-600 text-white"
                            : "text-gray-700 hover:bg-green-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                )}
                {/* Results Summary */}
                <div className="text-center text-sm text-gray-500">
                  Showing {(currentPage - 1) * 9 + 1}-
                  {Math.min(currentPage * 9, data?.totalItems || 0)} of{" "}
                  {data?.totalItems || 0} items
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-900">
                  No Items Found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters to find what you're looking for.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal Component */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={handleFilterToggle}
        onApplyFilters={handleApplyFilters}
      />
    </DashboardLayout>
  );
};

export default ItemListing;
