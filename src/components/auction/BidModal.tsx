import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuctionDetails } from '../../types';
import { X, Gavel, DollarSign, Clock, ShieldCheck, AlertCircle, Check } from 'lucide-react';

interface BidModalProps {
  listingId: string;
  vehicleTitle: string;
  auction: AuctionDetails;
  isOpen: boolean;
  onClose: () => void;
}

export const BidModal: React.FC<BidModalProps> = ({
  listingId,
  vehicleTitle,
  auction,
  isOpen,
  onClose,
}) => {
  const { placeAuctionBid, currentUser } = useApp();

  const currentHigh = auction.currentBid || auction.startingBid;
  const minIncrement = currentHigh < 2000 ? 50 : 100;
  const minNextBid = currentHigh + minIncrement;

  const [bidAmount, setBidAmount] = useState<string>(minNextBid.toString());
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const amountNum = parseInt(bidAmount, 10);

    if (!amountNum || amountNum < minNextBid) {
      setError(`Minimum bid required is $${minNextBid.toLocaleString()}`);
      return;
    }

    const res = placeAuctionBid(listingId, amountNum);
    if (res.success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } else {
      setError(res.error || 'Failed to place bid.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#C2410C] flex items-center justify-center">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Place an Auction Bid
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{vehicleTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-2xs">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Bid Placed Successfully!</h4>
            <p className="text-xs text-slate-600">
              You are now the current highest bidder at{' '}
              <span className="font-bold text-slate-900 tabular-nums">
                ${parseInt(bidAmount, 10).toLocaleString()}
              </span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Current High Bid Stats */}
            <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                  Current High Bid
                </span>
                <div className="text-2xl font-bold text-white tabular-nums">
                  ${currentHigh.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {auction.bidsCount} total {auction.bidsCount === 1 ? 'bid' : 'bids'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
                  Minimum Next Bid
                </span>
                <div className="text-lg font-bold text-orange-400 tabular-nums">
                  ${minNextBid.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  +${minIncrement} increment
                </div>
              </div>
            </div>

            {/* Bid Amount Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Bid ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step={minIncrement}
                  min={minNextBid}
                  required
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 tabular-nums"
                />
              </div>

              {/* Quick Preset Increments */}
              <div className="flex gap-1.5 mt-2">
                {[minNextBid, currentHigh + 250, currentHigh + 500, currentHigh + 1000].map(
                  (preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setBidAmount(preset.toString())}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold transition cursor-pointer tabular-nums"
                    >
                      ${preset.toLocaleString()}
                    </button>
                  )
                )}
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-medium flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Anti-sniping note */}
            <div className="p-3 bg-orange-50/70 rounded-xl border border-orange-200/80 text-[11px] text-orange-950 space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#C2410C]" />
                <span>2-Minute Anti-Sniping Protection</span>
              </div>
              <p className="text-slate-600 leading-tight">
                Any bid placed in the final 2 minutes will extend the clock by 2 minutes to keep bidding fair for everyone.
              </p>
            </div>

            {/* Direct Transaction note */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                No buyer fees or credit card deposit holds. The winning bidder arranges in-person inspection and direct settlement with the seller.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#C2410C] hover:bg-[#9A3412] text-white font-semibold rounded-xl transition shadow-xs cursor-pointer font-heading"
              >
                Confirm Bid
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
