import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Lock,
  Truck,
  Wrench,
  Shield,
  DollarSign,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { Listing, Transaction, AddonType } from '../../../types';
import { finalizeSettlement, calculatePerformanceFee, ADDON_PRICING, pollTransactionStatus } from '../../../services/api';
import { Button, Input, Card, CheckboxRow, Badge } from '../ui/Primitives';

interface SettlementScreenProps {
  listing: Listing;
  transaction: Transaction;
  onBack: () => void;
  onSettlementComplete: (updatedTransaction: Transaction) => void;
}

export const SettlementScreen: React.FC<SettlementScreenProps> = ({
  listing,
  transaction,
  onBack,
  onSettlementComplete,
}) => {
  const isAuction = listing.listingFormat === 'AUCTION';
  const listingType = isAuction ? 'LIVE_AUCTION' : 'BUY_IT_NOW';

  // Final agreed price input (defaults to asking price)
  const [salePrice, setSalePrice] = useState<number>(listing.askingPrice || 4500);
  const [priceInput, setPriceInput] = useState<string>(String(listing.askingPrice || 4500));

  // Selected add-ons
  const [selectedAddons, setSelectedAddons] = useState<AddonType[]>([]);

  // Async states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Settlement Success State
  const [settledTx, setSettledTx] = useState<Transaction | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  // Sync price
  const handlePriceChange = (val: string) => {
    setPriceInput(val);
    const parsed = parseFloat(val);
    if (!isNaN(parsed) && parsed > 0) {
      setSalePrice(parsed);
    }
  };

  // Tier fee calculation
  const performanceFee = calculatePerformanceFee(salePrice, listingType);
  const addonsTotal = selectedAddons.reduce((sum, type) => sum + ADDON_PRICING[type].price, 0);
  const totalCapturedEstimate = performanceFee + addonsTotal;

  // Finalize settlement
  const handleConfirmSettlement = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await finalizeSettlement({
        transactionId: transaction.id,
        listingId: listing.id,
        finalSalePrice: salePrice,
        listingType,
        addons: selectedAddons,
      });

      if (response.success) {
        const updated = response.transaction || {
          ...transaction,
          status: 'CAPTURED_PERFORMANCE' as const,
          finalPrice: salePrice,
          performanceFee,
          addons: selectedAddons.map((type) => ({
            id: `addon_${Date.now()}_${type.toLowerCase()}`,
            transactionId: transaction.id,
            addonType: type,
            name: ADDON_PRICING[type].name,
            price: ADDON_PRICING[type].price,
            status: 'CAPTURED' as const,
            createdAt: new Date().toISOString(),
          })),
        };

        setSettledTx(updated);
        setIsPolling(true);

        // Start polling until terminal status is verified
        const stopPolling = pollTransactionStatus(transaction.id, (freshTx) => {
          setSettledTx(freshTx);
          if (['CAPTURED_PERFORMANCE', 'CAPTURED_PENALTY', 'RELEASED_VOID'].includes(freshTx.status)) {
            setIsPolling(false);
          }
        });

        // Cleanup polling on unmount
        setTimeout(() => {
          stopPolling();
          setIsPolling(false);
        }, 10000);
      } else {
        throw new Error(response.error || 'Failed to capture performance fee.');
      }
    } catch (err: any) {
      console.error('Error confirming settlement:', err);
      setError(err.message || 'Payment capture failed. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If settled, show Settlement Success screen
  if (settledTx) {
    return (
      <div className="flex flex-col min-h-full pb-20 p-4 max-w-md mx-auto w-full text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm shadow-emerald-200 mt-4">
          <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div>
          <h2 className="text-xl font-black text-slate-950 font-heading tracking-tight">
            Deal Settled & Captured!
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Keys exchanged for <strong>{listing.vehicle.year} {listing.vehicle.make}</strong>.
          </p>
        </div>

        {/* Polling / Webhook status badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mx-auto">
          {isPolling ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
              <span>Tracking settlement via live webhook polling...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Status Verified: CAPTURED_PERFORMANCE</span>
            </>
          )}
        </div>

        {/* Breakdown card */}
        <Card padding="md" className="text-left space-y-2.5 text-xs">
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Agreed Sale Price:</span>
            <strong className="text-slate-900 font-mono text-sm">${salePrice.toLocaleString()}</strong>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Performance Fee ({isAuction ? 'Auction' : 'BIN'} Tier):</span>
            <strong className="text-slate-900 font-mono">${performanceFee.toFixed(2)}</strong>
          </div>
          {addonsTotal > 0 && (
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Selected Add-ons ({selectedAddons.length}):</span>
              <strong className="text-slate-900 font-mono">${addonsTotal.toFixed(2)}</strong>
            </div>
          )}
          <div className="flex justify-between py-1 font-bold text-slate-950 text-sm">
            <span>Total Captured from Linked Card:</span>
            <span className="font-mono text-emerald-600">${totalCapturedEstimate.toFixed(2)}</span>
          </div>
        </Card>

        {/* Instructions */}
        <div className="p-3.5 bg-slate-100 rounded-2xl text-left text-xs text-slate-600 space-y-1">
          <strong className="text-slate-900 block font-heading">Post-Trade Next Steps:</strong>
          <p>1. Buyer files Colorado title transfer at Denver DMV within 60 days.</p>
          <p>2. Keep your bill of sale receipt from your transaction record.</p>
        </div>

        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            fullWidth
            onClick={() => onSettlementComplete(settledTx)}
          >
            View in Transactions Tab
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-20 bg-slate-50">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-slate-600 hover:text-slate-900 flex items-center gap-1 text-xs font-bold min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-bold text-slate-900 font-heading">
          Checkout & Settlement
        </span>

        <Badge variant={isAuction ? 'auction' : 'bin'} size="sm">
          {isAuction ? 'Auction Fee' : 'BIN Fee'}
        </Badge>
      </div>

      <div className="p-4 max-w-md mx-auto w-full space-y-4">
        <div>
          <h2 className="text-lg font-black text-slate-950 font-heading tracking-tight">
            Trade Settlement Confirmation
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            When keys change hands, your pre-authorized card profile is automatically charged the scaled performance fee.
          </p>
        </div>

        {/* Agreed Sale Price input */}
        <Card padding="md" className="space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Final Agreed Sale Price ($ Cash / Cashier's Check)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={priceInput}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full min-h-[44px] pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold font-mono text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Cash passes 100% peer-to-peer. Zero commission on vehicle sale amount.
            </p>
          </div>
        </Card>

        {/* Scaled Fee Breakdown Card */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 font-heading">
              Platform Performance Fee Tier
            </span>
            <span className="text-[11px] text-indigo-600 font-semibold">
              {isAuction ? 'Live Auction Tier' : 'Buy It Now Tier'}
            </span>
          </div>

          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex justify-between py-1 text-slate-600">
              <span>Sale Price Tier:</span>
              <strong className="text-slate-900">
                {salePrice < 3000 ? 'Under $3,000' : salePrice <= 6000 ? '$3,000 – $6,000' : '$6,000 – $10,000'}
              </strong>
            </div>
            <div className="flex justify-between py-1 text-slate-600">
              <span>Performance Fee:</span>
              <strong className="text-slate-900 font-mono">${performanceFee.toFixed(2)}</strong>
            </div>
            {addonsTotal > 0 && (
              <div className="flex justify-between py-1 text-slate-600">
                <span>Selected Add-ons Total:</span>
                <strong className="text-slate-900 font-mono">+${addonsTotal.toFixed(2)}</strong>
              </div>
            )}
            <div className="flex justify-between pt-2 font-bold text-slate-950 text-sm">
              <span>Total Automated Fee:</span>
              <span className="font-mono text-emerald-600">${totalCapturedEstimate.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* SECTION: Optional Add-ons Checkbox Rows */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Point-of-Intent Add-ons (Optional)
            </h3>
            <span className="text-[11px] text-slate-400">Bundled into card charge</span>
          </div>

          <div className="space-y-2">
            <CheckboxRow
              id="addon-towing"
              title={ADDON_PRICING.FLATBED_TOWING.name}
              description={ADDON_PRICING.FLATBED_TOWING.description}
              price={ADDON_PRICING.FLATBED_TOWING.price}
              checked={selectedAddons.includes('FLATBED_TOWING')}
              onChange={(checked) => {
                if (checked) setSelectedAddons([...selectedAddons, 'FLATBED_TOWING']);
                else setSelectedAddons(selectedAddons.filter((a) => a !== 'FLATBED_TOWING'));
              }}
              icon={<Truck className="w-4 h-4" />}
            />

            <CheckboxRow
              id="addon-ppi"
              title={ADDON_PRICING.MOBILE_PPI.name}
              description={ADDON_PRICING.MOBILE_PPI.description}
              price={ADDON_PRICING.MOBILE_PPI.price}
              checked={selectedAddons.includes('MOBILE_PPI')}
              onChange={(checked) => {
                if (checked) setSelectedAddons([...selectedAddons, 'MOBILE_PPI']);
                else setSelectedAddons(selectedAddons.filter((a) => a !== 'MOBILE_PPI'));
              }}
              icon={<Wrench className="w-4 h-4" />}
            />

            <CheckboxRow
              id="addon-insurance"
              title={ADDON_PRICING.TEMP_INSURANCE.name}
              description={ADDON_PRICING.TEMP_INSURANCE.description}
              price={ADDON_PRICING.TEMP_INSURANCE.price}
              checked={selectedAddons.includes('TEMP_INSURANCE')}
              onChange={(checked) => {
                if (checked) setSelectedAddons([...selectedAddons, 'TEMP_INSURANCE']);
                else setSelectedAddons(selectedAddons.filter((a) => a !== 'TEMP_INSURANCE'));
              }}
              icon={<Shield className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Confirm & Continue CTA (Tap target >= 44px) */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            fullWidth
            isLoading={isSubmitting}
            onClick={handleConfirmSettlement}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSubmitting ? 'Capturing Performance Fee...' : `Confirm & Capture ($${totalCapturedEstimate.toFixed(2)})`}
          </Button>
        </div>
      </div>
    </div>
  );
};
