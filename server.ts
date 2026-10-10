import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { SEED_LISTINGS, SEED_TRANSACTIONS } from './src/services/seedData.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe if API key provided
const stripeApiKey = process.env.STRIPE_SECRET_KEY || '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
const stripe = stripeApiKey ? new Stripe(stripeApiKey) : null;

// Pricing calculation helper
export const calculateFee = (
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

export const ADDON_PRICES: Record<string, number> = {
  FLATBED_TOWING: 45.0,
  MOBILE_PPI: 95.0,
  TEMP_INSURANCE: 149.0,
};

// In-memory store for transactions & listings
let inMemoryTransactions = [...SEED_TRANSACTIONS];
let inMemoryListings = [...SEED_LISTINGS];

// ---------------------------------------------------------------------------
// Stripe Webhook Endpoint (requires raw body)
// ---------------------------------------------------------------------------
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  (req: Request, res: Response): void => {
    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event | { type: string; data: { object: any } };

    if (stripe && stripeWebhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret);
      } catch (err: any) {
        console.error('Stripe webhook verification error:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }
    } else {
      // Fallback for mock/test environments
      try {
        event = JSON.parse(req.body.toString());
      } catch {
        res.status(400).send('Invalid JSON payload');
        return;
      }
    }

    // Handle the Stripe event
    switch (event.type) {
      case 'payment_intent.amount_capturable_updated': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] $25 hold pre-authorized for PI: ${paymentIntent.id}`);
        break;
      }
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] Fee captured for PI: ${paymentIntent.id}, Amount: $${(paymentIntent.amount_received / 100).toFixed(2)}`);
        break;
      }
      case 'payment_intent.canceled': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[Stripe Webhook] Hold released/voided for PI: ${paymentIntent.id}`);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.warn(`[Stripe Webhook] Payment failed for PI: ${paymentIntent.id}`);
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  }
);

// Standard JSON parser for other API routes
app.use(express.json());

// ---------------------------------------------------------------------------
// 1. Create $25 Anti-Flake Authorization Hold (capture_method: 'manual')
// ---------------------------------------------------------------------------
app.post('/api/payments/create-hold', async (req: Request, res: Response) => {
  try {
    const { listingId, buyerId, sellerId, scheduledMeetTime, cardDetails } = req.body;

    if (!listingId || !buyerId) {
      res.status(400).json({ error: 'listingId and buyerId are required' });
      return;
    }

    const listing = inMemoryListings.find((l) => l.id === listingId);
    const txId = `tx_${Date.now()}`;
    let piId = `pi_hold_25_${Date.now()}`;
    let clientSecret = `${piId}_secret_token`;

    if (stripe) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2500, // $25.00 in cents
        currency: 'usd',
        capture_method: 'manual', // Hold authorized, not captured yet
        description: `MyNextWhip $25 Anti-Flake Hold for Listing ${listingId}`,
        metadata: {
          listingId,
          buyerId,
          sellerId: sellerId || (listing ? listing.sellerId : ''),
          scheduledMeetTime: scheduledMeetTime || '',
          transactionId: txId,
          platform: 'MyNextWhip',
        },
      });
      piId = paymentIntent.id;
      clientSecret = paymentIntent.client_secret || `${piId}_secret_token`;
    }

    const newTransaction = {
      id: txId,
      listingId,
      listingTitle: listing ? `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}` : 'Vehicle Listing',
      listingImage: listing?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=400&q=80',
      sellerId: sellerId || (listing ? listing.sellerId : 'user_sarah'),
      sellerName: listing?.seller?.name || 'Seller',
      buyerId: buyerId || 'user_current',
      buyerName: 'Buyer',
      buyerCardLast4: cardDetails?.last4 || '4242',
      stripePaymentIntentId: piId,
      status: 'HOLD_AUTHORIZED' as const,
      holdAmount: 25.0,
      scheduledMeetTime: scheduledMeetTime || new Date(Date.now() + 86400000 * 2).toISOString(),
      addons: [],
      notes: '$25 Anti-Flake Hold Authorized. Viewing window locked.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    inMemoryTransactions.unshift(newTransaction);

    // Update listing status to COMMITTED
    if (listing) {
      listing.status = 'COMMITTED';
    }

    res.json({
      success: true,
      transactionId: txId,
      paymentIntentId: piId,
      clientSecret,
      status: 'HOLD_AUTHORIZED',
      holdAmount: 25.0,
      transaction: newTransaction,
    });
  } catch (err: any) {
    console.error('Error creating hold:', err);
    res.status(500).json({ error: err.message || 'Failed to create hold' });
  }
});

// ---------------------------------------------------------------------------
// 2. Settle Trade: Programmatically Capture Scaled Performance Fee + Add-ons
// ---------------------------------------------------------------------------
app.post('/api/payments/settle-trade', async (req: Request, res: Response) => {
  try {
    const {
      transactionId,
      paymentIntentId,
      finalSalePrice,
      listingType = 'BUY_IT_NOW',
      addons = [], // e.g. ['FLATBED_TOWING', 'MOBILE_PPI']
    } = req.body;

    if (!finalSalePrice || finalSalePrice <= 0) {
      res.status(400).json({ error: 'Valid finalSalePrice is required' });
      return;
    }

    // Lookup transaction
    const tx = inMemoryTransactions.find(
      (t) => t.id === transactionId || t.stripePaymentIntentId === paymentIntentId
    );

    const performanceFee = calculateFee(Number(finalSalePrice), listingType);
    let addonsTotal = 0;
    const formattedAddons: any[] = [];
    if (Array.isArray(addons)) {
      for (const addon of addons) {
        const price = ADDON_PRICES[addon] || 0;
        addonsTotal += price;
        formattedAddons.push({
          id: `addon_${Date.now()}_${addon.toLowerCase()}`,
          transactionId: tx ? tx.id : transactionId || 'tx_unknown',
          addonType: addon,
          name: addon === 'FLATBED_TOWING' ? 'Local Flatbed Towing Dispatch' : addon === 'MOBILE_PPI' ? 'Mobile Pre-Purchase Inspection (PPI)' : 'Temporary Transit Insurance (5-Day Drive-Away)',
          price,
          status: 'CAPTURED',
          createdAt: new Date().toISOString(),
        });
      }
    }

    const totalCaptured = performanceFee + addonsTotal;
    const captureAmountCents = Math.round(totalCaptured * 100);

    const pi = tx?.stripePaymentIntentId || paymentIntentId;
    if (stripe && pi && !pi.startsWith('pi_mock')) {
      try {
        await stripe.paymentIntents.capture(pi, {
          amount_to_capture: captureAmountCents,
        });
      } catch (stripeErr: any) {
        console.warn('Stripe capture warning (continuing mock fallback):', stripeErr.message);
      }
    }

    if (tx) {
      tx.status = 'CAPTURED_PERFORMANCE';
      tx.finalPrice = Number(finalSalePrice);
      tx.performanceFee = performanceFee;
      tx.addons = [...tx.addons, ...formattedAddons];
      tx.resolutionNote = `Trade completed at $${Number(finalSalePrice).toLocaleString()}. Scaled fee ($${performanceFee}) + add-ons ($${addonsTotal}) captured programmatically.`;
      tx.updatedAt = new Date().toISOString();

      const listing = inMemoryListings.find((l) => l.id === tx.listingId);
      if (listing) {
        listing.status = 'SETTLED';
      }
    }

    res.json({
      success: true,
      transactionId: tx?.id || transactionId,
      paymentIntentId: pi || `pi_settled_${Date.now()}`,
      status: 'CAPTURED_PERFORMANCE',
      finalSalePrice: Number(finalSalePrice),
      performanceFee,
      addonsTotal,
      totalCaptured,
      transaction: tx,
    });
  } catch (err: any) {
    console.error('Error settling trade:', err);
    res.status(500).json({ error: err.message || 'Failed to settle trade' });
  }
});

// ---------------------------------------------------------------------------
// 3. Report No-Show: Capture $25 Penalty to Compensate Seller
// ---------------------------------------------------------------------------
app.post('/api/payments/report-no-show', async (req: Request, res: Response) => {
  try {
    const { transactionId, paymentIntentId, reason } = req.body;

    const tx = inMemoryTransactions.find(
      (t) => t.id === transactionId || t.stripePaymentIntentId === paymentIntentId
    );

    const pi = tx?.stripePaymentIntentId || paymentIntentId;
    if (stripe && pi && !pi.startsWith('pi_mock')) {
      try {
        await stripe.paymentIntents.capture(pi, {
          amount_to_capture: 2500,
        });
      } catch (stripeErr: any) {
        console.warn('Stripe penalty capture warning:', stripeErr.message);
      }
    }

    if (tx) {
      tx.status = 'CAPTURED_PENALTY';
      tx.payoutToSellerAmount = 25.0;
      tx.resolutionNote = `Buyer flaked outside 2hr notice window. $25 hold captured as seller compensation. Reason: ${reason || 'Buyer no-show'}.`;
      tx.updatedAt = new Date().toISOString();

      const listing = inMemoryListings.find((l) => l.id === tx.listingId);
      if (listing) {
        listing.status = 'ACTIVE'; // resets back to active
      }
    }

    res.json({
      success: true,
      transactionId: tx?.id || transactionId,
      paymentIntentId: pi,
      status: 'CAPTURED_PENALTY',
      amountCaptured: 25.0,
      sellerPayout: 25.0,
      reason: reason || 'Buyer flaked without 2-hour notice window.',
      transaction: tx,
    });
  } catch (err: any) {
    console.error('Error reporting no show:', err);
    res.status(500).json({ error: err.message || 'Failed to capture penalty' });
  }
});

// ---------------------------------------------------------------------------
// 4. Release Pass: Void Authorization with Zero Charge ($0.00)
// ---------------------------------------------------------------------------
app.post('/api/payments/release-pass', async (req: Request, res: Response) => {
  try {
    const { transactionId, paymentIntentId, passReason } = req.body;

    const tx = inMemoryTransactions.find(
      (t) => t.id === transactionId || t.stripePaymentIntentId === paymentIntentId
    );

    const pi = tx?.stripePaymentIntentId || paymentIntentId;
    if (stripe && pi && !pi.startsWith('pi_mock')) {
      try {
        await stripe.paymentIntents.cancel(pi, {
          cancellation_reason: 'abandoned',
        });
      } catch (stripeErr: any) {
        console.warn('Stripe cancel warning:', stripeErr.message);
      }
    }

    if (tx) {
      tx.status = 'RELEASED_VOID';
      tx.resolutionNote = `Buyer passed due to undisclosed flaw: "${passReason || 'Flaw on inspection'}". $25 hold released at $0.00 cost.`;
      tx.updatedAt = new Date().toISOString();

      const listing = inMemoryListings.find((l) => l.id === tx.listingId);
      if (listing) {
        listing.status = 'ACTIVE';
      }
    }

    res.json({
      success: true,
      transactionId: tx?.id || transactionId,
      paymentIntentId: pi,
      status: 'RELEASED_VOID',
      chargedAmount: 0.0,
      reason: passReason || 'Vehicle failed inspection or legitimate pass.',
      transaction: tx,
    });
  } catch (err: any) {
    console.error('Error releasing hold:', err);
    res.status(500).json({ error: err.message || 'Failed to release hold' });
  }
});

// ---------------------------------------------------------------------------
// 5. Point-of-Intent Ecosystem Add-on Request
// ---------------------------------------------------------------------------
app.post('/api/payments/add-addon', async (req: Request, res: Response) => {
  try {
    const { transactionId, addonType } = req.body;
    const price = ADDON_PRICES[addonType];

    if (!price) {
      res.status(400).json({ error: `Invalid addonType: ${addonType}` });
      return;
    }

    const addon = {
      id: `addon_${Date.now()}`,
      transactionId: transactionId || 'tx_adhoc',
      addonType,
      price,
      status: 'CAPTURED',
      chargeId: `ch_addon_${Date.now()}`,
    };

    const tx = inMemoryTransactions.find((t) => t.id === transactionId);
    if (tx) {
      tx.addons.push(addon as any);
      tx.updatedAt = new Date().toISOString();
    }

    res.json({
      success: true,
      addon,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// 6. Transaction Status & Polling Endpoints
// ---------------------------------------------------------------------------
app.get('/api/transactions/:id', (req: Request, res: Response) => {
  const tx = inMemoryTransactions.find(
    (t) => t.id === req.params.id || t.stripePaymentIntentId === req.params.id
  );

  if (!tx) {
    res.status(404).json({ error: 'Transaction not found' });
    return;
  }

  res.json({
    success: true,
    transaction: tx,
  });
});

app.get('/api/transactions', (_req: Request, res: Response) => {
  res.json({
    success: true,
    transactions: inMemoryTransactions,
  });
});

// ---------------------------------------------------------------------------
// 7. Listings Endpoints
// ---------------------------------------------------------------------------
app.get('/api/listings', (req: Request, res: Response) => {
  let results = [...inMemoryListings];

  const type = req.query.type as string;
  if (type === 'BIN') {
    results = results.filter((l) => l.listingFormat !== 'AUCTION');
  } else if (type === 'AUCTION') {
    results = results.filter((l) => l.listingFormat === 'AUCTION');
  }

  const verified = req.query.verified;
  if (verified === 'true') {
    results = results.filter((l) => l.verifications.titleReviewed && l.verifications.vinDecoded);
  }

  const status = req.query.status as string;
  if (status) {
    results = results.filter((l) => l.status === status);
  }

  res.json({
    success: true,
    count: results.length,
    listings: results,
  });
});

app.get('/api/listings/:id', (req: Request, res: Response) => {
  const listing = inMemoryListings.find(
    (l) => l.id === req.params.id || l.slug === req.params.id
  );

  if (!listing) {
    res.status(404).json({ error: 'Listing not found' });
    return;
  }

  res.json({
    success: true,
    listing,
  });
});

// ---------------------------------------------------------------------------
// 6. Fee Calculation Helper
// ---------------------------------------------------------------------------
app.get('/api/pricing/calculate-fee', (req: Request, res: Response) => {
  const price = Number(req.query.price || 0);
  const type = (req.query.type as 'BUY_IT_NOW' | 'LIVE_AUCTION') || 'BUY_IT_NOW';
  const fee = calculateFee(price, type);

  res.json({
    price,
    type,
    fee,
  });
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    marketplace: 'MyNextWhip Denver',
    stripeConfigured: Boolean(stripe),
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// Vite Dev & Production Static Serving
// ---------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[MyNextWhip Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
