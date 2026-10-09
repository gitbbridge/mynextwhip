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
  Car,
  Gavel,
  Flame,
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
    searchFilters.listingFormat && searchFilters.listingFormat !== 'ALL' ? true : false,
    searchFilters.noReserveOnly,
  ].filter(Boolean).length;

  const liveAuctionsCount = allListings.filter(
    (l) => l.listingFormat === 'AUCTION' && l.status === 'ACTIVE'
  ).length;

  return (
    <div className="min-h-screen bg-[#FAFAFB] pb-20">
      {/* Top Search & Filter Bar */}
      <div className="bg-white border-b border-slate-200/90 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Quick search input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search year, make, model, trim, keywords..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSearchFilters({ keyword: '' });
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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
                  className="bg-slate-100 hover:bg-slate-200/60 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 py-2 px-3 focus:outline-none focus:border-slate-800 cursor-pointer transition-colors"
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
                  className="bg-slate-100 hover:bg-slate-200/60 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 py-2 px-3 focus:outline-none focus:border-slate-800 cursor-pointer transition-colors"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="ending_soon">Ending Soonest (Auctions)</option>
                  <option value="bids_desc">Most Bids (Auctions)</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="distance">Distance: Closest</option>
                  <option value="mileage_asc">Mileage: Lowest</option>
                </select>
              </div>

              {/* Filter Drawer Trigger */}
              <button
                onClick={() => setFilterDrawerOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                  activeFilterCount > 0
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                  <span className="bg-[#C2410C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Clean Segmented Format & Category Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2.5 scrollbar-none text-xs">
            <button
              onClick={() => setSearchFilters({ listingFormat: 'ALL', noReserveOnly: false })}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                (!searchFilters.listingFormat || searchFilters.listingFormat === 'ALL') && !searchFilters.noReserveOnly
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              All Inventory
            </button>

            <button
              onClick={() => setSearchFilters({ listingFormat: 'AUCTION', noReserveOnly: false })}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                searchFilters.listingFormat === 'AUCTION' && !searchFilters.noReserveOnly
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <Gavel className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Live Auctions</span>
              {liveAuctionsCount > 0 && (
                <span className="bg-slate-200 text-slate-800 text-[10px] font-semibold px-1.5 py-0.2 rounded">
                  {liveAuctionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setSearchFilters({ listingFormat: 'AUCTION', noReserveOnly: true })}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                searchFilters.noReserveOnly
                  ? 'bg-[#C2410C] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>No Reserve</span>
            </button>

            <button
              onClick={() => setSearchFilters({ category: 'Van' })}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                searchFilters.category === 'Van'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              Vans & Campers
            </button>

            <button
              onClick={() => setSearchFilters({ category: 'Work Truck' })}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                searchFilters.category === 'Work Truck'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              Pickup Trucks
            </button>

            <button
              onClick={() => setSearchFilters({ category: '4x4' })}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                searchFilters.category === '4x4'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              4x4 & Adventure
            </button>

            <button
              onClick={() => setSearchFilters({ maxPrice: 5000 })}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                searchFilters.maxPrice === 5000
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
              }`}
            >
              Under $5,000
            </button>
          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap mt-2.5 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium">Active filters:</span>

              {searchFilters.maxPrice && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                  <span>Under ${searchFilters.maxPrice.toLocaleString()}</span>
                  <button onClick={() => setSearchFilters({ maxPrice: undefined })} className="hover:text-red-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchFilters.category && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                  <span>{searchFilters.category}</span>
                  <button onClick={() => setSearchFilters({ category: '' })} className="hover:text-red-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchFilters.transmission && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                  <span>{searchFilters.transmission}</span>
                  <button onClick={() => setSearchFilters({ transmission: '' })} className="hover:text-red-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchFilters.hasColdStart && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                  <span>Cold-Start Video Only</span>
                  <button onClick={() => setSearchFilters({ hasColdStart: false })} className="hover:text-red-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchFilters.listingFormat && searchFilters.listingFormat !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200">
                  <span>{searchFilters.listingFormat === 'AUCTION' ? 'Auctions Only' : 'Fixed Price Only'}</span>
                  <button onClick={() => setSearchFilters({ listingFormat: 'ALL' })} className="hover:text-red-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchFilters.noReserveOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-orange-50 text-[#C2410C] text-[11px] font-medium border border-orange-200">
                  <span>No Reserve Only</span>
                  <button onClick={() => setSearchFilters({ noReserveOnly: false })} className="hover:text-red-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-[11px] text-slate-600 hover:text-slate-900 font-medium hover:underline flex items-center gap-1 ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset filters</span>
              </button>

              <button
                onClick={() => saveCurrentSearch()}
                className="text-[11px] text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 ml-auto cursor-pointer"
              >
                <Bookmark className="w-3 h-3 text-[#C2410C]" />
                <span>Save this search</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Inventory Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
          <div className="flex items-baseline gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Available Inventory
            </h1>
            <span className="text-xs text-slate-500 tabular-nums">
              ({listings.length} {listings.length === 1 ? 'vehicle' : 'vehicles'})
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
            <span>
              Near {searchFilters.zip || activeMarket.defaultZip} · {searchFilters.radiusMiles || 50} mi radius
            </span>
          </div>
        </div>

        {/* Listings Grid */}
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <VehicleCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-slate-200/90 rounded-2xl p-10 sm:p-14 text-center max-w-lg mx-auto my-8 shadow-xs">
            <div className="w-12 h-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-heading">
              No vehicles matched your criteria
            </h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Try broadening your distance radius, adjusting your price cap, or clearing filters.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2.5">
              <button
                onClick={() => {
                  setSearchFilters({ radiusMiles: 250, maxPrice: undefined });
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-4 py-2.5 rounded-lg transition cursor-pointer"
              >
                Expand Radius to 250 Miles
              </button>
              <button
                onClick={resetFilters}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium px-4 py-2.5 rounded-lg transition cursor-pointer"
              >
                Reset All Filters
              </button>
              <button
                onClick={() => saveCurrentSearch()}
                className="bg-orange-50 hover:bg-orange-100 text-[#C2410C] border border-orange-200 text-xs font-medium px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save Search Alert</span>
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
