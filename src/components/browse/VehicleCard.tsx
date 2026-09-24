import React from 'react';
import { Listing } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  Video,
  CheckCircle2,
  MapPin,
  Flame,
  ShieldCheck,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { formatDistance } from '../../services/geoService';

interface VehicleCardProps {
  listing: Listing;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ listing }) => {
  const { navigateTo, isFavorite, toggleFavorite } = useApp();
  const favorited = isFavorite(listing.id);

  const primaryPhoto = listing.photos[0]?.url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80';

  const handleClick = () => {
    navigateTo('detail', listing.slug);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  return (
    <div
      onClick={handleClick}
      className="group bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Media Top Container */}
      <div className="relative aspect-16/10 bg-zinc-900 overflow-hidden">
        <img
          src={primaryPhoto}
          alt={`${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
          {listing.featured && (
            <span className="bg-[#EA580C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm font-heading">
              Featured Whip
            </span>
          )}
          <span className="bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
            {listing.category}
          </span>
        </div>

        {/* Top Right: Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xs flex items-center justify-center text-white transition cursor-pointer"
          title="Save this Whip"
        >
          <Heart
            className={`w-4 h-4 transition ${
              favorited ? 'text-[#EA580C] fill-[#EA580C]' : 'text-white'
            }`}
          />
        </button>

        {/* Bottom Floating Pill: Cold Start Video Indicator */}
        {listing.coldStartVideo && (
          <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 bg-black/80 backdrop-blur-xs text-orange-400 border border-orange-500/40 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
            <Flame className="w-3.5 h-3.5 fill-orange-400/30" />
            <span>Cold-Start Video ({listing.coldStartVideo.durationSeconds || 30}s)</span>
          </div>
        )}

        {/* Title status badge on bottom right */}
        <div className="absolute bottom-2.5 right-2.5">
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
              listing.vehicle.titleStatus === 'Clean'
                ? 'bg-emerald-600/90 text-white'
                : listing.vehicle.titleStatus === 'Rebuilt'
                ? 'bg-amber-600/90 text-white'
                : 'bg-zinc-800 text-white'
            }`}
          >
            {listing.vehicle.titleStatus} Title
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Price & Transmission */}
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-zinc-900 font-mono-numbers tracking-tight">
              ${listing.askingPrice.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              {listing.vehicle.transmission} · {listing.vehicle.drivetrain}
            </div>
          </div>

          {/* Year Make Model Trim */}
          <h3 className="font-extrabold text-base sm:text-lg text-zinc-900 font-heading leading-tight mt-1 group-hover:text-[#EA580C] transition-colors line-clamp-1">
            {listing.vehicle.year} {listing.vehicle.make} {listing.vehicle.model}
            {listing.vehicle.trim && (
              <span className="text-zinc-500 font-normal text-sm ml-1.5 font-sans">
                {listing.vehicle.trim}
              </span>
            )}
          </h3>

          {/* Mileage & Location */}
          <div className="flex items-center gap-2 text-xs text-zinc-600 mt-2 font-medium">
            <span className="font-mono font-bold text-zinc-800">
              {listing.vehicle.mileage.toLocaleString()} miles
            </span>
            <span className="text-zinc-300">·</span>
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
              <span className="truncate">
                {listing.location.city}, {listing.location.state}
              </span>
              {listing.distanceMiles !== undefined && (
                <span className="text-zinc-500 text-[11px]">
                  ({formatDistance(listing.distanceMiles)})
                </span>
              )}
            </div>
          </div>

          {/* Honest Disclosures Box (The differentiator!) */}
          {listing.issues && listing.issues.length > 0 ? (
            <div className="mt-3 py-1.5 px-2.5 bg-amber-50/80 border border-amber-200/70 rounded-lg text-[11px] text-amber-900 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div className="line-clamp-1 font-medium">
                <span className="font-bold">Disclosed:</span>{' '}
                {listing.issues.map((i) => i.title).join(' · ')}
              </div>
            </div>
          ) : (
            <div className="mt-3 py-1.5 px-2.5 bg-emerald-50/70 border border-emerald-200/70 rounded-lg text-[11px] text-emerald-800 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>No major mechanical issues disclosed</span>
            </div>
          )}
        </div>

        {/* Footer verification checkmarks */}
        <div className="mt-3.5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            {listing.verifications.vinDecoded && (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold" title="NHTSA VIN verified">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>VIN</span>
              </span>
            )}
            {listing.verifications.titleReviewed && (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold" title="Title paperwork reviewed">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Title</span>
              </span>
            )}
            {listing.verifications.coldStartProvided && (
              <span className="inline-flex items-center gap-1 text-orange-700 font-semibold" title="Cold start video available">
                <Video className="w-3 h-3 text-orange-600" />
                <span>Cold Start</span>
              </span>
            )}
            {listing.verifications.serviceRecordsProvided && (
              <span className="inline-flex items-center gap-1 text-slate-700 font-semibold" title="Maintenance records attached">
                <FileText className="w-3 h-3 text-slate-500" />
                <span>Records</span>
              </span>
            )}
          </div>

          <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
            {listing.seller.isDealer ? 'Dealer' : 'Private Party'}
          </span>
        </div>
      </div>
    </div>
  );
};
