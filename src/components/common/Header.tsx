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
  Sparkles,
  HelpCircle,
  Check,
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
  } = useApp();

  const [marketMenuOpen, setMarketMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#12151A] text-white border-b border-zinc-800 shadow-md">
      {/* Top micro announcement bar */}
      <div className="bg-[#1C2027] text-zinc-300 text-xs px-4 py-1.5 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium text-zinc-200">Honest Car Marketplace:</span>
            <span className="hidden sm:inline text-zinc-400">
              No hidden rust, no fake clean titles. Cold starts required.
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Market Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setMarketMenuOpen(!marketMenuOpen)}
                className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors cursor-pointer py-0.5 px-2 rounded hover:bg-zinc-800"
              >
                <MapPin className="w-3.5 h-3.5 text-[#EA580C]" />
                <span className="font-semibold">{activeMarket.city}, {activeMarket.state}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>

              {marketMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-[#1E232B] border border-zinc-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-zinc-700/80 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
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
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-zinc-700/50 transition-colors ${
                          activeMarket.id === market.id ? 'text-[#EA580C] font-bold bg-zinc-800/50' : 'text-zinc-200'
                        }`}
                      >
                        <span>{market.name}</span>
                        {activeMarket.id === market.id && <Check className="w-3.5 h-3.5 text-[#EA580C]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Quick Switcher */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 px-2.5 py-0.5 rounded text-[11px] font-medium border border-zinc-700 transition cursor-pointer"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="truncate max-w-[100px] sm:max-w-[130px]">
                  {currentUser.name} ({currentUser.role})
                </span>
                <ChevronDown className="w-2.5 h-2.5 text-zinc-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-[#1E232B] border border-zinc-700 rounded-lg shadow-2xl py-1 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-zinc-700/80 text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">
                    Test Personas & Roles
                  </div>
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setUserMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-zinc-700/50 transition-colors ${
                        currentUser.id === u.id ? 'bg-zinc-800/80 text-[#EA580C] font-semibold' : 'text-zinc-200'
                      }`}
                    >
                      <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
                      <div className="flex-1 truncate">
                        <div className="truncate">{u.name}</div>
                        <div className="text-[10px] text-zinc-400">{u.role} · {u.city}</div>
                      </div>
                      {currentUser.id === u.id && <Check className="w-3.5 h-3.5 text-[#EA580C]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#EA580C] to-[#C2410C] flex items-center justify-center shadow-lg shadow-orange-950/40 text-white font-extrabold group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 -rotate-6" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
                  MYNEXT<span className="text-[#EA580C]">WHIP</span>
                </span>
                <span className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded font-mono font-bold tracking-widest border border-zinc-700">
                  .COM
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 tracking-wider uppercase font-semibold hidden sm:block">
                Honest Affordable Car Marketplace
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4 text-sm font-medium">
            <button
              onClick={() => navigateTo('browse')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'browse'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              Browse Whips
            </button>
            <button
              onClick={() => navigateTo('browse')}
              className="px-3 py-1.5 text-zinc-300 hover:text-white hover:bg-zinc-800/60 rounded-lg transition-colors cursor-pointer"
            >
              Under $5K
            </button>
            <button
              onClick={() => navigateTo('safety')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                currentView === 'safety'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              How It Works & Safety
            </button>
          </nav>
        </div>

        {/* Right Action Icons & Primary CTA */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin link (Visible to all for demonstration/moderation review) */}
          <button
            onClick={() => navigateTo('admin')}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              currentView === 'admin'
                ? 'bg-purple-900/60 text-purple-200 border border-purple-700'
                : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
            {pendingModerationCount > 0 && (
              <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingModerationCount}
              </span>
            )}
          </button>

          {/* Saved Whips */}
          <button
            onClick={() => navigateTo('saved')}
            className="relative p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition cursor-pointer"
            title="Saved Whips & Searches"
          >
            <Heart className={`w-5 h-5 ${favorites.length > 0 ? 'text-[#EA580C] fill-[#EA580C]/20' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#EA580C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Messages */}
          <button
            onClick={() => navigateTo('messages')}
            className="relative p-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition cursor-pointer"
            title="Messages"
          >
            <MessageSquare className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Primary CTA: Sell Your Whip */}
          <button
            onClick={() => navigateTo('sell')}
            className="flex items-center gap-2 bg-gradient-to-r from-[#EA580C] to-[#F97316] hover:from-[#C2410C] hover:to-[#EA580C] text-white font-extrabold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm shadow-md shadow-orange-950/50 hover:shadow-orange-700/30 transition transform hover:-translate-y-0.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            <span className="tracking-wide uppercase font-heading text-xs sm:text-sm">
              Sell Your Whip
            </span>
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#181C23] border-b border-zinc-800 px-4 py-3 space-y-2">
          <button
            onClick={() => {
              navigateTo('browse');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-zinc-200 font-medium hover:bg-zinc-800 rounded-lg"
          >
            Browse All Whips
          </button>
          <button
            onClick={() => {
              navigateTo('sell');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-orange-400 font-bold hover:bg-zinc-800 rounded-lg flex items-center justify-between"
          >
            <span>List a Car (VIN to Live in 5 Mins)</span>
            <span className="text-xs bg-orange-950/80 text-orange-300 border border-orange-800 px-1.5 py-0.5 rounded">$19</span>
          </button>
          <button
            onClick={() => {
              navigateTo('saved');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-zinc-200 font-medium hover:bg-zinc-800 rounded-lg flex items-center justify-between"
          >
            <span>Saved Whips & Searches</span>
            {favorites.length > 0 && (
              <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">{favorites.length}</span>
            )}
          </button>
          <button
            onClick={() => {
              navigateTo('messages');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-zinc-200 font-medium hover:bg-zinc-800 rounded-lg"
          >
            Messages & Offers
          </button>
          <button
            onClick={() => {
              navigateTo('safety');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-zinc-200 font-medium hover:bg-zinc-800 rounded-lg"
          >
            Buyer & Seller Safety Guide
          </button>
          <button
            onClick={() => {
              navigateTo('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-purple-300 font-semibold hover:bg-zinc-800 rounded-lg flex items-center justify-between"
          >
            <span>Admin Moderation Queue</span>
            {pendingModerationCount > 0 && (
              <span className="text-xs bg-amber-500 text-black font-bold px-2 py-0.5 rounded-full">
                {pendingModerationCount} Pending
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
