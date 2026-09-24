import React from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, Video, FileCheck, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <section className="py-16 bg-white border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section 1: What makes a listing different */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded border border-orange-200/80">
            Marketplace Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight font-heading mt-3 uppercase">
            WHAT MAKES A MYNEXTWHIP LISTING DIFFERENT?
          </h2>
          <p className="text-zinc-600 mt-2 text-sm sm:text-base">
            No ghost listings, no scam pricing, and no sugarcoated descriptions. Here’s how we keep it real.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Card 1 */}
          <div className="bg-[#FAFBFD] border border-zinc-200 rounded-2xl p-6 sm:p-7 relative overflow-hidden group hover:border-[#EA580C]/40 transition shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Eye className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 font-heading uppercase tracking-tight">
              SEE THE PROBLEMS
            </h3>
            <p className="text-sm font-semibold text-[#EA580C] mt-1">
              Sellers are encouraged to disclose what's wrong.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 mt-3 leading-relaxed">
              We made disclosing check engine codes, oil seeps, AC issues, and body rust normal and rewarded. Buyers receive an automated, tailored "What to Ask the Seller" inspection checklist for every issue disclosed.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-200 text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full Whip Report on every listing</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[#FAFBFD] border border-zinc-200 rounded-2xl p-6 sm:p-7 relative overflow-hidden group hover:border-[#EA580C]/40 transition shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Video className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 font-heading uppercase tracking-tight">
              HEAR IT RUN
            </h3>
            <p className="text-sm font-semibold text-blue-700 mt-1">
              Cold-start and walkaround videos.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 mt-3 leading-relaxed">
              Anyone can polish paint for a photo. We prompt sellers to upload a real cold-start video—letting you hear the starter motor, listen for exhaust ticks, and watch the idle settle before driving out to look at it.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-200 text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Audio/video proof on mobile or desktop</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-[#FAFBFD] border border-zinc-200 rounded-2xl p-6 sm:p-7 relative overflow-hidden group hover:border-[#EA580C]/40 transition shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <FileCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h3 className="text-lg font-black text-zinc-900 font-heading uppercase tracking-tight">
              KNOW THE DETAILS
            </h3>
            <p className="text-sm font-semibold text-emerald-700 mt-1">
              VIN, mileage, and vehicle facts are clearly displayed.
            </p>
            <p className="text-xs sm:text-sm text-zinc-600 mt-3 leading-relaxed">
              Every listing is decoded against NHTSA federal database specifications. Title status (Clean, Rebuilt, Salvage), maintenance receipts, and odometer readings are upfront—not buried in confusing fine print.
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-200 text-xs text-zinc-500 flex items-center gap-1.5 font-medium">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Standard 17-character VIN verification</span>
            </div>
          </div>
        </div>

        {/* Section 2: "NOT EVERY CAR HAS TO BE PERFECT" statement banner */}
        <div className="mt-16 bg-[#12151A] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-950/80 px-2.5 py-1 rounded border border-orange-900">
              Honest Automotive Community
            </span>
            <h3 className="text-2xl sm:text-4xl font-black font-heading tracking-tight mt-4 uppercase leading-tight">
              NOT EVERY CAR HAS TO BE PERFECT.
            </h3>
            
            <div className="mt-4 space-y-1.5 text-zinc-300 text-sm sm:text-base font-medium">
              <p className="flex items-center gap-2">
                <span className="text-[#EA580C] font-bold">―</span> Some have 200,000 miles.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#EA580C] font-bold">―</span> Some need mechanical work.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#EA580C] font-bold">―</span> Some have a little rust.
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#EA580C] font-bold">―</span> Some are weird as hell.
              </p>
              <p className="flex items-center gap-2 text-white font-bold">
                <span className="text-[#EA580C] font-bold">―</span> Some are exactly what somebody else has been looking for.
              </p>
            </div>

            <p className="mt-5 text-sm sm:text-base text-zinc-300 font-semibold">
              That's what MyNextWhip is for.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => navigateTo('browse')}
                className="bg-[#EA580C] hover:bg-[#C2410C] text-white font-black px-6 py-3 rounded-xl text-sm transition shadow-lg shadow-orange-950/50 flex items-center gap-2 cursor-pointer"
              >
                <span>Find Your Next Whip</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('sell')}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-3 rounded-xl text-sm border border-zinc-700 transition cursor-pointer"
              >
                <span>List in 5–10 Minutes ($19)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
