import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  CreditCard,
  User,
  Car,
  ShieldCheck,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { Listing, Transaction } from '../../types';
import { HomeScreen } from './screens/HomeScreen';
import { ListingDetailScreen } from './screens/ListingDetailScreen';
import { CommitHoldScreen } from './screens/CommitHoldScreen';
import { SettlementScreen } from './screens/SettlementScreen';
import { TransactionsScreen } from './screens/TransactionsScreen';
import { ProfileScreen } from './screens/ProfileScreen';

export type MobileTab = 'home' | 'transactions' | 'profile';

export const MobileApp: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<MobileTab>('home');

  // Sub-screens state within Home/Flow
  const [currentScreen, setCurrentScreen] = useState<
    'browse' | 'detail' | 'commit_hold' | 'settlement'
  >('browse');

  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [focusTxId, setFocusTxId] = useState<string | undefined>(undefined);

  // Active holds count for badge
  const [activeHoldsCount, setActiveHoldsCount] = useState<number>(1);

  // Transitions helper
  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentScreen('detail');
  };

  const handleStartCommitHold = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentScreen('commit_hold');
  };

  const handleHoldSuccess = (tx: Transaction, txId: string) => {
    setActiveTransaction(tx);
    setFocusTxId(txId);
    setActiveHoldsCount((c) => c + 1);
    setCurrentScreen('settlement');
  };

  const handleSettlementComplete = (settledTx: Transaction) => {
    setActiveTransaction(settledTx);
    setFocusTxId(settledTx.id);
    setActiveTab('transactions');
    setCurrentScreen('browse');
  };

  const handleSwitchTab = (tab: MobileTab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      setCurrentScreen('browse');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-stretch antialiased selection:bg-indigo-500 selection:text-white">
      {/* Mobile App Container: 320px to 430px width constraint */}
      <div className="w-full max-w-[430px] min-h-screen bg-white flex flex-col relative shadow-2xl border-x border-slate-200 overflow-hidden">
        
        {/* Dynamic Screen Routing with Framer Motion transitions */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key={`home-${currentScreen}`}
                initial={{ opacity: 0, x: currentScreen === 'browse' ? -10 : 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="min-h-full"
              >
                {currentScreen === 'browse' && (
                  <HomeScreen onSelectListing={handleSelectListing} />
                )}

                {currentScreen === 'detail' && selectedListing && (
                  <ListingDetailScreen
                    listing={selectedListing}
                    onBack={() => setCurrentScreen('browse')}
                    onCommitHold={handleStartCommitHold}
                  />
                )}

                {currentScreen === 'commit_hold' && selectedListing && (
                  <CommitHoldScreen
                    listing={selectedListing}
                    onBack={() => setCurrentScreen('detail')}
                    onHoldSuccess={handleHoldSuccess}
                  />
                )}

                {currentScreen === 'settlement' && selectedListing && activeTransaction && (
                  <SettlementScreen
                    listing={selectedListing}
                    transaction={activeTransaction}
                    onBack={() => setCurrentScreen('detail')}
                    onSettlementComplete={handleSettlementComplete}
                  />
                )}
              </motion.div>
            )}

            {activeTab === 'transactions' && (
              <motion.div
                key="transactions-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="min-h-full"
              >
                <TransactionsScreen
                  onBackToHome={() => handleSwitchTab('home')}
                  initialSelectedTransactionId={focusTxId}
                  onSettleTransaction={(tx) => {
                    if (selectedListing) {
                      setActiveTransaction(tx);
                      setCurrentScreen('settlement');
                      setActiveTab('home');
                    } else {
                      // Fallback listing
                      setActiveTransaction(tx);
                      setActiveTab('home');
                      setCurrentScreen('browse');
                    }
                  }}
                />
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="min-h-full"
              >
                <ProfileScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* 3-Tab Mobile Bottom Navigation (Tap Target >= 44px) */}
        <nav
          aria-label="Mobile Bottom Navigation"
          className="sticky bottom-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-3 py-2 flex items-center justify-around shadow-lg"
        >
          {/* TAB 1: Home */}
          <button
            onClick={() => handleSwitchTab('home')}
            className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] rounded-xl transition-colors relative active:scale-95 ${
              activeTab === 'home'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] tracking-tight">Home</span>
            {activeTab === 'home' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2 w-8 h-1 bg-indigo-600 rounded-full"
              />
            )}
          </button>

          {/* TAB 2: Transactions */}
          <button
            onClick={() => handleSwitchTab('transactions')}
            className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] rounded-xl transition-colors relative active:scale-95 ${
              activeTab === 'transactions'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <div className="relative">
              <CreditCard className="w-5 h-5 mb-0.5" />
              {activeHoldsCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-amber-500 text-white font-mono font-bold text-[9px] flex items-center justify-center">
                  {activeHoldsCount}
                </span>
              )}
            </div>
            <span className="text-[11px] tracking-tight">Transactions</span>
            {activeTab === 'transactions' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2 w-8 h-1 bg-indigo-600 rounded-full"
              />
            )}
          </button>

          {/* TAB 3: Profile */}
          <button
            onClick={() => handleSwitchTab('profile')}
            className={`flex-1 flex flex-col items-center justify-center py-1 min-h-[44px] rounded-xl transition-colors relative active:scale-95 ${
              activeTab === 'profile'
                ? 'text-indigo-600 font-bold'
                : 'text-slate-500 hover:text-slate-900 font-medium'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] tracking-tight">Profile</span>
            {activeTab === 'profile' && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute -top-2 w-8 h-1 bg-indigo-600 rounded-full"
              />
            )}
          </button>
        </nav>
      </div>
    </div>
  );
};
