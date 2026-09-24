import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  AlertTriangle,
  MapPin,
  FileCheck,
  Video,
  CheckCircle2,
  DollarSign,
  Car,
  HelpCircle,
} from 'lucide-react';

export const SafetyGuide: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top Banner */}
      <div className="bg-[#12151A] text-white border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-950/80 px-3 py-1 rounded-full border border-orange-900">
            Trust Without Pretending
          </span>
          <h1 className="text-3xl sm:text-5xl font-black font-heading tracking-tight mt-4 uppercase">
            HOW IT WORKS & SAFETY GUIDE
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 mt-2 max-w-2xl mx-auto leading-relaxed">
            The honest marketplace playbook for private party automobile transactions.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Core Differentiation vs Traditional Classifieds */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 font-heading">
            How MyNextWhip Differs from Facebook & Craigslist
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs leading-relaxed">
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
              <span className="font-bold text-sm text-zinc-900 block mb-1">Cold-Start Videos</span>
              <p className="text-zinc-600">
                Sellers are guided to upload videos of the engine cranking and idling from dead cold, saving you wasted trips to hear a rod knock.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
              <span className="font-bold text-sm text-zinc-900 block mb-1">Structured Disclosures</span>
              <p className="text-zinc-600">
                We make disclosing check engine codes, oil leaks, and rust standard practice rather than something to hide until you arrive with cash.
              </p>
            </div>
            <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
              <span className="font-bold text-sm text-zinc-900 block mb-1">Federal VIN Decoding</span>
              <p className="text-zinc-600">
                Every vehicle is decoded against the NHTSA manufacturer database to ensure real specs, trim, and title transparency.
              </p>
            </div>
          </div>
        </div>

        {/* In-Person Meetup & Safe Exchange Guide */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#EA580C]" />
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 font-heading">
              Safe In-Person Transaction Checklist
            </h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-zinc-700">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-950 block">1. Meet at a Police Department Safe Exchange Zone</span>
                <p className="text-emerald-800 text-xs mt-0.5">
                  Most local police stations provide designated parking stalls with 24/7 video surveillance for Craigslist/marketplace exchanges.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-950 block">2. Verify the Physical Title in the Seller's Name</span>
                <p className="text-emerald-800 text-xs mt-0.5">
                  Ensure the seller's government ID matches the printed name on the front of the title. Beware of "title jumpers" who never registered the vehicle in their own name.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-950 block">3. Complete a Physical Bill of Sale</span>
                <p className="text-emerald-800 text-xs mt-0.5">
                  Print two copies of your state’s standard motor vehicle Bill of Sale. Both buyer and seller should sign and record the date, sale price, VIN, and exact odometer reading.
                </p>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-950 block">4. Secure Payment Method</span>
                <p className="text-emerald-800 text-xs mt-0.5">
                  Never wire funds or use peer-to-peer apps before meeting in person. Complete cash or cashier’s check payments inside the bank branch where the check can be verified by a teller.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Disclaimer Section */}
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-3 text-xs text-amber-950">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Important Legal Disclaimer</span>
          </div>
          <p className="leading-relaxed">
            MyNextWhip verifies factual documentation where possible (VIN format, equipment decoding, and video media submissions).
            <span className="font-bold"> MyNextWhip does NOT mechanically inspect vehicles, guarantee vehicle condition, provide warranties, or act as an escrow agent.</span>
            Vehicles in the affordable budget tier often have mechanical needs; buyers are solely responsible for conducting their own physical test drives and professional pre-purchase inspections.
          </p>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => navigateTo('browse')}
            className="px-6 py-3 bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-md"
          >
            Start Browsing Whips
          </button>
        </div>
      </div>
    </div>
  );
};
