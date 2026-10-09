import React from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, Video, FileCheck, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <section className="py-16 bg-[#FAFAFB] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#C2410C] mb-2">
            The Transparency Standard
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight font-heading text-balance">
            What makes a MyNextWhip listing different.
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed text-balance">
            Traditional car sites encourage sellers to wipe codes, gloss over rust, and hide blemishes. We created a standard that rewards upfront honesty.
          </p>
        </div>

        {/* 3 Pillar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#C2410C] flex items-center justify-center mb-5">
              <Eye className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Upfront Mechanical Disclosures
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              Sellers list known issues like oil seeps, AC leaks, or body rust directly. Every disclosed issue generates an automated inspection checklist so buyers know exactly what questions to ask in person.
            </p>
            <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Tailored buyer questions for each vehicle</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-5">
              <Video className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Cold-Start Video Audio & Video
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              Anyone can wax paint in the sun. We ask sellers for a true cold-start video — hear the starter motor crank, listen to the exhaust note, and watch the idle settle before driving out for a test drive.
            </p>
            <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Watch starter & idle audio directly in-browser</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
              <FileCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
              Verified Title & NHTSA Specs
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
              Every listing is decoded against NHTSA federal vehicle data. Title brand (Clean, Rebuilt, Salvage), drivetrain configuration, and odometer readings are clearly presented without misleading fine print.
            </p>
            <div className="mt-5 pt-3.5 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Standard 17-character VIN verification</span>
            </div>
          </div>
        </div>

        {/* Editorial Community Manifesto */}
        <div className="mt-14 bg-slate-900 rounded-2xl p-8 sm:p-12 text-white relative overflow-hidden shadow-lg shadow-slate-900/10">
          <div className="max-w-2xl relative z-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-3">
              The Real Marketplace Philosophy
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-white leading-tight">
              Not every car has to be perfect. It just has to be honest.
            </h3>

            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
              Some have 200,000 highway miles. Some need mechanical work on a Saturday afternoon. Some have honest trail scratches. And some are exactly what somebody has been searching months to find.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigateTo('browse')}
                className="bg-white hover:bg-slate-100 text-slate-900 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
              >
                Browse Current Whips
              </button>
              <button
                onClick={() => navigateTo('sell')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-medium px-4 py-2.5 rounded-xl text-sm border border-slate-700 transition-colors cursor-pointer"
              >
                List Your Whip ($19)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
