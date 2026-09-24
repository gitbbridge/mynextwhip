import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, selectedWhipSlug, notification } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#12151A]">
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
