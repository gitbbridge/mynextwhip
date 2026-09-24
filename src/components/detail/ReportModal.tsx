import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ReportSubmission } from '../../types';
import { X, Flag, Check, ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  listingId: string;
  vehicleTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

const REPORT_REASONS: { label: string; value: ReportSubmission['reason'] }[] = [
  { label: 'Suspected Scam or Ghost Listing', value: 'scam' },
  { label: 'Incorrect Vehicle Info / Misrepresented Specs', value: 'incorrect_info' },
  { label: 'Dealer Posing as Private Party Seller', value: 'dealer_misrep' },
  { label: 'Suspected Stolen Vehicle / Title Fraud', value: 'stolen' },
  { label: 'Duplicate Listing', value: 'duplicate' },
  { label: 'Offensive Content or Images', value: 'offensive' },
  { label: 'Other Marketplace Rule Violation', value: 'other' },
];

export const ReportModal: React.FC<ReportModalProps> = ({
  listingId,
  vehicleTitle,
  isOpen,
  onClose,
}) => {
  const { submitReport } = useApp();

  const [reason, setReason] = useState<ReportSubmission['reason']>('scam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(listingId, reason, details.trim());
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
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-red-600" />
            <h3 className="text-base font-black text-zinc-900 font-heading">
              Report Listing
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h4 className="text-lg font-bold text-zinc-900">Report Received</h4>
            <p className="text-xs text-zinc-600">
              Our moderation team will investigate. Your identity remains completely private.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <p className="text-zinc-600">
              Help keep MyNextWhip honest and scam-free. Reports are reviewed by human platform moderators.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#EA580C]"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Specific Details / Evidence
              </label>
              <textarea
                rows={3}
                required
                placeholder="Explain the issue with this listing..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-[#EA580C]"
              />
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
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider rounded-xl transition shadow-sm cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
