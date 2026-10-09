import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, DollarSign, ArrowRight, Gavel, CheckCircle2, Video, ShieldCheck } from 'lucide-react';
import { RADIUS_OPTIONS } from '../../services/geoService';

export const Hero: React.FC = () => {
  const { navigateTo, searchFilters, setSearchFilters, activeMarket, allListings } = useApp();

  const [keyword, setKeyword] = useState('');
  const [zip, setZip] = useState(searchFilters.zip || activeMarket.defaultZip);
  const [radius, setRadius] = useState<number>(searchFilters.radiusMiles || 50);
  const [maxPrice, setMaxPrice] = useState<string>('10000');

  const liveAuctionsCount = allListings.filter(
    (l) => l.listingFormat === 'AUCTION' && l.status === 'ACTIVE'
  ).length;

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
    <section className="relative bg-gradient-to-b from-slate-100/90 via-slate-50/60 to-white pt-12 sm:pt-16 pb-16 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Editorial Subtitle / Kicker */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 text-slate-700 text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
            <span>Honest vehicles under $10,000</span>
          </div>

          {/* Natural Case Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 font-heading leading-[1.1] text-balance">
            Find your next honest whip.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed text-balance max-w-2xl mx-auto">
            Affordable daily drivers, project cars, and trucks — honestly disclosed with video cold starts, upfront mechanical issues, and verified titles.
          </p>

          {/* Quick Action Navigation */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => navigateTo('browse')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Explore All Whips</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSearchFilters({ listingFormat: 'AUCTION', noReserveOnly: false });
                navigateTo('browse');
              }}
              className="bg-white hover:bg-slate-50 text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm border border-slate-300 transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Gavel className="w-4 h-4 text-[#C2410C]" />
              <span>Live Auctions</span>
              {liveAuctionsCount > 0 && (
                <span className="bg-orange-100 text-[#C2410C] text-xs font-bold px-1.5 py-0.5 rounded-md">
                  {liveAuctionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigateTo('sell')}
              className="bg-white hover:bg-slate-50 text-slate-700 font-medium px-4 py-2.5 rounded-xl text-sm border border-slate-200 transition-colors cursor-pointer"
            >
              <span>Sell a Vehicle ($19 flat)</span>
            </button>
          </div>
        </div>

        {/* Polished Unified Search Console */}
        <div className="mt-10 max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-4 shadow-xl shadow-slate-900/5">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
            {/* Keyword Search */}
            <div className="sm:col-span-5 relative">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1 pl-1">
                Vehicle or Keyword
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tacoma, Miata, Cherokee 4x4, beater..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition"
                />
              </div>
            </div>

            {/* ZIP & Radius */}
            <div className="sm:col-span-4 grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 pl-1">
                  ZIP Code
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    maxLength={5}
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    placeholder="80202"
                    className="w-full pl-8 pr-2 py-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 pl-1">
                  Distance
                </label>
                <select
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                  className="w-full py-2.5 px-2.5 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition cursor-pointer"
                >
                  {RADIUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Max Price & Search CTA */}
            <div className="sm:col-span-3 grid grid-cols-1 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1 pl-1">
                  Max Budget
                </label>
                <div className="flex gap-2">
                  <select
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full py-2.5 px-2 bg-slate-50 hover:bg-slate-100/60 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition cursor-pointer tabular-nums"
                  >
                    <option value="">Any Price</option>
                    <option value="3000">Under $3,000</option>
                    <option value="5000">Under $5,000</option>
                    <option value="7500">Under $7,500</option>
                    <option value="10000">Under $10,000</option>
                  </select>

                  <button
                    type="submit"
                    className="bg-[#C2410C] hover:bg-[#9A3412] text-white px-3.5 py-2.5 rounded-xl transition-colors shrink-0 flex items-center justify-center cursor-pointer shadow-xs"
                    title="Search listings"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Quiet Trust Evidence Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-[#C2410C]" />
            <span>Real Cold-Start Engine Videos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>NHTSA VIN & Title Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            <span>Upfront Mechanical Issues Disclosed</span>
          </div>
        </div>
      </div>
    </section>
  );
};
