import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, DollarSign, ShieldCheck, Check, Lock, CreditCard } from 'lucide-react';

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
  const { createOffer, authorizeBuyerHold } = useApp();

  const [amount, setAmount] = useState<string>(Math.round(askingPrice * 0.95).toString());
  const [message, setMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseInt(amount, 10);
    if (!numericAmount || numericAmount <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      authorizeBuyerHold(listingId);
      createOffer(listingId, numericAmount, message.trim());
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    }, 600);
  };

  const percentage = askingPrice ? Math.round((parseInt(amount || '0', 10) / askingPrice) * 100) : 100;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Make an Official Verified Offer
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-xs">{vehicleTitle}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Verified Offer Submitted!</h4>
            <p className="text-xs text-slate-600">
              The seller has been notified with your verified card profile and $25 commitment guarantee.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Asking Price:</span>
              <span className="font-bold text-slate-900 text-sm tabular-nums">
                ${askingPrice.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Offer Amount ($ USD)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  step={50}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:border-slate-800 tabular-nums"
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1.5">
                <span>{percentage}% of asking price</span>
                <div className="flex gap-1">
                  {[0.9, 0.95, 1.0].map((multiplier) => {
                    const presetVal = Math.round(askingPrice * multiplier);
                    return (
                      <button
                        key={multiplier}
                        type="button"
                        onClick={() => setAmount(presetVal.toString())}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-medium transition cursor-pointer tabular-nums"
                      >
                        ${presetVal.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Note for Seller (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Cash in hand, can inspect this Saturday morning after watching the cold start video..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            {/* Anti-Flake Verification & Card Binding */}
            <div className="p-3 bg-orange-50/70 border border-orange-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Lock className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Stripe $25 Anti-Flake Verification Hold</span>
                </div>
                <span className="text-[10px] bg-orange-200 text-[#C2410C] font-bold px-1.5 py-0.2 rounded">
                  Auth Hold Only
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Locks in your offer with zero upfront charges. Hold is instantly voided if you pass due to undisclosed flaws during in-person inspection.
              </p>
              <div className="pt-1.5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-orange-400" />
                    <span>Send Verified Offer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

