import React from 'react';
import { useApp } from '../../context/AppContext';
import { Car, ShieldCheck, Video, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-24 md:pb-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Brand Mission Banner */}
        <div className="bg-slate-800/70 border border-slate-700/70 rounded-2xl p-6 sm:p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-400">
                The MyNextWhip Standard
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 font-heading tracking-tight">
                Your next vehicle doesn't have to be perfect. It just has to be honest.
              </h3>
              <p className="text-sm text-slate-300 mt-2.5 leading-relaxed">
                We created MyNextWhip for genuine affordable cars, trucks, and projects under $10,000. We don't hide the dents, mechanical seeps, or check engine codes — we put them front and center so you can buy and sell with total confidence.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/60 text-xs text-slate-200">
                <Video className="w-4 h-4 text-orange-400" />
                <span>Cold-Start Videos</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/60 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>NHTSA VIN Decoding</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/60 text-xs text-slate-200">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Structured Honest Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-sm">
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-heading">
              Marketplace
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-white transition cursor-pointer">
                  Browse All Inventory
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-white transition cursor-pointer">
                  Under $5,000 Whips
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-white transition cursor-pointer">
                  Live Auctions
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('browse')} className="hover:text-white transition cursor-pointer">
                  4x4s & Work Trucks
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('sell')} className="text-orange-400 hover:text-orange-300 font-medium cursor-pointer">
                  List Your Whip ($19 Flat)
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-heading">
              Trust & Transparency
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigateTo('safety')} className="hover:text-white transition cursor-pointer">
                  Why Cold Starts Matter
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('safety')} className="hover:text-white transition cursor-pointer">
                  Safe Exchange Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('safety')} className="hover:text-white transition cursor-pointer">
                  Bill of Sale Templates
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('admin')} className="text-purple-400 hover:text-purple-300 transition cursor-pointer">
                  Moderation Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-heading">
              Community & Safety
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button onClick={() => navigateTo('safety')} className="hover:text-white transition cursor-pointer">
                  Pre-Purchase Inspection Guide
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('safety')} className="hover:text-white transition cursor-pointer">
                  Title Status Explained
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('safety')} className="hover:text-white transition cursor-pointer">
                  Police Station Meetups
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-4 font-heading">
              About MyNextWhip
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Built for affordable automotive enthusiasts, daily drivers, and project builders. Every vehicle honestly disclosed.
            </p>
            <div className="flex items-center gap-2 text-white font-bold font-heading">
              <div className="w-7 h-7 rounded-lg bg-[#C2410C] flex items-center justify-center text-white">
                <Car className="w-4 h-4" />
              </div>
              <span className="text-sm">MyNextWhip</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MyNextWhip. Honest affordable vehicle marketplace.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => navigateTo('safety')} className="hover:text-slate-400 transition cursor-pointer">
              Terms & Safety
            </button>
            <button onClick={() => navigateTo('safety')} className="hover:text-slate-400 transition cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => navigateTo('safety')} className="hover:text-slate-400 transition cursor-pointer">
              Seller Code of Conduct
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
