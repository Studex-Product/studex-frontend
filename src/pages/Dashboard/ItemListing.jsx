import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProductCard from "@/components/ui/ProductCard";
import products from "@/sample data/products";
import locationIcon from "@/assets/icons/Location-icon.svg";
import { List } from "lucide-react";
import { LayoutGridIcon } from "lucide-react";
import { ListFilterIcon } from "lucide-react";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";
import FilterModal from "@/components/ui/FilterModal";

// Helper function to parse price string like "₦25,000" into a number
const parsePrice = (priceStr) => {
    if (typeof priceStr !== 'string') return 0;
    return Number(priceStr.replace(/[^0-9.-]+/g, ""));
};

// Mock API service updated to handle filters and sorting
const fetchItems = async ({ page = 1, sortBy = "newest", filters = {} }) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  let allProducts = [...products, ...products, ...products];

  // --- Filtering Logic ---
  if (filters.category && filters.category !== 'All') {
      allProducts = allProducts.filter(p => p.category === filters.category);
  }
  if (filters.condition && filters.condition !== 'All') {
      allProducts = allProducts.filter(p => p.category === filters.condition);
  }
  if (filters.location && filters.location !== 'All') {
      allProducts = allProducts.filter(p => p.location.includes(filters.location.split(' ')[0]));
  }
  if (filters.priceRange) {
      const { from, to } = filters.priceRange;
      const fromPrice = from ? Number(from) : 0;
      const toPrice = to ? Number(to) : Infinity;
      allProducts = allProducts.filter(p => {
          const itemPrice = parsePrice(p.price);
          return itemPrice >= fromPrice && itemPrice <= toPrice;
      });
  }

  // --- Sorting Logic ---
  allProducts.sort((a, b) => {
      if (sortBy === 'price-low') return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === 'price-high') return parsePrice(b.price) - parsePrice(a.price);
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

const ItemListing = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({}); // Added state for filters

  // Updated useQuery to be aware of filters
  const { data, isLoading, error } = useQuery({
    queryKey: ["items", currentPage, sortBy, activeFilters],
    queryFn: () => fetchItems({ page: currentPage, sortBy, filters: activeFilters }),
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
        <div className="flex items-center justify-between mb-6">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 mb-8">
                    {items.map((item) => <ProductCard key={item.id} {...item} />)}
                  </div>
                ) : (
                  <div className="space-y-4 mb-8">
                    {items.map((item) => (
                      <div key={item.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg" />
                          </div>
                          <div className="flex-1 min-w-0 cursor-pointer">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">{item.title}</h3>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              <span className={`px-3 py-1 mr-2 text-xs font-semibold rounded-sm ${item.category === "New" ? "bg-[#1C7D22] text-white" : "bg-[#3A3A3A] text-white"}`}>
                                {item.category}
                              </span>
                              {item.description}
                            </p>
                            <div className="flex items-center mt-2 text-gray-500 text-xs">
                              <img src={locationIcon} alt="location" className="w-4 h-4 mr-1" />
                              <span>{item.location}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="text-2xl font-semibold text-gray-900">{item.price}</div>
                            {item.category === "Apartment" && <div className="text-sm text-gray-500">/ year</div>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mb-8">
                    <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                      <ChevronLeft />
                    </button>
                    {getPageNumbers().map((page) => (
                      <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${currentPage === page ? "bg-green-600 text-white" : "text-gray-700 hover:bg-green-100"}`}>
                        {page}
                      </button>
                    ))}
                    <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                      <ChevronRight />
                    </button>
                  </div>
                )}
                {/* Results Summary */}
                <div className="text-center text-sm text-gray-500">
                  Showing {(currentPage - 1) * 9 + 1}-{Math.min(currentPage * 9, data?.totalItems || 0)} of {data?.totalItems || 0} items
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                  <h3 className="text-xl font-semibold text-gray-900">No Items Found</h3>
                  <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
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