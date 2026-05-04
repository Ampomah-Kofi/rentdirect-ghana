"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  Share2,
  CheckCircle,
  Copy,
  ArrowLeft,
  ShieldCheck,
  Home,
  Star,
} from "lucide-react";
import { getLandlordProfile } from "@/lib/mock-data";
import { useListings } from "@/components/providers/ListingsProvider";
import ListingCard from "@/components/ListingCard";
import Nav from "@/components/Nav";
import { LogoMark } from "@/components/Logo";

export default function LandlordProfilePage() {
  const params = useParams();
  const landlordId = params.id as string;
  const profile = getLandlordProfile(landlordId);
  const { listings } = useListings();
  const allListings = listings.filter((l) => l.landlord_id === landlordId);
  const liveListings = allListings.filter((l) => l.status === "live" && !l.is_hidden);

  const [copied, setCopied] = useState(false);

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <Home className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-[#64748B]">Landlord profile not found.</p>
          <Link href="/" className="text-brand font-medium underline text-sm">
            Browse all listings
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/landlord/${landlordId}`
      : `/landlord/${landlordId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const regions = Array.from(new Set(liveListings.map((l) => l.region)));

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Nav />

      {/* Back bar */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-14 z-40">
        <div className="max-w-4xl mx-auto px-4 h-11 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse
          </Link>
          <span className="text-[#E2E8F0]">|</span>
          <span className="text-xs text-[#94A3B8] truncate">Landlord Profile</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">

        {/* Profile hero card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
          {/* Teal header band - avatar sits inside it, no overflow-hidden needed */}
          <div className="h-28 bg-linear-to-br from-brand to-brand-dark rounded-t-2xl relative px-6 flex items-end pb-0">
            <div className="absolute inset-0 rounded-t-2xl opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />
            {/* Avatar anchored to bottom of band, sticks out below */}
            <div className="relative z-10 translate-y-8 w-16 h-16 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-brand">{profile.name.charAt(0)}</span>
            </div>
          </div>

          <div className="px-6 pt-10 pb-6">
            {/* Name row + verified badge */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-[#0F172A]">{profile.name}</h1>
                  <span className="text-[10px] font-bold text-brand border border-brand/40 bg-brand-light px-2 py-0.5 rounded tracking-wide">
                    [Property Owner]
                  </span>
                </div>
                <p className="text-sm text-[#64748B] mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {regions.length > 0 ? regions.join(" - ") : "Ghana"}
                </p>
              </div>
              <span className="flex items-center gap-1 bg-brand-light text-brand text-xs font-semibold px-3 py-1.5 rounded-full border border-green-200 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Owner
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 mt-5 pt-4 border-t border-[#E2E8F0]">
              <div>
                <p className="text-2xl font-bold text-brand">{liveListings.length}</p>
                <p className="text-xs text-[#64748B] font-medium">Active Listings</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{regions.length}</p>
                <p className="text-xs text-[#64748B] font-medium">Region{regions.length !== 1 ? "s" : ""}</p>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <p className="text-2xl font-bold text-[#0F172A]">4.8</p>
                </div>
                <p className="text-xs text-[#64748B] font-medium">Rating</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-2xl font-bold text-[#0F172A]">{allListings.length}</p>
                <p className="text-xs text-[#64748B] font-medium">Total Listed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Share portfolio card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <Share2 className="w-4 h-4 text-brand" />
            <h2 className="text-sm font-bold text-[#0F172A]">Share Your Portfolio</h2>
          </div>
          <p className="text-xs text-[#64748B] mb-3">
            Copy this link and send it to clients directly - they&apos;ll see all your active listings.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-surface border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs font-mono text-[#64748B] truncate">
              rentdirect.gh/landlord/{landlordId}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                copied
                  ? "bg-brand-light text-brand border-2 border-brand"
                  : "bg-brand text-white hover:bg-brand-hover"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Listings */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#0F172A]">
              Active Listings
              <span className="ml-2 text-sm font-normal text-[#64748B]">({liveListings.length})</span>
            </h2>
          </div>

          {liveListings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E2E8F0]">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Home className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-[#64748B] text-sm">No active listings at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {liveListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>

        {/* RentDirect footer branding */}
        <div className="flex items-center justify-center gap-2 py-4 text-[#94A3B8] text-xs">
          <LogoMark size={18} />
          <span>Powered by RentDirect Ghana</span>
        </div>
      </div>
    </div>
  );
}
