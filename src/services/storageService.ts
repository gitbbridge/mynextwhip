import {
  Listing,
  User,
  Offer,
  Appointment,
  Conversation,
  ChatMessage,
  ReportSubmission,
  AdminAuditLog,
  SavedSearch,
  ListingStatus,
  AuctionBid,
  Transaction,
} from '../types';
import {
  SEED_USERS,
  SEED_LISTINGS,
  SEED_OFFERS,
  SEED_APPOINTMENTS,
  SEED_CONVERSATIONS,
  SEED_CHAT_MESSAGES,
  SEED_REPORTS,
  SEED_AUDIT_LOGS,
  SEED_TRANSACTIONS,
} from './seedData';

const STORAGE_KEYS = {
  USERS: 'mynextwhip_users',
  CURRENT_USER_ID: 'mynextwhip_current_user_id',
  LISTINGS: 'mynextwhip_listings',
  OFFERS: 'mynextwhip_offers',
  APPOINTMENTS: 'mynextwhip_appointments',
  CONVERSATIONS: 'mynextwhip_conversations',
  CHAT_MESSAGES: 'mynextwhip_chat_messages',
  FAVORITES: 'mynextwhip_favorites',
  SAVED_SEARCHES: 'mynextwhip_saved_searches',
  REPORTS: 'mynextwhip_reports',
  AUDIT_LOGS: 'mynextwhip_audit_logs',
  PLATFORM_CONFIG: 'mynextwhip_platform_config',
  TRANSACTIONS: 'mynextwhip_transactions',
  SEED_DATA_MODE: 'mynextwhip_seed_data_mode',
};

export interface PlatformConfig {
  standardListingFee: number; // e.g. 19 or 0
  featuredListingFee: number; // e.g. 29
  antiFlakeHoldAmount: number; // $25
  scaledFeeTierLow: number; // $25 (under $3k)
  scaledFeeTierMid: number; // $49 ($3k - $6k)
  scaledFeeTierHigh: number; // $99 ($6k - $10k)
  mobilePpiFee: number; // $95
  flatbedTowFee: number; // $45
  tempInsuranceFee: number; // $149
  allowDealerSubscriptions: boolean;
  activeMarketCity: string;
  activeMarketZip: string;
  defaultRadiusMiles: number;
}

const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  standardListingFee: 19,
  featuredListingFee: 29,
  antiFlakeHoldAmount: 25,
  scaledFeeTierLow: 25,
  scaledFeeTierMid: 49,
  scaledFeeTierHigh: 99,
  mobilePpiFee: 95,
  flatbedTowFee: 45,
  tempInsuranceFee: 149,
  allowDealerSubscriptions: true,
  activeMarketCity: 'Denver & Front Range, CO',
  activeMarketZip: '80202',
  defaultRadiusMiles: 50,
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

export const PRODUCTION_ADMIN_USER: User = {
  id: 'user_denver_admin',
  name: 'Denver Ops Admin',
  email: 'admin@mynextwhip.com',
  phone: '(303) 555-0100',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  role: 'ADMIN',
  verifiedPhone: true,
  verifiedIdentity: true,
  verifiedSeller: true,
  memberSince: '2026-01-01',
  responseRate: '100%',
  responseTime: '< 5 min',
  city: 'Denver',
  state: 'CO',
};

export class MarketplaceStorage {
  static isSeedDataEnabled(): boolean {
    const mode = safeGet<string | null>(STORAGE_KEYS.SEED_DATA_MODE, null);
    if (mode === 'clean') return false;
    if (mode === 'demo') return true;
    return (import.meta.env.VITE_ENABLE_SEED_DATA ?? 'true') !== 'false';
  }

  static setSeedDataMode(mode: 'demo' | 'clean'): void {
    safeSet(STORAGE_KEYS.SEED_DATA_MODE, mode);
    if (mode === 'clean') {
      this.purgeAllDemoData();
    } else {
      this.restoreDemoData();
    }
  }

  static init() {
    const isSeed = this.isSeedDataEnabled();

    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      safeSet(STORAGE_KEYS.USERS, isSeed ? SEED_USERS : [PRODUCTION_ADMIN_USER]);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      safeSet(STORAGE_KEYS.CURRENT_USER_ID, isSeed ? SEED_USERS[0].id : PRODUCTION_ADMIN_USER.id);
    }
    if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
      safeSet(STORAGE_KEYS.LISTINGS, isSeed ? SEED_LISTINGS : []);
    } else if (isSeed) {
      // Synchronize seed listings (photos, auctions) if stored listings predate updates
      const stored = safeGet<Listing[]>(STORAGE_KEYS.LISTINGS, []);
      let updated = false;
      for (const seedL of SEED_LISTINGS) {
        const item = stored.find((l) => l.id === seedL.id);
        if (item) {
          if (seedL.photos?.[0]?.url && item.photos?.[0]?.url !== seedL.photos[0].url) {
            item.photos[0].url = seedL.photos[0].url;
            updated = true;
          }
          if (seedL.coldStartVideo?.thumbnailUrl && item.coldStartVideo && item.coldStartVideo.thumbnailUrl !== seedL.coldStartVideo.thumbnailUrl) {
            item.coldStartVideo.thumbnailUrl = seedL.coldStartVideo.thumbnailUrl;
            updated = true;
          }
          if (seedL.auction && !item.auction) {
            item.listingFormat = 'AUCTION';
            item.auction = seedL.auction;
            updated = true;
          }
        }
      }
      if (updated) {
        safeSet(STORAGE_KEYS.LISTINGS, stored);
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
      safeSet(STORAGE_KEYS.OFFERS, isSeed ? SEED_OFFERS : []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      safeSet(STORAGE_KEYS.APPOINTMENTS, isSeed ? SEED_APPOINTMENTS : []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
      safeSet(STORAGE_KEYS.CONVERSATIONS, isSeed ? SEED_CONVERSATIONS : []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) {
      safeSet(STORAGE_KEYS.CHAT_MESSAGES, isSeed ? SEED_CHAT_MESSAGES : []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      safeSet(STORAGE_KEYS.FAVORITES, isSeed ? ['whip_tacoma_2008', 'whip_miata_1993'] : []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.SAVED_SEARCHES)) {
      const initialSaved: SavedSearch[] = [
        {
          id: 'ss_1',
          name: 'Manual Trucks & 4x4 under $10k',
          criteria: {
            category: '4x4',
            transmission: 'Manual',
            maxPrice: 10000,
            radiusMiles: 50,
          },
          createdAt: new Date().toISOString(),
        },
      ];
      safeSet(STORAGE_KEYS.SAVED_SEARCHES, initialSaved);
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      safeSet(STORAGE_KEYS.REPORTS, isSeed ? SEED_REPORTS : []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      safeSet(STORAGE_KEYS.AUDIT_LOGS, isSeed ? SEED_AUDIT_LOGS : []);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLATFORM_CONFIG)) {
      safeSet(STORAGE_KEYS.PLATFORM_CONFIG, DEFAULT_PLATFORM_CONFIG);
    }
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      safeSet(STORAGE_KEYS.TRANSACTIONS, isSeed ? SEED_TRANSACTIONS : []);
    } else if (isSeed) {
      const storedTx = safeGet<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
      let txUpdated = false;
      for (const seedTx of SEED_TRANSACTIONS) {
        const match = storedTx.find((t) => t.id === seedTx.id);
        if (match && match.listingImage !== seedTx.listingImage) {
          match.listingImage = seedTx.listingImage;
          txUpdated = true;
        }
      }
      if (txUpdated) {
        safeSet(STORAGE_KEYS.TRANSACTIONS, storedTx);
      }
    }
  }

  static purgeAllDemoData(): void {
    safeSet(STORAGE_KEYS.SEED_DATA_MODE, 'clean');
    safeSet(STORAGE_KEYS.LISTINGS, []);
    safeSet(STORAGE_KEYS.OFFERS, []);
    safeSet(STORAGE_KEYS.APPOINTMENTS, []);
    safeSet(STORAGE_KEYS.CONVERSATIONS, []);
    safeSet(STORAGE_KEYS.CHAT_MESSAGES, []);
    safeSet(STORAGE_KEYS.FAVORITES, []);
    safeSet(STORAGE_KEYS.TRANSACTIONS, []);
    safeSet(STORAGE_KEYS.REPORTS, []);

    // Filter out seed users, keeping only registered custom users
    const allUsers = this.getUsers();
    const seedUserIds = new Set(SEED_USERS.map((u) => u.id));
    const nonSeedUsers = allUsers.filter((u) => !seedUserIds.has(u.id));

    if (nonSeedUsers.length === 0) {
      nonSeedUsers.push(PRODUCTION_ADMIN_USER);
    }
    safeSet(STORAGE_KEYS.USERS, nonSeedUsers);
    
    // Set current user to first non-seed user or admin
    const current = nonSeedUsers[0];
    safeSet(STORAGE_KEYS.CURRENT_USER_ID, current.id);

    this.addAuditLog({
      id: `log_purge_${Date.now()}`,
      adminId: current.id,
      adminName: current.name,
      action: 'PURGE_ALL_DEMO_DATA',
      targetType: 'SYSTEM',
      targetId: 'all_demo_records',
      targetSummary: 'All seed listings, offers, appointments, and test transactions purged for Clean Production Slate.',
      timestamp: new Date().toISOString(),
      notes: 'Clean slate activated for live customer inventory.',
    });
  }

  static restoreDemoData(): void {
    safeSet(STORAGE_KEYS.SEED_DATA_MODE, 'demo');
    safeSet(STORAGE_KEYS.USERS, SEED_USERS);
    safeSet(STORAGE_KEYS.CURRENT_USER_ID, SEED_USERS[0].id);
    safeSet(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
    safeSet(STORAGE_KEYS.OFFERS, SEED_OFFERS);
    safeSet(STORAGE_KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
    safeSet(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
    safeSet(STORAGE_KEYS.CHAT_MESSAGES, SEED_CHAT_MESSAGES);
    safeSet(STORAGE_KEYS.FAVORITES, ['whip_tacoma_2008', 'whip_miata_1993']);
    safeSet(STORAGE_KEYS.TRANSACTIONS, SEED_TRANSACTIONS);
    safeSet(STORAGE_KEYS.REPORTS, SEED_REPORTS);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
  }

  // Users
  static getUsers(): User[] {
    const fallback = this.isSeedDataEnabled() ? SEED_USERS : [PRODUCTION_ADMIN_USER];
    return safeGet<User[]>(STORAGE_KEYS.USERS, fallback);
  }

  static getCurrentUser(): User {
    const users = this.getUsers();
    const fallbackId = users[0]?.id || (this.isSeedDataEnabled() ? 'user_mike' : PRODUCTION_ADMIN_USER.id);
    const currentId = safeGet<string>(STORAGE_KEYS.CURRENT_USER_ID, fallbackId);
    return users.find((u) => u.id === currentId) || users[0] || PRODUCTION_ADMIN_USER;
  }

  static setCurrentUser(userId: string) {
    safeSet(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  static registerUser(params: {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    state?: string;
    role?: 'BUYER' | 'SELLER' | 'DEALER';
    isDealer?: boolean;
    dealerName?: string;
  }): User {
    const users = this.getUsers();
    const id = `user_cust_${Date.now()}`;
    const initials = params.name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newUser: User = {
      id,
      name: params.name,
      email: params.email,
      phone: params.phone || '(303) 555-0199',
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(params.name)}&backgroundColor=0284c7,ea580c,16a34a,7c3aed`,
      role: params.role || 'BUYER',
      isDealer: params.isDealer || false,
      dealerName: params.dealerName,
      verifiedPhone: true,
      verifiedIdentity: true,
      verifiedSeller: params.role === 'SELLER' || params.role === 'DEALER',
      memberSince: new Date().toISOString().split('T')[0],
      responseRate: '100%',
      responseTime: '< 15 min',
      city: params.city || 'Denver',
      state: params.state || 'CO',
    };

    users.unshift(newUser);
    safeSet(STORAGE_KEYS.USERS, users);
    safeSet(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
    return newUser;
  }

  static loginUser(emailOrPhone: string): User | undefined {
    const users = this.getUsers();
    const query = emailOrPhone.trim().toLowerCase();
    const match = users.find(
      (u) =>
        u.email.toLowerCase() === query ||
        (u.phone && u.phone.replace(/\D/g, '') === query.replace(/\D/g, ''))
    );
    if (match) {
      safeSet(STORAGE_KEYS.CURRENT_USER_ID, match.id);
      return match;
    }
    return undefined;
  }

  // Listings
  static getListings(): Listing[] {
    const fallback = this.isSeedDataEnabled() ? SEED_LISTINGS : [];
    return safeGet<Listing[]>(STORAGE_KEYS.LISTINGS, fallback);
  }

  static getListingById(id: string): Listing | undefined {
    const listings = this.getListings();
    return listings.find((l) => l.id === id);
  }

  static getListingBySlug(slug: string): Listing | undefined {
    const listings = this.getListings();
    return listings.find((l) => l.slug === slug || l.id === slug);
  }

  static saveListing(listing: Listing): Listing {
    const listings = this.getListings();
    const existingIndex = listings.findIndex((l) => l.id === listing.id);

    if (existingIndex >= 0) {
      listings[existingIndex] = {
        ...listing,
        updatedAt: new Date().toISOString(),
      };
    } else {
      listings.unshift(listing);
    }

    safeSet(STORAGE_KEYS.LISTINGS, listings);
    return listing;
  }

  static updateListingStatus(
    listingId: string,
    newStatus: ListingStatus,
    adminNotes?: string,
    adminUser?: User
  ): Listing | undefined {
    const listings = this.getListings();
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return undefined;

    const oldStatus = listing.status;
    listing.status = newStatus;
    if (adminNotes) listing.adminNotes = adminNotes;
    listing.updatedAt = new Date().toISOString();

    safeSet(STORAGE_KEYS.LISTINGS, listings);

    // Audit log
    if (adminUser) {
      this.addAuditLog({
        id: `log_${Date.now()}`,
        adminId: adminUser.id,
        adminName: adminUser.name,
        action: `STATUS_CHANGE_${oldStatus}_TO_${newStatus}`,
        targetType: 'LISTING',
        targetId: listing.id,
        targetSummary: `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`,
        timestamp: new Date().toISOString(),
        notes: adminNotes,
      });
    }

    return listing;
  }

  // Offers
  static getOffers(): Offer[] {
    const fallback = this.isSeedDataEnabled() ? SEED_OFFERS : [];
    return safeGet<Offer[]>(STORAGE_KEYS.OFFERS, fallback);
  }

  static addOffer(offer: Offer): Offer {
    const offers = this.getOffers();
    offers.unshift(offer);
    safeSet(STORAGE_KEYS.OFFERS, offers);

    // Increment listing offer count
    const listing = this.getListingById(offer.listingId);
    if (listing) {
      listing.stats.offersCount += 1;
      this.saveListing(listing);
    }

    // Auto-create or append to chat conversation
    this.appendSystemChatMessage(
      offer.listingId,
      offer.buyerId,
      offer.sellerId,
      `Sent an offer for $${offer.amount.toLocaleString()}: "${offer.message || 'I am ready to buy this whip.'}"`,
      true,
      offer.amount
    );

    return offer;
  }

  static updateOfferStatus(offerId: string, status: Offer['status']): Offer | undefined {
    const offers = this.getOffers();
    const offer = offers.find((o) => o.id === offerId);
    if (!offer) return undefined;

    offer.status = status;
    safeSet(STORAGE_KEYS.OFFERS, offers);

    if (status === 'ACCEPTED') {
      const listing = this.getListingById(offer.listingId);
      if (listing) {
        listing.status = 'UNDER_OFFER';
        this.saveListing(listing);
      }
    }

    return offer;
  }

  // Auctions & Bidding
  static placeAuctionBid(
    listingId: string,
    bidder: User,
    amount: number
  ): { success: boolean; error?: string; listing?: Listing } {
    const listings = this.getListings();
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return { success: false, error: 'Listing not found.' };
    if (listing.listingFormat !== 'AUCTION' || !listing.auction) {
      return { success: false, error: 'This vehicle is not listed as an auction.' };
    }

    const now = Date.now();
    const endsTime = new Date(listing.auction.endsAt).getTime();
    if (now > endsTime) {
      return { success: false, error: 'This auction has already ended.' };
    }

    const currentHigh = listing.auction.currentBid || listing.auction.startingBid;
    const minIncrement = currentHigh < 2000 ? 50 : 100;
    const minRequiredBid = currentHigh + minIncrement;

    if (amount < minRequiredBid) {
      return {
        success: false,
        error: `Bid must be at least $${minRequiredBid.toLocaleString()} (+$${minIncrement} minimum increment).`,
      };
    }

    // Anti-sniping: if bid placed in final 2 minutes, extend endsAt by 2 minutes
    const twoMinutesMs = 2 * 60 * 1000;
    let antiSniped = false;
    if (endsTime - now < twoMinutesMs) {
      listing.auction.endsAt = new Date(endsTime + twoMinutesMs).toISOString();
      listing.auction.antiSnipingTriggered = true;
      antiSniped = true;
    }

    const newBid: AuctionBid = {
      id: `bid_${Date.now()}`,
      listingId,
      bidderId: bidder.id,
      bidderName: bidder.name,
      bidderAvatar: bidder.avatar,
      amount,
      createdAt: new Date().toISOString(),
    };

    if (!listing.auction.bids) {
      listing.auction.bids = [];
    }
    listing.auction.bids.unshift(newBid);
    listing.auction.currentBid = amount;
    listing.auction.currentHighBidderId = bidder.id;
    listing.auction.currentHighBidderName = bidder.name;
    listing.auction.bidsCount = (listing.auction.bidsCount || 0) + 1;
    listing.askingPrice = amount;

    this.saveListing(listing);

    // Notify via conversation stream
    this.appendSystemChatMessage(
      listing.id,
      bidder.id,
      listing.sellerId,
      `Placed a live bid of $${amount.toLocaleString()} on the auction! (Current High Bidder)${
        antiSniped ? ' · ⏱️ Anti-sniping: 2 minutes added to auction clock' : ''
      }`
    );

    return { success: true, listing };
  }

  static startAuctionForListing(
    listingId: string,
    params: {
      startingBid: number;
      isNoReserve: boolean;
      reservePrice?: number;
      durationDays: number;
    }
  ): { success: boolean; listing?: Listing; error?: string } {
    const listings = this.getListings();
    const listing = listings.find((l) => l.id === listingId);
    if (!listing) return { success: false, error: 'Vehicle not found.' };

    listing.listingFormat = 'AUCTION';
    listing.askingPrice = params.startingBid;
    listing.auction = {
      startingBid: params.startingBid,
      isNoReserve: params.isNoReserve,
      reservePrice: params.isNoReserve ? undefined : params.reservePrice,
      currentBid: params.startingBid,
      bidsCount: 0,
      endsAt: new Date(Date.now() + params.durationDays * 24 * 3600 * 1000).toISOString(),
      durationDays: params.durationDays,
      bids: [],
    };
    listing.updatedAt = new Date().toISOString();

    this.saveListing(listing);
    return { success: true, listing };
  }

  static endAuctionEarly(
    listingId: string,
    acceptHighBid: boolean = true
  ): { success: boolean; listing?: Listing; error?: string } {
    const listings = this.getListings();
    const listing = listings.find((l) => l.id === listingId);
    if (!listing || !listing.auction) {
      return { success: false, error: 'Auction not found.' };
    }

    listing.auction.endsAt = new Date().toISOString();
    if (acceptHighBid && listing.auction.currentHighBidderId) {
      listing.status = 'UNDER_OFFER';
    }
    listing.updatedAt = new Date().toISOString();
    this.saveListing(listing);
    return { success: true, listing };
  }

  // Appointments
  static getAppointments(): Appointment[] {
    const fallback = this.isSeedDataEnabled() ? SEED_APPOINTMENTS : [];
    return safeGet<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, fallback);
  }

  static createAppointment(apt: Appointment): Appointment {
    const apts = this.getAppointments();
    apts.unshift(apt);
    safeSet(STORAGE_KEYS.APPOINTMENTS, apts);

    this.appendSystemChatMessage(
      apt.listingId,
      apt.buyerId,
      apt.sellerId,
      `Requested an in-person vehicle inspection appointment for ${apt.date} (${apt.timeSlot}) at safe meetup: ${apt.safeMeetupNote}`
    );

    return apt;
  }

  static updateAppointmentStatus(aptId: string, status: Appointment['status']): Appointment | undefined {
    const apts = this.getAppointments();
    const apt = apts.find((a) => a.id === aptId);
    if (!apt) return undefined;

    apt.status = status;
    safeSet(STORAGE_KEYS.APPOINTMENTS, apts);
    return apt;
  }

  // Conversations & Messages
  static getConversations(): Conversation[] {
    const fallback = this.isSeedDataEnabled() ? SEED_CONVERSATIONS : [];
    return safeGet<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, fallback);
  }

  static getMessages(conversationId: string): ChatMessage[] {
    const fallback = this.isSeedDataEnabled() ? SEED_CHAT_MESSAGES : {};
    const all = safeGet<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHAT_MESSAGES, fallback);
    return all[conversationId] || [];
  }

  static sendMessage(conversationId: string, message: ChatMessage): void {
    const fallback = this.isSeedDataEnabled() ? SEED_CHAT_MESSAGES : {};
    const all = safeGet<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHAT_MESSAGES, fallback);
    if (!all[conversationId]) {
      all[conversationId] = [];
    }
    all[conversationId].push(message);
    safeSet(STORAGE_KEYS.CHAT_MESSAGES, all);

    // Update conversation metadata
    const convos = this.getConversations();
    const cIndex = convos.findIndex((c) => c.id === conversationId);
    if (cIndex >= 0) {
      convos[cIndex].lastMessage = message.text;
      convos[cIndex].updatedAt = message.timestamp;
      safeSet(STORAGE_KEYS.CONVERSATIONS, convos);
    }
  }

  static appendSystemChatMessage(
    listingId: string,
    buyerId: string,
    sellerId: string,
    text: string,
    isOffer?: boolean,
    offerAmount?: number
  ): string {
    const convos = this.getConversations();
    let convo = convos.find((c) => c.listingId === listingId && c.buyerId === buyerId);

    const listing = this.getListingById(listingId);
    const users = this.getUsers();
    const buyer = users.find((u) => u.id === buyerId) || SEED_USERS[0];
    const seller = users.find((u) => u.id === sellerId) || SEED_USERS[1];

    if (!convo) {
      convo = {
        id: `conv_${Date.now()}`,
        listingId,
        listingTitle: listing ? `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}` : 'Vehicle Inquiry',
        listingPrice: listing ? listing.askingPrice : 0,
        listingImage: listing?.photos[0]?.url || '',
        buyerId,
        buyerName: buyer.name,
        sellerId,
        sellerName: seller.name,
        lastMessage: text,
        updatedAt: new Date().toISOString(),
        unreadCount: 0,
      };
      convos.unshift(convo);
      safeSet(STORAGE_KEYS.CONVERSATIONS, convos);
    }

    const message: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId: convo.id,
      senderId: buyerId,
      senderName: buyer.name,
      senderAvatar: buyer.avatar,
      text,
      timestamp: new Date().toISOString(),
      isOfferNotice: isOffer,
      offerAmount,
    };

    this.sendMessage(convo.id, message);
    return convo.id;
  }

  // Favorites
  static getFavorites(): string[] {
    return safeGet<string[]>(STORAGE_KEYS.FAVORITES, []);
  }

  static toggleFavorite(listingId: string): boolean {
    const favs = this.getFavorites();
    const idx = favs.indexOf(listingId);
    let isFaved = false;

    if (idx >= 0) {
      favs.splice(idx, 1);
      isFaved = false;
    } else {
      favs.push(listingId);
      isFaved = true;
    }

    safeSet(STORAGE_KEYS.FAVORITES, favs);

    const listing = this.getListingById(listingId);
    if (listing) {
      listing.stats.saves = Math.max(0, listing.stats.saves + (isFaved ? 1 : -1));
      this.saveListing(listing);
    }

    return isFaved;
  }

  // Saved Searches
  static getSavedSearches(): SavedSearch[] {
    return safeGet<SavedSearch[]>(STORAGE_KEYS.SAVED_SEARCHES, []);
  }

  static addSavedSearch(search: SavedSearch): void {
    const searches = this.getSavedSearches();
    searches.unshift(search);
    safeSet(STORAGE_KEYS.SAVED_SEARCHES, searches);
  }

  static removeSavedSearch(id: string): void {
    const searches = this.getSavedSearches().filter((s) => s.id !== id);
    safeSet(STORAGE_KEYS.SAVED_SEARCHES, searches);
  }

  // Reports
  static getReports(): ReportSubmission[] {
    const fallback = this.isSeedDataEnabled() ? SEED_REPORTS : [];
    return safeGet<ReportSubmission[]>(STORAGE_KEYS.REPORTS, fallback);
  }

  static submitReport(report: ReportSubmission): void {
    const reps = this.getReports();
    reps.unshift(report);
    safeSet(STORAGE_KEYS.REPORTS, reps);
  }

  static updateReportStatus(reportId: string, status: ReportSubmission['status']): void {
    const reps = this.getReports();
    const rep = reps.find((r) => r.id === reportId);
    if (rep) {
      rep.status = status;
      safeSet(STORAGE_KEYS.REPORTS, reps);
    }
  }

  // Audit Logs
  static getAuditLogs(): AdminAuditLog[] {
    const fallback = this.isSeedDataEnabled() ? SEED_AUDIT_LOGS : [];
    return safeGet<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, fallback);
  }

  static addAuditLog(log: AdminAuditLog): void {
    const logs = this.getAuditLogs();
    logs.unshift(log);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // Config
  static getPlatformConfig(): PlatformConfig {
    return safeGet<PlatformConfig>(STORAGE_KEYS.PLATFORM_CONFIG, DEFAULT_PLATFORM_CONFIG);
  }

  static updatePlatformConfig(config: Partial<PlatformConfig>): PlatformConfig {
    const current = this.getPlatformConfig();
    const updated = { ...current, ...config };
    safeSet(STORAGE_KEYS.PLATFORM_CONFIG, updated);
    return updated;
  }

  // Transactions & Performance Fees
  static getTransactions(): Transaction[] {
    const fallback = this.isSeedDataEnabled() ? SEED_TRANSACTIONS : [];
    return safeGet<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, fallback);
  }

  static getTransactionByListingId(listingId: string): Transaction | undefined {
    return this.getTransactions().find((tx) => tx.listingId === listingId);
  }

  static saveTransaction(tx: Transaction): void {
    const txs = this.getTransactions();
    const existingIndex = txs.findIndex((t) => t.id === tx.id);
    if (existingIndex >= 0) {
      txs[existingIndex] = tx;
    } else {
      txs.unshift(tx);
    }
    safeSet(STORAGE_KEYS.TRANSACTIONS, txs);
  }

  static updateTransaction(txId: string, updates: Partial<Transaction>): Transaction | undefined {
    const txs = this.getTransactions();
    const tx = txs.find((t) => t.id === txId);
    if (tx) {
      Object.assign(tx, updates, { updatedAt: new Date().toISOString() });
      safeSet(STORAGE_KEYS.TRANSACTIONS, txs);
      return tx;
    }
    return undefined;
  }
}

