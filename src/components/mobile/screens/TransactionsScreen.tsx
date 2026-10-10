import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  Shield,
  Truck,
  Wrench,
  DollarSign,
  XCircle,
} from 'lucide-react';
import { Transaction, TransactionStatus } from '../../../types';
import { fetchTransactions, fetchTransaction, reportNoShow, releasePass, pollTransactionStatus } from '../../../services/api';
import { Badge, Button, Card } from '../ui/Primitives';

interface TransactionsScreenProps {
  onBackToHome: () => void;
  onSettleTransaction?: (transaction: Transaction) => void;
  initialSelectedTransactionId?: string;
}

export const TransactionsScreen: React.FC<TransactionsScreenProps> = ({
  onBackToHome,
  onSettleTransaction,
  initialSelectedTransactionId,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState<boolean>(false);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const list = await fetchTransactions();
      setTransactions(list);

      if (initialSelectedTransactionId) {
        const match = list.find((t) => t.id === initialSelectedTransactionId);
        if (match) setSelectedTx(match);
      }
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [initialSelectedTransactionId]);

  // Polling for selected transaction if active hold
  useEffect(() => {
    if (!selectedTx || selectedTx.status !== 'HOLD_AUTHORIZED') return;

    setIsPolling(true);
    const stopPolling = pollTransactionStatus(selectedTx.id, (freshTx) => {
      setSelectedTx(freshTx);
      setTransactions((prev) =>
        prev.map((t) => (t.id === freshTx.id ? freshTx : t))
      );
      if (['CAPTURED_PERFORMANCE', 'CAPTURED_PENALTY', 'RELEASED_VOID'].includes(freshTx.status)) {
        setIsPolling(false);
      }
    });

    return () => {
      stopPolling();
      setIsPolling(false);
    };
  }, [selectedTx?.id]);

  // Claim no show
  const handleClaimNoShow = async () => {
    if (!selectedTx) return;
    setActionLoading(true);
    try {
      const res = await reportNoShow(selectedTx.id, 'Buyer flaked without 2hr notice');
      if (res.success && res.transaction) {
        setSelectedTx(res.transaction);
        setTransactions((prev) =>
          prev.map((t) => (t.id === res.transaction.id ? res.transaction : t))
        );
        setActionMessage('Seller Guarantee Enforced: $25 penalty captured.');
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to claim penalty.');
    } finally {
      setActionLoading(false);
    }
  };

  // Release pass at $0
  const handleReleasePass = async () => {
    if (!selectedTx) return;
    setActionLoading(true);
    try {
      const res = await releasePass(selectedTx.id, 'Undisclosed flaw identified on inspection');
      if (res.success && res.transaction) {
        setSelectedTx(res.transaction);
        setTransactions((prev) =>
          prev.map((t) => (t.id === res.transaction.id ? res.transaction : t))
        );
        setActionMessage('No Trade, No Fee: $25 hold released at $0.00 zero cost.');
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to release hold.');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper for status badge
  const renderStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'HOLD_AUTHORIZED':
        return (
          <Badge variant="hold_authorized" size="sm" dot>
            HOLD AUTHORIZED ($25)
          </Badge>
        );
      case 'CAPTURED_PERFORMANCE':
        return (
          <Badge variant="captured_performance" size="sm" dot>
            TRADE SETTLED
          </Badge>
        );
      case 'CAPTURED_PENALTY':
        return (
          <Badge variant="captured_penalty" size="sm" dot>
            $25 PENALTY CAPTURED
          </Badge>
        );
      case 'RELEASED_VOID':
        return (
          <Badge variant="released_void" size="sm" dot>
            $0 HOLD RELEASED
          </Badge>
        );
      default:
        return <Badge size="sm">{status}</Badge>;
    }
  };

  // ==========================================================================
  // VIEW: TRANSACTION DETAIL SCREEN
  // ==========================================================================
  if (selectedTx) {
    const isHold = selectedTx.status === 'HOLD_AUTHORIZED';
    const isSettled = selectedTx.status === 'CAPTURED_PERFORMANCE';
    const isPenalty = selectedTx.status === 'CAPTURED_PENALTY';
    const isReleased = selectedTx.status === 'RELEASED_VOID';

    return (
      <div className="flex flex-col min-h-full pb-20 bg-slate-50">
        {/* Top Header */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => {
              setSelectedTx(null);
              setActionMessage(null);
            }}
            className="p-1 -ml-1 text-slate-600 hover:text-slate-900 flex items-center gap-1 text-xs font-bold min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Transactions</span>
          </button>

          <span className="text-xs font-bold text-slate-900 font-heading">
            Transaction Details
          </span>

          {renderStatusBadge(selectedTx.status)}
        </div>

        <div className="p-4 max-w-md mx-auto w-full space-y-4">
          {/* Vehicle banner */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
            <img
              src={selectedTx.listingImage || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=400&q=80'}
              alt=""
              className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
            />
            <div className="flex-1 truncate">
              <span className="font-bold text-sm text-slate-900 block truncate">
                {selectedTx.listingTitle}
              </span>
              <span className="text-xs text-slate-500 block">
                Seller: {selectedTx.sellerName} · Buyer: {selectedTx.buyerName}
              </span>
              <code className="text-[10px] text-slate-400 font-mono block">
                PI: {selectedTx.stripePaymentIntentId}
              </code>
            </div>
          </div>

          {/* Polling live indicator */}
          {isPolling && (
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2 text-xs text-indigo-700">
              <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
              <span>Live status webhook listener active (polling every 2.5s)...</span>
            </div>
          )}

          {actionMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
              {actionMessage}
            </div>
          )}

          {/* SECTION: Timeline Progression */}
          <Card padding="md" className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 font-heading uppercase tracking-wider">
              Status Progression Timeline
            </h3>

            <div className="space-y-4 relative pl-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {/* Step 1: Hold Placed */}
              <div className="relative">
                <span className="absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
                <span className="text-xs font-bold text-slate-900 block">
                  1. $25 Anti-Flake Hold Authorized
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Pre-authorization locked on card •••• {selectedTx.buyerCardLast4 || '4242'}.
                </span>
              </div>

              {/* Step 2: Inspection Window */}
              <div className="relative">
                <span
                  className={`absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                    isHold ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                  }`}
                />
                <span className="text-xs font-bold text-slate-900 block">
                  2. In-Person Inspection & Meetup
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Scheduled meetup window active at neutral Denver safe zone.
                </span>
              </div>

              {/* Step 3: Terminal State */}
              <div className="relative">
                <span
                  className={`absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                    isSettled
                      ? 'bg-emerald-500'
                      : isPenalty
                      ? 'bg-rose-500'
                      : isReleased
                      ? 'bg-slate-400'
                      : 'bg-slate-200'
                  }`}
                />
                <span className="text-xs font-bold text-slate-900 block">
                  3. Trade Outcome & Settlement
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {isSettled && `Trade settled at $${selectedTx.finalPrice?.toLocaleString()}. Fee ($${selectedTx.performanceFee}) captured.`}
                  {isPenalty && '$25 authorization captured as seller no-show compensation.'}
                  {isReleased && 'Hold released at $0.00 zero cost due to undisclosed flaw.'}
                  {isHold && 'Awaiting meetup outcome (Close Trade, Pass, or No-Show).'}
                </span>
              </div>
            </div>
          </Card>

          {/* SECTION: Fees & Add-ons breakdown */}
          <Card padding="md" className="space-y-2.5 text-xs">
            <h3 className="font-bold text-slate-900 font-heading">
              Financial Breakdown
            </h3>

            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-500">Initial Verification Hold:</span>
              <strong className="text-slate-900 font-mono">$25.00 Pre-Auth</strong>
            </div>

            {selectedTx.performanceFee && (
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Scaled Performance Fee:</span>
                <strong className="text-slate-900 font-mono">${selectedTx.performanceFee.toFixed(2)}</strong>
              </div>
            )}

            {selectedTx.addons.length > 0 && (
              <div className="pt-1 space-y-1.5">
                <span className="font-semibold text-slate-700 block">Ecosystem Add-ons:</span>
                {selectedTx.addons.map((a) => (
                  <div key={a.id} className="flex justify-between pl-2 text-slate-600">
                    <span>• {a.name}:</span>
                    <strong className="text-slate-900 font-mono">${a.price}</strong>
                  </div>
                ))}
              </div>
            )}

            {selectedTx.resolutionNote && (
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 mt-2 text-[11px] text-slate-600 italic">
                "{selectedTx.resolutionNote}"
              </div>
            )}
          </Card>

          {/* Action buttons if Active Hold */}
          {isHold && (
            <div className="space-y-2 pt-1">
              {onSettleTransaction && (
                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={() => onSettleTransaction(selectedTx)}
                  leftIcon={<CheckCircle2 className="w-4 h-4 text-emerald-200" />}
                >
                  Finalize Deal & Capture Fee
                </Button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  isLoading={actionLoading}
                  onClick={handleReleasePass}
                >
                  Pass ($0 Release)
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  isLoading={actionLoading}
                  onClick={handleClaimNoShow}
                >
                  Claim $25 No-Show
                </Button>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Button variant="secondary" size="md" fullWidth onClick={onBackToHome}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // VIEW: ALL TRANSACTIONS LIST
  // ==========================================================================
  return (
    <div className="flex flex-col min-h-full pb-20">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-950 font-heading tracking-tight">
            Transactions
          </h1>
          <p className="text-xs text-slate-500">
            {transactions.length} total commitments & pre-authorizations
          </p>
        </div>

        <button
          onClick={loadTransactions}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Refresh transactions"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3 flex-1">
        {loading ? (
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 h-24 animate-pulse" />
            <div className="p-4 bg-white rounded-2xl border border-slate-200 h-24 animate-pulse" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-3 my-8">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No active transactions yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              When you bind a card to inspect a vehicle or bid in a live auction, your $25 authorization hold appears here.
            </p>
            <Button variant="primary" size="sm" onClick={onBackToHome}>
              Explore Nearby Listings
            </Button>
          </div>
        ) : (
          transactions.map((tx) => (
            <Card
              key={tx.id}
              interactive
              padding="md"
              onClick={() => setSelectedTx(tx)}
              className="space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="truncate">
                  <h3 className="font-bold text-xs text-slate-900 truncate">
                    {tx.listingTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString()} · Buyer: {tx.buyerName}
                  </p>
                </div>
                {renderStatusBadge(tx.status)}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Card •••• {tx.buyerCardLast4 || '4242'}</span>
                </div>

                <div className="text-indigo-600 font-bold flex items-center gap-0.5 text-xs">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
