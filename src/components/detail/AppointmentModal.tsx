import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Clock, MapPin, ShieldCheck, Check } from 'lucide-react';

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
  const { createAppointment } = useApp();

  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [safeMeetupNote, setSafeMeetupNote] = useState(
    `Local Police Dept Safe Exchange Zone in ${locationCity}, ${locationState} or busy bank parking lot.`
  );
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAppointment(listingId, date, timeSlot, safeMeetupNote.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <h3 className="text-base font-black text-zinc-900 font-heading">
              Schedule In-Person Inspection
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
            <h4 className="text-lg font-bold text-zinc-900">Meetup Requested!</h4>
            <p className="text-xs text-zinc-600">
              The seller will confirm the time and exact public meeting location.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Time Window
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#EA580C]"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Safe Public Meetup Suggestion
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                <textarea
                  rows={2}
                  required
                  value={safeMeetupNote}
                  onChange={(e) => setSafeMeetupNote(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                />
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                Always meet during daylight in a public location. We recommend your local police department parking lot or outside a bank with security cameras.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-black uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer"
              >
                Request Meetup
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
