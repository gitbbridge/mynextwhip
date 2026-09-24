import React from 'react';
import { useApp } from '../../context/AppContext';
import { Car, ShieldCheck, Video, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { POPULAR_MARKETS } from '../../services/geoService';

export const Footer: React.FC = () => {
  const { navigateTo, setActiveMarket } = useApp();

  return (
    <footer className="bg-[#0F1216] text-zinc-400 pt-16 pb-24 md:pb-16 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Brand Mission Banner */}
        <div className="bg-[#171B22] border border-zinc-800 rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-950/60 px-2.5 py-1 rounded border border-orange-900/60">
                The MyNextWhip Promise
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-3 font-heading tracking-tight">
                Your next car doesn't have to be perfect. It just has to be honest.
              </h3>
              <p className="text-sm text-zinc-300 mt-2 leading-relaxed">
                We built MyNextWhip for the cars traditional collector auction sites ignore. Cheap beaters, high-mileage trucks, project cars, and daily commuters under $10,000. We don't hide the dents, oil leaks, or warning lights—we put them front and center so you show up with confidence.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-zinc-800/80 px-3 py-2 rounded-xl border border-zinc-700/60 text-xs text-zinc-200">
                <Video className="w-4 h-4 text-orange-400" />
                <span>Cold-Start Videos</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/80 px-3 py-2 rounded-xl border border-zinc-700/60 text-xs text-zinc-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>NHTSA VIN Decoding</span>
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/80 px-3 py-2 rounded-xl border border-zinc-700/60 text-xs text-zinc-200">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Structured Honest Whip Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm">
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-heading">
              Marketplace
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-white transition">
                  Browse All Whips
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-white transition">
                  Under $5,000
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-white transition">
                  Project Cars & Mechanics Specials
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-white transition">
                  4x4s & Work Trucks
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('sell')} className="text-[#EA580C] font-semibold hover:underline">
                  List Your Car ($19 Standard)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-heading">
              Trust & Safety
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigateTo('safety')} className="hover:text-white transition">
                  What Makes a Whip Listing Different
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('safety')} className="hover:text-white transition">
                  In-Person Meetup & Bill of Sale Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('safety')} className="hover:text-white transition">
                  Police Safe Exchange Zones
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="text-purple-400 hover:text-purple-300">
                  Marketplace Moderation Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-heading">
              Active Regional Markets
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_MARKETS.slice(0, 6).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setActiveMarket(m)}
                  className="text-xs bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 px-2 py-1 rounded transition"
                >
                  {m.city}, {m.state}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4 font-heading">
              Platform
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-zinc-400">
                Built mobile-first for local private-party automobile transactions without hidden dealer doc fees.
              </p>
              <div className="pt-2 text-zinc-500 font-mono text-[11px]">
                NHTSA vPIC API Integrated · Stripe Listing Payments · Cloud Storage Architecture
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box - Required by Product Principles */}
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-500 space-y-2 mb-8">
          <div className="flex items-center gap-1.5 text-zinc-400 font-bold uppercase tracking-wider text-[11px]">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Transparency & Mechanical Disclaimer</span>
          </div>
          <p className="leading-relaxed">
            MyNextWhip.com is a marketplace connecting independent buyers and sellers. MyNextWhip verifies factual documentation where possible (VIN format, NHTSA equipment decoding, title documentation review, and video media submissions). 
            <span className="text-zinc-400 font-medium"> MyNextWhip does NOT mechanically inspect vehicles, guarantee mechanical condition, provide vehicle warranties, guarantee title authenticity, or act as an escrow agent.</span> 
            Buyers are strongly encouraged to inspect vehicles in person, test cold-starts, review the custom Whip Report question checklist, and conduct transactions at designated police department safe exchange zones with cash or cashier's checks.
          </p>
        </div>

        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <div>
            © {new Date().getFullYear()} MyNextWhip.com. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('safety')} className="hover:text-zinc-300">Terms of Service</button>
            <button onClick={() => navigateTo('safety')} className="hover:text-zinc-300">Privacy Policy</button>
            <button onClick={() => navigateTo('safety')} className="hover:text-zinc-300">Safety Guidelines</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
