import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MobileApp } from './components/mobile/MobileApp';
import { Header } from './components/common/Header';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Footer } from './components/common/Footer';
import { Hero } from './components/home/Hero';
import { VibeGrid } from './components/home/VibeGrid';
import { TrustSection } from './components/home/TrustSection';
import { BrowseFeed } from './components/browse/BrowseFeed';
import { VehicleDetail } from './components/detail/VehicleDetail';
import { SellWizard } from './components/sell/SellWizard';
import { MessagesView } from './components/messages/MessagesView';
import { SavedView } from './components/saved/SavedView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SafetyGuide } from './components/safety/SafetyGuide';
import { ProfileView } from './components/profile/ProfileView';
import { AuthModal } from './components/auth/AuthModal';
import { CheckCircle2, Info, AlertTriangle, Smartphone, Monitor } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, selectedWhipSlug, notification } = useApp();
  // Mode toggle: 'mobile' (default mobile-first smartphone app) vs 'desktop' (full desktop web view)
  const [appMode, setAppMode] = useState<'mobile' | 'desktop'>('mobile');

  if (appMode === 'mobile') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center">
        {/* Desktop Viewport Switcher Bar */}
        <header className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300 z-50">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-white tracking-tight">MyNextWhip Mobile Edition</span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full hidden sm:inline-block">
              320–430px Mobile-First Flow
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setAppMode('mobile')}
              className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-indigo-600 text-white flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile App</span>
            </button>
            <button
              onClick={() => setAppMode('desktop')}
              className="px-2.5 py-1 rounded-lg font-bold text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop View</span>
            </button>
          </div>
        </header>

        {/* Primary Mobile App Experience */}
        <MobileApp />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#12151A]">
      {/* Switcher Bar to return to Mobile App */}
      <header className="w-full bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300 z-50">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white tracking-tight">MyNextWhip Desktop Portal</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setAppMode('mobile')}
            className="px-2.5 py-1 rounded-lg font-bold text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile App</span>
          </button>
          <button
            onClick={() => setAppMode('desktop')}
            className="px-2.5 py-1 rounded-lg font-bold text-[11px] bg-indigo-600 text-white flex items-center gap-1 shadow-2xs cursor-pointer"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop View</span>
          </button>
        </div>
      </header>

      {/* Customer Login / Register Modal */}
      <AuthModal />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full animate-in slide-in-from-top-2 duration-200">
          <div
            className={`p-3.5 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold ${
              notification.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
                : notification.type === 'warning'
                ? 'bg-amber-950 text-amber-100 border-amber-800'
                : 'bg-zinc-900 text-white border-zinc-700'
            }`}
          >
            {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {notification.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {notification.type === 'info' && <Info className="w-4 h-4 text-[#EA580C] shrink-0" />}
            <span className="flex-1">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header />

      {/* Dynamic View Routing */}
      <main className="flex-1">
        {currentView === 'home' && (
          <>
            <Hero />
            <VibeGrid />
            <TrustSection />
            <BrowseFeed />
          </>
        )}

        {currentView === 'browse' && <BrowseFeed />}

        {currentView === 'detail' && selectedWhipSlug && (
          <VehicleDetail slug={selectedWhipSlug} />
        )}

        {currentView === 'sell' && <SellWizard />}

        {currentView === 'messages' && <MessagesView />}

        {currentView === 'saved' && <SavedView />}

        {currentView === 'admin' && <AdminDashboard />}

        {currentView === 'safety' && <SafetyGuide />}

        {currentView === 'profile' && <ProfileView />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
