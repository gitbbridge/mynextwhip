import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Search, Plus, Heart, MessageSquare, Shield, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentView, navigateTo, favorites, unreadCount, currentUser } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#12151A]/95 backdrop-blur-md border-t border-zinc-800 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
      {/* Browse */}
      <button
        onClick={() => navigateTo('browse')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'browse' ? 'text-[#EA580C]' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Browse</span>
      </button>

      {/* Search */}
      <button
        onClick={() => navigateTo('browse')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'browse' ? 'text-zinc-400' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-semibold mt-0.5">Search</span>
      </button>

      {/* Sell - Center Prominent Action */}
      <button
        onClick={() => navigateTo('sell')}
        className="flex flex-col items-center justify-center -mt-4 relative group cursor-pointer"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F97316] text-white flex items-center justify-center shadow-lg shadow-orange-950/60 border-2 border-[#12151A] group-active:scale-95 transition-transform">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
        <span className="text-[10px] font-extrabold text-[#EA580C] mt-0.5">Sell</span>
      </button>

      {/* Saved */}
      <button
        onClick={() => navigateTo('saved')}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'saved' ? 'text-[#EA580C]' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Heart className={`w-5 h-5 ${favorites.length > 0 && currentView === 'saved' ? 'fill-[#EA580C]' : ''}`} />
        {favorites.length > 0 && (
          <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-[#EA580C] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {favorites.length}
          </span>
        )}
        <span className="text-[10px] font-semibold mt-0.5">Saved</span>
      </button>

      {/* Messages */}
      <button
        onClick={() => navigateTo('messages')}
        className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'messages' ? 'text-[#EA580C]' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-3.5 h-3.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
        <span className="text-[10px] font-semibold mt-0.5">Messages</span>
      </button>

      {/* Admin / Profile */}
      <button
        onClick={() => navigateTo('admin')}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
          currentView === 'admin' ? 'text-purple-400' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        {currentUser.role === 'ADMIN' ? (
          <Shield className="w-5 h-5 text-purple-400" />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="text-[10px] font-semibold mt-0.5">
          {currentUser.role === 'ADMIN' ? 'Admin' : 'Profile'}
        </span>
      </button>
    </div>
  );
};
