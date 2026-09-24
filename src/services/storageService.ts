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
};

export interface PlatformConfig {
  standardListingFee: number; // e.g. 19
  featuredListingFee: number; // e.g. 29
  allowDealerSubscriptions: boolean;
  activeMarketCity: string;
  activeMarketZip: string;
  defaultRadiusMiles: number;
}

const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  standardListingFee: 19,
  featuredListingFee: 29,
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

export class MarketplaceStorage {
  static init() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      safeSet(STORAGE_KEYS.USERS, SEED_USERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      safeSet(STORAGE_KEYS.CURRENT_USER_ID, SEED_USERS[0].id); // Default to Mike (buyer)
    }
    if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
      safeSet(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
      safeSet(STORAGE_KEYS.OFFERS, SEED_OFFERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
      safeSet(STORAGE_KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
      safeSet(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES)) {
      safeSet(STORAGE_KEYS.CHAT_MESSAGES, SEED_CHAT_MESSAGES);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      safeSet(STORAGE_KEYS.FAVORITES, ['whip_tacoma_2008', 'whip_miata_1993']);
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
      safeSet(STORAGE_KEYS.REPORTS, SEED_REPORTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
      safeSet(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PLATFORM_CONFIG)) {
      safeSet(STORAGE_KEYS.PLATFORM_CONFIG, DEFAULT_PLATFORM_CONFIG);
    }
  }

  // Users
  static getUsers(): User[] {
    return safeGet<User[]>(STORAGE_KEYS.USERS, SEED_USERS);
  }

  static getCurrentUser(): User {
    const users = this.getUsers();
    const currentId = safeGet<string>(STORAGE_KEYS.CURRENT_USER_ID, users[0]?.id || 'user_mike');
    return users.find((u) => u.id === currentId) || users[0];
  }

  static setCurrentUser(userId: string) {
    safeSet(STORAGE_KEYS.CURRENT_USER_ID, userId);
  }

  // Listings
  static getListings(): Listing[] {
    return safeGet<Listing[]>(STORAGE_KEYS.LISTINGS, SEED_LISTINGS);
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
    return safeGet<Offer[]>(STORAGE_KEYS.OFFERS, SEED_OFFERS);
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

  // Appointments
  static getAppointments(): Appointment[] {
    return safeGet<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, SEED_APPOINTMENTS);
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
    return safeGet<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  }

  static getMessages(conversationId: string): ChatMessage[] {
    const all = safeGet<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHAT_MESSAGES, SEED_CHAT_MESSAGES);
    return all[conversationId] || [];
  }

  static sendMessage(conversationId: string, message: ChatMessage): void {
    const all = safeGet<Record<string, ChatMessage[]>>(STORAGE_KEYS.CHAT_MESSAGES, SEED_CHAT_MESSAGES);
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
    return safeGet<ReportSubmission[]>(STORAGE_KEYS.REPORTS, SEED_REPORTS);
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
    return safeGet<AdminAuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, SEED_AUDIT_LOGS);
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
}
