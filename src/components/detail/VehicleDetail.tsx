import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhotoVideoGallery } from './PhotoVideoGallery';
import { WhipReportSection } from './WhipReportSection';
import { OfferModal } from './OfferModal';
import { AppointmentModal } from './AppointmentModal';
import { ReportModal } from './ReportModal';
import { VerificationBadge } from '../common/VerificationBadge';
import {
  Heart,
  Share2,
  Flag,
  ArrowLeft,
  MapPin,
  Calendar,
  Gauge,
  ShieldCheck,
  MessageSquare,
  DollarSign,
  Clock,
  Sparkles,
  Phone,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatDistance } from '../../services/geoService';

interface VehicleDetailProps {
  slug: string;
}

export const VehicleDetail: React.FC<VehicleDetailProps> = ({ slug }) => {
  const {
    allListings,
    navigateTo,
    isFavorite,
    toggleFavorite,
    startOrOpenConversation,
    showNotification,
  } = useApp();

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const listing = allListings.find((l) => l.slug === slug || l.id === slug);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-zinc-900 font-heading">Whip Not Found</h2>
        <p className="text-sm text-zinc-600 mt-2">
          This vehicle listing may have sold or been removed by the seller.
        </p>
        <button
          onClick={() => navigateTo('browse')}
          className="mt-4 px-5 py-2.5 bg-[#EA580C] text-white font-bold rounded-xl text-sm"
        >
          Return to Browse
        </button>
      </div>
    );
  }

  const favorited = isFavorite(listing.id);
  const vehicleTitle = `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model} ${listing.vehicle.trim || ''}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showNotification('Link copied to clipboard!', 'info');
    }
  };

  const handleContactSeller = () => {
    startOrOpenConversation(listing.id, listing.sellerId);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-28 md:pb-16">
      {/* Top Breadcrumb & Nav */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigateTo('browse')}
            className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
              title="Share listing link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(listing.id)}
              className="p-2 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
              title="Save whip"
            >
              <Heart
                className={`w-4 h-4 ${
                  favorited ? 'text-[#EA580C] fill-[#EA580C]' : 'text-zinc-600'
                }`}
              />
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
              title="Report listing"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Photos, Videos & Whip Report (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Gallery Component */}
            <PhotoVideoGallery
              photos={listing.photos}
              coldStartVideo={listing.coldStartVideo}
              walkaroundVideo={listing.walkaroundVideo}
              vehicleTitle={vehicleTitle}
            />

            {/* The Whip Report (Core differentiator) */}
            <WhipReportSection
              sellerDescription={listing.sellerDescription}
              issues={listing.issues}
              serviceRecords={listing.serviceRecords}
            />
          </div>

          {/* Right Column: Pricing, Vehicle Facts & Seller Profile (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Main Price & Primary Action Card */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 font-mono">
                    Asking Price
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-zinc-900 font-mono-numbers">
                    ${listing.askingPrice.toLocaleString()}
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    listing.vehicle.titleStatus === 'Clean'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {listing.vehicle.titleStatus} Title
                </span>
              </div>

              {/* Title & Mileage */}
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-heading leading-tight">
                  {listing.vehicle.year} {listing.vehicle.make} {listing.vehicle.model}
                </h1>
                {listing.vehicle.trim && (
                  <p className="text-sm text-zinc-500 font-medium">{listing.vehicle.trim}</p>
                )}

                <div className="flex items-center gap-3 text-xs text-zinc-600 font-medium mt-2">
                  <span className="font-mono font-bold text-zinc-900 text-sm">
                    {listing.vehicle.mileage.toLocaleString()} miles
                  </span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                    <span>
                      {listing.location.city}, {listing.location.state}
                    </span>
                    {listing.distanceMiles !== undefined && (
                      <span className="text-zinc-400">({formatDistance(listing.distanceMiles)})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Direct Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleContactSeller}
                  className="w-full py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold uppercase tracking-wider text-xs sm:text-sm rounded-xl transition shadow-md shadow-orange-950/20 flex items-center justify-center gap-2 cursor-pointer font-heading"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message Seller</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setOfferModalOpen(true)}
                    className="py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-orange-400" />
                    <span>Make Offer</span>
                  </button>

                  <button
                    onClick={() => setAppointmentModalOpen(true)}
                    className="py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs uppercase tracking-wider rounded-xl border border-zinc-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>

              {/* Verification Badges Section */}
              <div className="pt-3 border-t border-zinc-100 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 font-mono">
                  Verified Documentation
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {listing.verifications.vinDecoded && <VerificationBadge type="vin" compact />}
                  {listing.verifications.titleReviewed && <VerificationBadge type="title" compact />}
                  {listing.verifications.coldStartProvided && <VerificationBadge type="coldStart" compact />}
                  {listing.verifications.walkaroundProvided && <VerificationBadge type="walkaround" compact />}
                  {listing.verifications.serviceRecordsProvided && <VerificationBadge type="serviceRecords" compact />}
                </div>
              </div>
            </div>

            {/* Vehicle Facts Grid (Section 20) */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-4">
                VEHICLE FACTS & SPECS
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <dt className="text-zinc-400">VIN</dt>
                  <dd className="font-mono font-bold text-zinc-900 tracking-wider">
                    {listing.vehicle.vin}
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Mileage</dt>
                  <dd className="font-mono font-bold text-zinc-900">
                    {listing.vehicle.mileage.toLocaleString()} mi
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Engine</dt>
                  <dd className="font-medium text-zinc-900">{listing.vehicle.engine}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Transmission</dt>
                  <dd className="font-medium text-zinc-900">{listing.vehicle.transmission}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Drivetrain</dt>
                  <dd className="font-medium text-zinc-900">{listing.vehicle.drivetrain}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Body Style</dt>
                  <dd className="font-medium text-zinc-900">{listing.vehicle.bodyStyle}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Exterior Color</dt>
                  <dd className="font-medium text-zinc-900">{listing.vehicle.exteriorColor}</dd>
                </div>
                <div>
                  <dt className="text-zinc-400">Fuel Type</dt>
                  <dd className="font-medium text-zinc-900">{listing.vehicle.fuelType}</dd>
                </div>
              </dl>

              {listing.vehicle.modifications && (
                <div className="mt-4 pt-3 border-t border-zinc-100 text-xs">
                  <span className="text-zinc-400 font-medium">Modifications / Aftermarket:</span>
                  <p className="font-medium text-zinc-800 mt-0.5">{listing.vehicle.modifications}</p>
                </div>
              )}
            </div>

            {/* Seller Profile Card (Section 34) */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono mb-3">
                SELLER PROFILE
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                />
                <div>
                  <div className="font-bold text-sm text-zinc-900 flex items-center gap-1.5">
                    <span>{listing.seller.name}</span>
                    {listing.seller.verifiedSeller && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-500">
                    Member since {listing.seller.memberSince} · {listing.seller.city}, {listing.seller.state}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-zinc-100 text-xs text-zinc-600">
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Response Rate</span>
                  <div className="font-bold text-zinc-900">{listing.seller.responseRate}</div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-400 uppercase">Typical Reply</span>
                  <div className="font-bold text-zinc-900">{listing.seller.responseTime}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Phone & Government ID Verified Seller</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar (Section 19: $8,900 | MESSAGE | OFFER) */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-zinc-400 font-bold uppercase">Price</div>
          <div className="text-xl font-black text-zinc-900 font-mono-numbers">
            ${listing.askingPrice.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          <button
            onClick={() => setOfferModalOpen(true)}
            className="px-3.5 py-2.5 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
          >
            Offer
          </button>
          <button
            onClick={handleContactSeller}
            className="px-4 py-2.5 bg-[#EA580C] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm cursor-pointer"
          >
            Message
          </button>
        </div>
      </div>

      {/* Interaction Modals */}
      <OfferModal
        listingId={listing.id}
        askingPrice={listing.askingPrice}
        vehicleTitle={vehicleTitle}
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
      />

      <AppointmentModal
        listingId={listing.id}
        vehicleTitle={vehicleTitle}
        locationCity={listing.location.city}
        locationState={listing.location.state}
        isOpen={appointmentModalOpen}
        onClose={() => setAppointmentModalOpen(false)}
      />

      <ReportModal
        listingId={listing.id}
        vehicleTitle={vehicleTitle}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};
