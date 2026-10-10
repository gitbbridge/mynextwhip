import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  Listing,
  User,
  SearchFilterState,
  Offer,
  Appointment,
  Conversation,
  ChatMessage,
  ReportSubmission,
  AdminAuditLog,
  SavedSearch,
  ListingStatus,
  Transaction,
  TransactionAddon,
  AddonType,
  calculatePerformanceFee,
  ADDON_PRICING,
} from '../types';
import { MarketplaceStorage, PlatformConfig } from '../services/storageService';
import { MarketRegion, POPULAR_MARKETS, calculateDistanceMiles, resolveLocationFromZip } from '../services/geoService';

interface AppContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  allUsers: User[];

  // Authentication & Customer Accounts
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModal: (initialTab?: 'login' | 'register') => void;
  authModalInitialTab: 'login' | 'register';
  registerCustomer: (params: {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    state?: string;
    role?: 'BUYER' | 'SELLER' | 'DEALER';
    isDealer?: boolean;
    dealerName?: string;
  }) => User;
  loginCustomer: (emailOrPhone: string) => boolean;
  logoutCustomer: () => void;

  // Production vs Demo Data Controls
  isSeedDataEnabled: boolean;
  purgeAllDemoData: () => void;
  restoreDemoData: () => void;
  setSeedDataMode: (mode: 'demo' | 'clean') => void;
  
  // Navigation & View state
  currentView: 'home' | 'browse' | 'detail' | 'sell' | 'saved' | 'messages' | 'admin' | 'safety' | 'profile';
  navigateTo: (view: AppContextType['currentView'], slugOrParams?: string) => void;
  selectedWhipSlug: string | null;

  // Active Market & Geographic Context
  activeMarket: MarketRegion;
  setActiveMarket: (market: MarketRegion) => void;

  // Inventory & Search
  listings: Listing[];
  allListings: Listing[];
  searchFilters: SearchFilterState;
  setSearchFilters: (filters: Partial<SearchFilterState> | ((prev: SearchFilterState) => SearchFilterState)) => void;
  resetFilters: () => void;
  saveCurrentSearch: (name?: string) => void;
  savedSearches: SavedSearch[];
  removeSavedSearch: (id: string) => void;

  // Engagement
  favorites: string[];
  toggleFavorite: (listingId: string) => void;
  isFavorite: (listingId: string) => boolean;

  // Messaging, Offers & Appointments
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  getConversationMessages: (id: string) => ChatMessage[];
  sendMessage: (conversationId: string, text: string) => void;
  startOrOpenConversation: (listingId: string, sellerId: string) => string;
  offers: Offer[];
  createOffer: (listingId: string, amount: number, message?: string) => void;
  updateOfferStatus: (offerId: string, status: Offer['status']) => void;
  placeAuctionBid: (listingId: string, amount: number) => { success: boolean; error?: string };
  startAuctionForListing: (
    listingId: string,
    params: { startingBid: number; isNoReserve: boolean; reservePrice?: number; durationDays: number }
  ) => { success: boolean; error?: string };
  endAuctionEarly: (listingId: string, acceptHighBid?: boolean) => void;
  appointments: Appointment[];
  createAppointment: (listingId: string, date: string, timeSlot: string, safeMeetupNote: string) => void;
  updateAppointmentStatus: (aptId: string, status: Appointment['status']) => void;

  // NEW PRICING & TRANSACTION COLLECTION FRAMEWORK
  transactions: Transaction[];
  authorizeBuyerHold: (
    listingId: string,
    meetTime?: string,
    initialAddons?: AddonType[]
  ) => { success: boolean; transaction: Transaction };
  finalizeTradeAndCaptureFee: (
    transactionId: string,
    finalSalePrice: number,
    additionalAddons?: AddonType[]
  ) => { success: boolean; performanceFee: number; totalCaptured: number };
  claimFlakePenalty: (transactionId: string, reason?: string) => { success: boolean };
  releaseHoldForUndisclosedFlaw: (transactionId: string, flawReason: string) => { success: boolean };
  requestMobilePPI: (listingId: string, notes?: string) => { success: boolean; chargeId: string };
  requestAddon: (transactionId: string, addonType: AddonType) => { success: boolean };
  getTransactionForListing: (listingId: string) => Transaction | undefined;

  // Admin & Moderation
  reports: ReportSubmission[];
  auditLogs: AdminAuditLog[];
  submitReport: (listingId: string, reason: ReportSubmission['reason'], details: string) => void;
  updateListingStatus: (listingId: string, status: ListingStatus, notes?: string) => void;
  featureListing: (listingId: string, featured: boolean) => void;
  resolveReport: (reportId: string, status: ReportSubmission['status']) => void;
  platformConfig: PlatformConfig;
  updatePlatformConfig: (cfg: Partial<PlatformConfig>) => void;

  // Badges & Counters
  pendingModerationCount: number;
  unreadCount: number;

  // Notifications
  notification: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showNotification: (message: string, type?: 'success' | 'info' | 'warning') => void;

  // Refresh trigger
  refreshAll: () => void;
}

const DEFAULT_FILTERS: SearchFilterState = {
  keyword: '',
  minPrice: undefined,
  maxPrice: undefined,
  minMileage: undefined,
  maxMileage: undefined,
  minYear: undefined,
  maxYear: undefined,
  make: '',
  model: '',
  bodyStyle: '',
  category: '',
  titleStatus: '',
  transmission: '',
  drivetrain: '',
  zip: '80202',
  radiusMiles: 50,
  hasColdStart: false,
  hasWalkaround: false,
  hasServiceRecords: false,
  sellerType: 'ALL',
  sortBy: 'newest',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Init storage on mount
  useEffect(() => {
    MarketplaceStorage.init();
  }, []);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refreshAll = () => setRefreshTrigger((prev) => prev + 1);

  const [currentUser, setCurrentUserState] = useState<User>(() => MarketplaceStorage.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(() => MarketplaceStorage.getUsers());
  const [currentView, setCurrentView] = useState<AppContextType['currentView']>('home');
  const [selectedWhipSlug, setSelectedWhipSlug] = useState<string | null>(null);

  const [activeMarket, setActiveMarketState] = useState<MarketRegion>(() => POPULAR_MARKETS[0]);
  const [searchFilters, setSearchFiltersState] = useState<SearchFilterState>(DEFAULT_FILTERS);

  const [allListings, setAllListings] = useState<Listing[]>(() => MarketplaceStorage.getListings());
  const [favorites, setFavorites] = useState<string[]>(() => MarketplaceStorage.getFavorites());
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => MarketplaceStorage.getSavedSearches());
  const [conversations, setConversations] = useState<Conversation[]>(() => MarketplaceStorage.getConversations());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>(() => MarketplaceStorage.getOffers());
  const [appointments, setAppointments] = useState<Appointment[]>(() => MarketplaceStorage.getAppointments());
  const [transactions, setTransactions] = useState<Transaction[]>(() => MarketplaceStorage.getTransactions());
  const [reports, setReports] = useState<ReportSubmission[]>(() => MarketplaceStorage.getReports());
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(() => MarketplaceStorage.getAuditLogs());
  const [platformConfig, setPlatformConfig] = useState<PlatformConfig>(() => MarketplaceStorage.getPlatformConfig());

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState<'login' | 'register'>('login');

  const openAuthModal = (initialTab: 'login' | 'register' = 'login') => {
    setAuthModalInitialTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const registerCustomer = (params: {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    state?: string;
    role?: 'BUYER' | 'SELLER' | 'DEALER';
    isDealer?: boolean;
    dealerName?: string;
  }) => {
    const newUser = MarketplaceStorage.registerUser(params);
    refreshAll();
    showNotification(`Welcome to MyNextWhip, ${newUser.name}! Profile verified & ready.`, 'success');
    return newUser;
  };

  const loginCustomer = (emailOrPhone: string) => {
    const user = MarketplaceStorage.loginUser(emailOrPhone);
    if (user) {
      refreshAll();
      showNotification(`Welcome back, ${user.name}!`, 'success');
      return true;
    }
    showNotification('No matching account found with that email or phone number.', 'warning');
    return false;
  };

  const logoutCustomer = () => {
    const users = MarketplaceStorage.getUsers();
    if (users.length > 0) {
      MarketplaceStorage.setCurrentUser(users[0].id);
      refreshAll();
      showNotification('Signed out of profile.', 'info');
    }
  };

  const isSeedDataEnabled = MarketplaceStorage.isSeedDataEnabled();

  const purgeAllDemoData = () => {
    MarketplaceStorage.purgeAllDemoData();
    refreshAll();
    showNotification('All demo listings & test data purged. Clean Production Slate is active!', 'success');
  };

  const restoreDemoData = () => {
    MarketplaceStorage.restoreDemoData();
    refreshAll();
    showNotification('Sample demo inventory & listings restored.', 'info');
  };

  const setSeedDataMode = (mode: 'demo' | 'clean') => {
    MarketplaceStorage.setSeedDataMode(mode);
    refreshAll();
    showNotification(
      mode === 'clean'
        ? 'Clean Production Slate active. Ready for real customer listings!'
        : 'Demo Mode active with sample vehicles.',
      'info'
    );
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Re-sync on refresh
  useEffect(() => {
    setAllUsers(MarketplaceStorage.getUsers());
    setCurrentUserState(MarketplaceStorage.getCurrentUser());
    setAllListings(MarketplaceStorage.getListings());
    setFavorites(MarketplaceStorage.getFavorites());
    setSavedSearches(MarketplaceStorage.getSavedSearches());
    setConversations(MarketplaceStorage.getConversations());
    setOffers(MarketplaceStorage.getOffers());
    setAppointments(MarketplaceStorage.getAppointments());
    setTransactions(MarketplaceStorage.getTransactions());
    setReports(MarketplaceStorage.getReports());
    setAuditLogs(MarketplaceStorage.getAuditLogs());
    setPlatformConfig(MarketplaceStorage.getPlatformConfig());
  }, [refreshTrigger]);

  // Sync market selection to filters
  const setActiveMarket = (market: MarketRegion) => {
    setActiveMarketState(market);
    setSearchFiltersState((prev) => ({
      ...prev,
      zip: market.defaultZip,
    }));
  };

  const switchUser = (userId: string) => {
    MarketplaceStorage.setCurrentUser(userId);
    const updated = MarketplaceStorage.getCurrentUser();
    setCurrentUserState(updated);
    showNotification(`Switched profile to ${updated.name} (${updated.role})`, 'info');
  };

  const navigateTo = (view: AppContextType['currentView'], slugOrParams?: string) => {
    if (view === 'detail' && slugOrParams) {
      setSelectedWhipSlug(slugOrParams);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setSearchFilters = (
    filters: Partial<SearchFilterState> | ((prev: SearchFilterState) => SearchFilterState)
  ) => {
    if (typeof filters === 'function') {
      setSearchFiltersState(filters);
    } else {
      setSearchFiltersState((prev) => ({ ...prev, ...filters }));
    }
  };

  const resetFilters = () => {
    setSearchFiltersState({
      ...DEFAULT_FILTERS,
      zip: activeMarket.defaultZip,
    });
  };

  const saveCurrentSearch = (customName?: string) => {
    const name =
      customName ||
      `${searchFilters.category || searchFilters.make || 'Whips'} within ${searchFilters.radiusMiles || 50} mi`;
    const newSearch: SavedSearch = {
      id: `ss_${Date.now()}`,
      name,
      criteria: { ...searchFilters },
      createdAt: new Date().toISOString(),
    };
    MarketplaceStorage.addSavedSearch(newSearch);
    setSavedSearches(MarketplaceStorage.getSavedSearches());
    showNotification(`Search saved: "${name}"`, 'success');
  };

  const removeSavedSearch = (id: string) => {
    MarketplaceStorage.removeSavedSearch(id);
    setSavedSearches(MarketplaceStorage.getSavedSearches());
    showNotification('Saved search removed', 'info');
  };

  const toggleFavorite = (listingId: string) => {
    const isNowFaved = MarketplaceStorage.toggleFavorite(listingId);
    setFavorites(MarketplaceStorage.getFavorites());
    setAllListings(MarketplaceStorage.getListings());
    showNotification(isNowFaved ? 'Whip added to Saved' : 'Whip removed from Saved', 'info');
  };

  const isFavorite = (listingId: string) => favorites.includes(listingId);

  // Geographic distance and dynamic filtering for public browse
  const listings = useMemo(() => {
    const originLocation = resolveLocationFromZip(searchFilters.zip || activeMarket.defaultZip);

    return allListings
      .filter((listing) => {
        // Only active listings in public browse (unless current user is owner or admin)
        const isOwner = listing.sellerId === currentUser.id;
        const isAdmin = currentUser.role === 'ADMIN';
        if (listing.status !== 'ACTIVE' && !isOwner && !isAdmin) {
          return false;
        }

        // Price
        if (searchFilters.minPrice && listing.askingPrice < searchFilters.minPrice) return false;
        if (searchFilters.maxPrice && listing.askingPrice > searchFilters.maxPrice) return false;

        // Mileage
        if (searchFilters.minMileage && listing.vehicle.mileage < searchFilters.minMileage) return false;
        if (searchFilters.maxMileage && listing.vehicle.mileage > searchFilters.maxMileage) return false;

        // Year
        if (searchFilters.minYear && listing.vehicle.year < searchFilters.minYear) return false;
        if (searchFilters.maxYear && listing.vehicle.year > searchFilters.maxYear) return false;

        // Make & Model
        if (searchFilters.make && !listing.vehicle.make.toLowerCase().includes(searchFilters.make.toLowerCase())) {
          return false;
        }
        if (searchFilters.model && !listing.vehicle.model.toLowerCase().includes(searchFilters.model.toLowerCase())) {
          return false;
        }

        // Vibe Category
        if (searchFilters.category) {
          if (searchFilters.category === 'Under $5K' && listing.askingPrice > 5000) return false;
          if (searchFilters.category === 'Under $10K' && listing.askingPrice > 10000) return false;
          if (searchFilters.category === 'Manual' && listing.vehicle.transmission !== 'Manual') return false;
          if (searchFilters.category === '4x4' && !['4WD', 'AWD'].includes(listing.vehicle.drivetrain)) return false;
          if (
            !['Under $5K', 'Under $10K', 'Manual', '4x4'].includes(searchFilters.category) &&
            listing.category !== searchFilters.category
          ) {
            return false;
          }
        }

        // Body Style
        if (searchFilters.bodyStyle && listing.vehicle.bodyStyle !== searchFilters.bodyStyle) {
          return false;
        }

        // Title Status
        if (searchFilters.titleStatus && listing.vehicle.titleStatus !== searchFilters.titleStatus) {
          return false;
        }

        // Transmission
        if (searchFilters.transmission && listing.vehicle.transmission !== searchFilters.transmission) {
          return false;
        }

        // Drivetrain
        if (searchFilters.drivetrain && listing.vehicle.drivetrain !== searchFilters.drivetrain) {
          return false;
        }

        // Evidence & Verification checkboxes
        if (searchFilters.hasColdStart && !listing.verifications.coldStartProvided) return false;
        if (searchFilters.hasWalkaround && !listing.verifications.walkaroundProvided) return false;
        if (searchFilters.hasServiceRecords && !listing.verifications.serviceRecordsProvided) return false;

        // Seller Type
        if (searchFilters.sellerType === 'PRIVATE' && listing.seller.isDealer) return false;
        if (searchFilters.sellerType === 'DEALER' && !listing.seller.isDealer) return false;

        // Listing Format (Auction vs Fixed)
        if (searchFilters.listingFormat && searchFilters.listingFormat !== 'ALL') {
          if (searchFilters.listingFormat === 'AUCTION' && listing.listingFormat !== 'AUCTION') return false;
          if (searchFilters.listingFormat === 'FIXED_PRICE' && listing.listingFormat === 'AUCTION') return false;
        }

        // No Reserve Only
        if (searchFilters.noReserveOnly && (!listing.auction || !listing.auction.isNoReserve)) {
          return false;
        }

        // Keyword query
        if (searchFilters.keyword) {
          const kw = searchFilters.keyword.toLowerCase();
          const matchTitle = `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model} ${listing.vehicle.trim || ''}`.toLowerCase();
          const matchDesc = listing.sellerDescription.toLowerCase();
          const matchIssues = listing.issues.map((i) => i.title + ' ' + i.description).join(' ').toLowerCase();
          if (!matchTitle.includes(kw) && !matchDesc.includes(kw) && !matchIssues.includes(kw)) {
            return false;
          }
        }

        // Geographic Radius
        const dist = calculateDistanceMiles(
          originLocation.lat,
          originLocation.lng,
          listing.location.lat,
          listing.location.lng
        );
        listing.distanceMiles = dist;

        if (searchFilters.radiusMiles && searchFilters.radiusMiles < 99999) {
          if (dist > searchFilters.radiusMiles) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (searchFilters.sortBy === 'ending_soon') {
          const aEnd = a.auction ? new Date(a.auction.endsAt).getTime() : 9999999999999;
          const bEnd = b.auction ? new Date(b.auction.endsAt).getTime() : 9999999999999;
          return aEnd - bEnd;
        }
        if (searchFilters.sortBy === 'bids_desc') {
          const aBids = a.auction?.bidsCount || 0;
          const bBids = b.auction?.bidsCount || 0;
          return bBids - aBids;
        }
        if (searchFilters.sortBy === 'price_asc') return a.askingPrice - b.askingPrice;
        if (searchFilters.sortBy === 'price_desc') return b.askingPrice - a.askingPrice;
        if (searchFilters.sortBy === 'distance') return (a.distanceMiles || 0) - (b.distanceMiles || 0);
        if (searchFilters.sortBy === 'mileage_asc') return a.vehicle.mileage - b.vehicle.mileage;
        // Default newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [allListings, searchFilters, activeMarket, currentUser]);

  // Messaging
  const getConversationMessages = (id: string): ChatMessage[] => {
    return MarketplaceStorage.getMessages(id);
  };

  const sendMessage = (conversationId: string, text: string) => {
    const msg: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      timestamp: new Date().toISOString(),
    };
    MarketplaceStorage.sendMessage(conversationId, msg);
    setConversations(MarketplaceStorage.getConversations());
  };

  const startOrOpenConversation = (listingId: string, sellerId: string): string => {
    const convoId = MarketplaceStorage.appendSystemChatMessage(
      listingId,
      currentUser.id,
      sellerId,
      `Hi! I saw your listing on MyNextWhip and would like more information.`
    );
    setConversations(MarketplaceStorage.getConversations());
    setActiveConversationId(convoId);
    navigateTo('messages');
    return convoId;
  };

  // Offers
  const createOffer = (listingId: string, amount: number, message?: string) => {
    const listing = MarketplaceStorage.getListingById(listingId);
    if (!listing) return;

    const offer: Offer = {
      id: `off_${Date.now()}`,
      listingId,
      listingTitle: `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`,
      listingImage: listing.photos[0]?.url || '',
      listingPrice: listing.askingPrice,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerAvatar: currentUser.avatar,
      sellerId: listing.sellerId,
      amount,
      message,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    MarketplaceStorage.addOffer(offer);
    setOffers(MarketplaceStorage.getOffers());
    setAllListings(MarketplaceStorage.getListings());
    showNotification(`Offer of $${amount.toLocaleString()} sent to seller!`, 'success');
  };

  const updateOfferStatus = (offerId: string, status: Offer['status']) => {
    MarketplaceStorage.updateOfferStatus(offerId, status);
    setOffers(MarketplaceStorage.getOffers());
    setAllListings(MarketplaceStorage.getListings());
    showNotification(`Offer marked as ${status}`, 'info');
  };

  // Live Auctions
  const placeAuctionBid = (listingId: string, amount: number) => {
    const res = MarketplaceStorage.placeAuctionBid(listingId, currentUser, amount);
    if (res.success) {
      setAllListings(MarketplaceStorage.getListings());
      setConversations(MarketplaceStorage.getConversations());
      showNotification(`Bid of $${amount.toLocaleString()} placed! You are currently the highest bidder.`, 'success');
      return { success: true };
    } else {
      showNotification(res.error || 'Could not place bid.', 'warning');
      return { success: false, error: res.error };
    }
  };

  const startAuctionForListing = (
    listingId: string,
    params: { startingBid: number; isNoReserve: boolean; reservePrice?: number; durationDays: number }
  ) => {
    const res = MarketplaceStorage.startAuctionForListing(listingId, params);
    if (res.success) {
      setAllListings(MarketplaceStorage.getListings());
      showNotification(`Live Auction started! Bidders can now place bids.`, 'success');
      return { success: true };
    } else {
      showNotification(res.error || 'Could not start auction.', 'warning');
      return { success: false, error: res.error };
    }
  };

  const endAuctionEarly = (listingId: string, acceptHighBid: boolean = true) => {
    const res = MarketplaceStorage.endAuctionEarly(listingId, acceptHighBid);
    if (res.success) {
      setAllListings(MarketplaceStorage.getListings());
      showNotification(`Auction ended early. ${acceptHighBid ? 'Current high bid accepted!' : ''}`, 'info');
    }
  };

  // Appointments
  const createAppointment = (listingId: string, date: string, timeSlot: string, safeMeetupNote: string) => {
    const listing = MarketplaceStorage.getListingById(listingId);
    if (!listing) return;

    const apt: Appointment = {
      id: `apt_${Date.now()}`,
      listingId,
      listingTitle: `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: listing.sellerId,
      date,
      timeSlot,
      status: 'PENDING',
      safeMeetupNote,
      createdAt: new Date().toISOString(),
    };

    MarketplaceStorage.createAppointment(apt);
    setAppointments(MarketplaceStorage.getAppointments());
    showNotification('Inspection appointment requested!', 'success');
  };

  const updateAppointmentStatus = (aptId: string, status: Appointment['status']) => {
    MarketplaceStorage.updateAppointmentStatus(aptId, status);
    setAppointments(MarketplaceStorage.getAppointments());
    showNotification(`Appointment ${status.toLowerCase()}`, 'info');
  };

  // ---------------------------------------------------------------------------
  // NEW PRICING STRUCTURE & TRANSACTION COLLECTION IMPLEMENTATION
  // ---------------------------------------------------------------------------

  const getTransactionForListing = (listingId: string): Transaction | undefined => {
    return transactions.find((t) => t.listingId === listingId && t.status !== 'RELEASED_VOID');
  };

  const authorizeBuyerHold = (
    listingId: string,
    meetTime?: string,
    initialAddons: AddonType[] = []
  ): { success: boolean; transaction: Transaction } => {
    const listing = MarketplaceStorage.getListingById(listingId);
    if (!listing) throw new Error('Listing not found');

    const txId = `tx_${Date.now()}`;
    const addonsList: TransactionAddon[] = initialAddons.map((type) => ({
      id: `addon_${Date.now()}_${type.toLowerCase()}`,
      transactionId: txId,
      addonType: type,
      name: ADDON_PRICING[type].name,
      price: ADDON_PRICING[type].price,
      stripeChargeId: `ch_stripe_${Date.now()}`,
      status: 'AUTHORIZED',
      createdAt: new Date().toISOString(),
      details: ADDON_PRICING[type].description,
    }));

    const newTx: Transaction = {
      id: txId,
      listingId,
      listingTitle: `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`,
      listingImage: listing.photos[0]?.url || '',
      sellerId: listing.sellerId,
      sellerName: listing.seller.name,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerCardLast4: '4242',
      stripePaymentIntentId: `pi_hold_25_${Date.now()}`,
      status: 'HOLD_AUTHORIZED',
      holdAmount: 25.0,
      scheduledMeetTime: meetTime || new Date(Date.now() + 86400000 * 2).toISOString(),
      addons: addonsList,
      notes: 'Stripe $25 anti-flake hold placed. Listing committed for scheduled viewing.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    MarketplaceStorage.saveTransaction(newTx);
    setTransactions(MarketplaceStorage.getTransactions());

    // Webhook simulation: payment_intent.amount_capturable_updated
    // Transitions listing status from ACTIVE to COMMITTED
    MarketplaceStorage.updateListingStatus(
      listingId,
      'COMMITTED',
      'Buyer placed $25 anti-flake hold. Viewing window locked & listing marked COMMITTED.',
      currentUser
    );
    setAllListings(MarketplaceStorage.getListings());

    showNotification(
      '$25 Anti-Flake Hold Authorized. Viewing window locked & listing marked COMMITTED!',
      'success'
    );
    return { success: true, transaction: newTx };
  };

  const finalizeTradeAndCaptureFee = (
    transactionId: string,
    finalSalePrice: number,
    additionalAddons: AddonType[] = []
  ): { success: boolean; performanceFee: number; totalCaptured: number } => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) throw new Error('Transaction not found');

    const listing = allListings.find((l) => l.id === tx.listingId);
    const listingType =
      listing?.listingType === 'LIVE_AUCTION' || listing?.listingFormat === 'AUCTION'
        ? 'LIVE_AUCTION'
        : 'BUY_IT_NOW';
    const performanceFee = calculatePerformanceFee(finalSalePrice, listingType);

    const newAddons: TransactionAddon[] = additionalAddons.map((type) => ({
      id: `addon_${Date.now()}_${type.toLowerCase()}`,
      transactionId: tx.id,
      addonType: type,
      name: ADDON_PRICING[type].name,
      price: ADDON_PRICING[type].price,
      stripeChargeId: `ch_settle_${Date.now()}`,
      status: 'CAPTURED',
      createdAt: new Date().toISOString(),
      details: ADDON_PRICING[type].description,
    }));

    const allAddons = [...tx.addons, ...newAddons];
    const addonsTotal = allAddons.reduce((sum, a) => sum + a.price, 0);
    const totalCaptured = performanceFee + addonsTotal;

    // Webhook simulation: payment_intent.succeeded (performance fee captured)
    MarketplaceStorage.updateTransaction(tx.id, {
      status: 'CAPTURED_PERFORMANCE',
      finalPrice: finalSalePrice,
      performanceFee,
      addons: allAddons.map((a) => ({ ...a, status: 'CAPTURED' })),
      resolutionNote: `Trade completed at $${finalSalePrice.toLocaleString()}. Scaled performance fee ($${performanceFee}) + add-ons ($${addonsTotal}) captured programmatically from linked card.`,
    });

    MarketplaceStorage.updateListingStatus(
      tx.listingId,
      'SETTLED',
      `Trade closed for $${finalSalePrice.toLocaleString()}. Performance fee captured.`,
      currentUser
    );

    setTransactions(MarketplaceStorage.getTransactions());
    setAllListings(MarketplaceStorage.getListings());

    showNotification(
      `Deal Settled! Scaled fee of $${performanceFee.toFixed(2)} captured programmatically. Zero commissions on cash!`,
      'success'
    );

    return { success: true, performanceFee, totalCaptured };
  };

  const claimFlakePenalty = (transactionId: string, reason?: string): { success: boolean } => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) throw new Error('Transaction not found');

    // Webhook simulation: payment_intent.succeeded (penalty payout)
    MarketplaceStorage.updateTransaction(tx.id, {
      status: 'CAPTURED_PENALTY',
      payoutToSellerAmount: 25.0,
      resolutionNote: `Buyer flaked outside 2hr window. $25 hold permanently captured as seller compensation. Reason: ${reason || 'Buyer no-show'}.`,
    });

    // Listing resets back to ACTIVE in search feed
    MarketplaceStorage.updateListingStatus(
      tx.listingId,
      'ACTIVE',
      'Reset to ACTIVE after buyer no-show penalty enforcement.',
      currentUser
    );

    setTransactions(MarketplaceStorage.getTransactions());
    setAllListings(MarketplaceStorage.getListings());

    showNotification('Seller Guarantee Enforced: $25 no-show penalty captured and credited to seller!', 'warning');
    return { success: true };
  };

  const releaseHoldForUndisclosedFlaw = (transactionId: string, flawReason: string): { success: boolean } => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) throw new Error('Transaction not found');

    // Webhook simulation: payment_intent.canceled
    MarketplaceStorage.updateTransaction(tx.id, {
      status: 'RELEASED_VOID',
      resolutionNote: `Buyer passed due to undisclosed flaw: "${flawReason}". $25 authorization hold released at $0 cost.`,
    });

    // Listing resets back to ACTIVE in search feed
    MarketplaceStorage.updateListingStatus(
      tx.listingId,
      'ACTIVE',
      'Reset to ACTIVE after buyer passed due to undisclosed issue.',
      currentUser
    );

    setTransactions(MarketplaceStorage.getTransactions());
    setAllListings(MarketplaceStorage.getListings());

    showNotification('No Trade, No Fee: $25 hold instantly released back to buyer at $0 cost.', 'info');
    return { success: true };
  };

  const requestMobilePPI = (listingId: string, notes?: string): { success: boolean; chargeId: string } => {
    const listing = MarketplaceStorage.getListingById(listingId);
    if (!listing) throw new Error('Listing not found');

    const chargeId = `ch_ppi_95_${Date.now()}`;
    let tx = transactions.find((t) => t.listingId === listingId && t.status !== 'RELEASED_VOID');

    const addon: TransactionAddon = {
      id: `addon_ppi_${Date.now()}`,
      transactionId: tx ? tx.id : `tx_ppi_${Date.now()}`,
      addonType: 'MOBILE_PPI',
      name: ADDON_PRICING.MOBILE_PPI.name,
      price: ADDON_PRICING.MOBILE_PPI.price,
      stripeChargeId: chargeId,
      status: 'CAPTURED',
      createdAt: new Date().toISOString(),
      details: notes || 'Front Range independent mobile mechanic dispatched for 50-point diagnostic inspection.',
    };

    if (tx) {
      tx.addons.push(addon);
      MarketplaceStorage.updateTransaction(tx.id, { addons: tx.addons });
    } else {
      const newTx: Transaction = {
        id: addon.transactionId,
        listingId,
        listingTitle: `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`,
        listingImage: listing.photos[0]?.url || '',
        sellerId: listing.sellerId,
        sellerName: listing.seller.name,
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        buyerCardLast4: '4242',
        stripePaymentIntentId: `pi_ppi_${Date.now()}`,
        status: 'HOLD_AUTHORIZED',
        holdAmount: 25.0,
        addons: [addon],
        notes: 'Mobile PPI requested prior to in-person inspection.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      MarketplaceStorage.saveTransaction(newTx);
    }

    setTransactions(MarketplaceStorage.getTransactions());
    showNotification('Mobile Pre-Purchase Inspection ($95) authorized! Denver certified mechanic notified.', 'success');
    return { success: true, chargeId };
  };

  const requestAddon = (transactionId: string, addonType: AddonType): { success: boolean } => {
    const tx = transactions.find((t) => t.id === transactionId);
    if (!tx) throw new Error('Transaction not found');

    const addon: TransactionAddon = {
      id: `addon_${Date.now()}_${addonType.toLowerCase()}`,
      transactionId: tx.id,
      addonType,
      name: ADDON_PRICING[addonType].name,
      price: ADDON_PRICING[addonType].price,
      stripeChargeId: `ch_${addonType.toLowerCase()}_${Date.now()}`,
      status: 'AUTHORIZED',
      createdAt: new Date().toISOString(),
      details: ADDON_PRICING[addonType].description,
    };

    tx.addons.push(addon);
    MarketplaceStorage.updateTransaction(tx.id, { addons: tx.addons });
    setTransactions(MarketplaceStorage.getTransactions());

    showNotification(`${ADDON_PRICING[addonType].name} ($${ADDON_PRICING[addonType].price}) added to transaction!`, 'success');
    return { success: true };
  };

  // Moderation
  const submitReport = (listingId: string, reason: ReportSubmission['reason'], details: string) => {
    const listing = MarketplaceStorage.getListingById(listingId);
    const report: ReportSubmission = {
      id: `rep_${Date.now()}`,
      listingId,
      listingTitle: listing ? `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}` : 'Listing',
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reason,
      details,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    MarketplaceStorage.submitReport(report);
    setReports(MarketplaceStorage.getReports());
    showNotification('Report submitted for administrative review. Thank you for keeping the marketplace honest.', 'info');
  };

  const updateListingStatus = (listingId: string, status: ListingStatus, notes?: string) => {
    MarketplaceStorage.updateListingStatus(listingId, status, notes, currentUser);
    setAllListings(MarketplaceStorage.getListings());
    setAuditLogs(MarketplaceStorage.getAuditLogs());
    showNotification(`Listing status updated to ${status}`, 'success');
  };

  const featureListing = (listingId: string, featured: boolean) => {
    const listing = MarketplaceStorage.getListingById(listingId);
    if (listing) {
      listing.featured = featured;
      MarketplaceStorage.saveListing(listing);
      setAllListings(MarketplaceStorage.getListings());
      showNotification(`Listing ${featured ? 'promoted to Featured' : 'unfeatured'}`, 'info');
    }
  };

  const resolveReport = (reportId: string, status: ReportSubmission['status']) => {
    MarketplaceStorage.updateReportStatus(reportId, status);
    setReports(MarketplaceStorage.getReports());
    showNotification(`Report marked as ${status}`, 'info');
  };

  const updatePlatformConfig = (cfg: Partial<PlatformConfig>) => {
    const updated = MarketplaceStorage.updatePlatformConfig(cfg);
    setPlatformConfig(updated);
    showNotification('Platform settings updated', 'success');
  };

  const pendingModerationCount = allListings.filter((l) => l.status === 'PENDING_REVIEW').length;
  const unreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        allUsers,
        isAuthModalOpen,
        setIsAuthModalOpen,
        openAuthModal,
        authModalInitialTab,
        registerCustomer,
        loginCustomer,
        logoutCustomer,
        isSeedDataEnabled,
        purgeAllDemoData,
        restoreDemoData,
        setSeedDataMode,
        currentView,
        navigateTo,
        selectedWhipSlug,
        activeMarket,
        setActiveMarket,
        listings,
        allListings,
        searchFilters,
        setSearchFilters,
        resetFilters,
        saveCurrentSearch,
        savedSearches,
        removeSavedSearch,
        favorites,
        toggleFavorite,
        isFavorite,
        conversations,
        activeConversationId,
        setActiveConversationId,
        getConversationMessages,
        sendMessage,
        startOrOpenConversation,
        offers,
        createOffer,
        updateOfferStatus,
        placeAuctionBid,
        startAuctionForListing,
        endAuctionEarly,
        appointments,
        createAppointment,
        updateAppointmentStatus,
        transactions,
        authorizeBuyerHold,
        finalizeTradeAndCaptureFee,
        claimFlakePenalty,
        releaseHoldForUndisclosedFlaw,
        requestMobilePPI,
        requestAddon,
        getTransactionForListing,
        reports,
        auditLogs,
        submitReport,
        updateListingStatus,
        featureListing,
        resolveReport,
        platformConfig,
        updatePlatformConfig,
        pendingModerationCount,
        unreadCount,
        notification,
        showNotification,
        refreshAll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
