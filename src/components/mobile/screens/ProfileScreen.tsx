import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  HelpCircle,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Info,
  Sparkles,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { Card, Badge, Button } from '../ui/Primitives';

interface ProfileScreenProps {
  onOpenSupport?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
  const [faqOpen, setFaqOpen] = useState<boolean>(false);
  const [supportMessageSent, setSupportMessageSent] = useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-full pb-20 bg-slate-50">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3">
        <h1 className="text-xl font-black text-slate-950 font-heading tracking-tight">
          Buyer Profile
        </h1>
        <p className="text-xs text-slate-500">
          Account details, verification badges, and Denver support
        </p>
      </div>

      <div className="p-4 max-w-md mx-auto w-full space-y-4">
        {/* User Card */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-lg border border-indigo-200">
              MR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black text-slate-900 font-heading">
                  Mike Reynolds
                </h2>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500">Denver, Colorado · Member since 2024</p>
              <div className="flex gap-1.5 pt-1">
                <Badge variant="verified" size="sm">
                  Verified Buyer
                </Badge>
                <Badge variant="neutral" size="sm">
                  Active Card Bound
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">mike.reynolds@example.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>(303) 555-0182</span>
            </div>
          </div>
        </Card>

        {/* Protection & Guarantee Badge */}
        <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-indigo-950">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Buyer & Seller Safe Exchange Guarantee</span>
          </div>
          <p className="text-indigo-800 leading-snug">
            All inspection commitments require active cards with $25 anti-flake holds to eliminate tire-kickers.
          </p>
        </div>

        {/* Support & FAQ Accordion */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                Support & Common Questions
              </h3>
            </div>
            <button
              onClick={() => setFaqOpen(!faqOpen)}
              className="text-xs text-indigo-600 font-bold hover:underline min-h-[36px]"
            >
              {faqOpen ? 'Close FAQ' : 'View FAQ'}
            </button>
          </div>

          {faqOpen && (
            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs text-slate-600 animate-in fade-in duration-150">
              <div>
                <strong className="text-slate-900 block">When am I charged?</strong>
                <span>Only when you inspect the vehicle and agree to buy it. If you pass legitimately for an undisclosed defect, the $25 hold is released at $0.00.</span>
              </div>
              <div>
                <strong className="text-slate-900 block">What is the performance fee?</strong>
                <span>Scaled based on final sale price: under $3k ($25), $3k–$6k ($49 or $95 auction), $6k–$10k ($99 or $149 auction).</span>
              </div>
              <div>
                <strong className="text-slate-900 block">Where do we meet?</strong>
                <span>We recommend designated Denver Police Department public safe exchange zones or public bank parking lots during daylight hours.</span>
              </div>
            </div>
          )}

          {/* Contact Support link */}
          <div className="pt-2 border-t border-slate-100">
            {supportMessageSent ? (
              <p className="text-xs text-emerald-700 font-semibold">
                ✓ Support request dispatched to Denver ops team (303-555-0100).
              </p>
            ) : (
              <button
                onClick={() => setSupportMessageSent(true)}
                className="w-full flex items-center justify-between text-xs text-slate-700 hover:text-indigo-600 py-1 font-semibold min-h-[44px]"
              >
                <span>Contact Local Denver Ops Support</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        </Card>

        {/* App Version & Metadata */}
        <div className="text-center pt-2 space-y-1 text-slate-400 text-xs">
          <p className="font-semibold text-slate-500">MyNextWhip Mobile Edition</p>
          <p className="text-[11px]">v2.4.0 (Build 309) · Denver Metro Region</p>
          <p className="text-[10px] text-slate-400">Honest Peer-to-Peer Front Range Marketplace</p>
        </div>
      </div>
    </div>
  );
};
