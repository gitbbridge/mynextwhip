import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from '../browse/VehicleCard';
import { RunAuctionModal } from '../auction/RunAuctionModal';
import { Listing } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  Gavel,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    allListings,
    offers,
    appointments,
    navigateTo,
    switchUser,
    allUsers,
    endAuctionEarly,
  } = useApp();

  const [auctionListingTarget, setAuctionListingTarget] = useState<Listing | null>(null);

  const userListings = allListings.filter((l) => l.sellerId === currentUser.id);
  const userOffers = offers.filter(
    (o) => o.buyerId === currentUser.id || o.sellerId === currentUser.id
  );
  const userAppointments = appointments.filter(
    (a) => a.buyerId === currentUser.id || a.sellerId === currentUser.id
  );

  return (
    <div className="min-h-screen bg-[#FAFAFB] pb-24">
      {/* Top Profile Header */}
      <div className="bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover border border-slate-200 shadow-2xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                    {currentUser.name}
                  </h1>
                  {currentUser.verifiedSeller && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentUser.email} · {currentUser.city}, {currentUser.state}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {currentUser.role}
                  </span>
                  <span className="text-[11px] font-medium bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ID & Phone Verified</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigateTo('sell')}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-orange-400" />
                <span>List a Vehicle ($19)</span>
              </button>
            </div>
          </div>

          {/* Test Persona Switcher */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Switch Persona:</span>
            {allUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer ${
                  currentUser.id === u.id
                    ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {u.name} ({u.role})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Your Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Your Vehicles ({userListings.length})
            </h2>
            <button
              onClick={() => navigateTo('sell')}
              className="text-xs font-semibold text-[#C2410C] hover:underline cursor-pointer"
            >
              + Create New Listing
            </button>
          </div>

          {userListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing) => {
                const isAuction = listing.listingFormat === 'AUCTION' && !!listing.auction;
                return (
                  <div key={listing.id} className="flex flex-col bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
                    <VehicleCard listing={listing} />

                    {/* Seller Auction Actions */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                      {isAuction && listing.auction ? (
                        <div className="space-y-2">
                          <div className="p-2.5 bg-orange-50/70 border border-orange-200/80 rounded-xl text-xs flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-[#C2410C] block">
                                Live Auction Active
                              </span>
                              <span className="font-bold text-slate-900 tabular-nums">
                                Current Bid: ${listing.auction.currentBid.toLocaleString()}
                              </span>
                              <span className="text-slate-500 ml-1.5 text-[11px] tabular-nums">
                                ({listing.auction.bidsCount} bids)
                              </span>
                            </div>
                            <div className="text-right">
                              {listing.auction.isNoReserve ? (
                                <span className="bg-[#C2410C] text-white text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase">
                                  No Reserve
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500 tabular-nums">
                                  Reserve: ${listing.auction.reservePrice?.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigateTo('detail', listing.slug)}
                              className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition text-center cursor-pointer"
                            >
                              View Auction
                            </button>
                            {listing.auction.bidsCount > 0 && (
                              <button
                                onClick={() => endAuctionEarly(listing.id, true)}
                                className="py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium rounded-lg transition text-center cursor-pointer"
                                title="Accept current high bid and conclude auction early"
                              >
                                Accept High Bid
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAuctionListingTarget(listing)}
                          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Gavel className="w-4 h-4 text-orange-400" />
                          <span>Launch Live Auction</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center text-xs text-slate-500">
              You haven't listed any vehicles yet. Click "List a Vehicle" to create your first transparent Whip Report.
            </div>
          )}
        </div>

        {/* Activity Summary (Offers & Appointments) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Offers */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Recent Offers ({userOffers.length})
              </h3>
              <button
                onClick={() => navigateTo('messages')}
                className="text-xs font-semibold text-[#C2410C] hover:underline cursor-pointer"
              >
                View Messages
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {userOffers.length > 0 ? (
                userOffers.map((o) => (
                  <div
                    key={o.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 tabular-nums">${o.amount.toLocaleString()}</span> on{' '}
                      <span className="font-medium text-slate-700">{o.listingTitle}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        o.status === 'ACCEPTED'
                          ? 'bg-emerald-50 text-emerald-800'
                          : o.status === 'REJECTED' || o.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs italic py-2">No active offers.</p>
              )}
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Upcoming Inspections ({userAppointments.length})
              </h3>
              <button
                onClick={() => navigateTo('safety')}
                className="text-xs font-semibold text-[#C2410C] hover:underline cursor-pointer"
              >
                Safety Guide
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {userAppointments.length > 0 ? (
                userAppointments.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold text-slate-900">{a.date} at {a.timeSlot}</span>
                      <div className="text-[11px] text-slate-500">{a.safeMeetupNote || a.listingTitle}</div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        a.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-800'
                          : a.status === 'DECLINED' || a.status === 'CANCELLED'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs italic py-2">No upcoming test drives or meetups.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Run Auction Modal from profile */}
      {auctionListingTarget && (
        <RunAuctionModal
          listing={auctionListingTarget}
          isOpen={!!auctionListingTarget}
          onClose={() => setAuctionListingTarget(null)}
        />
      )}
    </div>
  );
};
