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
  Sparkles,
  LogIn,
  LogOut,
  Database,
  Trash2,
  RefreshCw,
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
    openAuthModal,
    isSeedDataEnabled,
    setSeedDataMode,
    logoutCustomer,
    purgeAllDemoData,
    restoreDemoData,
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
            {/* Mode Indicator & Quick Toggle */}
            <div className="flex items-center gap-1.5 bg-slate-200/70 px-2 py-0.5 rounded-full text-[10px] font-semibold">
              <span className={`w-1.5 h-1.5 rounded-full ${isSeedDataEnabled ? 'bg-amber-500' : 'bg-emerald-500 animate-pulse'}`} />
              <span className="text-slate-700 hidden sm:inline">Mode:</span>
              <span className={isSeedDataEnabled ? 'text-amber-800' : 'text-emerald-800 font-bold'}>
                {isSeedDataEnabled ? 'Demo Mode' : 'Clean Slate'}
              </span>
              <button
                onClick={() => setSeedDataMode(isSeedDataEnabled ? 'clean' : 'demo')}
                className="ml-1 text-[9px] uppercase tracking-wider font-bold text-[#EA580C] hover:underline cursor-pointer"
                title={isSeedDataEnabled ? 'Switch to Clean Production Slate (zero sample listings)' : 'Restore Sample Demo Data'}
              >
                [{isSeedDataEnabled ? 'Go Clean' : 'Load Demo'}]
              </button>
            </div>

            <span className="text-slate-300 hidden sm:inline">|</span>

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

            {/* Persona Switcher & Account Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 py-0.5 px-2 rounded-md hover:bg-slate-200/60 text-[11px] font-medium transition cursor-pointer"
              >
                <img src={currentUser.avatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                <span className="truncate max-w-[100px] sm:max-w-[130px]">
                  {currentUser.name}
                </span>
                <span className="text-slate-400 text-[10px]">({currentUser.role})</span>
                <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
                  {/* Current User Card */}
                  <div className="px-3.5 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-t-xl">
                    <div className="flex items-center gap-2.5">
                      <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-900 truncate">{currentUser.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{currentUser.email}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-800 px-1.5 py-0.5 rounded">
                        {currentUser.role}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Verified Member
                      </span>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        navigateTo('profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Profile & Vehicles</span>
                    </button>
                    <button
                      onClick={() => {
                        openAuthModal('login');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                    >
                      <LogIn className="w-3.5 h-3.5 text-blue-500" />
                      <span>Sign In / Create Account</span>
                    </button>
                  </div>

                  {/* Clean Slate Controls */}
                  <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50">
                    <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Data Configuration</span>
                      <span className={isSeedDataEnabled ? 'text-amber-600' : 'text-emerald-600 font-bold'}>
                        {isSeedDataEnabled ? 'Demo' : 'Clean'}
                      </span>
                    </div>
                    {isSeedDataEnabled ? (
                      <button
                        onClick={() => {
                          purgeAllDemoData();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Purge Demo Data (Clean Slate)</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          restoreDemoData();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Restore Demo Data (10 Cars)</span>
                      </button>
                    )}
                  </div>

                  {/* Switch Personas */}
                  {allUsers.length > 1 && (
                    <div className="pt-1.5 border-t border-slate-100">
                      <div className="px-3.5 py-1 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                        Switch Account / Persona
                      </div>
                      <div className="max-h-36 overflow-y-auto">
                        {allUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              switchUser(u.id);
                              setUserMenuOpen(false);
                            }}
                            className={`w-full text-left px-3.5 py-1.5 flex items-center gap-2 hover:bg-slate-50 transition-colors ${
                              currentUser.id === u.id ? 'bg-orange-50/60 text-[#C2410C] font-semibold' : 'text-slate-700'
                            }`}
                          >
                            <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-xs font-medium">{u.name}</div>
                              <div className="text-[10px] text-slate-400">{u.role}</div>
                            </div>
                            {currentUser.id === u.id && <Check className="w-3 h-3 text-[#C2410C] shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-1 border-t border-slate-100 mt-1">
                    <button
                      onClick={() => {
                        logoutCustomer();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center gap-2 text-xs"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
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

          {/* Quick Sign In button */}
          <button
            onClick={() => openAuthModal('login')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-500" />
            <span>Sign In</span>
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
              openAuthModal('login');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-[#C2410C] font-bold hover:bg-orange-50 rounded-lg flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Customer Sign In / Register</span>
          </button>
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
