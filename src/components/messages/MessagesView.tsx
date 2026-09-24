import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MessageSquare,
  Send,
  DollarSign,
  Calendar,
  ShieldCheck,
  Check,
  X,
  MapPin,
  Clock,
  ArrowLeft,
  AlertTriangle,
} from 'lucide-react';

export const MessagesView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    getConversationMessages,
    sendMessage,
    currentUser,
    offers,
    updateOfferStatus,
    appointments,
    updateAppointmentStatus,
    navigateTo,
  } = useApp();

  const [inputText, setInputText] = useState('');

  const activeConvo =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];
  const messages = activeConvo ? getConversationMessages(activeConvo.id) : [];

  // Associated offers and appointments for this listing
  const relatedOffers = activeConvo
    ? offers.filter((o) => o.listingId === activeConvo.listingId)
    : [];
  const relatedAppointments = activeConvo
    ? appointments.filter((a) => a.listingId === activeConvo.listingId)
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvo) return;
    sendMessage(activeConvo.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[650px]">
          {/* Left Column: Conversations List (4 cols) */}
          <div className="md:col-span-4 border-r border-zinc-200 flex flex-col bg-zinc-50">
            <div className="p-4 border-b border-zinc-200 bg-white">
              <h2 className="text-base font-black text-zinc-900 font-heading">
                Messages & Offers
              </h2>
              <p className="text-xs text-zinc-500">Listing-specific conversations</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-zinc-200">
              {conversations.map((convo) => {
                const isActive = activeConvo?.id === convo.id;
                return (
                  <button
                    key={convo.id}
                    onClick={() => setActiveConversationId(convo.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition cursor-pointer ${
                      isActive ? 'bg-white shadow-xs' : 'hover:bg-zinc-100/70'
                    }`}
                  >
                    <img
                      src={convo.listingImage}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-900 truncate">
                          {convo.listingTitle}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          ${convo.listingPrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#EA580C] mt-0.5 truncate">
                        {convo.buyerId === currentUser.id ? convo.sellerName : convo.buyerName}
                      </p>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                        {convo.lastMessage}
                      </p>
                    </div>
                  </button>
                );
              })}

              {conversations.length === 0 && (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No active conversations yet. Send a message on any vehicle detail page.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Chat Stream & Actions (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between bg-white">
            {activeConvo ? (
              <>
                {/* Chat Top Banner with listing context */}
                <div className="p-4 border-b border-zinc-200 bg-zinc-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeConvo.listingImage}
                      alt=""
                      className="w-10 h-10 rounded-xl object-cover border border-zinc-200"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-zinc-900 leading-tight">
                        {activeConvo.listingTitle}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span className="font-mono font-bold text-zinc-900">
                          ${activeConvo.listingPrice.toLocaleString()}
                        </span>
                        <span>·</span>
                        <button
                          onClick={() => navigateTo('detail', activeConvo.listingId)}
                          className="text-[#EA580C] font-semibold hover:underline"
                        >
                          View Listing
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Secure In-App Chat</span>
                  </div>
                </div>

                {/* Status Banners for Pending Offers or Appointments */}
                <div className="p-3 bg-zinc-50 border-b border-zinc-200 space-y-2">
                  {relatedOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="p-3 rounded-xl border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-orange-100 text-[#EA580C] rounded-lg">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-zinc-900">
                            Offer of ${offer.amount.toLocaleString()} from {offer.buyerName}
                          </div>
                          {offer.message && <div className="text-zinc-500">"{offer.message}"</div>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            offer.status === 'ACCEPTED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : offer.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {offer.status}
                        </span>

                        {offer.status === 'PENDING' && offer.sellerId === currentUser.id && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => updateOfferStatus(offer.id, 'ACCEPTED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateOfferStatus(offer.id, 'REJECTED')}
                              className="px-2.5 py-1 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold rounded-lg cursor-pointer"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {relatedAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-3 rounded-xl border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-2xs"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <div>
                          <span className="font-bold text-zinc-900">Inspection: {apt.date}</span> (
                          {apt.timeSlot})
                          <div className="text-[11px] text-zinc-500">{apt.safeMeetupNote}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full self-start sm:self-auto">
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Messages Stream */}
                <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[420px]">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-0.5 px-1">
                          <span>{msg.senderName}</span>
                          <span>·</span>
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div
                          className={`max-w-md p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-[#12151A] text-white rounded-br-xs'
                              : 'bg-zinc-100 text-zinc-900 rounded-bl-xs'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Safety Warning micro bar */}
                <div className="px-4 py-1.5 bg-amber-50 text-amber-900 text-[10px] border-t border-amber-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Never send wire transfers or peer-to-peer deposits before inspecting the vehicle in person.</span>
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSend}
                  className="p-3 border-t border-zinc-200 bg-white flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 py-2.5 px-3 bg-zinc-50 border border-zinc-300 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-[#EA580C]"
                  />
                  <button
                    type="submit"
                    className="p-2.5 bg-[#EA580C] hover:bg-[#C2410C] text-white rounded-xl transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-zinc-400 text-xs">
                Select a conversation on the left to view messages.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
