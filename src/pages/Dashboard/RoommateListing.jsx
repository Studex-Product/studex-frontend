import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import RoommateCard from "@/components/ui/RoommateCard";
import roommates from "@/sample data/mates";
import { List, LayoutGridIcon, ListFilterIcon, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import RoommateFilterModal from "@/components/ui/RoommateFilterModal";

// Helper function to parse price string like "₦70,000/yr" into a number
const parsePrice = (priceStr) => {
    if (typeof priceStr !== 'string') return 0;
    return Number(priceStr.replace(/[^0-9.-]+/g, ""));
};

// eslint-disable-next-line no-unused-vars
const fetchRoommates = async ({ page = 1, sortBy = "newest", filters = {} }) => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  let allRoommates = [...roommates, ...roommates, ...roommates];

  // Sorting Logic 
  allRoommates.sort((a, b) => {
      if (sortBy === 'price-low') return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === 'price-high') return parsePrice(b.price) - parsePrice(a.price);
      return 0; // 'newest'/'oldest' will be handled by a real backend
  });

  const itemsPerPage = 9;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRoommates = allRoommates.slice(startIndex, endIndex);

  return {
    items: paginatedRoommates,
    totalItems: allRoommates.length,
    totalPages: Math.ceil(allRoommates.length / itemsPerPage),
    currentPage: page,
  };
};

const FindRoommate = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ["roommates", currentPage, sortBy, activeFilters],
    queryFn: () => fetchRoommates({ page: currentPage, sortBy, filters: activeFilters }),
    staleTime: 1000 * 60 * 2,
  });

  const roommateProfiles = data?.items || [];
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
  
  const handleApplyFilters = (filters) => {
    setActiveFilters(filters);
    setCurrentPage(1);
    setIsFilterOpen(false);
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
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Find a Roommate</h1>
        </div>

        <div className="flex items-center justify-between mb-6">
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

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Budget: Low to High</option>
                <option value="price-high">Budget: High to Low</option>
              </select>
            </div>

            <button
              onClick={handleFilterToggle}
              className="flex items-center space-x-2 px-4 py-2 border border-purple-800 rounded-md text-purple-800 text-sm font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ListFilterIcon />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="bg-gray-200 w-full h-64"></div>
                  <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
              </div>
            ))}
          </div>
        )}

        {error && <div className="text-center py-12"><p>Error loading roommates.</p></div>}
        
        {!isLoading && !error && roommateProfiles.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {roommateProfiles.map((roommate) => <RoommateCard key={roommate.id} {...roommate} />)}
              </div>
            ) : (
              <div className="space-y-4 mb-8">
                {roommateProfiles.map((p) => (
                  <div key={p.id} className="bg-white rounded-lg shadow p-4 flex items-center space-x-6 hover:shadow-lg transition-shadow duration-300">
                    <img src={p.image} alt={p.name} className="w-24 h-24 rounded-lg object-cover"/>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin size={14} className="mr-1.5"/>
                        {p.university} - {p.location}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {p.tags.map((tag) => <span key={tag} className="bg-gray-100 text-xs px-2 py-1 rounded-full">{tag}</span>)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                <button onClick={() => handlePageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="p-2 rounded-md border text-gray-400 hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={20} /></button>
                {getPageNumbers().map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)} className={`px-4 py-2 rounded-md text-sm font-medium ${currentPage === page ? "bg-purple-600 text-white" : "text-gray-700 hover:bg-purple-100"}`}>
                    {page}
                    </button>
                ))}
                <button onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="p-2 rounded-md border text-gray-400 hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={20} /></button>
                </div>
            )}
          </>
        )}

        {!isLoading && !error && roommateProfiles.length === 0 && (
            <div className="text-center py-16"><h3 className="text-xl font-semibold">No Roommates Found</h3></div>
        )}
      </div>

      <RoommateFilterModal isOpen={isFilterOpen} onClose={handleFilterToggle} onApplyFilters={handleApplyFilters} />
    </DashboardLayout>
  );
};

export default FindRoommate;