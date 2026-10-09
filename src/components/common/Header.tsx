import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { POPULAR_MARKETS } from '../../services/geoService';
import {
  Car,
  MapPin,
  Heart,
  MessageSquare,
  Shield,
  ChevronDown,
  User as UserIcon,
  PlusCircle,
  Menu,
  X,
  Check,
  Gavel,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    switchUser,
    allUsers,
    currentView,
    navigateTo,
    activeMarket,
    setActiveMarket,
    favorites,
    unreadCount,
    pendingModerationCount,
    setSearchFilters,
    allListings,
  } = useApp();

  const [marketMenuOpen, setMarketMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const liveAuctionsCount = allListings.filter(
    (l) => l.listingFormat === 'AUCTION' && l.status === 'ACTIVE'
  ).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 text-slate-900 shadow-xs">
      {/* Top Utility Ribbon */}
      <div className="bg-slate-50 border-b border-slate-200/70 text-slate-600 text-xs px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-slate-800">Honest Car Marketplace</span>
            <span className="hidden md:inline text-slate-400">·</span>
            <span className="hidden md:inline text-slate-500">
              Cold-start videos & disclosed mechanical reports on every car
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Market Selector */}
            <div className="relative">
              <button
                onClick={() => setMarketMenuOpen(!marketMenuOpen)}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors py-0.5 px-2 rounded-md hover:bg-slate-200/60 cursor-pointer font-medium"
              >
                <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
                <span>{activeMarket.city}, {activeMarket.state}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {marketMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Select Regional Market
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {POPULAR_MARKETS.map((market) => (
                      <button
                        key={market.id}
                        onClick={() => {
                          setActiveMarket(market);
                          setMarketMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          activeMarket.id === market.id ? 'text-[#C2410C] font-semibold bg-orange-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span>{market.name}</span>
                        {activeMarket.id === market.id && <Check className="w-3.5 h-3.5 text-[#C2410C]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <span className="text-slate-300">|</span>

            {/* Persona Switcher for Evaluation */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 py-0.5 px-2 rounded-md hover:bg-slate-200/60 text-[11px] font-medium transition cursor-pointer"
              >
                <img src={currentUser.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                <span className="truncate max-w-[110px] sm:max-w-[140px]">
                  {currentUser.name}
                </span>
                <span className="text-slate-400 text-[10px]">({currentUser.role})</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-68 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    Switch Demo Persona
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                        currentUser.id === u.id ? 'bg-orange-50/60 text-[#C2410C] font-semibold' : 'text-slate-700'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.role} · {u.city}</div>
                      </div>
                      {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Wordmark (Zone 1) */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold group-hover:bg-[#C2410C] transition-colors shadow-xs">
              <Car className="w-5 h-5 -rotate-3" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                MyNext<span className="text-[#C2410C]">Whip</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links (Zone 2) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => {
                setSearchFilters({ listingFormat: 'ALL', noReserveOnly: false });
                navigateTo('browse');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'browse'
                  ? 'text-slate-950 font-semibold bg-slate-100'
                  : 'hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              Browse Whips
            </button>

            <button
              onClick={() => {
                setSearchFilters({ listingFormat: 'AUCTION', noReserveOnly: false });
                navigateTo('browse');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer font-medium"
            >
              <Gavel className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Live Auctions</span>
              {liveAuctionsCount > 0 && (
                <span className="bg-orange-100 text-[#C2410C] text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                  {liveAuctionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setSearchFilters({ maxPrice: 5000 });
                navigateTo('browse');
              }}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Under $5K
            </button>

            <button
              onClick={() => navigateTo('safety')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'safety'
                  ? 'text-slate-950 font-semibold bg-slate-100'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
              }`}
            >
              How It Works
            </button>

            <button
              onClick={() => navigateTo('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                currentView === 'admin'
                  ? 'text-purple-700 bg-purple-50 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
              {pendingModerationCount > 0 && (
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                  {pendingModerationCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Action Controls & Primary CTA (Zone 3) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Saved Whips */}
          <button
            onClick={() => navigateTo('saved')}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Saved Whips"
            aria-label="Saved vehicles"
          >
            <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-[#C2410C] fill-[#C2410C]/20' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#C2410C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Messages */}
          <button
            onClick={() => navigateTo('messages')}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="Messages"
            aria-label="Messages"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Primary CTA: Sell Your Whip */}
          <button
            onClick={() => navigateTo('sell')}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 shrink-0 text-orange-400" />
            <span>List a Whip</span>
          </button>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg">
          <button
            onClick={() => {
              setSearchFilters({ listingFormat: 'ALL', noReserveOnly: false });
              navigateTo('browse');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
          >
            Browse All Whips
          </button>
          <button
            onClick={() => {
              setSearchFilters({ listingFormat: 'AUCTION', noReserveOnly: false });
              navigateTo('browse');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-[#C2410C] font-semibold hover:bg-orange-50 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Gavel className="w-4 h-4" />
              <span>Live Auctions</span>
            </div>
            {liveAuctionsCount > 0 && (
              <span className="text-xs bg-orange-100 text-[#C2410C] font-bold px-2 py-0.5 rounded-full">
                {liveAuctionsCount} active
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setSearchFilters({ maxPrice: 5000 });
              navigateTo('browse');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-700 font-medium hover:bg-slate-50 rounded-lg"
          >
            Under $5,000 Whips
          </button>
          <button
            onClick={() => {
              navigateTo('sell');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-between"
          >
            <span>List Your Vehicle</span>
            <span className="text-xs text-slate-500 font-normal">$19 fee</span>
          </button>
          <button
            onClick={() => {
              navigateTo('safety');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg"
          >
            Marketplace Transparency & Safety
          </button>
          <button
            onClick={() => {
              navigateTo('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-lg flex items-center justify-between"
          >
            <span>Admin Dashboard</span>
            {pendingModerationCount > 0 && (
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                {pendingModerationCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
