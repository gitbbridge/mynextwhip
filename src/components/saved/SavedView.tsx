import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from '../browse/VehicleCard';
import { Heart, Bookmark, Search, Trash2, ArrowRight } from 'lucide-react';

export const SavedView: React.FC = () => {
  const {
    favorites,
    allListings,
    savedSearches,
    removeSavedSearch,
    setSearchFilters,
    navigateTo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'whips' | 'searches'>('whips');

  const favoritedListings = allListings.filter((l) => favorites.includes(l.id));

  const handleExecuteSearch = (criteria: any) => {
    setSearchFilters(criteria);
    navigateTo('browse');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top Header */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 font-heading">
            Saved Whips & Searches
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Track price drops, vehicle status changes, and your custom saved search alerts.
          </p>

          {/* Tabs */}
          <div className="flex gap-4 mt-6 border-b border-zinc-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('whips')}
              className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'whips'
                  ? 'border-[#EA580C] text-[#EA580C]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Saved Whips ({favoritedListings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('searches')}
              className={`pb-3 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'searches'
                  ? 'border-[#EA580C] text-[#EA580C]'
                  : 'border-transparent text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved Searches ({savedSearches.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'whips' && (
          <div>
            {favoritedListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoritedListings.map((listing) => (
                  <VehicleCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
                <Heart className="w-10 h-10 text-zinc-300 mx-auto" />
                <h3 className="text-base font-bold text-zinc-900">No saved whips yet</h3>
                <p className="text-xs text-zinc-500">
                  Click the heart icon on any listing to save vehicles and track price drops.
                </p>
                <button
                  onClick={() => navigateTo('browse')}
                  className="mt-2 px-5 py-2.5 bg-[#EA580C] text-white text-xs font-bold rounded-xl"
                >
                  Browse Marketplace
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'searches' && (
          <div className="max-w-2xl mx-auto space-y-3">
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className="bg-white border border-zinc-200 rounded-2xl p-4 flex items-center justify-between shadow-2xs text-xs"
              >
                <div>
                  <h4 className="font-bold text-sm text-zinc-900">{search.name}</h4>
                  <p className="text-zinc-500 text-[11px] mt-0.5">
                    Saved on {new Date(search.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleExecuteSearch(search.criteria)}
                    className="px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>Run Search</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeSavedSearch(search.id)}
                    className="p-2 text-zinc-400 hover:text-red-600 rounded-lg transition cursor-pointer"
                    title="Delete saved search"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {savedSearches.length === 0 && (
              <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
                <Bookmark className="w-10 h-10 text-zinc-300 mx-auto" />
                <h3 className="text-base font-bold text-zinc-900">No saved searches</h3>
                <p className="text-xs text-zinc-500">
                  Save your favorite filter criteria while browsing to quickly check for new whips.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
