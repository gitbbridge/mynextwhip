import React from 'react';
import { Listing } from '../../types';
import { useApp } from '../../context/AppContext';
import { AuctionCountdown } from '../auction/AuctionCountdown';
import {
  Heart,
  Video,
  CheckCircle2,
  MapPin,
  Flame,
  ShieldCheck,
  AlertCircle,
  Gavel,
  Wrench,
} from 'lucide-react';
import { formatDistance } from '../../services/geoService';

interface VehicleCardProps {
  listing: Listing;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ listing }) => {
  const { navigateTo, isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(listing.id);

  const isAuction = listing.listingFormat === 'AUCTION' && !!listing.auction;
  const primaryPhoto =
    listing.photos[0]?.url ||
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';

  const handleClick = () => {
    navigateTo('detail', listing.slug);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  return (
    <article
      onClick={handleClick}
      className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer overflow-hidden"
    >
      {/* Media Top Container */}
      <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
        <img
          src={primaryPhoto}
          alt={`${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {isAuction ? (
            <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <Gavel className="w-3 h-3 text-orange-400" />
              <span>Live Auction</span>
            </span>
          ) : listing.featured ? (
            <span className="bg-slate-900/90 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
              Featured
            </span>
          ) : null}

          <span className="bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-medium px-2 py-0.5 rounded-md shadow-2xs">
            {listing.category}
          </span>
        </div>

        {/* Favorite Action */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white backdrop-blur-xs flex items-center justify-center text-slate-700 transition-colors shadow-2xs cursor-pointer"
          title="Save vehicle"
          aria-label="Save vehicle"
        >
          <Heart
            className={`w-4 h-4 transition ${
              favorited ? 'text-[#C2410C] fill-[#C2410C]' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Bottom Left: Auction Countdown or Cold Start indicator */}
        {isAuction && listing.auction ? (
          <div className="absolute bottom-2.5 left-2.5">
            <AuctionCountdown auction={listing.auction} compact />
          </div>
        ) : listing.coldStartVideo ? (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-md shadow-xs">
            <Video className="w-3 h-3 text-orange-400" />
            <span>Cold-Start Video</span>
          </div>
        ) : null}

        {/* Bottom Right: Title status */}
        <div className="absolute bottom-2.5 right-2.5">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-xs shadow-2xs ${
              listing.vehicle.titleStatus === 'Clean'
                ? 'bg-emerald-950/80 text-emerald-200'
                : 'bg-slate-900/80 text-slate-200'
            }`}
          >
            {listing.vehicle.titleStatus} Title
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price / Current Bid Header */}
          <div className="flex items-baseline justify-between">
            <div>
              {isAuction ? (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#C2410C] tracking-wider block">
                    Current Bid ({listing.auction?.bidsCount || 0} bids)
                  </span>
                  <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                    ${(listing.auction?.currentBid || listing.askingPrice).toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                  ${listing.askingPrice.toLocaleString()}
                </div>
              )}
            </div>

            <div className="text-xs font-medium text-slate-500 text-right">
              {listing.vehicle.transmission} · {listing.vehicle.drivetrain}
            </div>
          </div>

          {/* Year Make Model Trim */}
          <h3 className="font-bold text-base text-slate-900 group-hover:text-[#C2410C] transition-colors line-clamp-1 mt-1 font-heading">
            {listing.vehicle.year} {listing.vehicle.make} {listing.vehicle.model}
            {listing.vehicle.trim && (
              <span className="text-slate-500 font-normal text-sm ml-1.5 font-sans">
                {listing.vehicle.trim}
              </span>
            )}
          </h3>

          {/* Mileage & Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2 font-normal">
            <span className="font-medium text-slate-800 tabular-nums">
              {listing.vehicle.mileage.toLocaleString()} miles
            </span>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">
                {listing.location.city}, {listing.location.state}
              </span>
              {listing.distanceMiles !== undefined && (
                <span className="text-slate-400 text-[11px]">
                  ({formatDistance(listing.distanceMiles)})
                </span>
              )}
            </div>
          </div>

          {/* Disclosed Issues Preview (Quiet, refined, unboxed) */}
          <div className="mt-3 pt-2.5 border-t border-slate-100">
            {listing.issues && listing.issues.length > 0 ? (
              <div className="flex items-start gap-1.5 text-[11px] text-amber-900">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="line-clamp-1">
                  <span className="font-medium text-amber-800">Disclosed:</span>{' '}
                  <span className="text-slate-600">
                    {listing.issues.map((i) => i.title).join(' · ')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>No major mechanical issues reported</span>
              </div>
            )}
          </div>
        </div>

        {/* Verification Checkmarks Footer */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-2.5">
            {listing.verifications.vinDecoded && (
              <span className="inline-flex items-center gap-1 text-slate-600 font-medium" title="NHTSA VIN verified">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>VIN</span>
              </span>
            )}
            {listing.verifications.titleReviewed && (
              <span className="inline-flex items-center gap-1 text-slate-600 font-medium" title="Title document checked">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Title</span>
              </span>
            )}
            {listing.verifications.coldStartProvided && (
              <span className="inline-flex items-center gap-1 text-slate-600 font-medium" title="Cold start video available">
                <Video className="w-3 h-3 text-[#C2410C]" />
                <span>Video</span>
              </span>
            )}
          </div>

          <span className="text-[10px] text-slate-400 uppercase font-medium tracking-wider">
            {isAuction ? 'Auction' : listing.seller.isDealer ? 'Dealer' : 'Private'}
          </span>
        </div>
      </div>
    </article>
  );
};
