import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Filter, RefreshCw, Car, Gavel, Search, ChevronRight } from 'lucide-react';
import { Listing } from '../../../types';
import { fetchListings } from '../../../services/api';
import { Badge, Card, SkeletonCard, Button } from '../ui/Primitives';

interface HomeScreenProps {
  onSelectListing: (listing: Listing) => void;
  activeListingId?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectListing }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'BIN' | 'AUCTION'>('ALL');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('Denver Metro · 25 mi radius');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchListings({
        type: typeFilter === 'ALL' ? undefined : typeFilter,
        verified: verifiedOnly ? true : undefined,
      });
      setListings(data);
    } catch (err: any) {
      console.error('Failed to load listings:', err);
      setError(err.message || 'Unable to connect to Denver inventory feed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [typeFilter, verifiedOnly]);

  const filteredListings = listings.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = `${l.vehicle.year} ${l.vehicle.make} ${l.vehicle.model}`.toLowerCase();
    return title.includes(q) || l.location.city.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-950 font-heading tracking-tight">
              Nearby Listings
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span>{locationName}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setLocationName('Denver, CO · 25 mi');
              loadData();
            }}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 border border-indigo-100 rounded-xl px-2.5 py-1.5 min-h-[36px] active:scale-95 transition-transform"
          >
            Use Denver Area
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search make, model, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/90 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Chips (>= 44px tap target height) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5 pb-1">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
              typeFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Whips
          </button>

          <button
            onClick={() => setTypeFilter('BIN')}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all active:scale-95 ${
              typeFilter === 'BIN'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Buy It Now</span>
          </button>

          <button
            onClick={() => setTypeFilter('AUCTION')}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all active:scale-95 ${
              typeFilter === 'AUCTION'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/60'
            }`}
          >
            <Gavel className="w-3.5 h-3.5" />
            <span>Live Auction</span>
          </button>

          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all active:scale-95 ${
              verifiedOnly
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Title</span>
          </button>
        </div>
      </div>

      {/* Main Content Feed */}
      <div className="p-4 space-y-4 flex-1">
        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3 my-6">
            <p className="text-sm font-bold text-rose-900">{error}</p>
            <p className="text-xs text-rose-600">Check your network connection and try again.</p>
            <Button variant="outline" size="sm" onClick={loadData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
              Retry Connection
            </Button>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-3 my-8">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No matching vehicles found</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Try resetting your filters or clearing search terms to explore available Front Range inventory.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setTypeFilter('ALL');
                setVerifiedOnly(false);
                setSearchQuery('');
              }}
            >
              Reset All Filters
            </Button>
          </div>
        ) : (
          filteredListings.map((listing, index) => {
            const isAuction = listing.listingFormat === 'AUCTION';
            const statusVariant =
              listing.status === 'ACTIVE'
                ? 'active'
                : listing.status === 'COMMITTED'
                ? 'committed'
                : 'settled';

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
              >
                <Card
                  interactive
                  padding="none"
                  onClick={() => onSelectListing(listing)}
                  className="group relative"
                >
                  {/* Photo container */}
                  <div className="relative w-full h-44 bg-slate-900 overflow-hidden">
                    <img
                      src={listing.photos[0]?.url || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=400&q=80'}
                      alt={`${listing.vehicle.year} ${listing.vehicle.make}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Format pill overlay */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <Badge variant={isAuction ? 'auction' : 'bin'} size="sm">
                        {isAuction ? 'Live Auction' : 'Buy It Now'}
                      </Badge>
                      {listing.verifications.titleReviewed && (
                        <Badge variant="verified" size="sm">
                          Verified Title
                        </Badge>
                      )}
                    </div>

                    {/* Status badge top right */}
                    <div className="absolute top-3 right-3">
                      <Badge variant={statusVariant} size="sm" dot>
                        {listing.status === 'ACTIVE'
                          ? 'ACTIVE'
                          : listing.status === 'COMMITTED'
                          ? 'HELD ($25 HOLD)'
                          : 'SETTLED'}
                      </Badge>
                    </div>

                    {/* Cold start pill */}
                    {listing.verifications.coldStartProvided && (
                      <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-[10px] text-white font-semibold flex items-center gap-1">
                        <span>▶ Cold Start Video Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-black text-slate-900 font-heading tracking-tight leading-snug">
                          {listing.vehicle.year} {listing.vehicle.make} {listing.vehicle.model}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {listing.vehicle.mileage.toLocaleString()} mi · {listing.location.city}, CO
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-lg font-black text-slate-950 font-mono-numbers leading-tight">
                          ${listing.askingPrice.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          {isAuction ? 'Current Bid' : 'Asking Price'}
                        </span>
                      </div>
                    </div>

                    {/* Imperfections highlight */}
                    {listing.issues.length > 0 && (
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                        <span className="text-[11px] truncate max-w-[240px]">
                          Reported: {listing.issues[0].title}
                        </span>
                        <span className="text-indigo-600 font-bold text-xs flex items-center gap-0.5 shrink-0">
                          <span>Details</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
