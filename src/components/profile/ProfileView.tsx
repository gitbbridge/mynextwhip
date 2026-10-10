import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from '../browse/VehicleCard';
import { RunAuctionModal } from '../auction/RunAuctionModal';
import { Listing, Transaction, AddonType, ADDON_PRICING, calculatePerformanceFee } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  PlusCircle,
  Gavel,
  Lock,
  CreditCard,
  Check,
  X,
  AlertTriangle,
  Truck,
  Wrench,
  Shield,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    allListings,
    offers,
    appointments,
    transactions,
    finalizeTradeAndCaptureFee,
    claimFlakePenalty,
    releaseHoldForUndisclosedFlaw,
    navigateTo,
    switchUser,
    allUsers,
    endAuctionEarly,
    openAuthModal,
    logoutCustomer,
  } = useApp();

  const [auctionListingTarget, setAuctionListingTarget] = useState<Listing | null>(null);

  // Settlement modal state
  const [settleModalTx, setSettleModalTx] = useState<Transaction | null>(null);
  const [settlePriceInput, setSettlePriceInput] = useState<string>('4500');
  const [selectedAddons, setSelectedAddons] = useState<AddonType[]>([]);

  // Pass modal state
  const [passModalTx, setPassModalTx] = useState<Transaction | null>(null);
  const [passReasonInput, setPassReasonInput] = useState<string>('Undisclosed head gasket issue found on cold start');

  const userListings = allListings.filter((l) => l.sellerId === currentUser.id);
  const userOffers = offers.filter(
    (o) => o.buyerId === currentUser.id || o.sellerId === currentUser.id
  );
  const userAppointments = appointments.filter(
    (a) => a.buyerId === currentUser.id || a.sellerId === currentUser.id
  );
  const userTransactions = transactions.filter(
    (t) => t.buyerId === currentUser.id || t.sellerId === currentUser.id
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

          {/* Test Persona Switcher & New Account Creation */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 font-medium text-[11px]">Accounts & Personas:</span>
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

            <button
              onClick={() => openAuthModal('register')}
              className="px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-100 text-[#C2410C] border border-orange-200 font-semibold text-xs transition cursor-pointer"
            >
              + Create New User Account
            </button>
            <button
              onClick={() => openAuthModal('login')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs transition cursor-pointer"
            >
              Sign In Existing User
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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

        {/* SECTION: Transactions & Stripe Anti-Flake Pre-Authorizations */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#C2410C]" />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Transaction Commitments & Anti-Flake Holds ({userTransactions.length})
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage $25 Stripe pre-authorizations, finalize peer-to-peer trade closures, and enforce Seller Guarantees.
              </p>
            </div>
            <div className="text-[11px] px-2.5 py-1 rounded-full bg-orange-50 text-[#C2410C] font-semibold border border-orange-200 self-start sm:self-auto">
              Zero Commissions on Cash
            </div>
          </div>

          {userTransactions.length > 0 ? (
            <div className="space-y-4">
              {userTransactions.map((tx) => {
                const isBuyer = tx.buyerId === currentUser.id;
                const isSeller = tx.sellerId === currentUser.id;

                return (
                  <div
                    key={tx.id}
                    className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {tx.listingTitle}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            tx.status === 'HOLD_AUTHORIZED'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : tx.status === 'CAPTURED_PERFORMANCE'
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : tx.status === 'CAPTURED_PENALTY'
                              ? 'bg-red-100 text-red-900 border border-red-300'
                              : 'bg-slate-200 text-slate-800 border border-slate-300'
                          }`}
                        >
                          {tx.status === 'HOLD_AUTHORIZED' && '● $25 Hold Active'}
                          {tx.status === 'CAPTURED_PERFORMANCE' && '✓ Deal Settled'}
                          {tx.status === 'CAPTURED_PENALTY' && '⚠ $25 Penalty Captured'}
                          {tx.status === 'RELEASED_VOID' && '○ $0 Hold Released'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {isBuyer ? `Seller: ${tx.sellerName}` : `Buyer: ${tx.buyerName}`}
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Card Auth: •••• {tx.buyerCardLast4 || '4242'}</span>
                        <span>Stripe PI: <code className="font-mono text-[10px] bg-slate-200/80 px-1 rounded">{tx.stripePaymentIntentId}</code></span>
                        {tx.scheduledMeetTime && (
                          <span>Meetup: {new Date(tx.scheduledMeetTime).toLocaleDateString()}</span>
                        )}
                      </div>

                      {/* Add-ons list if any */}
                      {tx.addons.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {tx.addons.map((addon) => (
                            <span
                              key={addon.id}
                              className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700 flex items-center gap-1"
                            >
                              <span>{addon.name}</span>
                              <strong className="text-slate-900 font-mono">${addon.price}</strong>
                            </span>
                          ))}
                        </div>
                      )}

                      {tx.resolutionNote && (
                        <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-xl border border-slate-200/80">
                          {tx.resolutionNote}
                        </p>
                      )}
                    </div>

                    {/* Action buttons for Active Hold */}
                    {tx.status === 'HOLD_AUTHORIZED' && (
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => {
                            setSettleModalTx(tx);
                            setSettlePriceInput('4500');
                            setSelectedAddons([]);
                          }}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Close Deal & Settle Fee</span>
                        </button>

                        <button
                          onClick={() => {
                            setPassModalTx(tx);
                            setPassReasonInput('Undisclosed mechanical flaw identified on inspection');
                          }}
                          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs rounded-xl transition cursor-pointer"
                          title="Pass legitimately at $0 cost"
                        >
                          <span>Pass ($0 Release)</span>
                        </button>

                        {isSeller && (
                          <button
                            onClick={() => claimFlakePenalty(tx.id, 'Buyer no-show without 2-hour notice')}
                            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs rounded-xl transition cursor-pointer"
                            title="Claim $25 seller compensation"
                          >
                            <span>Claim $25 No-Show</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-500">
              <Lock className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <span>No transactions or pre-authorization holds yet. When a buyer books an inspection or bids, authorization holds appear here.</span>
            </div>
          )}
        </div>
      </div>

      {/* Settle Deal Modal */}
      {settleModalTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Settle Trade & Capture Performance Fee
                  </h3>
                  <p className="text-xs text-slate-500">{settleModalTx.listingTitle}</p>
                </div>
              </div>
              <button
                onClick={() => setSettleModalTx(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Final Agreed Sale Price ($ Cash / Cashier's Check)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={settlePriceInput}
                    onChange={(e) => setSettlePriceInput(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Fee Breakdown Display */}
              {(() => {
                const price = Number(settlePriceInput) || 0;
                const fee = calculatePerformanceFee(price);
                const addonsPrice = selectedAddons.reduce((sum, a) => sum + ADDON_PRICING[a].price, 0);
                const totalCharge = fee + addonsPrice;

                return (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-slate-600">
                      <span>Scaled Performance Fee:</span>
                      <span className="font-bold text-slate-900 font-mono">${fee.toFixed(2)}</span>
                    </div>
                    {addonsPrice > 0 && (
                      <div className="flex justify-between text-slate-600">
                        <span>Selected Add-ons:</span>
                        <span className="font-bold text-slate-900 font-mono">${addonsPrice.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                      <span>Total Captured from Linked Card:</span>
                      <span className="text-emerald-600 text-sm font-mono">${totalCharge.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Optional Ecosystem Add-ons checkable at point of intent */}
              <div>
                <span className="block text-xs font-bold text-slate-700 mb-1.5">
                  Point-of-Intent Ecosystem Add-ons (Optional)
                </span>
                <div className="space-y-2">
                  {(['FLATBED_TOWING', 'TEMP_INSURANCE'] as AddonType[]).map((type) => {
                    const addonInfo = ADDON_PRICING[type];
                    const isChecked = selectedAddons.includes(type);

                    return (
                      <label
                        key={type}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isChecked ? 'bg-orange-50 border-orange-300' : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAddons([...selectedAddons, type]);
                              } else {
                                setSelectedAddons(selectedAddons.filter((a) => a !== type));
                              }
                            }}
                            className="rounded text-[#C2410C] focus:ring-[#C2410C]"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{addonInfo.name}</span>
                            <span className="text-[11px] text-slate-500">{addonInfo.description}</span>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-slate-900 shrink-0 ml-2">
                          +${addonInfo.price}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setSettleModalTx(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const finalPrice = Number(settlePriceInput) || 0;
                  finalizeTradeAndCaptureFee(settleModalTx.id, finalPrice, selectedAddons);
                  setSettleModalTx(null);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirm Settlement</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pass / Release Hold Modal */}
      {passModalTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Release Authorization Hold ($0.00 Cost)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                If the car failed inspection or has undisclosed defects, your $25 authorization hold is canceled immediately with zero fees charged.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Passing
              </label>
              <textarea
                rows={2}
                value={passReasonInput}
                onChange={(e) => setPassReasonInput(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setPassModalTx(null)}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  releaseHoldForUndisclosedFlaw(passModalTx.id, passReasonInput);
                  setPassModalTx(null);
                }}
                className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                Release Hold at $0
              </button>
            </div>
          </div>
        </div>
      )}

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
