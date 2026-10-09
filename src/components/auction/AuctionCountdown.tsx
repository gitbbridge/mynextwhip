import React, { useState, useEffect } from 'react';
import { AuctionDetails } from '../../types';
import { Clock, ShieldCheck, CheckCircle2, Gavel } from 'lucide-react';

interface AuctionCountdownProps {
  auction: AuctionDetails;
  compact?: boolean;
}

export const AuctionCountdown: React.FC<AuctionCountdownProps> = ({ auction, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState<{
    ended: boolean;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    formatted: string;
  }>({
    ended: false,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    formatted: '',
  });

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const end = new Date(auction.endsAt).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({
          ended: true,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          formatted: 'Auction ended',
        });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let formatted = '';
      if (days > 0) {
        formatted = `${days}d ${hours}h left`;
      } else {
        formatted = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} left`;
      }

      setTimeLeft({
        ended: false,
        days,
        hours,
        minutes,
        seconds,
        formatted,
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [auction.endsAt]);

  const isReserveMet =
    auction.isNoReserve ||
    (auction.reservePrice && auction.currentBid >= auction.reservePrice);

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-[11px]">
        <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-md font-medium shadow-2xs">
          <Clock className="w-3 h-3 text-orange-400 shrink-0" />
          <span className="tabular-nums">{timeLeft.formatted}</span>
        </div>

        {auction.isNoReserve ? (
          <span className="bg-orange-600/90 text-white px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
            No Reserve
          </span>
        ) : (
          <span
            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
              isReserveMet ? 'bg-emerald-950/80 text-emerald-200' : 'bg-slate-900/80 text-slate-300'
            }`}
          >
            {isReserveMet ? 'Reserve Met' : 'Reserve'}
          </span>
        )}
      </div>
    );
  }

  // Full Auction Header Card on PDP
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm border border-slate-800">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Live Auction
          </span>
        </div>

        <div className="flex items-center gap-2">
          {auction.isNoReserve ? (
            <span className="bg-[#C2410C] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              No Reserve
            </span>
          ) : (
            <span
              className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                isReserveMet
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {isReserveMet ? 'Reserve Met' : 'Reserve Pending'}
            </span>
          )}

          {auction.antiSnipingTriggered && (
            <span className="text-[10px] font-medium bg-slate-800 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800/60">
              +2m Anti-Snip
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 items-center pt-3 border-t border-slate-800">
        <div>
          <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
            Current High Bid
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-white tabular-nums tracking-tight">
            ${auction.currentBid.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            <span className="tabular-nums">{auction.bidsCount}</span> {auction.bidsCount === 1 ? 'bid' : 'bids'}
            {auction.currentHighBidderName && (
              <span className="text-slate-500 ml-1">· High: {auction.currentHighBidderName}</span>
            )}
          </div>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-medium text-slate-400 block mb-0.5">
            Time Remaining
          </span>
          <div className="text-xl sm:text-2xl font-bold text-orange-400 tabular-nums">
            {timeLeft.formatted}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Ends {new Date(auction.endsAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};
