import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ListingStatus } from '../../types';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  DollarSign,
  FileText,
  Clock,
  Car,
  Users,
  Settings,
  Eye,
  Check,
  Flag,
  Database,
  Trash2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    allListings,
    updateListingStatus,
    featureListing,
    reports,
    resolveReport,
    auditLogs,
    platformConfig,
    updatePlatformConfig,
    currentUser,
    navigateTo,
    isSeedDataEnabled,
    purgeAllDemoData,
    restoreDemoData,
    setSeedDataMode,
    showNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'moderation' | 'all' | 'reports' | 'logs' | 'config' | 'data'>('moderation');
  const [rejectReasonModal, setRejectReasonModal] = useState<string | null>(null);
  const [rejectReasonInput, setRejectReasonInput] = useState('VIN documentation image is illegible.');
  const [purgeConfirmModalOpen, setPurgeConfirmModalOpen] = useState(false);

  const [listingFeeInput, setListingFeeInput] = useState(platformConfig.standardListingFee.toString());

  // Metrics
  const pendingReviewListings = allListings.filter((l) => l.status === 'PENDING_REVIEW');
  const activeListings = allListings.filter((l) => l.status === 'ACTIVE');
  const soldListings = allListings.filter((l) => l.status === 'SOLD');
  const totalRevenue = allListings.filter((l) => l.listingFeePaid).length * platformConfig.standardListingFee;
  const pendingReports = reports.filter((r) => r.status === 'PENDING');

  const handleApprove = (listingId: string) => {
    updateListingStatus(listingId, 'ACTIVE', 'Approved after reviewing NHTSA VIN match and disclosures.');
  };

  const handleReject = (listingId: string) => {
    updateListingStatus(listingId, 'NEEDS_INFORMATION', rejectReasonInput);
    setRejectReasonModal(null);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top Admin Header */}
      <div className="bg-[#12151A] text-white border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-purple-900/80 text-purple-300 border border-purple-700">
                  <Shield className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
                  MARKETPLACE MODERATION & ADMIN
                </h1>
              </div>
              <p className="text-xs text-zinc-400 mt-1">
                Enforcing "Honest Over Pretty" standards, reviewing title documentation, and protecting buyers.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400">Moderator:</span>
              <span className="font-bold text-white bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-700">
                {currentUser.name} ({currentUser.role})
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-[#1C2027] border border-zinc-800 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-[11px] font-bold uppercase">Pending Review</div>
              <div className="text-2xl font-black text-amber-400 font-mono-numbers mt-0.5">
                {pendingReviewListings.length}
              </div>
            </div>

            <div className="bg-[#1C2027] border border-zinc-800 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-[11px] font-bold uppercase">Active Whips</div>
              <div className="text-2xl font-black text-emerald-400 font-mono-numbers mt-0.5">
                {activeListings.length}
              </div>
            </div>

            <div className="bg-[#1C2027] border border-zinc-800 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-[11px] font-bold uppercase">Listing Revenue</div>
              <div className="text-2xl font-black text-white font-mono-numbers mt-0.5">
                ${totalRevenue.toLocaleString()}
              </div>
            </div>

            <div className="bg-[#1C2027] border border-zinc-800 p-3.5 rounded-xl">
              <div className="text-zinc-400 text-[11px] font-bold uppercase">Open Reports</div>
              <div className="text-2xl font-black text-red-400 font-mono-numbers mt-0.5">
                {pendingReports.length}
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex gap-2 overflow-x-auto text-xs font-bold border-t border-zinc-800/80">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'moderation'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Moderation Queue</span>
            {pendingReviewListings.length > 0 && (
              <span className="bg-amber-500 text-black text-[10px] font-extrabold px-1.5 rounded-full">
                {pendingReviewListings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer ${
              activeTab === 'all'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All Inventory ({allListings.length})
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reports'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>User Reports</span>
            {pendingReports.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                {pendingReports.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer ${
              activeTab === 'logs'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'config'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('data')}
            className={`py-3 px-4 border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'data'
                ? 'border-[#EA580C] text-[#EA580C]'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Production Slate & Data</span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                isSeedDataEnabled ? 'bg-amber-900/80 text-amber-300' : 'bg-emerald-900/80 text-emerald-300'
              }`}
            >
              {isSeedDataEnabled ? 'Demo' : 'Clean'}
            </span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* TAB 1: Moderation Queue */}
        {activeTab === 'moderation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-zinc-900 font-heading">
                Pending Approval Queue ({pendingReviewListings.length})
              </h2>
              <span className="text-xs text-zinc-500">
                Review disclosures, confirm cold-start video, and check title status before publishing.
              </span>
            </div>

            {pendingReviewListings.length > 0 ? (
              <div className="space-y-4">
                {pendingReviewListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white border-2 border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={listing.photos[0]?.url || ''}
                        alt=""
                        className="w-24 h-20 rounded-xl object-cover border border-zinc-200 shrink-0"
                      />
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded uppercase">
                            {listing.status}
                          </span>
                          <span className="text-zinc-400">·</span>
                          <span className="font-mono text-zinc-500">VIN: {listing.vehicle.vin}</span>
                        </div>
                        <h3 className="text-base font-black text-zinc-900 font-heading">
                          {listing.vehicle.year} {listing.vehicle.make} {listing.vehicle.model}
                        </h3>
                        <p className="text-zinc-600">
                          ${listing.askingPrice.toLocaleString()} · {listing.vehicle.mileage.toLocaleString()} mi · {listing.vehicle.titleStatus} Title · {listing.location.city}, {listing.location.state}
                        </p>
                        <div className="text-amber-800 font-medium">
                          Disclosures: {listing.issues.length} items ({listing.issues.map((i) => i.title).join(', ') || 'None'})
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => navigateTo('detail', listing.slug)}
                        className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>

                      <button
                        onClick={() => setRejectReasonModal(listing.id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Request Info / Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(listing.id)}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve & Make Live</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-zinc-200 rounded-2xl p-10 text-center text-zinc-500 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-sm text-zinc-900">Queue is Clear!</p>
                <p>All submitted whips have been reviewed and approved.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: All Inventory Management */}
        {activeTab === 'all' && (
          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Seller</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {allListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-zinc-50 transition">
                      <td className="py-3 px-4 font-bold text-zinc-900">
                        {listing.vehicle.year} {listing.vehicle.make} {listing.vehicle.model}
                        <div className="font-mono text-[10px] text-zinc-400">{listing.vehicle.vin}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold">
                        ${listing.askingPrice.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-zinc-600">
                        {listing.seller.name}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            listing.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : listing.status === 'PENDING_REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : listing.status === 'SOLD'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          {listing.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={listing.featured || false}
                          onChange={(e) => featureListing(listing.id, e.target.checked)}
                          className="w-4 h-4 text-[#EA580C] rounded"
                        />
                      </td>
                      <td className="py-3 px-4 space-x-1">
                        <button
                          onClick={() => navigateTo('detail', listing.slug)}
                          className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded font-semibold text-[10px]"
                        >
                          View
                        </button>
                        {listing.status === 'ACTIVE' && (
                          <button
                            onClick={() => updateListingStatus(listing.id, 'SOLD', 'Marked sold by admin')}
                            className="px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-semibold text-[10px]"
                          >
                            Mark Sold
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: User Reports */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-zinc-900 font-heading">
              User Moderation Reports ({reports.length})
            </h2>
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="bg-white border border-zinc-200 rounded-2xl p-5 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flag className="w-4 h-4 text-red-600" />
                      <span className="font-bold text-sm text-zinc-900 uppercase">{rep.reason}</span>
                      <span className="text-zinc-400">· Listing: {rep.listingTitle}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rep.status === 'PENDING' ? 'bg-red-100 text-red-800' : 'bg-zinc-100 text-zinc-700'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>
                  <p className="text-zinc-700 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                    "{rep.details}"
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-zinc-400">Reporter: Anonymous Community Member · {new Date(rep.createdAt).toLocaleDateString()}</span>
                    {rep.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => resolveReport(rep.id, 'DISMISSED')}
                          className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-lg font-bold"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => resolveReport(rep.id, 'ACTIONED')}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                        >
                          Action & Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Audit Logs */}
        {activeTab === 'logs' && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 text-xs space-y-3">
            <h2 className="text-base font-black text-zinc-900 font-heading">
              Administrative Audit Log (Section 40)
            </h2>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start justify-between">
                  <div>
                    <span className="font-mono font-bold text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded text-[10px]">
                      {log.action}
                    </span>
                    <span className="font-bold text-zinc-900 ml-2">{log.targetSummary}</span>
                    {log.notes && <p className="text-zinc-600 mt-1 italic">Note: {log.notes}</p>}
                  </div>
                  <div className="text-right text-zinc-400 text-[10px] font-mono shrink-0">
                    <div>{log.adminName}</div>
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: Platform Config (Section 11, 59: Configurable Listing Fee) */}
        {activeTab === 'config' && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 text-xs space-y-6 max-w-xl">
            <div>
              <h2 className="text-base font-black text-zinc-900 font-heading">
                Platform Pricing & Market Config
              </h2>
              <p className="text-zinc-500 mt-0.5">
                Configure monetization parameters dynamically without hard-coding $19.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Standard Listing Fee ($ USD)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={listingFeeInput}
                  onChange={(e) => setListingFeeInput(e.target.value)}
                  className="w-32 py-2 px-3 bg-zinc-50 border border-zinc-300 rounded-xl font-mono font-bold text-sm text-zinc-900"
                />
                <button
                  onClick={() => updatePlatformConfig({ standardListingFee: Number(listingFeeInput) })}
                  className="px-4 py-2 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-xl"
                >
                  Save Fee
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 space-y-2">
              <span className="block font-bold text-zinc-700">Market Settings</span>
              <p className="text-zinc-500">
                Default Region: <span className="font-bold text-zinc-900">{platformConfig.activeMarketCity}</span> (ZIP {platformConfig.activeMarketZip})
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: Production Slate & Demo Data Management */}
        {activeTab === 'data' && (
          <div className="space-y-6 max-w-3xl">
            {/* Status Card */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${isSeedDataEnabled ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-zinc-900 font-heading">
                        Database Environment Status
                      </h2>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          isSeedDataEnabled
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {isSeedDataEnabled ? 'Demo Mode Active' : 'Clean Production Slate'}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {isSeedDataEnabled
                        ? 'Currently populated with 10 sample Denver vehicles, test offers, and mock chat messages.'
                        : 'Pristine live marketplace mode. Zero demo listings or fake transactions.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isSeedDataEnabled ? (
                    <button
                      onClick={() => setPurgeConfirmModalOpen(true)}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Purge All Demo Data</span>
                    </button>
                  ) : (
                    <button
                      onClick={restoreDemoData}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer shrink-0"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Restore Demo Data</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Inventory Counts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[11px] font-bold uppercase text-zinc-400">Total Listings</div>
                  <div className="text-xl font-black text-zinc-900 font-mono-numbers mt-0.5">
                    {allListings.length}
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[11px] font-bold uppercase text-zinc-400">Active Published</div>
                  <div className="text-xl font-black text-emerald-600 font-mono-numbers mt-0.5">
                    {activeListings.length}
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[11px] font-bold uppercase text-zinc-400">Pending Review</div>
                  <div className="text-xl font-black text-amber-600 font-mono-numbers mt-0.5">
                    {pendingReviewListings.length}
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                  <div className="text-[11px] font-bold uppercase text-zinc-400">Open Reports</div>
                  <div className="text-xl font-black text-red-600 font-mono-numbers mt-0.5">
                    {pendingReports.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Production Architecture & Config Guide */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-base text-zinc-900 font-heading">
                  Production Deployment Configuration
                </h3>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed">
                When deploying MyNextWhip to Render, AWS, Vercel, or custom servers, you can permanently disable demo seed data by setting the environment variable:
              </p>

              <div className="p-3.5 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-xs overflow-x-auto border border-zinc-800">
                <code>VITE_ENABLE_SEED_DATA="false"</code>
              </div>

              <div className="text-xs text-zinc-500 space-y-1.5 pt-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Automatic Clean Boot:</strong> When set to false, new visitors and browser sessions start with zero demo records.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Customer Account Creation:</strong> Any registered user creates their own verified profile with their real name, phone, and ZIP code.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Instant Reversal:</strong> If you ever need to demonstrate features to stakeholders, you can re-load the 10 demo whips with a single click.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Purge Demo Data Confirmation Modal */}
      {purgeConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-zinc-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-zinc-900 font-heading">
                Purge All Demo Data?
              </h3>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                This will immediately remove all 10 seed vehicle listings, mock offers, appointments, conversations, and test transactions. Your application will enter a <strong>Clean Production Slate</strong> ready for real customer listings.
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] rounded-xl flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>You can restore sample test data at any time from this console or the header menu.</span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setPurgeConfirmModalOpen(false)}
                className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  purgeAllDemoData();
                  setPurgeConfirmModalOpen(false);
                }}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Purge All Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectReasonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 space-y-4">
            <h3 className="font-bold text-base text-zinc-900">Request Information / Reason</h3>
            <textarea
              rows={3}
              value={rejectReasonInput}
              onChange={(e) => setRejectReasonInput(e.target.value)}
              className="w-full p-2.5 bg-zinc-50 border border-zinc-300 rounded-xl text-xs text-zinc-900"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setRejectReasonModal(null)}
                className="flex-1 py-2 bg-zinc-100 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectReasonModal)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Send Request to Seller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
