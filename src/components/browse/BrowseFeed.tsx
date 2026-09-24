import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from './VehicleCard';
import { FilterDrawer } from './FilterDrawer';
import {
  SlidersHorizontal,
  Search,
  MapPin,
  X,
  RotateCcw,
  Bookmark,
  Sparkles,
  ArrowUpDown,
  Car,
} from 'lucide-react';
import { RADIUS_OPTIONS } from '../../services/geoService';

export const BrowseFeed: React.FC = () => {
  const {
    listings,
    allListings,
    searchFilters,
    setSearchFilters,
    resetFilters,
    saveCurrentSearch,
    activeMarket,
  } = useApp();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchFilters.keyword || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters({ keyword: searchInput.trim() });
  };

  // Count active filters
  const activeFilterCount = [
    searchFilters.maxPrice,
    searchFilters.minPrice,
    searchFilters.maxMileage,
    searchFilters.make,
    searchFilters.model,
    searchFilters.category,
    searchFilters.transmission,
    searchFilters.drivetrain,
    searchFilters.titleStatus,
    searchFilters.hasColdStart,
    searchFilters.hasWalkaround,
    searchFilters.hasServiceRecords,
    searchFilters.sellerType && searchFilters.sellerType !== 'ALL' ? true : false,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Top Search & Filter Bar */}
      <div className="bg-white border-b border-zinc-200 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Quick search input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search year, make, model, trim, keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#EA580C] transition"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSearchFilters({ keyword: '' });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {/* Radius Select */}
              <div className="relative">
                <select
                  value={searchFilters.radiusMiles || 50}
                  onChange={(e) => setSearchFilters({ radiusMiles: Number(e.target.value) })}
                  className="bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 py-2 px-3 focus:outline-none focus:border-[#EA580C] cursor-pointer"
                >
                  {RADIUS_OPTIONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={searchFilters.sortBy || 'newest'}
                  onChange={(e) => setSearchFilters({ sortBy: e.target.value as any })}
                  className="bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 py-2 px-3 focus:outline-none focus:border-[#EA580C] cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="distance">Distance: Closest</option>
                  <option value="mileage_asc">Mileage: Lowest</option>
                </select>
              </div>

              {/* Filter Drawer Trigger */}
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                  activeFilterCount > 0
                    ? 'bg-zinc-900 text-white border-zinc-900'
                    : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#EA580C]" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#EA580C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filter Chips & Clear Action */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-2.5 pt-2 border-t border-zinc-100 text-xs">
              <span className="text-zinc-400 font-medium">Active:</span>

              {searchFilters.maxPrice && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                  <span>Under ${searchFilters.maxPrice.toLocaleString()}</span>
                  <button onClick={() => setSearchFilters({ maxPrice: undefined })} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchFilters.category && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-800 text-[11px] font-medium border border-orange-200">
                  <span>{searchFilters.category}</span>
                  <button onClick={() => setSearchFilters({ category: '' })} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchFilters.transmission && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-medium border border-zinc-200">
                  <span>{searchFilters.transmission}</span>
                  <button onClick={() => setSearchFilters({ transmission: '' })} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchFilters.hasColdStart && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-medium border border-orange-300">
                  <span>Cold-Start Video Only</span>
                  <button onClick={() => setSearchFilters({ hasColdStart: false })} className="hover:text-red-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-[11px] text-[#EA580C] font-semibold hover:underline flex items-center gap-0.5 ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all</span>
              </button>

              <button
                onClick={() => saveCurrentSearch()}
                className="text-[11px] text-zinc-600 hover:text-zinc-900 font-semibold flex items-center gap-1 ml-auto cursor-pointer"
              >
                <Bookmark className="w-3 h-3 text-[#EA580C]" />
                <span>Save this search</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Inventory Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Results Count Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-heading">
              Available Whips
            </h1>
            <span className="text-xs font-mono font-bold text-zinc-500">
              ({listings.length} {listings.length === 1 ? 'vehicle' : 'vehicles'} found)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
            <span>
              Searching near {searchFilters.zip || activeMarket.defaultZip} ({searchFilters.radiusMiles || 50} mi)
            </span>
          </div>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {listings.map((listing) => (
              <VehicleCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          /* Empty State - Section 53 Requirement */
          <div className="bg-white border border-zinc-200 rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto my-8 shadow-xs">
            <div className="w-16 h-16 bg-orange-50 text-[#EA580C] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 font-heading uppercase">
              No whips found.
            </h2>
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
              Try expanding your search radius, loosening your price cap, or removing specific filter requirements.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setSearchFilters({ radiusMiles: 250, maxPrice: undefined });
                }}
                className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Expand Radius to 250 Miles
              </button>
              <button
                onClick={resetFilters}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => saveCurrentSearch()}
                className="bg-orange-50 hover:bg-orange-100 text-[#EA580C] border border-orange-200 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save This Search Alert</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Filter Drawer Modal */}
      <FilterDrawer isOpen={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)} />
    </div>
  );
};
