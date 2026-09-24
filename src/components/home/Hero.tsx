import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, DollarSign, ArrowRight, ShieldCheck, Flame, Video, Sparkles } from 'lucide-react';
import { RADIUS_OPTIONS } from '../../services/geoService';

export const Hero: React.FC = () => {
  const { navigateTo, searchFilters, setSearchFilters, activeMarket } = useApp();

  const [keyword, setKeyword] = useState('');
  const [zip, setZip] = useState(searchFilters.zip || activeMarket.defaultZip);
  const [radius, setRadius] = useState<number>(searchFilters.radiusMiles || 50);
  const [maxPrice, setMaxPrice] = useState<string>('10000');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFilters({
      keyword: keyword.trim(),
      zip: zip.trim() || activeMarket.defaultZip,
      radiusMiles: radius,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
    });
    navigateTo('browse');
  };

  return (
    <section className="relative overflow-hidden bg-[#12151A] text-white pt-10 sm:pt-16 pb-16 border-b border-zinc-800">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#EA580C]/15 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/90 border border-zinc-700 text-xs font-semibold text-zinc-200 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
            <span>Honest Used Cars, Trucks & Projects Under $10K</span>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white font-heading uppercase">
            FIND YOUR <span className="text-[#EA580C]">NEXT WHIP.</span>
          </h1>
          <p className="mt-4 sm:mt-5 text-base sm:text-xl text-zinc-300 font-medium leading-relaxed">
            Affordable cars, trucks, projects and daily drivers — <span className="text-white font-bold underline decoration-[#EA580C] decoration-2 underline-offset-4">honestly represented</span> with cold-start videos and transparent issue reports.
          </p>

          {/* Quick Action CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('browse')}
              className="bg-[#EA580C] hover:bg-[#C2410C] text-white font-extrabold px-6 py-3 rounded-xl text-sm sm:text-base shadow-lg shadow-orange-950/60 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Find a Whip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('sell')}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold px-6 py-3 rounded-xl text-sm sm:text-base border border-zinc-700 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Sell Your Whip ($19)</span>
            </button>
          </div>
        </div>

        {/* Search Module Box */}
        <div className="mt-10 max-w-4xl mx-auto bg-[#1A1F27] border border-zinc-700/80 rounded-2xl p-3 sm:p-5 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* What are you looking for */}
            <div className="sm:col-span-5 relative">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 pl-1">
                What are you looking for?
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Tacoma, Civic, XJ 4x4, beater..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#12151A] border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#EA580C] transition"
                />
              </div>
            </div>

            {/* ZIP & Radius */}
            <div className="sm:col-span-4 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 pl-1">
                  ZIP Code
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    maxLength={5}
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="80202"
                    className="w-full pl-8 pr-2 py-2.5 bg-[#12151A] border border-zinc-700 rounded-xl text-sm text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-[#EA580C] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 pl-1">
                  Radius
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                  className="w-full py-2.5 px-2 bg-[#12151A] border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#EA580C] transition cursor-pointer"
                >
                  {RADIUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Max Price */}
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 pl-1">
                Max Price
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full py-2.5 px-3 bg-[#12151A] border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-[#EA580C] transition cursor-pointer"
              >
                <option value="3000" className="bg-zinc-900">Under $3,000</option>
                <option value="5000" className="bg-zinc-900">Under $5,000</option>
                <option value="8000" className="bg-zinc-900">Under $8,000</option>
                <option value="10000" className="bg-zinc-900">Under $10,000 (Sweet Spot)</option>
                <option value="15000" className="bg-zinc-900">Under $15,000</option>
                <option value="" className="bg-zinc-900">Any Budget</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-12 mt-1">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white font-extrabold rounded-xl text-sm sm:text-base shadow-md uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 font-heading"
              >
                <Search className="w-4 h-4 stroke-[3]" />
                <span>FIND MY WHIP</span>
              </button>
            </div>
          </form>
        </div>

        {/* Live Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-zinc-400 font-medium">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Hear real cold-starts before traveling</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Honest disclosures: leaks, rust, CEL codes</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>NHTSA VIN decoded + title review</span>
          </div>
        </div>
      </div>
    </section>
  );
};
