import React from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCard } from '../browse/VehicleCard';
import {
  User,
  ShieldCheck,
  CheckCircle2,
  Car,
  DollarSign,
  Calendar,
  MessageSquare,
  PlusCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    allListings,
    offers,
    appointments,
    navigateTo,
    switchUser,
    allUsers,
  } = useApp();

  const userListings = allListings.filter((l) => l.sellerId === currentUser.id);
  const userOffers = offers.filter(
    (o) => o.buyerId === currentUser.id || o.sellerId === currentUser.id
  );
  const userAppointments = appointments.filter(
    (a) => a.buyerId === currentUser.id || a.sellerId === currentUser.id
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top Banner */}
      <div className="bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-zinc-200 shadow-xs"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-zinc-900 font-heading">
                    {currentUser.name}
                  </h1>
                  {currentUser.verifiedSeller && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {currentUser.email} · {currentUser.city}, {currentUser.state}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-zinc-100 text-zinc-700 px-2 py-0.5 rounded border border-zinc-200">
                    Role: {currentUser.role}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>ID & Phone Verified</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => navigateTo('sell')}
                className="px-4 py-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List Another Whip ($19)</span>
              </button>
            </div>
          </div>

          {/* Test Persona quick switch */}
          <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center gap-2 flex-wrap text-xs">
            <span className="text-zinc-400 font-bold uppercase text-[10px]">Switch Test Persona:</span>
            {allUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer ${
                  currentUser.id === u.id
                    ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
                    : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                }`}
              >
                {u.name} ({u.role})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Your Whips for Sale */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-zinc-900 font-heading">
              Your Listings ({userListings.length})
            </h2>
            <button
              onClick={() => navigateTo('sell')}
              className="text-xs font-bold text-[#EA580C] hover:underline"
            >
              + Create New Listing
            </button>
          </div>

          {userListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userListings.map((listing) => (
                <div key={listing.id} className="relative">
                  <VehicleCard listing={listing} />
                  {/* Status chip over card */}
                  <div className="absolute top-2 left-2 z-10">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-xs ${
                        listing.status === 'ACTIVE'
                          ? 'bg-emerald-600 text-white'
                          : listing.status === 'PENDING_REVIEW'
                          ? 'bg-amber-600 text-white'
                          : 'bg-zinc-800 text-white'
                      }`}
                    >
                      Status: {listing.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center text-xs text-zinc-500">
              You haven't listed any vehicles yet. Click "List Another Whip" to start the 5-minute flow.
            </div>
          )}
        </div>

        {/* Activity Summary (Offers & Appointments) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Offers */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-900 font-heading">
                Recent Offers ({userOffers.length})
              </h3>
              <button
                onClick={() => navigateTo('messages')}
                className="text-xs font-bold text-[#EA580C] hover:underline"
              >
                View Messages
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {userOffers.map((o) => (
                <div
                  key={o.id}
                  className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-zinc-900">${o.amount.toLocaleString()}</span> on{' '}
                    <span className="font-medium text-zinc-700">{o.listingTitle}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      o.status === 'ACCEPTED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : o.status === 'REJECTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-900 font-heading">
                Upcoming Meetups & Inspections ({userAppointments.length})
              </h3>
              <button
                onClick={() => navigateTo('messages')}
                className="text-xs font-bold text-[#EA580C] hover:underline"
              >
                View Details
              </button>
            </div>
            <div className="space-y-2 text-xs">
              {userAppointments.map((a) => (
                <div
                  key={a.id}
                  className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-zinc-900">{a.date}</span> ({a.timeSlot})
                    <p className="text-[11px] text-zinc-500 truncate max-w-xs">{a.listingTitle}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {a.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
