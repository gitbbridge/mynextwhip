import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PhotoVideoGallery } from './PhotoVideoGallery';
import { WhipReportSection } from './WhipReportSection';
import { OfferModal } from './OfferModal';
import { AppointmentModal } from './AppointmentModal';
import { ReportModal } from './ReportModal';
import { VerificationBadge } from '../common/VerificationBadge';
import { AuctionCountdown } from '../auction/AuctionCountdown';
import { BidModal } from '../auction/BidModal';
import { RunAuctionModal } from '../auction/RunAuctionModal';
import {
  Heart,
  Share2,
  Flag,
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  MessageSquare,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Gavel,
  History,
} from 'lucide-react';
import { formatDistance } from '../../services/geoService';

interface VehicleDetailProps {
  slug: string;
}

export const VehicleDetail: React.FC<VehicleDetailProps> = ({ slug }) => {
  const {
    currentUser,
    allListings,
    navigateTo,
    isFavorite,
    toggleFavorite,
    startOrOpenConversation,
    showNotification,
    endAuctionEarly,
  } = useApp();

  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [runAuctionModalOpen, setRunAuctionModalOpen] = useState(false);

  const listing = allListings.find((l) => l.slug === slug || l.id === slug);

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#FAFAFB] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 font-heading">Vehicle Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">
          This vehicle listing may have sold or been removed by the seller.
        </p>
        <button
          onClick={() => navigateTo('browse')}
          className="mt-4 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm transition-colors cursor-pointer"
        >
          Return to Browse
        </button>
      </div>
    );
  }

  const isAuction = listing.listingFormat === 'AUCTION' && !!listing.auction;
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
    <div className="min-h-screen bg-[#FAFAFB] pb-28 md:pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => navigateTo('browse')}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Share listing link"
              aria-label="Share listing"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(listing.id)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Save vehicle"
              aria-label="Save vehicle"
            >
              <Heart
                className={`w-4 h-4 ${
                  favorited ? 'text-[#C2410C] fill-[#C2410C]' : 'text-slate-500'
                }`}
              />
            </button>
            <button
              onClick={() => setReportModalOpen(true)}
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
              title="Report listing"
              aria-label="Report listing"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Media Gallery & The Whip Report (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-8">
            <PhotoVideoGallery
              photos={listing.photos}
              coldStartVideo={listing.coldStartVideo}
              walkaroundVideo={listing.walkaroundVideo}
              vehicleTitle={vehicleTitle}
            />

            <WhipReportSection
              sellerDescription={listing.sellerDescription}
              issues={listing.issues}
              serviceRecords={listing.serviceRecords}
            />
          </div>

          {/* Right Column: Pricing & Purchase Module (4 cols on desktop) */}
          <div className="lg:col-span-4 space-y-6">
            {/* LIVE AUCTION CARD (IF AUCTION) */}
            {isAuction && listing.auction && (
              <div className="space-y-4">
                <AuctionCountdown auction={listing.auction} />

                {/* Auction Bidding Box */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-slate-500 block mb-0.5">
                        Minimum Next Bid
                      </span>
                      <div className="text-xl font-bold text-slate-900 tabular-nums">
                        ${((listing.auction.currentBid || listing.auction.startingBid) + (listing.auction.currentBid < 2000 ? 50 : 100)).toLocaleString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-medium text-slate-500 block mb-0.5">
                        Starting Bid
                      </span>
                      <div className="text-sm font-semibold text-slate-600 tabular-nums">
                        ${listing.auction.startingBid.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setBidModalOpen(true)}
                    className="w-full py-3.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer font-heading"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Place Bid</span>
                  </button>

                  {/* Bid History List */}
                  <div className="pt-3.5 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2.5">
                      <span className="flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-slate-400" />
                        <span>Bid History ({listing.auction.bidsCount})</span>
                      </span>
                      {listing.auction.isNoReserve && (
                        <span className="text-[10px] text-[#C2410C] font-semibold uppercase">
                          No Reserve
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {listing.auction.bids && listing.auction.bids.length > 0 ? (
                        listing.auction.bids.map((b, idx) => (
                          <div
                            key={b.id || idx}
                            className={`p-2 rounded-xl flex items-center justify-between text-xs ${
                              idx === 0
                                ? 'bg-orange-50/70 border border-orange-200/80 font-medium'
                                : 'bg-slate-50 text-slate-600'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <img
                                src={b.bidderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                                alt=""
                                className="w-5 h-5 rounded-full object-cover shrink-0"
                              />
                              <span className="truncate">{b.bidderName}</span>
                              {idx === 0 && (
                                <span className="bg-[#C2410C] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                                  High
                                </span>
                              )}
                            </div>
                            <span className="font-bold text-slate-900 tabular-nums">
                              ${b.amount.toLocaleString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-xs italic py-1">No bids yet. Be the first bidder!</p>
                      )}
                    </div>
                  </div>

                  {/* Seller Controls */}
                  {currentUser.id === listing.sellerId && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <UserCheck className="w-4 h-4 text-[#C2410C]" />
                        <span>You are the Seller</span>
                      </div>
                      {listing.auction.bidsCount > 0 && (
                        <button
                          onClick={() => endAuctionEarly(listing.id, true)}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium text-[11px] transition cursor-pointer"
                          title="Accept current high bid and conclude auction early"
                        >
                          Accept High Bid & End
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SELLER PROMO: Run an Auction for this Whip (if fixed-price) */}
            {!isAuction && currentUser.id === listing.sellerId && (
              <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-3 shadow-sm border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="font-semibold text-xs uppercase tracking-wider text-slate-200">
                      Seller Option: Live Auction
                    </span>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-orange-300 font-medium px-2 py-0.5 rounded border border-slate-700">
                    0% Commission
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Want competitive bidding? Launch a live auction with custom starting bids, reserve protection, and anti-sniping guarantees.
                </p>
                <button
                  onClick={() => setRunAuctionModalOpen(true)}
                  className="w-full py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Launch Live Auction</span>
                </button>
              </div>
            )}

            {/* Price & Primary Purchase Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-500 block mb-0.5">
                    {isAuction ? 'Current High Bid' : 'Asking Price'}
                  </span>
                  <div className="text-3xl font-bold text-slate-900 tabular-nums tracking-tight">
                    ${(isAuction ? listing.auction?.currentBid || listing.askingPrice : listing.askingPrice).toLocaleString()}
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                    listing.vehicle.titleStatus === 'Clean'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {listing.vehicle.titleStatus} Title
                </span>
              </div>

              {/* Title & Mileage */}
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading leading-tight">
                  {listing.vehicle.year} {listing.vehicle.make} {listing.vehicle.model}
                </h1>
                {listing.vehicle.trim && (
                  <p className="text-sm text-slate-500 font-normal">{listing.vehicle.trim}</p>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-600 mt-2">
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {listing.vehicle.mileage.toLocaleString()} miles
                  </span>
                  <span className="text-slate-300">·</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
                    <span>
                      {listing.location.city}, {listing.location.state}
                    </span>
                    {listing.distanceMiles !== undefined && (
                      <span className="text-slate-400">({formatDistance(listing.distanceMiles)})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {isAuction ? (
                  <button
                    onClick={() => setBidModalOpen(true)}
                    className="w-full py-3 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer font-heading"
                  >
                    <Gavel className="w-4 h-4" />
                    <span>Place Bid</span>
                  </button>
                ) : (
                  <button
                    onClick={handleContactSeller}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Message Seller</span>
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {isAuction ? (
                    <button
                      onClick={handleContactSeller}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Ask Seller</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setOfferModalOpen(true)}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Make Offer</span>
                    </button>
                  )}

                  <button
                    onClick={() => setAppointmentModalOpen(true)}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>

              {/* Verification Badges */}
              <div className="pt-3.5 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Listing Verifications
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

            {/* Vehicle Specifications */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
                Vehicle Specifications
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <dt className="text-slate-400">VIN</dt>
                  <dd className="font-mono font-semibold text-slate-900 tracking-wider">
                    {listing.vehicle.vin}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Mileage</dt>
                  <dd className="font-semibold text-slate-900 tabular-nums">
                    {listing.vehicle.mileage.toLocaleString()} mi
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Engine</dt>
                  <dd className="font-medium text-slate-900">{listing.vehicle.engine}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Transmission</dt>
                  <dd className="font-medium text-slate-900">{listing.vehicle.transmission}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Drivetrain</dt>
                  <dd className="font-medium text-slate-900">{listing.vehicle.drivetrain}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Body Style</dt>
                  <dd className="font-medium text-slate-900">{listing.vehicle.bodyStyle}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Exterior Color</dt>
                  <dd className="font-medium text-slate-900">{listing.vehicle.exteriorColor}</dd>
                </div>
                <div>
                  <dt className="text-slate-400">Fuel Type</dt>
                  <dd className="font-medium text-slate-900">{listing.vehicle.fuelType}</dd>
                </div>
              </dl>

              {listing.vehicle.modifications && (
                <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">Modifications / Notes:</span>
                  <p className="font-medium text-slate-800 mt-1">{listing.vehicle.modifications}</p>
                </div>
              )}
            </div>

            {/* Seller Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5">
                Seller Information
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={listing.seller.avatar}
                  alt={listing.seller.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <span>{listing.seller.name}</span>
                    {listing.seller.verifiedSeller && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Member since {listing.seller.memberSince} · {listing.seller.city}, {listing.seller.state}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-600">
                <div>
                  <span className="text-[11px] text-slate-400">Response Rate</span>
                  <div className="font-semibold text-slate-900 mt-0.5">{listing.seller.responseRate}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400">Typical Reply</span>
                  <div className="font-semibold text-slate-900 mt-0.5">{listing.seller.responseTime}</div>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center gap-2 text-[11px] text-emerald-900 bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified identity & phone number</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 shadow-xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] text-slate-400 font-medium uppercase">
            {isAuction ? 'Current Bid' : 'Price'}
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            ${(isAuction ? listing.auction?.currentBid || listing.askingPrice : listing.askingPrice).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-end">
          {isAuction ? (
            <button
              onClick={() => setBidModalOpen(true)}
              className="px-5 py-2.5 bg-[#C2410C] text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer font-heading"
            >
              Place Bid
            </button>
          ) : (
            <>
              <button
                onClick={() => setOfferModalOpen(true)}
                className="px-3.5 py-2.5 bg-slate-100 text-slate-800 font-medium text-xs rounded-xl cursor-pointer"
              >
                Offer
              </button>
              <button
                onClick={handleContactSeller}
                className="px-4 py-2.5 bg-slate-900 text-white font-semibold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Message
              </button>
            </>
          )}
        </div>
      </div>

      {/* Interaction Modals */}
      {isAuction && listing.auction && (
        <BidModal
          listingId={listing.id}
          vehicleTitle={vehicleTitle}
          auction={listing.auction}
          isOpen={bidModalOpen}
          onClose={() => setBidModalOpen(false)}
        />
      )}

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

      <RunAuctionModal
        listing={listing}
        isOpen={runAuctionModalOpen}
        onClose={() => setRunAuctionModalOpen(false)}
      />
    </div>
  );
};
