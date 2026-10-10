export type UserRole = 'BUYER' | 'SELLER' | 'DEALER' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: UserRole;
  isDealer?: boolean;
  dealerName?: string;
  verifiedPhone: boolean;
  verifiedIdentity: boolean;
  verifiedSeller: boolean;
  memberSince: string;
  responseRate: string;
  responseTime: string;
  city: string;
  state: string;
}

export type TitleStatus = 'Clean' | 'Rebuilt' | 'Salvage' | 'Missing' | 'Parts Only';
export type BodyStyle = 'Sedan' | 'Coupe' | 'Hatchback' | 'Wagon' | 'SUV' | 'Truck' | 'Van' | 'Convertible' | 'Other';
export type TransmissionType = 'Automatic' | 'Manual' | 'Other';
export type DrivetrainType = 'FWD' | 'RWD' | 'AWD' | '4WD';

export type ListingStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'PROCESSING'
  | 'NEEDS_INFORMATION'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'ACTIVE'
  | 'COMMITTED'
  | 'SETTLED'
  | 'ABANDONED'
  | 'UNDER_OFFER'
  | 'SOLD'
  | 'ARCHIVED';

export type VibeCategory = 
  | 'Daily Driver'
  | 'Daily Drivers'
  | 'Project'
  | 'Project Cars'
  | 'Mechanic Special'
  | 'Work Truck'
  | 'Van'
  | 'Cheap & Fun'
  | '4x4'
  | 'Manual'
  | 'Under $5K'
  | 'Under $10K';

export type IssueCategory = 
  | 'check_engine'
  | 'oil_leak'
  | 'coolant_leak'
  | 'rust'
  | 'bad_tires'
  | 'bad_brakes'
  | 'ac_broken'
  | 'transmission'
  | 'suspension'
  | 'electrical'
  | 'accident'
  | 'cosmetic'
  | 'needs_maintenance'
  | 'modified'
  | 'project'
  | 'no_run'
  | 'other';

export interface DisclosedIssue {
  id: string;
  category: IssueCategory;
  title: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  affectsDrivability: boolean;
}

export interface ServiceRecord {
  id: string;
  date: string;
  mileage: number;
  workPerformed: string;
  cost: number;
  shopOrDiy: string;
  receiptNote?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  type: 'photo' | 'video_cold_start' | 'video_walkaround' | 'receipt';
  label: string;
  caption?: string;
  durationSeconds?: number;
}

export interface Vehicle {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  engine: string;
  transmission: TransmissionType;
  drivetrain: DrivetrainType;
  bodyStyle: BodyStyle;
  fuelType: string;
  exteriorColor: string;
  interiorColor: string;
  titleStatus: TitleStatus;
  modifications?: string;
}

export interface ListingLocation {
  zip: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  neighborhood?: string;
}

export interface AuctionBid {
  id: string;
  listingId: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar: string;
  amount: number;
  createdAt: string;
}

export interface AuctionDetails {
  startingBid: number;
  reservePrice?: number; // undefined or 0 means No Reserve
  isNoReserve: boolean;
  currentBid: number;
  currentHighBidderId?: string;
  currentHighBidderName?: string;
  bidsCount: number;
  endsAt: string; // ISO date string
  durationDays: number;
  bids: AuctionBid[];
  antiSnipingTriggered?: boolean;
}

export interface Listing {
  id: string;
  slug: string;
  vehicle: Vehicle;
  sellerId: string;
  seller: User;
  askingPrice: number; // in dollars (or starting bid / current bid)
  listingFormat?: 'FIXED_PRICE' | 'AUCTION';
  listingType?: 'BUY_IT_NOW' | 'LIVE_AUCTION';
  auction?: AuctionDetails;
  status: ListingStatus;
  category: VibeCategory;
  location: ListingLocation;
  distanceMiles?: number;
  sellerDescription: string;
  issues: DisclosedIssue[];
  serviceRecords: ServiceRecord[];
  photos: MediaItem[];
  coldStartVideo?: MediaItem;
  walkaroundVideo?: MediaItem;
  verifications: {
    vinDecoded: boolean;
    titleReviewed: boolean;
    coldStartProvided: boolean;
    walkaroundProvided: boolean;
    serviceRecordsProvided: boolean;
    sellerVerified: boolean;
  };
  stats: {
    views: number;
    saves: number;
    offersCount: number;
  };
  featured?: boolean;
  listingFeePaid: boolean;
  listingFeeAmount: number;
  flagStatus?: 'NONE' | 'FLAGGED' | 'SUSPENDED';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Offer {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingPrice: number;
  buyerId: string;
  buyerName: string;
  buyerAvatar: string;
  sellerId: string;
  amount: number;
  message?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  createdAt: string;
}

export interface Appointment {
  id: string;
  listingId: string;
  listingTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  date: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';
  safeMeetupNote: string;
  buyerOutcome?: 'INSPECTED' | 'PURCHASED' | 'DID_NOT_BUY' | 'SELLER_NO_SHOW';
  sellerOutcome?: 'BUYER_SHOWED' | 'BUYER_NO_SHOW' | 'VEHICLE_SOLD';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isOfferNotice?: boolean;
  offerAmount?: number;
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingPrice: number;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
}

export interface ReportSubmission {
  id: string;
  listingId: string;
  listingTitle: string;
  reporterId: string;
  reporterName: string;
  reason: 'scam' | 'fraud' | 'incorrect_info' | 'stolen' | 'duplicate' | 'offensive' | 'dealer_misrep' | 'other';
  details: string;
  status: 'PENDING' | 'INVESTIGATING' | 'REVIEWED' | 'DISMISSED' | 'ACTIONED';
  createdAt: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  criteria: SearchFilterState;
  createdAt: string;
}

export interface SearchFilterState {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  minMileage?: number;
  maxMileage?: number;
  minYear?: number;
  maxYear?: number;
  make?: string;
  model?: string;
  bodyStyle?: BodyStyle | '';
  category?: VibeCategory | '';
  titleStatus?: TitleStatus | '';
  transmission?: TransmissionType | '';
  drivetrain?: DrivetrainType | '';
  zip?: string;
  radiusMiles?: number;
  hasColdStart?: boolean;
  hasWalkaround?: boolean;
  hasServiceRecords?: boolean;
  sellerType?: 'ALL' | 'PRIVATE' | 'DEALER';
  listingFormat?: 'ALL' | 'FIXED_PRICE' | 'AUCTION';
  noReserveOnly?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'distance' | 'mileage_asc' | 'ending_soon' | 'bids_desc';
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'LISTING' | 'USER' | 'REPORT' | 'PAYMENT' | 'SYSTEM';
  targetId: string;
  targetSummary: string;
  timestamp: string;
  notes?: string;
}

// ---------------------------------------------------------------------------
// NEW PRICING STRUCTURE & TRANSACTION COLLECTION FRAMEWORK
// ---------------------------------------------------------------------------

export type TransactionStatus = 
  | 'HOLD_AUTHORIZED'       // $25 anti-flake authorization locked by Stripe
  | 'CAPTURED_PERFORMANCE'  // Trade closed successfully, scaled performance fee captured
  | 'CAPTURED_PENALTY'      // Buyer flaked without 2hr notice, $25 paid to seller
  | 'RELEASED_VOID';        // Legitimate pass due to undisclosed flaw, $25 released

export type AddonType = 'FLATBED_TOWING' | 'MOBILE_PPI' | 'TEMP_INSURANCE';

export interface TransactionAddon {
  id: string;
  transactionId: string;
  addonType: AddonType;
  name: string;
  price: number;
  stripeChargeId?: string;
  status: 'REQUESTED' | 'AUTHORIZED' | 'CAPTURED' | 'CANCELLED';
  createdAt: string;
  details?: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  buyerCardLast4?: string;
  stripePaymentIntentId: string; // Tracks the initial verification hold
  status: TransactionStatus;
  holdAmount: number; // $25.00
  finalPrice?: number;
  performanceFee?: number; // Scaled fee: $25, $49, $95, $99, $149
  scheduledMeetTime?: string;
  addons: TransactionAddon[];
  payoutToSellerAmount?: number; // E.g. $25 penalty on buyer flake
  resolutionNote?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calculates dynamically scaled performance fee based on sub-$10k Front Range asset tiers:
 * Buy It Now (BIN):
 * - Under $3,000: $25.00
 * - $3,000 to $6,000: $49.00
 * - $6,000 to $10,000: $99.00
 * - Over $10,000: $149.00
 *
 * Live Auction (Hammer Price):
 * - Under $3,000: $25.00
 * - $3,000 to $6,000: $95.00
 * - $6,000 to $10,000: $149.00
 * - Over $10,000: $149.00
 */
export const calculatePerformanceFee = (
  finalSalePrice: number,
  listingType: 'BUY_IT_NOW' | 'LIVE_AUCTION' = 'BUY_IT_NOW'
): number => {
  if (listingType === 'LIVE_AUCTION') {
    if (finalSalePrice < 3000) return 25.0;
    if (finalSalePrice <= 6000) return 95.0;
    return 149.0;
  }

  // Buy It Now (BIN)
  if (finalSalePrice < 3000) return 25.0;
  if (finalSalePrice <= 6000) return 49.0;
  if (finalSalePrice <= 10000) return 99.0;
  return 149.0;
};

export const ADDON_PRICING: Record<AddonType, { name: string; price: number; description: string }> = {
  MOBILE_PPI: {
    name: 'Mobile Pre-Purchase Inspection (PPI)',
    price: 95.0,
    description: 'Certified independent Denver mechanic travels on-site for 50-point mechanical & OBD-II diagnostic check.',
  },
  FLATBED_TOWING: {
    name: 'Local Flatbed Towing Dispatch',
    price: 45.0,
    description: 'Front Range flatbed towing to safely transport project or unregistered vehicle home.',
  },
  TEMP_INSURANCE: {
    name: 'Temporary Transit Insurance (5-Day Drive-Away)',
    price: 149.0,
    description: 'Instant legally binding temporary comprehensive drive-away coverage for private party transport.',
  },
};

