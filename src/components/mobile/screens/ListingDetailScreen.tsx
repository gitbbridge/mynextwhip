import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Car,
  Gavel,
  Calendar,
  Sparkles,
  Info,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { Listing } from '../../../types';
import { Badge, Button, Card } from '../ui/Primitives';

interface ListingDetailScreenProps {
  listing: Listing;
  onBack: () => void;
  onCommitHold: (listing: Listing) => void;
}

export const ListingDetailScreen: React.FC<ListingDetailScreenProps> = ({
  listing,
  onBack,
  onCommitHold,
}) => {
  const [accordionOpen, setAccordionOpen] = useState<boolean>(true);
  const [reportExpanded, setReportExpanded] = useState<boolean>(false);

  const isAuction = listing.listingFormat === 'AUCTION';
  const isActive = listing.status === 'ACTIVE';
  const isCommitted = listing.status === 'COMMITTED';
  const isSettled = listing.status === 'SETTLED';

  return (
    <div className="flex flex-col min-h-full pb-24 bg-slate-50">
      {/* Sticky Navigation Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-xl text-slate-700 hover:bg-slate-100 active:scale-95 transition-transform flex items-center gap-1 text-xs font-bold min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft className="w-4 h-4 text-slate-900" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-bold text-slate-900 font-heading truncate max-w-[180px] block">
            {listing.vehicle.year} {listing.vehicle.make}
          </span>
        </div>

        <Badge variant={isAuction ? 'auction' : 'bin'} size="sm">
          {isAuction ? 'Auction' : 'Buy It Now'}
        </Badge>
      </div>

      {/* Hero Media Carousel/Single */}
      <div className="relative w-full h-64 bg-slate-950 overflow-hidden">
        <img
          src={listing.photos[0]?.url || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=400&q=80'}
          alt={`${listing.vehicle.year} ${listing.vehicle.make}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Floating Title & Price on photo */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                {listing.category}
              </span>
              <h1 className="text-xl font-black font-heading tracking-tight leading-snug">
                {listing.vehicle.year} {listing.vehicle.make} {listing.vehicle.model}
              </h1>
              <p className="text-xs text-slate-300">
                {listing.vehicle.mileage.toLocaleString()} miles · {listing.vehicle.transmission} · {listing.vehicle.drivetrain}
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-2xl font-black font-mono-numbers text-white">
                ${listing.askingPrice.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-300 uppercase">
                {isAuction ? 'High Bid' : 'Firm Asking Price'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Banner */}
        {isActive && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200/90 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-emerald-950 block">Available for Immediate Inspection</span>
              <p className="text-emerald-700 leading-snug">
                Link an active card to place a $25 verification hold and lock your viewing window.
              </p>
            </div>
          </div>
        )}

        {isCommitted && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex items-center gap-3">
            <Lock className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-amber-950 block">Viewing Window Locked for Another Buyer</span>
              <p className="text-amber-800 leading-snug">
                A local buyer has authorized a $25 verification hold. If they pass, this listing will reopen immediately.
              </p>
            </div>
          </div>
        )}

        {isSettled && (
          <div className="p-3.5 bg-slate-100 border border-slate-300 rounded-2xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-slate-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Deal Completed & Settled</span>
              <p className="text-slate-600 leading-snug">
                Vehicle sold and peer-to-peer performance fee settled successfully.
              </p>
            </div>
          </div>
        )}

        {/* SECTION: Honest Whip Report Summary */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-black text-slate-900 font-heading">
                Honest Whip Report™
              </h2>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Verified Colorado Title
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Title Status</span>
              <span className="font-bold text-slate-900">{listing.vehicle.titleStatus} Blue Title</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Cold Start</span>
              <span className="font-bold text-slate-900">
                {listing.verifications.coldStartProvided ? '✓ Video Verified' : 'Standard Audio'}
              </span>
            </div>
          </div>

          {/* Disclosed Imperfections */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Known Imperfections ({listing.issues.length})</span>
              </span>
              <button
                onClick={() => setReportExpanded(!reportExpanded)}
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                {reportExpanded ? 'Hide Details' : 'View Disclosures'}
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Every flaw is honestly listed before you travel to see the car. Pass after in-person inspection due to an undisclosed issue and your $25 hold is released at zero cost.
            </p>

            {reportExpanded && (
              <div className="space-y-2 pt-1 animate-in fade-in duration-150">
                {listing.issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-1"
                  >
                    <div className="flex justify-between font-bold text-amber-950">
                      <span>{issue.title}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-amber-200 rounded">
                        {issue.severity}
                      </span>
                    </div>
                    <p className="text-amber-900 text-[11px] leading-snug">{issue.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* SECTION: What Happens Next Accordion */}
        <Card padding="md" className="space-y-2">
          <button
            onClick={() => setAccordionOpen(!accordionOpen)}
            className="w-full flex items-center justify-between text-left min-h-[44px]"
          >
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900 font-heading">
                How It Works: No Trade, No Fee
              </h3>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                accordionOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {accordionOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 pt-2 text-xs text-slate-600 border-t border-slate-100 overflow-hidden"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-900 block">$25 Anti-Flake Hold</strong>
                    <span>Filters tire-kickers and reserves your exclusive meetup window. No money is captured right now.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Meet & Inspect in Person</strong>
                    <span>Meet safely at a public Denver police station safe exchange zone or neutral lot. Test cold start and title.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-900 block">Settlement or $0 Void</strong>
                    <span>If you buy the whip, scaled platform fee ($25–$99) captures from the card. If it has undisclosed flaws, hold is released at $0.00.</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Seller Info */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <img
              src={listing.seller.avatar}
              alt={listing.seller.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <span className="font-bold text-slate-900 block">{listing.seller.name}</span>
              <span className="text-[11px] text-slate-500">
                Verified Seller · Response {listing.seller.responseTime}
              </span>
            </div>
          </div>
          <Badge variant="verified" size="sm">
            {listing.seller.responseRate}
          </Badge>
        </div>
      </div>

      {/* Sticky Bottom CTA Bar (Tap target >= 44px) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="shrink-0">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Hold Amount
            </span>
            <span className="text-base font-black text-slate-900 font-mono-numbers">
              $25.00 <span className="text-[10px] text-slate-400 font-sans font-normal">hold</span>
            </span>
          </div>

          <div className="flex-1">
            {isActive ? (
              <Button
                variant={isAuction ? 'primary' : 'primary'}
                size="md"
                fullWidth
                onClick={() => onCommitHold(listing)}
                leftIcon={isAuction ? <Gavel className="w-4 h-4 text-purple-200" /> : <Lock className="w-4 h-4 text-indigo-200" />}
              >
                {isAuction ? 'Join Auction / Link Card to Bid' : 'Request to Inspect / Buy It Now'}
              </Button>
            ) : isCommitted ? (
              <Button variant="secondary" size="md" fullWidth disabled>
                Held for Another Buyer
              </Button>
            ) : (
              <Button variant="secondary" size="md" fullWidth disabled>
                Sale Completed
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
