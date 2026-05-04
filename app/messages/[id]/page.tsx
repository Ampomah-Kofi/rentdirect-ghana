"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Send, Phone, Home, CheckCheck, Check,
} from "lucide-react";
import {
  getConversationById,
  getMessagesByConversation,
  getListingById,
} from "@/lib/mock-data";
import type { ChatMessage } from "@/lib/types";
import Nav from "@/components/Nav";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-GH", { weekday: "long", day: "numeric", month: "short" });
}

export default function ChatThreadPage() {
  const { id } = useParams<{ id: string }>();
  const conv = getConversationById(id);
  const listing = conv ? getListingById(conv.listing_id) : null;

  const initialMessages = getMessagesByConversation(id).map((m) => ({ ...m, read: true }));
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!conv) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-[#64748B]">Conversation not found.</p>
          <Link href="/messages" className="text-brand font-medium underline text-sm">Back to inbox</Link>
        </div>
      </div>
    );
  }

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: `msg-new-${Date.now()}`,
      conversation_id: id,
      sender: "landlord",
      text,
      sent_at: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, msg]);
    setDraft("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  // Group messages by date
  const groups: { label: string; msgs: ChatMessage[] }[] = [];
  for (const msg of messages) {
    const label = formatDateLabel(msg.sent_at);
    const last = groups[groups.length - 1];
    if (last?.label === label) last.msgs.push(msg);
    else groups.push({ label, msgs: [msg] });
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Nav />

      {/* Chat header */}
      <div className="bg-[#FFF8EA]/92 border-b border-black/5 sticky top-17 z-40 shadow-sm backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link
            href="/messages"
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          {/* Tenant avatar */}
          <div className="w-9 h-9 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shrink-0">
            {conv.tenant_name.charAt(0)}
          </div>

          {/* Tenant info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-[#0F172A] text-sm leading-tight">{conv.tenant_name}</p>
            {listing && (
              <p className="text-xs text-[#94A3B8] flex items-center gap-1 truncate">
                <Home className="w-3 h-3 shrink-0" />
                <Link href={`/listings/${listing.id}`} className="hover:text-brand truncate">
                  {listing.title}
                </Link>
              </p>
            )}
          </div>

          {/* Call button */}
          <a
            href={`tel:${conv.tenant_phone}`}
            className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-xl px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand-light transition-colors shrink-0"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </a>
        </div>

        {/* Listing preview strip */}
        {listing && (
          <div className="max-w-2xl mx-auto px-4 pb-2">
            <Link
              href={`/listings/${listing.id}`}
              className="flex items-center gap-2 rd-card rounded-xl px-3 py-2 hover:bg-green-100 transition-colors"
            >
              {listing.photos[0] && (
                <img src={listing.photos[0]} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-brand truncate">{listing.title}</p>
                <p className="text-[10px] text-[#64748B]">GHS {listing.price_per_month.toLocaleString()}/mo - {listing.location}</p>
              </div>
              <span className="text-xs text-brand font-medium shrink-0">View</span>
            </Link>
          </div>
        )}
      </div>

      {/* Message thread */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-4 space-y-6 pb-32">
        {groups.map((group) => (
          <div key={group.label}>
            {/* Date divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#E2E8F0]" />
              <span className="text-xs text-[#94A3B8] font-medium px-2">{group.label}</span>
              <div className="flex-1 h-px bg-[#E2E8F0]" />
            </div>

            <div className="space-y-1.5">
              {group.msgs.map((msg) => {
                const isLandlord = msg.sender === "landlord";
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isLandlord ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[78%] ${isLandlord ? "items-end" : "items-start"} flex flex-col`}>
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                          isLandlord
                            ? "bg-brand text-white rounded-br-sm shadow-lg shadow-brand/20"
                            : "bg-white/88 text-[#101A18] border border-black/5 rounded-bl-sm shadow-sm"
                        }`}
                      >
                        {msg.text}
                      </div>
                      <div className={`flex items-center gap-1 mt-0.5 px-1 ${isLandlord ? "flex-row-reverse" : ""}`}>
                        <span className="text-[10px] text-[#94A3B8]">{formatTime(msg.sent_at)}</span>
                        {isLandlord && (
                          msg.read
                            ? <CheckCheck className="w-3 h-3 text-brand" />
                            : <Check className="w-3 h-3 text-[#94A3B8]" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Compose bar - fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/92 backdrop-blur-xl border-t border-black/5 shadow-[0_-14px_40px_rgba(16,26,24,0.12)] px-4 py-3 z-40">
        <div className="max-w-2xl mx-auto flex items-end gap-3">
          {/* Quick replies */}
          <div className="flex-1 space-y-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {["Is it still available?", "Can I view it?", "What's included?"].map((q) => (
                <button
                  key={q}
                  onClick={() => setDraft(q)}
                  className="shrink-0 text-xs bg-surface border border-[#E2E8F0] rounded-full px-3 py-1.5 text-[#64748B] hover:border-brand hover:text-brand transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2 border-2 border-[#E2E8F0] rounded-2xl px-3 py-2 focus-within:border-brand transition-colors bg-white">
              <textarea
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message"
                className="flex-1 resize-none text-sm outline-none bg-transparent placeholder-[#CBD5E1] max-h-28"
                style={{ fieldSizing: "content" } as React.CSSProperties}
              />
            </div>
          </div>

          <button
            onClick={sendMessage}
            disabled={!draft.trim()}
            className="w-11 h-11 rd-button-primary rounded-2xl flex items-center justify-center disabled:opacity-40 hover:bg-brand-hover transition-colors shrink-0 mb-0.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}




