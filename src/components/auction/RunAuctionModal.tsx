import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Listing } from '../../types';
import {
  X,
  Gavel,
  DollarSign,
  Clock,
  Flame,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface RunAuctionModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RunAuctionModal: React.FC<RunAuctionModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { startAuctionForListing } = useApp();

  const [startingBid, setStartingBid] = useState<string>('1000');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [isNoReserve, setIsNoReserve] = useState<boolean>(true);
  const [reservePrice, setReservePrice] = useState<string>(
    listing.askingPrice ? Math.round(listing.askingPrice * 0.85).toString() : '3000'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const vehicleTitle = `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model} ${listing.vehicle.trim || ''}`;
  const primaryPhoto = listing.photos[0]?.url || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=400&q=80';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const startNum = parseInt(startingBid, 10);
    if (!startNum || startNum < 100) {
      setError('Starting bid must be at least $100.');
      return;
    }

    let reserveNum: number | undefined = undefined;
    if (!isNoReserve) {
      reserveNum = parseInt(reservePrice, 10);
      if (!reserveNum || reserveNum < startNum) {
        setError('Reserve price must be greater than or equal to starting bid.');
        return;
      }
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const res = startAuctionForListing(listing.id, {
        startingBid: startNum,
        isNoReserve,
        reservePrice: reserveNum,
        durationDays,
      });

      setIsSubmitting(false);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(res.error || 'Failed to start auction.');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#C2410C] flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Launch Live Auction for Your Whip
              </h3>
              <p className="text-xs text-slate-500">Enable competitive bidding from verified local buyers</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vehicle Summary Bar */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-200 flex items-center gap-3">
          <img
            src={primaryPhoto}
            alt=""
            className="w-12 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-xs text-slate-900 truncate font-heading">
              {vehicleTitle}
            </div>
            <div className="text-[11px] text-slate-500 tabular-nums">
              {listing.vehicle.mileage.toLocaleString()} mi · {listing.location.city}, {listing.location.state}
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 tabular-nums">
            Fixed was: ${listing.askingPrice.toLocaleString()}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Starting Bid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Opening Bid ($ USD)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                step={50}
                min={100}
                required
                value={startingBid}
                onChange={(e) => setStartingBid(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 tabular-nums"
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400">Presets:</span>
              {[500, 1000, 1500, 2000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setStartingBid(preset.toString())}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition cursor-pointer tabular-nums"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Auction Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Auction Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 5, 7, 10].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDurationDays(days)}
                  className={`py-2 px-1 text-xs font-semibold rounded-xl border transition cursor-pointer text-center ${
                    durationDays === days
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {days} Days
                  {days === 7 && (
                    <span className="block text-[10px] text-orange-400 font-normal">Popular</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Reserve Strategy */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <label className="block text-xs font-semibold text-slate-800">
              Reserve Protection
            </label>
            <div className="space-y-2">
              <label
                onClick={() => setIsNoReserve(true)}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                  isNoReserve
                    ? 'bg-orange-50/70 border-orange-300 text-orange-950'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="reserveOption"
                  checked={isNoReserve}
                  onChange={() => setIsNoReserve(true)}
                  className="mt-0.5 w-4 h-4 text-[#C2410C] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-900">
                    <Flame className="w-3.5 h-3.5 text-[#C2410C]" />
                    <span>No Reserve (Highest Buyer Engagement)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    The car will sell to the high bidder when the clock expires. Attracts the most active bidders.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setIsNoReserve(false)}
                className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                  !isNoReserve
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <input
                  type="radio"
                  name="reserveOption"
                  checked={!isNoReserve}
                  onChange={() => setIsNoReserve(false)}
                  className="mt-0.5 w-4 h-4 text-[#C2410C] shrink-0"
                />
                <div className="flex-1">
                  <div className="font-semibold text-xs">Set a Hidden Minimum Reserve</div>
                  <p className={`text-[11px] mt-0.5 leading-snug ${!isNoReserve ? 'text-slate-400' : 'text-slate-500'}`}>
                    If bidding doesn't reach this threshold, you are not obligated to sell.
                  </p>

                  {!isNoReserve && (
                    <div className="mt-2.5 relative">
                      <DollarSign className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="number"
                        step={100}
                        placeholder="e.g. 3500"
                        value={reservePrice}
                        onChange={(e) => setReservePrice(e.target.value)}
                        className="w-full pl-8 pr-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:border-orange-500 tabular-nums"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Protection Details */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C2410C] shrink-0" />
              <span>Anti-sniping (+2m extension)</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct In-Person Payment</span>
            </div>
          </div>

          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer font-heading"
            >
              {isSubmitting ? (
                <span>Starting Auction...</span>
              ) : (
                <>
                  <Gavel className="w-4 h-4" />
                  <span>Launch Live Auction</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
