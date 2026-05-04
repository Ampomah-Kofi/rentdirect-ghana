"use client";

import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getConversationsByLandlord, getListingById } from "@/lib/mock-data";
import { MessageCircle, Home } from "lucide-react";

const LANDLORD_ID = "user-101";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function MessagesInboxPage() {
  const conversations = getConversationsByLandlord(LANDLORD_ID);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Nav />

      {/* Header */}
      <div
        className="relative text-white py-10 px-4 overflow-hidden rd-grain"
        style={{ background: "linear-gradient(135deg, #101A18 0%, #073B2D 55%, #0B6B4B 100%)" }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[#F2B84B] text-xs font-black tracking-[0.18em] uppercase mb-1">RentDirect - Messages</p>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black">Inbox</h1>
              {totalUnread > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalUnread} new
                </span>
              )}
            </div>
            <p className="text-green-200 text-sm mt-1">Tenant enquiries about your listings</p>
          </div>
          <MessageCircle className="w-8 h-8 text-green-300 opacity-60" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex-1">
        {conversations.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-[#64748B] font-medium">No messages yet.</p>
            <p className="text-sm text-[#94A3B8]">When tenants enquire about your listings, their messages will appear here.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => {
              const listing = getListingById(conv.listing_id);
              const hasUnread = conv.unread_count > 0;
              return (
                <Link
                  key={conv.id}
                  href={`/messages/${conv.id}`}
                  className={`flex items-center gap-4 p-4 rounded-[1.35rem] border transition-all hover:shadow-[0_18px_48px_rgba(16,26,24,0.12)] hover:-translate-y-0.5 ${
                    hasUnread
                      ? "rd-card border-brand/30 shadow-sm"
                      : "rd-card"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shrink-0 ${
                    hasUnread ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-gray-100 text-[#64748B]"
                  }`}>
                    {conv.tenant_name.charAt(0)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm truncate ${hasUnread ? "font-bold text-[#0F172A]" : "font-semibold text-[#0F172A]"}`}>
                        {conv.tenant_name}
                      </p>
                      <span className="text-xs text-[#94A3B8] shrink-0">{timeAgo(conv.last_message_at)}</span>
                    </div>
                    <p className="text-xs text-[#64748B] truncate mt-0.5 flex items-center gap-1">
                      <Home className="w-3 h-3 shrink-0" />
                      {listing?.title ?? conv.listing_id}
                    </p>
                    <p className={`text-sm truncate mt-0.5 ${hasUnread ? "text-[#0F172A] font-medium" : "text-[#94A3B8]"}`}>
                      {conv.last_message}
                    </p>
                  </div>

                  {/* Unread badge */}
                  {hasUnread && (
                    <span className="w-6 h-6 bg-brand text-white shadow-lg shadow-brand/20 text-xs font-bold rounded-full flex items-center justify-center shrink-0">
                      {conv.unread_count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

