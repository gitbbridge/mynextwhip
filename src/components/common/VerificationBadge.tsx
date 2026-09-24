import React from 'react';
import { ShieldCheck, Video, FileText, CheckCircle2, Flame, Wrench } from 'lucide-react';

interface VerificationBadgeProps {
  type: 'vin' | 'title' | 'coldStart' | 'walkaround' | 'serviceRecords' | 'seller' | 'mechanic';
  compact?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ type, compact = false }) => {
  switch (type) {
    case 'vin':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>VIN Decoded</span>
        </span>
      );
    case 'title':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Title Reviewed</span>
        </span>
      );
    case 'coldStart':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-orange-50 text-orange-800 border border-orange-200/80 ${compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
          <Flame className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>Cold-Start Video</span>
        </span>
      );
    case 'walkaround':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-50 text-blue-800 border border-blue-200/80 ${compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
          <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Walkaround Video</span>
        </span>
      );
    case 'serviceRecords':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-100 text-slate-800 border border-slate-200 ${compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
          <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Service Records</span>
        </span>
      );
    case 'seller':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200/80 ${compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>ID Verified Seller</span>
        </span>
      );
    case 'mechanic':
      return (
        <span className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 ${compact ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
          <Wrench className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>Mechanic Special</span>
        </span>
      );
    default:
      return null;
  }
};
