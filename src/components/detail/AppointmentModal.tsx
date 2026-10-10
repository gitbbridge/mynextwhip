import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Check,
  CreditCard,
  Lock,
  Wrench,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { AddonType } from '../../types';

interface AppointmentModalProps {
  listingId: string;
  vehicleTitle: string;
  locationCity: string;
  locationState: string;
  isOpen: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  'Morning (9:00 AM – 11:30 AM)',
  'Early Afternoon (12:00 PM – 2:30 PM)',
  'Late Afternoon (3:00 PM – 5:30 PM)',
  'Evening (6:00 PM – 7:30 PM)',
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  listingId,
  vehicleTitle,
  locationCity,
  locationState,
  isOpen,
  onClose,
}) => {
  const { createAppointment, authorizeBuyerHold } = useApp();

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [safeMeetupNote, setSafeMeetupNote] = useState(
    `Local Police Dept Safe Exchange Zone in ${locationCity}, ${locationState} or busy bank parking lot.`
  );

  // Stripe card & Anti-Flake Hold state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('123');
  const [includeMobilePPI, setIncludeMobilePPI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const addons: AddonType[] = includeMobilePPI ? ['MOBILE_PPI'] : [];
      authorizeBuyerHold(listingId, `${date} ${timeSlot}`, addons);
      createAppointment(listingId, date, timeSlot, safeMeetupNote.trim());

      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1800);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Schedule In-Person Inspection & Lock Viewing
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-sm">{vehicleTitle}</p>
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
            <h4 className="text-lg font-bold text-slate-900">Viewing Locked & Meetup Requested!</h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              A temporary $25 anti-flake hold has been placed on your card. Listing is now locked for your inspection window.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[85vh] overflow-y-auto">
            {/* Meetup Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Date
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Time Window
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-800"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Safe Public Meetup Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <textarea
                  rows={2}
                  required
                  value={safeMeetupNote}
                  onChange={(e) => setSafeMeetupNote(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>

            {/* Anti-Flake Authorization Framework Box */}
            <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Lock className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Stripe $25 Anti-Flake Verification Hold</span>
                </div>
                <span className="text-[10px] bg-orange-200 text-[#C2410C] font-bold px-2 py-0.5 rounded-full uppercase">
                  Manual Auth Hold
                </span>
              </div>

              <p className="text-[11px] text-slate-600 leading-snug">
                To filter out tire-kickers and lock in your private viewing window, an automated $25 authorization hold is placed on your card. <strong className="text-slate-900 font-semibold">You are not charged yet.</strong>
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-700 pt-1">
                <div className="p-2 bg-white rounded-lg border border-orange-200">
                  <span className="font-semibold text-emerald-700 block">✓ No Trade, No Fee</span>
                  <span>Pass due to undisclosed flaws? Hold is instantly released at $0 cost.</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-orange-200">
                  <span className="font-semibold text-slate-900 block">✓ Seller Guarantee</span>
                  <span>Protects seller from no-shows without 2-hour advance cancellation.</span>
                </div>
              </div>

              {/* Card Inputs */}
              <div className="pt-2 border-t border-orange-200 space-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 uppercase">
                    Card Number
                  </label>
                  <div className="relative">
                    <CreditCard className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-8 pr-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Optional Point-of-Intent Add-on: Mobile PPI ($95) */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMobilePPI}
                  onChange={(e) => setIncludeMobilePPI(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[#C2410C] rounded focus:ring-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-blue-600" />
                      <span>Add Mobile Pre-Purchase Inspection (PPI)</span>
                    </span>
                    <span className="font-bold text-slate-900 text-xs">$95.00</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    Certified independent Front Range mechanic dispatched to perform a 50-point mechanical, OBD-II scanner, and frame inspection.
                  </p>
                </div>
              </label>
            </div>

            {/* Total at Booking */}
            <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs font-medium">
              <div>
                <span className="text-slate-500 block text-[11px]">Due Right Now:</span>
                <span className="font-bold text-slate-900">
                  {includeMobilePPI ? '$95.00 (PPI Fee) + $25 Hold' : '$0.00 ($25 Authorization Hold)'}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Performance fee charged only when trade closes
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <span>Authorizing Hold...</span>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-orange-400" />
                    <span>Authorize $25 & Lock Meetup</span>
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

