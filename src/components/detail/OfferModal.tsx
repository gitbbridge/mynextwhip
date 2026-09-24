import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, DollarSign, ShieldAlert, Check } from 'lucide-react';

interface OfferModalProps {
  listingId: string;
  askingPrice: number;
  vehicleTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export const OfferModal: React.FC<OfferModalProps> = ({
  listingId,
  askingPrice,
  vehicleTitle,
  isOpen,
  onClose,
}) => {
  const { createOffer } = useApp();

  const [amount, setAmount] = useState<string>(Math.round(askingPrice * 0.95).toString());
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amount, 10);
    if (!numericAmount || numericAmount <= 0) return;

    createOffer(listingId, numericAmount, message.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  const percentage = askingPrice ? Math.round((parseInt(amount || '0', 10) / askingPrice) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <h3 className="text-base font-black text-zinc-900 font-heading">
              Make an Offer
            </h3>
            <p className="text-xs text-zinc-500 truncate max-w-xs">{vehicleTitle}</p>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900">Offer Submitted!</h4>
            <p className="text-xs text-zinc-600">
              The seller has been notified and a message thread has been opened.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-medium">Asking Price:</span>
              <span className="font-mono font-bold text-zinc-900 text-sm">
                ${askingPrice.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Your Offer Amount ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="number"
                  step={50}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-zinc-300 rounded-xl font-mono text-base font-bold text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1.5">
                <span>{percentage}% of asking price</span>
                <div className="flex gap-1">
                  {[0.9, 0.95, 1.0].map((multiplier) => {
                    const presetVal = Math.round(askingPrice * multiplier);
                    return (
                      <button
                        key={multiplier}
                        type="button"
                        onClick={() => setAmount(presetVal.toString())}
                        className="px-1.5 py-0.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded text-[10px] font-mono cursor-pointer"
                      >
                        ${presetVal.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Note for Seller (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Cash in hand, can come inspect this Saturday morning after watching the cold start video..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 bg-white border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#EA580C]"
              />
            </div>

            {/* Principle 5 reminder */}
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                An accepted offer signals agreement on price for an in-person inspection. No funds are charged or transferred automatically.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-black uppercase tracking-wider rounded-xl text-xs transition shadow-sm cursor-pointer"
              >
                Send Offer
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
