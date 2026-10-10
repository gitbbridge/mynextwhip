import { Transaction, Listing, AddonType, ADDON_PRICING, calculatePerformanceFee } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export interface CreateHoldPayload {
  listingId: string;
  buyerId?: string;
  sellerId?: string;
  scheduledMeetTime?: string;
  cardDetails?: {
    cardholderName: string;
    last4: string;
    expiry?: string;
    zip?: string;
  };
}

export interface CreateHoldResponse {
  success: boolean;
  transactionId: string;
  paymentIntentId: string;
  clientSecret: string;
  status: 'HOLD_AUTHORIZED' | string;
  holdAmount: number;
  transaction?: Transaction;
  error?: string;
}

export interface FinalizeSettlementPayload {
  transactionId: string;
  listingId?: string;
  finalSalePrice: number;
  listingType?: 'BUY_IT_NOW' | 'LIVE_AUCTION';
  addons?: AddonType[];
}

export interface FinalizeSettlementResponse {
  success: boolean;
  transactionId: string;
  paymentIntentId?: string;
  status: 'CAPTURED_PERFORMANCE' | string;
  finalSalePrice: number;
  performanceFee: number;
  addonsTotal: number;
  totalCaptured: number;
  transaction?: Transaction;
  error?: string;
}

/**
 * 1. Create $25 Anti-Flake Authorization Hold (Stripe manual capture hold)
 */
export async function createHoldPaymentIntent(payload: CreateHoldPayload): Promise<CreateHoldResponse> {
  const url = `${API_BASE_URL}/api/payments/create-hold`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to create verification hold (${res.status})`);
  }

  return res.json();
}

/**
 * 2. Finalize Trade & Programmatically Capture Scaled Performance Fee + Add-ons
 */
export async function finalizeSettlement(payload: FinalizeSettlementPayload): Promise<FinalizeSettlementResponse> {
  const url = `${API_BASE_URL}/api/payments/settle-trade`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to settle trade (${res.status})`);
  }

  return res.json();
}

/**
 * 3. Report Buyer No-Show outside 2-hr window (captures $25 penalty for seller)
 */
export async function reportNoShow(transactionId: string, reason?: string) {
  const url = `${API_BASE_URL}/api/payments/report-no-show`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId, reason }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to claim no-show penalty');
  }

  return res.json();
}

/**
 * 4. Release Hold ($0.00 charge) if buyer passes legitimately
 */
export async function releasePass(transactionId: string, passReason: string) {
  const url = `${API_BASE_URL}/api/payments/release-pass`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId, passReason }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to release hold');
  }

  return res.json();
}

/**
 * 5. Fetch Listings from API
 */
export async function fetchListings(filters?: { type?: string; verified?: boolean }): Promise<Listing[]> {
  const query = new URLSearchParams();
  if (filters?.type) query.append('type', filters.type);
  if (filters?.verified) query.append('verified', 'true');

  const url = `${API_BASE_URL}/api/listings?${query.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch listings (${res.status})`);
  }
  const data = await res.json();
  return data.listings || [];
}

/**
 * 6. Fetch Single Listing
 */
export async function fetchListingById(idOrSlug: string): Promise<Listing> {
  const url = `${API_BASE_URL}/api/listings/${idOrSlug}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch listing (${res.status})`);
  }
  const data = await res.json();
  return data.listing;
}

/**
 * 7. Fetch Transaction Status
 */
export async function fetchTransaction(transactionId: string): Promise<Transaction> {
  const url = `${API_BASE_URL}/api/transactions/${transactionId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch transaction (${res.status})`);
  }
  const data = await res.json();
  return data.transaction;
}

/**
 * 8. Fetch All Transactions
 */
export async function fetchTransactions(): Promise<Transaction[]> {
  const url = `${API_BASE_URL}/api/transactions`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch transactions (${res.status})`);
  }
  const data = await res.json();
  return data.transactions || [];
}

/**
 * 9. Webhook-driven client polling:
 * Polls transaction status every 2.5 seconds until terminal status
 * Terminal statuses: 'CAPTURED_PERFORMANCE' | 'CAPTURED_PENALTY' | 'RELEASED_VOID'
 */
export function pollTransactionStatus(
  transactionId: string,
  onUpdate: (transaction: Transaction) => void,
  intervalMs = 2500
): () => void {
  let isCancelled = false;
  let timerId: NodeJS.Timeout | null = null;

  const terminalStatuses = ['CAPTURED_PERFORMANCE', 'CAPTURED_PENALTY', 'RELEASED_VOID'];

  async function check() {
    if (isCancelled) return;
    try {
      const tx = await fetchTransaction(transactionId);
      if (isCancelled) return;
      onUpdate(tx);

      // If status has reached terminal state, stop polling
      if (terminalStatuses.includes(tx.status)) {
        return;
      }
    } catch (err) {
      console.warn(`Polling error for transaction ${transactionId}:`, err);
    }

    if (!isCancelled) {
      timerId = setTimeout(check, intervalMs);
    }
  }

  // Start polling
  check();

  // Return cancel callback
  return () => {
    isCancelled = true;
    if (timerId) clearTimeout(timerId);
  };
}

export { calculatePerformanceFee, ADDON_PRICING };
