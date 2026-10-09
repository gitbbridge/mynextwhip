import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Search, Plus, Heart, MessageSquare, Shield, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, navigateTo, favorites, unreadCount, currentUser } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg safe-area-bottom">
      {/* Browse */}
      <button
        onClick={() => navigateTo('browse')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'browse' ? 'text-[#C2410C] font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Browse</span>
      </button>

      {/* Saved */}
      <button
        onClick={() => navigateTo('saved')}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'saved' ? 'text-[#C2410C] font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Heart className={`w-5 h-5 ${favorites.length > 0 && currentView === 'saved' ? 'fill-[#C2410C]' : ''}`} />
        {favorites.length > 0 && (
          <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-[#C2410C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {favorites.length}
          </span>
        )}
        <span className="text-[10px] mt-0.5">Saved</span>
      </button>

      {/* Sell - Center Prominent Action */}
      <button
        onClick={() => navigateTo('sell')}
        className="flex flex-col items-center justify-center -mt-3.5 relative group cursor-pointer"
        aria-label="List a vehicle"
      >
        <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-md border-2 border-white group-active:scale-95 transition-transform">
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </div>
        <span className="text-[10px] font-semibold text-slate-900 mt-0.5">Sell</span>
      </button>

      {/* Messages */}
      <button
        onClick={() => navigateTo('messages')}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'messages' ? 'text-[#C2410C] font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
        <span className="text-[10px] mt-0.5">Messages</span>
      </button>

      {/* Admin / Profile */}
      <button
        onClick={() => navigateTo('profile')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'profile' ? 'text-[#C2410C] font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Account</span>
      </button>
    </div>
  );
};
