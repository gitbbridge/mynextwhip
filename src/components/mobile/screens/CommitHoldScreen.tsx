import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Listing, Transaction } from '../../../types';
import { createHoldPaymentIntent } from '../../../services/api';
import { Button, Input, Card, Badge } from '../ui/Primitives';

interface CommitHoldScreenProps {
  listing: Listing;
  onBack: () => void;
  onHoldSuccess: (transaction: Transaction, transactionId: string) => void;
}

export const CommitHoldScreen: React.FC<CommitHoldScreenProps> = ({
  listing,
  onBack,
  onHoldSuccess,
}) => {
  // Stepper state: 1 = Link Card, 2 = Authorize Hold, 3 = Confirmation
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [cardholderName, setCardholderName] = useState<string>('Alex Johnson');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState<string>('08/28');
  const [cvc, setCvc] = useState<string>('123');
  const [zip, setZip] = useState<string>('80202');
  const [meetDate, setMeetDate] = useState<string>('Tomorrow at 2:00 PM');

  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Async state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [confirmedTx, setConfirmedTx] = useState<Transaction | null>(null);
  const [confirmedTxId, setConfirmedTxId] = useState<string>('');

  // Validate Step 1
  const validateCardForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!cardholderName.trim()) newErrors.name = 'Cardholder name is required';
    if (!cardNumber.trim()) newErrors.cardNumber = 'Valid card number is required';
    if (!expiry.trim()) newErrors.expiry = 'MM/YY required';
    if (!cvc.trim()) newErrors.cvc = 'CVC required';
    if (!zip.trim()) newErrors.zip = 'ZIP required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCardForm()) {
      setCurrentStep(2);
    }
  };

  // Execute Backend API call for Step 2
  const handleAuthorizeHold = async () => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await createHoldPaymentIntent({
        listingId: listing.id,
        buyerId: 'user_mobile_current',
        sellerId: listing.sellerId,
        scheduledMeetTime: new Date(Date.now() + 86400000 * 2).toISOString(),
        cardDetails: {
          cardholderName,
          last4: cardNumber.replace(/\D/g, '').slice(-4) || '4242',
          expiry,
          zip,
        },
      });

      if (response.success) {
        const txObj = response.transaction || {
          id: response.transactionId,
          listingId: listing.id,
          listingTitle: `${listing.vehicle.year} ${listing.vehicle.make} ${listing.vehicle.model}`,
          listingImage: listing.photos[0]?.url || '',
          sellerId: listing.sellerId,
          sellerName: listing.seller.name,
          buyerId: 'user_mobile_current',
          buyerName: cardholderName,
          buyerCardLast4: '4242',
          stripePaymentIntentId: response.paymentIntentId,
          status: 'HOLD_AUTHORIZED' as const,
          holdAmount: 25.0,
          scheduledMeetTime: new Date(Date.now() + 86400000 * 2).toISOString(),
          addons: [],
          notes: 'Stripe $25 anti-flake hold authorized via mobile app.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setConfirmedTx(txObj);
        setConfirmedTxId(response.transactionId);
        setCurrentStep(3);
      } else {
        throw new Error(response.error || 'Card authorization failed.');
      }
    } catch (err: any) {
      console.error('Error authorizing hold:', err);
      setApiError(err.message || 'Unable to place authorization hold. Please verify card details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20 bg-slate-50">
      {/* Top Bar with Stepper Indicators */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3">
        <div className="flex items-center justify-between mb-2.5">
          <button
            onClick={currentStep === 1 ? onBack : () => setCurrentStep((s) => (s - 1) as any)}
            className="p-1 -ml-1 text-slate-600 hover:text-slate-900 flex items-center gap-1 text-xs font-bold min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Listing' : 'Previous'}</span>
          </button>

          <span className="text-xs font-bold text-slate-900 font-heading">
            {currentStep === 1 && 'Step 1 of 3: Link Card'}
            {currentStep === 2 && 'Step 2 of 3: Authorize Hold'}
            {currentStep === 3 && 'Step 3 of 3: Confirmed'}
          </span>

          <Badge variant="hold_authorized" size="sm">
            $25 Hold
          </Badge>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center gap-1.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-indigo-600 transition-all duration-300 rounded-full ${
              currentStep === 1 ? 'w-1/3' : currentStep === 2 ? 'w-2/3' : 'w-full bg-emerald-500'
            }`}
          />
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto w-full flex-1">
        <AnimatePresence mode="wait">
          {/* STEP 1: LINK PAYMENT METHOD */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-lg font-black text-slate-950 font-heading tracking-tight">
                  Link Payment Method
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Securely link your active debit or credit card to verify your identity and enable inspection rights.
                </p>
              </div>

              {/* Vehicle micro card summary */}
              <div className="p-3 bg-white rounded-2xl border border-slate-200/90 flex items-center gap-3">
                <img
                  src={listing.photos[0]?.url || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=400&q=80'}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="flex-1 truncate">
                  <span className="font-bold text-xs text-slate-900 block truncate">
                    {listing.vehicle.year} {listing.vehicle.make} {listing.vehicle.model}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    ${listing.askingPrice.toLocaleString()} · {listing.location.city}, CO
                  </span>
                </div>
              </div>

              {/* Card input form */}
              <Card padding="md" className="space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Lock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>256-bit Encrypted Card Vault</span>
                  </div>
                  <CreditCard className="w-4 h-4 text-slate-400" />
                </div>

                <Input
                  label="Cardholder Full Name"
                  placeholder="e.g. Alex Johnson"
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  error={errors.name}
                />

                <Input
                  label="Card Number"
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  error={errors.cardNumber}
                  leftIcon={<CreditCard className="w-4 h-4" />}
                />

                <div className="grid grid-cols-3 gap-2">
                  <Input
                    label="Expires"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    error={errors.expiry}
                  />
                  <Input
                    label="CVC"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    error={errors.cvc}
                  />
                  <Input
                    label="Billing ZIP"
                    placeholder="80202"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    error={errors.zip}
                  />
                </div>

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleNextToStep2}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to Verification Hold
                  </Button>
                </div>
              </Card>

              {/* Trust statement */}
              <div className="p-3 bg-slate-100 rounded-2xl flex items-center gap-2.5 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You will not be charged right now. Only a temporary $25 authorization hold is placed.</span>
              </div>
            </motion.div>
          )}

          {/* STEP 2: AUTHORIZE $25 HOLD */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <h2 className="text-lg font-black text-slate-950 font-heading tracking-tight">
                  Place Verification Hold ($25)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Confirm your temporary pre-authorization to lock the viewing window.
                </p>
              </div>

              {/* Hold Summary Card */}
              <Card padding="md" className="space-y-3">
                <div className="p-3 bg-indigo-50 border border-indigo-200/80 rounded-2xl space-y-1 text-center">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                    Temporary Authorization Hold
                  </span>
                  <div className="text-3xl font-black text-indigo-950 font-mono-numbers">
                    $25.00
                  </div>
                  <span className="text-[11px] text-indigo-600 block">
                    Manual capture hold · Zero fees if legitimate pass
                  </span>
                </div>

                <div className="space-y-2 text-xs divide-y divide-slate-100">
                  <div className="flex justify-between py-1.5 text-slate-600">
                    <span>Payment Method:</span>
                    <strong className="text-slate-900 font-mono">•••• 4242</strong>
                  </div>
                  <div className="flex justify-between py-1.5 text-slate-600">
                    <span>Target Vehicle:</span>
                    <strong className="text-slate-900 truncate max-w-[180px]">
                      {listing.vehicle.year} {listing.vehicle.make}
                    </strong>
                  </div>
                  <div className="flex justify-between py-1.5 text-slate-600">
                    <span>Seller:</span>
                    <strong className="text-slate-900">{listing.seller.name}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 text-slate-600">
                    <span>Meetup Window:</span>
                    <strong className="text-slate-900">{meetDate}</strong>
                  </div>
                </div>

                {/* Error Banner if API fails */}
                {apiError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{apiError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    isLoading={isLoading}
                    onClick={handleAuthorizeHold}
                    leftIcon={<Lock className="w-4 h-4 text-indigo-200" />}
                  >
                    {isLoading ? 'Placing Hold on Card...' : 'Authorize $25 Hold & Lock Viewing'}
                  </Button>
                </div>
              </Card>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-emerald-700 block">✓ No Trade, No Fee</span>
                  <span className="text-slate-500 leading-snug">Pass for undisclosed flaw? Hold is released at $0.00.</span>
                </div>
                <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">✓ Seller Guarantee</span>
                  <span className="text-slate-500 leading-snug">Enforces 2-hour advance cancellation policy.</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CONFIRMATION */}
          {currentStep === 3 && confirmedTx && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm shadow-emerald-200">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-950 font-heading tracking-tight">
                  Verification Hold Authorized!
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  Your $25 anti-flake hold is active. The vehicle is marked <strong>COMMITTED</strong> and locked for your inspection window.
                </p>
              </div>

              <Card padding="md" className="text-left space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Transaction ID:</span>
                  <code className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                    {confirmedTxId}
                  </code>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Hold Amount:</span>
                  <span className="font-mono font-bold text-emerald-600">$25.00 Pre-Auth</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Scheduled Meetup:</span>
                  <span className="font-medium text-slate-900">{meetDate}</span>
                </div>
              </Card>

              <div className="pt-2 space-y-2">
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => onHoldSuccess(confirmedTx, confirmedTxId)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Settlement & Add-ons
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  fullWidth
                  onClick={onBack}
                >
                  Back to Listing
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
