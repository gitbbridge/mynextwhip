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

export interface Listing {
  id: string;
  slug: string;
  vehicle: Vehicle;
  sellerId: string;
  seller: User;
  askingPrice: number; // in dollars
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
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'distance' | 'mileage_asc';
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: 'LISTING' | 'USER' | 'REPORT' | 'PAYMENT';
  targetId: string;
  targetSummary: string;
  timestamp: string;
  notes?: string;
}
